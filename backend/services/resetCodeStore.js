/**
 * DB-backed store for password-reset verification codes.
 * - One-time use
 * - Expires after ttlMs
 * - Attempts are tracked to mitigate brute-force guessing
 */

import crypto from "crypto";
import prisma from "../config/prisma.js";

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function hashCode(code, salt) {
  return crypto.createHash("sha256").update(`${salt}:${code}`).digest("hex");
}

async function setResetCode(email, userId, code, ttlMs = 15 * 60 * 1000) {
  const key = normalizeEmail(email);
  const salt = crypto.randomBytes(16).toString("hex");
  const codeHash = hashCode(String(code), salt);
  const expiresAt = new Date(Date.now() + ttlMs);

  // Invalidate previous unused codes for this email
  await prisma.passwordResetCode.updateMany({
    where: { email: key, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.passwordResetCode.create({
    data: {
      userId,
      email: key,
      codeHash,
      salt,
      expiresAt,
    },
  });
}

/**
 * Returns true if code matches and consumes it (one-time use).
 */
async function verifyAndConsumeResetCode(email, inputCode, opts = {}) {
  const key = normalizeEmail(email);
  const maxAttempts = Number(opts.maxAttempts ?? 5);

  const entry = await prisma.passwordResetCode.findFirst({
    where: { email: key, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!entry) return false;

  if (entry.attempts >= maxAttempts) {
    await prisma.passwordResetCode.update({
      where: { id: entry.id },
      data: { usedAt: new Date() },
    });
    return false;
  }

  if (new Date() > entry.expiresAt) {
    await prisma.passwordResetCode.update({
      where: { id: entry.id },
      data: { usedAt: new Date() },
    });
    return false;
  }

  const provided = String(inputCode ?? "").trim();
  const providedHash = hashCode(provided, entry.salt);
  const ok = crypto.timingSafeEqual(
    Buffer.from(providedHash, "hex"),
    Buffer.from(entry.codeHash, "hex"),
  );

  if (!ok) {
    await prisma.passwordResetCode.update({
      where: { id: entry.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.passwordResetCode.update({
    where: { id: entry.id },
    data: { usedAt: new Date() },
  });

  return true;
}

export { setResetCode, verifyAndConsumeResetCode };
