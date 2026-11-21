"use server";

import bcrypt from "bcryptjs";
import { fail, formToObject, revalidatePublic, type ActionState } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SettingKey } from "@/lib/settings";
import { aboutContentSchema, changePasswordSchema, companySchema, homeContentSchema } from "@/lib/validations";

const schemas = { company: companySchema, home: homeContentSchema, about: aboutContentSchema } as const;

export async function saveSettings(key: SettingKey, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const schema = schemas[key];
  if (!schema) return fail("Unknown settings group");
  const parsed = schema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);

  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: parsed.data },
    create: { key, value: parsed.data },
  });
  revalidatePublic();
  return { ok: true, message: "Changes saved and published to the website." };
}

/** Saves company info, home and about content together, so one Save button covers the whole page. */
export async function saveAllSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const input = formToObject(formData);
  const results = (Object.keys(schemas) as SettingKey[]).map((key) => [key, schemas[key].safeParse(input)] as const);

  const fieldErrors: NonNullable<ActionState["fieldErrors"]> = {};
  for (const [, result] of results) if (!result.success) Object.assign(fieldErrors, fail(result.error).fieldErrors);
  if (Object.keys(fieldErrors).length) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };

  await prisma.$transaction(
    results.map(([key, result]) => {
      const value = result.data as object;
      return prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }),
  );
  revalidatePublic();
  return { ok: true, message: "All changes saved and published to the website." };
}

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = changePasswordSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);

  const record = await prisma.admin.findUnique({ where: { id: admin.id } });
  if (!record || !(await bcrypt.compare(parsed.data.currentPassword, record.passwordHash))) {
    return { ok: false, error: "Current password is incorrect.", fieldErrors: { currentPassword: ["Incorrect password"] } };
  }
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) } });
  return { ok: true, message: "Password updated successfully." };
}
