export type PurchaseOrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "ORDERED"
  | "CLOSED";

export interface PurchaseRequisition {
  id: string;
  title: string;
  requesterId: string;
  requesterName: string;
  estimatedAmount: number;
  currency: string;
  status: PurchaseOrderStatus;
  createdAt: Date;
  department?: string;
}

export interface PurchaseLineItem {
  id: string;
  requisitionId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}
