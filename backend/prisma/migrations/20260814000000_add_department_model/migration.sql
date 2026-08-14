-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable (stub for forward reference)
CREATE TABLE "monthly_budgets" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "monthly_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable (stub for forward reference)
CREATE TABLE "budget_adjustment_requests" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "budget_adjustment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable (stub for forward reference)
CREATE TABLE "budget_predictions" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "budget_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE INDEX "departments_code_idx" ON "departments"("code");

-- CreateIndex
CREATE INDEX "departments_isActive_idx" ON "departments"("isActive");

-- AddForeignKey
ALTER TABLE "monthly_budgets" ADD CONSTRAINT "monthly_budgets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_adjustment_requests" ADD CONSTRAINT "budget_adjustment_requests_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_predictions" ADD CONSTRAINT "budget_predictions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
