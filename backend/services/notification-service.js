import prisma from '../config/prisma.js';

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
  return await sendNotification({
    userId,
    type: 'BUDGET_PREDICTION_READY',
    title: 'New Budget Prediction Available',
    message: `AI has generated budget prediction for ${deptName} for ${year}-${String(month).padStart(2, '0')}: $${predictedAmount.toFixed(2)}. Review and decide whether to submit for approval.`,
    refType: 'budget_prediction',
    refId: String(predictionId)
  });
}

export async function notifyBudgetThreshold(userId, deptName, year, month, percentage, spentAmount, allocatedAmount, budgetId) {
  const level = percentage >= 100 ? 'CRITICAL' : 'WARNING';

  return await sendNotification({
    userId,
    type: 'BUDGET_THRESHOLD_WARNING',
    title: `Budget ${level}: ${percentage}% Used`,
    message: `${deptName} has used ${percentage}% of allocated budget for ${year}-${String(month).padStart(2, '0')} ($${spentAmount.toFixed(2)} of $${allocatedAmount.toFixed(2)}). ${percentage >= 100 ? 'Budget limit reached.' : 'Consider budget adjustment if needed.'}`,
    refType: 'monthly_budget',
    refId: String(budgetId)
  });
}

export async function notifyBudgetAdjustmentRequested(financeManagerId, financeManagerRole, deptName, year, month, requestedAmount, reason, requestId) {
  return await sendNotification({
    userId: financeManagerId,
    type: 'BUDGET_ADJUSTMENT_REQUESTED',
    title: 'Budget Adjustment Request Pending',
    message: `${deptName} has requested budget adjustment for ${year}-${String(month).padStart(2, '0')}: +$${requestedAmount.toFixed(2)}. Reason: ${reason}. Please review and approve/reject.`,
    refType: 'budget_adjustment_request',
    refId: String(requestId)
  });
}

export async function notifyBudgetAdjustmentApproved(deptHeadId, deptName, year, month, approvedAmount, newTotal, requestId) {
  return await sendNotification({
    userId: deptHeadId,
    type: 'BUDGET_ADJUSTMENT_APPROVED',
    title: 'Budget Adjustment Approved',
    message: `Your budget adjustment request for ${deptName} (${year}-${String(month).padStart(2, '0')}) has been approved. +$${approvedAmount.toFixed(2)} added. New total: $${newTotal.toFixed(2)}.`,
    refType: 'budget_adjustment_request',
    refId: String(requestId)
  });
}

export async function notifyBudgetAdjustmentRejected(deptHeadId, deptName, year, month, requestedAmount, reason, requestId) {
  return await sendNotification({
    userId: deptHeadId,
    type: 'BUDGET_ADJUSTMENT_REJECTED',
    title: 'Budget Adjustment Rejected',
    message: `Your budget adjustment request for ${deptName} (${year}-${String(month).padStart(2, '0')}, $${requestedAmount.toFixed(2)}) has been rejected. Reason: ${reason}`,
    refType: 'budget_adjustment_request',
    refId: String(requestId)
  });
}

export async function notifyBudgetExceeded(userId, deptName, year, month, percentage, spentAmount, allocatedAmount, budgetId) {
  return await sendNotification({
    userId,
    type: 'BUDGET_EXCEEDED',
    title: 'Budget Exceeded',
    message: `${deptName} has exceeded allocated budget for ${year}-${String(month).padStart(2, '0')} (${percentage}%: $${spentAmount.toFixed(2)} of $${allocatedAmount.toFixed(2)}). Consider submitting adjustment request.`,
    refType: 'monthly_budget',
    refId: String(budgetId)
  });
}

export async function notifyNewDepartmentSuggestion(financeManagerId, newDeptName, suggestedAmount, similarDeptName, similarity) {
  return await sendNotification({
    userId: financeManagerId,
    type: 'NEW_DEPARTMENT_SUGGESTION',
    title: 'New Department Budget Suggestion',
    message: `AI suggests initial budget for new department "${newDeptName}": $${suggestedAmount.toFixed(2)} (based on ${Math.round(similarity * 100)}% similarity with "${similarDeptName}"). Review and adjust as needed.`,
    refType: 'department',
    refId: newDeptName
  });
}
