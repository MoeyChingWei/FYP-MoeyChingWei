export interface SessionUser {
  id: number;
  name: string | null;
  email: string;
  role: string;
  department?: string | null;
  avatarUrl?: string | null;
  isActive?: boolean;
}

const STORAGE_KEY = "erp_portal_session_user_v1";

export function setSessionUser(user: SessionUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("erp-portal-session"));
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSessionUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}
