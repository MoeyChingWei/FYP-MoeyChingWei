import express from 'express';
import prisma from '../config/prisma.js';
import Decimal from 'decimal.js';
import { generateDepartmentPrediction, generatePredictionsForAllDepartments } from '../services/budget-prediction-service.js';
import {
  notifyBudgetAdjustmentRequested,
  notifyBudgetAdjustmentApproved,
  notifyBudgetAdjustmentRejected
} from '../services/notification-service.js';

const router = express.Router();

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

    const where = { departmentId: parseInt(departmentId) };
    if (year) where.year = parseInt(year);
    if (month) where.month = parseInt(month);

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
router.post('/adjustments', async (req, res) => {
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
      where: { role: 'Treasury/Finance Officer', isActive: true }
    });

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
        )
      )
    );

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
router.patch('/adjustments/:id/approve', async (req, res) => {
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
        message: 'Request already processed'
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
router.patch('/adjustments/:id/reject', async (req, res) => {
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
        message: 'Request already processed'
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

export default router;
