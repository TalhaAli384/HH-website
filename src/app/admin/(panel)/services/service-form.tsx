"use client";

import { ActionForm } from "@/components/admin/action-form";
import Link from "next/link";
import { useActionState } from "react";
import { saveService } from "@/actions/services";
import { Checkbox, FormCard, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { ActionMessage, SubmitButton } from "@/components/admin/form-feedback";
import { ImageUpload } from "@/components/admin/image-upload";
import { serviceIcons } from "@/config/site";
import type { ActionState } from "@/lib/action-utils";
import type { Service } from "@/generated/prisma/client";

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action] = useActionState<ActionState, FormData>(saveService.bind(null, service?.id ?? null), {});
  const e = state.fieldErrors;

  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <FormCard title="Service details">
        <TextField name="title" label="Title" required defaultValue={service?.title} errors={e} />
        <TextField name="slug" label="URL anchor" defaultValue={service?.slug} errors={e} hint="Used for /services#anchor links. Leave blank to generate." />
        <TextArea name="summary" label="Short summary" required rows={2} defaultValue={service?.summary} errors={e} hint="Shown on service cards." />
        <TextArea name="description" label="Full description" required rows={6} defaultValue={service?.description} errors={e} hint="Separate paragraphs with a blank line." />
        <TextArea name="features" label="Key features" rows={5} defaultValue={service?.features.join("\n")} errors={e} hint="One feature per line." />
      </FormCard>
      <div className="space-y-6">
        <FormCard title="Image & icon">
          <ImageUpload name="image" idName="imageId" label="Service image" required defaultUrl={service?.image} defaultId={service?.imageId} error={e?.image?.[0]} />
          <SelectField name="icon" label="Icon" defaultValue={service?.icon ?? "Building2"} errors={e} options={serviceIcons.map((i) => ({ value: i, label: i }))} />
          <TextField name="sortOrder" label="Display order" type="number" min={0} defaultValue={service?.sortOrder ?? 0} errors={e} />
        </FormCard>
        <FormCard title="Visibility">
          <Checkbox name="published" label="Published" defaultChecked={service?.published ?? true} />
          <Checkbox name="featured" label="Featured" description="Prioritise on the home page" defaultChecked={service?.featured ?? false} />
        </FormCard>
        <ActionMessage state={state} />
        <div className="flex items-center gap-3">
          <SubmitButton>{service ? "Save changes" : "Create service"}</SubmitButton>
          <Link href="/admin/services" className="px-3 py-2 text-sm font-medium text-muted hover:text-navy">Cancel</Link>
        </div>
      </div>
    </ActionForm>
  );
}
