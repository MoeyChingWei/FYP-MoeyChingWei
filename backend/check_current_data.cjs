#!/usr/bin/env node
const { PrismaClient } = require('./prisma/generated/prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  console.log('📊 当前数据库数据统计:\n');

  // 检查 users
  const userCount = await prisma.users.count();
  console.log(`👥 Users: ${userCount} 个`);
  if (userCount > 0) {
    const users = await prisma.users.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    console.log('   用户列表:');
    users.forEach(u => console.log(`   ${u.id}. ${u.name} - ${u.role}`));
  }

  console.log();

  // 检查 supplier_inventory_items
  const inventoryCount = await prisma.supplier_inventory_items.count();
  console.log(`📦 Supplier Inventory Items: ${inventoryCount} 个`);
  if (inventoryCount > 0) {
    const items = await prisma.supplier_inventory_items.findMany({ take: 5 });
    console.log('   样本:');
    items.forEach(i => console.log(`   - ${i.itemName} (supplier: ${i.supplierId})`));
  }

  console.log();

  // 检查 supplier_type_assignments
  const assignmentCount = await prisma.supplier_type_assignments.count();
  console.log(`🏷️  Supplier Type Assignments: ${assignmentCount} 个`);

  console.log();

  // 检查 record tables
  console.log('📋 Record Tables:');
  const prCount = await prisma.purchase_request_records.count();
  const poCount = await prisma.purchase_order_records.count();
  const deliveryCount = await prisma.supplier_delivery_records.count();
  const grnCount = await prisma.supplier_grn_records.count();
  const ackCount = await prisma.supplier_order_acknowledgement_records.count();

  console.log(`   purchase_request_records: ${prCount}`);
  console.log(`   purchase_order_records: ${poCount}`);
  console.log(`   supplier_delivery_records: ${deliveryCount}`);
  console.log(`   supplier_grn_records: ${grnCount}`);
  console.log(`   supplier_order_acknowledgement_records: ${ackCount}`);

  await prisma.$disconnect();
}

checkData().catch(console.error);
