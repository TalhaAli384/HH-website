// Seeds the database with the initial admin account, company content and
// sample portfolio data. Safe to re-run: records are upserted by unique keys.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { defaultAboutContent, defaultCompanyInfo, defaultHomeContent } from "../src/config/site";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const img = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

const I = {
  skyscrapers: "1486406146926-c627a92ad1ab",
  skyline: "1460472178825-e5240623afd5",
  whiteFacade: "1479839672679-a46483c0e7c8",
  apartments: "1545324418-cc1a3fa10c00",
  angledFacade: "1541976590-713941681591",
  cranes: "1429497419816-9ca5cfb4571a",
  blueprints: "1503387762-592deb58ef4e",
  worker: "1589939705384-5185137a7f0f",
  hardhat: "1621905251189-08b45d6a269e",
  renovation: "1517581177682-a085bb7ffb15",
  townhouse: "1504615755583-2916b52192a3",
  officeOpen: "1531973576160-7125cd663d86",
  office: "1497366216548-37526070297c",
  office2: "1497366811353-6870744d04b2",
  livingRoom: "1586023492125-27b2c045efd7",
  interior: "1618221195710-dd6b41faaea6",
  modernHouse: "1600585154340-be6161a56a0c",
  luxuryHouse: "1600596542815-ffad4c1539a9",
  woodHouse: "1600566753190-17f0baa2a6c3",
  villa: "1512917774080-9991f1c4c750",
  house: "1564013799919-ab600027ffc6",
  suburban: "1605276374104-dee2a0ed3cd6",
  engineersOnSite: "1626885930974-4b69aa21bbf9",
  siteTeam: "1541888946425-d81bb19240f5",
  crewHighRise: "1504307651254-35680f356dfd",
  rebarWork: "1531834685032-c34bf0d84c77",
  framing: "1508450859948-4e04fabaa4ea",
  carpenter: "1587582423116-ec07293f0395",
  excavator: "1503708928676-1cb796a0891e",
  architectDrawing: "1581092160562-40aa08e78837",
  glassTower: "1554469384-e58fac16e23a",
  towersUp: "1511818966892-d7d671e672a2",
  greyFacade: "1448630360428-65456885c650",
  museumFacade: "1487958449943-2429e8be8625",
  poolVilla: "1613490493576-7fde63acd811",
  whiteVilla: "1613977257363-707ba9348227",
  pinkVilla: "1580587771525-78b9dba3b914",
  cladHouse: "1600047509807-ba8f99d2cdde",
  glassPavilion: "1582268611958-ebfd161ef9cf",
  duskHouse: "1494526585095-c41746248156",
  timberApartments: "1574362848149-11496d93a7c7",
  openLiving: "1600607687939-ce8a6c25118c",
  bedroom: "1600607687644-c7171b42498f",
  lounge: "1600210492486-724fe5c67fb0",
};

