import "dotenv/config";

import prisma from "../config/prisma.js";
import { ROLES } from "../constants/roles.js";

const FLOW_COUNT = 120;
const SEED_PREFIX = "forecast-seed";
const COMPANY_ADDRESS = "OptiMind, Kuala Lumpur, Malaysia";

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function dateForFlow(index, offsetDays = 0) {
  const monthIndex = index % 18;
  const year = 2025 + Math.floor((2 + monthIndex) / 12);
  const month = (2 + monthIndex) % 12;
  const day = 3 + ((index * 7) % 20);
  return new Date(Date.UTC(year, month, day + offsetDays, 12, 0, 0));
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function buildLineItems(inventory, supplier, flowIndex) {
  const itemCount = flowIndex % 4 === 0 ? 3 : 2;

  return Array.from({ length: itemCount }, (_, itemIndex) => {
    const item = inventory[(flowIndex * 3 + itemIndex * 7) % inventory.length];
    const quantity = 1 + ((flowIndex + itemIndex) % 3);
    const lineTotal = quantity * item.unitPrice;
    const taxAmount = roundMoney(lineTotal * (item.taxRate / 100));

    return {
      tempId: `${SEED_PREFIX}-line-${String(flowIndex + 1).padStart(3, "0")}-${itemIndex + 1}`,
      supplierInventoryItemId: item.id,
      itemName: item.itemName,
      itemDescription: `Historical forecasting test purchase: ${item.itemName}`,
      itemCategory: item.category,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierEmail: supplier.email,
      quantity,
      unitOfMeasurement: item.unit,
      unitPrice: item.unitPrice,
      itemImageUrl: item.imageDataUrl,
      taxType: item.taxType,
      taxRate: item.taxRate,
      taxAmount,
      amountAfterTax: roundMoney(lineTotal + taxAmount),
    };
  });
}

async function main() {
  const supplier = await prisma.user.findFirst({
    where: {
      name: "Ah Wei (Supplier)",
      role: ROLES.SUPPLIER,
      isActive: true,
    },
    select: { id: true, name: true, email: true },
  });

  if (!supplier) throw new Error('Active supplier "Ah Wei (Supplier)" was not found.');

  const [approver, testUsers, inventory] = await Promise.all([
    prisma.user.findFirst({
      where: { role: { in: [ROLES.ADMIN, ROLES.MANAGER] }, isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { id: "asc" },
    }),
    prisma.user.findMany({
      where: { email: { startsWith: "forecast.", endsWith: "@test.local" }, isActive: true },
      select: { id: true, name: true, email: true, role: true, department: true },
      orderBy: { email: "asc" },
    }),
    prisma.supplierInventoryItem.findMany({
      where: { supplierId: supplier.id, quantity: { gt: 0 } },
      select: {
        id: true,
        itemName: true,
        category: true,
        unit: true,
        unitPrice: true,
        imageDataUrl: true,
        taxType: true,
        taxRate: true,
      },
      orderBy: { itemName: "asc" },
    }),
  ]);

  if (!approver) throw new Error("An active Admin or Manager is required to seed approved purchasing flows.");
  if (testUsers.length !== 35) throw new Error(`Expected 35 forecast test users, found ${testUsers.length}.`);
  if (!inventory.length) throw new Error("Ah Wei has no available inventory items for purchasing test data.");

  const purchaseRequests = [];
  const purchaseOrders = [];
  const acknowledgements = [];
  const deliveries = [];
  const grns = [];

  for (let index = 0; index < FLOW_COUNT; index += 1) {
    const number = String(index + 1).padStart(3, "0");
    const requester = testUsers[index % testUsers.length];
    const prDate = dateForFlow(index);
    const poDate = dateForFlow(index, 2);
    const acknowledgementDate = dateForFlow(index, 3);
    const deliveryDate = dateForFlow(index, 6);
    const grnDate = dateForFlow(index, 7);
    const prLocalId = `${SEED_PREFIX}-pr-${number}`;
    const poLocalId = `${SEED_PREFIX}-po-${number}`;
    const acknowledgementLocalId = `${SEED_PREFIX}-ack-${number}`;
    const deliveryLocalId = `${SEED_PREFIX}-delivery-${number}`;
    const grnLocalId = `${SEED_PREFIX}-grn-${number}`;
    const prNumber = `PR-FC-${prDate.getUTCFullYear()}-${number}`;
    const poNumber = `PO-FC-${poDate.getUTCFullYear()}-${number}`;
    const deliveryNo = `DLV-FC-${deliveryDate.getUTCFullYear()}-${number}`;
    const lineItems = buildLineItems(inventory, supplier, index);
    const requesterName = requester.name || requester.email;
    const approverName = approver.name || approver.email;
    const department = requester.department || "Unassigned";

    const requestPayload = {
      localId: prLocalId,
      prNumber,
      requestDate: isoDate(prDate),
      createdAt: prDate.toISOString(),
      requestBy: requesterName,
      requestorId: requester.id,
      createdByUserId: requester.id,
      createdByEmail: requester.email,
      department,
      currency: "MYR",
      status: "APPROVED",
      lineItems,
      notes: "Completed historical purchasing flow seeded for budget forecasting tests.",
      requesterRole: requester.role,
      approvedBy: approverName,
      approvedByUserId: approver.id,
      approvedAt: acknowledgementDate.toISOString(),
    };

    const orderPayload = {
      localId: poLocalId,
      poNumber,
      sourceRequestLocalId: prLocalId,
      sourcePrNumber: prNumber,
      sourceRequester: requesterName,
      createdDate: isoDate(poDate),
      createdBy: approverName,
      createdByUserId: approver.id,
      createdByEmail: approver.email,
      department,
      currency: "MYR",
      status: "APPROVED",
      lineItems,
      requesterRole: requester.role,
    };

    const acknowledgementPayload = {
      localId: acknowledgementLocalId,
      poLocalId,
      poNumber,
      sourcePrNumber: prNumber,
      sourceRequester: requesterName,
      createdDate: isoDate(acknowledgementDate),
      createdBy: approverName,
      department,
      currency: "MYR",
      companyAddress: COMPANY_ADDRESS,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierEmail: supplier.email,
      status: "APPROVED",
      items: lineItems,
    };

    const deliveryPayload = {
      localId: deliveryLocalId,
      deliveryNo,
      originalOrderNo: poNumber,
      acknowledgementLocalId,
      poLocalId,
      poNumber,
      sourcePrNumber: prNumber,
      sourceRequester: requesterName,
      createdDate: isoDate(deliveryDate),
      createdBy: approverName,
      department,
      currency: "MYR",
      companyAddress: COMPANY_ADDRESS,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierEmail: supplier.email,
      status: "DELIVERED",
      items: lineItems,
      deliveredDate: isoDate(deliveryDate),
    };

    const grnPayload = {
      localId: grnLocalId,
      deliveryNo,
      originalOrderNo: poNumber,
      deliveryLocalId,
      poLocalId,
      poNumber,
      sourcePrNumber: prNumber,
      sourceRequester: requesterName,
      createdDate: isoDate(grnDate),
      createdBy: approverName,
      department,
      currency: "MYR",
      companyAddress: COMPANY_ADDRESS,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierEmail: supplier.email,
      status: "RECEIVED",
      items: lineItems,
      completedDate: isoDate(grnDate),
    };

    purchaseRequests.push({ localId: prLocalId, payload: requestPayload, createdAt: prDate, updatedAt: prDate });
    purchaseOrders.push({ localId: poLocalId, payload: orderPayload, createdAt: poDate, updatedAt: poDate });
    acknowledgements.push({ localId: acknowledgementLocalId, payload: acknowledgementPayload, createdAt: acknowledgementDate, updatedAt: acknowledgementDate });
    deliveries.push({ localId: deliveryLocalId, payload: deliveryPayload, createdAt: deliveryDate, updatedAt: deliveryDate });
    grns.push({ localId: grnLocalId, payload: grnPayload, createdAt: grnDate, updatedAt: grnDate });
  }

  const result = await prisma.$transaction([
    prisma.purchaseRequestRecord.deleteMany({ where: { localId: { startsWith: SEED_PREFIX } } }),
    prisma.purchaseOrderRecord.deleteMany({ where: { localId: { startsWith: SEED_PREFIX } } }),
    prisma.supplierOrderAcknowledgementRecord.deleteMany({ where: { localId: { startsWith: SEED_PREFIX } } }),
    prisma.supplierDeliveryRecordStore.deleteMany({ where: { localId: { startsWith: SEED_PREFIX } } }),
    prisma.supplierGrnRecordStore.deleteMany({ where: { localId: { startsWith: SEED_PREFIX } } }),
    prisma.purchaseRequestRecord.createMany({ data: purchaseRequests }),
    prisma.purchaseOrderRecord.createMany({ data: purchaseOrders }),
    prisma.supplierOrderAcknowledgementRecord.createMany({ data: acknowledgements }),
    prisma.supplierDeliveryRecordStore.createMany({ data: deliveries }),
    prisma.supplierGrnRecordStore.createMany({ data: grns }),
  ]);

  console.log("Forecast purchasing seed complete:");
  console.log(`Removed existing seeded records: ${result.slice(0, 5).map((entry) => entry.count).join(", ")}`);
  console.log(`Purchase requests: ${result[5].count} created`);
  console.log(`Purchase orders: ${result[6].count} created`);
  console.log(`Order acknowledgements: ${result[7].count} created`);
  console.log(`Deliveries: ${result[8].count} created`);
  console.log(`GRNs: ${result[9].count} created`);
}

main()
  .catch((error) => {
    console.error("Failed to seed forecast purchasing data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
