import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

function parseUserId(value) {
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

router.get("/", async (req, res) => {
  const userId = parseUserId(req.query.userId);
  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return res.json({ success: true, notifications });
  } catch (err) {
    console.error("GET /api/notifications error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.patch("/:id/read", async (req, res) => {
  const id = parseUserId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid notification id" });
  }
  try {
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
    return res.json({ success: true, notification: updated });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    console.error("PATCH /api/notifications/:id/read error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.patch("/read-all", async (req, res) => {
  const userId = parseUserId(req.body?.userId);
  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }
  try {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return res.json({ success: true, count: result.count });
  } catch (err) {
    console.error("PATCH /api/notifications/read-all error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/history", async (req, res) => {
  const userId = parseUserId(req.body?.userId);
  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }
  try {
    const result = await prisma.notification.deleteMany({
      where: { userId, isRead: true },
    });
    return res.json({ success: true, count: result.count });
  } catch (err) {
    console.error("DELETE /api/notifications/history error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = parseUserId(req.params.id);
  const userId = parseUserId(req.body?.userId);
  if (!id || !userId) {
    return res.status(400).json({ success: false, message: "Invalid id or userId" });
  }
  try {
    const existing = await prisma.notification.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    await prisma.notification.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/notifications/:id error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