const services = [
  {
    title: "Residential Construction",
    icon: "Home",
    image: I.modernHouse,
    summary: "Custom homes, villas and residential buildings crafted with precision and premium materials.",
    description:
      "From single-family homes to luxury villas and multi-unit residences, we build homes designed around the way you live. Every project is engineered for strength, comfort and long-term value.\n\nOur residential team manages everything — design coordination, approvals, grey structure, finishing and handover — so you deal with one accountable partner from start to finish.",
    features: ["Custom home design & build", "Luxury villas and farmhouses", "Grey structure & complete finishing", "Approved structural drawings", "Quality-certified materials", "Structural warranty"],
    featured: true,
  },
  {
    title: "Commercial Construction",
    icon: "Building2",
    image: I.skyscrapers,
    summary: "Offices, retail centres and mixed-use buildings delivered on schedule and to specification.",
    description:
      "We deliver commercial buildings that work as hard as the businesses inside them — corporate offices, shopping centres, hotels, hospitals and mixed-use towers.\n\nWith experience across high-rise RCC and steel structures, we bring rigorous planning, safety management and value engineering to every commercial project.",
    features: ["Corporate offices & towers", "Retail & shopping centres", "Hotels and hospitality", "Healthcare & education facilities", "Value engineering", "Fast-track delivery"],
    featured: true,
  },
  {
    title: "Architectural Design",
    icon: "PencilRuler",
    image: I.architectDrawing,
    summary: "Award-worthy architecture balancing aesthetics, function, budget and buildability.",
    description:
      "Our architects translate your ideas into spaces that are beautiful, functional and buildable. We begin with your needs, site and budget, then develop concepts, 3D visualisations and complete working drawings.\n\nBecause our designers work alongside our engineers and builders, every design is grounded in real construction costs and methods.",
    features: ["Concept & master planning", "3D renders and walkthroughs", "Working & municipal drawings", "Sustainable design strategies", "Landscape design", "Authority approvals"],
    featured: true,
  },
  {
    title: "Structural Engineering",
    icon: "Columns3",
    image: I.rebarWork,
    summary: "Safe, efficient and code-compliant structural design for buildings of every scale.",
    description:
      "Our structural engineers design the frameworks that keep buildings standing safely for generations. Using modern analysis software and current building codes, we deliver optimised RCC and steel designs.\n\nWe also provide structural audits, retrofitting and strengthening solutions for existing buildings.",
    features: ["RCC & steel structure design", "Seismic & wind analysis", "Foundation & soil engineering", "Structural audits", "Retrofitting & strengthening", "Construction supervision"],
    featured: false,
  },
  {
    title: "Interior & Exterior Design",
    icon: "Sofa",
    image: I.openLiving,
    summary: "Elegant interiors and striking facades that elevate every space.",
    description:
      "We craft interiors and exteriors that reflect your personality and brand — from luxury residences to corporate workplaces.\n\nOur team handles space planning, material selection, custom joinery, lighting design, facades and landscaping, delivering a fully finished space ready to enjoy.",
    features: ["Residential & corporate interiors", "Facade & elevation design", "Custom furniture & joinery", "Lighting design", "Material & finish selection", "Turnkey fit-outs"],
    featured: true,
  },
  {
    title: "Real Estate Development",
    icon: "Landmark",
    image: I.timberApartments,
    summary: "End-to-end development of residential communities and commercial real estate.",
    description:
      "Our development division identifies opportunities, plans and delivers residential communities, apartment buildings and commercial properties.\n\nWe manage land acquisition support, feasibility, design, approvals, construction and sales coordination — creating valuable assets for investors and quality homes for buyers.",
    features: ["Feasibility studies", "Housing schemes & communities", "Apartment developments", "Commercial real estate", "Investor partnerships", "Sales & marketing coordination"],
    featured: true,
  },
  {
    title: "Renovation & Remodeling",
    icon: "Hammer",
    image: I.renovation,
    summary: "Breathe new life into existing homes and buildings with expert renovation.",
    description:
      "Whether it is a kitchen upgrade, a full home remodel or the adaptive reuse of a commercial building, we renovate with minimal disruption and maximum care.\n\nOur engineers assess the existing structure first, so every renovation is safe, compliant and built to last.",
    features: ["Complete home remodeling", "Kitchen & bathroom upgrades", "Extensions & additional floors", "Commercial refurbishment", "Waterproofing & repairs", "Structural strengthening"],
    featured: false,
  },
  {
    title: "Project Management",
    icon: "ClipboardList",
    image: I.engineersOnSite,
    summary: "Professional oversight that keeps scope, schedule, budget and quality on track.",
    description:
      "Our certified project managers act as your representative throughout the project lifecycle — planning, procurement, contractor coordination, cost control and quality assurance.\n\nYou receive transparent weekly reporting, so you always know exactly where your project stands.",
    features: ["Planning & scheduling", "Cost control & BOQs", "Procurement management", "Quality assurance", "Contractor coordination", "Weekly progress reports"],
    featured: false,
  },
  {
    title: "Turnkey Construction Solutions",
    icon: "KeyRound",
    image: I.whiteVilla,
    summary: "Design, build and finish under one contract — just collect the keys.",
    description:
      "Our turnkey service covers everything from the first sketch to the final coat of paint. One contract, one team, one fixed price and one point of accountability.\n\nIt is the simplest, most reliable way to build — ideal for overseas clients and busy professionals.",
    features: ["Single-point responsibility", "Fixed-price contracts", "Design + approvals + build", "Complete finishing & fit-out", "Ideal for overseas clients", "Ready-to-move handover"],
    featured: false,
  },
];

