import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteQuote, updateQuote } from "@/actions/inquiries";
import { DeleteButton } from "@/components/admin/delete-button";
import { FormCard } from "@/components/admin/fields";
import { InquiryStatusForm } from "@/components/admin/inquiry-status-form";
import { StatusBadge } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const quote = await prisma.quoteRequest.findUnique({ where: { id: (await params).id }, include: { user: { include: { _count: { select: { quoteRequests: true, contactMessages: true } } } } } });
  if (!quote) notFound();

  const fields = [
    ["Project type", quote.projectType],
    ["Location", quote.location],
    ["Estimated budget", quote.budget],
    ["Project size", quote.projectSize],
  ];
  const wa = quote.phone.replace(/[^\d]/g, "");

  return (
    <div>
      <Link href="/admin/quotes" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" /> All quote requests
      </Link>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">{quote.name}</h1>
            <StatusBadge status={quote.status} />
          </div>
          <p className="mt-1.5 text-muted">Received {formatDate(quote.createdAt, { dateStyle: "full", timeStyle: "short" } as Intl.DateTimeFormatOptions)}</p>
        </div>
        <DeleteButton action={deleteQuote.bind(null, quote.id)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <FormCard title="Project requirements">
            <dl className="grid gap-5 sm:grid-cols-2">
              {fields.map(([label, value]) => (
                <div key={label} className="rounded-xl bg-mist p-4">
                  <dt className="text-xs font-semibold tracking-wider text-muted uppercase">{label}</dt>
                  <dd className="mt-1 font-medium text-navy">{value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-navy">Description</h3>
              <p className="leading-relaxed whitespace-pre-wrap text-ink/85">{quote.description}</p>
            </div>
          </FormCard>
          <FormCard title="Contact customer">
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${quote.phone}`} className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"><Phone className="h-4 w-4" /> {quote.phone}</a>
              <a href={`mailto:${quote.email}?subject=${encodeURIComponent(`Your ${quote.projectType} quote — High Horizon Marketing`)}`} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-navy hover:border-navy"><Mail className="h-4 w-4" /> {quote.email}</a>
              {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-navy hover:border-navy"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
            </div>
            {quote.user && (
              <p className="text-sm text-muted">
                This customer has submitted {quote.user._count.quoteRequests} quote request(s) and {quote.user._count.contactMessages} message(s).{" "}
                <Link href={`/admin/customers?q=${encodeURIComponent(quote.email)}`} className="font-semibold text-navy hover:text-gold-dark">View customer</Link>
              </p>
            )}
          </FormCard>
        </div>
        <FormCard title="Manage request" className="self-start">
          <InquiryStatusForm id={quote.id} status={quote.status} notes={quote.notes} action={updateQuote} />
        </FormCard>
      </div>
    </div>
  );
}
