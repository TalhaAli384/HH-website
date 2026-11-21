"use client";

import { ActionForm } from "@/components/admin/action-form";
import { useActionState, useEffect, useRef } from "react";
import { changePassword, saveAllSettings } from "@/actions/settings";
import { FormCard, TextArea, TextField } from "@/components/admin/fields";
import { ActionMessage, SubmitButton } from "@/components/admin/form-feedback";
import { ImageUpload } from "@/components/admin/image-upload";
import type { AboutContent, CompanyInfo, HomeContent } from "@/config/site";
import type { ActionState } from "@/lib/action-utils";

export function ContentSettingsForm({ company: c, home: h, about: a }: { company: CompanyInfo; home: HomeContent; about: AboutContent }) {
  const [state, action] = useActionState<ActionState, FormData>(saveAllSettings, {});
  const e = state.fieldErrors;
  return (
    <ActionForm action={action} className="space-y-6">
      <FormCard title="Company information" description="Phone numbers, email and address shown in the header, footer, contact page and WhatsApp button.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="phone" label="Primary phone" required defaultValue={c.phone} errors={e} hint="Shown in the header, footer and call buttons." />
          <TextField name="phoneAlt" label="Secondary phone" defaultValue={c.phoneAlt} errors={e} hint="Shown in the footer and contact page." />
          <TextField name="email" label="Email" type="email" required defaultValue={c.email} errors={e} />
          <TextField name="whatsapp" label="WhatsApp number" required defaultValue={c.whatsapp} errors={e} hint="Digits only with country code, e.g. 923001234567" />
          <TextField name="address" label="Office address" required defaultValue={c.address} errors={e} className="sm:col-span-2" />
          <TextField name="mapQuery" label="Google Maps search" required defaultValue={c.mapQuery} errors={e} hint="Place name or address used for the map." />
          <TextField name="hours" label="Office hours" defaultValue={c.hours} errors={e} />
          <TextField name="facebook" label="Facebook URL" defaultValue={c.facebook} errors={e} />
          <TextField name="instagram" label="Instagram URL" defaultValue={c.instagram} errors={e} />
          <TextField name="linkedin" label="LinkedIn URL" defaultValue={c.linkedin} errors={e} />
          <TextField name="youtube" label="YouTube URL" defaultValue={c.youtube} errors={e} />
        </div>
      </FormCard>

      <FormCard title="Home page: hero section" description="The big headline, text and background photo at the top of the home page.">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <TextField name="heroTitle" label="Hero headline" required defaultValue={h.heroTitle} errors={e} hint="Sentences are split onto separate animated lines." />
            <TextArea name="heroSubtitle" label="Hero subtitle" required rows={3} defaultValue={h.heroSubtitle} errors={e} />
          </div>
          <ImageUpload name="heroImage" idName="heroImageId" label="Hero background" required defaultUrl={h.heroImage} error={e?.heroImage?.[0]} />
        </div>
      </FormCard>

      <FormCard title="Home page: numbers" description="The counters shown under the hero (and on the About page).">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          <TextField name="statYears" label="Years of experience" type="number" min={0} defaultValue={h.statYears} errors={e} />
          <TextField name="statProjects" label="Projects delivered" type="number" min={0} defaultValue={h.statProjects} errors={e} />
          <TextField name="statClients" label="Happy clients" type="number" min={0} defaultValue={h.statClients} errors={e} />
          <TextField name="statEngineers" label="Engineers & experts" type="number" min={0} defaultValue={h.statEngineers} errors={e} />
        </div>
      </FormCard>

      <FormCard title="Home page: introduction and call to action">
        <TextField name="introTitle" label="Introduction title" required defaultValue={h.introTitle} errors={e} />
        <TextArea name="introText" label="Introduction text" required rows={4} defaultValue={h.introText} errors={e} />
        <TextField name="ctaTitle" label="Call-to-action title" required defaultValue={h.ctaTitle} errors={e} />
        <TextArea name="ctaText" label="Call-to-action text" required rows={2} defaultValue={h.ctaText} errors={e} />
      </FormCard>

      <FormCard title="About page content">
        <TextArea name="story" label="Company story" required rows={6} defaultValue={a.story} errors={e} hint="Separate paragraphs with a blank line." />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextArea name="vision" label="Vision" required rows={4} defaultValue={a.vision} errors={e} />
          <TextArea name="mission" label="Mission" required rows={4} defaultValue={a.mission} errors={e} />
        </div>
      </FormCard>

      {/* One save bar for every section above, kept in view while scrolling. */}
      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-line bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          {state.error || state.ok ? <ActionMessage state={state} /> : <p className="text-sm text-muted">Changes appear on the website as soon as you save.</p>}
        </div>
        <SubmitButton>Save all changes</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<ActionState, FormData>(changePassword, {});
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  const e = state.fieldErrors;
  return (
    <form ref={ref} action={action}>
      <FormCard title="Change password" description="Use at least 10 characters including a letter and a number.">
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField name="currentPassword" label="Current password" type="password" autoComplete="current-password" required errors={e} />
          <TextField name="newPassword" label="New password" type="password" autoComplete="new-password" required errors={e} />
          <TextField name="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" required errors={e} />
        </div>
        <ActionMessage state={state} />
        <SubmitButton>Update password</SubmitButton>
      </FormCard>
    </form>
  );
}
