"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

/** Two-step inline delete confirmation (no blocking browser dialog). */
export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete permanently?",
  compact = false,
}: {
  action: () => Promise<unknown>;
  label?: string;
  confirmText?: string;
  compact?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-2 py-1 text-sm">
        <span className="font-medium whitespace-nowrap text-red-700">{confirmText}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(async () => { await action(); setConfirming(false); })}
          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending && <Loader2 className="h-3 w-3 animate-spin" />} Yes
        </button>
        <button type="button" disabled={pending} onClick={() => setConfirming(false)} className="rounded-md px-2 py-1 text-xs font-semibold text-ink hover:bg-white">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg font-medium text-red-600 transition hover:bg-red-50",
        compact ? "p-2" : "px-3 py-2 text-sm",
      )}
      aria-label={label}
      title={label}
    >
      <Trash2 className="h-4 w-4" /> {!compact && label}
    </button>
  );
}
