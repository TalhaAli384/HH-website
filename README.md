# HH Constructions and Developers

**Building Dreams. Creating Landmarks.**

The corporate website, lead-generation platform and content management system for HH Constructions and Developers. It's a full-stack Next.js app with a PostgreSQL database and a secure admin dashboard.

---

## Features

**Public website**
- Home, About, Services, Projects (with filtering and detail pages), Our Team, Blog (with categories and pagination), Contact and Request a Quote
- Smooth Framer Motion animations: page transitions, hero text reveal, scroll reveals, animated counters, project filter transitions and the mobile menu
- Contact and quote forms validated on both client and server (React Hook Form + Zod), saved to the database, with email notifications
- Google Maps embed, a floating WhatsApp button, and click-to-call and email links
- SEO: per-page metadata, Open Graph and Twitter cards, `sitemap.xml`, `robots.txt`, and JSON-LD structured data (GeneralContractor and BlogPosting)
- Responsive from 320 px phones to large desktops, with accessible markup, a skip link, focus states and reduced-motion support

**Admin dashboard (`/admin`)**
- Secure login: bcrypt password hashing, signed HTTP-only JWT cookie and login rate limiting
- **Edit mode on the public site**: when signed in, the Projects and Blog pages (and each project or post page) show Add, Edit and Delete buttons, so the owner can manage content right where it appears. Use the "Owner login" link in the footer to sign in.
- Dashboard overview: total and new inquiries, project counts by status, recent activity
- Full CRUD for **Projects** (with a multi-image gallery: upload, captions and ordering), **Services**, **Team Members**, **Testimonials**, and **Blog Posts and Categories**
- **Quote Requests** and **Contact Messages**: filter, search, paginate, update status (New, In Progress, Responded, Closed), add internal notes and delete
- **Customers**: every enquirer grouped by email, with their quote and message history
- **Settings**: company contact info, social links, home page hero, stats and CTA copy, about page story, vision and mission, and password change
- Image uploads go to Cloudinary, or to local disk in development when Cloudinary isn't configured

**Security**
- Admin routes are protected twice: `src/proxy.ts` checks the JWT, then every page and server action re-checks the session against the database
- Server-side Zod validation on every input
- Rate limits on contact (5 per 10 min), quote (3 per 10 min), login (8 per 15 min) and uploads
- Honeypot spam traps on public forms
- Uploads are checked by MIME type, size (8 MB max) and magic bytes
- Security headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript |
| Styling | Tailwind CSS 4, Sora / Inter / Manrope via `next/font` |
| Animation | Framer Motion |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL + Prisma ORM 7 (with the `pg` driver adapter) |
| Auth | bcryptjs + jose (JWT in an HTTP-only cookie) |
| Media | Cloudinary |
| Email | Nodemailer (any SMTP provider) |

---

## Project structure

```
prisma/
  schema.prisma          Database models
  migrations/            SQL migrations
  seed.ts                Initial admin, content and sample data
scripts/
  create-admin.ts        Create an admin or reset an admin's password
src/
  app/
    (site)/              Public pages (shared navbar/footer layout)
    admin/login/         Admin sign-in
    admin/(panel)/       Protected dashboard pages
    api/                 contact, quote, upload, auth/login, auth/logout
    sitemap.ts, robots.ts, icon.svg, not-found.tsx, error.tsx
  actions/               Server actions for admin CRUD
  components/
    site/                Public UI (navbar, footer, cards, gallery…)
    home/                Home page hero
    admin/               Dashboard UI (sidebar, fields, image upload…)
    forms/               Contact and quote forms
    motion/              Reveal, stagger, counter, page transition
    ui/                  Buttons, icons
  config/                Site config, navigation, marketing copy
  lib/                   prisma, auth, session, validations, upload, email,
                         rate-limit, settings, utilities
  proxy.ts               Admin route protection (Next.js 16 "proxy", formerly middleware)
```

---

## Getting started

### Prerequisites
- **Node.js 20.19+** (22 LTS or newer recommended)
- **PostgreSQL 14+**: local, Docker, or a hosted service such as Neon, Supabase, Railway or RDS

### 1. Install dependencies

```bash
npm install
```