type Spec = { label: string; value: string };
const projects: {
  title: string;
  summary: string;
  description: string;
  category: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "INTERIOR" | "INFRASTRUCTURE" | "REAL_ESTATE";
  status: "COMPLETED" | "ONGOING" | "UPCOMING";
  location: string;
  client?: string;
  area?: string;
  floors?: number;
  startDate?: string;
  completionDate?: string;
  cover: string;
  gallery: string[];
  specifications: Spec[];
  featured?: boolean;
}[] = [
  {
    title: "The Meridian Business Tower",
    summary: "A 22-storey Grade-A commercial tower with smart building systems and a glass curtain-wall facade.",
    description:
      "The Meridian Business Tower is a landmark Grade-A office development designed for leading corporate tenants. Its high-performance glass curtain wall maximises natural light while controlling solar heat gain.\n\nThe tower features high-speed lifts, a building management system, three basement parking levels and a rooftop terrace. Our team delivered design coordination, structure, MEP and complete finishing.",
    category: "COMMERCIAL",
    status: "COMPLETED",
    location: "Gulberg, Lahore",
    client: "Meridian Holdings",
    area: "285,000 sq ft",
    floors: 22,
    startDate: "2021-03-01",
    completionDate: "2024-06-01",
    cover: I.skyscrapers,
    gallery: [I.glassTower, I.towersUp, I.crewHighRise, I.officeOpen, I.office],
    specifications: [
      { label: "Structure", value: "RCC core with post-tensioned slabs" },
      { label: "Facade", value: "Unitised double-glazed curtain wall" },
      { label: "Parking", value: "3 basements · 420 cars" },
      { label: "Lifts", value: "8 high-speed passenger + 2 service" },
      { label: "Systems", value: "BMS, VRF HVAC, fire suppression" },
    ],
    featured: true,
  },
  {
    title: "Palm Grove Luxury Villa",
    summary: "A contemporary 2-kanal family villa with double-height living spaces and a landscaped pool deck.",
    description:
      "Palm Grove is a contemporary family residence designed around light, openness and connection to the garden. A double-height living area opens onto a landscaped pool deck through full-height glazing.\n\nThe villa includes five en-suite bedrooms, a home cinema, a gym and a fully automated smart-home system.",
    category: "RESIDENTIAL",
    status: "COMPLETED",
    location: "DHA Phase 6, Lahore",
    area: "2 Kanal · 9,800 sq ft",
    floors: 3,
    startDate: "2022-01-01",
    completionDate: "2023-09-01",
    cover: I.poolVilla,
    gallery: [I.luxuryHouse, I.openLiving, I.bedroom, I.lounge, I.interior],
    specifications: [
      { label: "Structure", value: "RCC frame structure" },
      { label: "Bedrooms", value: "5 en-suite bedrooms" },
      { label: "Amenities", value: "Pool, home cinema, gym, basement" },
      { label: "Finishes", value: "Imported porcelain, solid wood, quartz" },
      { label: "Smart home", value: "Automated lighting, security & climate" },
    ],
    featured: true,
  },
  {
    title: "Skyline Residences",
    summary: "A 14-storey luxury apartment development with 112 premium units and resort-style amenities.",
    description:
      "Skyline Residences offers 2, 3 and 4-bedroom luxury apartments with panoramic city views. The development includes a rooftop infinity pool, fitness centre, children's play areas and 24/7 security.\n\nConstruction is progressing on schedule, with the structure topped out and facade and finishing works underway.",
    category: "REAL_ESTATE",
    status: "ONGOING",
    location: "Bahria Town, Lahore",
    area: "1.2 million sq ft",
    floors: 14,
    startDate: "2024-02-01",
    completionDate: "2026-12-01",
    cover: I.apartments,
    gallery: [I.rebarWork, I.crewHighRise, I.cranes, I.angledFacade],
    specifications: [
      { label: "Units", value: "112 apartments (2, 3 & 4 bed)" },
      { label: "Structure", value: "RCC shear-wall system" },
      { label: "Amenities", value: "Rooftop pool, gym, community hall" },
      { label: "Parking", value: "2 basements" },
    ],
    featured: true,
  },
  {
    title: "Crescent Corporate Headquarters",
    summary: "Complete interior fit-out of a 60,000 sq ft corporate headquarters for a financial services firm.",
    description:
      "We designed and delivered a modern, collaborative workplace across four floors for a leading financial services company. The design blends open workspaces, private offices, meeting suites and wellness areas.\n\nThe project was completed in 16 weeks while adjacent floors remained occupied.",
    category: "INTERIOR",
    status: "COMPLETED",
    location: "Blue Area, Islamabad",
    client: "Crescent Financial",
    area: "60,000 sq ft",
    floors: 4,
    startDate: "2023-05-01",
    completionDate: "2023-09-01",
    cover: I.officeOpen,
    gallery: [I.office, I.office2, I.lounge],
    specifications: [
      { label: "Scope", value: "Design, MEP, joinery, furniture" },
      { label: "Workstations", value: "480 seats" },
      { label: "Ceilings", value: "Exposed services with acoustic baffles" },
      { label: "Duration", value: "16 weeks" },
    ],
    featured: true,
  },
  {
    title: "Greenfield Family Homes",
    summary: "A gated community of 48 modern family homes with parks, a mosque and community centre.",
    description:
      "Greenfield is a thoughtfully planned gated community offering modern 10-marla and 1-kanal family homes. Wide boulevards, landscaped parks and underground utilities create a calm, family-friendly environment.\n\nPhase one homes have been handed over, with phase two under construction.",
    category: "REAL_ESTATE",
    status: "ONGOING",
    location: "Raiwind Road, Lahore",
    area: "42 acres",
    startDate: "2023-08-01",
    completionDate: "2027-03-01",
    cover: I.cladHouse,
    gallery: [I.suburban, I.duskHouse, I.pinkVilla, I.excavator, I.siteTeam],
    specifications: [
      { label: "Homes", value: "48 houses (10 Marla & 1 Kanal)" },
      { label: "Infrastructure", value: "Underground electricity, gas & sewerage" },
      { label: "Amenities", value: "Parks, mosque, community centre" },
      { label: "Security", value: "Gated with 24/7 CCTV" },
    ],
    featured: true,
  },
  {
    title: "Heritage Townhouse Restoration",
    summary: "Structural strengthening and complete restoration of a historic townhouse into a boutique residence.",
    description:
      "This project combined careful heritage restoration with modern structural engineering. We strengthened the original load-bearing walls, replaced deteriorated timber floors and restored the original facade details.\n\nInside, the home was remodelled with contemporary kitchens, bathrooms and services while preserving its character.",
    category: "RESIDENTIAL",
    status: "COMPLETED",
    location: "Model Town, Lahore",
    area: "4,200 sq ft",
    floors: 3,
    startDate: "2022-09-01",
    completionDate: "2023-05-01",
    cover: I.townhouse,
    gallery: [I.renovation, I.livingRoom],
    specifications: [
      { label: "Scope", value: "Structural retrofit & full restoration" },
      { label: "Structure", value: "Steel-reinforced masonry strengthening" },
      { label: "Facade", value: "Brick restoration and repointing" },
    ],
  },
  {
    title: "Azure Modern Residence",
    summary: "A minimalist 1-kanal home with timber cladding, courtyard gardens and passive cooling design.",
    description:
      "Azure is a minimalist home designed to stay cool naturally. Deep overhangs, cross-ventilation and a central courtyard reduce energy use, while timber cladding adds warmth to the crisp architectural form.\n\nThe home is currently in the finishing stage.",
    category: "RESIDENTIAL",
    status: "ONGOING",
    location: "DHA Phase 8, Lahore",
    area: "1 Kanal · 6,200 sq ft",
    floors: 2,
    startDate: "2025-04-01",
    completionDate: "2026-08-01",
    cover: I.woodHouse,
    gallery: [I.modernHouse, I.carpenter, I.framing, I.interior],
    specifications: [
      { label: "Design", value: "Passive cooling with central courtyard" },
      { label: "Cladding", value: "Thermally treated timber" },
      { label: "Energy", value: "10 kW rooftop solar" },
    ],
  },
  {
    title: "Horizon Mixed-Use Plaza",
    summary: "A 9-storey mixed-use development combining retail podium, offices and serviced apartments.",
    description:
      "Horizon Plaza will bring retail, workspace and living together in one vibrant address. The three-level retail podium supports offices and serviced apartments above, with a landscaped public plaza at street level.\n\nDesign development and approvals are complete, and site mobilisation is planned for early 2027.",
    category: "COMMERCIAL",
    status: "UPCOMING",
    location: "Faisalabad",
    area: "340,000 sq ft",
    floors: 9,
    startDate: "2027-02-01",
    completionDate: "2029-06-01",
    cover: I.museumFacade,
    gallery: [I.whiteFacade, I.greyFacade, I.architectDrawing],
    specifications: [
      { label: "Retail", value: "3-level podium · 85 shops" },
      { label: "Offices", value: "3 floors of flexible workspace" },
      { label: "Residences", value: "64 serviced apartments" },
    ],
  },
  {
    title: "Lakeside Villas",
    summary: "An exclusive enclave of 12 waterfront villas with private gardens and lake views.",
    description:
      "Lakeside Villas is an exclusive collection of 12 luxury residences set around a landscaped lake. Each villa features private gardens, expansive terraces and premium specifications.\n\nMaster planning is complete and bookings will open soon.",
    category: "REAL_ESTATE",
    status: "UPCOMING",
    location: "Islamabad",
    area: "18 acres",
    startDate: "2027-05-01",
    cover: I.whiteVilla,
    gallery: [I.glassPavilion, I.villa, I.house],
    specifications: [
      { label: "Villas", value: "12 waterfront residences" },
      { label: "Plot sizes", value: "2 – 4 Kanal" },
      { label: "Amenities", value: "Clubhouse, lake promenade, gated security" },
    ],
  },
  {
    title: "Northgate Logistics Facility",
    summary: "A 150,000 sq ft pre-engineered steel warehouse and distribution centre.",
    description:
      "Northgate is a modern logistics hub with a clear-span pre-engineered steel structure, high-load industrial flooring and 24 loading docks.\n\nThe facility was delivered on a fast-track programme in under 10 months.",
    category: "INDUSTRIAL",
    status: "COMPLETED",
    location: "Sundar Industrial Estate, Lahore",
    area: "150,000 sq ft",
    floors: 1,
    startDate: "2023-01-01",
    completionDate: "2023-10-01",
    cover: I.excavator,
    gallery: [I.siteTeam, I.engineersOnSite, I.hardhat, I.worker],
    specifications: [
      { label: "Structure", value: "Pre-engineered steel, 40 m clear span" },
      { label: "Flooring", value: "Laser-screeded 8 t/m² slab" },
      { label: "Docks", value: "24 loading bays with levellers" },
    ],
  },
];

