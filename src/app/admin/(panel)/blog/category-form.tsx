"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { createBlogCategory } from "@/actions/blog";
import type { ActionState } from "@/lib/action-utils";

export function CategoryForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createBlogCategory, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="space-y-2 border-t border-line pt-4">
      <label htmlFor="cat-name" className="label">Add category</label>
      <div className="flex gap-2">
        <input id="cat-name" name="name" required minLength={2} maxLength={60} className="field py-2.5" placeholder="e.g. Construction Tips" />
        <button disabled={pending} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy text-white hover:bg-navy-700 disabled:opacity-60" aria-label="Add category">
          <Plus className="h-5 w-5" />
        </button>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.fieldErrors?.name?.[0] ?? state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">{state.message}</p>}
    </form>
  );
}
