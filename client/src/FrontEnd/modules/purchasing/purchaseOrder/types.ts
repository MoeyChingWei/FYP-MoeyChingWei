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
  companyLogo?: string;
  currency: string;
  status: PurchaseOrderStatus;
  lineItems: DraftLineItem[];
  /** Supplier-level tax applied once to the order subtotal. */
  subtotal?: number;
  supplierTaxApplies?: boolean;
  supplierTaxType?: string;
  supplierTaxRate?: number;
  supplierTaxRules?: Array<{ taxType: string; taxRate: number }>;
  taxAmount?: number;
  amountAfterTax?: number;
  /** Payment terms carried forward from the source purchase request. */
  paymentTerms?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  requesterRole: string;
  isSelfApproved?: boolean;
}
