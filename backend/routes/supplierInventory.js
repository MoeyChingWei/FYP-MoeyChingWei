import express from "express";
import { randomUUID } from "node:crypto";

import prisma from "../config/prisma.js";
import { uploadInventoryImageMiddleware } from "../middleware/uploadInventoryImage.js";

const router = express.Router();

function cleanText(value, maxLength = 200) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function parseInventory(body, uploadedImageUrl) {
  const supplierId = Number(body?.supplierId);
  const quantity = Number(body?.quantity);
  const reorderLevel = Number(body?.reorderLevel ?? 0);
  const unitPrice = Number(body?.unitPrice);
  const itemName = cleanText(body?.itemName);
  const category = cleanText(body?.category);
  const unit = cleanText(body?.unit, 50);
  const submittedImage = uploadedImageUrl !== undefined ? uploadedImageUrl : body?.imageDataUrl;
  const imageDataUrl = typeof submittedImage === "string" && submittedImage.trim().length
    ? submittedImage.trim()
    : null;

  if (!Number.isInteger(supplierId) || supplierId < 1 || !itemName || !category || !unit) return null;
  if (!Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(reorderLevel) || reorderLevel < 0) return null;
  if (!Number.isFinite(unitPrice) || unitPrice < 0) return null;
  // New uploads are stored as server URLs. Reject inline data URLs so a
  // client cannot reintroduce the localStorage-sized Base64 payload.
  if (imageDataUrl?.startsWith("data:")) return null;
  if (imageDataUrl && imageDataUrl.length > 2_000) return null;
  return {
    supplierId,
    itemName,
    category,
    quantity,
    reorderLevel,
    unit,
    unitPrice,
    imageDataUrl,
  };
}

