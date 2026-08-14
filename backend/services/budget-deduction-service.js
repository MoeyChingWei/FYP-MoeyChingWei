import prisma from '../config/prisma.js';
import { notifyBudgetThreshold, notifyBudgetExceeded } from './notification-service.js';

function isApprovedStatus(status) {
  return String(status ?? "").trim().toUpperCase() === "APPROVED";
}

function calculatePRTotal(payload) {
  const items = Array.isArray(payload?.lineItems) ? payload.lineItems : (Array.isArray(payload?.items) ? payload.items : []);
  return items.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return sum + quantity * unitPrice;
  }, 0);
}

export async function deductBudgetForPR(prPayload) {
  if (!isApprovedStatus(prPayload?.status)) {
    return { success: false, reason: 'PR not approved' };
  }

  const requestedBy = prPayload.requestedBy;
  if (!requestedBy) {
    return { success: false, reason: 'No requestedBy user ID' };
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(requestedBy) },
    select: { department: true }
  });

  if (!user || !user.department) {
    return { success: false, reason: 'No department assigned to user' };
  }

  const department = await prisma.department.findFirst({
    where: {
      OR: [
        { code: { equals: user.department, mode: 'insensitive' } },
        { name: { equals: user.department, mode: 'insensitive' } }
      ]
    }
  });

  if (!department) {
    return { success: false, reason: `Department "${user.department}" not found in Department table` };
  }

  const prDate = new Date(prPayload.createdAt);
  const year = prDate.getFullYear();
  const month = prDate.getMonth() + 1;

  const budget = await prisma.monthlyBudget.findUnique({
    where: {
      departmentId_year_month: {
        departmentId: department.id,
        year,
        month
      }
    }
  });

  if (!budget) {
    return { success: false, reason: `No budget found for ${department.name} ${year}-${month}` };
  }

  const amount = calculatePRTotal(prPayload);

  const updatedBudget = await prisma.monthlyBudget.update({
    where: { id: budget.id },
    data: {
      spentAmount: {
        increment: amount
      }
    }
  });

  const warnings = await checkBudgetThresholds(budget.id);

  return {
    success: true,
    deductedAmount: amount,
    budgetId: budget.id,
    warnings
  };
}

export async function checkBudgetThresholds(budgetId) {
  const budget = await prisma.monthlyBudget.findUnique({
    where: { id: budgetId },
    include: { department: true }
  });

  if (!budget) return [];

  const spent = parseFloat(budget.spentAmount);
  const allocated = parseFloat(budget.allocatedAmount);
  const percentage = (spent / allocated) * 100;

  const warnings = [];

  const thresholdRecord = await prisma.$queryRaw`
    SELECT "lastNotifiedThreshold" FROM "monthly_budgets" WHERE id = ${budgetId}
  `;
  const lastThreshold = thresholdRecord[0]?.lastNotifiedThreshold || 0;

  if (percentage >= 100 && lastThreshold < 100) {
    const deptUsers = await prisma.user.findMany({
      where: {
        OR: [
          { department: { equals: budget.department.code, mode: 'insensitive' } },
          { department: { equals: budget.department.name, mode: 'insensitive' } }
        ],
        role: 'Department Executive',
        isActive: true
      }
    });

    for (const user of deptUsers) {
      await notifyBudgetExceeded(
        user.id,
        budget.department.name,
        budget.year,
        budget.month,
        Math.round(percentage),
        spent,
        allocated,
        budgetId
      );
    }

    await prisma.$executeRaw`
      UPDATE "monthly_budgets" SET "lastNotifiedThreshold" = 100 WHERE id = ${budgetId}
    `;

    warnings.push({ threshold: 100, percentage });
  } else if (percentage >= 80 && lastThreshold < 80) {
    const deptUsers = await prisma.user.findMany({
      where: {
        OR: [
          { department: { equals: budget.department.code, mode: 'insensitive' } },
          { department: { equals: budget.department.name, mode: 'insensitive' } }
        ],
        role: 'Department Executive',
        isActive: true
      }
    });

    for (const user of deptUsers) {
      await notifyBudgetThreshold(
        user.id,
        budget.department.name,
        budget.year,
        budget.month,
        80,
        spent,
        allocated,
        budgetId
      );
    }

    await prisma.$executeRaw`
      UPDATE "monthly_budgets" SET "lastNotifiedThreshold" = 80 WHERE id = ${budgetId}
    `;

    warnings.push({ threshold: 80, percentage });
  }

  return warnings;
}
