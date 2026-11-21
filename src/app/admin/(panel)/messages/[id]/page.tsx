import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteMessage, updateMessage } from "@/actions/inquiries";
import { DeleteButton } from "@/components/admin/delete-button";
import { FormCard } from "@/components/admin/fields";
import { InquiryStatusForm } from "@/components/admin/inquiry-status-form";
import { StatusBadge } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const msg = await prisma.contactMessage.findUnique({ where: { id: (await params).id } });
  if (!msg) notFound();

  return (
    <div>
      <Link href="/admin/messages" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" /> All messages
      </Link>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">{msg.name}</h1>
            <StatusBadge status={msg.status} />
          </div>
          <p className="mt-1.5 text-muted">Received {formatDate(msg.createdAt, { dateStyle: "full", timeStyle: "short" } as Intl.DateTimeFormatOptions)}</p>
        </div>
        <DeleteButton action={deleteMessage.bind(null, msg.id)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <FormCard title={msg.service ? `Inquiry about: ${msg.service}` : "Message"}>
          <p className="leading-relaxed whitespace-pre-wrap text-ink/85">{msg.message}</p>
          <div className="flex flex-wrap gap-3 border-t border-line pt-5">
            <a href={`mailto:${msg.email}?subject=${encodeURIComponent("Re: Your inquiry — High Horizon Marketing")}`} className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"><Mail className="h-4 w-4" /> Reply to {msg.email}</a>
            {msg.phone && <a href={`tel:${msg.phone}`} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-navy hover:border-navy"><Phone className="h-4 w-4" /> {msg.phone}</a>}
          </div>
        </FormCard>
        <FormCard title="Manage message" className="self-start">
          <InquiryStatusForm id={msg.id} status={msg.status} notes={msg.notes} action={updateMessage} />
        </FormCard>
      </div>
    </div>
  );
}
