import { useMemo } from "react";
import type { AuthState } from "../../userAccess/authentication";
import { UserRole } from "../../../shared/types/roles";

/**
 * Placeholder hook for future Auth integration.
 * Currently returns a hard-coded user so that
 * the rest of the UI can be developed without backend wiring.
 */
export function useAuth(): AuthState {
  const state: AuthState = useMemo(
    () => ({
      user: {
        id: "approver-1",
        displayName: "Demo User",
        email: "approver@example.com",
        role: UserRole.EMPLOYEE,
      },
      loading: false,
    }),
    [],
  );

  return state;
}

