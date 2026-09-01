import cron from 'node-cron';
import Decimal from 'decimal.js';
import prisma from '../config/prisma.js';
import { generateDepartmentPrediction } from './budget-prediction-service.js';
import crypto from 'crypto';
import { sendBudgetWorkflowEmail } from './notification-service.js';

async function sendNotification(payload) {
  await prisma.notification.create({
    data: {
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'INFO',
      refType: payload.refType,
      refId: payload.refId,
    }
  });
}

async function notifyDepartmentHeads(dept, title, message, type, refType, refId, email = null) {
  const heads = await prisma.user.findMany({
    where: {
      OR: [
        { department: { equals: dept.code, mode: 'insensitive' } },
        { department: { equals: dept.name, mode: 'insensitive' } }
      ],
      role: { in: ['Department Executive', 'Manager'] },
      isActive: true
    }
  });
  await Promise.all(heads.map(async (head) => {
    try {
      await Promise.all([
        sendNotification({ userId: head.id, title, message, type, refType, refId: String(refId) }),
        email && head.email ? sendBudgetWorkflowEmail({ to: head.email, ...email }) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('[Budget Scheduler] Department notification failed', { userId: head.id, error: error.message });
    }
  }));
}

let schedulerTask = null;
let deadlineTask = null;
const CRON_SCHEDULE = process.env.BUDGET_PREDICTION_CRON || '0 0 28 * *';
// Cron evaluates schedules in the host timezone by default. Keep budget
// periods aligned with the business timezone even when the server runs in UTC.
const SCHEDULER_TIMEZONE = process.env.BUDGET_SCHEDULER_TIMEZONE || 'Asia/Kuala_Lumpur';

function getSchedulerDateParts(now) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULER_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day)
  };
}

async function runMonthlyPredictions() {
  const requestId = crypto.randomUUID();
  console.log('[Budget Scheduler] Starting monthly predictions...', { requestId, timestamp: new Date().toISOString() });

  const departments = await prisma.department.findMany({
    where: { isActive: true }
  });

  const { year: currentYear, month: currentMonth } = getSchedulerDateParts(new Date());
  const targetYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  const targetMonth = currentMonth === 12 ? 1 : currentMonth + 1;

  let success = 0;
  let failed = 0;

  for (const dept of departments) {
    try {
      const prediction = await generateDepartmentPrediction(
        dept.code,
        targetYear,
        targetMonth,
        null
      );

      const amount = new Decimal(prediction.predictedAmount).toFixed(2);
      await notifyDepartmentHeads(
        dept,
        'New Budget Prediction Available',
        `AI has generated budget prediction for ${dept.name} for ${targetYear}-${String(targetMonth).padStart(2, '0')}: $${amount}. Review and submit your proposed budget before month end.`,
        'BUDGET_PREDICTION_READY',
        'budget_prediction',
        prediction.id,
        {
          subject: `OptiMind - AI Budget Prediction Ready (${targetYear}-${String(targetMonth).padStart(2, '0')})`,
          title: 'AI Budget Prediction Ready',
          intro: `A new AI budget prediction is ready for ${dept.name}.`,
          rows: [
            ['Department', dept.name],
            ['Target period', `${targetYear}-${String(targetMonth).padStart(2, '0')}`],
            ['AI suggested budget', `RM ${new Decimal(prediction.predictedAmount).toFixed(2)}`],
          ],
          action: 'Sign in to OptiMind, review the prediction, and submit the proposed budget before month end.'
        }
      );

      success++;
    } catch (error) {
      console.error('[Budget Scheduler]', {
        operation: 'generateDepartmentPrediction',
        requestId,
        departmentCode: dept.code,
        departmentName: dept.name,
        targetYear,
        targetMonth,
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
      });
      failed++;
    }
  }

  console.log('[Budget Scheduler] Completed', { requestId, success, failed, timestamp: new Date().toISOString() });

  return { success, failed };
}

