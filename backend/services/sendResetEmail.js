import nodemailer from "nodemailer";

/**
 * Sends a 6-digit reset code by email when SMTP_* env vars are set.
 * If SMTP_HOST is missing, returns { sent: false } — caller should log the code for dev.
 */
async function sendPasswordResetCodeEmail(to, code) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    return { sent: false };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "OptiMind — Password reset verification code",
    text: `Your verification code is: ${code}\n\nIt expires in 15 minutes.\nIf you did not request this, ignore this email.`,
    html: `<p>Your verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p><p>It expires in 15 minutes.</p><p>If you did not request this, you can ignore this email.</p>`,
  });

  return { sent: true };
}

export { sendPasswordResetCodeEmail };
