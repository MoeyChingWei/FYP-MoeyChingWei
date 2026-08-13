-- Existing supplier inventory is initialized with the product tax rate. Future records
-- may select product tax, service tax, both, or no tax through the API.
UPDATE "supplier_inventory_items"
SET "taxType" = 'TAX', "taxRate" = 10
WHERE "taxType" <> 'TAX' OR "taxRate" <> 10;

ALTER TABLE "supplier_inventory_items"
ALTER COLUMN "taxType" SET DEFAULT 'TAX';

ALTER TABLE "supplier_inventory_items"
ALTER COLUMN "taxRate" SET DEFAULT 10;
