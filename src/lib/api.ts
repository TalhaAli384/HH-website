import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function validationError(error: z.ZodError) {
  return jsonError("Please correct the highlighted fields.", 422, { fieldErrors: z.flattenError(error).fieldErrors });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
