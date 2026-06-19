import express from "express";
import prisma from "../config/prisma.js";
import { notifyAdminsForFeedback } from "../services/notifications.js";

const router = express.Router();

const FEEDBACK_TYPES = new Set(["ISSUE", "IMPROVEMENT", "COMMENT"]);

function parseUserId(value) {
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

router.get("/", async (_req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    return res.json({ success: true, feedbacks });
  } catch (err) {
    console.error("GET /api/feedback error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const userId = parseUserId(req.body?.userId);
  const type = String(req.body?.type ?? "").trim().toUpperCase();
  const description = String(req.body?.description ?? "").trim();

  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }
  if (!FEEDBACK_TYPES.has(type)) {
    return res.status(400).json({ success: false, message: "Invalid feedback type" });
  }
  if (!description || description.length < 5) {
    return res.status(400).json({
      success: false,
      message: "Description must be at least 5 characters",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId,
        type,
        description,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    await notifyAdminsForFeedback({
      feedbackId: feedback.id,
      userName: user.name,
      userEmail: user.email,
      type,
      description,
    });

    return res.status(201).json({ success: true, feedback });
  } catch (err) {
    console.error("POST /api/feedback error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

