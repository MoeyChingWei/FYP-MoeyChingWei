import express from 'express';
import prisma from '../config/prisma.js';
import Decimal from 'decimal.js';
import { generateDepartmentPrediction, generatePredictionsForAllDepartments } from '../services/budget-prediction-service.js';
import {
  notifyBudgetAdjustmentRequested,
  notifyBudgetAdjustmentApproved,
  notifyBudgetAdjustmentRejected
} from '../services/notification-service.js';
import { deductBudgetForPR } from '../services/budget-deduction-service.js';
import { authenticateRequest, requireRoles } from '../middleware/auth.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

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

// POST /api/department-budget/predict/manual - Trigger manual prediction
router.post('/predict/manual', async (req, res) => {
  try {
    const { departmentCode, targetYear, targetMonth, userId } = req.body;

    if (!departmentCode || !targetYear || !targetMonth || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: departmentCode, targetYear, targetMonth, userId'
      });
    }

    const prediction = await generateDepartmentPrediction(
      departmentCode,
      parseInt(targetYear),
      parseInt(targetMonth),
      parseInt(userId)
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
router.post('/adjustments', requireRoles([ROLES.DEPARTMENT_EXECUTIVE]), async (req, res) => {
  try {
    const { departmentId, targetYear, targetMonth, requestType, requestedAmount, reason, requestedBy } = req.body;

    if (!departmentId || !targetYear || !targetMonth || !requestType || !requestedAmount || !reason || !requestedBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
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

    // Check for duplicate increase requests for same period
    if (requestType === 'increase') {
      const existingIncreaseRequest = await prisma.budgetAdjustmentRequest.findFirst({
        where: {
          departmentId: parseInt(departmentId),
          targetYear: parseInt(targetYear),
          targetMonth: parseInt(targetMonth),
          requestType: 'increase',
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
        targetYear: parseInt(targetYear),
        targetMonth: parseInt(targetMonth),
        requestType,
        requestedAmount: amount.toNumber(),
        reason,
        requestedBy: parseInt(requestedBy),
        status: 'pending'
      },
      include: {
        department: true,
        requester: true
      }
    });

    // Notify finance managers in parallel
    const financeManagers = await prisma.user.findMany({
      where: { role: ROLES.TREASURY_FINANCE_OFFICER, isActive: true }
    });

    if (financeManagers.length > 0) {
      await Promise.all(
        financeManagers.map(fm =>
          notifyBudgetAdjustmentRequested(
            fm.id,
            fm.role,
            department.name,
            parseInt(targetYear),
            parseInt(targetMonth),
            amount.toNumber(),
            reason,
            adjustment.id
          ).catch(err => {
            console.error(`Failed to notify finance manager ${fm.id}:`, err);
            // Don't fail the request if notification fails
          })
        )
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
router.patch('/adjustments/:id/approve', requireRoles([ROLES.TREASURY_FINANCE_OFFICER, ROLES.BUDGET_CONTROLLER]), async (req, res) => {
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

    const adjustment = await prisma.budgetAdjustmentRequest.findUnique({
      where: { id: parseInt(id) },
      include: { department: true }
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
          requester: true,
          reviewer: true
        }
      });

      // Update monthly budget
      const budget = await tx.monthlyBudget.findUnique({
        where: {
          departmentId_year_month: {
            departmentId: adjustment.departmentId,
            year: adjustment.targetYear,
            month: adjustment.targetMonth
          }
        }
      });

      if (!budget) {
        throw new Error('Monthly budget not found for target period');
      }

      const updatedBudget = await tx.monthlyBudget.update({
        where: { id: budget.id },
        data: {
          allocatedAmount: {
            increment: adjustment.requestedAmount
          }
        }
      });

      return { updatedAdjustment, updatedBudget };
    });

    // Notify requester after successful transaction
    await notifyBudgetAdjustmentApproved(
      adjustment.requestedBy,
      adjustment.department.name,
      adjustment.targetYear,
      adjustment.targetMonth,
      adjustment.requestedAmount,
      result.updatedBudget.allocatedAmount,
      adjustment.id
    );

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
router.patch('/adjustments/:id/reject', requireRoles([ROLES.TREASURY_FINANCE_OFFICER, ROLES.BUDGET_CONTROLLER]), async (req, res) => {
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

    const adjustment = await prisma.budgetAdjustmentRequest.findUnique({
      where: { id: parseInt(id) },
      include: { department: true }
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
    const remaining = allocated.minus(spent);
    const usagePercentage = spent.dividedBy(allocated).times(100);

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

    let dateFilter = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (preset === 'last-3-months') {
      const conditions = [];
      for (let i = 0; i < 3; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month <= 0) {
          month += 12;
          year -= 1;
        }
        conditions.push({ year, month });
      }
      dateFilter = { OR: conditions };
    } else if (preset === 'last-6-months') {
      const conditions = [];
      for (let i = 0; i < 6; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month <= 0) {
          month += 12;
          year -= 1;
        }
        conditions.push({ year, month });
      }
      dateFilter = { OR: conditions };
    } else if (preset === 'year-over-year') {
      dateFilter = {
        OR: [
          { year: currentYear, month: currentMonth },
          { year: currentYear - 1, month: currentMonth }
        ]
      };
    } else if (startDate && endDate) {
      const [startYear, startMonth] = startDate.split('-').map(Number);
      const [endYear, endMonth] = endDate.split('-').map(Number);

      const conditions = [];
      let year = startYear;
      let month = startMonth;

      while (year < endYear || (year === endYear && month <= endMonth)) {
        conditions.push({ year, month });
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
        ...dateFilter
      },
      include: {
        department: true
      },
      orderBy: [
        { year: 'asc' },
        { month: 'asc' }
      ]
    });

    const historicalData = historicalBudgets.map(b => {
      const allocated = parseFloat(b.allocatedAmount);
      const spent = parseFloat(b.spentAmount);
      const reserved = parseFloat(b.reservedAmount);
      const remaining = allocated - spent - reserved;
      const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;

      return {
        year: b.year,
        month: b.month,
        period: `${b.year}-${String(b.month).padStart(2, '0')}`,
        allocatedAmount: allocated,
        spentAmount: spent,
        remainingAmount: remaining,
        utilization: Math.round(utilization * 100) / 100
      };
    });

    const summary = {
      totalPeriods: historicalData.length,
      avgAllocated: historicalData.length > 0
        ? Math.round((historicalData.reduce((sum, d) => sum + d.allocatedAmount, 0) / historicalData.length) * 100) / 100
        : 0,
      avgSpent: historicalData.length > 0
        ? Math.round((historicalData.reduce((sum, d) => sum + d.spentAmount, 0) / historicalData.length) * 100) / 100
        : 0,
      avgUtilization: historicalData.length > 0
        ? Math.round((historicalData.reduce((sum, d) => sum + d.utilization, 0) / historicalData.length) * 100) / 100
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
