CREATE TABLE "budget_upcoming_events" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "targetYear" INTEGER NOT NULL,
    "targetMonth" INTEGER NOT NULL,
    "estimatedImpact" DECIMAL(15,2) NOT NULL,
    "likelihood" TEXT NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_upcoming_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "budget_upcoming_events_departmentId_targetYear_targetMonth_idx"
  ON "budget_upcoming_events"("departmentId", "targetYear", "targetMonth");
CREATE INDEX "budget_upcoming_events_createdBy_idx" ON "budget_upcoming_events"("createdBy");
CREATE INDEX "budget_upcoming_events_status_idx" ON "budget_upcoming_events"("status");

ALTER TABLE "budget_upcoming_events"
  ADD CONSTRAINT "budget_upcoming_events_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "budget_upcoming_events"
  ADD CONSTRAINT "budget_upcoming_events_createdBy_fkey"
  FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
