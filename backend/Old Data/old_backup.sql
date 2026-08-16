--
-- PostgreSQL database dump
--

\restrict oRfwGBUffi2d9u7RkDsHmaBWmOiT5fBnklUkK9189MNgaOCSKTnNtueeUDdLv2b

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."ApprovalStatus" OWNER TO postgres;

--
-- Name: Currency; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Currency" AS ENUM (
    'MYR',
    'USD',
    'SGD',
    'CNY',
    'EUR',
    'GBP',
    'JPY'
);


ALTER TYPE public."Currency" OWNER TO postgres;

--
-- Name: GRNStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GRNStatus" AS ENUM (
    'DRAFT',
    'COMPLETED',
    'PARTIAL',
    'REJECTED'
);


ALTER TYPE public."GRNStatus" OWNER TO postgres;

--
-- Name: InspectionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InspectionStatus" AS ENUM (
    'PENDING',
    'PASSED',
    'FAILED',
    'CONDITIONAL'
);


ALTER TYPE public."InspectionStatus" OWNER TO postgres;

--
-- Name: InventoryTransactionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InventoryTransactionType" AS ENUM (
    'IN',
    'OUT',
    'ADJUST'
);


ALTER TYPE public."InventoryTransactionType" OWNER TO postgres;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'PAID',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."InvoiceStatus" OWNER TO postgres;

--
-- Name: Language; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Language" AS ENUM (
    'en',
    'zh',
    'ms'
);


ALTER TYPE public."Language" OWNER TO postgres;

--
-- Name: MatchStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MatchStatus" AS ENUM (
    'MATCHED',
    'DISCREPANCY',
    'PENDING'
);


ALTER TYPE public."MatchStatus" OWNER TO postgres;

--
-- Name: POStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."POStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'CONFIRMED',
    'PARTIAL',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."POStatus" OWNER TO postgres;