This also runs `prisma generate`.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `DATABASE_POOL_SIZE` | Optional | Max DB connections per server instance (default 10; use 1–3 on Vercel/serverless) |
| `AUTH_SECRET` | ✅ | Random string of at least 32 characters. Generate one with `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public URL, e.g. `https://hhconstructions.com` (used in SEO, the sitemap and OG tags) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | ✅ for seeding | First admin account |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Production | Image hosting. Without these, uploads are saved to `public/uploads` (local development only) |
| `CLOUDINARY_FOLDER` | Optional | Cloudinary folder (default `hh-constructions`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` | Recommended | Email notifications. Without these, notifications are only logged |
| `NOTIFY_EMAIL` | Recommended | Inbox that receives new-inquiry notifications |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Uses the Maps Embed API. Without it, the keyless embed is used |

### 3. Set up the database

Create an empty database, for example with local Postgres:

```bash
createdb hh_constructions
# or with Docker:
docker run --name hh-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hh_constructions -p 5432:5432 -d postgres:17
```

Apply the migrations, then seed the initial content:

```bash
npm run db:deploy     # applies prisma/migrations
npm run db:seed       # admin account, company settings, services, sample projects, team, blog
```

Seeding is safe to run again. It upserts records, and it won't overwrite settings or duplicate the team or testimonials you've already edited in the dashboard.

### 4. Run the development server

```bash
npm run dev
```

- Local website: http://localhost:3000
- Local admin: http://localhost:3000/admin (sign in with your `SEED_ADMIN_*` credentials)

> These `localhost` addresses work only on the computer running `npm run dev`; they are not public GitHub links. GitHub stores this project's source code but does not run the app. For public access, deploy it to a Next.js host such as Netlify or Vercel, then use the URL that host assigns. GitHub Pages is not suitable because this app uses server-rendered pages, API routes, and PostgreSQL.

> **Change the seeded admin password** right away in Admin → Settings → Change password.

---

## Database workflow

| Task | Command |
|---|---|
| Apply migrations (production/CI) | `npm run db:deploy` |
| Create a new migration after editing `schema.prisma` | `npm run db:migrate -- --name describe_change` |
| Regenerate the Prisma client | `npm run db:generate` |
| Seed data | `npm run db:seed` |
| Browse data in a GUI | `npm run db:studio` |
| Create an admin or reset a password | `npm run admin:create -- you@example.com "StrongPass123" "Your Name"` |

### Models

`Admin`, `User` (customers, grouped by email), `Project`, `ProjectImage`, `Service`, `TeamMember`, `Testimonial`, `ContactMessage`, `QuoteRequest`, `BlogPost`, `BlogCategory`, `SiteSetting` (editable company info and page content).

---

## Deployment

### Vercel (recommended)

1. Push the project to GitHub and import it in Vercel.
2. Add a PostgreSQL database (Vercel Postgres/Neon, Supabase, etc.) and set `DATABASE_URL`.
3. Set every environment variable from the table above in Project → Settings → Environment Variables. **Cloudinary is required** on Vercel, because its filesystem is read-only.
4. Set the build command to `npm run db:deploy && npm run build` so migrations run on each deploy. The default `npm run build` already runs `prisma generate`.
5. After the first deploy, seed once from your machine with the production `DATABASE_URL`:
   ```bash
   DATABASE_URL="postgres://…" SEED_ADMIN_PASSWORD="…" npm run db:seed
   ```

> Public pages are statically generated and revalidated, so **the database must be reachable during `next build`**.

### VPS / Docker / any Node host

```bash
npm ci
npm run db:deploy
npm run build
npm start               # serves on port 3000; put Nginx or Caddy in front for HTTPS
```

Use a process manager such as PM2 or systemd. If you run **multiple instances**, replace the in-memory rate limiter in `src/lib/rate-limit.ts` with Redis or Upstash. The API is a single `rateLimit(key, limit, windowMs)` function.

### Production checklist
- [ ] Strong, unique `AUTH_SECRET`
- [ ] Seeded admin password changed
- [ ] Cloudinary configured
- [ ] SMTP configured and a test inquiry received
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live domain (affects the sitemap and OG tags)
- [ ] Company phone, email, WhatsApp, address and social links updated in Admin → Settings
- [ ] Sample team members, testimonials, projects and blog posts replaced with real content
- [ ] Sitemap submitted to Google Search Console: `https://your-domain/sitemap.xml`

---

## Customisation

- **Colours and fonts**: the `@theme` block in `src/app/globals.css` and the fonts in `src/app/layout.tsx`
- **Navigation**: `mainNav` in `src/config/site.ts`
- **Project types and budget ranges** (quote form): `projectTypes` and `budgetRanges` in `src/config/site.ts`
- **Why Choose Us, process, values and milestones copy**: `src/config/content.ts`
- **Editable without code**: company info, home and about content, services, projects, team, testimonials and blog, all from the admin dashboard

### Blog formatting

Blog posts use simple, safe text formatting:

```
## Section heading
### Sub-heading

A paragraph. Separate paragraphs with a blank line.

- Bullet item
- Another bullet
```

---

## Notes

- Sample photography is from [Unsplash](https://unsplash.com) (free to use under the Unsplash License). Replace it with photos of your own projects for the best results.
- Sample team members, testimonials, clients and project details are placeholders for demonstration only.
