import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function fail(error: z.ZodError | string): ActionState {
  if (typeof error === "string") return { ok: false, error };
  return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: z.flattenError(error).fieldErrors as ActionState["fieldErrors"] };
}

export function formToObject(formData: FormData) {
  const obj: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) if (!key.startsWith("$ACTION")) obj[key] = value;
  return obj;
}

/** Produces a slug that is unique for the given model, ignoring the record being edited. */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<{ id: string } | null>,
  currentId?: string | null,
) {
  const root = base || "item";
  let candidate = root;
  for (let i = 2; i < 100; i++) {
    const found = await exists(candidate);
    if (!found || found.id === currentId) return candidate;
    candidate = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}

/** Refreshes cached public pages after content changes. */
export function revalidatePublic(...paths: string[]) {
  revalidatePath("/(site)", "layout");
  for (const p of paths) revalidatePath(p);
}

export function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002";
}
