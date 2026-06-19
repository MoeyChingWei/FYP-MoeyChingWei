import express from "express";

import prisma from "../config/prisma.js";

const router = express.Router();

function normalizeCategory(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

// GET /api/admin/supplier-types
router.get("/supplier-types", async (_req, res) => {
  try {
    const assignments = await prisma.supplierTypeAssignment.findMany({
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
      orderBy: [{ userId: "asc" }, { category: "asc" }],
    });

    const supplierTypeMap = assignments.reduce((acc, assignment) => {
      if (assignment.user.role !== "Supplier") return acc;
      const key = String(assignment.userId);
      if (!acc[key]) acc[key] = [];
      acc[key].push(assignment.category);
      return acc;
    }, {});

    return res.json({ success: true, supplierTypeMap });
  } catch (err) {
    console.error("GET /api/admin/supplier-types error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/admin/supplier-types/:userId
// Body: { categories: string[] }
router.put("/supplier-types/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  const rawCategories = Array.isArray(req.body?.categories) ? req.body.categories : null;
  if (!rawCategories) {
    return res.status(400).json({
      success: false,
      message: "categories must be an array of strings",
    });
  }

  const categories = Array.from(
    new Set(
      rawCategories
        .map((value) => normalizeCategory(value))
        .filter((value) => value.length > 0),
    ),
  );

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.role !== "Supplier") {
      return res.status(400).json({
        success: false,
        message: "Supplier types can only be assigned to Supplier role users",
      });
    }

    await prisma.$transaction([
      prisma.supplierTypeAssignment.deleteMany({
        where: { userId },
      }),
      ...(categories.length
        ? [
            prisma.supplierTypeAssignment.createMany({
              data: categories.map((category) => ({
                userId,
                category,
              })),
            }),
          ]
        : []),
    ]);

    return res.json({ success: true, categories });
  } catch (err) {
    console.error("PUT /api/admin/supplier-types/:userId error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