--
-- Name: PRStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PRStatus" AS ENUM (
    'DRAFT',
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."PRStatus" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'BANK_TRANSFER',
    'CHECK',
    'CREDIT_CARD',
    'WIRE_TRANSFER',
    'OTHER'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'SCHEDULED',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: approval_workflows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_workflows (
    id integer NOT NULL,
    "moduleType" text NOT NULL,
    "recordId" integer NOT NULL,
    "prId" integer,
    "poId" integer,
    "invoiceId" integer,
    "paymentId" integer,
    "approverId" integer NOT NULL,
    "approverLevel" integer NOT NULL,
    "approverRole" text NOT NULL,
    status public."ApprovalStatus" DEFAULT 'PENDING'::public."ApprovalStatus" NOT NULL,
    comments text,
    "approvalDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.approval_workflows OWNER TO postgres;

--
-- Name: approval_workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_workflows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_workflows_id_seq OWNER TO postgres;

--
-- Name: approval_workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_workflows_id_seq OWNED BY public.approval_workflows.id;


--
-- Name: budget_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_transactions (
    id integer NOT NULL,
    "departmentBudgetId" integer NOT NULL,
    "prId" integer,
    "paymentId" integer,
    "transactionType" text NOT NULL,
    amount numeric(15,2) NOT NULL,
    "balanceAfter" numeric(15,2) NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.budget_transactions OWNER TO postgres;

--
-- Name: budget_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_transactions_id_seq OWNER TO postgres;

--
-- Name: budget_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_transactions_id_seq OWNED BY public.budget_transactions.id;


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    "sessionId" text NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_messages_id_seq OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_sessions (
    id text NOT NULL,
    "userId" integer NOT NULL,
    title text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chat_sessions OWNER TO postgres;

--
-- Name: department_budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department_budgets (
    id integer NOT NULL,
    department text NOT NULL,
    "fiscalYear" text NOT NULL,
    "totalAllocated" numeric(15,2) NOT NULL,
    "committedAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "spentAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "availableAmount" numeric(15,2) NOT NULL,
    "lastUpdated" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.department_budgets OWNER TO postgres;

--
-- Name: department_budgets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_budgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_budgets_id_seq OWNER TO postgres;

--
-- Name: department_budgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_budgets_id_seq OWNED BY public.department_budgets.id;


--
-- Name: department_inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department_inventory (
    id integer NOT NULL,
    department text NOT NULL,
    "itemName" text NOT NULL,
    "itemCategory" text NOT NULL,
    "itemDescription" text,
    "currentQuantity" integer DEFAULT 0 NOT NULL,
    "unitOfMeasure" text NOT NULL,
    "averageUnitPrice" numeric(15,2) DEFAULT 0 NOT NULL,
    "totalValue" numeric(15,2) DEFAULT 0 NOT NULL,
    location text,
    "lastUpdated" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.department_inventory OWNER TO postgres;

--
-- Name: department_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_inventory_id_seq OWNER TO postgres;

--
-- Name: department_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_inventory_id_seq OWNED BY public.department_inventory.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    "documentType" text NOT NULL,
    "referenceId" integer NOT NULL,
    "fileName" text NOT NULL,
    "filePath" text NOT NULL,
    "fileSize" integer NOT NULL,
    "fileType" text NOT NULL,
    "mimeType" text,
    "uploadedById" integer NOT NULL,
    description text,
    "isArchived" boolean DEFAULT false NOT NULL,
    "archivedAt" timestamp(3) without time zone,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_rates (
    id integer NOT NULL,
    "fromCurrency" public."Currency" NOT NULL,
    "toCurrency" public."Currency" NOT NULL,
    rate numeric(10,4) NOT NULL,
    source text NOT NULL,
    "fetchedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.exchange_rates OWNER TO postgres;

--
-- Name: exchange_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exchange_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exchange_rates_id_seq OWNER TO postgres;

--
-- Name: exchange_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exchange_rates_id_seq OWNED BY public.exchange_rates.id;


--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedbacks (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "adminComment" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.feedbacks OWNER TO postgres;

--
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedbacks_id_seq OWNER TO postgres;

--
-- Name: feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedbacks_id_seq OWNED BY public.feedbacks.id;


--
-- Name: goods_receipt_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goods_receipt_items (
    id integer NOT NULL,
    "grnId" integer NOT NULL,
    "poItemId" integer NOT NULL,
    "itemName" text NOT NULL,
    "quantityReceived" integer NOT NULL,
    "quantityAccepted" integer NOT NULL,
    "quantityRejected" integer DEFAULT 0 NOT NULL,
    "rejectionReason" text,
    "batchNumber" text,
    "expiryDate" timestamp(3) without time zone,
    "inspectionNotes" text
);


ALTER TABLE public.goods_receipt_items OWNER TO postgres;

--
-- Name: goods_receipt_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.goods_receipt_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.goods_receipt_items_id_seq OWNER TO postgres;

--
-- Name: goods_receipt_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.goods_receipt_items_id_seq OWNED BY public.goods_receipt_items.id;


--
-- Name: goods_receipt_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goods_receipt_notes (
    id integer NOT NULL,
    "grnNumber" text NOT NULL,
    "poId" integer NOT NULL,
    "supplierId" integer,
    "supplierName" text NOT NULL,
    "receiptDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "receivedById" integer NOT NULL,
    status public."GRNStatus" DEFAULT 'DRAFT'::public."GRNStatus" NOT NULL,
    "inspectionStatus" public."InspectionStatus" DEFAULT 'PENDING'::public."InspectionStatus" NOT NULL,
    "deliveryNoteRef" text,
    remarks text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.goods_receipt_notes OWNER TO postgres;

--
-- Name: goods_receipt_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.goods_receipt_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.goods_receipt_notes_id_seq OWNER TO postgres;

--
-- Name: goods_receipt_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.goods_receipt_notes_id_seq OWNED BY public.goods_receipt_notes.id;


--
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transactions (
    id integer NOT NULL,
    "inventoryId" integer NOT NULL,
    "transactionType" public."InventoryTransactionType" NOT NULL,
    quantity integer NOT NULL,
    "sourceType" text,
    "sourceId" text,
    "grnNumber" text,
    "poNumber" text,
    "supplierName" text,
    "unitPrice" numeric(15,2),
    "performedBy" text NOT NULL,
    "performedByUserId" integer,
    "quantityBefore" integer NOT NULL,
    "quantityAfter" integer NOT NULL,
    notes text,
    "transactionDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.inventory_transactions OWNER TO postgres;

--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_transactions_id_seq OWNER TO postgres;

--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_transactions_id_seq OWNED BY public.inventory_transactions.id;


--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id integer NOT NULL,
    "invoiceId" integer NOT NULL,
    "poItemId" integer NOT NULL,
    "grnItemId" integer,
    "itemName" text NOT NULL,
    description text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(15,2) NOT NULL,
    "taxRate" numeric(5,2) DEFAULT 0 NOT NULL,
    "taxAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "totalPrice" numeric(15,2) NOT NULL
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_items_id_seq OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_items_id_seq OWNED BY public.invoice_items.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    "invoiceNumber" text NOT NULL,
    "supplierInvoiceNumber" text NOT NULL,
    "supplierId" integer,
    "supplierName" text NOT NULL,
    "poId" integer NOT NULL,
    "grnId" integer,
    "invoiceDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    currency public."Currency" DEFAULT 'MYR'::public."Currency" NOT NULL,
    "exchangeRate" numeric(10,4) DEFAULT 1.0 NOT NULL,
    subtotal numeric(15,2) NOT NULL,
    "taxAmount" numeric(15,2) NOT NULL,
    "totalAmount" numeric(15,2) NOT NULL,
    "totalAmountMYR" numeric(15,2) NOT NULL,
    status public."InvoiceStatus" DEFAULT 'PENDING'::public."InvoiceStatus" NOT NULL,
    "matchStatus" public."MatchStatus" DEFAULT 'PENDING'::public."MatchStatus" NOT NULL,
    "matchDiscrepancy" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: message_attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_attachments (
    id text NOT NULL,
    "messageId" integer NOT NULL,
    "fileName" text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileType" text NOT NULL,
    "fileSize" integer NOT NULL,
    "mimeType" text,
    "thumbnailUrl" text,
    "aiAnalysis" text,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata jsonb
);


ALTER TABLE public.message_attachments OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'INFO'::text NOT NULL,
    channel text DEFAULT 'IN_APP'::text NOT NULL,
    "refType" text,
    "refId" text,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "readAt" timestamp(3) without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: password_reset_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_codes (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    email text NOT NULL,
    "codeHash" text NOT NULL,
    salt text NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.password_reset_codes OWNER TO postgres;

--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_codes_id_seq OWNER TO postgres;

--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_codes_id_seq OWNED BY public.password_reset_codes.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    "paymentNumber" text NOT NULL,
    "invoiceId" integer NOT NULL,
    "supplierId" integer,
    "supplierName" text NOT NULL,
    "paymentDate" timestamp(3) without time zone NOT NULL,
    "paymentMethod" public."PaymentMethod" NOT NULL,
    amount numeric(15,2) NOT NULL,
    currency public."Currency" DEFAULT 'MYR'::public."Currency" NOT NULL,
    "bankDetails" text,
    "referenceNumber" text,
    status public."PaymentStatus" DEFAULT 'SCHEDULED'::public."PaymentStatus" NOT NULL,
    "approvedById" integer,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "receiptFilePath" text,
    "receiptUploadedAt" timestamp(3) without time zone
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_items (
    id integer NOT NULL,
    "poId" integer NOT NULL,
    "prItemId" integer,
    "itemName" text NOT NULL,
    "itemCategory" text NOT NULL,
    "itemDescription" text NOT NULL,
    "quantityOrdered" integer NOT NULL,
    "quantityReceived" integer DEFAULT 0 NOT NULL,
    "quantityRemaining" integer NOT NULL,
    "unitOfMeasurement" text NOT NULL,
    "unitPrice" numeric(15,2) NOT NULL,
    "taxType" text,
    "taxRate" numeric(5,2) DEFAULT 0 NOT NULL,
    "taxAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "totalPrice" numeric(15,2) NOT NULL
);


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_items_id_seq OWNER TO postgres;

--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_order_items_id_seq OWNED BY public.purchase_order_items.id;


--
-- Name: purchase_order_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_records (
    "localId" text NOT NULL,
    payload jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.purchase_order_records OWNER TO postgres;

--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    "poNumber" text NOT NULL,
    "prId" integer,
    "supplierId" integer,
    "supplierName" text NOT NULL,
    "supplierEmail" text,
    "supplierPhone" text,
    "supplierAddress" text,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expectedDeliveryDate" timestamp(3) without time zone,
    "actualDeliveryDate" timestamp(3) without time zone,
    status public."POStatus" DEFAULT 'DRAFT'::public."POStatus" NOT NULL,
    currency public."Currency" DEFAULT 'MYR'::public."Currency" NOT NULL,
    "exchangeRate" numeric(10,4) DEFAULT 1.0 NOT NULL,
    subtotal numeric(15,2) DEFAULT 0 NOT NULL,
    "taxAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "totalAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "totalAmountMYR" numeric(15,2) DEFAULT 0 NOT NULL,
    "paymentTerms" text,
    "deliveryTerms" text,
    notes text,
    "createdById" integer NOT NULL,
    "approvedById" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_id_seq OWNER TO postgres;

--
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- Name: purchase_request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_request_items (
    id integer NOT NULL,
    "prId" integer NOT NULL,
    "itemName" text NOT NULL,
    "itemCategory" text NOT NULL,
    "itemDescription" text NOT NULL,
    quantity integer NOT NULL,
    "unitOfMeasurement" text NOT NULL,
    "estimatedUnitPrice" numeric(15,2) DEFAULT 0 NOT NULL,
    "estimatedTotalPrice" numeric(15,2) DEFAULT 0 NOT NULL,
    specification text,
    "isNewItem" boolean DEFAULT false NOT NULL,
    "preferredSupplier" text,
    "taxType" text DEFAULT 'NONE'::text,
    "taxRate" numeric(5,2) DEFAULT 0,
    "taxAmount" numeric(15,2) DEFAULT 0,
    "totalWithTax" numeric(15,2) DEFAULT 0,
    "paymentTerms" text,
    "paymentTermDays" integer
);


ALTER TABLE public.purchase_request_items OWNER TO postgres;

--
-- Name: purchase_request_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_request_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_request_items_id_seq OWNER TO postgres;

--
-- Name: purchase_request_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_request_items_id_seq OWNED BY public.purchase_request_items.id;


--
-- Name: purchase_request_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_request_records (
    "localId" text NOT NULL,
    payload jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.purchase_request_records OWNER TO postgres;

--
-- Name: purchase_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_requests (
    id integer NOT NULL,
    "prNumber" text NOT NULL,
    "requesterId" integer NOT NULL,
    department text NOT NULL,
    "requestDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "requiredDate" timestamp(3) without time zone,
    status public."PRStatus" DEFAULT 'DRAFT'::public."PRStatus" NOT NULL,
    "budgetCode" text,
    "totalAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    currency public."Currency" DEFAULT 'MYR'::public."Currency" NOT NULL,
    justification text,
    urgency text DEFAULT 'normal'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.purchase_requests OWNER TO postgres;

--
-- Name: purchase_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_requests_id_seq OWNER TO postgres;

--
-- Name: purchase_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_requests_id_seq OWNED BY public.purchase_requests.id;


--
-- Name: purchasing_lookups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchasing_lookups (
    id integer NOT NULL,
    kind text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.purchasing_lookups OWNER TO postgres;

--
-- Name: purchasing_lookups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchasing_lookups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchasing_lookups_id_seq OWNER TO postgres;

--
-- Name: purchasing_lookups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchasing_lookups_id_seq OWNED BY public.purchasing_lookups.id;


--
-- Name: role_change_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_change_audits (
    id integer NOT NULL,
    "targetId" integer NOT NULL,
    "fromRole" text NOT NULL,
    "toRole" text NOT NULL,
    "actorEmail" text NOT NULL,
    "actorName" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.role_change_audits OWNER TO postgres;

--
-- Name: role_change_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_change_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_change_audits_id_seq OWNER TO postgres;

--
-- Name: role_change_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_change_audits_id_seq OWNED BY public.role_change_audits.id;


--
-- Name: source_chunks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.source_chunks (
    id text NOT NULL,
    "sourceId" text NOT NULL,
    content text NOT NULL,
    "chunkIndex" integer NOT NULL
);


ALTER TABLE public.source_chunks OWNER TO postgres;

--
-- Name: sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sources (
    id text NOT NULL,
    "userId" integer NOT NULL,
    "sessionId" text,
    "fileName" text NOT NULL,
    "filePath" text NOT NULL,
    "fileType" text NOT NULL,
    "fileSize" integer NOT NULL,
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sources OWNER TO postgres;

--
-- Name: supplier_delivery_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_delivery_records (
    "localId" text NOT NULL,
    payload jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.supplier_delivery_records OWNER TO postgres;

--
-- Name: supplier_grn_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_grn_records (
    "localId" text NOT NULL,
    payload jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.supplier_grn_records OWNER TO postgres;

--
-- Name: supplier_order_acknowledgement_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_order_acknowledgement_records (
    "localId" text NOT NULL,
    payload jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.supplier_order_acknowledgement_records OWNER TO postgres;

--
-- Name: supplier_type_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_type_assignments (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    category text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.supplier_type_assignments OWNER TO postgres;

--
-- Name: supplier_type_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_type_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_type_assignments_id_seq OWNER TO postgres;

--
-- Name: supplier_type_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_type_assignments_id_seq OWNED BY public.supplier_type_assignments.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'Employee'::text NOT NULL,
    "avatarUrl" text,
    department text,
    "isActive" boolean DEFAULT true NOT NULL,
    "preferredLanguage" public."Language" DEFAULT 'en'::public."Language" NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: approval_workflows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows ALTER COLUMN id SET DEFAULT nextval('public.approval_workflows_id_seq'::regclass);


--
-- Name: budget_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_transactions ALTER COLUMN id SET DEFAULT nextval('public.budget_transactions_id_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: department_budgets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_budgets ALTER COLUMN id SET DEFAULT nextval('public.department_budgets_id_seq'::regclass);


--
-- Name: department_inventory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_inventory ALTER COLUMN id SET DEFAULT nextval('public.department_inventory_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: exchange_rates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates ALTER COLUMN id SET DEFAULT nextval('public.exchange_rates_id_seq'::regclass);


--
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks ALTER COLUMN id SET DEFAULT nextval('public.feedbacks_id_seq'::regclass);


--
-- Name: goods_receipt_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_items ALTER COLUMN id SET DEFAULT nextval('public.goods_receipt_items_id_seq'::regclass);


--
-- Name: goods_receipt_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_notes ALTER COLUMN id SET DEFAULT nextval('public.goods_receipt_notes_id_seq'::regclass);


--
-- Name: inventory_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions ALTER COLUMN id SET DEFAULT nextval('public.inventory_transactions_id_seq'::regclass);


--
-- Name: invoice_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items ALTER COLUMN id SET DEFAULT nextval('public.invoice_items_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: password_reset_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_codes ALTER COLUMN id SET DEFAULT nextval('public.password_reset_codes_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: purchase_order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_items_id_seq'::regclass);


--
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- Name: purchase_request_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_request_items_id_seq'::regclass);


--
-- Name: purchase_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests ALTER COLUMN id SET DEFAULT nextval('public.purchase_requests_id_seq'::regclass);


--
-- Name: purchasing_lookups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchasing_lookups ALTER COLUMN id SET DEFAULT nextval('public.purchasing_lookups_id_seq'::regclass);


--
-- Name: role_change_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_change_audits ALTER COLUMN id SET DEFAULT nextval('public.role_change_audits_id_seq'::regclass);


--
-- Name: supplier_type_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_type_assignments ALTER COLUMN id SET DEFAULT nextval('public.supplier_type_assignments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
382159e4-7714-47d3-ad81-89054ef84573	e4f4979688b0bc1719aa7e5074466a54973535af7e4a71f1fda186905cb585c5	2026-04-08 20:41:03.608071+08	20260408124103_init	\N	\N	2026-04-08 20:41:03.584606+08	1
d080283e-3daa-4a2b-a86d-ae55b6a649a6	7cf7f2234a53c54aa3b698b5c42110df22f417d853f4c411036bd8db049883d9	2026-04-08 22:54:04.830988+08	20260408145404_add_role_change_audit	\N	\N	2026-04-08 22:54:04.784102+08	1
d0cbadee-13e6-444d-8645-d37f8cb6629c	709623f83a5db0465831ded097de07ce33b1f3dc5a888544c4face9e3c224184	2026-04-10 16:51:30.230099+08	20260410085130_add_password_reset_codes	\N	\N	2026-04-10 16:51:30.195712+08	1
3af50175-61d3-42f0-8080-ae83a8b75fc8	89e00e0b5985c21997382c816db7a10a6c81d2938d10939277d9be2693c6f05a	2026-04-11 16:44:11.730032+08	20260411084411_add_user_department_avatar_active	\N	\N	2026-04-11 16:44:11.717123+08	1
4d8f7440-e64c-45f0-8525-67c97dd7a52b	ddb07428b3e0c4f2d05c4710943dfd68ebd584caa1e542a38ecf03a6fe75b921	2026-04-11 19:37:18.421048+08	20260411113718_add_purchasing_lookups	\N	\N	2026-04-11 19:37:18.383456+08	1
31a38531-4a03-4cb6-8c35-d7c256507ba4	3d022a269e20fcba08fc6b989b51ccde6227f9d562feefdbf14977980b885ecb	2026-04-19 23:03:27.572222+08	20260419150327_add_supplier_type_assignments	\N	\N	2026-04-19 23:03:27.531419+08	1
2032f00a-c65f-4300-b6fb-262d54ce99f2	edf26e996a699ead1ab72f177593ab220bd3b70675b5a8f368b4bed4f7fb45c7	2026-04-20 00:48:39.010675+08	20260419164838_add_workflow_record_tables	\N	\N	2026-04-20 00:48:38.936593+08	1
083d8584-e943-4b2f-821b-b72e05b6fd7f	8b5f97b9f8dbce8da6e4a8d7587e7d778ac91c38137b0e7fe1bf8d2e26450dcd	2026-06-15 14:26:59.144922+08	20260615142601_baseline_with_language		\N	2026-06-15 14:26:59.144922+08	0
2f2545ca-a66a-4fdc-91e5-f9df3bed6b54	d911a7050d5550416114cfb81e6e43be6c9c13696807f6d43430577b3588cabb	2026-06-20 00:21:59.756256+08	20260620000000_add_message_attachments		\N	2026-06-20 00:21:59.756256+08	0
f4b48661-d9a3-49ee-8b6c-0c3e1907d687	e0b7799b65a9831143c7b6fa6a063dbaff653222bcb10148b762e715edb00ac1	2026-07-30 17:28:33.8724+08	20260730172804_add_sst_tax_to_pr_items		\N	2026-07-30 17:28:33.8724+08	0
\.


--
-- Data for Name: approval_workflows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approval_workflows (id, "moduleType", "recordId", "prId", "poId", "invoiceId", "paymentId", "approverId", "approverLevel", "approverRole", status, comments, "approvalDate", "createdAt") FROM stdin;
27	PURCHASE_REQUEST	937	937	\N	\N	\N	9	1	Manager	PENDING	\N	\N	2026-08-06 16:24:44.767
28	PURCHASE_REQUEST	938	938	\N	\N	\N	9	1	Manager	PENDING	\N	\N	2026-08-06 16:25:22.629
29	PURCHASE_REQUEST	940	940	\N	\N	\N	9	1	Manager	PENDING	\N	\N	2026-08-08 05:47:50.872
30	PURCHASE_REQUEST	941	941	\N	\N	\N	9	1	Manager	PENDING	\N	\N	2026-08-08 05:54:15.626
\.


--
-- Data for Name: budget_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_transactions (id, "departmentBudgetId", "prId", "paymentId", "transactionType", amount, "balanceAfter", description, "createdAt") FROM stdin;
167	178	937	\N	COMMIT	258.68	5741.32	Budget committed for PR #937	2026-08-06 16:24:44.747
168	178	938	\N	COMMIT	386.28	5355.04	Budget committed for PR #938	2026-08-06 16:25:22.617
169	279	939	\N	COMMIT	257.40	49742.60	Budget committed for PR #939	2026-08-06 16:36:59.199
170	178	940	\N	COMMIT	25.52	5329.52	Budget committed for PR #940	2026-08-08 05:47:50.844
171	178	941	\N	COMMIT	348.00	4981.52	Budget committed for PR #941	2026-08-08 05:54:15.609
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, "sessionId", role, content, metadata, "createdAt") FROM stdin;
523	5c76beb9-4383-4bf9-a56d-3cbabb896b61	user	view purchase request	\N	2026-08-02 08:46:24.31
524	5c76beb9-4383-4bf9-a56d-3cbabb896b61	assistant	Here are your purchase requests, Super Admin!\n\nYou don't have any purchase requests yet.\n\n**Statistics at a glance:**\n| Status | Count |\n|---|---|\n| 📋 Total | 0 |\n| ⏳ Pending | 0 |\n| 📤 Submitted | 0 |\n| ✅ Approved | 0 |\n| ❌ Rejected | 0 |\n\nWould you like me to help you create a new purchase request? Just tell me what you need to purchase!	\N	2026-08-02 08:46:25.499
525	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	hi	\N	2026-08-06 02:17:19.367
526	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	Hello, Super Admin! 👋 \n\nWelcome to **OptiMind ERP** — your procurement management platform. I'm here to help you with anything you need:\n\n- 📋 **View & manage** purchase requests and orders\n- 📊 **Check** dashboard statistics and spending data\n- 🔔 **Review** notifications and alerts\n- 📝 **Create** new purchase requests\n- 📤 **Export** data in various formats\n- 🖼️ **Analyze** uploaded images for procurement\n\nJust let me know what you'd like to do, and I'll guide you through it!	\N	2026-08-06 02:17:19.38
569	6283b166-24e2-4603-8185-d3c2f8c4e3be	user	hi	\N	2026-08-06 09:43:06.472
570	6283b166-24e2-4603-8185-d3c2f8c4e3be	assistant	Hello! 👋 I'm your OptiMind ERP assistant. I'm here to help you with procurement management, including:\n\n- **Purchase Requests (PR)** – Create, view, or track your requests\n- **Purchase Orders (PO)** – Check order statuses and details\n- **Dashboard & Spending Stats** – Get insights on budgets and expenditures\n- **Notifications** – Stay updated on approvals and updates\n- **Data Export** – Download PRs, POs, invoices, or supplier lists\n- **Image Analysis** – Upload images and I'll help identify items for purchase\n\nWhat can I assist you with today?	\N	2026-08-06 09:43:06.484
527	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	create purchase request is there can?	\N	2026-08-06 02:18:30.247
528	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	I'll help you create a purchase request. What item do you need to purchase?	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "itemName", "startedAt": "2026-08-06T02:18:30.246Z", "currentItem": {}, "collectedItems": []}}	2026-08-06 02:18:30.256
529	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	name by Item Purchasing for Testing the first time	\N	2026-08-06 02:19:08.036
530	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	Which category does this item belong to?\n\nOPTIONS:\n- Office Supplies / Stationery / 办公用品\n- IT Equipment / Hardware / IT设备\n- Raw Materials / 原材料\n- Cleaning Supplies / 清洁用品\n- Furniture / 家具\n- Safety Equipment / 安全设备\n- Electrical Components / 电气组件\n- Packaging Materials / 包装材料\n- Tools & Machinery / 工具机械\n- Medical Supplies / 医疗用品\n- Other (type your own)	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "category", "startedAt": "2026-08-06T02:18:30.246Z", "updatedAt": "2026-08-06T02:19:08.035Z", "currentItem": {"itemName": "name by Item Purchasing for Testing the first time"}, "collectedItems": []}}	2026-08-06 02:19:08.044
531	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	Office Supplies / Stationery / 办公用品	\N	2026-08-06 02:19:17.543
532	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	How many units do you need?	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "quantity", "startedAt": "2026-08-06T02:18:30.246Z", "updatedAt": "2026-08-06T02:19:17.542Z", "currentItem": {"itemName": "name by Item Purchasing for Testing the first time", "itemCategory": "Office Supplies / Stationery / 办公用品"}, "collectedItems": []}}	2026-08-06 02:19:17.55
533	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	1	\N	2026-08-06 02:19:25.02
534	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	What's the unit of measurement?\n\nOPTIONS:\n- box / 箱\n- piece / 件\n- kg / 公斤\n- liter / 升\n- set / 套\n- pack / 包\n- unit / 个\n- meter / 米\n- carton / 箱\n- dozen / 打\n- roll / 卷\n- bottle / 瓶\n- Other (type your own)	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "unit", "startedAt": "2026-08-06T02:18:30.246Z", "updatedAt": "2026-08-06T02:19:25.019Z", "currentItem": {"itemName": "name by Item Purchasing for Testing the first time", "quantity": 1, "itemCategory": "Office Supplies / Stationery / 办公用品"}, "collectedItems": []}}	2026-08-06 02:19:25.028
535	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	unit / 个	\N	2026-08-06 02:19:31.274
536	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	Any additional details for this item? Type "skip" if there is nothing to add.	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "description", "startedAt": "2026-08-06T02:18:30.246Z", "updatedAt": "2026-08-06T02:19:31.273Z", "currentItem": {"itemName": "name by Item Purchasing for Testing the first time", "quantity": 1, "itemCategory": "Office Supplies / Stationery / 办公用品", "unitOfMeasurement": "unit / 个"}, "collectedItems": []}}	2026-08-06 02:19:31.281
537	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	is there can choose for which supplier?	\N	2026-08-06 02:19:51.223
538	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	Item added. Would you like to add another item?\n\nOPTIONS:\n- Add another item\n- Done, create request	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "addMore", "startedAt": "2026-08-06T02:18:30.246Z", "updatedAt": "2026-08-06T02:19:51.222Z", "currentItem": {}, "collectedItems": [{"itemName": "name by Item Purchasing for Testing the first time", "quantity": 1, "itemCategory": "Office Supplies / Stationery / 办公用品", "itemDescription": "Buy name by Item Purchasing for Testing the first time - is there can choose for which supplier?", "unitOfMeasurement": "unit / 个"}]}}	2026-08-06 02:19:51.231
539	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	Done, create request	\N	2026-08-06 02:20:10.494
540	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	Purchase Request Summary:\n1. Item: name by Item Purchasing for Testing the first time\n   Category: Office Supplies / Stationery / 办公用品\n   Quantity: 1 unit / 个\n   Description: Buy name by Item Purchasing for Testing the first time - is there can choose for which supplier?\n\nDepartment: Administration\nRequested by: Super Admin\nEmail: admin@fyp.local\n\nReady to submit?\n\nOPTIONS:\n- Submit\n- Cancel\n- Edit from start	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "preview", "startedAt": "2026-08-06T02:18:30.246Z", "updatedAt": "2026-08-06T02:20:10.493Z", "currentItem": {}, "collectedItems": [{"itemName": "name by Item Purchasing for Testing the first time", "quantity": 1, "itemCategory": "Office Supplies / Stationery / 办公用品", "itemDescription": "Buy name by Item Purchasing for Testing the first time - is there can choose for which supplier?", "unitOfMeasurement": "unit / 个"}]}}	2026-08-06 02:20:10.502
541	4d833c77-17bc-47ac-864b-f52f6ab261b5	user	Submit	\N	2026-08-06 02:20:25.484
542	4d833c77-17bc-47ac-864b-f52f6ab261b5	assistant	Sorry, I could not save your request right now. Failed to create purchase request	{"purchaseRequestFlow": {"flow": "purchase_request", "step": "preview", "startedAt": "2026-08-06T02:18:30.246Z", "updatedAt": "2026-08-06T02:20:25.483Z", "currentItem": {}, "collectedItems": [{"itemName": "name by Item Purchasing for Testing the first time", "quantity": 1, "itemCategory": "Office Supplies / Stationery / 办公用品", "itemDescription": "Buy name by Item Purchasing for Testing the first time - is there can choose for which supplier?", "unitOfMeasurement": "unit / 个"}]}}	2026-08-06 02:20:25.49
543	21144a97-5bb8-4032-b4ce-04c6e8b078a1	user	create purchase requets	\N	2026-08-06 03:12:22.21
544	21144a97-5bb8-4032-b4ce-04c6e8b078a1	assistant	I'd be happy to help you create a purchase request! \n\nTo get started, could you tell me:\n\n- **What do you need to purchase?** (e.g., office supplies, IT equipment, raw materials, etc.)\n- **How many items/units?**\n- **What's the estimated price per unit (in MYR)?**\n\nFeel free to provide as much detail as you have — you can also mention things like a preferred supplier, specific specifications, or tax preferences. I'll work with whatever you give me! 😊\n\nWhat are you looking to buy?	\N	2026-08-06 03:12:23.928
545	21144a97-5bb8-4032-b4ce-04c6e8b078a1	user	item for testing 1	\N	2026-08-06 03:13:52.349
546	21144a97-5bb8-4032-b4ce-04c6e8b078a1	assistant	Got it — "item for testing 1". To complete this purchase request, I'll need a few more details:\n\n- **Category**: What type of item is this? (e.g., Office Supplies, IT Equipment, Raw Materials, Cleaning Supplies, Furniture, Safety Equipment, or something else?)\n- **Quantity**: How many units do you need?\n- **Unit of Measurement**: Box, piece, kg, liter, set, pack, unit, meter, or another unit?\n- **Estimated Unit Price (MYR)**: How much per unit?\n- **Description**: Any additional details about this item?\n- **Preferred Supplier** (optional): Do you have a specific supplier in mind?\n- **Tax** (optional): Any SST, service tax, or sales tax applicable?\n\nFeel free to share all at once or bit by bit — whatever works for you! 😊	\N	2026-08-06 03:13:52.357
547	def587aa-6c26-46fc-8c3b-4654f62329c6	user	create purchase request	\N	2026-08-06 03:46:55.13
548	def587aa-6c26-46fc-8c3b-4654f62329c6	assistant	I'd be happy to help you create a purchase request! 🛒\n\nTo get started, just tell me what you'd like to purchase. You can provide as much or as little detail as you have right now — for example:\n\n- **What item(s)** do you need?\n- **How many** do you need?\n- **Estimated price per unit** (in MYR)?\n- Any **preferred supplier**?\n- Any specific **details or specifications**?\n\nHere are some categories available for reference:\n\n| Category |\n|---|\n| Office Supplies / Stationery |\n| IT Equipment / Hardware |\n| Raw Materials |\n| Cleaning Supplies |\n| Furniture |\n| Safety Equipment |\n| Electrical Components |\n| Packaging Materials |\n| Tools & Machinery |\n| Medical Supplies |\n| Electronics |\n| Software |\n\nGo ahead and tell me what you need — in whatever order works for you! 😊	\N	2026-08-06 03:46:56.509
549	def587aa-6c26-46fc-8c3b-4654f62329c6	user	Office Supplies / Stationery	\N	2026-08-06 03:54:51.677
550	def587aa-6c26-46fc-8c3b-4654f62329c6	assistant	Got it — **Office Supplies / Stationery** category! 📎📋\n\nNow, could you tell me more about what you need? For example:\n\n- **What item(s)?** (e.g., A4 paper, pens, staplers, notebooks, ink cartridges, etc.)\n- **How many?** (quantity per item)\n- **Estimated price per unit?** (in MYR)\n- **Preferred supplier?** (if any)\n- **Any other details?** (brand, size, specifications)\n\nFeel free to list everything in one go, and I'll take it from there! 😊	\N	2026-08-06 03:54:51.685
551	31019b89-0853-42fe-9c98-18a9b22179e5	user	view purchase request	\N	2026-08-06 03:56:11.439
552	31019b89-0853-42fe-9c98-18a9b22179e5	assistant	Here are your purchase requests, Super Admin!\n\n---\n\nYou don't have any purchase requests yet.\n\n📊 **Summary:**\n- **Total:** 0\n- **Pending:** 0\n- **Submitted:** 0\n- **Approved:** 0\n- **Rejected:** 0\n\n---\n\nWould you like me to help you create your first purchase request? Just tell me what you need to buy and I'll walk you through it!	\N	2026-08-06 03:56:12.855
553	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	create purchase request	\N	2026-08-06 09:09:17.69
554	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	I'd be happy to help you create a purchase request! 😊\n\nTo get started, could you tell me:\n\n- **What item(s)** do you need to purchase?\n- **How many** units do you need?\n- Any **estimated price** per unit (in MYR)?\n- Do you have a **preferred supplier** in mind?\n\nFeel free to share the details in whatever order you like — I'll guide you along the way!	\N	2026-08-06 09:09:19.586
555	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	Item Testing	\N	2026-08-06 09:09:53.36
556	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	Got it — you'd like to add **"Testing"** as an item. \n\nTo complete this purchase request, I still need a few more details:\n\n- 📂 **Category** — e.g., Office Supplies, IT Equipment, Raw Materials, etc.?\n- 🔢 **Quantity** — how many units?\n- 📏 **Unit of Measurement** — e.g., piece, box, set, unit?\n- 💰 **Estimated Unit Price** (MYR) — roughly how much per unit?\n- 📝 **Description** — any additional details about the item?\n\nFeel free to share them all at once, and I'll put everything together!	\N	2026-08-06 09:09:53.368
557	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	IT	\N	2026-08-06 09:10:16.848
558	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	Great, **IT Equipment** as the category for "Testing" — noted! ✅\n\nStill need these to wrap it up:\n\n- 🔢 **Quantity** — how many units?\n- 📏 **Unit of Measurement** — piece, unit, set, box...?\n- 💰 **Estimated Unit Price (MYR)** — roughly how much per unit?\n- 📝 **Description** — any additional details about the item?\n\nYou can give them all in one go!	\N	2026-08-06 09:10:16.857
559	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	Nothing	\N	2026-08-06 09:10:36.165
560	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	No worries! But I still need a couple more required details before we can submit this:\n\n- 🔢 **Quantity** — how many units?\n- 📏 **Unit of Measurement** — piece, unit, set, box...?\n- 💰 **Estimated Unit Price (MYR)** — roughly how much per unit?\n\nJust three quick numbers/answers and we're good to go! 🚀	\N	2026-08-06 09:10:36.173
561	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	1	\N	2026-08-06 09:10:44.469
562	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	Almost there! Just two more things:\n\n- 📏 **Unit of Measurement** — piece, unit, set, box...?\n- 💰 **Estimated Unit Price (MYR)** — roughly how much per unit?	\N	2026-08-06 09:10:44.474
563	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	1	\N	2026-08-06 09:10:58.925
564	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	Got it — so **Quantity: 1** and **Estimated Unit Price: RM 1.00**?\n\nJust one last thing — **Unit of Measurement**:\n\n- piece / unit / set / box / other?\n\nThen I can finalize everything! 📋	\N	2026-08-06 09:10:59.053
565	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	unit	\N	2026-08-06 09:11:13.524
566	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	Here's your Purchase Request summary:\n\n📋 **Purchase Request Preview**\n\n| Detail | Value |\n|---|---|\n| **Item** | Testing |\n| **Category** | IT Equipment |\n| **Quantity** | 1 unit |\n| **Est. Unit Price** | RM 1.00 |\n| **Total** | RM 1.00 |\n| **Supplier** | Not specified |\n| **Description** | — |\n\n**Department:** Administration  \n**Requested by:** Super Admin\n\nReady to submit? (Yes/No)	\N	2026-08-06 09:11:13.53
567	ab1b45e9-8405-4457-ac3d-e475e2e238db	user	yes	\N	2026-08-06 09:11:28.582
568	ab1b45e9-8405-4457-ac3d-e475e2e238db	assistant	❌ **出现错误：** Failed to create purchase request.\n\nIt seems the system encountered an issue while processing your request. Here are a few things you can try:\n\n- **Refresh** the page and try again\n- Check that all fields are correctly filled in\n- If the problem persists, please contact your **system administrator** or technical support\n\nWould you like me to try again, or is there anything else I can help with?	\N	2026-08-06 09:11:28.589
\.


--
-- Data for Name: chat_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_sessions (id, "userId", title, "createdAt", "updatedAt") FROM stdin;
5c76beb9-4383-4bf9-a56d-3cbabb896b61	1	Purchase Request List	2026-08-02 08:46:18.317	2026-08-02 08:46:25.502
6283b166-24e2-4603-8185-d3c2f8c4e3be	1	hi	2026-08-06 09:43:02.308	2026-08-06 09:43:06.485
4d833c77-17bc-47ac-864b-f52f6ab261b5	1	hi	2026-08-06 02:17:14.93	2026-08-06 02:20:25.491
21144a97-5bb8-4032-b4ce-04c6e8b078a1	1	create purchase requets	2026-08-06 03:12:15.582	2026-08-06 03:13:52.359
31019b89-0853-42fe-9c98-18a9b22179e5	1	Purchase Request List	2026-08-06 03:56:05.327	2026-08-06 03:56:12.856
def587aa-6c26-46fc-8c3b-4654f62329c6	1	Create Purchase Request	2026-08-06 03:46:47.027	2026-08-06 03:54:51.686
ab1b45e9-8405-4457-ac3d-e475e2e238db	1	Create Purchase Request	2026-08-06 09:09:12.756	2026-08-06 09:11:28.59
\.


--
-- Data for Name: department_budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department_budgets (id, department, "fiscalYear", "totalAllocated", "committedAmount", "spentAmount", "availableAmount", "lastUpdated", "createdAt") FROM stdin;
335	P2P-1786029145943	2024	100000.00	1000.00	0.00	99000.00	2026-08-06 15:12:25.972	2026-08-06 15:12:25.958
344	PAY-1786029148989	2024	100000.00	5000.00	0.00	95000.00	2026-08-06 15:12:29.001	2026-08-06 15:12:29.001
279	Administration	2026	50000.00	257.40	0.00	49742.60	2026-08-06 16:36:59.195	2026-07-30 10:09:22.203
178	IT	2024	6000.00	1018.48	0.00	4981.52	2026-08-08 05:54:15.605	2026-07-24 09:10:04.727
275	Operations	2026	150000.00	0.00	0.00	150000.00	2026-07-24 13:32:22.355	2026-07-24 13:32:22.356
276	Finance	2026	80000.00	0.00	0.00	80000.00	2026-07-24 13:32:22.36	2026-07-24 13:32:22.362
277	Procurement	2026	200000.00	0.00	0.00	200000.00	2026-07-24 13:32:22.364	2026-07-24 13:32:22.365
278	HR	2026	75000.00	0.00	0.00	75000.00	2026-07-24 13:32:22.368	2026-07-24 13:32:22.37
\.


--
-- Data for Name: department_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department_inventory (id, department, "itemName", "itemCategory", "itemDescription", "currentQuantity", "unitOfMeasure", "averageUnitPrice", "totalValue", location, "lastUpdated", "createdAt") FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, "documentType", "referenceId", "fileName", "filePath", "fileSize", "fileType", "mimeType", "uploadedById", description, "isArchived", "archivedAt", "uploadedAt") FROM stdin;
\.


--
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exchange_rates (id, "fromCurrency", "toCurrency", rate, source, "fetchedAt") FROM stdin;
117	USD	MYR	4.3000	manual	2024-01-01 00:00:00
118	USD	MYR	4.3500	manual	2024-02-01 00:00:00
119	USD	MYR	4.4000	manual	2024-03-01 00:00:00
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedbacks (id, "userId", type, description, status, "adminComment", "createdAt", "updatedAt") FROM stdin;
1	8	IMPROVEMENT	need to improve a lot	OPEN	\N	2026-04-20 17:51:04.943	2026-04-20 17:51:04.943
3	1	ISSUE	Improve Feature for AI	OPEN	\N	2026-08-06 09:41:55.273	2026-08-06 09:41:55.272
\.


--
-- Data for Name: goods_receipt_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goods_receipt_items (id, "grnId", "poItemId", "itemName", "quantityReceived", "quantityAccepted", "quantityRejected", "rejectionReason", "batchNumber", "expiryDate", "inspectionNotes") FROM stdin;
717	736	765	Laptop	10	10	0	\N	\N	\N	\N
\.


--
-- Data for Name: goods_receipt_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goods_receipt_notes (id, "grnNumber", "poId", "supplierId", "supplierName", "receiptDate", "receivedById", status, "inspectionStatus", "deliveryNoteRef", remarks, "createdAt", "updatedAt") FROM stdin;
736	GRN-TEST-001	830	\N	Test Supplier	2026-08-06 15:12:29.009	154	COMPLETED	PENDING	\N	\N	2026-08-06 15:12:29.01	2026-08-06 15:12:29.009
\.


--
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transactions (id, "inventoryId", "transactionType", quantity, "sourceType", "sourceId", "grnNumber", "poNumber", "supplierName", "unitPrice", "performedBy", "performedByUserId", "quantityBefore", "quantityAfter", notes, "transactionDate", "createdAt") FROM stdin;
\.


--
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, "invoiceId", "poItemId", "grnItemId", "itemName", description, quantity, "unitPrice", "taxRate", "taxAmount", "totalPrice") FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, "invoiceNumber", "supplierInvoiceNumber", "supplierId", "supplierName", "poId", "grnId", "invoiceDate", "dueDate", currency, "exchangeRate", subtotal, "taxAmount", "totalAmount", "totalAmountMYR", status, "matchStatus", "matchDiscrepancy", notes, "createdAt", "updatedAt") FROM stdin;
3437	INV-TEST-001	SUP-INV-001	1	Test Supplier	830	736	2026-08-06 15:12:29.013	2026-09-05 15:12:29.013	MYR	1.0000	5000.00	0.00	5000.00	5000.00	APPROVED	MATCHED	\N	\N	2026-08-06 15:12:29.014	2026-08-06 15:12:29.013
\.


--
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_attachments (id, "messageId", "fileName", "fileUrl", "fileType", "fileSize", "mimeType", "thumbnailUrl", "aiAnalysis", "uploadedAt", metadata) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", title, message, type, channel, "refType", "refId", "isRead", "createdAt", "readAt") FROM stdin;
270	9	Purchase Request Pending Approval	PR-IT-20260808-001 submitted by Employee1 requires your approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	940	f	2026-08-08 05:47:50.894	\N
269	3	New Feedback Submitted	Super Admin submitted ISSUE feedback.	FEEDBACK	IN_APP	feedback	3	f	2026-08-06 09:41:55.28	\N
268	1	New Feedback Submitted	Super Admin submitted ISSUE feedback.	FEEDBACK	IN_APP	feedback	3	t	2026-08-06 09:41:55.28	2026-08-06 09:42:52.736
50	6	Delivery Updated	PO-20260420-C36X delivery status changed from PENDING_DELIVERY to DELIVERED.	SUPPLIER_UPDATE	IN_APP	delivery	32eb2489-a03b-4239-bbd4-76f54f695594	t	2026-04-20 09:41:09.007	2026-08-07 13:28:33.835
271	9	Purchase Request Pending Approval	PR-IT-20260808-002 submitted by Employee1 requires your approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	941	f	2026-08-08 05:54:15.639	\N
86	3	New Feedback Submitted	Employee1 submitted IMPROVEMENT feedback.	FEEDBACK	IN_APP	feedback	1	f	2026-04-20 17:51:04.956	\N
\.


--
-- Data for Name: password_reset_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_codes (id, "userId", email, "codeHash", salt, attempts, "expiresAt", "usedAt", "createdAt") FROM stdin;
1	1	admin@fyp.local	08efb2fb8098321febe61e09ba52e8d9487559e4a5d61f8750b4116e038a66d2	5cd175cf58e1dc8600e894657e2a6dcf	0	2026-04-10 09:10:08.273	2026-04-10 08:55:24.242	2026-04-10 08:55:08.307
2	1	admin@fyp.local	af26d06ca81b7215a0146fa4ffb6fdbcacbc96350b4cebaa865adb254ef757d8	a35866b96106fe118abc5abcbe79b6ee	0	2026-04-10 09:10:24.242	2026-04-10 08:56:54.631	2026-04-10 08:55:24.253
3	1	admin@fyp.local	d74cd584da1f3929dee362fd99d0b01e2d74925dc83fbb42a5ae9f623d58c719	fe4c00623eb644e405b4e0e2bffd98c2	0	2026-04-10 09:11:54.631	2026-04-10 08:57:02.464	2026-04-10 08:56:54.658
4	4	chingweimoey@gmail.com	8d85cd61ac6cde956e47b634dedb2851e4c79e5575362901a6f8937b8e829d9f	6510962ec066006aafc28a81c50e3e5c	0	2026-04-10 09:18:41.412	2026-04-10 09:04:55.195	2026-04-10 09:03:41.418
5	4	chingweimoey@gmail.com	f97535e3e8ffa7c9a7a41469eebb2f2092f47ff7408824e3df4889101abcb0e1	5e44083ae6e390ab4e28853daa5a2d8c	0	2026-04-10 09:36:12.025	2026-04-10 09:22:02.384	2026-04-10 09:21:12.045
6	4	chingweimoey@gmail.com	ac9af18d5f7a8b5ab7fc8c18c1c840803b793699a0240dabe90a9bdf8c76078b	541c4ea6ccbe8e8befb80953e7c844f0	0	2026-04-10 12:44:03.076	2026-04-10 12:29:57.264	2026-04-10 12:29:03.105
7	4	chingweimoey@gmail.com	c9c0cf966ec54041a50a642497352e92908f022d398e758bf7a78b517a3491bb	dce97e9535660c3c76ba202085cf0a69	0	2026-04-10 12:45:48.265	2026-04-10 12:31:13.899	2026-04-10 12:30:48.27
8	4	chingweimoey@gmail.com	ea72d6bce24b9ba75a0268ef843505b9891c6730bb4deb1831c06d24e1033c91	4b7cd334653df0197aaafe230860f912	0	2026-04-11 09:11:05.83	2026-04-11 08:56:36.625	2026-04-11 08:56:05.852
9	4	chingweimoey@gmail.com	0090e282d7d724c77f0bb4636882e443316933ccce7146c4ee19e0bbcdea654d	8af146e5cce7f2657791a14daee731f8	0	2026-04-13 07:15:30.911	2026-04-13 07:01:14.605	2026-04-13 07:00:30.949
10	4	chingweimoey@gmail.com	59e84f838ef9f38eb229a0069fc4d3a2bb75a85803b8d93aa8f8e2c31c083adf	ea6e2f87627097553f1f2ee3e848eb64	0	2026-04-13 18:21:37.896	2026-04-13 18:07:12.057	2026-04-13 18:06:37.925
11	4	chingweimoey@gmail.com	663a0dddd45ea687fd4bac5b2b34bd25dda06a4a5a71eefe1ddcb5230ec7bab2	536f1504a63d12e3615fb24640022937	0	2026-04-16 02:38:45.885	2026-04-16 02:24:54.265	2026-04-16 02:23:45.938
12	4	chingweimoey@gmail.com	076da72c195e5b62babc3a9439ceb02d04513b9ead56c951f730e3d886668de1	d1b2e4746afa4fe82266e949891b8308	0	2026-04-16 02:39:54.265	2026-04-16 05:25:17.861	2026-04-16 02:24:54.285
13	4	chingweimoey@gmail.com	31e3b66143d65d2fce213952461eeee3ec99ffd21442585ff837608b4ad1cdd9	3270baf611e111210de66ff6906c1934	0	2026-04-16 05:40:17.861	2026-04-16 05:26:58.116	2026-04-16 05:25:17.886
14	6	chingweimoey@gmail.com	9e64fb4a9965ef2a067d5f8b4e559811f994f286a119a45ac1f090c1eba60bd8	9f0ff34725e91cf33d20a583f8aaaf9d	0	2026-04-20 17:38:16.679	2026-04-20 17:24:12.438	2026-04-20 17:23:16.712
15	6	chingweimoey@gmail.com	622516d49f575a68e67c8e54a26c005c8a261613d5a86ad7cf2aa16f9d78b663	bdc895216603fc8c46e73bea2df05891	0	2026-04-23 05:15:06.698	2026-04-23 05:00:58.752	2026-04-23 05:00:06.72
16	6	chingweimoey@gmail.com	3f2b6560a00013ab22f39d0fa872e1f9a6ddf4ecde948ddc2544c7b1c713e817	a968172ad1792fa5090937dacbd83dc0	0	2026-04-30 21:05:26.336	2026-04-30 20:53:33.376	2026-04-30 20:50:26.355
17	6	chingweimoey@gmail.com	9f1dddee7f34f7a9389d21b894ef9e96294af011a9d853eb02f0906acaa8b709	b8a5a03c04ea03f1c19c867ae4fbb630	0	2026-04-30 21:08:33.376	2026-04-30 20:54:10.895	2026-04-30 20:53:33.382
20	6	chingweimoey@gmail.com	021b9aefe70dd086a39588c7b787c76c20ddf894777622fca5897a318d2cb5de	29b1dbab8061504b231af12b1e0fba54	0	2026-05-07 07:44:24.374	2026-05-07 07:29:58.948	2026-05-07 07:29:24.393
18	6	chingweimoey@gmail.com	d32cc2acc0a3a3dced84620e7d24aa0c08191f4614b9e4e0493e488c02f41cdb	52b6aa544a8a5c973b61b680be82175a	1	2026-05-01 10:32:49.73	2026-05-01 10:18:49.334	2026-05-01 10:17:49.752
19	6	chingweimoey@gmail.com	84064fed8cc42e2ca85230fbb12e05599428988ce3a4f6ef5a46252297b831bc	5bb24af3fbef8a1bc61957262f7ac1d0	0	2026-05-07 03:09:26.696	2026-05-07 02:55:00.41	2026-05-07 02:54:26.712
21	6	chingweimoey@gmail.com	20def768e9f4bd0b442abda66d8af1814f104cb22921babb43268b7058997f25	983941d1ea211eae1e91fb918f7578c2	0	2026-08-02 09:23:53.037	2026-08-02 09:09:24.47	2026-08-02 09:08:53.05
22	6	chingweimoey@gmail.com	0546039dd34fcf939c2cae3894c40fc92b10a475b999962ec7753d2cd4574331	88c45cc181425527f234a69bf75e2ac1	0	2026-08-06 02:29:12.168	2026-08-06 02:15:23.068	2026-08-06 02:14:12.183
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "paymentNumber", "invoiceId", "supplierId", "supplierName", "paymentDate", "paymentMethod", amount, currency, "bankDetails", "referenceNumber", status, "approvedById", notes, "createdAt", "updatedAt", "receiptFilePath", "receiptUploadedAt") FROM stdin;
128	PAY-001	3437	1	Test Supplier	2026-08-06 15:12:29.015	BANK_TRANSFER	1000.00	MYR	\N	\N	SCHEDULED	\N	\N	2026-08-06 15:12:29.018	2026-08-06 15:12:29.015	\N	\N
129	PAY-002	3437	1	Test Supplier	2026-08-06 15:12:29.015	BANK_TRANSFER	2000.00	MYR	\N	\N	COMPLETED	\N	\N	2026-08-06 15:12:29.018	2026-08-06 15:12:29.015	\N	\N
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_items (id, "poId", "prItemId", "itemName", "itemCategory", "itemDescription", "quantityOrdered", "quantityReceived", "quantityRemaining", "unitOfMeasurement", "unitPrice", "taxType", "taxRate", "taxAmount", "totalPrice") FROM stdin;
765	830	\N	Laptop	Electronics	Dell Laptop	10	0	10	units	500.00	\N	0.00	0.00	5000.00
\.


--
-- Data for Name: purchase_order_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (id, "poNumber", "prId", "supplierId", "supplierName", "supplierEmail", "supplierPhone", "supplierAddress", "orderDate", "expectedDeliveryDate", "actualDeliveryDate", status, currency, "exchangeRate", subtotal, "taxAmount", "totalAmount", "totalAmountMYR", "paymentTerms", "deliveryTerms", notes, "createdById", "approvedById", "createdAt", "updatedAt") FROM stdin;
830	PO-TEST-001	930	1	Test Supplier	\N	\N	\N	2026-08-06 15:12:29.005	\N	\N	CONFIRMED	MYR	1.0000	0.00	0.00	5000.00	0.00	\N	\N	\N	154	\N	2026-08-06 15:12:29.006	2026-08-06 15:12:29.005
\.


--
-- Data for Name: purchase_request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_request_items (id, "prId", "itemName", "itemCategory", "itemDescription", quantity, "unitOfMeasurement", "estimatedUnitPrice", "estimatedTotalPrice", specification, "isNewItem", "preferredSupplier", "taxType", "taxRate", "taxAmount", "totalWithTax", "paymentTerms", "paymentTermDays") FROM stdin;
145	931	Testing for all the flow step	Office Supplies / Stationery	Testing for until GRN	1	pcs	222.00	222.00	\N	f	\N	SERVICE_TAX,SALES_TAX	16.00	35.52	257.52	\N	\N
146	932	Testing for all the flow step	Office Supplies / Stationery	Testing for until GRN	1	pcs	222.00	222.00	\N	f	\N	SERVICE_TAX,SALES_TAX	16.00	35.52	257.52	\N	\N
147	933	Testing for all the flow step	Office Supplies / Stationery	Testing for until GRN	1	pcs	223.00	223.00	\N	f	Ah Wei (Supplier)	SERVICE_TAX,SALES_TAX	16.00	35.68	258.68	\N	\N
148	934	Testing for all the flow step	Office Supplies / Stationery	Testing for until GRN	1	pcs	223.00	223.00	\N	f	Ah Wei (Supplier)	SERVICE_TAX,SALES_TAX	16.00	35.68	258.68	\N	\N
151	937	Testing for all the flow step	Office Supplies / Stationery	Testing for until GRN	1	pcs	223.00	223.00	\N	f	\N	SERVICE_TAX,SALES_TAX	16.00	35.68	258.68	\N	\N
152	938	Item 222	Office Supplies / Stationery	Until GRN	1	pcs	333.00	333.00	\N	f	Ah Wei (Supplier)	SERVICE_TAX,SALES_TAX	16.00	53.28	386.28	\N	\N
153	939	Item 222	Office Supplies / Stationery	Testing until GRN	1	pcs	234.00	234.00	\N	f	\N	SALES_TAX	10.00	23.40	257.40	\N	\N
154	940	Item for Testing	Office Supplies / Stationery	unitl GRN	1	box	22.00	22.00	\N	f	Ah Wei (Supplier)	SALES_TAX,SERVICE_TAX	16.00	3.52	25.52	\N	\N
155	941	Item for Testing	Office Supplies / Stationery	Again for until GRN	1	unit	300.00	300.00	\N	f	Ah Wei (Supplier)	SALES_TAX,SERVICE_TAX	16.00	48.00	348.00	\N	\N
\.


--
-- Data for Name: purchase_request_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_request_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchase_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_requests (id, "prNumber", "requesterId", department, "requestDate", "requiredDate", status, "budgetCode", "totalAmount", currency, justification, urgency, notes, "createdAt", "updatedAt") FROM stdin;
931	PR-IT-20260806-001	8	IT	2026-08-06 16:03:46.729	\N	DRAFT	\N	257.52	MYR	Purchase request submitted from frontend	normal	\N	2026-08-06 16:03:46.743	2026-08-06 16:03:46.729
932	PR-IT-20260806-002	8	IT	2026-08-06 16:03:55.377	\N	DRAFT	\N	257.52	MYR	Purchase request submitted from frontend	normal	\N	2026-08-06 16:03:55.38	2026-08-06 16:03:55.377
933	PR-IT-20260806-003	8	IT	2026-08-06 16:12:18.711	\N	DRAFT	\N	258.68	MYR	Purchase request submitted from frontend	normal	\N	2026-08-06 16:12:18.729	2026-08-06 16:12:18.711
934	PR-IT-20260806-004	8	IT	2026-08-06 16:12:22.174	\N	DRAFT	\N	258.68	MYR	Purchase request submitted from frontend	normal	\N	2026-08-06 16:12:22.177	2026-08-06 16:12:22.174
937	PR-IT-20260806-005	8	IT	2026-08-06 16:24:44.716	\N	PENDING	\N	258.68	MYR	Purchase request submitted from frontend	normal	\N	2026-08-06 16:24:44.719	2026-08-06 16:24:44.716
938	PR-IT-20260806-006	8	IT	2026-08-06 16:25:22.587	\N	PENDING	\N	386.28	MYR	Purchase request submitted from frontend	normal	\N	2026-08-06 16:25:22.589	2026-08-06 16:25:22.587
939	PR-ADM-20260806-001	1	Administration	2026-08-06 16:36:59.164	\N	PENDING	\N	257.40	MYR	Purchase request submitted from frontend	normal	\N	2026-08-06 16:36:59.167	2026-08-06 16:36:59.164
940	PR-IT-20260808-001	8	IT	2026-08-08 05:47:50.757	\N	PENDING	\N	25.52	MYR	Purchase request submitted from frontend	normal	\N	2026-08-08 05:47:50.779	2026-08-08 05:47:50.757
941	PR-IT-20260808-002	8	IT	2026-08-08 05:54:15.567	\N	PENDING	\N	348.00	MYR	Purchase request submitted from frontend	normal	\N	2026-08-08 05:54:15.571	2026-08-08 05:54:15.568
930	PR-PAY-1786029148989-2826	154	PAY-1786029148989	2026-08-06 15:12:29.003	\N	APPROVED	\N	5000.00	MYR	\N	normal	\N	2026-08-06 15:12:29.003	2026-08-06 15:12:29.003
\.


--
-- Data for Name: purchasing_lookups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchasing_lookups (id, kind, value, "createdAt") FROM stdin;
3	category	Office Supplies	2026-07-24 16:55:57.493
4	category	IT Equipment	2026-07-24 16:55:57.493
5	category	Furniture	2026-07-24 16:55:57.493
6	category	Stationery	2026-07-24 16:55:57.493
7	category	Electronics	2026-07-24 16:55:57.493
8	category	Software	2026-07-24 16:55:57.493
9	category	Raw Materials	2026-07-24 16:55:57.493
10	unit	pcs	2026-07-24 16:55:57.493
11	unit	box	2026-07-24 16:55:57.493
12	unit	set	2026-07-24 16:55:57.493
13	unit	pack	2026-07-24 16:55:57.493
14	unit	unit	2026-07-24 16:55:57.493
15	unit	kg	2026-07-24 16:55:57.493
16	unit	meter	2026-07-24 16:55:57.493
17	unit	liter	2026-07-24 16:55:57.493
18	paymentTerm	Net 30 Days	2026-07-24 16:55:57.493
19	paymentTerm	Net 60 Days	2026-07-24 16:55:57.493
20	paymentTerm	Net 90 Days	2026-07-24 16:55:57.493
21	paymentTerm	Immediate Payment	2026-07-24 16:55:57.493
22	paymentTerm	Cash on Delivery	2026-07-24 16:55:57.493
23	deliveryTerm	Standard Delivery	2026-07-24 16:55:57.493
24	deliveryTerm	Express Delivery	2026-07-24 16:55:57.493
25	deliveryTerm	Self Pickup	2026-07-24 16:55:57.493
26	currency	MYR	2026-07-24 16:55:57.493
27	currency	USD	2026-07-24 16:55:57.493
28	currency	SGD	2026-07-24 16:55:57.493
29	currency	EUR	2026-07-24 16:55:57.493
31	ITEM_CATEGORY	IT Equipment	2026-07-24 17:32:23.777
\.


--
-- Data for Name: role_change_audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_change_audits (id, "targetId", "fromRole", "toRole", "actorEmail", "actorName", "createdAt") FROM stdin;
1	3	Admin	Manager	admin@fyp.local	Super Admin	2026-04-08 14:58:18.674
2	3	Manager	Department Executive	admin@fyp.local	Super Admin	2026-04-08 14:59:23.925
3	3	Department Executive	Admin	admin@fyp.local	Super Admin	2026-04-08 14:59:31.468
4	3	Admin	Manager	admin@fyp.local	Super Admin	2026-04-15 06:30:13.114
5	4	Employee	Department Executive	admin@fyp.local	Super Admin	2026-04-15 06:30:17.391
6	4	Department Executive	Manager	jason@gmail.com	Jason	2026-04-15 06:37:50.299
7	4	Manager	Department Executive	jason@gmail.com	Jason	2026-04-15 06:37:53.499
8	4	Department Executive	Manager	admin@fyp.local	Super Admin	2026-04-16 02:21:08.919
9	4	Manager	Department Executive	admin@fyp.local	Super Admin	2026-04-16 02:21:20.598
10	3	Manager	Admin	admin@fyp.local	Super Admin	2026-04-20 07:55:10.038
11	8	Employee	Department Executive	admin@fyp.local	Super Admin	2026-08-05 14:57:37.714
12	8	Department Executive	Employee	admin@fyp.local	Super Admin	2026-08-05 14:57:41.085
\.


--
-- Data for Name: source_chunks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.source_chunks (id, "sourceId", content, "chunkIndex") FROM stdin;
\.


--
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sources (id, "userId", "sessionId", "fileName", "filePath", "fileType", "fileSize", "uploadedAt") FROM stdin;
\.


--
-- Data for Name: supplier_delivery_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_delivery_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: supplier_grn_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_grn_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: supplier_order_acknowledgement_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_order_acknowledgement_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: supplier_type_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_type_assignments (id, "userId", category, "createdAt", "updatedAt") FROM stdin;
2	6	Office Supplies / Stationery	2026-04-19 15:05:09.331	2026-04-19 15:05:09.331
5	7	IT Equipment	2026-04-19 15:05:15.219	2026-04-19 15:05:15.219
6	7	Furniture and Fixtures	2026-04-19 15:05:15.219	2026-04-19 15:05:15.219
7	7	Office Supplies / Stationery	2026-04-19 15:05:15.219	2026-04-19 15:05:15.219
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, "avatarUrl", department, "isActive", "preferredLanguage") FROM stdin;
1	Super Admin	admin@fyp.local	$2b$10$1VYVEmFnWC5AeNPw7nU3QOIQApwbHmzRPh33YiA5WTPm5nkN/FYgC	Admin	http://localhost:4000/uploads/avatars/1775897642081-sw9y7j9v.png	Administration	t	en
3	Admin	fypadminsystem@gmail.com	$2b$10$aHPDompAZJrJzYuOluhvEObcqQnboWWtOE1FT1zqtbkaACJt3ghn6	Admin	\N	Administration	t	en
4	Executive	fypexecutive@gmail.com	$2b$10$rboVn6CpmNhpZDYdLjrl2.V1Ysdfoblv5jzsGnFrHZWLyG3VsIGoq	Department Executive	http://localhost:4000/uploads/avatars/1775897762851-1a40rgzi.png	IT	t	en
7	MeMe	meme@gmail.com	$2b$10$cDCRNZakwPCBIEl/Pz9vdu.IAENBMyZOSBP3KWLCfoWcbzGXw6fNq	Supplier	\N	\N	t	en
9	Manager	finalypmanager@gmail.com	$2b$10$7ZtngpMsTei1LxOY0rNeseUGGNh5MUbPnGl39yH9Q.7HfDNlaATPW	Manager	\N	IT	t	en
8	Employee1	chingweimoey@1utar.my	$2b$10$Yj2UqgBYp5gBKHS64VqVc.974RS.MIvgR7AAonawfKwhsRsIlFm0W	Employee	\N	IT	t	en
6	Ah Wei (Supplier)	chingweimoey@gmail.com	$2b$10$I8BJZuIa6UcgsaEvXi3SPO46iTW2QRJLCHbRJUdfzSebXC74n5RQe	Supplier	\N	\N	t	en
\.


--
-- Name: approval_workflows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_workflows_id_seq', 30, true);


--
-- Name: budget_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_transactions_id_seq', 171, true);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 570, true);


--
-- Name: department_budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_budgets_id_seq', 344, true);


--
-- Name: department_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_inventory_id_seq', 155, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- Name: exchange_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exchange_rates_id_seq', 119, true);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedbacks_id_seq', 3, true);


--
-- Name: goods_receipt_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.goods_receipt_items_id_seq', 717, true);


--
-- Name: goods_receipt_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.goods_receipt_notes_id_seq', 736, true);


--
-- Name: inventory_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_transactions_id_seq', 133, true);


--
-- Name: invoice_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_items_id_seq', 188, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 3437, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 271, true);


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_codes_id_seq', 22, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 129, true);


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_order_items_id_seq', 765, true);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 830, true);


--
-- Name: purchase_request_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_request_items_id_seq', 155, true);


--
-- Name: purchase_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_requests_id_seq', 941, true);


--
-- Name: purchasing_lookups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchasing_lookups_id_seq', 2, true);


--
-- Name: role_change_audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_change_audits_id_seq', 12, true);


--
-- Name: supplier_type_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_type_assignments_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 154, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: approval_workflows approval_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_pkey PRIMARY KEY (id);


--
-- Name: budget_transactions budget_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_transactions
    ADD CONSTRAINT budget_transactions_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: department_budgets department_budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_budgets
    ADD CONSTRAINT department_budgets_pkey PRIMARY KEY (id);


--
-- Name: department_inventory department_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department_inventory
    ADD CONSTRAINT department_inventory_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: exchange_rates exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: goods_receipt_items goods_receipt_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_items
    ADD CONSTRAINT goods_receipt_items_pkey PRIMARY KEY (id);


--
-- Name: goods_receipt_notes goods_receipt_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_notes
    ADD CONSTRAINT goods_receipt_notes_pkey PRIMARY KEY (id);


--
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: message_attachments message_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT message_attachments_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_codes password_reset_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT password_reset_codes_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_records purchase_order_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_records
    ADD CONSTRAINT purchase_order_records_pkey PRIMARY KEY ("localId");


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_request_items purchase_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items
    ADD CONSTRAINT purchase_request_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_request_records purchase_request_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_records
    ADD CONSTRAINT purchase_request_records_pkey PRIMARY KEY ("localId");


--
-- Name: purchase_requests purchase_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_pkey PRIMARY KEY (id);


--
-- Name: purchasing_lookups purchasing_lookups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchasing_lookups
    ADD CONSTRAINT purchasing_lookups_pkey PRIMARY KEY (id);


--
-- Name: role_change_audits role_change_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_change_audits
    ADD CONSTRAINT role_change_audits_pkey PRIMARY KEY (id);


--
-- Name: source_chunks source_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source_chunks
    ADD CONSTRAINT source_chunks_pkey PRIMARY KEY (id);


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: supplier_delivery_records supplier_delivery_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_delivery_records
    ADD CONSTRAINT supplier_delivery_records_pkey PRIMARY KEY ("localId");


--
-- Name: supplier_grn_records supplier_grn_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_grn_records
    ADD CONSTRAINT supplier_grn_records_pkey PRIMARY KEY ("localId");


--
-- Name: supplier_order_acknowledgement_records supplier_order_acknowledgement_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_order_acknowledgement_records
    ADD CONSTRAINT supplier_order_acknowledgement_records_pkey PRIMARY KEY ("localId");


--
-- Name: supplier_type_assignments supplier_type_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_type_assignments
    ADD CONSTRAINT supplier_type_assignments_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: approval_workflows_approverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "approval_workflows_approverId_idx" ON public.approval_workflows USING btree ("approverId");


--
-- Name: approval_workflows_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "approval_workflows_invoiceId_idx" ON public.approval_workflows USING btree ("invoiceId");


--
-- Name: approval_workflows_paymentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "approval_workflows_paymentId_idx" ON public.approval_workflows USING btree ("paymentId");


--
-- Name: approval_workflows_poId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "approval_workflows_poId_idx" ON public.approval_workflows USING btree ("poId");


--
-- Name: approval_workflows_prId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "approval_workflows_prId_idx" ON public.approval_workflows USING btree ("prId");


--
-- Name: approval_workflows_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX approval_workflows_status_idx ON public.approval_workflows USING btree (status);


--
-- Name: budget_transactions_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_transactions_createdAt_idx" ON public.budget_transactions USING btree ("createdAt");


--
-- Name: budget_transactions_departmentBudgetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_transactions_departmentBudgetId_idx" ON public.budget_transactions USING btree ("departmentBudgetId");


--
-- Name: budget_transactions_paymentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_transactions_paymentId_idx" ON public.budget_transactions USING btree ("paymentId");


--
-- Name: budget_transactions_prId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_transactions_prId_idx" ON public.budget_transactions USING btree ("prId");


--
-- Name: chat_messages_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "chat_messages_createdAt_idx" ON public.chat_messages USING btree ("createdAt");


--
-- Name: chat_messages_sessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "chat_messages_sessionId_idx" ON public.chat_messages USING btree ("sessionId");


--
-- Name: chat_sessions_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "chat_sessions_createdAt_idx" ON public.chat_sessions USING btree ("createdAt");


--
-- Name: chat_sessions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "chat_sessions_userId_idx" ON public.chat_sessions USING btree ("userId");


--
-- Name: department_budgets_department_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX department_budgets_department_idx ON public.department_budgets USING btree (department);


--
-- Name: department_budgets_department_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX department_budgets_department_key ON public.department_budgets USING btree (department);


--
-- Name: department_budgets_fiscalYear_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "department_budgets_fiscalYear_idx" ON public.department_budgets USING btree ("fiscalYear");


--
-- Name: department_inventory_department_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX department_inventory_department_idx ON public.department_inventory USING btree (department);


--
-- Name: department_inventory_department_itemName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "department_inventory_department_itemName_key" ON public.department_inventory USING btree (department, "itemName");


--
-- Name: department_inventory_itemCategory_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "department_inventory_itemCategory_idx" ON public.department_inventory USING btree ("itemCategory");


--
-- Name: documents_documentType_referenceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documents_documentType_referenceId_idx" ON public.documents USING btree ("documentType", "referenceId");


--
-- Name: documents_uploadedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documents_uploadedAt_idx" ON public.documents USING btree ("uploadedAt");


--
-- Name: documents_uploadedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "documents_uploadedById_idx" ON public.documents USING btree ("uploadedById");


--
-- Name: exchange_rates_fetchedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "exchange_rates_fetchedAt_idx" ON public.exchange_rates USING btree ("fetchedAt");


--
-- Name: exchange_rates_fromCurrency_toCurrency_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "exchange_rates_fromCurrency_toCurrency_idx" ON public.exchange_rates USING btree ("fromCurrency", "toCurrency");


--
-- Name: feedbacks_status_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "feedbacks_status_createdAt_idx" ON public.feedbacks USING btree (status, "createdAt");


--
-- Name: feedbacks_userId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "feedbacks_userId_createdAt_idx" ON public.feedbacks USING btree ("userId", "createdAt");


--
-- Name: goods_receipt_items_grnId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "goods_receipt_items_grnId_idx" ON public.goods_receipt_items USING btree ("grnId");


--
-- Name: goods_receipt_items_poItemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "goods_receipt_items_poItemId_idx" ON public.goods_receipt_items USING btree ("poItemId");


--
-- Name: goods_receipt_notes_grnNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "goods_receipt_notes_grnNumber_key" ON public.goods_receipt_notes USING btree ("grnNumber");


--
-- Name: goods_receipt_notes_poId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "goods_receipt_notes_poId_idx" ON public.goods_receipt_notes USING btree ("poId");


--
-- Name: goods_receipt_notes_receiptDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "goods_receipt_notes_receiptDate_idx" ON public.goods_receipt_notes USING btree ("receiptDate");


--
-- Name: goods_receipt_notes_receivedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "goods_receipt_notes_receivedById_idx" ON public.goods_receipt_notes USING btree ("receivedById");


--
-- Name: inventory_transactions_inventoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_transactions_inventoryId_idx" ON public.inventory_transactions USING btree ("inventoryId");


--
-- Name: inventory_transactions_sourceType_sourceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_transactions_sourceType_sourceId_idx" ON public.inventory_transactions USING btree ("sourceType", "sourceId");


--
-- Name: inventory_transactions_transactionDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventory_transactions_transactionDate_idx" ON public.inventory_transactions USING btree ("transactionDate");


--
-- Name: invoice_items_grnItemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_items_grnItemId_idx" ON public.invoice_items USING btree ("grnItemId");


--
-- Name: invoice_items_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_items_invoiceId_idx" ON public.invoice_items USING btree ("invoiceId");


--
-- Name: invoice_items_poItemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoice_items_poItemId_idx" ON public.invoice_items USING btree ("poItemId");


--
-- Name: invoices_dueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_dueDate_idx" ON public.invoices USING btree ("dueDate");


--
-- Name: invoices_grnId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_grnId_idx" ON public.invoices USING btree ("grnId");


--
-- Name: invoices_invoiceDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_invoiceDate_idx" ON public.invoices USING btree ("invoiceDate");


--
-- Name: invoices_invoiceNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON public.invoices USING btree ("invoiceNumber");


--
-- Name: invoices_poId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "invoices_poId_idx" ON public.invoices USING btree ("poId");


--
-- Name: invoices_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX invoices_status_idx ON public.invoices USING btree (status);


--
-- Name: message_attachments_messageId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "message_attachments_messageId_idx" ON public.message_attachments USING btree ("messageId");


--
-- Name: message_attachments_uploadedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "message_attachments_uploadedAt_idx" ON public.message_attachments USING btree ("uploadedAt");


--
-- Name: notifications_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_createdAt_idx" ON public.notifications USING btree ("createdAt");


--
-- Name: notifications_userId_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_userId_isRead_idx" ON public.notifications USING btree ("userId", "isRead");


--
-- Name: password_reset_codes_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "password_reset_codes_createdAt_idx" ON public.password_reset_codes USING btree ("createdAt");


--
-- Name: password_reset_codes_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX password_reset_codes_email_idx ON public.password_reset_codes USING btree (email);


--
-- Name: password_reset_codes_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "password_reset_codes_expiresAt_idx" ON public.password_reset_codes USING btree ("expiresAt");


--
-- Name: password_reset_codes_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "password_reset_codes_userId_idx" ON public.password_reset_codes USING btree ("userId");


--
-- Name: payments_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_invoiceId_idx" ON public.payments USING btree ("invoiceId");


--
-- Name: payments_paymentDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_paymentDate_idx" ON public.payments USING btree ("paymentDate");


--
-- Name: payments_paymentNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "payments_paymentNumber_key" ON public.payments USING btree ("paymentNumber");


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: purchase_order_items_poId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_order_items_poId_idx" ON public.purchase_order_items USING btree ("poId");


--
-- Name: purchase_order_items_prItemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_order_items_prItemId_idx" ON public.purchase_order_items USING btree ("prItemId");


--
-- Name: purchase_order_records_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_order_records_createdAt_idx" ON public.purchase_order_records USING btree ("createdAt");


--
-- Name: purchase_order_records_updatedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_order_records_updatedAt_idx" ON public.purchase_order_records USING btree ("updatedAt");


--
-- Name: purchase_orders_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_orders_createdById_idx" ON public.purchase_orders USING btree ("createdById");


--
-- Name: purchase_orders_orderDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_orders_orderDate_idx" ON public.purchase_orders USING btree ("orderDate");


--
-- Name: purchase_orders_poNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "purchase_orders_poNumber_key" ON public.purchase_orders USING btree ("poNumber");


--
-- Name: purchase_orders_prId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_orders_prId_idx" ON public.purchase_orders USING btree ("prId");


--
-- Name: purchase_orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_orders_status_idx ON public.purchase_orders USING btree (status);


--
-- Name: purchase_orders_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_orders_supplierId_idx" ON public.purchase_orders USING btree ("supplierId");


--
-- Name: purchase_request_items_itemCategory_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_request_items_itemCategory_idx" ON public.purchase_request_items USING btree ("itemCategory");


--
-- Name: purchase_request_items_prId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_request_items_prId_idx" ON public.purchase_request_items USING btree ("prId");


--
-- Name: purchase_request_records_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_request_records_createdAt_idx" ON public.purchase_request_records USING btree ("createdAt");


--
-- Name: purchase_request_records_updatedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_request_records_updatedAt_idx" ON public.purchase_request_records USING btree ("updatedAt");


--
-- Name: purchase_requests_department_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_requests_department_idx ON public.purchase_requests USING btree (department);


--
-- Name: purchase_requests_prNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "purchase_requests_prNumber_key" ON public.purchase_requests USING btree ("prNumber");


--
-- Name: purchase_requests_requestDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_requests_requestDate_idx" ON public.purchase_requests USING btree ("requestDate");


--
-- Name: purchase_requests_requesterId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "purchase_requests_requesterId_idx" ON public.purchase_requests USING btree ("requesterId");


--
-- Name: purchase_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchase_requests_status_idx ON public.purchase_requests USING btree (status);


--
-- Name: purchasing_lookups_kind_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX purchasing_lookups_kind_idx ON public.purchasing_lookups USING btree (kind);


--
-- Name: purchasing_lookups_kind_value_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX purchasing_lookups_kind_value_key ON public.purchasing_lookups USING btree (kind, value);


--
-- Name: role_change_audits_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "role_change_audits_createdAt_idx" ON public.role_change_audits USING btree ("createdAt");


--
-- Name: role_change_audits_targetId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "role_change_audits_targetId_idx" ON public.role_change_audits USING btree ("targetId");


--
-- Name: source_chunks_sourceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "source_chunks_sourceId_idx" ON public.source_chunks USING btree ("sourceId");


--
-- Name: sources_sessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sources_sessionId_idx" ON public.sources USING btree ("sessionId");


--
-- Name: sources_uploadedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sources_uploadedAt_idx" ON public.sources USING btree ("uploadedAt");


--
-- Name: sources_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sources_userId_idx" ON public.sources USING btree ("userId");


--
-- Name: supplier_delivery_records_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_delivery_records_createdAt_idx" ON public.supplier_delivery_records USING btree ("createdAt");


--
-- Name: supplier_delivery_records_updatedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_delivery_records_updatedAt_idx" ON public.supplier_delivery_records USING btree ("updatedAt");


--
-- Name: supplier_grn_records_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_grn_records_createdAt_idx" ON public.supplier_grn_records USING btree ("createdAt");


--
-- Name: supplier_grn_records_updatedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_grn_records_updatedAt_idx" ON public.supplier_grn_records USING btree ("updatedAt");


--
-- Name: supplier_order_acknowledgement_records_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_order_acknowledgement_records_createdAt_idx" ON public.supplier_order_acknowledgement_records USING btree ("createdAt");


--
-- Name: supplier_order_acknowledgement_records_updatedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_order_acknowledgement_records_updatedAt_idx" ON public.supplier_order_acknowledgement_records USING btree ("updatedAt");


--
-- Name: supplier_type_assignments_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX supplier_type_assignments_category_idx ON public.supplier_type_assignments USING btree (category);


--
-- Name: supplier_type_assignments_userId_category_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "supplier_type_assignments_userId_category_key" ON public.supplier_type_assignments USING btree ("userId", category);


--
-- Name: supplier_type_assignments_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "supplier_type_assignments_userId_idx" ON public.supplier_type_assignments USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: approval_workflows approval_workflows_approverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT "approval_workflows_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: approval_workflows approval_workflows_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT "approval_workflows_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_workflows approval_workflows_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT "approval_workflows_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_workflows approval_workflows_poId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT "approval_workflows_poId_fkey" FOREIGN KEY ("poId") REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: approval_workflows approval_workflows_prId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT "approval_workflows_prId_fkey" FOREIGN KEY ("prId") REFERENCES public.purchase_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget_transactions budget_transactions_departmentBudgetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_transactions
    ADD CONSTRAINT "budget_transactions_departmentBudgetId_fkey" FOREIGN KEY ("departmentBudgetId") REFERENCES public.department_budgets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget_transactions budget_transactions_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_transactions
    ADD CONSTRAINT "budget_transactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: chat_messages chat_messages_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public.chat_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_sessions chat_sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: feedbacks feedbacks_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: goods_receipt_items goods_receipt_items_grnId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_items
    ADD CONSTRAINT "goods_receipt_items_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES public.goods_receipt_notes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: goods_receipt_items goods_receipt_items_poItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_items
    ADD CONSTRAINT "goods_receipt_items_poItemId_fkey" FOREIGN KEY ("poItemId") REFERENCES public.purchase_order_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: goods_receipt_notes goods_receipt_notes_poId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_notes
    ADD CONSTRAINT "goods_receipt_notes_poId_fkey" FOREIGN KEY ("poId") REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: goods_receipt_notes goods_receipt_notes_receivedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_receipt_notes
    ADD CONSTRAINT "goods_receipt_notes_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inventory_transactions inventory_transactions_inventoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT "inventory_transactions_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES public.department_inventory(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_grnItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "invoice_items_grnItemId_fkey" FOREIGN KEY ("grnItemId") REFERENCES public.goods_receipt_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoice_items invoice_items_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_poItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT "invoice_items_poItemId_fkey" FOREIGN KEY ("poItemId") REFERENCES public.purchase_order_items(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: invoices invoices_grnId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES public.goods_receipt_notes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_poId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_poId_fkey" FOREIGN KEY ("poId") REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: message_attachments message_attachments_messageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_attachments
    ADD CONSTRAINT "message_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES public.chat_messages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: password_reset_codes password_reset_codes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT "password_reset_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_approvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_order_items purchase_order_items_poId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT "purchase_order_items_poId_fkey" FOREIGN KEY ("poId") REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_order_items purchase_order_items_prItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT "purchase_order_items_prItemId_fkey" FOREIGN KEY ("prItemId") REFERENCES public.purchase_request_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_orders purchase_orders_approvedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "purchase_orders_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_orders purchase_orders_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "purchase_orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_orders purchase_orders_prId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "purchase_orders_prId_fkey" FOREIGN KEY ("prId") REFERENCES public.purchase_requests(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: purchase_request_items purchase_request_items_prId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items
    ADD CONSTRAINT "purchase_request_items_prId_fkey" FOREIGN KEY ("prId") REFERENCES public.purchase_requests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_requests purchase_requests_requesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT "purchase_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: role_change_audits role_change_audits_targetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_change_audits
    ADD CONSTRAINT "role_change_audits_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: source_chunks source_chunks_sourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source_chunks
    ADD CONSTRAINT "source_chunks_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES public.sources(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sources sources_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT "sources_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public.chat_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sources sources_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT "sources_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: supplier_type_assignments supplier_type_assignments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_type_assignments
    ADD CONSTRAINT "supplier_type_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict oRfwGBUffi2d9u7RkDsHmaBWmOiT5fBnklUkK9189MNgaOCSKTnNtueeUDdLv2b
