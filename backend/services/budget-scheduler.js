import cron from 'node-cron';
import prisma from '../config/prisma.js';
import { generateDepartmentPrediction } from './budget-prediction-service.js';

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
  console.log('[Budget Scheduler] Starting monthly predictions...');

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

      const deptHeads = await prisma.user.findMany({
        where: {
          department: { in: [dept.code, dept.name], mode: 'insensitive' },
          role: 'Department Executive'
        }
      });

      for (const head of deptHeads) {
        await sendNotification({
          userId: head.id,
          type: 'BUDGET_PREDICTION_READY',
          title: 'New Budget Prediction Available',
          message: `AI has generated budget prediction for ${dept.name} for ${targetYear}-${String(targetMonth).padStart(2, '0')}: $${prediction.predictedAmount.toFixed(2)}`,
          refType: 'budget_prediction',
          refId: String(prediction.id)
        });
      }

      success++;
    } catch (error) {
      console.error(`[Budget Scheduler] Failed for ${dept.code}:`, error);
      failed++;
    }
  }

  console.log(`[Budget Scheduler] Completed: ${success} success, ${failed} failed`);

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
