import type { UserRole } from "../../../shared/types/roles";

/** Fine-grained action keys (extend as modules grow). */
export type Permission =
  | "users:read"
  | "users:write"
  | "purchasing:read"
  | "purchasing:write"
  | "suppliers:read"
  | "suppliers:write"
  | "approvals:configure";

/** Maps application roles to allowed permissions. */
export interface RolePermissionBinding {
  role: UserRole;
  permissions: Permission[];
}

export interface RoleDefinition {
  role: UserRole;
  label: string;
  description: string;
}

export interface AccessAuditEntry {
  id: string;
  userId: string;
  action:
    | "ROLE_CHANGED"
    | "USER_DISABLED"
    | "USER_ENABLED"
    | "LOGIN_FAILED"
    | "PERMISSION_CHANGED";
  performedBy: string;
  timestamp: Date;
  details?: string;
}
