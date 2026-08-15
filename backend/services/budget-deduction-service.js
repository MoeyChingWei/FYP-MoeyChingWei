import prisma from '../config/prisma.js';
import { notifyBudgetThreshold, notifyBudgetExceeded } from './notification-service.js';
import Decimal from 'decimal.js';

function isApprovedStatus(status) {
  return String(status ?? "").trim().toUpperCase() === "APPROVED";
}

function calculatePRTotal(payload) {
  const items = Array.isArray(payload?.lineItems) ? payload.lineItems : (Array.isArray(payload?.items) ? payload.items : []);
  return items.reduce((sum, item) => {
    const quantity = new Decimal(item.quantity || 0);
    const unitPrice = new Decimal(item.unitPrice || 0);
    return sum.plus(quantity.times(unitPrice));
  }, new Decimal(0));
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

  const result = await prisma.$transaction(async (tx) => {
    const updatedBudget = await tx.monthlyBudget.update({
      where: { id: budget.id },
      data: {
        spentAmount: {
          increment: amount.toNumber()
        }
      }
    });

    const warnings = await checkBudgetThresholds(budget.id, tx);

    return { updatedBudget, warnings };
  });

  return {
    success: true,
    deductedAmount: amount.toNumber(),
    budgetId: budget.id,
    warnings: result.warnings
  };
}

async function getDepartmentExecutives(department) {
  return await prisma.user.findMany({
    where: {
      OR: [
        { department: { equals: department.code, mode: 'insensitive' } },
        { department: { equals: department.name, mode: 'insensitive' } }
      ],
      role: 'Department Executive',
      isActive: true
    }
  });
}

export async function checkBudgetThresholds(budgetId, tx = prisma) {
  const budget = await tx.monthlyBudget.findUnique({
    where: { id: budgetId },
    include: { department: true }
  });

  if (!budget) return [];

  const spent = new Decimal(budget.spentAmount);
  const allocated = new Decimal(budget.allocatedAmount);
  const percentage = spent.dividedBy(allocated).times(100).toNumber();

  const warnings = [];

  const existingBudget = await tx.monthlyBudget.findUnique({
    where: { id: budgetId },
    select: { lastNotifiedThreshold: true }
  });
  const lastThreshold = existingBudget?.lastNotifiedThreshold || 0;

  if (percentage >= 100 && lastThreshold < 100) {
    const deptUsers = await getDepartmentExecutives(budget.department);

    await Promise.all(
      deptUsers.map(user =>
        notifyBudgetExceeded(
          user.id,
          budget.department.name,
          budget.year,
          budget.month,
          Math.round(percentage),
          spent.toNumber(),
          allocated.toNumber(),
          budgetId
        ).catch(err => {
          console.error(`Failed to notify user ${user.id} of budget exceeded:`, err);
          // Don't fail the transaction if notification fails
        })
      )
    );

    await tx.monthlyBudget.update({
      where: { id: budgetId },
      data: { lastNotifiedThreshold: 100 }
    });

    warnings.push({ threshold: 100, percentage });
  } else if (percentage >= 80 && lastThreshold < 80) {
    const deptUsers = await getDepartmentExecutives(budget.department);

    await Promise.all(
      deptUsers.map(user =>
        notifyBudgetThreshold(
          user.id,
          budget.department.name,
          budget.year,
          budget.month,
          80,
          spent.toNumber(),
          allocated.toNumber(),
          budgetId
        ).catch(err => {
          console.error(`Failed to notify user ${user.id} of budget threshold:`, err);
          // Don't fail the transaction if notification fails
        })
      )
    );

    await tx.monthlyBudget.update({
      where: { id: budgetId },
      data: { lastNotifiedThreshold: 80 }
    });

    warnings.push({ threshold: 80, percentage });
  }

  return warnings;
}
