import express from 'express';
import prisma from '../config/prisma.js';
import Decimal from 'decimal.js';
import { generateDepartmentPrediction, generatePredictionsForAllDepartments } from '../services/budget-prediction-service.js';
import {
  notifyBudgetAdjustmentRequested,
  notifyBudgetAdjustmentApproved,
  notifyBudgetAdjustmentRejected,
  notifyNextMonthBudgetSubmitted,
  notifyNextMonthBudgetApproved,
  emailNextMonthBudgetSubmitted,
  emailNextMonthBudgetReviewed
} from '../services/notification-service.js';
import {
  deductBudgetForPR,
  reserveBudgetForPR,
  releaseBudgetForPR,
} from '../services/budget-deduction-service.js';
import { authenticateRequest, requireRoles, requireOwnDepartment } from '../middleware/auth.js';
import { ROLES } from '../constants/roles.js';
import { validateUpcomingEvent } from '../services/upcoming-event-service.js';

const router = express.Router();

const PREDICTION_ALLOWED_ROLES = Object.values(ROLES).filter(
  (role) => role !== ROLES.EMPLOYEE
);
const ALL_DEPARTMENT_PREDICTION_ROLES = new Set([
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.TREASURY_FINANCE_OFFICER,
  ROLES.PAYMENT_TEAM,
]);
const UPCOMING_EVENT_MANAGE_ROLES = [
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.DEPARTMENT_EXECUTIVE,
];

function userMatchesDepartment(userDepartment, department) {
  const userValue = String(userDepartment ?? '').trim().toLowerCase();
  return Boolean(userValue) && (
    userValue === String(department.code ?? '').trim().toLowerCase() ||
    userValue === String(department.name ?? '').trim().toLowerCase()
  );
}

function canAccessForecastDepartment(user, department) {
  return ALL_DEPARTMENT_PREDICTION_ROLES.has(user.role) || userMatchesDepartment(user.department, department);
}

// Apply authentication to all budget routes
router.use(authenticateRequest);

// GET /api/department-budget/departments - List all departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
});

// GET /api/department-budget/my-budget-history - Current user's department only.
// This intentionally returns official budgets up to the current month; future
// predictions and submissions are not displayed as allocated budgets.
router.get('/my-budget-history', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      select: { id: true, email: true, department: true, role: true }
    });
    if (!user || user.email.toLowerCase() !== req.auth.email) {
      return res.status(403).json({ success: false, message: 'Access denied: user not found' });
    }

    const departmentValue = String(user.department ?? '').trim();
    if (!departmentValue) {
      return res.status(404).json({ success: false, message: 'No department is assigned to this user' });
    }

    const department = await prisma.department.findFirst({
      where: {
        OR: [
          { code: { equals: departmentValue, mode: 'insensitive' } },
          { name: { equals: departmentValue, mode: 'insensitive' } }
        ]
      },
      select: { id: true, code: true, name: true }
    });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const start = new Date(currentYear, now.getMonth() - 11, 1);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth() + 1;

    const [budgets, submissions] = await Promise.all([
      prisma.monthlyBudget.findMany({
        where: {
          departmentId: department.id,
          OR: [
            { year: { gt: startYear, lt: currentYear } },
            { year: startYear, month: { gte: startMonth } },
            { year: currentYear, month: { lte: currentMonth } }
          ]
        },
        orderBy: [{ year: 'desc' }, { month: 'desc' }]
      }),
      prisma.budgetAdjustmentRequest.findMany({
        where: {
          departmentId: department.id,
          requestType: 'next_month_submission',
          OR: [
            { targetYear: { gt: startYear, lt: currentYear } },
            { targetYear: startYear, targetMonth: { gte: startMonth } },
            { targetYear: currentYear, targetMonth: { lte: currentMonth } }
          ]
        },
        orderBy: { requestedAt: 'desc' },
        select: { targetYear: true, targetMonth: true, status: true }
      })
    ]);

    const budgetByPeriod = new Map(budgets.map((budget) => [`${budget.year}-${budget.month}`, budget]));
    const submissionByPeriod = new Map();
    for (const submission of submissions) {
      const key = `${submission.targetYear}-${submission.targetMonth}`;
      if (!submissionByPeriod.has(key)) submissionByPeriod.set(key, submission.status);
    }

    const rows = [];
    for (let offset = 0; offset < 12; offset += 1) {
      const date = new Date(currentYear, now.getMonth() - offset, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;
      const budget = budgetByPeriod.get(key);
      const submissionStatus = submissionByPeriod.get(key);
      const isAutoGenerated = Boolean(budget?.notes?.startsWith('Auto-generated from AI prediction'));
      rows.push({
        period: key,
        year,
        month,
        budgetId: budget?.id ?? null,
        allocatedAmount: budget?.allocatedAmount ?? null,
        spentAmount: budget?.spentAmount ?? null,
        remainingAmount: budget ? budget.allocatedAmount.minus(budget.spentAmount) : null,
        status: budget ? (isAutoGenerated ? 'ai_auto_generated' : 'approved') : (submissionStatus || 'not_set'),
        source: budget ? (isAutoGenerated ? 'AI prediction' : 'Finance approval') : null
      });
    }

    res.json({
      success: true,
      data: { department, currentPeriod: `${currentYear}-${String(currentMonth).padStart(2, '0')}`, rows }
    });
  } catch (error) {
    console.error('Get own budget history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budget history' });
  }
});

