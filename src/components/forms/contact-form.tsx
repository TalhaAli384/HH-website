"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { projectTypes } from "@/config/site";
import { cn } from "@/lib/utils";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { FieldError, FormStatus, Honeypot } from "./form-status";
import { submitJson } from "./submit";

export function ContactForm({ defaultService = "" }: { defaultService?: string }) {
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", service: defaultService, message: "", website: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus({ type: "idle" });
    const result = await submitJson("/api/contact", data, setError);
    if (result.ok) {
      reset();
      setStatus({ type: "success", message: "Thank you! Your message has been received. Our team will get back to you within one business day." });
    } else {
      setStatus({ type: "error", message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
      <Honeypot register={register("website")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">Full name *</label>
          <input id="c-name" autoComplete="name" className={cn("field", errors.name && "field-error")} aria-invalid={!!errors.name} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="c-email" className="label">Email address *</label>
          <input id="c-email" type="email" autoComplete="email" className={cn("field", errors.email && "field-error")} aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <label htmlFor="c-phone" className="label">Phone number</label>
          <input id="c-phone" type="tel" autoComplete="tel" className={cn("field", errors.phone && "field-error")} aria-invalid={!!errors.phone} {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <label htmlFor="c-service" className="label">Service of interest</label>
          <select id="c-service" className="field" {...register("service")}>
            <option value="">Select a service</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="label">Message *</label>
        <textarea id="c-message" rows={5} className={cn("field resize-y", errors.message && "field-error")} aria-invalid={!!errors.message} {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>
      <FormStatus status={status.type} message={status.message} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