const portraits = {
  m1: "1507003211169-0a1dd7228f2d",
  m2: "1500648767791-00dcc994a43e",
  m3: "1472099645785-5658abf4ff4e",
  m4: "1519085360753-af0119f7cbe7",
  m5: "1560250097-0b93528c311a",
  m6: "1566492031773-4f4e44671857",
  f1: "1494790108377-be9c29b29330",
  f2: "1573496359142-b8d87734a5a2",
  f3: "1580489944761-15a19d654956",
};

const team = [
  { name: "Hamza Hassan", position: "Chief Executive Officer", department: "MANAGEMENT", photo: portraits.m4, bio: "Civil engineer with over 18 years of experience leading residential and commercial developments." },
  { name: "Haris Hameed", position: "Director of Operations", department: "MANAGEMENT", photo: portraits.m5, bio: "Oversees project delivery, safety and quality across all active sites." },
  { name: "Sara Malik", position: "Chief Financial Officer", department: "MANAGEMENT", photo: portraits.f2, bio: "Chartered accountant ensuring transparent costing and financial discipline on every project." },
  { name: "Omar Siddiqui", position: "Head of Business Development", department: "MANAGEMENT", photo: portraits.m1, bio: "Builds lasting relationships with clients, investors and development partners." },
  { name: "Ayesha Raza", position: "Principal Architect", department: "ARCHITECTURE", photo: portraits.f1, bio: "Leads our design studio, blending contemporary architecture with local context." },
  { name: "Bilal Ahmed", position: "Senior Architect", department: "ARCHITECTURE", photo: portraits.m6, bio: "Specialises in residential design, 3D visualisation and sustainable planning." },
  { name: "Usman Tariq", position: "Lead Structural Engineer", department: "ENGINEERING", photo: portraits.m2, bio: "Designs safe, efficient RCC and steel structures for high-rise and complex buildings." },
  { name: "Fatima Noor", position: "Civil Engineer", department: "ENGINEERING", photo: portraits.f3, bio: "Manages site engineering, quality testing and construction supervision." },
  { name: "Ali Raza", position: "Senior Project Manager", department: "PROJECT_MANAGEMENT", photo: portraits.m3, bio: "PMP-certified manager delivering commercial projects on time and within budget." },
  { name: "Zain Abbas", position: "MEP Engineer", department: "TECHNICAL", photo: portraits.m1, bio: "Designs and coordinates mechanical, electrical and plumbing systems." },
] as const;

