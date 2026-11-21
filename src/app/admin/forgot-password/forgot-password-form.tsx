"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldError, FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "@/lib/validations";

type ForgotInput = z.input<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotInput) => {
    setError(undefined);
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setError(body.error ?? "Something went wrong");
      setSent(true);
    } catch {
      setError("Network error — please try again.");
    }
  };

  return (
    <div className="mt-8 space-y-5">
      {sent ? (
        <FormStatus status="success" message="If that email belongs to an admin account, a reset link is on its way. It expires in 30 minutes. Check your spam folder if you don't see it." />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" autoComplete="username" className={cn("field", errors.email && "field-error")} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <FormStatus status={error ? "error" : "idle"} message={error} />
          <Button type="submit" variant="navy" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </div>
  );
}
