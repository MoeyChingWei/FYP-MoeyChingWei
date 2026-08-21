ALTER TABLE "budget_predictions"
ADD COLUMN "triggeredBy" INTEGER;

CREATE INDEX "budget_predictions_triggeredBy_idx"
ON "budget_predictions"("triggeredBy");

ALTER TABLE "budget_predictions"
ADD CONSTRAINT "budget_predictions_triggeredBy_fkey"
FOREIGN KEY ("triggeredBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
