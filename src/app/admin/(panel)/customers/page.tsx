import Link from "next/link";
import { EmptyState, PageTitle, TableWrap } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim();
  const customers = await prisma.user.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : {},
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      _count: { select: { quoteRequests: true, contactMessages: true } },
      quoteRequests: { orderBy: { createdAt: "desc" }, take: 1, select: { id: true } },
    },
  });

  return (
    <div>
      <PageTitle title="Customers" description="Everyone who has contacted you, grouped by email address." />
      <form className="mb-6 sm:w-80">
        <input name="q" defaultValue={q} placeholder="Search name, email or phone…" className="field py-2.5" />
      </form>
      {customers.length ? (
        <TableWrap>
          <thead>
            <tr><th>Customer</th><th>Phone</th><th>Quotes</th><th>Messages</th><th>Last activity</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <p className="font-semibold text-navy">{c.name}</p>
                  <a href={`mailto:${c.email}`} className="text-xs text-muted hover:text-navy">{c.email}</a>
                </td>
                <td className="text-muted">{c.phone ?? "—"}</td>
                <td>
                  {c.quoteRequests[0] ? (
                    <Link href={`/admin/quotes?q=${encodeURIComponent(c.email)}`} className="font-numeric font-bold text-navy hover:text-gold-dark">{c._count.quoteRequests}</Link>
                  ) : (
                    <span className="font-numeric text-muted">0</span>
                  )}
                </td>
                <td>
                  {c._count.contactMessages ? (
                    <Link href={`/admin/messages?q=${encodeURIComponent(c.email)}`} className="font-numeric font-bold text-navy hover:text-gold-dark">{c._count.contactMessages}</Link>
                  ) : (
                    <span className="font-numeric text-muted">0</span>
                  )}
                </td>
                <td className="whitespace-nowrap text-muted">{formatDate(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : (
        <EmptyState message={q ? "No customers match your search." : "No customers yet."} />
      )}
    </div>
  );
}
