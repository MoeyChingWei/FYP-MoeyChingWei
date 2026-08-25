CREATE TABLE "supplier_payment_records" (
    "localId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "supplier_payment_records_pkey" PRIMARY KEY ("localId")
);

CREATE INDEX "supplier_payment_records_createdAt_idx" ON "supplier_payment_records"("createdAt");
CREATE INDEX "supplier_payment_records_updatedAt_idx" ON "supplier_payment_records"("updatedAt");
