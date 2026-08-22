import prisma from '../config/prisma.js';
import { notifyBudgetThreshold, notifyBudgetExceeded } from './notification-service.js';
import Decimal from 'decimal.js';
import crypto from 'crypto';

function isApprovedStatus(status) {
  return String(status ?? "").trim().toUpperCase() === "APPROVED";
}

function isSubmittedStatus(status) {
  return String(status ?? "").trim().toUpperCase() === "SUBMITTED";
}

function isRejectedStatus(status) {
  return String(status ?? "").trim().toUpperCase() === "REJECTED";
}

function calculatePRTotal(payload) {
  const items = Array.isArray(payload?.lineItems) ? payload.lineItems : (Array.isArray(payload?.items) ? payload.items : []);
  return items.reduce((sum, item) => {
    const quantity = new Decimal(item.quantity || 0);
    const unitPrice = new Decimal(item.unitPrice || 0);
    // Purchase requests already calculate the tax-inclusive line total. Use it
    // when available so budget usage matches the amount shown in the UI.
    const lineTotal = item.amountAfterTax ?? item.totalAmount;
    return sum.plus(lineTotal != null ? new Decimal(lineTotal) : quantity.times(unitPrice));
  }, new Decimal(0));
}

function getRequestDate(payload) {
  return payload?.createdAt || payload?.requestDate || payload?.createdDate;
}

async function resolveBudgetContext(payload) {
  const requestedBy = payload?.requestedBy ?? payload?.createdByUserId ?? payload?.userId;
  const user = requestedBy
    ? await prisma.user.findUnique({
        where: { id: parseInt(requestedBy) },
        select: { department: true },
      })
    : null;
  const departmentValue = user?.department || payload?.department;

  if (!departmentValue) {
    return { error: 'No department assigned to user' };
  }

  const department = await prisma.department.findFirst({
    where: {
      OR: [
        { code: { equals: departmentValue, mode: 'insensitive' } },
        { name: { equals: departmentValue, mode: 'insensitive' } },
      ],
    },
  });
  if (!department) {
    return { error: `Department "${departmentValue}" not found in Department table` };
  }

  const dateValue = getRequestDate(payload);
  const requestDate = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(requestDate.getTime())) {
    return { error: 'Purchase request date is invalid' };
  }

  const budget = await prisma.monthlyBudget.findUnique({
    where: {
      departmentId_year_month: {
        departmentId: department.id,
        year: requestDate.getFullYear(),
        month: requestDate.getMonth() + 1,
      },
    },
  });
  if (!budget) {
    return { error: `No budget found for ${department.name} ${requestDate.getFullYear()}-${requestDate.getMonth() + 1}` };
  }

  return { requestedBy, department, budget };
}

