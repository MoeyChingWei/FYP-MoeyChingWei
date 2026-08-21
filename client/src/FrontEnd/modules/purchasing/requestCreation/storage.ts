import type { PurchaseRequestDraft } from "./types";
import {
  fetchWorkflowRows,
  fetchWorkflowRowsForRecovery,
  getPendingWorkflowRows,
  isWorkflowSyncEnabled,
  queueWorkflowRowsSave,
} from "../../../shared/api/workflowStorage";

export const PURCHASE_REQUEST_DRAFTS_KEY = "erp_purchase_request_drafts_v1";
const PURCHASE_REQUEST_STORE = "purchase-requests";
let purchaseRequestDraftCache: PurchaseRequestDraft[] = [];

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

function readLocalDrafts(): PurchaseRequestDraft[] {
  try {
    const raw = window.localStorage.getItem(PURCHASE_REQUEST_DRAFTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PurchaseRequestDraft[]) : [];
  } catch {
    return [];
  }
}

export function loadPurchaseRequestDrafts(): PurchaseRequestDraft[] {
  if (!purchaseRequestDraftCache.length) {
    purchaseRequestDraftCache = readLocalDrafts();
  }
  return [...purchaseRequestDraftCache];
}

export function savePurchaseRequestDrafts(
  drafts: PurchaseRequestDraft[],
): void {
  purchaseRequestDraftCache = [...drafts];
  try {
    window.localStorage.setItem(
      PURCHASE_REQUEST_DRAFTS_KEY,
      JSON.stringify(purchaseRequestDraftCache),
    );
  } catch {
    // Ignore local persistence errors to keep UI usable.
  }
  window.dispatchEvent(new Event("erp-purchase-request-drafts"));
  queueWorkflowRowsSave(PURCHASE_REQUEST_STORE, drafts, () => {
    window.dispatchEvent(
      new CustomEvent("erp-workflow-sync-error", {
        detail: { store: PURCHASE_REQUEST_STORE },
      }),
    );
  });
}

export function appendPurchaseRequestDraft(
  draft: PurchaseRequestDraft,
): void {
  const next = [...loadPurchaseRequestDrafts(), draft];
  savePurchaseRequestDrafts(next);
}

export function updatePurchaseRequestDraft(
  localId: string,
  updater: (draft: PurchaseRequestDraft) => PurchaseRequestDraft,
): void {
  const next = loadPurchaseRequestDrafts().map((draft) =>
    draft.localId === localId ? updater(draft) : draft,
  );
  savePurchaseRequestDrafts(next);
}

export function replacePurchaseRequestDraft(
  localId: string,
  nextDraft: PurchaseRequestDraft,
): void {
  const next = loadPurchaseRequestDrafts().map((draft) =>
    draft.localId === localId ? nextDraft : draft,
  );
  savePurchaseRequestDrafts(next);
}

export function removePurchaseRequestDrafts(localIds: string[]): void {
  const idSet = new Set(localIds);
  const next = loadPurchaseRequestDrafts().filter(
    (draft) => !idSet.has(draft.localId),
  );
  savePurchaseRequestDrafts(next);
}

export async function hydratePurchaseRequestDrafts(): Promise<PurchaseRequestDraft[]> {
  const localDrafts = readLocalDrafts();
  if (localDrafts.length) {
    purchaseRequestDraftCache = [...localDrafts];
  }
  try {
    const remoteDrafts = localDrafts.length
      ? await fetchWorkflowRows<PurchaseRequestDraft>(PURCHASE_REQUEST_STORE, 200)
      : await fetchWorkflowRowsForRecovery<PurchaseRequestDraft>(PURCHASE_REQUEST_STORE);
    // A create/update can still be in the debounced PUT when this page mounts.
    // Prefer that exact pending snapshot over the stale GET response so a new
    // request appears immediately without requiring a refresh or navigation.
    const pendingDrafts = getPendingWorkflowRows<PurchaseRequestDraft>(PURCHASE_REQUEST_STORE);
    const drafts = pendingDrafts ?? (isWorkflowSyncEnabled()
      ? remoteDrafts
      : mergeByLocalId(localDrafts, remoteDrafts));
    purchaseRequestDraftCache = drafts;
    try {
      window.localStorage.setItem(PURCHASE_REQUEST_DRAFTS_KEY, JSON.stringify(drafts));
    } catch {
      // Ignore local persistence errors to keep UI usable.
    }
    return drafts;
  } catch {
    return loadPurchaseRequestDrafts();
  }
}