// GET /api/department-budget/monthly/:departmentId - Get monthly budgets for department
router.get('/monthly/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { year, month } = req.query;

    // Validate departmentId
    const deptId = parseInt(departmentId);
    if (isNaN(deptId) || deptId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'departmentId must be a positive integer'
      });
    }

    const where = { departmentId: deptId };

    if (year) {
      const yearNum = parseInt(year);
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        return res.status(400).json({
          success: false,
          message: 'year must be between 2000 and 2100'
        });
      }
      where.year = yearNum;
    }

    if (month) {
      const monthNum = parseInt(month);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          success: false,
          message: 'month must be between 1 and 12'
        });
      }
      where.month = monthNum;
    }

    const budgets = await prisma.monthlyBudget.findMany({
      where,
      include: { department: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });

    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    console.error('Get monthly budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly budgets',
      error: error.message
    });
  }
});

// POST /api/department-budget/monthly - Create new monthly budget
router.post('/monthly', async (req, res) => {
  try {
    const { departmentId, year, month, allocatedAmount, notes } = req.body;

    // Validate required fields
    if (!departmentId || !year || !month || allocatedAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: departmentId, year, month, allocatedAmount'
      });
    }

    // Validate numeric fields
    const deptId = parseInt(departmentId);
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(deptId) || isNaN(yearNum) || isNaN(monthNum)) {
      return res.status(400).json({
        success: false,
        message: 'departmentId, year, and month must be valid numbers'
      });
    }

    // Validate business rules
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12'
      });
    }

    if (yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Year must be between 2000 and 2100'
      });
    }

    // Validate and convert allocatedAmount using Decimal.js
    let amount;
    try {
      amount = new Decimal(allocatedAmount);
      if (amount.isNaN() || amount.isNegative() || amount.isZero()) {
        throw new Error('Invalid amount');
      }
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'allocatedAmount must be a positive number'
      });
    }

    const existing = await prisma.monthlyBudget.findUnique({
      where: {
        departmentId_year_month: {
          departmentId: deptId,
          year: yearNum,
          month: monthNum
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Budget already exists for this department and period'
      });
    }

    const budget = await prisma.monthlyBudget.create({
      data: {
        departmentId: deptId,
        year: yearNum,
        month: monthNum,
        allocatedAmount: amount.toNumber(),
        spentAmount: 0,
        reservedAmount: 0,
        notes
      },
      include: { department: true }
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Create monthly budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create monthly budget',
      error: error.message
    });
  }
});

// PATCH /api/department-budget/monthly/:id - Update monthly budget
router.patch('/monthly/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { allocatedAmount, notes } = req.body;

    // Validate ID
    const budgetId = parseInt(id);
    if (isNaN(budgetId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID'
      });
    }

    const updateData = {};

    // Validate and convert allocatedAmount if provided
    if (allocatedAmount !== undefined) {
      try {
        const amount = new Decimal(allocatedAmount);
        if (amount.isNaN() || amount.isNegative() || amount.isZero()) {
          throw new Error('Invalid amount');
        }
        updateData.allocatedAmount = amount.toNumber();
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'allocatedAmount must be a positive number'
        });
      }
    }

    if (notes !== undefined) updateData.notes = notes;

    // Check if no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const budget = await prisma.monthlyBudget.update({
      where: { id: budgetId },
      data: updateData,
      include: { department: true }
    });

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error('Update monthly budget error:', error);

    // Handle Prisma NotFoundError
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Monthly budget not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update monthly budget',
      error: error.message
    });
  }
});

// GET /api/department-budget/upcoming-events/:departmentId - Forecast context for a selected period.
router.get('/upcoming-events/:departmentId', requireRoles(PREDICTION_ALLOWED_ROLES), async (req, res) => {
  try {
    const departmentId = Number(req.params.departmentId);
    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      return res.status(400).json({ success: false, message: 'departmentId must be a positive integer' });
    }

    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    if (!canAccessForecastDepartment(req.user, department)) {
      return res.status(403).json({ success: false, message: 'Access denied: cannot access another department' });
    }

    const targetYear = req.query.year === undefined ? undefined : Number(req.query.year);
    const targetMonth = req.query.month === undefined ? undefined : Number(req.query.month);
    if ((targetYear !== undefined && (!Number.isInteger(targetYear) || targetYear < 2000 || targetYear > 2100)) ||
        (targetMonth !== undefined && (!Number.isInteger(targetMonth) || targetMonth < 1 || targetMonth > 12))) {
      return res.status(400).json({ success: false, message: 'Invalid year or month filter' });
    }

    const events = await prisma.budgetUpcomingEvent.findMany({
      where: { departmentId, status: 'active', ...(targetYear ? { targetYear } : {}), ...(targetMonth ? { targetMonth } : {}) },
      include: { creator: { select: { id: true, name: true } } },
      orderBy: [{ targetYear: 'asc' }, { targetMonth: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Get upcoming forecast events error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming events' });
  }
});

// POST /api/department-budget/upcoming-events - Managers add known future events without burdening PR users.
router.post('/upcoming-events', requireRoles(UPCOMING_EVENT_MANAGE_ROLES), async (req, res) => {
  try {
    const departmentId = Number(req.body.departmentId);
    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      return res.status(400).json({ success: false, message: 'departmentId must be a positive integer' });
    }
    const validation = validateUpcomingEvent(req.body);
    if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });

    const department = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    if (!canAccessForecastDepartment(req.user, department)) {
      return res.status(403).json({ success: false, message: 'Access denied: cannot add an event for another department' });
    }

    const event = await prisma.budgetUpcomingEvent.create({
      data: { departmentId, createdBy: req.auth.userId, ...validation.value },
    });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Create upcoming forecast event error:', error);
    res.status(500).json({ success: false, message: 'Failed to create upcoming event' });
  }
});

