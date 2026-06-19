-- CreateTable
CREATE TABLE "purchase_request_records" (
    "localId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_request_records_pkey" PRIMARY KEY ("localId")
);

-- CreateTable
CREATE TABLE "purchase_order_records" (
    "localId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_records_pkey" PRIMARY KEY ("localId")
);

-- CreateTable
CREATE TABLE "supplier_order_acknowledgement_records" (
    "localId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_order_acknowledgement_records_pkey" PRIMARY KEY ("localId")
);

-- CreateTable
CREATE TABLE "supplier_delivery_records" (
    "localId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_delivery_records_pkey" PRIMARY KEY ("localId")
);

-- CreateTable
CREATE TABLE "supplier_grn_records" (
    "localId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_grn_records_pkey" PRIMARY KEY ("localId")
);
