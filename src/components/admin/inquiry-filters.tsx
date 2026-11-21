import Link from "next/link";
import { inquiryStatusLabels } from "@/config/site";
import { cn } from "@/lib/utils";

type Status = keyof typeof inquiryStatusLabels;

export function InquiryFilters({ base, status, q, counts }: { base: string; status?: Status; q?: string; counts: Partial<Record<Status | "ALL", number>> }) {
  const tabs: { value?: Status; label: string; key: Status | "ALL" }[] = [
    { label: "All", key: "ALL" },
    ...(Object.keys(inquiryStatusLabels) as Status[]).map((s) => ({ value: s, label: inquiryStatusLabels[s], key: s })),
  ];
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.value ? `${base}?status=${t.value}` : base}
            className={cn("rounded-full px-4 py-2 text-sm font-medium transition", status === t.value ? "bg-navy text-white" : "bg-white text-ink/70 hover:text-navy")}
          >
            {t.label} <span className="font-numeric opacity-60">({counts[t.key] ?? 0})</span>
          </Link>
        ))}
      </div>
      <form className="w-full lg:w-72">
        {status && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Search name, email or phone…" className="field py-2.5" />
      </form>
    </div>
  );
}

export function Pagination({ base, page, pages, params }: { base: string; page: number; pages: number; params: Record<string, string | undefined> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    q.set("page", String(p));
    return `${base}?${q}`;
  };
  return (
    <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Pagination">
      <span className="text-muted">Page {page} of {pages}</span>
      <div className="flex gap-2">
        {page > 1 && <Link href={href(page - 1)} className="rounded-lg bg-white px-4 py-2 font-medium text-navy hover:bg-navy hover:text-white">Previous</Link>}
        {page < pages && <Link href={href(page + 1)} className="rounded-lg bg-white px-4 py-2 font-medium text-navy hover:bg-navy hover:text-white">Next</Link>}
      </div>
    </nav>
  );
}
