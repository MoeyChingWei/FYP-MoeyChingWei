import crypto from "node:crypto";
import express from "express";
import {
  ensureGmailLabel,
  exchangeGmailAuthorizationCode,
  getGmailAuthorizationUrl,
  getGmailConnectionStatus,
  getGmailConnectionStatusForEmail,
} from "../services/gmailOAuth.js";

const router = express.Router();
const pendingStates = new Map();
const frontendUrl = () =>
  (process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000")
    .replace(/\/$/, "");

router.get("/oauth/start", async (req, res) => {
  try {
    const state = crypto.randomBytes(24).toString("hex");
    pendingStates.set(state, {
      expiresAt: Date.now() + 10 * 60 * 1000,
      aliasEmail: String(req.query?.email || "").trim().toLowerCase(),
    });
    const url = await getGmailAuthorizationUrl(state);
    return res.redirect(url);
  } catch (error) {
    console.error("Gmail OAuth start error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/oauth/callback", async (req, res) => {
  const { code, state, error } = req.query;
  if (error) return res.status(400).send(`Gmail authorization was denied: ${error}`);
  if (!code || !state || !pendingStates.has(state)) {
    return res.status(400).send("Invalid or expired Gmail OAuth state.");
  }
  const pending = pendingStates.get(state);
  pendingStates.delete(state);
  if (!pending || Date.now() > pending.expiresAt) return res.status(400).send("Gmail OAuth state expired.");

  try {
    await exchangeGmailAuthorizationCode(String(code), pending.aliasEmail);
    return res.redirect(`${frontendUrl()}/settings?gmail=connected`);
  } catch (oauthError) {
    console.error("Gmail OAuth callback error:", oauthError);
    return res.status(500).send(`Gmail authorization failed: ${oauthError.message}`);
  }
});

router.get("/status", async (req, res) => {
  try {
    const email = String(req.query?.email || "").trim();
    return res.json({
      success: true,
      ...(email ? await getGmailConnectionStatusForEmail(email) : await getGmailConnectionStatus()),
    });
  } catch (error) {
    console.error("Gmail status error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/labels/ensure", async (req, res) => {
  try {
    const labelName = String(req.body?.name || "OptiMind").trim() || "OptiMind";
    const label = await ensureGmailLabel(labelName, req.body?.email);
    return res.json({ success: true, label: { id: label.id, name: label.name } });
  } catch (error) {
    console.error("Gmail label ensure error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
