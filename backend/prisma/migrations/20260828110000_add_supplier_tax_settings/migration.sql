CREATE TABLE "supplier_tax_settings" (
  "supplierId" INTEGER NOT NULL,
  "taxApplies" BOOLEAN NOT NULL DEFAULT false,
  "taxType" TEXT NOT NULL DEFAULT 'NO_TAX',
  "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "supplier_tax_settings_pkey" PRIMARY KEY ("supplierId"),
  CONSTRAINT "supplier_tax_settings_supplierId_fkey"
    FOREIGN KEY ("supplierId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
