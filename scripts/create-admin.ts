// Creates an admin account or resets an existing admin's password.
// Usage: npm run admin:create -- <email> <password> [name]
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const [email, password, ...nameParts] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: npm run admin:create -- <email> <password> [name]");
  process.exit(1);
}
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash },
    create: { email: email.toLowerCase(), name: nameParts.join(" ") || "Administrator", passwordHash, role: "SUPER_ADMIN" },
  });
  console.log(`✓ Admin ready: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
