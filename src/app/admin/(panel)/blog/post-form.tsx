"use client";

import { ActionForm } from "@/components/admin/action-form";
import Link from "next/link";
import { useActionState } from "react";
import { saveBlogPost } from "@/actions/blog";
import { Checkbox, FormCard, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { ActionMessage, SubmitButton } from "@/components/admin/form-feedback";
import { ImageUpload } from "@/components/admin/image-upload";
import type { ActionState } from "@/lib/action-utils";
import type { BlogPost } from "@/generated/prisma/client";

export function PostForm({ post, categories }: { post?: BlogPost; categories: { id: string; name: string }[] }) {
  const [state, action] = useActionState<ActionState, FormData>(saveBlogPost.bind(null, post?.id ?? null), {});
  const e = state.fieldErrors;

  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <FormCard title="Content">
        <TextField name="title" label="Title" required defaultValue={post?.title} errors={e} />
        <TextField name="slug" label="URL slug" defaultValue={post?.slug} errors={e} hint="Leave blank to generate from the title." />
        <TextArea name="excerpt" label="Excerpt" required rows={2} defaultValue={post?.excerpt} errors={e} hint="Short summary for cards and search results." />
        <TextArea
          name="content"
          label="Article body"
          required
          rows={18}
          defaultValue={post?.content}
          errors={e}
          className="[&_textarea]:font-mono [&_textarea]:text-sm"
          hint='Separate paragraphs with a blank line. Use "## " for headings, "### " for subheadings and "- " for bullet lists.'
        />
      </FormCard>
      <div className="space-y-6">
        <FormCard title="Cover image">
          <ImageUpload name="coverImage" idName="coverImageId" label="Cover" required defaultUrl={post?.coverImage} defaultId={post?.coverImageId} error={e?.coverImage?.[0]} />
        </FormCard>
        <FormCard title="Settings">
          <SelectField name="categoryId" label="Category" defaultValue={post?.categoryId ?? ""} errors={e} options={[{ value: "", label: "Uncategorised" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
          <TextField name="readMinutes" label="Reading time (minutes)" type="number" min={1} defaultValue={post?.readMinutes ?? 4} errors={e} />
          <Checkbox name="published" label="Published" description="Unpublished posts are saved as drafts" defaultChecked={post?.published ?? true} />
        </FormCard>
        <ActionMessage state={state} />
        <div className="flex items-center gap-3">
          <SubmitButton>{post ? "Save changes" : "Create post"}</SubmitButton>
          <Link href="/admin/blog" className="px-3 py-2 text-sm font-medium text-muted hover:text-navy">Cancel</Link>
        </div>
      </div>
    </ActionForm>
  );
}
