import { CheckCircle2, Plus } from "lucide-react";
import Link from "next/link";
import { inquiryStatusLabels } from "@/config/site";
import { cn } from "@/lib/utils";

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-muted">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-navy transition hover:bg-gold-light">
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}

export function Flash({ show, message }: { show: boolean; message: string }) {
  if (!show) return null;
  return (
    <div role="status" className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
      <CheckCircle2 className="h-5 w-5 shrink-0" /> {message}
    </div>
  );
}

const statusColors = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-600/20",
  IN_PROGRESS: "bg-amber-50 text-amber-800 ring-amber-600/20",
  RESPONDED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CLOSED: "bg-slate-100 text-slate-600 ring-slate-500/20",
} as const;

export function StatusBadge({ status }: { status: keyof typeof statusColors }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset", statusColors[status])}>
      {inquiryStatusLabels[status]}
    </span>
  );
}

export function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "gold" | "navy" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700",
    gold: "bg-gold/15 text-gold-dark",
    navy: "bg-navy/10 text-navy",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", tones[tone])}>{children}</span>;
}

export function EmptyState({ message, action }: { message: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <p className="text-muted">{message}</p>
      {action && (
        <Link href={action.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark">
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm [&_td]:px-5 [&_td]:py-4 [&_th]:px-5 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wider [&_th]:text-muted [&_th]:uppercase [&_thead]:bg-mist [&_tr]:border-b [&_tr]:border-line [&_tbody_tr:last-child]:border-0 [&_tbody_tr:hover]:bg-mist/50">
          {children}
        </table>
      </div>
    </div>
  );
}
