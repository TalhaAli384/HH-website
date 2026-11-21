"use client";

import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useActionFormPending } from "@/components/admin/action-form";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/action-utils";

export function SubmitButton({ children = "Save changes", pendingText = "Saving…", disabled = false }: { children?: React.ReactNode; pendingText?: string; disabled?: boolean }) {
  const { pending: nativePending } = useFormStatus();
  const pending = useActionFormPending() || nativePending;
  return (
    <Button type="submit" variant="navy" disabled={pending || disabled}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? pendingText : children}
    </Button>
  );
}

export function ActionMessage({ state }: { state: ActionState }) {
  const ref = useRef<HTMLDivElement>(null);
  // Bring the first problem into view so the admin sees what to fix.
  useEffect(() => {
    if (!state.error) return;
    const field = ref.current?.closest("form")?.querySelector<HTMLElement>(".field-error");
    (field ?? ref.current)?.scrollIntoView({ behavior: "smooth", block: "center" });
    field?.focus({ preventScroll: true });
  }, [state]);

  if (state.error)
    return (
      <div ref={ref} role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> {state.error}
      </div>
    );
  if (state.ok && state.message)
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> {state.message}
      </div>
    );
  return null;
}
