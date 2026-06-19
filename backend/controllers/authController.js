import prisma from "../config/prisma.js";
import { isValidRole } from "../constants/roles.js";
import {
  setResetCode,
  verifyAndConsumeResetCode,
} from "../services/resetCodeStore.js";
import { sendPasswordResetCodeEmail } from "../services/sendResetEmail.js";
import { verifyRecaptchaToken } from "../services/recaptcha.js";
import bcrypt from "bcrypt";

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const normalized = String(email ?? "").trim().toLowerCase();
    const inputPassword = String(password ?? "");

    const user = await prisma.user.findFirst({
      where: { email: { equals: normalized, mode: "insensitive" } },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let ok = false;
    const stored = String(user.password ?? "");
    if (stored.startsWith("$2")) {
      ok = await bcrypt.compare(inputPassword, stored);
    } else {
      // Legacy plain-text password support (auto-migrate on successful login)
      ok = stored === inputPassword;
      if (ok) {
        const hashed = await bcrypt.hash(inputPassword, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashed },
        });
      }
    }

    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: isValidRole(user.role) ? user.role : "Employee",
        department: user.department,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/forgot-password
 * Body: { email, captchaToken? }
 * Always returns the same success message if the request is valid (do not leak which emails exist).
 */
async function forgotPassword(req, res) {
  const { email, captchaToken } = req.body ?? {};
  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // If RECAPTCHA_SECRET is configured, captcha becomes required.
  const captcha = await verifyRecaptchaToken(captchaToken, req.ip);
  if (!captcha.ok) {
    return res.status(400).json({
      success: false,
      message: "reCAPTCHA verification failed",
    });
  }

  const trimmed = email.trim();
  const normalized = trimmed.toLowerCase();
  try {
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalized, mode: "insensitive" } },
      select: { id: true },
    });

    const genericOk = () =>
      res.json({
        success: true,
        message:
          "If this email is registered, a verification code has been sent.",
      });

    if (!user) {
      return genericOk();
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await setResetCode(normalized, user.id, code, 15 * 60 * 1000);

    try {
      const { sent } = await sendPasswordResetCodeEmail(trimmed, code);
      if (!sent) {
        console.log(
          `[Password reset — SMTP not configured] Code for ${trimmed}: ${code}`,
        );
      }
    } catch (mailErr) {
      console.error("sendPasswordResetCodeEmail error:", mailErr);
      return res.status(500).json({
        success: false,
        message: "Could not send email. Check SMTP settings.",
      });
    }

    return genericOk();
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * POST /api/reset-password
 * Body: { email, code, newPassword }
 */
async function resetPassword(req, res) {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, code, and new password are required",
    });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const normalized = String(email).trim().toLowerCase();

  if (!(await verifyAndConsumeResetCode(normalized, code, { maxAttempts: 5 }))) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification code",
    });
  }
  try {
    const hashed = await bcrypt.hash(String(newPassword), 10);
    const result = await prisma.user.updateMany({
      where: { email: { equals: normalized, mode: "insensitive" } },
      data: { password: hashed },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Password has been reset. You can sign in now.",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * GET /api/profile?userId=&email=
 * Returns the same user row as admin User management (database source of truth).
 */
async function getProfile(req, res) {
  const userId = Number(req.query.userId);
  const email =
    typeof req.query.email === "string" ? req.query.email.trim() : "";
  if (!Number.isFinite(userId) || !email) {
    return res.status(400).json({
      success: false,
      message: "userId and email query parameters are required",
    });
  }
  const normalized = email.toLowerCase();
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        avatarUrl: true,
        isActive: true,
      },
    });
    if (!user || user.email.toLowerCase() !== normalized) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    return res.json({
      success: true,
      user: {
        ...user,
        role: isValidRole(user.role) ? user.role : "Employee",
      },
    });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * PATCH /api/profile
 * Body: { userId, email, department?, avatarUrl? }
 * Updates profile fields only when email matches the user (demo-level self-service).
 */
async function patchProfile(req, res) {
  const { userId, email, department, avatarUrl } = req.body ?? {};
  const id = Number(userId);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const normalized = email.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, department: true, avatarUrl: true, isActive: true },
    });
    if (!user || user.email.toLowerCase() !== normalized) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const data = {};
    if (typeof department === "string") data.department = department.trim() || null;
    if (typeof avatarUrl === "string") data.avatarUrl = avatarUrl.trim() || null;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

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

    return res.json({
      success: true,
      user: {
        ...updated,
        role: isValidRole(updated.role) ? updated.role : "Employee",
      },
    });
  } catch (err) {
    console.error("patchProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * POST /api/profile/avatar (multipart)
 * Fields: userId, email; file field name: avatar
 */
async function uploadProfileAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  const { userId, email } = req.body ?? {};
  const id = Number(userId);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const normalized = email.trim().toLowerCase();
  const publicBase = (process.env.API_PUBLIC_BASE || "http://localhost:4000").replace(/\/$/, "");
  const avatarUrl = `${publicBase}/uploads/avatars/${req.file.filename}`;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    if (!user || user.email.toLowerCase() !== normalized) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { avatarUrl },
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

    return res.json({
      success: true,
      user: {
        ...updated,
        role: isValidRole(updated.role) ? updated.role : "Employee",
      },
    });
  } catch (err) {
    console.error("uploadProfileAvatar error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export {
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  patchProfile,
  uploadProfileAvatar,
};
