import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import express from 'express';
import departmentBudgetRouter from '../../routes/department-budget.js';

const app = express();
app.use(express.json());

let currentMockUser = null;

// Mock authentication middleware for tests - uses currentMockUser
app.use((req, res, next) => {
  if (currentMockUser) {
    req.user = currentMockUser;
    // Also set req.auth for requireRoles middleware
    req.auth = {
      userId: currentMockUser.id,
      email: currentMockUser.email
    };
  } else {
    // Default fallback
    req.user = {
      id: 1,
      email: 'test@example.com',
      role: 'Department Executive',
      isActive: true
    };
    req.auth = {
      userId: 1,
      email: 'test@example.com'
    };
  }
  next();
});

app.use('/api/department-budget', departmentBudgetRouter);

let prisma;
let testDepartment;
let testUser;
let financeUser;
let testBudget;

// Import prisma
beforeAll(async () => {
  const prismaModule = await import("../../config/prisma.js");
  prisma = prismaModule.default;

  // Create test department
  testDepartment = await prisma.department.create({
    data: {
      code: "TEST_ADJ",
      name: "Test Adjustment Department",
      isActive: true,
      updatedAt: new Date(),
    }
  });

  // Create test users
  testUser = await prisma.user.create({
    data: {
      email: `dept-exec-${Date.now()}@example.com`,
      password: "hashedpass",
      name: "Department Executive",
      role: "Department Executive",
      department: testDepartment.code,
      isActive: true
    }
  });

  financeUser = await prisma.user.create({
    data: {
      email: `finance-mgr-${Date.now()}@example.com`,
      password: "hashedpass",
      name: "Finance Manager",
      role: "Treasury / Finance Officer",
      isActive: true
    }
  });

  // Set default mock user to testUser
  currentMockUser = {
    id: testUser.id,
    email: testUser.email,
    role: testUser.role,
    department: testUser.department,
    isActive: true
  };

  // Create test budget
  const now = new Date();
  testBudget = await prisma.monthlyBudget.create({
    data: {
      departmentId: testDepartment.id,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      allocatedAmount: 50000,
      spentAmount: 30000,
      reservedAmount: 25000,
      updatedAt: new Date(),
    }
  });
});

afterAll(async () => {
  // Cleanup
  await prisma.budgetAdjustmentRequest.deleteMany({
    where: { departmentId: testDepartment.id }
  });
  await prisma.notification.deleteMany({
    where: { userId: { in: [testUser.id, financeUser.id] } }
  });
  await prisma.monthlyBudget.deleteMany({
    where: { departmentId: testDepartment.id }
  });
  await prisma.department.delete({
    where: { id: testDepartment.id }
  });
  await prisma.user.deleteMany({
    where: { id: { in: [testUser.id, financeUser.id] } }
  });
  await prisma.$disconnect();
});

