import express from "express";
import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";
import { isValidRole, ROLES } from "../constants/roles.js";

const router = express.Router();

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        isActive: true,
      },
    });
    return res.json({ success: true, users });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/admin/users
// Body: { name, email, password, role, department? }
router.post("/users", async (req, res) => {
  const { name, email, password, role, department } = req.body ?? {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, message: "Email is required" });
  }
  if (!password || typeof password !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const safeName = typeof name === "string" ? name.trim() : null;
  const safeRole = isValidRole(role) ? role : ROLES.EMPLOYEE;
  const safeDept =
    typeof department === "string" && department.trim().length > 0
      ? department.trim()
      : null;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const created = await prisma.user.create({
      data: {
        name: safeName,
        email: trimmedEmail,
        password: hashed,
        role: safeRole,
        department: safeDept,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        isActive: true,
      },
    });

    return res.json({ success: true, user: created });
  } catch (err) {
    // Prisma unique constraint
    if (err?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    console.error("POST /api/admin/users error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/admin/users/:id
// Body: { name?, email?, password?, role?, department? }
// - password: if provided and non-empty, will be updated (min 6 chars, bcrypt)
router.put("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  const { name, email, password, role, department } = req.body ?? {};

  const data = {};
  if (typeof name === "string") data.name = name.trim();
  if (typeof email === "string") data.email = email.trim().toLowerCase();
  if (typeof role === "string") {
    data.role = isValidRole(role) ? role : ROLES.EMPLOYEE;
  }
  if (typeof department === "string") {
    data.department = department.trim() || null;
  }

  if (typeof password === "string" && password.length > 0) {
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    data.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields to update",
    });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        isActive: true,
      },
    });
    return res.json({ success: true, user: updated });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (err?.code === "P2002") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    console.error("PUT /api/admin/users/:id error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH /api/admin/users/:id/status
// Body: { isActive: boolean }
router.patch("/users/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }
  const { isActive } = req.body ?? {};
  if (typeof isActive !== "boolean") {
    return res.status(400).json({ success: false, message: "isActive must be boolean" });
  }

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        avatarUrl: true,
        isActive: true,
      },
    });
    return res.json({ success: true, user: updated });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.error("PATCH /api/admin/users/:id/status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH /api/admin/users/:id/role
// Body: { role, actorEmail?, actorName? }
router.patch("/users/:id/role", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  const { role, actorEmail, actorName } = req.body ?? {};
  if (!isValidRole(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  const safeActorEmail =
    typeof actorEmail === "string" && actorEmail.trim().length > 0
      ? actorEmail.trim().toLowerCase()
      : "unknown@local";
  const safeActorName = typeof actorName === "string" ? actorName.trim() : null;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === role) {
      return res.json({ success: true, user, changed: false });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    await prisma.roleChangeAudit.create({
      data: {
        targetId: id,
        fromRole: user.role,
        toRole: role,
        actorEmail: safeActorEmail,
        actorName: safeActorName,
      },
    });

    return res.json({ success: true, user: updated, changed: true });
  } catch (err) {
    console.error("PATCH /api/admin/users/:id/role error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/admin/role-change-audits
router.get("/role-change-audits", async (req, res) => {
  const takeRaw = Number(req.query.take);
  const take = Number.isFinite(takeRaw) ? Math.min(Math.max(takeRaw, 1), 200) : 50;

  try {
    const audits = await prisma.roleChangeAudit.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: {
        target: { select: { id: true, name: true, email: true } },
      },
    });
    return res.json({ success: true, audits });
  } catch (err) {
    console.error("GET /api/admin/role-change-audits error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

