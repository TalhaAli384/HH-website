import { NextResponse } from "next/server";
import { jsonError, readJson, validationError } from "@/lib/api";
import { upsertCustomer } from "@/lib/customers";
import { sendInquiryNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { quoteSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const ip = await getClientIp();
  const limit = rateLimit(`quote:${ip}`, 3, 10 * 60 * 1000);
  if (!limit.ok) {
    return jsonError(`Too many requests. Please try again in ${Math.ceil(limit.retryAfter / 60)} minute(s).`, 429);
  }

  const body = await readJson(request);
  if (!body) return jsonError("Invalid request body");

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const { website, ...data } = parsed.data;

  if (website) return NextResponse.json({ ok: true });

  try {
    const customer = await upsertCustomer(data);
    const quote = await prisma.quoteRequest.create({
      data: { ...data, email: data.email.toLowerCase(), ipAddress: ip, userId: customer.id },
      select: { id: true },
    });

    await sendInquiryNotification(`New quote request: ${data.projectType} — ${data.name}`, {
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      "Project type": data.projectType,
      Location: data.location,
      Budget: data.budget,
      "Project size": data.projectSize,
      Description: data.description,
    });

    return NextResponse.json({ ok: true, id: quote.id }, { status: 201 });
  } catch (error) {
    console.error("[api/quote]", error);
    return jsonError("We couldn't submit your request right now. Please try again or call us directly.", 500);
  }
}