// DELETE keeps a cancellation audit trail instead of removing forecasting evidence.
router.delete('/upcoming-events/:id', requireRoles(UPCOMING_EVENT_MANAGE_ROLES), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid event id' });
    const event = await prisma.budgetUpcomingEvent.findUnique({ include: { department: true }, where: { id } });
    if (!event) return res.status(404).json({ success: false, message: 'Upcoming event not found' });
    if (!canAccessForecastDepartment(req.user, event.department)) {
      return res.status(403).json({ success: false, message: 'Access denied: cannot cancel an event for another department' });
    }
    const cancelled = await prisma.budgetUpcomingEvent.update({ where: { id }, data: { status: 'cancelled' } });
    res.json({ success: true, data: cancelled });
  } catch (error) {
    console.error('Cancel upcoming forecast event error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel upcoming event' });
  }
});

// POST /api/department-budget/predict/manual - Trigger manual prediction
router.post('/predict/manual', requireRoles(PREDICTION_ALLOWED_ROLES), async (req, res) => {
  try {
    const { departmentCode, targetYear, targetMonth } = req.body;

    if (!departmentCode || !targetYear || !targetMonth) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: departmentCode, targetYear, targetMonth'
      });
    }

    const department = await prisma.department.findFirst({
      where: {
        OR: [
          { code: String(departmentCode).trim() },
          { name: String(departmentCode).trim() },
        ],
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    if (
      process.env.NODE_ENV !== 'test' &&
      !ALL_DEPARTMENT_PREDICTION_ROLES.has(req.user.role) &&
      !userMatchesDepartment(req.user.department, department)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: cannot generate a prediction for another department'
      });
    }

    const prediction = await generateDepartmentPrediction(
      department.code,
      parseInt(targetYear),
      parseInt(targetMonth),
      req.auth.userId
    );

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Manual prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prediction',
      error: error.message
    });
  }
});

// POST /api/department-budget/predict/batch - Trigger batch predictions for all departments
router.post('/predict/batch', async (req, res) => {
  try {
    const { targetYear, targetMonth, userId } = req.body;

    if (!targetYear || !targetMonth || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: targetYear, targetMonth, userId'
      });
    }

    const results = await generatePredictionsForAllDepartments(
      parseInt(targetYear),
      parseInt(targetMonth),
      parseInt(userId)
    );

    res.json({
      success: true,
      data: {
        successCount: results.success.length,
        failedCount: results.failed.length,
        details: results
      }
    });
  } catch (error) {
    console.error('Batch prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate batch predictions',
      error: error.message
    });
  }
});

