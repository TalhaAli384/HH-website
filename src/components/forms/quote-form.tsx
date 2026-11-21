"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { budgetRanges, projectTypes } from "@/config/site";
import { cn } from "@/lib/utils";
import { quoteSchema, type QuoteInput } from "@/lib/validations";
import { FieldError, FormStatus, Honeypot } from "./form-status";
import { submitJson } from "./submit";

export function QuoteForm({ defaultType }: { defaultType?: string }) {
  const [done, setDone] = useState(false);
  const [error, setErrorMessage] = useState<string>();
  // Match on the first word so "Turnkey Construction Solutions" preselects "Turnkey Construction".
  const firstWord = defaultType?.split(/\s+/)[0]?.toLowerCase();
  const initialType = firstWord ? projectTypes.find((t) => t.split(" ")[0].toLowerCase() === firstWord) : undefined;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { website: "", projectType: initialType },
  });

  const onSubmit = async (data: QuoteInput) => {
    setErrorMessage(undefined);
    const result = await submitJson("/api/quote", data, setError);
    if (result.ok) {
      reset({ website: "" });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" strokeWidth={1.5} />
          <h2 className="mt-6 text-3xl font-bold">Request received</h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Thank you for considering HH Constructions. A project consultant will review your requirements and contact you within one business day.
          </p>
          <Button variant="outline" className="mt-8" onClick={() => setDone(false)}>Submit another request</Button>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-8">
          <Honeypot register={register("website")} />
          <fieldset className="space-y-5">
            <legend className="mb-5 flex items-center gap-3 font-display text-lg font-semibold text-navy">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-navy font-numeric text-sm text-gold">1</span> Your details
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="q-name" className="label">Full name *</label>
                <input id="q-name" autoComplete="name" className={cn("field", errors.name && "field-error")} aria-invalid={!!errors.name} {...register("name")} />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <label htmlFor="q-phone" className="label">Phone number *</label>
                <input id="q-phone" type="tel" autoComplete="tel" className={cn("field", errors.phone && "field-error")} aria-invalid={!!errors.phone} {...register("phone")} />
                <FieldError message={errors.phone?.message} />
              </div>
              <div>
                <label htmlFor="q-email" className="label">Email address *</label>
                <input id="q-email" type="email" autoComplete="email" className={cn("field", errors.email && "field-error")} aria-invalid={!!errors.email} {...register("email")} />
                <FieldError message={errors.email?.message} />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-5 flex items-center gap-3 font-display text-lg font-semibold text-navy">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-navy font-numeric text-sm text-gold">2</span> Project information
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="q-type" className="label">Project type *</label>
                <select id="q-type" className={cn("field", errors.projectType && "field-error")} aria-invalid={!!errors.projectType} {...register("projectType")}>
                  <option value="">Select project type</option>
                  {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <FieldError message={errors.projectType?.message} />
              </div>
              <div>
                <label htmlFor="q-location" className="label">Project location *</label>
                <input id="q-location" placeholder="City, area" className={cn("field", errors.location && "field-error")} aria-invalid={!!errors.location} {...register("location")} />
                <FieldError message={errors.location?.message} />
              </div>
              <div>
                <label htmlFor="q-budget" className="label">Estimated budget *</label>
                <select id="q-budget" className={cn("field", errors.budget && "field-error")} aria-invalid={!!errors.budget} {...register("budget")}>
                  <option value="">Select budget range</option>
                  {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <FieldError message={errors.budget?.message} />
              </div>
              <div>
                <label htmlFor="q-size" className="label">Project size *</label>
                <input id="q-size" placeholder="e.g. 1 Kanal, 10 Marla, 5,000 sq ft" className={cn("field", errors.projectSize && "field-error")} aria-invalid={!!errors.projectSize} {...register("projectSize")} />
                <FieldError message={errors.projectSize?.message} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="q-desc" className="label">Project description *</label>
                <textarea id="q-desc" rows={6} placeholder="Tell us about your vision, timeline, number of floors, special requirements…" className={cn("field resize-y", errors.description && "field-error")} aria-invalid={!!errors.description} {...register("description")} />
                <FieldError message={errors.description?.message} />
              </div>
            </div>
          </fieldset>

          <FormStatus status={error ? "error" : "idle"} message={error} />
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSubmitting ? "Submitting…" : "Submit Inquiry"}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
