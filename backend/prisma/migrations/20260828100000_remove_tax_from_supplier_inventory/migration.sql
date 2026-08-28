-- Tax applies to the completed purchase, not to a supplier's catalogue item.
ALTER TABLE "supplier_inventory_items"
  DROP COLUMN IF EXISTS "taxType",
  DROP COLUMN IF EXISTS "taxRate";