describe("Budget Adjustment Approval Workflow Integration", () => {
  describe("Submit Adjustment Request", () => {
    it("should create adjustment request and notify finance manager", async () => {
      const response = await request(app)
        .post("/api/department-budget/adjustments")
        .send({
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "increase",
          requestedAmount: 10000,
          reason: "Unexpected equipment purchase required for Q1 project delivery",
          requestedBy: testUser.id
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.status).toBe("pending");

      const requestId = response.body.data.id;

      // Verify request saved in database
      const savedRequest = await prisma.budgetAdjustmentRequest.findUnique({
        where: { id: requestId }
      });

      expect(savedRequest).toBeTruthy();
      expect(savedRequest.departmentId).toBe(testDepartment.id);
      expect(Number(savedRequest.requestedAmount)).toBe(10000);
      expect(savedRequest.status).toBe("pending");

      // Verify notification sent to finance manager
      const notifications = await prisma.notification.findMany({
        where: {
          type: "BUDGET_ADJUSTMENT_REQUESTED",
          refType: "budget_adjustment_request",
          refId: String(requestId)
        }
      });

      // Should have created notifications for finance managers
      expect(notifications.length).toBeGreaterThan(0);

      // Cleanup
      await prisma.budgetAdjustmentRequest.delete({ where: { id: requestId } });
    });

    it("should reject invalid adjustment request", async () => {
      const response = await request(app)
        .post("/api/department-budget/adjustments")
        .send({
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "increase",
          requestedAmount: -5000, // Invalid negative amount
          reason: "Too short", // Reason too short
          requestedBy: testUser.id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Approve Adjustment Request", () => {
    let pendingRequest;

    beforeEach(async () => {
      // Switch to finance user for approval operations
      currentMockUser = {
        id: financeUser.id,
        email: financeUser.email,
        role: financeUser.role,
        isActive: true
      };

      // Create pending request
      pendingRequest = await prisma.budgetAdjustmentRequest.create({
        data: {
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "increase",
          requestedAmount: 15000,
          reason: "Additional funding needed for critical infrastructure upgrade",
          status: "pending",
          requestedBy: testUser.id
        }
      });
    });

    afterEach(async () => {
      // Reset mock user back to testUser
      currentMockUser = {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        department: testUser.department,
        isActive: true
      };

      await prisma.budgetAdjustmentRequest.deleteMany({
        where: { id: pendingRequest.id }
      });
    });

    it("should approve request, update budget, and notify requester", async () => {
      const initialBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });
      const initialAllocated = Number(initialBudget.allocatedAmount);

      const response = await request(app)
        .patch(`/api/department-budget/adjustments/${pendingRequest.id}/approve`)
        .send({
          reviewedBy: financeUser.id,
          reviewComment: "Approved for Q1 infrastructure needs"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify request status updated
      const updatedRequest = await prisma.budgetAdjustmentRequest.findUnique({
        where: { id: pendingRequest.id }
      });

      expect(updatedRequest.status).toBe("approved");
      expect(updatedRequest.reviewedBy).toBe(financeUser.id);
      expect(updatedRequest.reviewNotes).toBe("Approved for Q1 infrastructure needs");
      expect(updatedRequest.reviewedAt).toBeTruthy();

      // Verify budget updated atomically
      const updatedBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(Number(updatedBudget.allocatedAmount)).toBe(initialAllocated + 15000);

      // Verify notification sent to requester
      const notification = await prisma.notification.findFirst({
        where: {
          userId: testUser.id,
          type: "BUDGET_ADJUSTMENT_APPROVED",
          refType: "budget_adjustment_request",
          refId: String(pendingRequest.id)
        }
      });

      expect(notification).toBeTruthy();
      expect(notification.title).toContain("Approved");

      // Restore budget for other tests
      await prisma.monthlyBudget.update({
        where: { id: testBudget.id },
        data: { allocatedAmount: initialAllocated }
      });
    });

    it("should prevent double approval", async () => {
      // Approve first time
      await request(app)
        .patch(`/api/department-budget/adjustments/${pendingRequest.id}/approve`)
        .send({
          reviewedBy: financeUser.id,
          reviewComment: "First approval"
        });

      // Get current budget to restore later
      const budgetAfterFirst = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      // Try to approve again
      const response = await request(app)
        .patch(`/api/department-budget/adjustments/${pendingRequest.id}/approve`)
        .send({
          reviewedBy: financeUser.id,
          reviewComment: "Second approval attempt"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already been reviewed");

      // Restore budget
      await prisma.monthlyBudget.update({
        where: { id: testBudget.id },
        data: { allocatedAmount: Number(budgetAfterFirst.allocatedAmount) - 15000 }
      });
    });
  });

  describe("Reject Adjustment Request", () => {
    let pendingRequest;

    beforeEach(async () => {
      // Switch to finance user for rejection operations
      currentMockUser = {
        id: financeUser.id,
        email: financeUser.email,
        role: financeUser.role,
        isActive: true
      };

      pendingRequest = await prisma.budgetAdjustmentRequest.create({
        data: {
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "additional",
          requestedAmount: 20000,
          reason: "Additional staffing costs for new project phase",
          status: "pending",
          requestedBy: testUser.id
        }
      });
    });

    afterEach(async () => {
      // Reset mock user back to testUser
      currentMockUser = {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        department: testUser.department,
        isActive: true
      };

      await prisma.budgetAdjustmentRequest.deleteMany({
        where: { id: pendingRequest.id }
      });
    });

    it("should reject request, not update budget, and notify requester", async () => {
      const initialBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });
      const initialAllocated = Number(initialBudget.allocatedAmount);

      const response = await request(app)
        .patch(`/api/department-budget/adjustments/${pendingRequest.id}/reject`)
        .send({
          reviewedBy: financeUser.id,
          reviewComment: "Insufficient justification for additional staffing budget"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify request status updated
      const updatedRequest = await prisma.budgetAdjustmentRequest.findUnique({
        where: { id: pendingRequest.id }
      });

      expect(updatedRequest.status).toBe("rejected");
      expect(updatedRequest.reviewedBy).toBe(financeUser.id);
      expect(updatedRequest.reviewedAt).toBeTruthy();

      // Verify budget NOT updated
      const updatedBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(Number(updatedBudget.allocatedAmount)).toBe(initialAllocated);

      // Verify notification sent to requester
      const notification = await prisma.notification.findFirst({
        where: {
          userId: testUser.id,
          type: "BUDGET_ADJUSTMENT_REJECTED",
          refType: "budget_adjustment_request",
          refId: String(pendingRequest.id)
        }
      });

      expect(notification).toBeTruthy();
      expect(notification.title).toContain("Rejected");
    });

    it("should require rejection comment", async () => {
      const response = await request(app)
        .patch(`/api/department-budget/adjustments/${pendingRequest.id}/reject`)
        .send({
          reviewedBy: financeUser.id,
          reviewComment: "" // Empty comment
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Multiple Adjustment Requests", () => {
    beforeEach(() => {
      // Reset mock user to testUser before each test
      currentMockUser = {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        department: testUser.department,
        isActive: true
      };
    });

    it("should handle multiple additional requests for same period", async () => {
      const initialBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });
      const initialAllocated = Number(initialBudget.allocatedAmount);

      // Submit first additional request
      const response1 = await request(app)
        .post("/api/department-budget/adjustments")
        .send({
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "additional",
          requestedAmount: 5000,
          reason: "First additional request for emergency supplies",
          requestedBy: testUser.id
        });

      expect(response1.status).toBe(201);
      const request1Id = response1.body.data.id;

      // Switch to finance user for approval
      currentMockUser = {
        id: financeUser.id,
        email: financeUser.email,
        role: financeUser.role,
        isActive: true
      };

      // Approve first request
      await request(app)
        .patch(`/api/department-budget/adjustments/${request1Id}/approve`)
        .send({
          reviewedBy: financeUser.id,
          reviewComment: "Approved"
        });

      // Reset mock user back to testUser for second request
      currentMockUser = {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        department: testUser.department,
        isActive: true
      };

      // Submit second additional request
      const response2 = await request(app)
        .post("/api/department-budget/adjustments")
        .send({
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "additional",
          requestedAmount: 3000,
          reason: "Second additional request for consultant fees",
          requestedBy: testUser.id
        });

      expect(response2.status).toBe(201);
      const request2Id = response2.body.data.id;

      // Switch back to finance user for second approval
      currentMockUser = {
        id: financeUser.id,
        email: financeUser.email,
        role: financeUser.role,
        isActive: true
      };

      // Approve second request
      await request(app)
        .patch(`/api/department-budget/adjustments/${request2Id}/approve`)
        .send({
          reviewedBy: financeUser.id,
          reviewComment: "Approved"
        });

      // Verify budget updated correctly with both increases
      const updatedBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(Number(updatedBudget.allocatedAmount)).toBe(initialAllocated + 5000 + 3000);

      // Cleanup
      await prisma.budgetAdjustmentRequest.deleteMany({
        where: { id: { in: [request1Id, request2Id] } }
      });

      // Restore budget
      await prisma.monthlyBudget.update({
        where: { id: testBudget.id },
        data: { allocatedAmount: initialAllocated }
      });

      // Reset mock user
      currentMockUser = {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role,
        department: testUser.department,
        isActive: true
      };
    });

    it("should reject second increase request for same period", async () => {
      const initialBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });
      const initialAllocated = Number(initialBudget.allocatedAmount);

      // Submit first increase request
      const response1 = await request(app)
        .post("/api/department-budget/adjustments")
        .send({
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "increase",
          requestedAmount: 10000,
          reason: "First increase request for facility upgrade",
          requestedBy: testUser.id
        });

      expect(response1.status).toBe(201);
      const request1Id = response1.body.data.id;

      // Try to submit second increase request
      const response2 = await request(app)
        .post("/api/department-budget/adjustments")
        .send({
          departmentId: testDepartment.id,
          targetYear: testBudget.year,
          targetMonth: testBudget.month,
          requestType: "increase",
          requestedAmount: 8000,
          reason: "Second increase request should be rejected",
          requestedBy: testUser.id
        });

      expect(response2.status).toBe(400);
      expect(response2.body.success).toBe(false);
      expect(response2.body.message).toContain("already has a pending or approved increase request");

      // Cleanup
      await prisma.budgetAdjustmentRequest.delete({
        where: { id: request1Id }
      });
    });
  });
});
