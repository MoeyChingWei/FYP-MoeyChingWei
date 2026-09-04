export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  DEPARTMENT_EXECUTIVE = "Department Executive",
  TREASURY_FINANCE_OFFICER = "Treasury / Finance Officer",
  PAYMENT_TEAM = "Payment Team",
  EMPLOYEE = "Employee",
  SUPPLIER = "Supplier",
}

export const FINANCE_ROLES: readonly UserRole[] = [
  UserRole.TREASURY_FINANCE_OFFICER,
  UserRole.PAYMENT_TEAM,
];

export function isFinanceRole(role?: string | null): role is UserRole {
  return FINANCE_ROLES.includes(role as UserRole);
}

/** Returns true when a user's department is the Finance department. */
export function isFinanceDepartment(department?: string | null): boolean {
  const normalized = String(department ?? "").trim().toLowerCase();
  return normalized === "finance" || normalized === "fin";
}

/** Finance module visibility is restricted to Finance roles in the Finance department. */
export function canAccessFinanceModule(
  role?: string | null,
  department?: string | null,
): boolean {
  return role === UserRole.ADMIN || (isFinanceRole(role) && isFinanceDepartment(department));
}

/** Roles permitted to access the Budget Management workspace and its subpages. */
export function canAccessBudgetManagement(role?: string | null): boolean {
  return [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.DEPARTMENT_EXECUTIVE,
    ...FINANCE_ROLES,
  ].includes(role as UserRole);
}

export function canApproveSupplierInvoices(role?: string | null): boolean {
  return role === UserRole.TREASURY_FINANCE_OFFICER || role === UserRole.ADMIN;
}

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}
