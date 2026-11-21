"use client";

import { ActionForm } from "@/components/admin/action-form";
import { useActionState } from "react";
import { SelectField, TextArea } from "@/components/admin/fields";
import { ActionMessage, SubmitButton } from "@/components/admin/form-feedback";
import { inquiryStatusLabels } from "@/config/site";
import type { ActionState } from "@/lib/action-utils";

type Props = {
  id: string;
  status: keyof typeof inquiryStatusLabels;
  notes: string | null;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

export function InquiryStatusForm({ id, status, notes, action }: Props) {
  const [state, formAction] = useActionState(action, {});
  return (
    <ActionForm action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      <SelectField name="status" label="Status" defaultValue={status} errors={state.fieldErrors} options={Object.entries(inquiryStatusLabels).map(([value, label]) => ({ value, label }))} />
      <TextArea name="notes" label="Internal notes" rows={5} defaultValue={notes ?? ""} errors={state.fieldErrors} hint="Only visible to admins." />
      <ActionMessage state={state} />
      <SubmitButton>Update</SubmitButton>
    </ActionForm>
  );
}
