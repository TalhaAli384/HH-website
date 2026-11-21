import { z } from "zod";
import { budgetRanges, projectTypes } from "@/config/site";

// Shared by client forms (react-hook-form) and server handlers, so the same
// rules are enforced on both sides.

const phone = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number")
  .max(20, "Please enter a valid phone number")
  .regex(/^[+()\d\s-]+$/, "Please enter a valid phone number");

// Hidden field that real users never fill in; bots usually do.
const honeypot = z.string().max(0).optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address").trim().max(150),
  phone: phone.optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(5000),
  website: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone,
  email: z.email("Please enter a valid email address").trim().max(150),
  projectType: z.enum(projectTypes, { error: "Please select a project type" }),
  location: z.string().trim().min(2, "Please enter the project location").max(200),
  budget: z.enum(budgetRanges, { error: "Please select a budget range" }),
  projectSize: z.string().trim().min(1, "Please enter the approximate size").max(100),
  description: z.string().trim().min(20, "Please describe your project in at least 20 characters").max(5000),
  website: honeypot,
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required").max(200),
});

// Plain-language messages instead of Zod's technical defaults.
z.config({
  customError: (issue) => {
    if (issue.code === "too_small" && issue.origin === "string")
      return Number(issue.minimum) <= 1 ? "This field is required" : `Please enter at least ${issue.minimum} characters`;
    if (issue.code === "too_big" && issue.origin === "string") return `Please keep this under ${issue.maximum} characters`;
    if (issue.code === "too_small" && issue.origin === "number") return `Must be ${issue.minimum} or more`;
    if (issue.code === "too_big" && issue.origin === "number") return `Must be ${issue.maximum} or less`;
    if (issue.code === "invalid_type" && issue.expected === "number") return "Please enter a number";
    if (issue.code === "invalid_value") return "Please choose an option";
    return undefined;
  },
});

// ─── Admin content schemas ─────────────────────────────────────────────

const optionalText = z.string().trim().max(300).optional().transform((v) => v || null);
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => v || null)
  .refine((v) => !v || /^https?:\/\//.test(v), "Must be a valid URL");
const imageUrl = z.string().trim().min(1, "Image is required").max(500);
const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
const optionalDate = z
  .string()
  .optional()
  .transform((v) => (v ? new Date(v) : null))
  .refine((d) => d === null || !Number.isNaN(d.getTime()), "Invalid date");

export const projectSchema = z.object({
  title: z.string().trim().min(3).max(150),
  slug: z.string().trim().max(100).optional(),
  summary: z.string().trim().min(5).max(300),
  description: z.string().trim().min(10).max(20000),
  category: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "INTERIOR", "INFRASTRUCTURE", "REAL_ESTATE"]),
  status: z.enum(["COMPLETED", "ONGOING", "UPCOMING"]),
  location: z.string().trim().min(2).max(200),
  client: optionalText,
  area: optionalText,
  floors: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().min(0).max(300).nullable()),
  budget: optionalText,
  startDate: optionalDate,
  completionDate: optionalDate,
  coverImage: imageUrl,
  coverImageId: optionalText,
  specifications: z
    .string()
    .optional()
    .transform((raw) =>
      (raw ?? "")
        .split("\n")
        .map((line) => line.split(":"))
        .filter((parts) => parts.length >= 2 && parts[0].trim())
        .map(([label, ...rest]) => ({ label: label.trim(), value: rest.join(":").trim() })),
    ),
  featured: checkbox,
  published: checkbox,
});

export const serviceSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z.string().trim().max(100).optional(),
  summary: z.string().trim().min(5).max(300),
  description: z.string().trim().min(10).max(10000),
  icon: z.string().trim().min(1).max(40),
  image: imageUrl,
  imageId: optionalText,
  features: z
    .string()
    .optional()
    .transform((raw) => (raw ?? "").split("\n").map((s) => s.trim()).filter(Boolean)),
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
  featured: checkbox,
  published: checkbox,
});

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(100),
  position: z.string().trim().min(2).max(120),
  department: z.enum(["MANAGEMENT", "ARCHITECTURE", "ENGINEERING", "PROJECT_MANAGEMENT", "TECHNICAL"]),
  bio: z.string().trim().max(1000).optional().transform((v) => v || null),
  photo: imageUrl,
  photoId: optionalText,
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null)
    .refine((v) => !v || z.email().safeParse(v).success, "Invalid email"),
  linkedin: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).max(1000).default(0),
  published: checkbox,
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: optionalText,
  company: optionalText,
  content: z.string().trim().min(10).max(1500),
  rating: z.coerce.number().int().min(1).max(5),
  photo: z.string().trim().max(500).optional().transform((v) => v || null),
  photoId: optionalText,
  featured: checkbox,
  published: checkbox,
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().max(120).optional(),
  excerpt: z.string().trim().min(5).max(400),
  content: z.string().trim().min(10).max(50000),
  coverImage: imageUrl,
  coverImageId: optionalText,
  categoryId: z.string().trim().optional().transform((v) => v || null),
  readMinutes: z.coerce.number().int().min(1).max(120).default(4),
  published: checkbox,
});

export const blogCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: optionalText,
});

export const inquiryUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"]),
  notes: z.string().trim().max(5000).optional().transform((v) => v || null),
});

export const companySchema = z.object({
  phone: z.string().trim().min(5).max(40),
  phoneAlt: z.string().trim().max(40).default(""),
  email: z.email().trim(),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, "Digits only, including country code (e.g. 923001234567)"),
  address: z.string().trim().min(5).max(300),
  mapQuery: z.string().trim().min(2).max(300),
  hours: z.string().trim().max(120).default(""),
  facebook: z.string().trim().max(300).default(""),
  instagram: z.string().trim().max(300).default(""),
  linkedin: z.string().trim().max(300).default(""),
  youtube: z.string().trim().max(300).default(""),
});

export const homeContentSchema = z.object({
  heroTitle: z.string().trim().min(5).max(120),
  heroSubtitle: z.string().trim().min(10).max(500),
  heroImage: imageUrl,
  introTitle: z.string().trim().min(5).max(150),
  introText: z.string().trim().min(10).max(2000),
  statYears: z.coerce.number().int().min(0).max(1000),
  statProjects: z.coerce.number().int().min(0).max(100000),
  statClients: z.coerce.number().int().min(0).max(100000),
  statEngineers: z.coerce.number().int().min(0).max(100000),
  ctaTitle: z.string().trim().min(5).max(150),
  ctaText: z.string().trim().min(10).max(500),
});

export const aboutContentSchema = z.object({
  story: z.string().trim().min(20).max(5000),
  vision: z.string().trim().min(10).max(1000),
  mission: z.string().trim().min(10).max(1000),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(10, "Use at least 10 characters")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/\d/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset link is invalid"),
    newPassword: z
      .string()
      .min(10, "Use at least 10 characters")
      .max(200)
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/\d/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
