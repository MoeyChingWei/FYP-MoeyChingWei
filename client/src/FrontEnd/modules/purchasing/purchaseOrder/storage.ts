import { todayIsoDate } from "../requestCreation/constants";
import type { PurchaseRequestDraft } from "../requestCreation/types";
import type { PurchaseOrderDraft } from "./types";
import { getCompanyLogo } from "../../settings/companyAddress";
import {
  fetchWorkflowRows,
  fetchWorkflowRowsForRecovery,
  getPendingWorkflowRows,
  isWorkflowSyncEnabled,
  queueWorkflowRowsSave,
} from "../../../shared/api/workflowStorage";

export const PURCHASE_ORDER_DRAFTS_KEY = "erp_purchase_order_drafts_v1";
const PURCHASE_ORDER_STORE = "purchase-orders";
let purchaseOrderDraftCache: PurchaseOrderDraft[] = [];

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

function readLocalDrafts(): PurchaseOrderDraft[] {
  try {
    const raw = window.localStorage.getItem(PURCHASE_ORDER_DRAFTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PurchaseOrderDraft[]) : [];
  } catch {
    return [];
  }
}

function newTempId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `tmp-${Date.now()}`;
}

export function generatePoNumber(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PO-${y}${m}${day}-${rand}`;
}

export function loadPurchaseOrderDrafts(): PurchaseOrderDraft[] {
  if (!purchaseOrderDraftCache.length) {
    purchaseOrderDraftCache = readLocalDrafts();
  }
  return [...purchaseOrderDraftCache];
}

export function savePurchaseOrderDrafts(
  drafts: PurchaseOrderDraft[],
): void {
  purchaseOrderDraftCache = [...drafts];
  try {
    window.localStorage.setItem(
      PURCHASE_ORDER_DRAFTS_KEY,
      JSON.stringify(purchaseOrderDraftCache),
    );
  } catch {
    // Ignore local persistence errors to keep UI usable.
  }
  window.dispatchEvent(new Event("erp-purchase-order-drafts"));
  queueWorkflowRowsSave(PURCHASE_ORDER_STORE, drafts, () => {
    window.dispatchEvent(
      new CustomEvent("erp-workflow-sync-error", {
        detail: { store: PURCHASE_ORDER_STORE },
      }),
    );
  });
}

export function appendPurchaseOrderDraft(draft: PurchaseOrderDraft): void {
  const next = [...loadPurchaseOrderDrafts(), draft];
  savePurchaseOrderDrafts(next);
}

export function updatePurchaseOrderDraft(
  localId: string,
  updater: (draft: PurchaseOrderDraft) => PurchaseOrderDraft,
): void {
  const next = loadPurchaseOrderDrafts().map((draft) =>
    draft.localId === localId ? updater(draft) : draft,
  );
  savePurchaseOrderDrafts(next);
}

export function replacePurchaseOrderDraft(
  localId: string,
  nextDraft: PurchaseOrderDraft,
): void {
  const next = loadPurchaseOrderDrafts().map((draft) =>
    draft.localId === localId ? nextDraft : draft,
  );
  savePurchaseOrderDrafts(next);
}

export function removePurchaseOrderDrafts(localIds: string[]): void {
  const idSet = new Set(localIds);
  const next = loadPurchaseOrderDrafts().filter(
    (draft) => !idSet.has(draft.localId),
  );
  savePurchaseOrderDrafts(next);
}

export async function hydratePurchaseOrderDrafts(): Promise<PurchaseOrderDraft[]> {
  const localDrafts = readLocalDrafts();
  if (localDrafts.length) {
    purchaseOrderDraftCache = [...localDrafts];
  }
  try {
    const remoteDrafts = localDrafts.length
      ? await fetchWorkflowRows<PurchaseOrderDraft>(PURCHASE_ORDER_STORE, 200)
      : await fetchWorkflowRowsForRecovery<PurchaseOrderDraft>(PURCHASE_ORDER_STORE);
    const pendingDrafts = getPendingWorkflowRows<PurchaseOrderDraft>(PURCHASE_ORDER_STORE);
    const drafts = pendingDrafts ?? (isWorkflowSyncEnabled()
      ? remoteDrafts
      : mergeByLocalId(localDrafts, remoteDrafts));
    const companyLogo = getCompanyLogo();
    const needsLogoSync = Boolean(companyLogo) && drafts.some((draft) => !draft.companyLogo);
    const hydratedDrafts = needsLogoSync
      ? drafts.map((draft) => draft.companyLogo ? draft : { ...draft, companyLogo })
      : drafts;
    purchaseOrderDraftCache = hydratedDrafts;
    try {
      window.localStorage.setItem(PURCHASE_ORDER_DRAFTS_KEY, JSON.stringify(hydratedDrafts));
    } catch {
      // Ignore local persistence errors to keep UI usable.
    }
    if (needsLogoSync) {
      queueWorkflowRowsSave(PURCHASE_ORDER_STORE, hydratedDrafts, () => {
        window.dispatchEvent(new CustomEvent("erp-workflow-sync-error", {
          detail: { store: PURCHASE_ORDER_STORE },
        }));
      });
    }
    return hydratedDrafts;
  } catch {
    return loadPurchaseOrderDrafts();
  }
}

export function createPurchaseOrderFromRequest(
  request: PurchaseRequestDraft,
  approver: {
    id?: number;
    email?: string;
    name?: string | null;
  } | null,
): PurchaseOrderDraft {
  return {
    localId: newTempId(),
    poNumber: generatePoNumber(),
    sourceRequestLocalId: request.localId,
    sourcePrNumber: request.prNumber,
    sourceRequester: request.requestBy,
    createdDate: todayIsoDate(),
    createdBy: approver?.name?.trim() || approver?.email || request.requestBy,
    createdByUserId: approver?.id,
    createdByEmail: approver?.email,
    department: request.department,
    companyLogo: request.companyLogo || getCompanyLogo(),
    currency: request.currency,
    status: "DRAFT",
    lineItems: request.lineItems.map((item) => ({ ...item })),
    subtotal: request.subtotal,
    supplierTaxApplies: request.supplierTaxApplies,
    supplierTaxType: request.supplierTaxType,
    supplierTaxRate: request.supplierTaxRate,
    supplierTaxRules: request.supplierTaxRules,
    taxAmount: request.taxAmount,
    amountAfterTax: request.amountAfterTax,
    paymentTerms: request.paymentTerms,
    requesterRole: request.requesterRole,
    isSelfApproved: request.isSelfApproved,
  };
}
