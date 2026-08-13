import express from "express";

import prisma from "../config/prisma.js";

const router = express.Router();

const TAX_RATES = { TAX: 10, SERVICE_TAX: 6 };

function cleanText(value, maxLength = 200) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function parseInventory(body) {
  const supplierId = Number(body?.supplierId);
  const quantity = Number(body?.quantity);
  const reorderLevel = Number(body?.reorderLevel ?? 0);
  const unitPrice = Number(body?.unitPrice);
  const rawTaxCodes = Array.isArray(body?.taxType)
    ? body.taxType
    : String(body?.taxType ?? "").split(",");
  const taxCodes = Array.from(new Set(
    rawTaxCodes
      .map((code) => String(code).trim().toUpperCase())
      .map((code) => code === "SST" || code === "SALES_TAX" ? "TAX" : code)
      .filter((code) => code in TAX_RATES),
  ));
  const taxType = taxCodes.join(",") || "NO_TAX";
  const taxRate = taxCodes.reduce((total, code) => total + TAX_RATES[code], 0);
  const itemName = cleanText(body?.itemName);
  const category = cleanText(body?.category);
  const unit = cleanText(body?.unit, 50);
  const imageDataUrl = typeof body?.imageDataUrl === "string" && body.imageDataUrl.length
    ? body.imageDataUrl
    : null;

  if (!Number.isInteger(supplierId) || supplierId < 1 || !itemName || !category || !unit) return null;
  if (!Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(reorderLevel) || reorderLevel < 0) return null;
  if (!Number.isFinite(unitPrice) || unitPrice < 0) return null;
  if (imageDataUrl && imageDataUrl.length > 8_000_000) return null;
  return {
    supplierId,
    itemName,
    category,
    quantity,
    reorderLevel,
    unit,
    unitPrice,
    taxType,
    taxRate,
    imageDataUrl,
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
        supplier: { role: "Supplier", isActive: true },
      },
      orderBy: [{ category: "asc" }, { itemName: "asc" }],
    });
    return res.json({ success: true, items });
  } catch (error) {
    console.error("GET /purchasing/inventory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/inventory", async (req, res) => {
  const data = parseInventory(req.body);
  if (!data) return res.status(400).json({ success: false, message: "Invalid inventory item" });
  try {
    const supplier = await prisma.user.findFirst({ where: { id: data.supplierId, role: "Supplier", isActive: true } });
    if (!supplier) return res.status(404).json({ success: false, message: "Active supplier not found" });
    const item = await prisma.supplierInventoryItem.create({ data });
    return res.status(201).json({ success: true, item });
  } catch (error) {
    console.error("POST /purchasing/inventory error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/inventory/:id", async (req, res) => {
  const data = parseInventory(req.body);
  if (!data || !req.params.id) return res.status(400).json({ success: false, message: "Invalid inventory item" });
  try {
    const item = await prisma.supplierInventoryItem.update({ where: { id: req.params.id }, data });
    return res.json({ success: true, item });
  } catch (error) {
    if (error?.code === "P2025") return res.status(404).json({ success: false, message: "Inventory item not found" });
    console.error("PUT /purchasing/inventory/:id error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

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
