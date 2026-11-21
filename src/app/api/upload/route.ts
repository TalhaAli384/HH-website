import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { getCurrentAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { uploadImage } from "@/lib/upload";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return jsonError("Unauthorized", 401);

  if (!rateLimit(`upload:${admin.id}`, 60, 10 * 60 * 1000).ok) return jsonError("Upload limit reached, try later", 429);

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return jsonError("No file provided");

  try {
    const result = await uploadImage(file);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("[api/upload]", error);
    return jsonError(message, 400);
  }
}
