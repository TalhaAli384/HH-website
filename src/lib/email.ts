import "server-only";
import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function transport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  });
}

/**
 * Sends an internal notification for a new inquiry. Never throws: a mail outage
 * must not lose a lead that has already been saved to the database.
 */
export async function sendInquiryNotification(subject: string, fields: Record<string, string | null | undefined>) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;background:#F4F6F8;font-weight:600;color:#102A43;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 12px;color:#263238;white-space:pre-wrap">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:640px"><h2 style="color:#102A43;border-bottom:3px solid #D6A84F;padding-bottom:8px">${escapeHtml(subject)}</h2><table style="border-collapse:collapse;width:100%">${rows}</table><p style="color:#64748b;font-size:12px;margin-top:24px">Sent from the HH Constructions website. Manage this inquiry in the admin dashboard.</p></div>`;

  const t = transport();
  if (!t) {
    console.info(`[email] SMTP not configured — notification skipped: ${subject}`);
    return;
  }
  try {
    await t.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.NOTIFY_EMAIL,
      replyTo: fields.Email ?? undefined,
      subject,
      html,
    });
  } catch (error) {
    console.error("[email] Failed to send notification", error);
  }
}

/**
 * Emails a password-reset link to an admin. Returns false if mail could not be sent.
 * In development without SMTP, the link is printed to the server console instead.
 */
export async function sendPasswordResetEmail(to: string, name: string, link: string) {
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px"><h2 style="color:#102A43;border-bottom:3px solid #D6A84F;padding-bottom:8px">Reset your admin password</h2><p style="color:#263238">Hi ${escapeHtml(name)},</p><p style="color:#263238">We received a request to reset the password for your admin account. Click the button below to choose a new password. This link expires in 30 minutes and can only be used once.</p><p style="margin:28px 0"><a href="${escapeHtml(link)}" style="background:#102A43;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Reset password</a></p><p style="color:#64748b;font-size:13px">If you didn't request this, you can ignore this email — your password won't change.</p></div>`;

  const t = transport();
  if (!t) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] SMTP not configured — password reset link for ${to}:\n${link}`);
    } else {
      console.error("[email] SMTP not configured — cannot send password reset email");
    }
    return false;
  }
  try {
    await t.sendMail({ from: process.env.SMTP_FROM, to, subject: "Reset your admin password", html });
    return true;
  } catch (error) {
    console.error("[email] Failed to send password reset email", error);
    return false;
  }
}
