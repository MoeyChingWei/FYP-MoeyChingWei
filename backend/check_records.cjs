const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./prisma/generated/prisma/client');
const pg = require('pg');

async function checkRecords() {
  const pool = new pg.Pool({ connectionString: 'postgresql://postgres:FYP123@localhost:5432/FYPData' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const userCount = await prisma.users.count();
    const prCount = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM purchase_request_records');
    const poCount = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM purchase_order_records');
    const sdCount = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM supplier_delivery_records');
    const sgrCount = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM supplier_grn_records');
    const soaCount = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM supplier_order_acknowledgement_records');

    console.log('✅ Current Database Records:');
    console.log('  - Users:', userCount);
    console.log('  - Purchase Request Records:', prCount[0].count);
    console.log('  - Purchase Order Records:', poCount[0].count);
    console.log('  - Supplier Delivery Records:', sdCount[0].count);
    console.log('  - Supplier GRN Records:', sgrCount[0].count);
    console.log('  - Supplier Order Acknowledgement Records:', soaCount[0].count);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkRecords();