async function runBudgetDeadlineChecks(now = new Date()) {
  const { year: currentYear, month: currentMonth, day: currentDay } = getSchedulerDateParts(now);
  const isFirstDay = currentDay === 1;
  const lastDay = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
  const isLastDay = currentDay === lastDay;
  if (!isFirstDay && !isLastDay) return { reminded: 0, autoCreated: 0 };

  const departments = await prisma.department.findMany({ where: { isActive: true } });
  let reminded = 0;
  let autoCreated = 0;
  const targetYear = isLastDay ? (currentMonth === 12 ? currentYear + 1 : currentYear) : currentYear;
  const targetMonth = isLastDay ? (currentMonth === 12 ? 1 : currentMonth + 1) : currentMonth;

  for (const dept of departments) {
    const activeSubmission = await prisma.budgetAdjustmentRequest.findFirst({
      where: { departmentId: dept.id, targetYear, targetMonth, requestType: 'next_month_submission', status: { in: ['pending', 'approved'] } },
      orderBy: { requestedAt: 'desc' }
    });

    if (isLastDay && !activeSubmission) {
      const reminderRef = `${dept.id}-${targetYear}-${targetMonth}-${currentYear}-${currentMonth}`;
      const alreadySent = await prisma.notification.findFirst({ where: { refType: 'budget_submission_reminder', refId: reminderRef } });
      if (!alreadySent) {
        await notifyDepartmentHeads(
          dept,
          'Next Month Budget Submission Reminder',
          `Please submit the proposed budget for ${dept.name} for ${targetYear}-${String(targetMonth).padStart(2, '0')} before today ends. If no submission is received, the system will use the AI prediction on the first day of the month.`,
          'BUDGET_SUBMISSION_REMINDER',
          'budget_submission_reminder',
          reminderRef,
          {
            subject: `OptiMind - Budget Submission Reminder (${targetYear}-${String(targetMonth).padStart(2, '0')})`,
            title: 'Next Month Budget Submission Reminder',
            intro: `No proposed budget has been submitted yet for ${dept.name}.`,
            rows: [
              ['Department', dept.name],
              ['Target period', `${targetYear}-${String(targetMonth).padStart(2, '0')}`],
              ['Deadline', 'Today, before month end'],
            ],
            action: 'Sign in to OptiMind and submit the proposed budget. Without a submission, the AI suggested amount will be used automatically on the first day of next month.'
          }
        );
        reminded++;
      }
    }

    if (isFirstDay && !activeSubmission) {
      const existingBudget = await prisma.monthlyBudget.findUnique({ where: { departmentId_year_month: { departmentId: dept.id, year: currentYear, month: currentMonth } } });
      const prediction = await prisma.budgetPrediction.findFirst({ where: { departmentId: dept.id, targetYear: currentYear, targetMonth: currentMonth }, orderBy: { createdAt: 'desc' } });
      if (!existingBudget && prediction) {
        const budget = await prisma.monthlyBudget.create({
          data: {
            departmentId: dept.id,
            year: currentYear,
            month: currentMonth,
            allocatedAmount: prediction.predictedAmount,
            spentAmount: 0,
            updatedAt: new Date(),
            reservedAmount: 0,
            notes: `Auto-generated from AI prediction #${prediction.id}`
          }
        });
        await notifyDepartmentHeads(
          dept,
          'Budget Auto-generated from AI Prediction',
          `No budget submission was received for ${dept.name}. The system allocated $${new Decimal(prediction.predictedAmount).toFixed(2)} for ${currentYear}-${String(currentMonth).padStart(2, '0')} based on the AI prediction.`,
          'BUDGET_AUTO_GENERATED',
          'monthly_budget',
          budget.id,
          {
            subject: `OptiMind - Budget Auto-generated (${currentYear}-${String(currentMonth).padStart(2, '0')})`,
            title: 'Budget Auto-generated from AI Prediction',
            intro: `No proposed budget was submitted for ${dept.name}, so the system has set this month's budget from the AI prediction.`,
            rows: [
              ['Department', dept.name],
              ['Budget period', `${currentYear}-${String(currentMonth).padStart(2, '0')}`],
              ['Allocated budget', `RM ${new Decimal(prediction.predictedAmount).toFixed(2)}`],
            ],
            action: 'Sign in to OptiMind to review this budget. Submit a current-month adjustment request only if a further change is required.'
          }
        );
        autoCreated++;
      }
    }
  }
  return { reminded, autoCreated };
}

function startScheduler() {
  if (schedulerTask) {
    console.log('[Budget Scheduler] Already running');
    return;
  }

  schedulerTask = cron.schedule(CRON_SCHEDULE, async () => {
    console.log('[Budget Scheduler] Triggered by cron');
    await runMonthlyPredictions();
  }, { timezone: SCHEDULER_TIMEZONE });

  // Deadline checks run daily so month-end reminders and first-day fallback
  // still work even when the prediction cron is overridden.
  deadlineTask = cron.schedule('0 9 * * *', async () => {
    try {
      await runBudgetDeadlineChecks();
    } catch (error) {
      console.error('[Budget Scheduler] Deadline check failed', error);
    }
  }, { timezone: SCHEDULER_TIMEZONE });

  console.log(`[Budget Scheduler] Started with schedule: ${CRON_SCHEDULE}; deadline timezone: ${SCHEDULER_TIMEZONE}`);

  // Do not wait for the next 09:00 tick. This catches up first-day/month-end
  // work when the API is started or restarted after the scheduled time.
  void runBudgetDeadlineChecks()
    .then((result) => {
      if (result.reminded || result.autoCreated) {
        console.log('[Budget Scheduler] Startup deadline check completed', result);
      }
    })
    .catch((error) => console.error('[Budget Scheduler] Startup deadline check failed', error));
}

function stopScheduler() {
  if (schedulerTask) {
    schedulerTask.stop();
    schedulerTask = null;
    console.log('[Budget Scheduler] Stopped');
  }
  if (deadlineTask) {
    deadlineTask.stop();
    deadlineTask = null;
  }
}

export {
  startScheduler,
  stopScheduler,
  runMonthlyPredictions,
  runBudgetDeadlineChecks
};
