import "dotenv/config";

import prisma from "../config/prisma.js";
import { ROLES } from "../constants/roles.js";
import { generateDepartmentPrediction } from "../services/budget-prediction-service.js";

// This is deliberately separate from the smaller forecasting test-data seeds.
// Keep this list aligned with the departments already used by the application.
// It must not introduce one-off demo departments into User Management.
const REQUESTS_PER_DEPARTMENT = 520;
const HISTORY_MONTHS = 24;
const SEED_PREFIX = "dept-forecast-demo";

const departmentsToSeed = [
  { code: "ADM", name: "Administration", monthlyBase: 38000, categories: ["Office Supplies", "Facilities", "Professional Services"] },
  { code: "FIN", name: "Finance", monthlyBase: 42000, categories: ["Professional Services", "Software", "Office Supplies"] },
  { code: "HR", name: "Human Resources", monthlyBase: 46000, categories: ["Training", "Recruitment", "Office Supplies"] },
  { code: "IT", name: "IT", monthlyBase: 68000, categories: ["IT Equipment", "Software", "Professional Services"] },
  { code: "MKT", name: "Marketing", monthlyBase: 56000, categories: ["Marketing Services", "Events", "Professional Services"] },
  { code: "OPS", name: "Operations", monthlyBase: 72000, categories: ["Operational Equipment", "Logistics", "Facilities"] },
];

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function periodForIndex(index) {
  // Full historical months only: September 2024 through August 2026 when run
  // in September 2026. This avoids counting any future/current-day records.
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - HISTORY_MONTHS + (index % HISTORY_MONTHS), 1, 9, 0, 0));
}

function requestDateForIndex(index, profileIndex) {
  const period = periodForIndex(index);
  const day = 2 + ((index * 7 + profileIndex * 3) % 24);
  return new Date(Date.UTC(period.getUTCFullYear(), period.getUTCMonth(), day, 8 + (index % 8), 0, 0));
}

function buildLineItems(profile, requestIndex, profileIndex) {
  const category = profile.categories[(requestIndex + profileIndex) % profile.categories.length];
  const quantity = 1 + ((requestIndex + profileIndex) % 5);
  const baseUnitPrice = 260 + ((requestIndex * 79 + profileIndex * 173) % 1250);
  const seasonalMultiplier = 0.9 + ((requestIndex % 24) / 240);
  const unitPrice = roundMoney(baseUnitPrice * seasonalMultiplier);

  return [{
    tempId: `${SEED_PREFIX}-${profile.code}-line-${String(requestIndex + 1).padStart(3, "0")}`,
    itemName: `${category} purchase`,
    itemDescription: `Historical ${profile.name} purchase for budget forecasting demonstration`,
    itemCategory: category,
    quantity,
    unitOfMeasurement: "unit",
    unitPrice,
    taxType: "NO_TAX",
    taxRate: 0,
    taxAmount: 0,
    amountAfterTax: roundMoney(quantity * unitPrice),
  }];
}

async function ensureDepartments() {
  const departments = [];

  for (const profile of departmentsToSeed) {
    const existingByCode = await prisma.department.findUnique({ where: { code: profile.code } });
    if (existingByCode) {
      if (existingByCode.name.toLowerCase() !== profile.name.toLowerCase()) {
        throw new Error(`Department code ${profile.code} already belongs to "${existingByCode.name}".`);
      }
      departments.push({ ...profile, id: existingByCode.id });
      continue;
    }

    const existingByName = await prisma.department.findFirst({
      where: { name: { equals: profile.name, mode: "insensitive" } },
    });
    if (existingByName) {
      departments.push({ ...profile, id: existingByName.id, code: existingByName.code });
      continue;
    }

    const created = await prisma.department.create({
      data: {
        code: profile.code,
        name: profile.name,
        description: "Built-in department used by budget forecasting demonstrations.",
        isActive: true,
        updatedAt: new Date(),
      },
    });
    departments.push({ ...profile, id: created.id });
  }

  return departments;
}

async function ensureDemoUsers(departments) {
  const fallbackUser = await prisma.user.findFirst({
    where: { role: ROLES.ADMIN, isActive: true },
    orderBy: { id: "asc" },
  });
  if (!fallbackUser) {
    throw new Error("An active Admin is required to seed forecast data.");
  }

  const usersByDepartment = new Map();

  for (const department of departments) {
    const user = await prisma.user.findFirst({
      where: {
        role: ROLES.DEPARTMENT_EXECUTIVE,
        isActive: true,
        department: { in: [department.code, department.name] },
      },
      orderBy: { id: "asc" },
    });
    // Seeding must never create or mutate User Access records. The actor is
    // only used for audit fields in the generated historical payload.
    usersByDepartment.set(department.id, user || fallbackUser);
  }

  return usersByDepartment;
}

