const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./prisma/generated/prisma/client');
const pg = require('pg');

async function checkTables() {
  const pool = new pg.Pool({ connectionString: 'postgresql://postgres:FYP123@localhost:5432/FYPData' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    console.log('All tables:');
    tables.forEach(t => console.log(`  - ${t.tablename}`));

    console.log('\nSupplier/Purchase related tables:');
    tables.filter(t => t.tablename.includes('supplier') || t.tablename.includes('purchase'))
          .forEach(t => console.log(`  - ${t.tablename}`));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkTables();
