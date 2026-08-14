import prisma from '../config/prisma.js';
import Decimal from 'decimal.js';

export async function sendNotification({ userId, type, title, message, refType, refId, channel = 'IN_APP' }) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      channel,
      refType,
      refId,
      isRead: false
    }
  });
}

export async function notifyBudgetPredictionReady(userId, deptName, year, month, predictedAmount, predictionId) {
  const amount = predictedAmount instanceof Decimal ? predictedAmount : new Decimal(predictedAmount);

  return await sendNotification({
    userId,
    type: 'BUDGET_PREDICTION_READY',
    title: 'New Budget Prediction Available',
    message: `AI has generated budget prediction for ${deptName} for ${year}-${String(month).padStart(2, '0')}: $${amount.toNumber().toFixed(2)}. Review and decide whether to submit for approval.`,
    refType: 'budget_prediction',
    refId: String(predictionId)
  });
}

export async function notifyBudgetThreshold(userId, deptName, year, month, percentage, spentAmount, allocatedAmount, budgetId) {
  const spent = spentAmount instanceof Decimal ? spentAmount : new Decimal(spentAmount);
  const allocated = allocatedAmount instanceof Decimal ? allocatedAmount : new Decimal(allocatedAmount);
  const level = percentage >= 100 ? 'CRITICAL' : 'WARNING';

  return await sendNotification({
    userId,
    type: 'BUDGET_THRESHOLD_WARNING',
    title: `Budget ${level}: ${percentage}% Used`,
    message: `${deptName} has used ${percentage}% of allocated budget for ${year}-${String(month).padStart(2, '0')} ($${spent.toNumber().toFixed(2)} of $${allocated.toNumber().toFixed(2)}). ${percentage >= 100 ? 'Budget limit reached.' : 'Consider budget adjustment if needed.'}`,
    refType: 'monthly_budget',
    refId: String(budgetId)
  });
}

export async function notifyBudgetAdjustmentRequested(financeManagerId, financeManagerRole, deptName, year, month, requestedAmount, reason, requestId) {
  const amount = requestedAmount instanceof Decimal ? requestedAmount : new Decimal(requestedAmount);

  return await sendNotification({
    userId: financeManagerId,
    type: 'BUDGET_ADJUSTMENT_REQUESTED',
    title: 'Budget Adjustment Request Pending',
    message: `${deptName} has requested budget adjustment for ${year}-${String(month).padStart(2, '0')}: +$${amount.toNumber().toFixed(2)}. Reason: ${reason}. Please review and approve/reject.`,
    refType: 'budget_adjustment_request',
    refId: String(requestId)
  });
}

export async function notifyBudgetAdjustmentApproved(deptHeadId, deptName, year, month, approvedAmount, newTotal, requestId) {
  const approved = approvedAmount instanceof Decimal ? approvedAmount : new Decimal(approvedAmount);
  const total = newTotal instanceof Decimal ? newTotal : new Decimal(newTotal);

  return await sendNotification({
    userId: deptHeadId,
    type: 'BUDGET_ADJUSTMENT_APPROVED',
    title: 'Budget Adjustment Approved',
    message: `Your budget adjustment request for ${deptName} (${year}-${String(month).padStart(2, '0')}) has been approved. +$${approved.toNumber().toFixed(2)} added. New total: $${total.toNumber().toFixed(2)}.`,
    refType: 'budget_adjustment_request',
    refId: String(requestId)
  });
}

export async function notifyBudgetAdjustmentRejected(deptHeadId, deptName, year, month, requestedAmount, reason, requestId) {
  const amount = requestedAmount instanceof Decimal ? requestedAmount : new Decimal(requestedAmount);

  return await sendNotification({
    userId: deptHeadId,
    type: 'BUDGET_ADJUSTMENT_REJECTED',
    title: 'Budget Adjustment Rejected',
    message: `Your budget adjustment request for ${deptName} (${year}-${String(month).padStart(2, '0')}, $${amount.toNumber().toFixed(2)}) has been rejected. Reason: ${reason}`,
    refType: 'budget_adjustment_request',
    refId: String(requestId)
  });
}

export async function notifyBudgetExceeded(userId, deptName, year, month, percentage, spentAmount, allocatedAmount, budgetId) {
  const spent = spentAmount instanceof Decimal ? spentAmount : new Decimal(spentAmount);
  const allocated = allocatedAmount instanceof Decimal ? allocatedAmount : new Decimal(allocatedAmount);

  return await sendNotification({
    userId,
    type: 'BUDGET_EXCEEDED',
    title: 'Budget Exceeded',
    message: `${deptName} has exceeded allocated budget for ${year}-${String(month).padStart(2, '0')} (${percentage}%: $${spent.toNumber().toFixed(2)} of $${allocated.toNumber().toFixed(2)}). Consider submitting adjustment request.`,
    refType: 'monthly_budget',
    refId: String(budgetId)
  });
}

export async function notifyNewDepartmentSuggestion(financeManagerId, newDeptName, suggestedAmount, similarDeptName, similarity) {
  const amount = suggestedAmount instanceof Decimal ? suggestedAmount : new Decimal(suggestedAmount);

  return await sendNotification({
    userId: financeManagerId,
    type: 'NEW_DEPARTMENT_SUGGESTION',
    title: 'New Department Budget Suggestion',
    message: `AI suggests initial budget for new department "${newDeptName}": $${amount.toNumber().toFixed(2)} (based on ${Math.round(similarity * 100)}% similarity with "${similarDeptName}"). Review and adjust as needed.`,
    refType: 'department',
    refId: newDeptName
  });
}