const testimonials = [
  { name: "Imran Qureshi", role: "Homeowner", company: "DHA Lahore", content: "HH Constructions built our family home exactly as we imagined it. The quality of work, communication and attention to detail were outstanding from start to finish.", photo: portraits.m3 },
  { name: "Nadia Khan", role: "Managing Director", company: "Crescent Financial", content: "Our new headquarters was delivered in just 16 weeks without disrupting our operations. The team was professional, organised and incredibly responsive.", photo: portraits.f2 },
  { name: "Tariq Mehmood", role: "Overseas Client", company: "Dubai, UAE", content: "Living abroad, I needed a builder I could trust completely. Weekly photo updates and transparent billing gave me total peace of mind. Highly recommended.", photo: portraits.m5 },
  { name: "Rabia Aslam", role: "Investor", company: "Skyline Residences", content: "The development team is transparent, punctual and genuinely committed to quality. It has been a pleasure investing in their projects.", photo: portraits.f1 },
  { name: "Kamran Javed", role: "CEO", company: "Northgate Logistics", content: "They delivered our warehouse ahead of schedule with excellent build quality. Their engineering expertise saved us significant costs.", photo: portraits.m2 },
];

const categories = [
  { name: "Industry Updates", description: "News and trends from the construction industry." },
  { name: "Company News", description: "Announcements from HH Constructions." },
  { name: "Construction Tips", description: "Practical advice for building and renovating." },
  { name: "Project Updates", description: "Progress reports from our sites." },
];

