export type ApprovalDecisionType = "APPROVE" | "REJECT" | "SEND_BACK";

export interface PurchaseRequestApprovalRecord {
  id: string;
  requisitionId: string;
  approverId: string;
  decision: ApprovalDecisionType;
  comment?: string;
  decidedAt: Date;
}
