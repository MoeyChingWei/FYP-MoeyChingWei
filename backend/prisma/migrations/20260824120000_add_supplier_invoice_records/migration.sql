CREATE TABLE "supplier_invoice_records" (
    "localId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "supplier_invoice_records_pkey" PRIMARY KEY ("localId")
);

CREATE INDEX "supplier_invoice_records_createdAt_idx" ON "supplier_invoice_records"("createdAt");
CREATE INDEX "supplier_invoice_records_updatedAt_idx" ON "supplier_invoice_records"("updatedAt");
