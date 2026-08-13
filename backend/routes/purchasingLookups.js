import express from "express";

import prisma from "../config/prisma.js";

const router = express.Router();

const KINDS = new Set(["ITEM_CATEGORY", "UNIT_OF_MEASURE"]);

function normalizeValue(raw) {
  if (typeof raw !== "string") return "";
  return raw.trim().replace(/\s+/g, " ");
}

// GET /api/purchasing/lookups?kind=ITEM_CATEGORY|UNIT_OF_MEASURE
router.get("/lookups", async (req, res) => {
  const kind = req.query?.kind;
  if (typeof kind !== "string" || !KINDS.has(kind)) {
    return res.status(400).json({
      success: false,
      message: "Query kind must be ITEM_CATEGORY or UNIT_OF_MEASURE",
    });
  }
  try {
    const items = await prisma.purchasingLookup.findMany({
      where: { kind },
      orderBy: [{ value: "asc" }],
      select: { id: true, value: true, createdAt: true },
    });
    return res.json({ success: true, items });
  } catch (err) {
    console.error("GET /purchasing/lookups error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/purchasing/lookups  { kind, value }
router.post("/lookups", async (req, res) => {
  const kind = req.body?.kind;
  const value = normalizeValue(req.body?.value ?? "");

  if (typeof kind !== "string" || !KINDS.has(kind)) {
    return res.status(400).json({
      success: false,
      message: "kind must be ITEM_CATEGORY or UNIT_OF_MEASURE",
    });
  }
  if (value.length < 1 || value.length > 200) {
    return res.status(400).json({
      success: false,
      message: "value must be 1–200 characters",
    });
  }
  try {
    const created = await prisma.purchasingLookup.create({
      data: { kind, value },
      select: { id: true, value: true, createdAt: true },
    });
    return res.status(201).json({ success: true, item: created });
  } catch (err) {
    if (err?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "That value already exists for this list",
      });
    }
    console.error("POST /purchasing/lookups error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/purchasing/lookups/:id
router.delete("/lookups/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }
  try {
    await prisma.purchasingLookup.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    console.error("DELETE /purchasing/lookups/:id error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
