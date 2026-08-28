import type { PurchaseOrderStatus } from "../types";

/** One line on a purchase request (item detail). */
export interface DraftLineItem {
  tempId: string;
  /** Inventory record used to create this line, when selected from supplier catalogue. */
  supplierInventoryItemId?: string;
  itemImageUrl?: string;
  itemName: string;
  itemDescription: string;
  itemCategory: string;
  supplierId?: number;
  supplierName?: string;
  supplierEmail?: string;
  quantity: number;
  unitOfMeasurement: string;
  unitPrice: number;
  taxType?: string;
  taxRate?: number;
  taxAmount?: number;
  amountAfterTax?: number;
}

export interface PurchaseRequestDraft {
  localId: string;
  prNumber: string;
  requestDate: string;
  requestBy: string;
  createdByUserId?: number;
  createdByEmail?: string;
  department?: string;
  companyLogo?: string;
  currency: string;
  status: PurchaseOrderStatus;
  lineItems: DraftLineItem[];
  /** Supplier-level tax, applied once to the total purchase request. */
  subtotal?: number;
  supplierTaxApplies?: boolean;
  supplierTaxType?: string;
  supplierTaxRate?: number;
  supplierTaxRules?: Array<{ taxType: string; taxRate: number }>;
  taxAmount?: number;
  amountAfterTax?: number;
  /** Payment terms selected for the whole purchase request. */
  paymentTerms?: string;
  notes?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  requesterRole: string;
  isSelfApproved?: boolean;
  /** Inventory line IDs included in this request's reservation. */
  inventoryReservedItemIds?: string[];
  inventoryReservationStatus?: "RESERVED" | "COMMITTED" | "RELEASED";
  budgetReservedAt?: string;
  budgetReleasedAt?: string;
  budgetDeductedAt?: string;
}