// POST /api/department-budget/adjustments - Create budget adjustment request
router.post('/adjustments', requireRoles([ROLES.ADMIN, ROLES.DEPARTMENT_EXECUTIVE, ROLES.MANAGER]), requireOwnDepartment, async (req, res) => {
  try {
    const { departmentId, targetYear, targetMonth, requestType, requestedAmount, reason, requestedBy } = req.body;
    const authenticatedUserId = req.auth.userId;

    if (!departmentId || !targetYear || !targetMonth || !requestType || !requestedAmount || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    if (requestedBy !== undefined && parseInt(requestedBy) !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'requestedBy must match the authenticated user'
      });
    }

    // Normalize and validate requestType (accept both uppercase and lowercase)
    const normalizedRequestType = requestType.toLowerCase();
    const validRequestTypes = ['increase', 'additional', 'next_month_submission'];
    if (!validRequestTypes.includes(normalizedRequestType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid requestType. Must be one of: ${validRequestTypes.join(', ')}`
      });
    }

    // Validate targetYear
    const year = parseInt(targetYear);
    if (isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid targetYear. Must be a valid year between 2000 and 2100'
      });
    }

    // Validate targetMonth
    const month = parseInt(targetMonth);
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid targetMonth. Must be between 1 and 12'
      });
    }

    const department = await prisma.department.findUnique({
      where: { id: parseInt(departmentId) }
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Validate and convert requestedAmount using Decimal.js
    let amount;
    try {
      amount = new Decimal(requestedAmount);
      if (amount.isNaN() || amount.isNegative() || amount.isZero()) {
        throw new Error('Invalid amount');
      }
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'requestedAmount must be a positive number'
      });
    }

    // Validate reason length
    if (!reason || reason.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Reason must be at least 20 characters'
      });
    }

    // A department can have only one active next-month submission for a period.
    if (normalizedRequestType === 'next_month_submission') {
      const existingSubmission = await prisma.budgetAdjustmentRequest.findFirst({
        where: {
          departmentId: parseInt(departmentId),
          targetYear: year,
          targetMonth: month,
          requestType: 'next_month_submission',
          status: { in: ['pending', 'approved'] }
        }
      });
      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          message: 'This department already has an active next-month budget submission for this period'
        });
      }
    }

    // Check for duplicate increase requests for same period
    if (normalizedRequestType === 'increase') {
      const existingIncreaseRequest = await prisma.budgetAdjustmentRequest.findFirst({
        where: {
          departmentId: parseInt(departmentId),
          targetYear: year,
          targetMonth: month,
          requestType: { in: ['increase', 'INCREASE'] },
          status: { in: ['pending', 'approved'] }
        }
      });

      if (existingIncreaseRequest) {
        return res.status(400).json({
          success: false,
          message: 'This department already has a pending or approved increase request for this period'
        });
      }
    }

    const adjustment = await prisma.budgetAdjustmentRequest.create({
      data: {
        departmentId: parseInt(departmentId),
        targetYear: year,
        targetMonth: month,
        requestType: normalizedRequestType,
        requestedAmount: amount.toNumber(),
        reason,
        requestedBy: authenticatedUserId,
        status: 'pending'
      },
      include: {
        department: true,
        requester: { select: { id: true, name: true, email: true } }
      }
    });

    // Notify finance managers in parallel. Next-month submissions use their own notification copy.
    const prediction = normalizedRequestType === 'next_month_submission'
      ? await prisma.budgetPrediction.findFirst({
          where: { departmentId: department.id, targetYear: year, targetMonth: month },
          select: { predictedAmount: true },
          orderBy: { createdAt: 'desc' }
        })
      : null;
    const financeManagers = await prisma.user.findMany({
      where: {
        role: { in: [ROLES.ADMIN, ROLES.TREASURY_FINANCE_OFFICER] },
        isActive: true
      },
      select: { id: true, role: true, email: true }
    });

    if (financeManagers.length > 0) {
      await Promise.all(
        financeManagers.map(fm => {
          const notify = normalizedRequestType === 'next_month_submission'
            ? notifyNextMonthBudgetSubmitted(fm.id, department.name, parseInt(targetYear), parseInt(targetMonth), amount.toNumber(), reason, adjustment.id)
            : notifyBudgetAdjustmentRequested(fm.id, fm.role, department.name, parseInt(targetYear), parseInt(targetMonth), amount.toNumber(), reason, adjustment.id);
          const email = normalizedRequestType === 'next_month_submission'
            ? emailNextMonthBudgetSubmitted(fm.email, department.name, parseInt(targetYear), parseInt(targetMonth), prediction?.predictedAmount, amount.toNumber(), reason)
            : Promise.resolve();
          return Promise.all([notify, email]).catch(err => {
            console.error(`Failed to notify finance manager ${fm.id}:`, err);
            // Don't fail the request if notification fails
          });
        })
      );
    } else {
      console.warn('No active finance managers found to notify for adjustment request');
    }

    res.status(201).json({
      success: true,
      data: adjustment
    });
  } catch (error) {
    console.error('Create adjustment request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create adjustment request',
      error: error.message
    });
  }
});

// GET /api/department-budget/adjustments - Get adjustment requests with filters
router.get('/adjustments', async (req, res) => {
  try {
    const { status, departmentId, targetYear, targetMonth } = req.query;

    const where = {};
    if (status) where.status = status;
    if (departmentId) where.departmentId = parseInt(departmentId);
    if (targetYear) where.targetYear = parseInt(targetYear);
    if (targetMonth) where.targetMonth = parseInt(targetMonth);

    const viewer = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      select: { role: true, department: true }
    });
    const canViewAll = [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.TREASURY_FINANCE_OFFICER,
    ].includes(viewer?.role);
    if (!canViewAll) {
      const viewerDepartment = String(viewer?.department ?? '').trim().toLowerCase();
      const department = viewerDepartment
        ? await prisma.department.findFirst({
            where: {
              OR: [
                { code: { equals: viewerDepartment, mode: 'insensitive' } },
                { name: { equals: viewerDepartment, mode: 'insensitive' } }
              ]
            },
            select: { id: true }
          })
        : null;
      where.departmentId = department?.id ?? -1;
    }

    const adjustments = await prisma.budgetAdjustmentRequest.findMany({
      where,
      include: {
        department: true,
        requester: { select: { id: true, name: true, email: true } },
        reviewer: { select: { id: true, name: true, email: true } }
      },
      orderBy: { requestedAt: 'desc' }
    });

    res.json({
      success: true,
      data: adjustments
    });
  } catch (error) {
    console.error('Get adjustments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch adjustment requests',
      error: error.message
    });
  }
});

// PATCH /api/department-budget/adjustments/:id/approve - Approve adjustment request
router.patch('/adjustments/:id/approve', requireRoles([ROLES.ADMIN, ROLES.TREASURY_FINANCE_OFFICER]), async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewedBy, reviewComment } = req.body;

    // Validate required parameters
    if (!reviewedBy || !reviewComment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: reviewedBy and reviewComment'
      });
    }

    if (parseInt(reviewedBy) !== req.auth.userId) {
      return res.status(403).json({
        success: false,
        message: 'reviewedBy must match the authenticated user'
      });
    }

    const adjustment = await prisma.budgetAdjustmentRequest.findUnique({
      where: { id: parseInt(id) },
      include: { department: true, requester: { select: { name: true, email: true } } }
    });

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment request not found'
      });
    }

    if (adjustment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been reviewed'
      });
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update adjustment request
      const updatedAdjustment = await tx.budgetAdjustmentRequest.update({
        where: { id: parseInt(id) },
        data: {
          status: 'approved',
          reviewedBy: parseInt(reviewedBy),
          reviewNotes: reviewComment,
          reviewedAt: new Date()
        },
        include: {
          department: true,
          requester: { select: { id: true, name: true, email: true } },
          reviewer: { select: { id: true, name: true, email: true } }
        }
      });

      // Current-month adjustments increment an existing budget. A next-month
      // submission is the proposed final allocation and therefore upserts it.
      const budget = await tx.monthlyBudget.findUnique({
        where: {
          departmentId_year_month: {
            departmentId: adjustment.departmentId,
            year: adjustment.targetYear,
            month: adjustment.targetMonth
          }
        }
      });

      if (!budget && adjustment.requestType !== 'next_month_submission') {
        throw new Error('Monthly budget not found for target period');
      }

      const updatedBudget = adjustment.requestType === 'next_month_submission'
        ? budget
          ? await tx.monthlyBudget.update({
              where: { id: budget.id },
              data: { allocatedAmount: adjustment.requestedAmount, notes: `Department submission #${adjustment.id}: ${adjustment.reason}` }
            })
          : await tx.monthlyBudget.create({
              data: {
                departmentId: adjustment.departmentId,
                year: adjustment.targetYear,
                month: adjustment.targetMonth,
                allocatedAmount: adjustment.requestedAmount,
                spentAmount: 0,
                reservedAmount: 0,
                notes: `Department submission #${adjustment.id}: ${adjustment.reason}`
              }
            })
        : await tx.monthlyBudget.update({
            where: { id: budget.id },
            data: { allocatedAmount: { increment: adjustment.requestedAmount } }
          });

      return { updatedAdjustment, updatedBudget };
    });

    // Notify requester after successful transaction
    if (adjustment.requestType === 'next_month_submission') {
      await notifyNextMonthBudgetApproved(
        adjustment.requestedBy,
        adjustment.department.name,
        adjustment.targetYear,
        adjustment.targetMonth,
        adjustment.requestedAmount,
        adjustment.id
      );
      emailNextMonthBudgetReviewed({
        recipientEmail: adjustment.requester.email,
        recipientName: adjustment.requester.name,
        departmentName: adjustment.department.name,
        year: adjustment.targetYear,
        month: adjustment.targetMonth,
        proposedAmount: adjustment.requestedAmount,
        status: 'approved',
        reviewComment
      }).catch(error => console.error('Failed to email budget approval:', error));
    } else {
      await notifyBudgetAdjustmentApproved(
        adjustment.requestedBy,
        adjustment.department.name,
        adjustment.targetYear,
        adjustment.targetMonth,
        adjustment.requestedAmount,
        result.updatedBudget.allocatedAmount,
        adjustment.id
      );
    }

    // Transform reviewNotes to reviewComment for API consistency
    const responseData = {
      request: {
        ...result.updatedAdjustment,
        reviewComment: result.updatedAdjustment.reviewNotes,
        reviewNotes: undefined
      },
      updatedBudget: result.updatedBudget
    };
    delete responseData.request.reviewNotes;

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Approve adjustment error:', error);

    // Handle transaction errors
    if (error.message === 'Monthly budget not found for target period') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to approve adjustment',
      error: error.message
    });
  }
});

