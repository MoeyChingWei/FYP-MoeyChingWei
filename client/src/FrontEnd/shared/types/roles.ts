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

export function canApproveSupplierInvoices(role?: string | null): boolean {
  return role === UserRole.TREASURY_FINANCE_OFFICER || role === UserRole.ADMIN;
}

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}
