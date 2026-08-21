-- The original workflow-table migration is recorded as applied, but the live
-- database drifted and lost these primary-key constraints. Prisma upserts use
-- localId as the conflict target, so restore the schema contract explicitly.
ALTER TABLE "purchase_request_records"
  ADD CONSTRAINT "purchase_request_records_pkey" PRIMARY KEY ("localId");

ALTER TABLE "purchase_order_records"
  ADD CONSTRAINT "purchase_order_records_pkey" PRIMARY KEY ("localId");

ALTER TABLE "supplier_order_acknowledgement_records"
  ADD CONSTRAINT "supplier_order_acknowledgement_records_pkey" PRIMARY KEY ("localId");

ALTER TABLE "supplier_delivery_records"
  ADD CONSTRAINT "supplier_delivery_records_pkey" PRIMARY KEY ("localId");

ALTER TABLE "supplier_grn_records"
  ADD CONSTRAINT "supplier_grn_records_pkey" PRIMARY KEY ("localId");