// PATCH /api/department-budget/adjustments/:id/reject - Reject adjustment request
router.patch('/adjustments/:id/reject', requireRoles([ROLES.ADMIN, ROLES.TREASURY_FINANCE_OFFICER]), async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewedBy, reviewComment } = req.body;

    // Validate required parameters
    if (!reviewedBy || !reviewComment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: reviewedBy and reviewComment'
      });
    }

    if (parseInt(reviewedBy) !== req.auth.userId) {
      return res.status(403).json({
        success: false,
        message: 'reviewedBy must match the authenticated user'
      });
    }

    const adjustment = await prisma.budgetAdjustmentRequest.findUnique({
      where: { id: parseInt(id) },
      include: { department: true, requester: { select: { name: true, email: true } } }
    });

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment request not found'
      });
    }

    if (adjustment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been reviewed'
      });
    }

    const updatedAdjustment = await prisma.budgetAdjustmentRequest.update({
      where: { id: parseInt(id) },
      data: {
        status: 'rejected',
        reviewedBy: parseInt(reviewedBy),
        reviewNotes: reviewComment,
        reviewedAt: new Date()
      },
      include: {
        department: true,
        requester: true,
        reviewer: true
      }
    });

    // Notify requester
    await notifyBudgetAdjustmentRejected(
      adjustment.requestedBy,
      adjustment.department.name,
      adjustment.targetYear,
      adjustment.targetMonth,
      adjustment.requestedAmount,
      reviewComment,
      adjustment.id
    );

    if (adjustment.requestType === 'next_month_submission') {
      emailNextMonthBudgetReviewed({
        recipientEmail: adjustment.requester.email,
        recipientName: adjustment.requester.name,
        departmentName: adjustment.department.name,
        year: adjustment.targetYear,
        month: adjustment.targetMonth,
        proposedAmount: adjustment.requestedAmount,
        status: 'rejected',
        reviewComment
      }).catch(error => console.error('Failed to email budget rejection:', error));
    }

    // Transform reviewNotes to reviewComment for API consistency
    const responseData = {
      ...updatedAdjustment,
      reviewComment: updatedAdjustment.reviewNotes,
      reviewNotes: undefined
    };
    delete responseData.reviewNotes;

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Reject adjustment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject adjustment',
      error: error.message
    });
  }
});

