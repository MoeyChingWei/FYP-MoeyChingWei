import express from "express";

import prisma from "../config/prisma.js";
import { ROLES } from "../constants/roles.js";
import { authenticateRequest, requireRoles } from "../middleware/auth.js";

const router = express.Router();
const TAX_TYPES = new Set(["SALES_TAX", "SERVICE_TAX", "OTHER"]);

function normalizeRules(body) {
  const rawRules = Array.isArray(body?.taxRules) ? body.taxRules : [];
  const rules = rawRules.map((rule) => ({
    taxType: String(rule?.taxType ?? rule?.code ?? "").trim().toUpperCase(),
    taxRate: Number(rule?.taxRate ?? rule?.rate ?? 0),
  }));
  if (!rules.length && body?.taxApplies) {
    rules.push({
      taxType: String(body?.taxType ?? "").trim().toUpperCase(),
      taxRate: Number(body?.taxRate ?? 0),
    });
  }
  if (!body?.taxApplies) return [];
  const uniqueTypes = new Set(rules.map((rule) => rule.taxType));
  if (!rules.length || uniqueTypes.size !== rules.length || rules.some((rule) => !TAX_TYPES.has(rule.taxType) || !Number.isFinite(rule.taxRate) || rule.taxRate < 0 || rule.taxRate > 100)) return null;
  return rules;
}

function normalizeSettings(body) {
  const taxApplies = Boolean(body?.taxApplies);
  const taxRules = normalizeRules(body);
  if (!taxRules) return null;
  const first = taxRules[0];
  return {
    taxApplies,
    taxType: first?.taxType ?? "NO_TAX",
    taxRate: first?.taxRate ?? 0,
    taxRules: taxRules.length ? taxRules : [],
  };
}

// Tax settings are not sensitive: purchasers need to read them before a PR
// can calculate and reserve the correct total.
router.get("/settings", async (req, res) => {
  const supplierIds = String(req.query.supplierIds ?? "")
    .split(",")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
  try {
    const settings = await prisma.supplier_tax_settings.findMany({
      where: supplierIds.length ? { supplierId: { in: Array.from(new Set(supplierIds)) } } : undefined,
      orderBy: { supplierId: "asc" },
    });
    return res.json({
      success: true,
      settings: settings.map((setting) => ({
        ...setting,
        taxRules: Array.isArray(setting.taxRules) && setting.taxRules.length
          ? setting.taxRules.map((rule) => ({ taxType: String(rule?.taxType ?? rule?.code ?? "").toUpperCase(), taxRate: Number(rule?.taxRate ?? rule?.rate ?? 0) }))
          : setting.taxApplies ? [{ taxType: setting.taxType, taxRate: setting.taxRate }] : [],
      })),
    });
  } catch (error) {
    console.error("GET /supplier-tax/settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load supplier tax settings" });
  }
});

router.put("/settings", authenticateRequest, requireRoles([ROLES.SUPPLIER]), async (req, res) => {
  const settings = normalizeSettings(req.body);
  if (!settings) return res.status(400).json({ success: false, message: "Enter a valid tax type and rate" });
  try {
    const taxSettings = await prisma.supplier_tax_settings.upsert({
      where: { supplierId: req.user.id },
      create: { supplierId: req.user.id, ...settings },
      update: settings,
    });
    return res.json({ success: true, settings: taxSettings });
  } catch (error) {
    console.error("PUT /supplier-tax/settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to save supplier tax settings" });
  }
});

export default router;
