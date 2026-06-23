export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  DEPARTMENT_EXECUTIVE = "Department Executive",
  ACCOUNT_PAYABLE = "Account Payable",
  TREASURY_FINANCE_OFFICER = "Treasury / Finance Officer",
  PAYMENT_TEAM = "Payment Team",
  EMPLOYEE = "Employee",
  SUPPLIER = "Supplier",
}

export const FINANCE_ROLES: readonly UserRole[] = [
  UserRole.ACCOUNT_PAYABLE,
  UserRole.TREASURY_FINANCE_OFFICER,
  UserRole.PAYMENT_TEAM,
];

export function isFinanceRole(role?: string | null): role is UserRole {
  return FINANCE_ROLES.includes(role as UserRole);
}

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}
