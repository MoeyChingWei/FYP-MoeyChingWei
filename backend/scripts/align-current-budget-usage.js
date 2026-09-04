import "dotenv/config";

import prisma from "../config/prisma.js";

const BUFFER_RATE = 0.15;
const DEPARTMENT_CODES = ["ADM", "FIN", "HR", "IT", "MKT", "OPS", "PUR", "SAL", "WH", "LEG"];
// A mixed workflow is more representative: these departments accepted the
// forecast directly, while the other departments retain finance approval.
const AI_AUTO_GENERATED_CODES = new Set(["ADM", "IT", "MKT", "OPS"]);

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function main() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const departments = await prisma.department.findMany({
    where: { code: { in: DEPARTMENT_CODES } },
    select: { id: true, code: true, name: true },
  });

  if (departments.length !== DEPARTMENT_CODES.length) {
    throw new Error(`Expected ${DEPARTMENT_CODES.length} built-in departments, found ${departments.length}. Run forecast:seed-departments first.`);
  }

  const results = [];
  for (const department of departments.sort((a, b) => a.code.localeCompare(b.code))) {
    const prediction = await prisma.budgetPrediction.findFirst({
      where: { departmentId: department.id, targetYear: year, targetMonth: month },
      orderBy: { createdAt: "desc" },
      select: { id: true, predictedAmount: true },
    });
    if (!prediction || Number(prediction.predictedAmount) <= 0) {
      throw new Error(`No valid ${year}-${String(month).padStart(2, "0")} AI prediction for ${department.name}.`);
    }

    const predictedAmount = Number(prediction.predictedAmount);
    const allocatedAmount = roundMoney(predictedAmount * (1 + BUFFER_RATE));
    const budgetNotes = AI_AUTO_GENERATED_CODES.has(department.code)
      ? `Auto-generated from AI prediction #${prediction.id} (15% contingency; month-start spend is RM0.00).`
      : "Current-month budget aligned to AI prediction (15% contingency; month-start spend is RM0.00).";
    // At the start of a month the forecast is an allocation plan, not actual
    // spend. Keep usage at zero until a real PR is approved in the system.
    await prisma.monthlyBudget.upsert({
      where: { departmentId_year_month: { departmentId: department.id, year, month } },
      update: {
        allocatedAmount,
        spentAmount: 0,
        reservedAmount: 0,
        notes: budgetNotes,
      },
      create: {
        departmentId: department.id,
        year,
        month,
        allocatedAmount,
        spentAmount: 0,
        reservedAmount: 0,
        notes: budgetNotes,
        updatedAt: new Date(),
      },
    });

    results.push({
      department: department.name,
      prediction: predictedAmount,
      allocated: allocatedAmount,
      spent: 0,
      usage: "0%",
      source: AI_AUTO_GENERATED_CODES.has(department.code) ? "AI prediction" : "Finance approval",
    });
  }

  console.table(results);
}

main()
  .catch((error) => {
    console.error("Failed to align current budget usage:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
