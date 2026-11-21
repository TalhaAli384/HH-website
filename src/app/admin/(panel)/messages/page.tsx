import Link from "next/link";
import { InquiryFilters, Pagination } from "@/components/admin/inquiry-filters";
import { EmptyState, Flash, PageTitle, StatusBadge, TableWrap } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";
import type { InquiryStatus } from "@/generated/prisma/enums";

const PAGE_SIZE = 20;
const STATUSES = ["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"] as const;

type Props = { searchParams: Promise<{ status?: string; q?: string; page?: string; deleted?: string }> };

export default async function MessagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = STATUSES.find((s) => s === params.status) as InquiryStatus | undefined;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim();

  const where: Prisma.ContactMessageWhereInput = {
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : {}),
  };

  const [rows, total, grouped] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: true }),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count]));
  counts.ALL = grouped.reduce((a, g) => a + g._count, 0);

  return (
    <div>
      <PageTitle title="Contact Messages" description="Messages sent through the website contact form." />
      <Flash show={params.deleted === "1"} message="Message deleted." />
      <InquiryFilters base="/admin/messages" status={status} q={q} counts={counts} />
      {rows.length ? (
        <TableWrap>
          <thead>
            <tr><th>From</th><th>Message</th><th>Service</th><th>Status</th><th>Received</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={`/admin/messages/${r.id}`} className="block font-semibold text-navy hover:text-gold-dark">{r.name}</Link>
                  <span className="text-xs text-muted">{r.email}</span>
                </td>
                <td className="max-w-sm"><p className="line-clamp-2 text-ink/80">{r.message}</p></td>
                <td className="text-muted">{r.service ?? "—"}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="whitespace-nowrap text-muted">{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : (
        <EmptyState message={q || status ? "No messages match your filters." : "No messages yet. They will appear here when visitors use the contact form."} />
      )}
      <Pagination base="/admin/messages" page={page} pages={Math.ceil(total / PAGE_SIZE)} params={{ status, q }} />
    </div>
  );
}
