import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, readJson, validationError } from "@/lib/api";
import { hashFingerprint, verifyResetToken } from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { resetPasswordSchema } from "@/lib/validations";

const INVALID = "This reset link is invalid or has expired. Please request a new one.";

export async function POST(request: Request) {
  const ip = await getClientIp();
  const limit = rateLimit(`reset:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) return jsonError("Too many attempts. Please wait 15 minutes and try again.", 429);

  const parsed = resetPasswordSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationError(parsed.error);

  const claims = await verifyResetToken(parsed.data.token);
  if (!claims) return jsonError(INVALID, 400);

  const admin = await prisma.admin.findUnique({ where: { id: claims.adminId } });
  if (!admin || hashFingerprint(admin.passwordHash) !== claims.fp) return jsonError(INVALID, 400);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) },
  });

  return NextResponse.json({ ok: true });
}
