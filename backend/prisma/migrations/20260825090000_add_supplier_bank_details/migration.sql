CREATE TABLE "supplier_bank_details" (
    "supplierId" INTEGER NOT NULL,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "supplier_bank_details_pkey" PRIMARY KEY ("supplierId"),
    CONSTRAINT "supplier_bank_details_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
