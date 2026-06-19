import "dotenv/config";

import prisma from "../config/prisma.js";
import { ROLES } from "../constants/roles.js";
import bcrypt from "bcrypt";

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@fyp.local";
  const password = process.env.SUPER_ADMIN_PASSWORD || "339595";
  const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

  const hashed = await bcrypt.hash(String(password), 10);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      password: hashed,
      name,
      role: ROLES.ADMIN,
    },
    update: {
      password: hashed,
      name,
      role: ROLES.ADMIN,
    },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log("✅ Super admin ready:");
  console.log(user);
  console.log(`Login with email="${email}" password="${password}"`);
}

main()
  .catch((err) => {
    console.error("createSuperAdmin failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

