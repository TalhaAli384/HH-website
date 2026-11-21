"use client";

import { Loader2, LogOut, Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { deleteBlogPost } from "@/actions/blog";
import { deleteProject } from "@/actions/projects";
import { cn } from "@/lib/utils";

// Inline content management on the public site. Public pages stay statically
// cached; the admin check happens client-side and every action re-checks the
// session on the server.

type Kind = "project" | "blog";

const config: Record<Kind, { label: string; adminPath: string; publicPath: string; remove: (id: string) => Promise<unknown> }> = {
  project: { label: "project", adminPath: "/admin/projects", publicPath: "/projects", remove: deleteProject },
  blog: { label: "post", adminPath: "/admin/blog", publicPath: "/blog", remove: deleteBlogPost },
};

const AdminContext = createContext<{ name: string } | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<{ name: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => !cancelled && setAdmin(d.admin ?? null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => useContext(AdminContext);

/** Page-level bar: add new item, open the dashboard, sign out. */
export function AdminToolbar({ kind }: { kind: Kind }) {
  const admin = useAdmin();
  const router = useRouter();
  if (!admin) return null;
  const { label, adminPath } = config[kind];

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    window.location.reload();
  };

  return (
    <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-gold/40 bg-gold/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-gold-dark uppercase">Edit mode</p>
        <p className="mt-1 text-sm text-ink/80">
          Signed in as <span className="font-semibold text-navy">{admin.name}</span>. Use the buttons on each card to edit or delete.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`${adminPath}/new`} className="inline-flex h-10 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy-700">
          <Plus className="h-4 w-4" /> Add {label}
        </Link>
        <Link href={adminPath} className="inline-flex h-10 items-center gap-2 rounded-full border border-navy/20 px-4 text-sm font-semibold text-navy transition hover:bg-white">
          <Settings2 className="h-4 w-4" /> Manage all
        </Link>
        <button type="button" onClick={signOut} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink/70 transition hover:bg-white hover:text-navy">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

/** Edit / delete buttons. `overlay` floats them over a card; otherwise renders inline. */
export function AdminItemControls({
  kind,
  id,
  overlay = false,
  afterDelete,
  className,
}: {
  kind: Kind;
  id: string;
  overlay?: boolean;
  afterDelete?: "list";
  className?: string;
}) {
  const admin = useAdmin();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  if (!admin) return null;
  const { label, adminPath, publicPath, remove } = config[kind];

  const onDelete = () =>
    startTransition(async () => {
      await remove(id);
      setConfirming(false);
      if (afterDelete === "list") router.push(publicPath);
      router.refresh();
    });

  return (
    <div className={cn("flex items-center gap-2", overlay && "absolute top-3 right-3 z-20", className)}>
      {confirming ? (
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm shadow-lg ring-1 ring-red-200">
          <span className="font-medium whitespace-nowrap text-red-700">Delete this {label}?</span>
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {pending && <Loader2 className="h-3 w-3 animate-spin" />} Yes, delete
          </button>
          <button type="button" disabled={pending} onClick={() => setConfirming(false)} className="rounded-full px-2 py-1 text-xs font-semibold text-ink hover:bg-mist">
            Cancel
          </button>
        </div>
      ) : (
        <>
          <Link
            href={`${adminPath}/${id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-navy shadow-lg ring-1 ring-navy/10 transition hover:bg-gold"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-red-600 shadow-lg ring-1 ring-red-100 transition hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </>
      )}
    </div>
  );
}
