export enum UserRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  DEPARTMENT_EXECUTIVE = "Department Executive",
  EMPLOYEE = "Employee",
  SUPPLIER = "Supplier",
}

export interface AppUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}

