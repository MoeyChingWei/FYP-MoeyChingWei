const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./prisma/generated/prisma/client');
const pg = require('pg');

async function checkDatabase() {
  const pool = new pg.Pool({ connectionString: 'postgresql://postgres:FYP123@localhost:5432/FYPData' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const userCount = await prisma.users.count();
    const purchaseRequests = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM purchase_request_records');
    const purchaseOrders = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM purchase_order_records');
    const suppliers = await prisma.supplier_inventory_items.count();
    const departments = await prisma.departments.count();

    console.log('✅ Current Database State:');
    console.log('  - Users:', userCount);
    console.log('  - Purchase Requests:', purchaseRequests[0].count);
    console.log('  - Purchase Orders:', purchaseOrders[0].count);
    console.log('  - Supplier Items:', suppliers);
    console.log('  - Departments:', departments);

    const users = await prisma.users.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { id: 'asc' },
      take: 20
    });

    console.log('\n📋 Users in Database (showing first 20):');
    users.forEach(u => console.log(`  ID ${u.id}: ${u.name} (${u.email}) - ${u.role}`));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkDatabase();
