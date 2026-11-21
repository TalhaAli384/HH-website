import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  defaultAboutContent,
  defaultCompanyInfo,
  defaultHomeContent,
  type AboutContent,
  type CompanyInfo,
  type HomeContent,
} from "@/config/site";

const defaults = {
  company: defaultCompanyInfo,
  home: defaultHomeContent,
  about: defaultAboutContent,
} satisfies Record<string, object>;

export type SettingKey = keyof typeof defaults;
type SettingValue<K extends SettingKey> = K extends "company" ? CompanyInfo : K extends "home" ? HomeContent : AboutContent;

/** Reads an editable content block, falling back to defaults for any missing field. */
export const getSetting = cache(async <K extends SettingKey>(key: K): Promise<SettingValue<K>> => {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    const stored = (row?.value ?? {}) as Partial<SettingValue<K>>;
    return { ...(defaults[key] as SettingValue<K>), ...stored };
  } catch (error) {
    console.error(`[settings] Falling back to defaults for "${key}"`, error);
    return defaults[key] as SettingValue<K>;
  }
});
