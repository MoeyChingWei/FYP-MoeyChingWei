import { describe, expect, it } from "vitest";
import { canAccessFinanceModule, isFinanceDepartment, UserRole } from "./roles";

describe("Finance module visibility", () => {
  it("recognizes the Finance department name and code", () => {
    expect(isFinanceDepartment("Finance")).toBe(true);
    expect(isFinanceDepartment("FIN")).toBe(true);
    expect(isFinanceDepartment("IT")).toBe(false);
  });

  it("allows Finance department users and admins only", () => {
    expect(canAccessFinanceModule(UserRole.TREASURY_FINANCE_OFFICER, "Finance")).toBe(true);
    expect(canAccessFinanceModule(UserRole.EMPLOYEE, "Finance")).toBe(false);
    expect(canAccessFinanceModule(UserRole.MANAGER, "IT")).toBe(false);
    expect(canAccessFinanceModule(UserRole.TREASURY_FINANCE_OFFICER, "IT")).toBe(false);
    expect(canAccessFinanceModule(UserRole.ADMIN, "IT")).toBe(true);
  });
});
