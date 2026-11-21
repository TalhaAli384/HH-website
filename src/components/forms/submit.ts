import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/** Posts JSON to an API route and maps server-side field errors back onto the form. */
export async function submitJson<T extends FieldValues>(url: string, data: T, setError: UseFormSetError<T>) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.ok) return { ok: true as const };
    if (body.fieldErrors) {
      for (const [field, messages] of Object.entries(body.fieldErrors as Record<string, string[]>)) {
        if (messages?.[0]) setError(field as Path<T>, { message: messages[0] });
      }
    }
    return { ok: false as const, error: (body.error as string) ?? "Something went wrong. Please try again." };
  } catch {
    return { ok: false as const, error: "Network error — please check your connection and try again." };
  }
}
