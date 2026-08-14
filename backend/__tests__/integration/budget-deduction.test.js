import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../../config/prisma.js';
import { deductBudgetForPR } from '../../services/budget-deduction-service.js';

describe("Budget Deduction on PR Approval Integration", () => {
  let testDepartment;
  let testUser;
  let testBudget;

  beforeAll(async () => {
    testDepartment = await prisma.department.create({
      data: {
        code: "TEST_DEDUCT",
        name: "Test Deduction Department",
        isActive: true
      }
    });

    testUser = await prisma.user.create({
      data: {
        email: `test-deduct-${Date.now()}@example.com`,
        password: "hashedpass",
        name: "Test User",
        role: "Department Executive",
        department: testDepartment.code,
        isActive: true
      }
    });

    const now = new Date();
    testBudget = await prisma.monthlyBudget.create({
      data: {
        departmentId: testDepartment.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        allocatedAmount: 100000,
        spentAmount: 30000,
        reservedAmount: 25000,
        lastNotifiedThreshold: 0
      }
    });
  });

  afterAll(async () => {
    await prisma.purchaseRequestRecord.deleteMany({
      where: {
        payload: {
          path: ["department"],
          equals: testDepartment.code
        }
      }
    });
    await prisma.notification.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.monthlyBudget.deleteMany({
      where: { departmentId: testDepartment.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    await prisma.department.delete({
      where: { id: testDepartment.id }
    });
    await prisma.$disconnect();
  });

  describe("Budget Deduction", () => {
    it("should deduct budget when PR is approved", async () => {
      const initialSpent = testBudget.spentAmount;

      const prPayload = {
        localId: `PR-DEDUCT-${Date.now()}`,
        requesterName: testUser.name,
        department: testDepartment.code,
        status: "APPROVED",
        requestedBy: testUser.id,
        createdAt: new Date().toISOString(),
        lineItems: [
          { itemName: "Laptop", quantity: 2, unitPrice: 1500, itemCategory: "Electronics" },
          { itemName: "Monitor", quantity: 4, unitPrice: 500, itemCategory: "Electronics" }
        ]
      };

      // Create approved PR
      await prisma.purchaseRequestRecord.create({
        data: {
          localId: prPayload.localId,
          payload: prPayload
        }
      });

      // Trigger budget deduction
      const result = await deductBudgetForPR(prPayload);

      expect(result.success).toBe(true);
      expect(result.deductedAmount).toBe(5000); // 2*1500 + 4*500

      // Verify budget updated
      const updatedBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(Number(updatedBudget.spentAmount)).toBe(Number(initialSpent) + 5000);

      // No threshold notification should be sent (still at 35%)
      const notification = await prisma.notification.findFirst({
        where: {
          type: { in: ["BUDGET_THRESHOLD_WARNING", "BUDGET_EXCEEDED"] },
          refType: "monthly_budget",
          refId: String(testBudget.id)
        }
      });

      expect(notification).toBeFalsy();
    });

    it("should send warning notification when crossing 80% threshold", async () => {
      // Reset budget to trigger 80% threshold
      await prisma.monthlyBudget.update({
        where: { id: testBudget.id },
        data: {
          spentAmount: 70000,
          lastNotifiedThreshold: 0
        }
      });

      const prPayload = {
        localId: `PR-WARNING-${Date.now()}`,
        requesterName: testUser.name,
        department: testDepartment.code,
        status: "APPROVED",
        requestedBy: testUser.id,
        createdAt: new Date().toISOString(),
        lineItems: [
          { itemName: "Server", quantity: 1, unitPrice: 15000, itemCategory: "Hardware" }
        ]
      };

      await prisma.purchaseRequestRecord.create({
        data: {
          localId: prPayload.localId,
          payload: prPayload
        }
      });

      // Trigger deduction (will cross 80% threshold)
      const result = await deductBudgetForPR(prPayload);

      expect(result.success).toBe(true);

      // Verify budget at 85%
      const updatedBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(Number(updatedBudget.spentAmount)).toBe(85000);
      expect(updatedBudget.lastNotifiedThreshold).toBe(80);

      // Verify warning notification sent
      const notification = await prisma.notification.findFirst({
        where: {
          type: "BUDGET_THRESHOLD_WARNING",
          refType: "monthly_budget",
          refId: String(testBudget.id)
        }
      });

      expect(notification).toBeTruthy();
      expect(notification.message).toContain("80%");
    });

    it("should send exceeded notification when crossing 100% threshold", async () => {
      // Reset budget to trigger 100% threshold
      await prisma.monthlyBudget.update({
        where: { id: testBudget.id },
        data: {
          spentAmount: 95000,
          lastNotifiedThreshold: 80
        }
      });

      const prPayload = {
        localId: `PR-EXCEEDED-${Date.now()}`,
        requesterName: testUser.name,
        department: testDepartment.code,
        status: "APPROVED",
        requestedBy: testUser.id,
        createdAt: new Date().toISOString(),
        lineItems: [
          { itemName: "Software License", quantity: 1, unitPrice: 10000, itemCategory: "Software" }
        ]
      };

      await prisma.purchaseRequestRecord.create({
        data: {
          localId: prPayload.localId,
          payload: prPayload
        }
      });

      // Trigger deduction (will cross 100% threshold)
      const result = await deductBudgetForPR(prPayload);

      expect(result.success).toBe(true);

      // Verify budget at 105%
      const updatedBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(Number(updatedBudget.spentAmount)).toBe(105000);
      expect(updatedBudget.lastNotifiedThreshold).toBe(100);

      // Verify exceeded notification sent
      const notification = await prisma.notification.findFirst({
        where: {
          type: "BUDGET_EXCEEDED",
          refType: "monthly_budget",
          refId: String(testBudget.id)
        }
      });

      expect(notification).toBeTruthy();
      expect(notification.message).toContain("105%");
      expect(notification.message).toContain("exceeded");
    });

    it("should not send duplicate notifications", async () => {
      // Set budget already at 85% with notification sent
      await prisma.monthlyBudget.update({
        where: { id: testBudget.id },
        data: {
          spentAmount: 85000,
          lastNotifiedThreshold: 80
        }
      });

      // Delete previous notifications for clean test
      await prisma.notification.deleteMany({
        where: {
          refType: "monthly_budget",
          refId: String(testBudget.id)
        }
      });

      const prPayload = {
        localId: `PR-NO-DUP-${Date.now()}`,
        requesterName: testUser.name,
        department: testDepartment.code,
        status: "APPROVED",
        requestedBy: testUser.id,
        createdAt: new Date().toISOString(),
        lineItems: [
          { itemName: "Supplies", quantity: 1, unitPrice: 2000, itemCategory: "Office" }
        ]
      };

      await prisma.purchaseRequestRecord.create({
        data: {
          localId: prPayload.localId,
          payload: prPayload
        }
      });

      // Trigger deduction (still in 80% threshold, now at 87%)
      const result = await deductBudgetForPR(prPayload);

      expect(result.success).toBe(true);

      // Verify NO new notification sent
      const notifications = await prisma.notification.findMany({
        where: {
          type: "BUDGET_THRESHOLD_WARNING",
          refType: "monthly_budget",
          refId: String(testBudget.id)
        }
      });

      expect(notifications.length).toBe(0);

      // Verify lastNotifiedThreshold unchanged
      const updatedBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(updatedBudget.lastNotifiedThreshold).toBe(80);
    });

    it("should handle PR without department gracefully", async () => {
      const prPayload = {
        localId: `PR-NO-DEPT-${Date.now()}`,
        requesterName: testUser.name,
        department: null,
        status: "APPROVED",
        requestedBy: 99999,
        createdAt: new Date().toISOString(),
        lineItems: [
          { itemName: "Item", quantity: 1, unitPrice: 100, itemCategory: "Misc" }
        ]
      };

      const result = await deductBudgetForPR(prPayload);

      expect(result.success).toBe(false);
      expect(result.reason).toContain("department");
    });

    it("should handle non-approved PR status", async () => {
      const prPayload = {
        localId: `PR-PENDING-${Date.now()}`,
        requesterName: testUser.name,
        department: testDepartment.code,
        status: "PENDING",
        requestedBy: testUser.id,
        createdAt: new Date().toISOString(),
        lineItems: [
          { itemName: "Item", quantity: 1, unitPrice: 100, itemCategory: "Misc" }
        ]
      };

      const result = await deductBudgetForPR(prPayload);

      expect(result.success).toBe(false);
      expect(result.reason).toContain("not approved");
    });
  });

  describe("Atomic Budget Updates", () => {
    it("should handle concurrent deductions atomically", async () => {
      // Reset budget
      await prisma.monthlyBudget.update({
        where: { id: testBudget.id },
        data: {
          spentAmount: 50000,
          lastNotifiedThreshold: 0
        }
      });

      // Create multiple PRs
      const pr1 = {
        localId: `PR-ATOMIC-1-${Date.now()}`,
        requesterName: testUser.name,
        department: testDepartment.code,
        status: "APPROVED",
        requestedBy: testUser.id,
        createdAt: new Date().toISOString(),
        lineItems: [{ itemName: "Item1", quantity: 1, unitPrice: 5000, itemCategory: "Test" }]
      };

      const pr2 = {
        localId: `PR-ATOMIC-2-${Date.now()}`,
        requesterName: testUser.name,
        department: testDepartment.code,
        status: "APPROVED",
        requestedBy: testUser.id,
        createdAt: new Date().toISOString(),
        lineItems: [{ itemName: "Item2", quantity: 1, unitPrice: 3000, itemCategory: "Test" }]
      };

      await prisma.purchaseRequestRecord.createMany({
        data: [
          { localId: pr1.localId, payload: pr1 },
          { localId: pr2.localId, payload: pr2 }
        ]
      });

      // Trigger concurrent deductions
      const results = await Promise.all([
        deductBudgetForPR(pr1),
        deductBudgetForPR(pr2)
      ]);

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);

      // Verify final budget reflects both deductions
      const finalBudget = await prisma.monthlyBudget.findUnique({
        where: { id: testBudget.id }
      });

      expect(Number(finalBudget.spentAmount)).toBe(58000); // 50000 + 5000 + 3000
    });
  });
});