export async function deductBudgetForPR(prPayload) {
  const requestId = crypto.randomUUID();

  try {
    if (!isApprovedStatus(prPayload?.status)) {
      return { success: false, reason: 'PR not approved' };
    }

    if (prPayload?.budgetDeductedAt) {
      return {
        success: true,
        alreadyProcessed: true,
        deductedAmount: calculatePRTotal(prPayload).toNumber(),
        warnings: [],
      };
    }

    const context = await resolveBudgetContext(prPayload);
    if (context.error) return { success: false, reason: context.error };
    const { budget } = context;

    // Approval screens can be revisited or submitted twice. A persisted marker
    // makes the operation idempotent without changing the existing schema.
    if (prPayload.localId) {
      const existing = await prisma.purchaseRequestRecord.findUnique({
        where: { localId: prPayload.localId },
        select: { payload: true },
      });
      if (existing?.payload?.budgetDeductedAt) {
        return {
          success: true,
          alreadyProcessed: true,
          deductedAmount: calculatePRTotal(prPayload).toNumber(),
          budgetId: budget.id,
          warnings: [],
        };
      }
    }

    const amount = calculatePRTotal(prPayload);

    const result = await prisma.$transaction(async (tx) => {
      const currentBudget = await tx.monthlyBudget.findUnique({
        where: { id: budget.id },
      });
      if (!currentBudget) throw new Error('Budget not found');

      const reserved = new Decimal(currentBudget.reservedAmount);
      const reservedToRelease = Decimal.min(reserved, amount);
      const updatedBudget = await tx.monthlyBudget.update({
        where: { id: budget.id },
        data: {
          spentAmount: { increment: amount.toNumber() },
          reservedAmount: { decrement: reservedToRelease.toNumber() },
        }
      });

      const warnings = await checkBudgetThresholds(budget.id, tx);

      if (prPayload.localId) {
        const record = await tx.purchase_request_records.findUnique({
          where: { localId: prPayload.localId },
          select: { payload: true },
        });
        if (record) {
          await tx.purchase_request_records.update({
            where: { localId: prPayload.localId },
            data: {
              payload: {
                ...(record.payload && typeof record.payload === 'object' ? record.payload : {}),
                budgetDeductedAt: new Date().toISOString(),
              },
            },
          });
        }
      }

      return { updatedBudget, warnings };
    });

    return {
      success: true,
      deductedAmount: amount.toNumber(),
      budgetId: budget.id,
      warnings: result.warnings
    };
  } catch (error) {
    console.error('[BudgetDeduction]', {
      operation: 'deductBudgetForPR',
      requestId,
      userId: prPayload?.requestedBy,
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function reserveBudgetForPR(prPayload) {
  const requestId = crypto.randomUUID();

  try {
    if (!isSubmittedStatus(prPayload?.status)) {
      return { success: false, reason: 'PR is not submitted' };
    }

    const context = await resolveBudgetContext(prPayload);
    if (context.error) return { success: false, reason: context.error };
    const { budget } = context;
    const amount = calculatePRTotal(prPayload);
    if (amount.isNegative() || amount.isZero()) {
      return { success: false, reason: 'Purchase request amount must be positive' };
    }

    if (prPayload.localId) {
      const existing = await prisma.purchaseRequestRecord.findUnique({
        where: { localId: prPayload.localId },
        select: { payload: true },
      });
      if (existing?.payload?.budgetReservedAt) {
        return { success: true, alreadyProcessed: true, reservedAmount: 0, budgetId: budget.id };
      }
    }

    await prisma.$transaction(async (tx) => {
      const currentBudget = await tx.monthlyBudget.findUnique({ where: { id: budget.id } });
      if (!currentBudget) throw new Error('Budget not found');

      const available = new Decimal(currentBudget.allocatedAmount)
        .minus(new Decimal(currentBudget.spentAmount))
        .minus(new Decimal(currentBudget.reservedAmount));
      if (amount.gt(available)) {
        const error = new Error(
          `Request total exceeds the available budget of ${available.toFixed(2)}`,
        );
        error.code = 'BUDGET_EXCEEDED';
        throw error;
      }

      await tx.monthlyBudget.update({
        where: { id: budget.id },
        data: { reservedAmount: { increment: amount.toNumber() } },
      });

      if (prPayload.localId) {
        const record = await tx.purchase_request_records.findUnique({
          where: { localId: prPayload.localId },
          select: { payload: true },
        });
        if (record) {
          await tx.purchase_request_records.update({
            where: { localId: prPayload.localId },
            data: {
              payload: {
                ...(record.payload && typeof record.payload === 'object' ? record.payload : {}),
                budgetReservedAt: new Date().toISOString(),
              },
            },
          });
        }
      }
    });

    return { success: true, reservedAmount: amount.toNumber(), budgetId: budget.id };
  } catch (error) {
    if (error.code === 'BUDGET_EXCEEDED') {
      return { success: false, reason: error.message };
    }
    console.error('[BudgetReservation]', {
      operation: 'reserveBudgetForPR', requestId, error: error.message, stack: error.stack,
    });
    throw error;
  }
}

export async function releaseBudgetForPR(prPayload) {
  const requestId = crypto.randomUUID();

  try {
    if (!isRejectedStatus(prPayload?.status)) {
      return { success: false, reason: 'PR is not rejected' };
    }

    if (prPayload?.budgetReleasedAt) {
      return { success: true, alreadyProcessed: true, releasedAmount: 0 };
    }

    const context = await resolveBudgetContext(prPayload);
    if (context.error) return { success: false, reason: context.error };
    const { budget } = context;
    const amount = calculatePRTotal(prPayload);

    if (prPayload.localId) {
      const existing = await prisma.purchaseRequestRecord.findUnique({
        where: { localId: prPayload.localId },
        select: { payload: true },
      });
      if (existing?.payload?.budgetReleasedAt) {
        return { success: true, alreadyProcessed: true, releasedAmount: 0, budgetId: budget.id };
      }
    }

    await prisma.$transaction(async (tx) => {
      const currentBudget = await tx.monthlyBudget.findUnique({ where: { id: budget.id } });
      if (!currentBudget) throw new Error('Budget not found');
      const releaseAmount = Decimal.min(new Decimal(currentBudget.reservedAmount), amount);

      await tx.monthlyBudget.update({
        where: { id: budget.id },
        data: { reservedAmount: { decrement: releaseAmount.toNumber() } },
      });

      if (prPayload.localId) {
        const record = await tx.purchase_request_records.findUnique({
          where: { localId: prPayload.localId },
          select: { payload: true },
        });
        if (record) {
          await tx.purchase_request_records.update({
            where: { localId: prPayload.localId },
            data: {
              payload: {
                ...(record.payload && typeof record.payload === 'object' ? record.payload : {}),
                budgetReleasedAt: new Date().toISOString(),
              },
            },
          });
        }
      }
    });

    return { success: true, releasedAmount: amount.toNumber(), budgetId: budget.id };
  } catch (error) {
    console.error('[BudgetRelease]', {
      operation: 'releaseBudgetForPR', requestId, error: error.message, stack: error.stack,
    });
    throw error;
  }
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
  const requestId = crypto.randomUUID();

  try {
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

    // Check 80% threshold independently
    if (percentage >= 80 && lastThreshold < 80) {
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
            console.error('[BudgetThreshold]', {
              operation: 'notifyBudgetThreshold',
              requestId,
              userId: user.id,
              threshold: 80,
              timestamp: new Date().toISOString(),
              error: err.message,
              stack: err.stack
            });
          })
        )
      );

      await tx.monthlyBudget.update({
        where: { id: budgetId },
        data: { lastNotifiedThreshold: 80 }
      });

      warnings.push({ threshold: 80, percentage });
    }

    // Check 100% threshold independently (not else-if)
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
            console.error('[BudgetThreshold]', {
              operation: 'notifyBudgetExceeded',
              requestId,
              userId: user.id,
              threshold: 100,
              timestamp: new Date().toISOString(),
              error: err.message,
              stack: err.stack
            });
          })
        )
      );

      await tx.monthlyBudget.update({
        where: { id: budgetId },
        data: { lastNotifiedThreshold: 100 }
      });

      warnings.push({ threshold: 100, percentage });
    }

    return warnings;
  } catch (error) {
    console.error('[BudgetThreshold]', {
      operation: 'checkBudgetThresholds',
      requestId,
      budgetId,
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