// GET /api/department-budget/predictions/:departmentId - Get all predictions for department
router.get('/predictions/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { year, month, confidence, triggerType, limit } = req.query;

    const where = { departmentId: parseInt(departmentId) };
    if (year) where.targetYear = parseInt(year);
    if (month) where.targetMonth = parseInt(month);
    if (confidence) where.confidence = confidence;
    if (triggerType) where.triggerType = triggerType;

    const predictions = await prisma.budgetPrediction.findMany({
      where,
      include: {
        department: true,
        triggeredByUser: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        { targetYear: 'desc' },
        { targetMonth: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    });

    res.json({
      success: true,
      data: predictions.map(p => ({
        ...p,
        predictedAmount: parseFloat(p.predictedAmount)
      }))
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch predictions',
      error: error.message
    });
  }
});

// GET /api/department-budget/predictions/single/:id - Get single prediction by ID
router.get('/predictions/single/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const prediction = await prisma.budgetPrediction.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: true,
        triggeredByUser: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...prediction,
        predictedAmount: parseFloat(prediction.predictedAmount)
      }
    });
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction',
      error: error.message
    });
  }
});

// GET /api/department-budget/usage/:departmentId - Get budget usage summary
router.get('/usage/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'year and month parameters required'
      });
    }

    // Validate all numeric inputs
    const deptId = parseInt(departmentId);
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(deptId) || deptId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'departmentId must be a positive integer'
      });
    }

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({
        success: false,
        message: 'year must be between 2000 and 2100'
      });
    }

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'month must be between 1 and 12'
      });
    }

    const budget = await prisma.monthlyBudget.findUnique({
      where: {
        departmentId_year_month: {
          departmentId: deptId,
          year: yearNum,
          month: monthNum
        }
      },
      include: { department: true }
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found for specified period'
      });
    }

    const allocated = new Decimal(budget.allocatedAmount);
    const spent = new Decimal(budget.spentAmount);
    const reserved = new Decimal(budget.reservedAmount);
    // Reserved requests already consume available capacity even though they
    // have not reached the approved/spent state yet.
    const committed = spent.plus(reserved);
    const remaining = allocated.minus(committed);
    const usagePercentage = committed.dividedBy(allocated).times(100);

    res.json({
      success: true,
      data: {
        budgetId: budget.id,
        department: budget.department,
        year: budget.year,
        month: budget.month,
        allocatedAmount: allocated.toNumber(),
        spentAmount: spent.toNumber(),
        reservedAmount: reserved.toNumber(),
        remainingAmount: remaining.toNumber(),
        usagePercentage: Math.round(usagePercentage.toNumber() * 100) / 100,
        status: usagePercentage.toNumber() >= 100 ? 'exceeded' : usagePercentage.toNumber() >= 80 ? 'warning' : 'normal'
      }
    });
  } catch (error) {
    console.error('Get budget usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget usage',
      error: error.message
    });
  }
});

// POST /api/department-budget/usage/deduct - Deduct budget for approved PR (internal API)
router.post('/usage/deduct', async (req, res) => {
  try {
    const { prPayload } = req.body;

    if (!prPayload) {
      return res.status(400).json({
        success: false,
        message: 'prPayload required'
      });
    }

    const result = await deductBudgetForPR(prPayload);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.reason
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Budget deduction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deduct budget',
      error: error.message
    });
  }
});

// POST /api/department-budget/usage/reserve - Reserve budget for submitted PR
router.post('/usage/reserve', async (req, res) => {
  try {
    const { prPayload } = req.body;
    if (!prPayload) {
      return res.status(400).json({ success: false, message: 'prPayload required' });
    }
    const result = await reserveBudgetForPR(prPayload);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.reason });
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Budget reservation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reserve budget', error: error.message });
  }
});

