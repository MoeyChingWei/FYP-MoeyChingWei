import "dotenv/config";

import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";
import { ROLES } from "../constants/roles.js";

const TEST_PASSWORD = process.env.FORECAST_TEST_PASSWORD || "ForecastTest!2026";

const testGroups = [
  { emailKey: "tfin", department: "Finance" },
  { emailKey: "tops", department: "Operations" },
  { emailKey: "tit", department: "IT" },
  { emailKey: "thr", department: "Human Resources" },
  { emailKey: "tmkt", department: "Marketing" },
];

function buildTestUsers() {
  return testGroups.flatMap((group) => [
    {
      name: `${group.department} Forecast Executive`,
      email: `forecast.${group.emailKey}.executive@test.local`,
      role: ROLES.DEPARTMENT_EXECUTIVE,
      department: group.department,
    },
    ...Array.from({ length: 6 }, (_, index) => ({
      name: `${group.department} Forecast Employee ${String(index + 1).padStart(2, "0")}`,
      email: `forecast.${group.emailKey}.employee${String(index + 1).padStart(2, "0")}@test.local`,
      role: ROLES.EMPLOYEE,
      department: group.department,
    })),
  ]);
}

async function main() {
  const password = await bcrypt.hash(TEST_PASSWORD, 10);

  let createdUsers = 0;
  let updatedUsers = 0;
  for (const user of buildTestUsers()) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: user,
      });
      updatedUsers += 1;
      continue;
    }

    await prisma.user.create({
      data: { ...user, password },
    });
    createdUsers += 1;
  }

  const deletedDepartments = await prisma.department.deleteMany({
    where: { code: { in: ["TFIN", "TOPS", "TIT", "THR", "TMKT"] } },
  });

  console.log(`Forecast test users ready: ${createdUsers} created, ${updatedUsers} updated, 35 total.`);
  console.log("Departments used: Finance, Human Resources, IT, Operations, Marketing.");
  console.log(`Removed ${deletedDepartments.count} incorrectly created test departments.`);
  console.log("Emails use the forecast.*@test.local namespace.");
}

main()
  .catch((error) => {
    console.error("Failed to seed forecast test users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
