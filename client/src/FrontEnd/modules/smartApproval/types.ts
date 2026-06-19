/**
 * Smart Approval — workflow rules, biometric gates, and AI-assisted hints.
 */

export type ApprovalRuleTrigger = "AMOUNT_THRESHOLD" | "DEPARTMENT" | "CATEGORY";

import type { UserRole } from "../../shared/types/roles";

export interface ApprovalRule {
  id: string;
  name: string;
  trigger: ApprovalRuleTrigger;
  /** e.g. min amount in RM */
  thresholdValue?: number;
  requiredRole: UserRole;
  requiresBiometric: boolean;
  isActive: boolean;
}

export interface ApprovalInsight {
  id: string;
  approvalId: string;
  summary: string;
  riskScore: number; // 0–1, higher = more attention
  generatedAt: Date;
}
