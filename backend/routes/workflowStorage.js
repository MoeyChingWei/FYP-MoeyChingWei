import express from "express";

import prisma from "../config/prisma.js";
import { processWorkflowNotifications } from "../services/notifications.js";
import { addDebugLog } from "./debug-logs.js";

console.log("🟢 [INIT] workflowStorage.js module loaded at", new Date().toISOString());

const router = express.Router();

const STORES = {
  "purchase-requests": {
    model: prisma.purchaseRequestRecord,
    field: "localId",
  },
  "purchase-orders": {
    model: prisma.purchaseOrderRecord,
    field: "localId",
  },
  "supplier-order-acks": {
    model: prisma.supplierOrderAcknowledgementRecord,
    field: "localId",
  },
  deliveries: {
    model: prisma.supplierDeliveryRecordStore,
    field: "localId",
  },
  grns: {
    model: prisma.supplierGrnRecordStore,
    field: "localId",
  },
};

function getStoreConfig(key) {
  return STORES[key] ?? null;
}

router.get("/:store", async (req, res) => {
  console.log(`🔵 [DEBUG] GET /api/workflow/${req.params.store} - request received`);

  const config = getStoreConfig(req.params.store);
  if (!config) {
    return res.status(404).json({ success: false, message: "Store not found" });
  }

  // Add pagination support
  const limit = parseInt(req.query.limit) || 200;
  const offset = parseInt(req.query.offset) || 0;
  const maxLimit = 500; // Safety limit
  const safeLimit = Math.min(Math.max(limit, 1), maxLimit);

  try {
    const rows = await config.model.findMany({
      orderBy: { updatedAt: "desc" },
      take: safeLimit,
      skip: offset,
      select: {
        [config.field]: true,
        payload: true,
      },
    });

    return res.json({
      success: true,
      rows: rows.map((row) => row.payload),
      total: await config.model.count(),
    });
  } catch (err) {
    console.error(`GET /api/workflow/${req.params.store} error:`, err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:store", async (req, res) => {
  console.log(`🔵 [DEBUG] PUT /api/workflow/${req.params.store} - received request with ${req.body?.rows?.length ?? 0} rows`);
  addDebugLog("WORKFLOW", `PUT request received for store: ${req.params.store}`, {
    rowCount: req.body?.rows?.length ?? 0,
  });

  const config = getStoreConfig(req.params.store);
  if (!config) {
    console.error(`❌ [DEBUG] Store not found: ${req.params.store}`);
    addDebugLog("WORKFLOW-ERROR", `Store not found: ${req.params.store}`, null);
    return res.status(404).json({ success: false, message: "Store not found" });
  }

  const rows = Array.isArray(req.body?.rows) ? req.body.rows : null;
  if (!rows) {
    console.error(`❌ [DEBUG] Invalid request body - rows is not an array`);
    addDebugLog("WORKFLOW-ERROR", "Invalid request body - rows is not an array", null);
    return res.status(400).json({ success: false, message: "rows must be an array" });
  }

  console.log(`✅ [DEBUG] Request validated - processing ${rows.length} rows for store: ${req.params.store}`);
  addDebugLog("WORKFLOW", `Request validated - processing ${rows.length} rows`, {
    store: req.params.store,
  });

  const invalidRow = rows.find(
    (row) => !row || typeof row !== "object" || typeof row.localId !== "string",
  );
  if (invalidRow) {
    return res.status(400).json({
      success: false,
      message: "Each row must be an object with localId",
    });
  }

  try {
    console.log(`📊 [DEBUG] Fetching previousRows from database...`);
    const previousRows = await config.model.findMany({
      select: {
        [config.field]: true,
        payload: true,
      },
    });
    console.log(`📊 [DEBUG] Found ${previousRows.length} previous rows`);

    const incomingIds = new Set(rows.map((row) => row.localId));
    const previousIds = previousRows.map((row) => row[config.field]);
    const idsToDelete = previousIds.filter((id) => !incomingIds.has(id));

    console.log(`💾 [DEBUG] Starting database transaction - deleting ${idsToDelete.length} rows, upserting ${rows.length} rows`);
    await prisma.$transaction([
      ...idsToDelete.map((id) =>
        config.model.delete({
          where: { [config.field]: id },
        }),
      ),
      ...rows.map((row) =>
        config.model.upsert({
          where: { [config.field]: row.localId },
          update: { payload: row },
          create: {
            [config.field]: row.localId,
            payload: row,
          },
        }),
      ),
    ]);
    console.log(`✅ [DEBUG] Database transaction completed successfully`);
    addDebugLog("WORKFLOW", "Database transaction completed successfully", {
      store: req.params.store,
      deletedCount: idsToDelete.length,
      upsertedCount: rows.length,
    });

    const nextRows = rows.map((row) => ({
      localId: row.localId,
      payload: row,
    }));

    console.log(`🚀 [DEBUG] Triggering processWorkflowNotifications for store: ${req.params.store}, rows: ${rows.length}`);
    addDebugLog("WORKFLOW", "Triggering processWorkflowNotifications", {
      store: req.params.store,
      rowCount: rows.length,
    });

    setImmediate(() => {
      console.log(`⏱️ [DEBUG] setImmediate callback executing - calling processWorkflowNotifications`);
      addDebugLog("WORKFLOW", "setImmediate callback executing", {
        store: req.params.store,
      });
      processWorkflowNotifications(req.params.store, previousRows, nextRows).catch((err) => {
        console.error(`❌ [ERROR] processWorkflowNotifications ${req.params.store} error:`, err);
        addDebugLog("WORKFLOW-ERROR", "processWorkflowNotifications error", {
          store: req.params.store,
          error: err.message,
          stack: err.stack,
        });
      });
    });

    console.log(`📤 [DEBUG] Sending success response to client`);
    addDebugLog("WORKFLOW", "Sending success response to client", {
      store: req.params.store,
      count: rows.length,
    });
    return res.json({ success: true, count: rows.length });
  } catch (err) {
    console.error(`❌ [ERROR] PUT /api/workflow/${req.params.store} error:`, err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
