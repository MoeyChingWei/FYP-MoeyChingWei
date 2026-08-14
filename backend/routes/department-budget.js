import express from 'express';
import prisma from '../config/prisma.js';
import Decimal from 'decimal.js';

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

export default router;
