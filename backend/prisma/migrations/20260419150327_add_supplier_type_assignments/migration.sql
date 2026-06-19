-- CreateTable
CREATE TABLE "supplier_type_assignments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_type_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "supplier_type_assignments_userId_idx" ON "supplier_type_assignments"("userId");

-- CreateIndex
CREATE INDEX "supplier_type_assignments_category_idx" ON "supplier_type_assignments"("category");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_type_assignments_userId_category_key" ON "supplier_type_assignments"("userId", "category");

-- AddForeignKey
ALTER TABLE "supplier_type_assignments" ADD CONSTRAINT "supplier_type_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
