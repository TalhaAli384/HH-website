"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldError, FormStatus } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations";

type LoginInput = z.input<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string>();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setError(undefined);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setError(body.error ?? "Sign in failed");
      const next = params.get("next");
      router.replace(next && /^\/(?![\/\\])/.test(next) ? next : "/admin");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" type="email" autoComplete="username" className={cn("field", errors.email && "field-error")} {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="label">Password</label>
          <Link href="/admin/forgot-password" className="mb-1.5 text-sm font-semibold text-navy hover:text-gold-dark">Forgot password?</Link>
        </div>
        <div className="relative">
          <input id="password" type={show ? "text" : "password"} autoComplete="current-password" className={cn("field pr-12", errors.password && "field-error")} {...register("password")} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-muted hover:text-navy" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>
      {params.get("reset") === "1" && !error && <FormStatus status="success" message="Your password has been reset. Sign in with your new password." />}
      <FormStatus status={error ? "error" : "idle"} message={error} />
      <Button type="submit" variant="navy" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
