import "server-only";
import { createHash } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { secretKey } from "@/lib/session";

const RESET_TTL = "30m";
const PURPOSE = "password-reset";

// Fingerprint of the current password hash. Embedding it in the token makes the
// link single-use: once the password changes, the fingerprint no longer matches.
export function hashFingerprint(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("base64url").slice(0, 22);
}

export async function signResetToken(adminId: string, passwordHash: string) {
  return new SignJWT({ purpose: PURPOSE, fp: hashFingerprint(passwordHash) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(RESET_TTL)
    .sign(secretKey());
}

export async function verifyResetToken(token: string): Promise<{ adminId: string; fp: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (payload.purpose !== PURPOSE || !payload.sub || typeof payload.fp !== "string") return null;
    return { adminId: payload.sub, fp: payload.fp };
  } catch {
    return null;
  }
}
