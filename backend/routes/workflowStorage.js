import express from "express";

import prisma from "../config/prisma.js";
import { processWorkflowNotifications } from "../services/notifications.js";

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
  const config = getStoreConfig(req.params.store);
  if (!config) {
    return res.status(404).json({ success: false, message: "Store not found" });
  }

  const rows = Array.isArray(req.body?.rows) ? req.body.rows : null;
  if (!rows) {
    return res.status(400).json({ success: false, message: "rows must be an array" });
  }

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
    const previousRows = await config.model.findMany({
      select: {
        [config.field]: true,
        payload: true,
      },
    });

    const incomingIds = new Set(rows.map((row) => row.localId));
    const previousIds = previousRows.map((row) => row[config.field]);
    const idsToDelete = previousIds.filter((id) => !incomingIds.has(id));

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

    const nextRows = rows.map((row) => ({
      localId: row.localId,
      payload: row,
    }));
    setImmediate(() => {
      processWorkflowNotifications(req.params.store, previousRows, nextRows).catch((err) => {
        console.error(`processWorkflowNotifications ${req.params.store} error:`, err);
      });
    });

    return res.json({ success: true, count: rows.length });
  } catch (err) {
    console.error(`PUT /api/workflow/${req.params.store} error:`, err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
