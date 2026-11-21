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

export default async function QuotesPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = STATUSES.find((s) => s === params.status) as InquiryStatus | undefined;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim();

  const where: Prisma.QuoteRequestWhereInput = {
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : {}),
  };

  const [rows, total, grouped] = await Promise.all([
    prisma.quoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.quoteRequest.count({ where }),
    prisma.quoteRequest.groupBy({ by: ["status"], _count: true }),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count]));
  counts.ALL = grouped.reduce((a, g) => a + g._count, 0);

  return (
    <div>
      <PageTitle title="Quote Requests" description="Quotation requests submitted from the website." />
      <Flash show={params.deleted === "1"} message="Quote request deleted." />
      <InquiryFilters base="/admin/quotes" status={status} q={q} counts={counts} />
      {rows.length ? (
        <TableWrap>
          <thead>
            <tr><th>Customer</th><th>Project</th><th>Budget</th><th>Status</th><th>Received</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={r.status === "NEW" ? "font-medium" : ""}>
                <td>
                  <Link href={`/admin/quotes/${r.id}`} className="block font-semibold text-navy hover:text-gold-dark">{r.name}</Link>
                  <span className="text-xs text-muted">{r.email} · {r.phone}</span>
                </td>
                <td>
                  <span className="block">{r.projectType}</span>
                  <span className="text-xs text-muted">{r.location} · {r.projectSize}</span>
                </td>
                <td className="text-muted">{r.budget}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="whitespace-nowrap text-muted">{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : (
        <EmptyState message={q || status ? "No quote requests match your filters." : "No quote requests yet. They will appear here when customers submit the quote form."} />
      )}
      <Pagination base="/admin/quotes" page={page} pages={Math.ceil(total / PAGE_SIZE)} params={{ status, q }} />
    </div>
  );
}
