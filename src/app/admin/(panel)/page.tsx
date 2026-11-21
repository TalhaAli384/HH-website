import { ArrowRight, Briefcase, Building2, CheckCircle2, Clock, FileText, Inbox, TrendingUp } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [
    totalQuotes,
    newQuotes,
    totalMessages,
    newMessages,
    projectsByStatus,
    postCount,
    weekQuotes,
    weekMessages,
    recentQuotes,
    recentMessages,
  ] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.project.groupBy({ by: ["status"], _count: true }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.quoteRequest.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.contactMessage.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const byStatus = Object.fromEntries(projectsByStatus.map((p) => [p.status, p._count])) as Record<string, number>;
  const totalProjects = Object.values(byStatus).reduce((a, b) => a + b, 0);

  const cards = [
    { label: "Total Inquiries", value: totalQuotes + totalMessages, sub: `${weekQuotes + weekMessages} this week`, icon: TrendingUp, tone: "bg-navy text-gold", href: "/admin/quotes" },
    { label: "New Requests", value: newQuotes + newMessages, sub: `${newQuotes} quotes · ${newMessages} messages`, icon: Inbox, tone: "bg-gold text-navy", href: "/admin/quotes?status=NEW" },
    { label: "Total Projects", value: totalProjects, sub: `${byStatus.UPCOMING ?? 0} upcoming`, icon: Building2, tone: "bg-blue-50 text-blue-700", href: "/admin/projects" },
    { label: "Ongoing Projects", value: byStatus.ONGOING ?? 0, sub: "Under construction", icon: Clock, tone: "bg-amber-50 text-amber-700", href: "/admin/projects?status=ONGOING" },
    { label: "Completed Projects", value: byStatus.COMPLETED ?? 0, sub: "Delivered", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700", href: "/admin/projects?status=COMPLETED" },
    { label: "Published Posts", value: postCount, sub: "Blog & news", icon: FileText, tone: "bg-violet-50 text-violet-700", href: "/admin/blog" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1.5 text-muted">Overview of inquiries, projects and website content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{c.label}</p>
                <p className="mt-2 font-numeric text-4xl font-extrabold text-navy">{c.value}</p>
              </div>
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${c.tone}`}>
                <c.icon className="h-6 w-6" />
              </span>
            </div>
            <p className="mt-4 text-sm text-muted">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <RecentList
          title="Latest quote requests"
          icon={Briefcase}
          href="/admin/quotes"
          rows={recentQuotes.map((q) => ({ id: q.id, href: `/admin/quotes/${q.id}`, primary: q.name, secondary: `${q.projectType} · ${q.location}`, status: q.status, date: q.createdAt }))}
        />
        <RecentList
          title="Latest contact messages"
          icon={Inbox}
          href="/admin/messages"
          rows={recentMessages.map((m) => ({ id: m.id, href: `/admin/messages/${m.id}`, primary: m.name, secondary: m.message.slice(0, 70), status: m.status, date: m.createdAt }))}
        />
      </div>
    </div>
  );
}

function RecentList({
  title,
  icon: Icon,
  href,
  rows,
}: {
  title: string;
  icon: typeof Inbox;
  href: string;
  rows: { id: string; href: string; primary: string; secondary: string; status: "NEW" | "IN_PROGRESS" | "RESPONDED" | "CLOSED"; date: Date }[];
}) {
  return (
    <section className="rounded-2xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="flex items-center gap-2 text-base font-semibold"><Icon className="h-5 w-5 text-gold" /> {title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold-dark">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {rows.length ? (
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={r.href} className="flex items-center gap-4 px-6 py-4 hover:bg-mist/60">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy">{r.primary}</p>
                  <p className="truncate text-sm text-muted">{r.secondary}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={r.status} />
                  <span className="text-xs text-muted">{formatDate(r.date)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-6 py-10 text-center text-sm text-muted">Nothing here yet.</p>
      )}
    </section>
  );
}
