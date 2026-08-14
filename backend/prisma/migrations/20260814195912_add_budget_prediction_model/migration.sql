-- DropForeignKey
ALTER TABLE "budget_predictions" DROP CONSTRAINT "budget_predictions_departmentId_fkey";

-- AlterTable
ALTER TABLE "budget_predictions" ADD COLUMN     "aiInsights" TEXT NOT NULL,
ADD COLUMN     "algorithm" TEXT NOT NULL,
ADD COLUMN     "categoryBreakdown" JSONB,
ADD COLUMN     "comparisonData" JSONB,
ADD COLUMN     "confidence" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "predictedAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "targetMonth" INTEGER NOT NULL,
ADD COLUMN     "targetYear" INTEGER NOT NULL,
ADD COLUMN     "triggerType" TEXT NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "budget_predictions_departmentId_idx" ON "budget_predictions"("departmentId");

-- CreateIndex
CREATE INDEX "budget_predictions_targetYear_targetMonth_idx" ON "budget_predictions"("targetYear", "targetMonth");

-- CreateIndex
CREATE INDEX "budget_predictions_createdAt_idx" ON "budget_predictions"("createdAt");

-- AddForeignKey
ALTER TABLE "budget_predictions" ADD CONSTRAINT "budget_predictions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
