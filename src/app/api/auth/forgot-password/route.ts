import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { sendPasswordResetEmail } from "@/lib/email";
import { signResetToken } from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { forgotPasswordSchema } from "@/lib/validations";

// Always responds the same way, so the form doesn't reveal which emails are admins.
export async function POST(request: Request) {
  const ip = await getClientIp();
  const limit = rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.ok) return jsonError("Too many requests. Please wait 15 minutes and try again.", 429);

  const parsed = forgotPasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError("Enter a valid email address", 422);

  const { email } = parsed.data;
  const perEmail = rateLimit(`forgot-email:${email}`, 3, 60 * 60 * 1000);
  const admin = perEmail.ok ? await prisma.admin.findUnique({ where: { email } }) : null;

  if (admin) {
    const token = await signResetToken(admin.id, admin.passwordHash);
    const base = (process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin).replace(/\/$/, "");
    await sendPasswordResetEmail(admin.email, admin.name, `${base}/admin/reset-password?token=${encodeURIComponent(token)}`);
  }

  return NextResponse.json({ ok: true });
}
