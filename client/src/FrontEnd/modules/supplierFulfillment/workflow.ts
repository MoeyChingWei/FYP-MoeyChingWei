import type { DraftLineItem } from "../purchasing/requestCreation/types";
import type { PurchaseOrderDraft } from "../purchasing/purchaseOrder/types";
import { getCompanyAddress, getCompanyLogo, getCompanyName, getSupplierCompanyAddress, getSupplierCompanyLogo, getSupplierCompanyName } from "../settings/companyAddress";
import { sortWorkflowRowsByStatusAndDate } from "../../shared/utils/workflowSorting";
import {
  fetchWorkflowRows,
  fetchWorkflowRowsForRecovery,
  getPendingWorkflowRows,
  isWorkflowSyncEnabled,
  queueWorkflowRowsSave,
} from "../../shared/api/workflowStorage";

export type OrderAcknowledgementStatus =
  | "PENDING_ORDER_ACKNOWLEDGE"
  | "APPROVED"
  | "REJECTED";

export type DeliveryStatus = "PENDING_DELIVERY" | "DELIVERED";

export type GrnStatus = "PENDING_GRN" | "COMPLETED" | "DISCREPANCY";

export interface SupplierOrderAcknowledgementRecord {
  localId: string;
  poLocalId: string;
  poNumber: string;
  sourcePrNumber: string;
  sourceRequester?: string;
  createdDate: string;
  createdBy: string;
  department?: string;
  currency: string;
  companyName?: string;
  companyLogo?: string;
  companyAddress: string;
  supplierId?: number;
  supplierName?: string;
  supplierCompanyName?: string;
  supplierLogo?: string;
  supplierEmail?: string;
  supplierAddress?: string;
  status: OrderAcknowledgementStatus;
  rejectionReason?: string;
  rejectedBy?: string;
  items: DraftLineItem[];
}

export interface SupplierDeliveryRecord {
  localId: string;
  deliveryNo?: string;
  originalOrderNo?: string;
  acknowledgementLocalId: string;
  poLocalId: string;
  poNumber: string;
  sourcePrNumber: string;
  sourceRequester?: string;
  createdDate: string;
  createdBy: string;
  department?: string;
  currency: string;
  companyName?: string;
  companyLogo?: string;
  companyAddress: string;
  supplierId?: number;
  supplierName?: string;
  supplierCompanyName?: string;
  supplierLogo?: string;
  supplierEmail?: string;
  supplierAddress?: string;
  status: DeliveryStatus;
  items: DraftLineItem[];
  deliveredDate?: string;
}

export interface SupplierGrnRecord {
  localId: string;
  deliveryNo?: string;
  originalOrderNo?: string;
  deliveryLocalId: string;
  poLocalId: string;
  poNumber: string;
  sourcePrNumber: string;
  sourceRequester?: string;
  createdDate: string;
  createdBy: string;
  department?: string;
  currency: string;
  companyName?: string;
  companyLogo?: string;
  companyAddress: string;
  supplierId?: number;
  supplierName?: string;
  supplierCompanyName?: string;
  supplierLogo?: string;
  supplierEmail?: string;
  supplierAddress?: string;
  status: GrnStatus;
  items: DraftLineItem[];
  completedDate?: string;
  discrepancyReason?: string;
}

const ORDER_ACKS_KEY = "erp_supplier_order_acks_v1";
const DELIVERIES_KEY = "erp_supplier_deliveries_v1";
const GRNS_KEY = "erp_supplier_grns_v1";
const ORDER_ACKS_STORE = "supplier-order-acks";
const DELIVERIES_STORE = "deliveries";
const GRNS_STORE = "grns";
let supplierOrderAcknowledgementCache: SupplierOrderAcknowledgementRecord[] = [];
let supplierDeliveryCache: SupplierDeliveryRecord[] = [];
let supplierGrnCache: SupplierGrnRecord[] = [];

export { sortWorkflowRowsByStatusAndDate };

function mergeByLocalId<T extends { localId: string }>(localRows: T[], remoteRows: T[]): T[] {
  if (!localRows.length) return [...remoteRows];
  if (!remoteRows.length) return [...localRows];

  const merged = new Map<string, T>();
  for (const row of remoteRows) {
    merged.set(row.localId, row);
  }
  // Keep local rows as source of truth to avoid stale server overwrite.
  for (const row of localRows) {
    merged.set(row.localId, row);
  }
  return Array.from(merged.values());
}

function readLocalRows<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function newTempId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `tmp-${Date.now()}`;
}