async function createInChunks(rows) {
  const chunkSize = 500;
  let created = 0;
  for (let index = 0; index < rows.length; index += chunkSize) {
    const result = await prisma.purchaseRequestRecord.createMany({
      data: rows.slice(index, index + chunkSize),
      skipDuplicates: true,
    });
    created += result.count;
  }
  return created;
}

async function seedPurchaseRequests(departments, usersByDepartment) {
  const results = [];

  for (const [profileIndex, department] of departments.entries()) {
    const user = usersByDepartment.get(department.id);
    const prefix = `${SEED_PREFIX}-pr-${department.code.toLowerCase()}-`;
    const existingRows = await prisma.purchaseRequestRecord.findMany({
      where: { localId: { startsWith: prefix } },
      select: { localId: true },
    });
    const existingIds = new Set(existingRows.map((row) => row.localId));
    const requests = [];
    const monthlySpend = new Map();

    for (let requestIndex = 0; requestIndex < REQUESTS_PER_DEPARTMENT; requestIndex += 1) {
      const number = String(requestIndex + 1).padStart(3, "0");
      const localId = `${prefix}${number}`;
      const createdAt = requestDateForIndex(requestIndex, profileIndex);
      const lineItems = buildLineItems(department, requestIndex, profileIndex);
      const amount = lineItems.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);
      const periodKey = `${createdAt.getUTCFullYear()}-${String(createdAt.getUTCMonth() + 1).padStart(2, "0")}`;
      monthlySpend.set(periodKey, roundMoney((monthlySpend.get(periodKey) || 0) + amount));

      if (existingIds.has(localId)) continue;

      const requestNumber = `PR-DF-${department.code}-${createdAt.getUTCFullYear()}-${number}`;
      requests.push({
        localId,
        createdAt,
        updatedAt: createdAt,
        payload: {
          localId,
          prNumber: requestNumber,
          requestDate: createdAt.toISOString().slice(0, 10),
          createdAt: createdAt.toISOString(),
          requestBy: user.name || user.email,
          requestorId: user.id,
          createdByUserId: user.id,
          createdByEmail: user.email,
          department: department.name,
          currency: "MYR",
          status: "APPROVED",
          lineItems,
          notes: "Historical demo purchase seeded for department budget forecasting.",
          requesterRole: user.role,
          approvedBy: "System Forecast Seed",
          approvedAt: createdAt.toISOString(),
        },
      });
    }

    const created = await createInChunks(requests);
    results.push({ department, created, existing: existingRows.length, monthlySpend });
  }

  return results;
}

async function seedMonthlyBudgets(purchaseResults) {
  const budgets = [];
  for (const result of purchaseResults) {
    for (const [period, spentAmount] of result.monthlySpend.entries()) {
      const [year, month] = period.split("-").map(Number);
      const allocatedAmount = roundMoney(Math.max(spentAmount * 1.28, result.department.monthlyBase));
      budgets.push({
        departmentId: result.department.id,
        year,
        month,
        allocatedAmount,
        spentAmount,
        reservedAmount: 0,
        notes: "Department forecast demo historical budget. Generated without replacing existing budgets.",
        updatedAt: new Date(Date.UTC(year, month - 1, 28, 12, 0, 0)),
      });
    }
  }

  const result = await prisma.monthlyBudget.createMany({ data: budgets, skipDuplicates: true });
  return { created: result.count, attempted: budgets.length };
}

async function generatePredictions(departments) {
  const target = new Date();
  const targetYear = target.getFullYear();
  const targetMonth = target.getMonth() + 1;
  const outcomes = [];

  for (const department of departments) {
    try {
      const prediction = await generateDepartmentPrediction(department.code, targetYear, targetMonth, null);
      outcomes.push({ department: department.name, status: "created", amount: Number(prediction.predictedAmount) });
    } catch (error) {
      // Data is still valid and the UI can retry a manual prediction. Keep one
      // provider failure from preventing the remaining departments from seeding.
      outcomes.push({ department: department.name, status: "failed", message: error.message });
    }
  }

  return outcomes;
}

async function main() {
  console.log(`Preparing ${REQUESTS_PER_DEPARTMENT} approved historical purchase requests for each built-in department...`);
  const departments = await ensureDepartments();
  const usersByDepartment = await ensureDemoUsers(departments);
  const purchaseResults = await seedPurchaseRequests(departments, usersByDepartment);
  const budgetResult = await seedMonthlyBudgets(purchaseResults);
  const predictionResults = await generatePredictions(departments);

  console.table(purchaseResults.map((result) => ({
    department: result.department.name,
    createdRequests: result.created,
    existingSeededRequests: result.existing,
    totalSeededRequests: result.created + result.existing,
  })));
  console.log(`Monthly budgets: ${budgetResult.created} created (${budgetResult.attempted} periods considered; existing budgets were preserved).`);
  console.table(predictionResults);
}

main()
  .catch((error) => {
    console.error("Failed to seed department forecast data:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