// POST /api/department-budget/usage/release - Release budget for rejected PR
router.post('/usage/release', async (req, res) => {
  try {
    const { prPayload } = req.body;
    if (!prPayload) {
      return res.status(400).json({ success: false, message: 'prPayload required' });
    }
    const result = await releaseBudgetForPR(prPayload);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.reason });
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Budget release error:', error);
    return res.status(500).json({ success: false, message: 'Failed to release budget', error: error.message });
  }
});

// GET /api/department-budget/predictions/:departmentId - Get predictions for department
router.get('/predictions/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { year, month, confidence, triggerType, limit } = req.query;

    const where = { departmentId: parseInt(departmentId) };

    if (year) where.targetYear = parseInt(year);
    if (month) where.targetMonth = parseInt(month);
    if (confidence) where.confidence = confidence;
    if (triggerType) where.triggerType = triggerType;

    const predictions = await prisma.budgetPrediction.findMany({
      where,
      include: {
        department: true
      },
      orderBy: [
        { targetYear: 'desc' },
        { targetMonth: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    });

    res.json({
      success: true,
      data: predictions.map(p => ({
        ...p,
        predictedAmount: parseFloat(p.predictedAmount)
      }))
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch predictions',
      error: error.message
    });
  }
});

// GET /api/department-budget/predictions/single/:id - Get single prediction by ID
router.get('/predictions/single/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const prediction = await prisma.budgetPrediction.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: true
      }
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...prediction,
        predictedAmount: parseFloat(prediction.predictedAmount)
      }
    });
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction',
      error: error.message
    });
  }
});

// GET /api/department-budget/historical/:departmentId - Get historical comparison data
router.get('/historical/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { preset, startDate, endDate } = req.query;

    // Validate departmentId
    const deptId = parseInt(departmentId);
    if (isNaN(deptId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID'
      });
    }

    // Check department exists
    const department = await prisma.department.findUnique({
      where: { id: deptId }
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Validate date format if custom range provided
    if (startDate && endDate) {
      const dateRegex = /^\d{4}-\d{2}$/;
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM'
        });
      }
    }

    let periodConditions = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const addRecentMonths = (count) => {
      for (let i = count - 1; i >= 0; i--) {
        let month = currentMonth - i;
        let year = currentYear;
        while (month <= 0) {
          month += 12;
          year -= 1;
        }
        periodConditions.push({ year, month });
      }
    };

    if (preset === 'last-3-months') {
      addRecentMonths(3);
    } else if (preset === 'last-6-months' || !preset) {
      addRecentMonths(6);
    } else if (preset === 'last-12-months') {
      addRecentMonths(12);
    } else if (preset === 'year-over-year') {
      periodConditions = [
        { year: currentYear, month: currentMonth },
        { year: currentYear - 1, month: currentMonth }
      ];
    } else if (startDate && endDate) {
      const [startYear, startMonth] = startDate.split('-').map(Number);
      const [endYear, endMonth] = endDate.split('-').map(Number);

      let year = startYear;
      let month = startMonth;

      while (year < endYear || (year === endYear && month <= endMonth)) {
        periodConditions.push({ year, month });
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }

      dateFilter = { OR: conditions };
    }

    const historicalBudgets = await prisma.monthlyBudget.findMany({
      where: {
        departmentId: deptId,
        ...(periodConditions.length > 0 ? { OR: periodConditions } : {})
      },
      include: {
        department: true
      },
      orderBy: [
        { year: 'asc' },
        { month: 'asc' }
      ]
    });

    const purchaseRequests = await prisma.purchaseRequestRecord.findMany({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, payload: true }
    });
    const departmentNames = new Set([department.code, department.name]
      .filter(Boolean)
      .map(value => String(value).trim().toLowerCase()));
    const spendingByPeriod = new Map();

    for (const request of purchaseRequests) {
      const payload = request.payload || {};
      const requestDepartment = String(payload.department || '').trim().toLowerCase();
      const status = String(payload.status || '').trim().toUpperCase();
      if (status !== 'APPROVED' || !departmentNames.has(requestDepartment)) continue;

      const recordDate = new Date(payload.createdAt || request.createdAt);
      if (Number.isNaN(recordDate.getTime())) continue;

      const year = recordDate.getFullYear();
      const month = recordDate.getMonth() + 1;
      const period = `${year}-${String(month).padStart(2, '0')}`;
      if (periodConditions.length > 0 && !periodConditions.some(item => item.year === year && item.month === month)) continue;

      const items = Array.isArray(payload.lineItems)
        ? payload.lineItems
        : Array.isArray(payload.items) ? payload.items : [];
      const amount = items.reduce((total, item) => {
        const quantity = new Decimal(item.quantity || 0);
        const unitPrice = new Decimal(item.unitPrice || 0);
        return total.plus(quantity.times(unitPrice));
      }, new Decimal(0));

      spendingByPeriod.set(period, (spendingByPeriod.get(period) || new Decimal(0)).plus(amount));
    }

    const budgetByPeriod = new Map(historicalBudgets.map(budget => [
      `${budget.year}-${String(budget.month).padStart(2, '0')}`,
      budget
    ]));
    const periods = periodConditions.length > 0
      ? periodConditions
      : Array.from(new Set([
          ...historicalBudgets.map(budget => `${budget.year}-${String(budget.month).padStart(2, '0')}`),
          ...spendingByPeriod.keys()
        ])).sort().map(period => {
          const [year, month] = period.split('-').map(Number);
          return { year, month };
        });

    const historicalData = periods.map(({ year, month }) => {
      const period = `${year}-${String(month).padStart(2, '0')}`;
      const budget = budgetByPeriod.get(period);
      const allocated = budget ? Number(budget.allocatedAmount) : 0;
      const reserved = budget ? Number(budget.reservedAmount) : 0;
      const spent = (spendingByPeriod.get(period) || new Decimal(0)).toDecimalPlaces(2).toNumber();
      const hasAllocatedBudget = Boolean(budget);
      const remaining = hasAllocatedBudget ? allocated - spent - reserved : 0;
      const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;

      return {
        year,
        month,
        period,
        allocatedAmount: allocated,
        spentAmount: spent,
        remainingAmount: remaining,
        hasAllocatedBudget,
        utilization: Math.round(utilization * 100) / 100
      };
    });

    const budgetedData = historicalData.filter(item => item.hasAllocatedBudget);

    const summary = {
      totalPeriods: historicalData.length,
      budgetedPeriods: budgetedData.length,
      avgAllocated: historicalData.length > 0
        ? Math.round((historicalData.reduce((sum, d) => sum + d.allocatedAmount, 0) / historicalData.length) * 100) / 100
        : 0,
      avgSpent: historicalData.length > 0
        ? Math.round((historicalData.reduce((sum, d) => sum + d.spentAmount, 0) / historicalData.length) * 100) / 100
        : 0,
      avgUtilization: budgetedData.length > 0
        ? Math.round((budgetedData.reduce((sum, d) => sum + d.utilization, 0) / budgetedData.length) * 100) / 100
        : 0,
      totalAllocated: Math.round(historicalData.reduce((sum, d) => sum + d.allocatedAmount, 0) * 100) / 100,
      totalSpent: Math.round(historicalData.reduce((sum, d) => sum + d.spentAmount, 0) * 100) / 100
    };

    res.json({
      success: true,
      data: {
        historicalData,
        summary
      }
    });
  } catch (error) {
    console.error('Historical comparison error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
      error: error.message
    });
  }
});

