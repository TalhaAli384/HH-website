import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Lets the public site show inline edit controls to a signed-in admin. */
export async function GET() {
  const admin = await getCurrentAdmin();
  return NextResponse.json({ admin: admin ? { name: admin.name } : null }, { headers: { "Cache-Control": "no-store" } });
}
