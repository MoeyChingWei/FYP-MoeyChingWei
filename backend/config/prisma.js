import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/prisma/client/index.js";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// Keep the model names used throughout the application compatible with the
// introspected schema, which exposes delegates using their table names.
// Prisma model delegates are regular properties at runtime, so these aliases
// preserve the existing `prisma.user`/`prisma.auditLog` API without changing
// the database schema or requiring a migration.
Object.assign(prisma, {
  user: prisma.users,
  notification: prisma.notifications,
  feedback: prisma.feedbacks,
  roleChangeAudit: prisma.role_change_audits,
  passwordResetCode: prisma.password_reset_codes,
  purchasingLookup: prisma.purchasing_lookups,
  supplierInventoryItem: prisma.supplier_inventory_items,
  purchaseRequestRecord: prisma.purchase_request_records,
  purchaseOrderRecord: prisma.purchase_order_records,
  supplierOrderAcknowledgementRecord:
    prisma.supplier_order_acknowledgement_records,
  supplierDeliveryRecordStore: prisma.supplier_delivery_records,
  supplierGrnRecordStore: prisma.supplier_grn_records,
  supplierInvoiceRecordStore: prisma.supplier_invoice_records,
  supplierPaymentRecordStore: prisma.supplier_payment_records,
  chatSession: prisma.chat_sessions,
  chatMessage: prisma.chat_messages,
  messageAttachment: prisma.message_attachments,
  source: prisma.sources,
  sourceChunk: prisma.source_chunks,
  auditLog: prisma.audit_logs,
  backupHistory: prisma.backup_history,
  department: prisma.departments,
  monthlyBudget: prisma.monthly_budgets,
  budgetAdjustmentRequest: prisma.budget_adjustment_requests,
  budgetPrediction: prisma.budget_predictions,
  budgetUpcomingEvent: prisma.budget_upcoming_events,
});

export default prisma;

