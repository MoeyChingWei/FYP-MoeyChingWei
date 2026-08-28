ALTER TABLE "supplier_tax_settings"
ADD COLUMN IF NOT EXISTS "taxRules" JSONB;