function generateDeliveryNo(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DLV-${y}${m}${day}-${rand}`;
}

type SupplierBucket = {
  supplierId?: number;
  supplierName?: string;
  supplierEmail?: string;
  items: DraftLineItem[];
};

function makeSupplierKey(item: DraftLineItem): string | null {
  if (item.supplierId != null) return `id:${item.supplierId}`;
  if (item.supplierEmail) return `email:${item.supplierEmail.toLowerCase()}`;
  if (item.supplierName) return `name:${item.supplierName.toLowerCase()}`;
  return null;
}

function groupPurchaseOrderItemsBySupplier(
  order: PurchaseOrderDraft,
): SupplierBucket[] {
  const buckets = new Map<string, SupplierBucket>();

  order.lineItems.forEach((item) => {
    const key = makeSupplierKey(item);
    if (!key) return;

    const existing = buckets.get(key);
    if (existing) {
      existing.items.push({ ...item });
      return;
    }

    buckets.set(key, {
      supplierId: item.supplierId,
      supplierName: item.supplierName || (item.supplierId != null ? getSupplierCompanyName(item.supplierId) : undefined),
      supplierEmail: item.supplierEmail,
      items: [{ ...item }],
    });
  });

  return Array.from(buckets.values());
}

function parseStoredArray<T>(key: string): T[] {
  if (key === ORDER_ACKS_KEY) {
    if (!supplierOrderAcknowledgementCache.length) {
      supplierOrderAcknowledgementCache = readLocalRows<SupplierOrderAcknowledgementRecord>(key);
    }
    return [...supplierOrderAcknowledgementCache] as T[];
  }
  if (key === DELIVERIES_KEY) {
    if (!supplierDeliveryCache.length) {
      supplierDeliveryCache = readLocalRows<SupplierDeliveryRecord>(key);
    }
    return [...supplierDeliveryCache] as T[];
  }
  if (key === GRNS_KEY) {
    if (!supplierGrnCache.length) {
      supplierGrnCache = readLocalRows<SupplierGrnRecord>(key);
    }
    return [...supplierGrnCache] as T[];
  }
  return [];
}

function saveStoredArray<T>(key: string, eventName: string, rows: T[]): void {
  if (key === ORDER_ACKS_KEY) {
    supplierOrderAcknowledgementCache = [...(rows as SupplierOrderAcknowledgementRecord[])];
  } else if (key === DELIVERIES_KEY) {
    supplierDeliveryCache = [...(rows as SupplierDeliveryRecord[])];
  } else if (key === GRNS_KEY) {
    supplierGrnCache = [...(rows as SupplierGrnRecord[])];
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    // Ignore local persistence errors to keep UI usable.
  }
  window.dispatchEvent(new Event(eventName));
}

export function loadSupplierOrderAcknowledgements(): SupplierOrderAcknowledgementRecord[] {
  return parseStoredArray<SupplierOrderAcknowledgementRecord>(ORDER_ACKS_KEY);
}

export function saveSupplierOrderAcknowledgements(
  rows: SupplierOrderAcknowledgementRecord[],
): void {
  saveStoredArray(ORDER_ACKS_KEY, "erp-supplier-order-acks", rows);
  queueWorkflowRowsSave(ORDER_ACKS_STORE, rows, () => {
    window.dispatchEvent(
      new CustomEvent("erp-workflow-sync-error", {
        detail: { store: ORDER_ACKS_STORE },
      }),
    );
  });
}

export function appendSupplierOrderAcknowledgements(
  rows: SupplierOrderAcknowledgementRecord[],
): void {
  saveSupplierOrderAcknowledgements([
    ...loadSupplierOrderAcknowledgements(),
    ...rows,
  ]);
}

export function updateSupplierOrderAcknowledgement(
  localId: string,
  updater: (
    row: SupplierOrderAcknowledgementRecord,
  ) => SupplierOrderAcknowledgementRecord,
): void {
  saveSupplierOrderAcknowledgements(
    loadSupplierOrderAcknowledgements().map((row) =>
      row.localId === localId ? updater(row) : row,
    ),
  );
}

export function loadSupplierDeliveries(): SupplierDeliveryRecord[] {
  return parseStoredArray<SupplierDeliveryRecord>(DELIVERIES_KEY);
}

export function saveSupplierDeliveries(rows: SupplierDeliveryRecord[]): void {
  saveStoredArray(DELIVERIES_KEY, "erp-supplier-deliveries", rows);
  queueWorkflowRowsSave(DELIVERIES_STORE, rows, () => {
    window.dispatchEvent(
      new CustomEvent("erp-workflow-sync-error", {
        detail: { store: DELIVERIES_STORE },
      }),
    );
  });
}

export function appendSupplierDelivery(row: SupplierDeliveryRecord): void {
  saveSupplierDeliveries([...loadSupplierDeliveries(), row]);
}

export function updateSupplierDelivery(
  localId: string,
  updater: (row: SupplierDeliveryRecord) => SupplierDeliveryRecord,
): void {
  saveSupplierDeliveries(
    loadSupplierDeliveries().map((row) =>
      row.localId === localId ? updater(row) : row,
    ),
  );
}

export function loadSupplierGrns(): SupplierGrnRecord[] {
  return parseStoredArray<SupplierGrnRecord>(GRNS_KEY);
}

export function saveSupplierGrns(rows: SupplierGrnRecord[]): void {
  saveStoredArray(GRNS_KEY, "erp-supplier-grns", rows);
  queueWorkflowRowsSave(GRNS_STORE, rows, () => {
    window.dispatchEvent(
      new CustomEvent("erp-workflow-sync-error", {
        detail: { store: GRNS_STORE },
      }),
    );
  });
}

export function appendSupplierGrn(row: SupplierGrnRecord): void {
  saveSupplierGrns([...loadSupplierGrns(), row]);
}

export function updateSupplierGrn(
  localId: string,
  updater: (row: SupplierGrnRecord) => SupplierGrnRecord,
): void {
  saveSupplierGrns(
    loadSupplierGrns().map((row) => (row.localId === localId ? updater(row) : row)),
  );
}

export function createOrderAcknowledgementRecordsFromPurchaseOrder(
  order: PurchaseOrderDraft,
): SupplierOrderAcknowledgementRecord[] {
  const companyAddress = getCompanyAddress();

  return groupPurchaseOrderItemsBySupplier(order).map((bucket) => ({
    localId: newTempId(),
    poLocalId: order.localId,
    poNumber: order.poNumber,
    sourcePrNumber: order.sourcePrNumber,
    sourceRequester: order.sourceRequester,
    createdDate: order.createdDate,
    createdBy: order.createdBy,
    department: order.department,
    currency: order.currency,
    companyName: getCompanyName(),
    companyLogo: getCompanyLogo(),
    companyAddress,
    supplierId: bucket.supplierId,
    supplierName: bucket.supplierName,
    supplierCompanyName: bucket.supplierId != null ? getSupplierCompanyName(bucket.supplierId) || undefined : undefined,
    supplierLogo: bucket.supplierId != null ? getSupplierCompanyLogo(bucket.supplierId) || undefined : undefined,
    supplierEmail: bucket.supplierEmail,
    supplierAddress: bucket.supplierId != null ? getSupplierCompanyAddress(bucket.supplierId) : undefined,
    status: "PENDING_ORDER_ACKNOWLEDGE",
    items: bucket.items,
  }));
}

export function createDeliveryFromAcknowledgement(
  row: SupplierOrderAcknowledgementRecord,
): SupplierDeliveryRecord {
  return {
    localId: newTempId(),
    deliveryNo: generateDeliveryNo(),
    originalOrderNo: row.poNumber,
    acknowledgementLocalId: row.localId,
    poLocalId: row.poLocalId,
    poNumber: row.poNumber,
    sourcePrNumber: row.sourcePrNumber,
    sourceRequester: row.sourceRequester,
    createdDate: row.createdDate,
    createdBy: row.createdBy,
    department: row.department,
    currency: row.currency,
    companyName: row.companyName,
    companyLogo: row.companyLogo,
    companyAddress: row.companyAddress,
    supplierId: row.supplierId,
    supplierName: row.supplierName,
    supplierCompanyName: row.supplierCompanyName,
    supplierLogo: row.supplierLogo,
    supplierEmail: row.supplierEmail,
    supplierAddress: row.supplierAddress,
    status: "PENDING_DELIVERY",
    items: row.items.map((item) => ({ ...item })),
  };
}

export function createGrnFromDelivery(
  row: SupplierDeliveryRecord,
): SupplierGrnRecord {
  return {
    localId: newTempId(),
    deliveryNo: row.deliveryNo || row.poNumber,
    originalOrderNo: row.originalOrderNo || row.poNumber,
    deliveryLocalId: row.localId,
    poLocalId: row.poLocalId,
    poNumber: row.poNumber,
    sourcePrNumber: row.sourcePrNumber,
    sourceRequester: row.sourceRequester,
    createdDate: row.deliveredDate ?? row.createdDate,
    createdBy: row.createdBy,
    department: row.department,
    currency: row.currency,
    companyName: row.companyName,
    companyLogo: row.companyLogo,
    companyAddress: row.companyAddress,
    supplierId: row.supplierId,
    supplierName: row.supplierName,
    supplierCompanyName: row.supplierCompanyName,
    supplierLogo: row.supplierLogo,
    supplierEmail: row.supplierEmail,
    supplierAddress: row.supplierAddress,
    status: "PENDING_GRN",
    items: row.items.map((item) => ({ ...item })),
  };
}

export function createDeliveryFromGrnDiscrepancy(
  row: SupplierGrnRecord,
  deliveryNo?: string,
): SupplierDeliveryRecord {
  return {
    localId: newTempId(),
    deliveryNo: deliveryNo || generateDeliveryNo(),
    originalOrderNo: row.poNumber,
    acknowledgementLocalId: row.deliveryLocalId,
    poLocalId: row.poLocalId,
    poNumber: row.poNumber,
    sourcePrNumber: row.sourcePrNumber,
    sourceRequester: row.sourceRequester,
    createdDate: row.createdDate,
    createdBy: row.createdBy,
    department: row.department,
    currency: row.currency,
    companyName: row.companyName,
    companyLogo: row.companyLogo,
    companyAddress: row.companyAddress,
    supplierId: row.supplierId,
    supplierName: row.supplierName,
    supplierCompanyName: row.supplierCompanyName,
    supplierLogo: row.supplierLogo,
    supplierEmail: row.supplierEmail,
    supplierAddress: row.supplierAddress,
    status: "PENDING_DELIVERY",
    items: row.items.map((item) => ({ ...item })),
  };
}

export async function hydrateSupplierOrderAcknowledgements(): Promise<
  SupplierOrderAcknowledgementRecord[]
> {
  const localRows = readLocalRows<SupplierOrderAcknowledgementRecord>(ORDER_ACKS_KEY);
  if (localRows.length) {
    supplierOrderAcknowledgementCache = [...localRows];
  }
  try {
    const remoteRows = localRows.length
      ? await fetchWorkflowRows<SupplierOrderAcknowledgementRecord>(ORDER_ACKS_STORE, 200)
      : await fetchWorkflowRowsForRecovery<SupplierOrderAcknowledgementRecord>(ORDER_ACKS_STORE);
    const pendingRows = getPendingWorkflowRows<SupplierOrderAcknowledgementRecord>(ORDER_ACKS_STORE);
    const rows = pendingRows ?? (isWorkflowSyncEnabled()
      ? remoteRows
      : mergeByLocalId(localRows, remoteRows));
    supplierOrderAcknowledgementCache = rows;
    try {
      window.localStorage.setItem(ORDER_ACKS_KEY, JSON.stringify(rows));
    } catch {
      // Ignore local persistence errors to keep UI usable.
    }
    return rows;
  } catch {
    return loadSupplierOrderAcknowledgements();
  }
}

export async function hydrateSupplierDeliveries(): Promise<SupplierDeliveryRecord[]> {
  const localRows = readLocalRows<SupplierDeliveryRecord>(DELIVERIES_KEY);
  if (localRows.length) {
    supplierDeliveryCache = [...localRows];
  }
  try {
    const remoteRows = localRows.length
      ? await fetchWorkflowRows<SupplierDeliveryRecord>(DELIVERIES_STORE, 200)
      : await fetchWorkflowRowsForRecovery<SupplierDeliveryRecord>(DELIVERIES_STORE);
    const pendingRows = getPendingWorkflowRows<SupplierDeliveryRecord>(DELIVERIES_STORE);
    const rows = pendingRows ?? (isWorkflowSyncEnabled()
      ? remoteRows
      : mergeByLocalId(localRows, remoteRows));
    supplierDeliveryCache = rows;
    try {
      window.localStorage.setItem(DELIVERIES_KEY, JSON.stringify(rows));
    } catch {
      // Ignore local persistence errors to keep UI usable.
    }
    return rows;
  } catch {
    return loadSupplierDeliveries();
  }
}

export async function hydrateSupplierGrns(): Promise<SupplierGrnRecord[]> {
  const localRows = readLocalRows<SupplierGrnRecord>(GRNS_KEY);
  if (localRows.length) {
    supplierGrnCache = [...localRows];
  }
  try {
    const remoteRows = localRows.length
      ? await fetchWorkflowRows<SupplierGrnRecord>(GRNS_STORE, 200)
      : await fetchWorkflowRowsForRecovery<SupplierGrnRecord>(GRNS_STORE);
    const pendingRows = getPendingWorkflowRows<SupplierGrnRecord>(GRNS_STORE);
    const rows = pendingRows ?? (isWorkflowSyncEnabled()
      ? remoteRows
      : mergeByLocalId(localRows, remoteRows));
    supplierGrnCache = rows;
    try {
      window.localStorage.setItem(GRNS_KEY, JSON.stringify(rows));
    } catch {
      // Ignore local persistence errors to keep UI usable.
    }
    return rows;
  } catch {
    return loadSupplierGrns();
  }
}