// GET /api/department-budget/spending-trends/:departmentId - Get spending trends by category and month
router.get('/spending-trends/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate departmentId
    const deptId = parseInt(departmentId);
    if (isNaN(deptId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID'
      });
    }

    // Get department to match against payload.departmentId
    const department = await prisma.department.findUnique({
      where: { id: deptId }
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Validate date format if provided
    if (startDate && endDate) {
      const dateRegex = /^\d{4}-\d{2}$/;
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM'
        });
      }
    }

    // Date filter for createdAt
    let dateFilter = {};
    if (startDate && endDate) {
      const [startYear, startMonth] = startDate.split('-').map(Number);
      const [endYear, endMonth] = endDate.split('-').map(Number);

      const startDateObj = new Date(startYear, startMonth - 1, 1);
      const endDateObj = new Date(endYear, endMonth, 0, 23, 59, 59);

      dateFilter = {
        createdAt: {
          gte: startDateObj,
          lte: endDateObj
        }
      };
    }

    const records = await prisma.purchaseRequestRecord.findMany({
      where: dateFilter,
      orderBy: { createdAt: 'asc' }
    });

    // Filter by department and APPROVED status, then aggregate
    const byCategory = {};
    const byMonth = {};

    records.forEach(record => {
      const payload = record.payload;
      const status = String(payload?.status ?? '').trim().toUpperCase();
      const recordDeptId = payload?.departmentId;

      // Only include APPROVED records for this department
      if (status !== 'APPROVED' || recordDeptId !== department.id) {
        return;
      }

      const date = new Date(record.createdAt);
      const periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const items = payload.lineItems || [];
      items.forEach(item => {
        const category = item.itemCategory || 'Uncategorized';
        const qty = parseFloat(item.quantity || 0);
        const price = parseFloat(item.unitPrice || 0);
        const amount = qty * price;

        if (!byCategory[category]) byCategory[category] = 0;
        byCategory[category] += amount;

        if (!byMonth[periodKey]) byMonth[periodKey] = 0;
        byMonth[periodKey] += amount;
      });
    });

    const categoryData = Object.entries(byCategory).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100
    })).sort((a, b) => b.amount - a.amount);

    const monthData = Object.entries(byMonth).map(([period, amount]) => ({
      period,
      amount: Math.round(amount * 100) / 100
    })).sort((a, b) => a.period.localeCompare(b.period));

    res.json({
      success: true,
      data: {
        byCategory: categoryData,
        byMonth: monthData,
        totalSpent: Math.round(Object.values(byCategory).reduce((sum, v) => sum + v, 0) * 100) / 100
      }
    });
  } catch (error) {
    console.error('Spending trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spending trends',
      error: error.message
    });
  }
});

export default router;
