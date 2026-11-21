"use client";

import { ActionForm } from "@/components/admin/action-form";
import Link from "next/link";
import { useActionState } from "react";
import { saveTeamMember } from "@/actions/team";
import { Checkbox, FormCard, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { ActionMessage, SubmitButton } from "@/components/admin/form-feedback";
import { ImageUpload } from "@/components/admin/image-upload";
import { departmentLabels } from "@/config/site";
import type { ActionState } from "@/lib/action-utils";
import type { TeamMember } from "@/generated/prisma/client";

export function TeamForm({ member }: { member?: TeamMember }) {
  const [state, action] = useActionState<ActionState, FormData>(saveTeamMember.bind(null, member?.id ?? null), {});
  const e = state.fieldErrors;

  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <FormCard title="Profile">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="name" label="Full name" required defaultValue={member?.name} errors={e} />
          <TextField name="position" label="Position / title" required defaultValue={member?.position} errors={e} />
          <SelectField name="department" label="Department" required defaultValue={member?.department ?? "MANAGEMENT"} errors={e} options={Object.entries(departmentLabels).map(([value, label]) => ({ value, label }))} />
          <TextField name="sortOrder" label="Display order" type="number" min={0} defaultValue={member?.sortOrder ?? 0} errors={e} />
          <TextField name="email" label="Email" type="email" defaultValue={member?.email ?? ""} errors={e} />
          <TextField name="linkedin" label="LinkedIn URL" type="url" defaultValue={member?.linkedin ?? ""} errors={e} />
        </div>
        <TextArea name="bio" label="Short bio" rows={4} defaultValue={member?.bio ?? ""} errors={e} />
      </FormCard>
      <div className="space-y-6">
        <FormCard title="Photo">
          <ImageUpload name="photo" idName="photoId" label="Portrait" required aspect="aspect-[4/5]" defaultUrl={member?.photo} defaultId={member?.photoId} error={e?.photo?.[0]} />
          <Checkbox name="published" label="Published" defaultChecked={member?.published ?? true} />
        </FormCard>
        <ActionMessage state={state} />
        <div className="flex items-center gap-3">
          <SubmitButton>{member ? "Save changes" : "Add member"}</SubmitButton>
          <Link href="/admin/team" className="px-3 py-2 text-sm font-medium text-muted hover:text-navy">Cancel</Link>
        </div>
      </div>
    </ActionForm>
  );
}