const posts = [
  {
    title: "10 Things to Know Before Building Your Dream Home",
    category: "Construction Tips",
    cover: I.pinkVilla,
    excerpt: "Planning to build? From budgeting and approvals to choosing the right builder, here is what every homeowner should know before breaking ground.",
    content: `Building a home is one of the most significant investments you will ever make. Careful planning at the start saves time, money and stress later. Here are ten things every homeowner should consider.

## 1. Set a realistic budget

Your budget should cover more than construction. Include design fees, approvals, utility connections, finishing, landscaping and a contingency of 10–15% for the unexpected.

## 2. Verify the plot and approvals

Confirm ownership documents, zoning regulations, setbacks and the permitted covered area before you design anything.

## 3. Invest in good design

A well-designed home is easier to build, cheaper to maintain and more comfortable to live in. Good architecture pays for itself.

## 4. Choose the right builder

Look for:
- A portfolio of completed projects you can visit
- In-house engineers and site supervisors
- Clear, itemised quotations
- Written contracts and warranties

## 5. Never compromise on structure

Finishes can be upgraded later — the structure cannot. Insist on approved structural drawings, quality steel and tested concrete.

## Final thoughts

With the right team and a clear plan, building your dream home can be an exciting and rewarding journey. Our consultants are always happy to help you get started.`,
  },
  {
    title: "HH Constructions Tops Out Skyline Residences",
    category: "Project Updates",
    cover: I.apartments,
    excerpt: "Our flagship 14-storey apartment development reaches its highest point, marking a major milestone ahead of its 2026 handover.",
    content: `We are proud to announce that Skyline Residences has officially been topped out, with the final concrete pour completed on the 14th floor.

## A milestone for our team

The structural phase was completed two weeks ahead of schedule thanks to careful planning, an efficient shear-wall formwork system and the dedication of our site teams.

## What happens next

With the structure complete, work now moves to:
- Facade installation and glazing
- MEP rough-ins across all floors
- Internal finishing of show apartments
- Landscaping of the amenity deck

Handover of the first apartments is planned for December 2026. Thank you to our investors, buyers and partners for their continued trust.`,
  },
  {
    title: "Sustainable Construction Trends Shaping 2026",
    category: "Industry Updates",
    cover: I.museumFacade,
    excerpt: "From solar-ready design to low-carbon concrete, sustainability is transforming how buildings are designed and built.",
    content: `Sustainability is no longer optional in construction. Clients, regulators and investors increasingly expect buildings that use less energy and fewer resources.

## Passive design comes first

Orientation, shading, insulation and natural ventilation can dramatically reduce cooling loads before any equipment is installed.

## Solar-ready buildings

Rooftop solar has become a standard expectation. Designing roofs and electrical systems for solar from day one avoids costly retrofits.

## Smarter materials

Low-carbon cement blends, recycled steel and high-performance glazing are becoming more accessible and cost-effective.

## Our approach

At HH Constructions we integrate sustainable strategies into every project — reducing running costs for owners while building responsibly for the future.`,
  },
  {
    title: "Grey Structure vs. Turnkey: Which Contract Is Right for You?",
    category: "Construction Tips",
    cover: I.framing,
    excerpt: "Understanding the difference between grey-structure and turnkey contracts helps you choose the right balance of control, cost and convenience.",
    content: `When you hire a builder, one of the first decisions is the type of contract. The two most common options are grey structure and turnkey.

## Grey structure contracts

The builder delivers the structural shell — foundations, columns, beams, slabs, brickwork and plaster. You manage finishing separately.

Best for clients who want hands-on control over finishes and have time to manage multiple vendors.

## Turnkey contracts

The builder delivers a complete, ready-to-move-in home — structure, finishing, fixtures and fittings — under one contract.

Best for busy professionals and overseas clients who want a single point of responsibility.

## Our recommendation

If you value certainty, quality control and peace of mind, a turnkey contract is usually the better choice. Talk to our team for a side-by-side comparison for your project.`,
  },
  {
    title: "HH Constructions Launches Real Estate Development Division",
    category: "Company News",
    cover: I.engineersOnSite,
    excerpt: "Our new development division will plan and deliver residential communities and commercial properties for investors and homebuyers.",
    content: `HH Constructions and Developers is expanding with a dedicated real estate development division.

## Why development?

After more than a decade of building for clients, we are applying the same engineering standards to our own developments — giving buyers confidence that their homes are built properly.

## Current projects

The division is currently delivering Skyline Residences and Greenfield Family Homes, with Lakeside Villas and Horizon Plaza in the pipeline.

## Partner with us

We welcome enquiries from landowners and investors interested in joint-venture developments.`,
  },
];

