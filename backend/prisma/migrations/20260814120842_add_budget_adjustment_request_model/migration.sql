-- DropForeignKey
ALTER TABLE "budget_adjustment_requests" DROP CONSTRAINT "budget_adjustment_requests_departmentId_fkey";

-- AlterTable
ALTER TABLE "budget_adjustment_requests" ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "requestType" TEXT NOT NULL,
ADD COLUMN     "requestedAmount" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "requestedBy" INTEGER NOT NULL,
ADD COLUMN     "reviewNotes" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "targetMonth" INTEGER NOT NULL,
ADD COLUMN     "targetYear" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "budget_adjustment_requests_departmentId_status_idx" ON "budget_adjustment_requests"("departmentId", "status");

-- CreateIndex
CREATE INDEX "budget_adjustment_requests_status_requestedAt_idx" ON "budget_adjustment_requests"("status", "requestedAt");

-- AddForeignKey
ALTER TABLE "budget_adjustment_requests" ADD CONSTRAINT "budget_adjustment_requests_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_adjustment_requests" ADD CONSTRAINT "budget_adjustment_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_adjustment_requests" ADD CONSTRAINT "budget_adjustment_requests_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
