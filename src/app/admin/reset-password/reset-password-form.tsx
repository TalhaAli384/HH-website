"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldError, FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "@/lib/validations";

type ResetInput = z.input<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [error, setError] = useState<string>();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  if (!token) {
    return (
      <div className="mt-8 space-y-5">
        <FormStatus status="error" message="This reset link is missing or incomplete. Please request a new one." />
        <Link href="/admin/forgot-password" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark">Request a new link</Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetInput) => {
    setError(undefined);
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setError(body.error ?? "Could not reset password");
      router.replace("/admin/login?reset=1");
    } catch {
      setError("Network error — please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
      <input type="hidden" {...register("token")} />
      <div>
        <label htmlFor="newPassword" className="label">New password</label>
        <div className="relative">
          <input id="newPassword" type={show ? "text" : "password"} autoComplete="new-password" className={cn("field pr-12", errors.newPassword && "field-error")} {...register("newPassword")} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted hover:text-navy" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <FieldError message={errors.newPassword?.message} />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="label">Confirm new password</label>
        <input id="confirmPassword" type={show ? "text" : "password"} autoComplete="new-password" className={cn("field", errors.confirmPassword && "field-error")} {...register("confirmPassword")} />
        <FieldError message={errors.confirmPassword?.message} />
      </div>
      <FormStatus status={error ? "error" : "idle"} message={error} />
      {error && (
        <Link href="/admin/forgot-password" className="block text-sm font-semibold text-navy hover:text-gold-dark">Request a new reset link</Link>
      )}
      <Button type="submit" variant="navy" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        {isSubmitting ? "Saving…" : "Reset password"}
      </Button>
      <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </form>
  );
}
