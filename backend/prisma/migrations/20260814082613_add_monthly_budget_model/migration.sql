-- DropForeignKey
ALTER TABLE "monthly_budgets" DROP CONSTRAINT "monthly_budgets_departmentId_fkey";

-- AlterTable
ALTER TABLE "monthly_budgets" ADD COLUMN     "allocatedAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reservedAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "spentAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "monthly_budgets_year_month_idx" ON "monthly_budgets"("year", "month");

-- CreateIndex
CREATE INDEX "monthly_budgets_departmentId_idx" ON "monthly_budgets"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_budgets_departmentId_year_month_key" ON "monthly_budgets"("departmentId", "year", "month");

-- AddForeignKey
ALTER TABLE "monthly_budgets" ADD CONSTRAINT "monthly_budgets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
