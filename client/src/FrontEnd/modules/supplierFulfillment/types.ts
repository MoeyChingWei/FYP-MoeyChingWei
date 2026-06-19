export type SupplierStatus = "ACTIVE" | "INACTIVE" | "UNDER_REVIEW";

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactEmail: string;
  phone?: string;
  status: SupplierStatus;
  rating?: number;
  createdAt: Date;
}

export type FulfillmentStatus =
  | "PENDING"
  | "PICKING"
  | "SHIPPED"
  | "DELIVERED"
  | "EXCEPTION";

export interface FulfillmentOrder {
  id: string;
  purchaseOrderRef: string;
  supplierId: string;
  status: FulfillmentStatus;
  expectedShipDate?: Date;
  trackingNumber?: string;
  updatedAt: Date;
}
