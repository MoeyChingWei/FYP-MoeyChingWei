CREATE TABLE "supplier_inventory_items" (
    "id" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reorderLevel" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "taxType" TEXT NOT NULL DEFAULT 'NO_TAX',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageDataUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "supplier_inventory_items_supplierId_idx" ON "supplier_inventory_items"("supplierId");
CREATE INDEX "supplier_inventory_items_category_idx" ON "supplier_inventory_items"("category");
CREATE INDEX "supplier_inventory_items_updatedAt_idx" ON "supplier_inventory_items"("updatedAt");

ALTER TABLE "supplier_inventory_items" ADD CONSTRAINT "supplier_inventory_items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
