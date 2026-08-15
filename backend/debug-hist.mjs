import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from './prisma/generated/prisma/client/index.js';
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const depts = await prisma.department.findMany({
  where: { code: { startsWith: 'HIST' } },
  select: { id: true, code: true, name: true }
});
console.log('HIST departments:', JSON.stringify(depts, null, 2));

if (depts.length > 0) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { department: { equals: depts[0].code, mode: 'insensitive' } },
        { department: { equals: depts[0].name, mode: 'insensitive' } }
      ]
    },
    select: { id: true, email: true, department: true }
  });
  console.log('Users in dept:', JSON.stringify(users, null, 2));

  const prs = await prisma.purchaseRequestRecord.findMany({
    where: { localId: { contains: 'PR-HIST-' } },
    select: { localId: true, payload: true, createdAt: true }
  });
  console.log('PRs:', JSON.stringify(prs, null, 2));
}

await prisma.$disconnect();
await pool.end();
