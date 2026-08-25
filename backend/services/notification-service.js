import prisma from '../config/prisma.js';
import Decimal from 'decimal.js';
import crypto from 'crypto';
import { sendSystemNotificationEmail } from './emailNotifications.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatBudgetEmailAmount(value) {
  return new Decimal(value).toNumber().toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export async function sendBudgetWorkflowEmail({ to, subject, title, intro, rows, action }) {
  if (!to) return { sent: false, reason: 'Missing recipient email' };
  const renderedRows = rows.map(([label, value]) =>
    `<tr><td style="padding:6px 20px 6px 0;color:#475467"><b>${escapeHtml(label)}</b></td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`
  ).join('');
  return sendSystemNotificationEmail({
    to: [to],
    subject,
    text: `${title}\n\n${intro}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${action}`,
    html: `<div style="font-family:Arial,sans-serif;color:#17202a;max-width:680px"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(intro)}</p><table style="border-collapse:collapse">${renderedRows}</table><p>${escapeHtml(action)}</p><p>Regards,<br/>OptiMind System</p></div>`
  });
}

export async function sendNotification({ userId, type, title, message, refType, refId, channel = 'IN_APP' }) {
  const requestId = crypto.randomUUID();
  try {
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
  } catch (error) {
    console.error('[Notification]', {
      operation: 'sendNotification',
      requestId,
      userId,
      type,
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
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

export async function notifyNextMonthBudgetSubmitted(financeUserId, deptName, year, month, proposedAmount, reason, requestId) {
  const amount = proposedAmount instanceof Decimal ? proposedAmount : new Decimal(proposedAmount);

  return await sendNotification({
    userId: financeUserId,
    type: 'NEXT_MONTH_BUDGET_SUBMITTED',
    title: 'Next Month Budget Pending Approval',
    message: `${deptName} submitted a proposed budget for ${year}-${String(month).padStart(2, '0')}: $${amount.toNumber().toFixed(2)}. Reason: ${reason}. Please review and approve/reject.`,
    refType: 'budget_adjustment_request',
    refId: String(requestId)
  });
}

export function emailNextMonthBudgetSubmitted(financeEmail, deptName, year, month, aiSuggestedAmount, proposedAmount, reason) {
  const rows = [
    ['Department', deptName],
    ['Target period', `${year}-${String(month).padStart(2, '0')}`],
  ];
  if (aiSuggestedAmount != null) {
    rows.push(['AI suggested budget', `RM ${formatBudgetEmailAmount(aiSuggestedAmount)}`]);
  }
  rows.push(
    ['Proposed budget', `RM ${formatBudgetEmailAmount(proposedAmount)}`],
    ['Reason', reason]
  );
  return sendBudgetWorkflowEmail({
    to: financeEmail,
    subject: `OptiMind - Next Month Budget Awaiting Approval (${year}-${String(month).padStart(2, '0')})`,
    title: 'Next Month Budget Awaiting Approval',
    intro: `${deptName} has submitted a proposed budget for your review.`,
    rows,
    action: 'Sign in to OptiMind and open Budget Approval Queue to approve or reject this submission.'
  });
}

export async function notifyNextMonthBudgetApproved(deptUserId, deptName, year, month, approvedAmount, requestId) {
  const amount = approvedAmount instanceof Decimal ? approvedAmount : new Decimal(approvedAmount);

  return await sendNotification({
    userId: deptUserId,
    type: 'NEXT_MONTH_BUDGET_APPROVED',
    title: 'Next Month Budget Approved',
    message: `Your proposed budget for ${deptName} for ${year}-${String(month).padStart(2, '0')} has been approved: $${amount.toNumber().toFixed(2)}.`,
    refType: 'monthly_budget',
    refId: String(requestId)
  });
}

export function emailNextMonthBudgetReviewed({ recipientEmail, recipientName, departmentName, year, month, proposedAmount, status, reviewComment }) {
  const approved = status === 'approved';
  return sendBudgetWorkflowEmail({
    to: recipientEmail,
    subject: `OptiMind - Next Month Budget ${approved ? 'Approved' : 'Rejected'} (${year}-${String(month).padStart(2, '0')})`,
    title: `Next Month Budget ${approved ? 'Approved' : 'Rejected'}`,
    intro: `Hello ${recipientName || 'there'}, your proposed budget for ${departmentName} has been ${approved ? 'approved' : 'rejected'}.`,
    rows: [
      ['Department', departmentName],
      ['Target period', `${year}-${String(month).padStart(2, '0')}`],
      ['Proposed budget', `RM ${formatBudgetEmailAmount(proposedAmount)}`],
      ['Finance comment', reviewComment || '-']
    ],
    action: approved
      ? 'The approved amount is now available in the Finance Budget Dashboard.'
      : 'Sign in to OptiMind, edit the proposed budget or reason, then resubmit it to Finance.'
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
