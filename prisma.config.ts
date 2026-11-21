import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL is only needed for commands that talk to the database (migrate, seed, studio).
// `prisma generate` runs during `npm install` on hosts like Netlify, where the variable may
// not be available yet, so the datasource is only configured when the URL is present.
const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
});
