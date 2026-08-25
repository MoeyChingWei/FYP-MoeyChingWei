import axios from "axios";
import { API_ROOT } from "./base";

const API = `${API_ROOT}/workflow`;
const SAVE_DEBOUNCE_MS = 450;
// Total attempts are capped at five: one initial request plus four retries.
const MAX_WORKFLOW_SYNC_RETRIES = 4;
const WORKFLOW_SYNC_ENABLED = process.env.REACT_APP_ENABLE_WORKFLOW_SYNC === "true";
const pendingRowsByStore = new Map<string, { localId: string }[]>();
const pendingTimerByStore = new Map<string, number>();
const syncRunningByStore = new Set<string>();
const retryCountByStore = new Map<string, number>();
// IDs present in the last server snapshot seen by this browser. The backend
// uses these to distinguish an intentional delete from a concurrent create.
const knownServerIdsByStore = new Map<string, Set<string>>();

export function isWorkflowSyncEnabled(): boolean {
  return WORKFLOW_SYNC_ENABLED;
}

/**
 * Returns the latest rows waiting to be written to the server. A newly created
 * workflow row can briefly be ahead of the database while the debounced PUT
 * is running, so consumers can avoid replacing it with an older GET result.
 */
export function getPendingWorkflowRows<T>(store: string): T[] | null {
  const rows = pendingRowsByStore.get(store);
  return rows ? (rows as T[]) : null;
}

export async function fetchWorkflowRows<T>(store: string, limit?: number): Promise<T[]> {
  return fetchWorkflowRowsInternal<T>(store, false, limit);
}

export async function fetchWorkflowRowsForRecovery<T>(store: string): Promise<T[]> {
  return fetchWorkflowRowsInternal<T>(store, true);
}

async function fetchWorkflowRowsInternal<T>(
  store: string,
  bypassSyncGuard: boolean,
  limit?: number,
): Promise<T[]> {
  if (!WORKFLOW_SYNC_ENABLED && !bypassSyncGuard) {
    return [];
  }
  const params: Record<string, string> = {};
  if (limit !== undefined) {
    params.limit = String(limit);
  }
  const res = await axios.get(`${API}/${store}`, { params });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? `Failed to load ${store}`);
  }
  const rows = Array.isArray(res.data?.rows) ? (res.data.rows as T[]) : [];
  knownServerIdsByStore.set(
    store,
    new Set(rows.filter((row) => row && typeof (row as { localId?: unknown }).localId === "string")
      .map((row) => (row as { localId: string }).localId)),
  );
  return rows;
}

export async function saveWorkflowRows<T extends { localId: string }>(
  store: string,
  rows: T[],
): Promise<void> {
  if (!WORKFLOW_SYNC_ENABLED) {
    console.log(`⚠️ [WORKFLOW-SYNC] DISABLED - skipping save for store: ${store}`);
    return;
  }
  console.log(`🔄 [WORKFLOW-SYNC] Saving ${rows.length} rows to store: ${store}`);
  const baseLocalIds = Array.from(knownServerIdsByStore.get(store) ?? []);
  const res = await axios.put(`${API}/${store}`, { rows, baseLocalIds });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? `Failed to save ${store}`);
  }
  retryCountByStore.delete(store);
  console.log(`✅ [WORKFLOW-SYNC] Successfully saved to store: ${store}`);
}

export function queueWorkflowRowsSave<T extends { localId: string }>(
  store: string,
  rows: T[],
  onError?: (error: unknown) => void,
  isRetry = false,
): void {
  if (!WORKFLOW_SYNC_ENABLED) {
    console.log(`⚠️ [WORKFLOW-SYNC] DISABLED - skipping queue for store: ${store}`);
    return;
  }
  if (!isRetry) retryCountByStore.delete(store);
  console.log(`📋 [WORKFLOW-SYNC] Queuing ${rows.length} rows for store: ${store}`);
  pendingRowsByStore.set(store, [...rows]);

  const previousTimer = pendingTimerByStore.get(store);
  if (previousTimer) {
    window.clearTimeout(previousTimer);
  }

  const timer = window.setTimeout(() => {
    pendingTimerByStore.delete(store);
    if (syncRunningByStore.has(store)) return;

    const flush = async (): Promise<void> => {
      const snapshot = pendingRowsByStore.get(store);
      if (!snapshot) return;

      syncRunningByStore.add(store);
      try {
        await saveWorkflowRows(store, snapshot);
        if (pendingRowsByStore.get(store) === snapshot) {
          pendingRowsByStore.delete(store);
        }
      } catch (error) {
        // Do not retry permanent client errors forever. A 413 means the
        // snapshot is too large and a 404 means this store is not available
        // on the current backend; neither can succeed by sending it again.
        const status = (error as { response?: { status?: number } })?.response?.status;
        const retryable = status == null || status === 408 || status === 425 || status === 429 || status >= 500;
        if (!retryable && pendingRowsByStore.get(store) === snapshot) {
          pendingRowsByStore.delete(store);
          console.error(`[WORKFLOW-SYNC] Giving up on ${store} after HTTP ${status}`);
        } else if (retryable) {
          const retryCount = (retryCountByStore.get(store) ?? 0) + 1;
          retryCountByStore.set(store, retryCount);
          if (retryCount >= MAX_WORKFLOW_SYNC_RETRIES && pendingRowsByStore.get(store) === snapshot) {
            pendingRowsByStore.delete(store);
            retryCountByStore.delete(store);
            console.error(`[WORKFLOW-SYNC] Stopped ${store} after ${MAX_WORKFLOW_SYNC_RETRIES + 1} total attempts`);
          }
        }
        onError?.(error);
      } finally {
        syncRunningByStore.delete(store);
      }

      if (pendingRowsByStore.has(store) && !pendingTimerByStore.has(store)) {
        queueWorkflowRowsSave(store, pendingRowsByStore.get(store) ?? [], onError, true);
      }
    };

    void flush();
  }, SAVE_DEBOUNCE_MS);

  pendingTimerByStore.set(store, timer);
}