function inventoryImageUrl(req) {
  if (!req.file) return undefined;
  const publicBase = (process.env.API_PUBLIC_BASE || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  return `${publicBase}/uploads/inventory/${req.file.filename}`;
}

function withInventoryImageUpload(handler) {
  return (req, res, next) => {
    uploadInventoryImageMiddleware.single("image")(req, res, (error) => {
      if (error) return res.status(400).json({ success: false, message: error.message || "Image upload failed" });
      return handler(req, res, next);
    });
  };
}

router.get("/inventory", async (req, res) => {
  const supplierId = req.query.supplierId == null ? undefined : Number(req.query.supplierId);
  if (supplierId != null && (!Number.isInteger(supplierId) || supplierId < 1)) {
    return res.status(400).json({ success: false, message: "Invalid supplier id" });
  }
  try {
    const items = await prisma.supplierInventoryItem.findMany({
      where: {
        ...(supplierId ? { supplierId } : {}),
        users: { role: "Supplier", isActive: true },
      },
      orderBy: [{ category: "asc" }, { itemName: "asc" }],
    });
    return res.json({ success: true, items });
  } catch (error) {
    console.error("GET /purchasing/inventory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/inventory", withInventoryImageUpload(async (req, res) => {
  const data = parseInventory(req.body, inventoryImageUrl(req));
  if (!data) return res.status(400).json({ success: false, message: "Invalid inventory item" });
  try {
    const supplier = await prisma.user.findFirst({ where: { id: data.supplierId, role: "Supplier", isActive: true } });
    if (!supplier) return res.status(404).json({ success: false, message: "Active supplier not found" });
    const item = await prisma.supplierInventoryItem.create({
      data: { id: randomUUID(), ...data, updatedAt: new Date() },
    });
    return res.status(201).json({ success: true, item });
  } catch (error) {
    console.error("POST /purchasing/inventory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}));

router.put("/inventory/:id", withInventoryImageUpload(async (req, res) => {
  const data = parseInventory(req.body, inventoryImageUrl(req));
  if (!data || !req.params.id) return res.status(400).json({ success: false, message: "Invalid inventory item" });
  try {
    const existing = await prisma.supplierInventoryItem.findUnique({
      where: { id: req.params.id },
      select: { reservedQuantity: true },
    });
    if (!existing) return res.status(404).json({ success: false, message: "Inventory item not found" });
    if (data.quantity < Number(existing.reservedQuantity ?? 0)) {
      return res.status(409).json({
        success: false,
        message: "Quantity cannot be lower than reserved inventory",
      });
    }
    const item = await prisma.supplierInventoryItem.update({
      where: { id: req.params.id },
      data: { ...data, updatedAt: new Date() },
    });
    return res.json({ success: true, item });
  } catch (error) {
    if (error?.code === "P2025") return res.status(404).json({ success: false, message: "Inventory item not found" });
    console.error("PUT /purchasing/inventory/:id error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}));

// Reserve catalogue quantities when a purchase request is submitted. The
// quantity remains on hand, but is unavailable to other requests until the
// request is approved or rejected.
router.post("/inventory/reserve", async (req, res) => {
  const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
  const items = rawItems
    .map((item) => ({
      id: String(item?.inventoryItemId ?? item?.id ?? "").trim(),
      supplierId: Number(item?.supplierId),
      itemName: cleanText(item?.itemName),
      category: cleanText(item?.category),
      unit: cleanText(item?.unit, 50),
      quantity: Number(item?.quantity),
    }))
    .filter((item) =>
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      (item.id || (Number.isInteger(item.supplierId) && item.supplierId > 0 && item.itemName)),
    );

  if (!items.length || items.length !== rawItems.length) {
    return res.status(400).json({ success: false, message: "Invalid inventory reservation" });
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const quantities = new Map();
      for (const item of items) {
        let row = item.id
          ? await tx.supplierInventoryItem.findUnique({ where: { id: item.id } })
          : null;
        if (!row && Number.isInteger(item.supplierId) && item.supplierId > 0 && item.itemName) {
          row = await tx.supplierInventoryItem.findFirst({
            where: {
              supplierId: item.supplierId,
              itemName: item.itemName,
              ...(item.category ? { category: item.category } : {}),
              ...(item.unit ? { unit: item.unit } : {}),
            },
          });
        }
        if (!row) {
          const error = new Error("Inventory item not found");
          error.code = "INVENTORY_UNAVAILABLE";
          throw error;
        }
        quantities.set(row.id, (quantities.get(row.id) ?? 0) + item.quantity);
      }

      const rows = [];
      for (const [id, quantity] of quantities) {
        const row = await tx.supplierInventoryItem.findUnique({ where: { id } });
        if (!row) {
          const error = new Error("Inventory item not found");
          error.code = "INVENTORY_UNAVAILABLE";
          throw error;
        }
        const result = await tx.supplierInventoryItem.updateMany({
          // Re-check against the values read in this transaction. This keeps
          // the compare-and-increment atomic while allowing reservations when
          // other quantities are already reserved.
          where: {
            id,
            reservedQuantity: row.reservedQuantity,
            quantity: { gte: row.reservedQuantity + quantity },
          },
          data: { reservedQuantity: { increment: quantity }, updatedAt: new Date() },
        });
        if (result.count !== 1) {
          const error = new Error("Insufficient inventory or item not found");
          error.code = "INVENTORY_UNAVAILABLE";
          throw error;
        }
        rows.push(await tx.supplierInventoryItem.findUnique({ where: { id } }));
      }
      return rows;
    });

    return res.json({ success: true, items: updated });
  } catch (error) {
    if (error?.code === "INVENTORY_UNAVAILABLE") {
      return res.status(409).json({ success: false, message: "Insufficient inventory" });
    }
    console.error("POST /purchasing/inventory/reserve error:", error);
    return res.status(500).json({ success: false, message: "Could not reserve inventory" });
  }
});

async function transitionReservedInventory(req, res, mode) {
  const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
  const items = rawItems
    .map((item) => ({
      id: String(item?.inventoryItemId ?? item?.id ?? "").trim(),
      quantity: Number(item?.quantity),
    }))
    .filter((item) => item.id && Number.isInteger(item.quantity) && item.quantity > 0);

  if (!items.length || items.length !== rawItems.length) {
    return res.status(400).json({ success: false, message: "Invalid inventory transition" });
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const quantities = new Map();
      for (const item of items) {
        quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.quantity);
      }

      const rows = [];
      for (const [id, quantity] of quantities) {
        const result = await tx.supplierInventoryItem.updateMany({
          where: {
            id,
            reservedQuantity: { gte: quantity },
            ...(mode === "commit" ? { quantity: { gte: quantity } } : {}),
          },
          data: mode === "commit"
            ? {
                quantity: { decrement: quantity },
                reservedQuantity: { decrement: quantity },
                updatedAt: new Date(),
              }
            : {
                reservedQuantity: { decrement: quantity },
                updatedAt: new Date(),
              },
        });
        if (result.count !== 1) {
          const error = new Error("Reserved inventory not found or insufficient");
          error.code = "INVENTORY_UNAVAILABLE";
          throw error;
        }
        rows.push(await tx.supplierInventoryItem.findUnique({ where: { id } }));
      }
      return rows;
    });

    return res.json({ success: true, items: updated });
  } catch (error) {
    if (error?.code === "INVENTORY_UNAVAILABLE") {
      return res.status(409).json({ success: false, message: "Reserved inventory is no longer available" });
    }
    console.error(`POST /purchasing/inventory/${mode} error:`, error);
    return res.status(500).json({ success: false, message: "Could not update reserved inventory" });
  }
}

router.post("/inventory/commit", (req, res) =>
  transitionReservedInventory(req, res, "commit"),
);

router.post("/inventory/release", (req, res) =>
  transitionReservedInventory(req, res, "release"),
);

router.delete("/inventory/:id", async (req, res) => {
  try {
    await prisma.supplierInventoryItem.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error) {
    if (error?.code === "P2025") return res.status(404).json({ success: false, message: "Inventory item not found" });
    console.error("DELETE /purchasing/inventory/:id error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
