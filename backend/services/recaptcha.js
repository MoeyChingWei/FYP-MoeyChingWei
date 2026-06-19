import "dotenv/config";

/**
 * Verify Google reCAPTCHA token server-side.
 *
 * - If RECAPTCHA_SECRET is not configured, we treat captcha as disabled (local dev).
 * - Uses global fetch (Node 18+).
 */
export async function verifyRecaptchaToken(token, remoteIp) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret || String(secret).trim().length === 0) {
    return { ok: true, disabled: true };
  }

  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    const params = new URLSearchParams();
    params.set("secret", secret);
    params.set("response", token);
    if (remoteIp && typeof remoteIp === "string") params.set("remoteip", remoteIp);

    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = await r.json();

    if (data?.success) return { ok: true };
    return { ok: false, reason: "invalid_token", details: data };
  } catch (err) {
    console.error("verifyRecaptchaToken error:", err);
    return { ok: false, reason: "verify_failed" };
  }
}

