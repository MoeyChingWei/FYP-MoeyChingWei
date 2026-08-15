import cron from 'node-cron';
import Decimal from 'decimal.js';
import prisma from '../config/prisma.js';
import { generateDepartmentPrediction } from './budget-prediction-service.js';
import crypto from 'crypto';

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

let schedulerTask = null;
const CRON_SCHEDULE = process.env.BUDGET_PREDICTION_CRON || '0 0 28 * *';

async function runMonthlyPredictions() {
  const requestId = crypto.randomUUID();
  console.log('[Budget Scheduler] Starting monthly predictions...', { requestId, timestamp: new Date().toISOString() });

  const departments = await prisma.department.findMany({
    where: { isActive: true }
  });

  const now = new Date();
  const targetYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const targetMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;

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

      // Notify department heads
      // NOTE: User.department field contains the department code as a string reference
      const deptHeads = await prisma.user.findMany({
        where: {
          OR: [
            { department: { equals: dept.code, mode: 'insensitive' } },
            { department: { equals: dept.name, mode: 'insensitive' } }
          ],
          role: 'Department Executive',
          isActive: true
        }
      });

      // Separate error handling for notifications - don't fail the department if notifications fail
      for (const head of deptHeads) {
        try {
          const amount = new Decimal(prediction.predictedAmount).toFixed(2);
          await sendNotification({
            userId: head.id,
            type: 'BUDGET_PREDICTION_READY',
            title: 'New Budget Prediction Available',
            message: `AI has generated budget prediction for ${dept.name} for ${targetYear}-${String(targetMonth).padStart(2, '0')}: $${amount}`,
            refType: 'budget_prediction',
            refId: String(prediction.id)
          });
        } catch (notifError) {
          console.error('[Budget Scheduler]', {
            operation: 'sendNotification',
            requestId,
            userId: head.id,
            departmentCode: dept.code,
            timestamp: new Date().toISOString(),
            error: notifError.message,
            stack: notifError.stack
          });
        }
      }

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

function startScheduler() {
  if (schedulerTask) {
    console.log('[Budget Scheduler] Already running');
    return;
  }

  schedulerTask = cron.schedule(CRON_SCHEDULE, async () => {
    console.log('[Budget Scheduler] Triggered by cron');
    await runMonthlyPredictions();
  });

  console.log(`[Budget Scheduler] Started with schedule: ${CRON_SCHEDULE}`);
}

function stopScheduler() {
  if (schedulerTask) {
    schedulerTask.stop();
    schedulerTask = null;
    console.log('[Budget Scheduler] Stopped');
  }
}

export {
  startScheduler,
  stopScheduler,
  runMonthlyPredictions
};
