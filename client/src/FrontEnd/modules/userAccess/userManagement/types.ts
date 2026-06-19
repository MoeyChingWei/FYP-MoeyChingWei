import type { UserRole } from "../../../shared/types/roles";

/** System user account for admin CRUD screens. */
export interface ManagedUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserInput {
  email: string;
  fullName: string;
  role: UserRole;
  temporaryPassword?: string;
}

export interface UserListQuery {
  search?: string;
  role?: UserRole;
  activeOnly?: boolean;
}