async function main() {
  // Admin
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@hhconstructions.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) throw new Error("Set SEED_ADMIN_PASSWORD in .env before seeding");
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, name: process.env.SEED_ADMIN_NAME ?? "Site Administrator", role: "SUPER_ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✓ Admin: ${admin.email}`);

  // Settings (don't overwrite edits made in the dashboard)
  for (const [key, value] of Object.entries({ company: defaultCompanyInfo, home: defaultHomeContent, about: defaultAboutContent })) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  console.log("✓ Site settings");

  // Services
  for (const [i, s] of services.entries()) {
    const slug = s.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const data = { ...s, image: img(s.image, 1400), sortOrder: i + 1 };
    await prisma.service.upsert({ where: { slug }, update: data, create: { ...data, slug } });
  }
  console.log(`✓ ${services.length} services`);

  // Projects + gallery
  for (const p of projects) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { gallery, cover, startDate, completionDate, ...rest } = p;
    const data = {
      ...rest,
      coverImage: img(cover, 1800),
      startDate: startDate ? new Date(startDate) : null,
      completionDate: completionDate ? new Date(completionDate) : null,
      featured: p.featured ?? false,
    };
    const project = await prisma.project.upsert({ where: { slug }, update: data, create: { ...data, slug } });
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    await prisma.projectImage.createMany({
      data: gallery.map((g, i) => ({ projectId: project.id, url: img(g, 1600), sortOrder: i })),
    });
  }
  console.log(`✓ ${projects.length} projects`);

  // Team, testimonials: only seed when empty so dashboard edits aren't duplicated.
  if ((await prisma.teamMember.count()) === 0) {
    await prisma.teamMember.createMany({ data: team.map((m, i) => ({ ...m, photo: img(m.photo, 800), sortOrder: i + 1 })) });
    console.log(`✓ ${team.length} team members`);
  }
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials.map((t) => ({ ...t, photo: img(t.photo, 200), rating: 5 })) });
    console.log(`✓ ${testimonials.length} testimonials`);
  }

  // Blog
  const categoryIds: Record<string, string> = {};
  for (const c of categories) {
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    categoryIds[c.name] = (await prisma.blogCategory.upsert({ where: { slug }, update: {}, create: { ...c, slug } })).id;
  }
  for (const [i, p] of posts.entries()) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
    const data = {
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: img(p.cover, 1600),
      categoryId: categoryIds[p.category],
      authorId: admin.id,
      published: true,
      publishedAt: new Date(Date.now() - (i + 1) * 9 * 24 * 60 * 60 * 1000),
      readMinutes: Math.max(2, Math.round(p.content.split(/\s+/).length / 200)),
    };
    await prisma.blogPost.upsert({ where: { slug }, update: data, create: { ...data, slug } });
  }
  console.log(`✓ ${categories.length} blog categories, ${posts.length} posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
