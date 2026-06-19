-- CreateTable
CREATE TABLE "role_change_audits" (
    "id" SERIAL NOT NULL,
    "targetId" INTEGER NOT NULL,
    "fromRole" TEXT NOT NULL,
    "toRole" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "actorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_change_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "role_change_audits_targetId_idx" ON "role_change_audits"("targetId");

-- CreateIndex
CREATE INDEX "role_change_audits_createdAt_idx" ON "role_change_audits"("createdAt");

-- AddForeignKey
ALTER TABLE "role_change_audits" ADD CONSTRAINT "role_change_audits_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
