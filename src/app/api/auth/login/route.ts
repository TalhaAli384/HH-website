import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { jsonError, readJson } from "@/lib/api";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { loginSchema } from "@/lib/validations";

// Pre-computed hash used when the email doesn't exist, so response timing
// doesn't reveal which admin emails are registered.
const DUMMY_HASH = bcrypt.hashSync("timing-equaliser-not-a-real-password", 12);

export async function POST(request: Request) {
  const ip = await getClientIp();
  const limit = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) return jsonError("Too many login attempts. Please wait 15 minutes and try again.", 429);

  const parsed = loginSchema.safeParse(await readJson(request));
  if (!parsed.success) return jsonError("Enter a valid email and password", 422);

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !valid) return jsonError("Invalid email or password", 401);

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  await createSession({ sub: admin.id, email: admin.email, role: admin.role });

  return NextResponse.json({ ok: true });
}
