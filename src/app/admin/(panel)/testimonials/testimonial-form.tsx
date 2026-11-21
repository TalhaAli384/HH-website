"use client";

import { ActionForm } from "@/components/admin/action-form";
import Link from "next/link";
import { useActionState } from "react";
import { saveTestimonial } from "@/actions/testimonials";
import { Checkbox, FormCard, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { ActionMessage, SubmitButton } from "@/components/admin/form-feedback";
import { ImageUpload } from "@/components/admin/image-upload";
import type { ActionState } from "@/lib/action-utils";
import type { Testimonial } from "@/generated/prisma/client";

export function TestimonialForm({ testimonial: t }: { testimonial?: Testimonial }) {
  const [state, action] = useActionState<ActionState, FormData>(saveTestimonial.bind(null, t?.id ?? null), {});
  const e = state.fieldErrors;

  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <FormCard title="Testimonial">
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField name="name" label="Client name" required defaultValue={t?.name} errors={e} />
          <TextField name="role" label="Role" defaultValue={t?.role ?? ""} errors={e} placeholder="e.g. Homeowner" />
          <TextField name="company" label="Company / location" defaultValue={t?.company ?? ""} errors={e} />
        </div>
        <TextArea name="content" label="Testimonial" required rows={5} defaultValue={t?.content} errors={e} />
        <SelectField name="rating" label="Rating" defaultValue={String(t?.rating ?? 5)} errors={e} options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? "s" : ""}` }))} className="max-w-48" />
      </FormCard>
      <div className="space-y-6">
        <FormCard title="Photo (optional)">
          <ImageUpload name="photo" idName="photoId" label="Client photo" aspect="aspect-square" defaultUrl={t?.photo} defaultId={t?.photoId} error={e?.photo?.[0]} />
        </FormCard>
        <FormCard title="Visibility">
          <Checkbox name="published" label="Published" defaultChecked={t?.published ?? true} />
          <Checkbox name="featured" label="Featured" description="Show in the home page carousel" defaultChecked={t?.featured ?? true} />
        </FormCard>
        <ActionMessage state={state} />
        <div className="flex items-center gap-3">
          <SubmitButton>{t ? "Save changes" : "Add testimonial"}</SubmitButton>
          <Link href="/admin/testimonials" className="px-3 py-2 text-sm font-medium text-muted hover:text-navy">Cancel</Link>
        </div>
      </div>
    </ActionForm>
  );
}
