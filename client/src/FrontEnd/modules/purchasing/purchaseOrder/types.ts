import type { PurchaseOrderStatus } from "../types";
import type { DraftLineItem } from "../requestCreation/types";

export interface PurchaseOrderDraft {
  localId: string;
  poNumber: string;
  sourceRequestLocalId: string;
  sourcePrNumber: string;
  sourceRequester?: string;
  createdDate: string;
  createdBy: string;
  createdByUserId?: number;
  createdByEmail?: string;
  department?: string;
  currency: string;
  status: PurchaseOrderStatus;
  lineItems: DraftLineItem[];
  /** Payment terms carried forward from the source purchase request. */
  paymentTerms?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  requesterRole: string;
  isSelfApproved?: boolean;
}
