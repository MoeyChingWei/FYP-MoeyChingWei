import type { UserRole } from "../../../shared/types/roles";

/** Authenticated identity (session / JWT payload shape). */
export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Server-issued session handle (e.g. token id + expiry). */
export interface AuthSession {
  tokenId: string;
  issuedAt: Date;
  expiresAt: Date;
}
