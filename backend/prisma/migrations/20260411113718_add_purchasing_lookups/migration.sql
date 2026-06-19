-- CreateTable
CREATE TABLE "purchasing_lookups" (
    "id" SERIAL NOT NULL,
    "kind" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchasing_lookups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "purchasing_lookups_kind_idx" ON "purchasing_lookups"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "purchasing_lookups_kind_value_key" ON "purchasing_lookups"("kind", "value");
