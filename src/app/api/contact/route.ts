import { NextResponse } from "next/server";
import { jsonError, readJson, validationError } from "@/lib/api";
import { upsertCustomer } from "@/lib/customers";
import { sendInquiryNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const ip = await getClientIp();
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return jsonError(`Too many messages. Please try again in ${Math.ceil(limit.retryAfter / 60)} minute(s).`, 429);
  }

  const body = await readJson(request);
  if (!body) return jsonError("Invalid request body");

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const { website, ...data } = parsed.data;

  // Honeypot filled → pretend success so bots don't retry.
  if (website) return NextResponse.json({ ok: true });

  try {
    const customer = await upsertCustomer(data);
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        service: data.service || null,
        message: data.message,
        ipAddress: ip,
        userId: customer.id,
      },
      select: { id: true },
    });

    await sendInquiryNotification(`New contact message from ${data.name}`, {
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Service: data.service,
      Message: data.message,
    });

    return NextResponse.json({ ok: true, id: message.id }, { status: 201 });
  } catch (error) {
    console.error("[api/contact]", error);
    return jsonError("We couldn't send your message right now. Please try again or call us directly.", 500);
  }
}
