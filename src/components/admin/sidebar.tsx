"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { section: "Inquiries" },
  { href: "/admin/quotes", label: "Quote Requests", icon: Briefcase, badge: "quotes" },
  { href: "/admin/messages", label: "Contact Messages", icon: Inbox, badge: "messages" },
  { href: "/admin/customers", label: "Customers", icon: UserRound },
  { section: "Content" },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/team", label: "Team Members", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { section: "System" },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

type Props = { admin: { name: string; email: string }; counts: { quotes: number; messages: number } };

export function AdminSidebar({ admin, counts }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <Image src="/logo.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0" />
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-white">High Horizon Marketing</p>
          <p className="text-xs text-white/50">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        <ul className="space-y-0.5">
          {nav.map((item, i) =>
            "section" in item ? (
              <li key={i} className="px-3 pt-5 pb-2 text-[11px] font-semibold tracking-[0.18em] text-white/35 uppercase">
                {item.section}
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive(item.href) ? "bg-gold text-navy" : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && counts[item.badge] > 0 && (
                    <span className={cn("rounded-full px-2 py-0.5 font-numeric text-[11px] font-bold", isActive(item.href) ? "bg-navy text-white" : "bg-gold text-navy")}>
                      {counts[item.badge]}
                    </span>
                  )}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" /> View website
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-bold text-navy">{admin.name.charAt(0).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{admin.name}</p>
            <p className="truncate text-xs text-white/50">{admin.email}</p>
          </div>
          <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white" aria-label="Log out" title="Log out">
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-navy lg:block">{content}</aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <p className="font-display font-bold text-navy">High Horizon Marketing</p>
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg text-navy hover:bg-mist" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-navy-950/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 bg-navy lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <button onClick={() => setOpen(false)} className="absolute top-5 right-3 grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
