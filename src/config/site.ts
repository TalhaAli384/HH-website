// Static configuration. Company contact details below are only defaults —
// they are seeded into the database and editable from Admin → Company Settings.

export const siteConfig = {
  name: "High Horizon Marketing and Developers",
  shortName: "HH Constructions",
  tagline: "Building Dreams. Creating Landmarks.",
  description:
    "High Horizon Marketing and Developers delivers residential, commercial and turnkey construction, architectural design and real estate development with uncompromising quality and engineering excellence.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80",
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Our Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const defaultCompanyInfo = {
  phone: "+92 300 1234567",
  phoneAlt: "+92 42 3500 0000",
  email: "info@hhconstructions.com",
  whatsapp: "923001234567",
  address: "Suite 4, Main Boulevard, Gulberg III, Lahore, Pakistan",
  mapQuery: "Gulberg III, Lahore, Pakistan",
  hours: "Mon – Sat: 9:00 AM – 6:00 PM",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  youtube: "",
};

export type CompanyInfo = typeof defaultCompanyInfo;

export const defaultHomeContent = {
  heroTitle: "Building Dreams. Creating Landmarks.",
  heroSubtitle:
    "From luxury residences to commercial landmarks, we plan, design and build spaces that stand the test of time — delivered on schedule, on budget and to the highest engineering standards.",
  heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2400&q=80",
  introTitle: "A construction partner built on trust and precision",
  introText:
    "High Horizon Marketing and Developers is a full-service construction and real estate development company. Our architects, engineers and project managers work as one team to turn ambitious ideas into enduring structures — with transparent communication from first sketch to final handover.",
  statYears: 15,
  statProjects: 250,
  statClients: 180,
  statEngineers: 60,
  ctaTitle: "Ready to build something remarkable?",
  ctaText: "Tell us about your project and our team will prepare a detailed consultation and estimate — free of charge.",
};

export type HomeContent = typeof defaultHomeContent;

export const defaultAboutContent = {
  story:
    "Founded on a simple belief — that every structure should be built as if it were our own High Horizon Marketing and Developers has grown from a small team of engineers into a trusted, multi disciplinary construction and development firm. Over more than a decade we have delivered homes, commercial towers, interiors and complete developments for families, businesses and investors.",
  vision:
    "To be the most trusted name in construction and real estate development recognised for landmark projects, engineering excellence and lasting client relationships.",
  mission:
    "To deliver safe, high quality and sustainable construction through skilled people, modern methods and complete transparency  on time and within budget, every time.",
};

export type AboutContent = typeof defaultAboutContent;

export const projectCategoryLabels = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
  INTERIOR: "Interior",
  INFRASTRUCTURE: "Infrastructure",
  REAL_ESTATE: "Real Estate",
} as const;

export const projectStatusLabels = {
  COMPLETED: "Completed",
  ONGOING: "Ongoing",
  UPCOMING: "Upcoming",
} as const;

export const maxProjectGalleryImages = 30;

export const departmentLabels = {
  MANAGEMENT: "Management",
  ARCHITECTURE: "Architects",
  ENGINEERING: "Civil Engineers",
  PROJECT_MANAGEMENT: "Project Managers",
  TECHNICAL: "Technical Professionals",
} as const;

export const inquiryStatusLabels = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  RESPONDED: "Responded",
  CLOSED: "Closed",
} as const;

export const projectTypes = [
  "Residential Construction",
  "Commercial Construction",
  "Architectural Design",
  "Structural Engineering",
  "Interior & Exterior Design",
  "Real Estate Development",
  "Renovation & Remodeling",
  "Project Management",
  "Turnkey Construction",
  "Other",
] as const;

export const budgetRanges = [
  "Under PKR 10 Million",
  "PKR 10 – 25 Million",
  "PKR 25 – 50 Million",
  "PKR 50 – 100 Million",
  "PKR 100 – 250 Million",
  "Above PKR 250 Million",
  "Not sure yet",
] as const;

// Icons a service can use (names from lucide-react). Kept to a curated list
// so the admin dropdown stays meaningful and the client bundle stays small.
export const serviceIcons = [
  "Home",
  "Building2",
  "PencilRuler",
  "Columns3",
  "Sofa",
  "Landmark",
  "Hammer",
  "ClipboardList",
  "KeyRound",
  "HardHat",
  "Ruler",
  "Factory",
] as const;
