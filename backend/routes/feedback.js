import express from "express";
import prisma from "../config/prisma.js";
import { notifyAdminsForFeedback } from "../services/notifications.js";
import { authenticateToken } from "../src/middleware/auth.js";

const router = express.Router();

// Feedback contains user-submitted information and is only available to the
// submitting user or an administrator.
router.use(authenticateToken);

const FEEDBACK_TYPES = new Set(["ISSUE", "IMPROVEMENT", "COMMENT"]);

async function attachFeedbackUsers(feedbacks) {
  const userIds = [...new Set(feedbacks.map((feedback) => feedback.userId))];
  if (userIds.length === 0) return feedbacks;

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, role: true },
  });
  const usersById = new Map(users.map((user) => [user.id, user]));

  return feedbacks.map((feedback) => ({
    ...feedback,
    user: usersById.get(feedback.userId) ?? null,
  }));
}

router.get("/", async (req, res) => {
  try {
    const isAdmin = String(req.user.role ?? "").trim().toLowerCase() === "admin";
    const feedbacks = await prisma.feedback.findMany({
      where: isAdmin ? {} : { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    return res.json({
      success: true,
      feedbacks: await attachFeedbackUsers(feedbacks),
    });
  } catch (err) {
    console.error("GET /api/feedback error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  // The middleware has already verified the submitted identity. Never trust a
  // client-provided userId for ownership of the new feedback record.
  const userId = req.user.id;
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
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId,
        type,
        description,
      },
    });

    await notifyAdminsForFeedback({
      feedbackId: feedback.id,
      userName: user.name,
      userEmail: user.email,
      type,
      description,
    });

    return res.status(201).json({
      success: true,
      feedback: {
        ...feedback,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("POST /api/feedback error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

