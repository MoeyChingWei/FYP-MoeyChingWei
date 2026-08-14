import axios from "axios";
import { API_ROOT } from "./base";

const API = `${API_ROOT}/workflow`;
const SAVE_DEBOUNCE_MS = 450;
const WORKFLOW_SYNC_ENABLED = process.env.REACT_APP_ENABLE_WORKFLOW_SYNC === "true";
const pendingRowsByStore = new Map<string, { localId: string }[]>();
const pendingTimerByStore = new Map<string, number>();
const syncRunningByStore = new Set<string>();

export function isWorkflowSyncEnabled(): boolean {
  return WORKFLOW_SYNC_ENABLED;
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
  return Array.isArray(res.data?.rows) ? (res.data.rows as T[]) : [];
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
  const res = await axios.put(`${API}/${store}`, { rows });
  if (!res.data?.success) {
    throw new Error(res.data?.message ?? `Failed to save ${store}`);
  }
  console.log(`✅ [WORKFLOW-SYNC] Successfully saved to store: ${store}`);
}

export function queueWorkflowRowsSave<T extends { localId: string }>(
  store: string,
  rows: T[],
  onError?: (error: unknown) => void,
): void {
  if (!WORKFLOW_SYNC_ENABLED) {
    console.log(`⚠️ [WORKFLOW-SYNC] DISABLED - skipping queue for store: ${store}`);
    return;
  }
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
        onError?.(error);
      } finally {
        syncRunningByStore.delete(store);
      }

      if (pendingRowsByStore.has(store) && !pendingTimerByStore.has(store)) {
        queueWorkflowRowsSave(store, pendingRowsByStore.get(store) ?? [], onError);
      }
    };

    void flush();
  }, SAVE_DEBOUNCE_MS);

  pendingTimerByStore.set(store, timer);
}
