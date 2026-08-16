--
-- PostgreSQL database dump
--

\restrict NeM5VPryhDHYBygKuFMAlgXWlerDRxcgXtuIojUyGwcj5A17HCKVu6VVJfsxRpu

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
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    "userId" integer,
    "userEmail" text,
    "userName" text,
    "ipAddress" text,
    "userAgent" text,
    changes jsonb,
    metadata jsonb,
    status text DEFAULT 'SUCCESS'::text NOT NULL,
    "errorMsg" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: backup_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.backup_history (
    id integer NOT NULL,
    "backupType" text NOT NULL,
    "fileName" text NOT NULL,
    "filePath" text NOT NULL,
    "fileSize" bigint,
    status text NOT NULL,
    "startedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "errorMsg" text,
    metadata jsonb
);


ALTER TABLE public.backup_history OWNER TO postgres;

--
-- Name: backup_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.backup_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.backup_history_id_seq OWNER TO postgres;

--
-- Name: backup_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.backup_history_id_seq OWNED BY public.backup_history.id;


--
-- Name: budget_adjustment_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_adjustment_requests (
    id integer NOT NULL,
    "departmentId" integer NOT NULL,
    reason text NOT NULL,
    "requestType" text NOT NULL,
    "requestedAmount" numeric(15,2) NOT NULL,
    "requestedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "requestedBy" integer NOT NULL,
    "reviewNotes" text,
    "reviewedAt" timestamp(3) without time zone,
    "reviewedBy" integer,
    status text DEFAULT 'pending'::text NOT NULL,
    "targetMonth" integer NOT NULL,
    "targetYear" integer NOT NULL
);


ALTER TABLE public.budget_adjustment_requests OWNER TO postgres;

--
-- Name: budget_adjustment_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_adjustment_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_adjustment_requests_id_seq OWNER TO postgres;

--
-- Name: budget_adjustment_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_adjustment_requests_id_seq OWNED BY public.budget_adjustment_requests.id;


--
-- Name: budget_predictions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_predictions (
    id integer NOT NULL,
    "departmentId" integer,
    "aiInsights" text NOT NULL,
    algorithm text NOT NULL,
    "categoryBreakdown" jsonb,
    "comparisonData" jsonb,
    confidence text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "predictedAmount" numeric(15,2) NOT NULL,
    "targetMonth" integer NOT NULL,
    "targetYear" integer NOT NULL,
    "triggerType" text NOT NULL
);


ALTER TABLE public.budget_predictions OWNER TO postgres;

--
-- Name: budget_predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budget_predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.budget_predictions_id_seq OWNER TO postgres;

--
-- Name: budget_predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budget_predictions_id_seq OWNED BY public.budget_predictions.id;


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
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


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
-- Name: monthly_budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monthly_budgets (
    id integer NOT NULL,
    "departmentId" integer NOT NULL,
    "allocatedAmount" numeric(15,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    month integer NOT NULL,
    notes text,
    "reservedAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "spentAmount" numeric(15,2) DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    year integer NOT NULL
);


ALTER TABLE public.monthly_budgets OWNER TO postgres;

--
-- Name: monthly_budgets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.monthly_budgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.monthly_budgets_id_seq OWNER TO postgres;

--
-- Name: monthly_budgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.monthly_budgets_id_seq OWNED BY public.monthly_budgets.id;


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
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: backup_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backup_history ALTER COLUMN id SET DEFAULT nextval('public.backup_history_id_seq'::regclass);


--
-- Name: budget_adjustment_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_adjustment_requests ALTER COLUMN id SET DEFAULT nextval('public.budget_adjustment_requests_id_seq'::regclass);


--
-- Name: budget_predictions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_predictions ALTER COLUMN id SET DEFAULT nextval('public.budget_predictions_id_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks ALTER COLUMN id SET DEFAULT nextval('public.feedbacks_id_seq'::regclass);


--
-- Name: monthly_budgets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budgets ALTER COLUMN id SET DEFAULT nextval('public.monthly_budgets_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: password_reset_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_codes ALTER COLUMN id SET DEFAULT nextval('public.password_reset_codes_id_seq'::regclass);


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
c49698a8-b200-4de1-a8b1-2a0e38ec2102	fd3ccf4dd4c334d4d2b55aff5b9c71ac147e05fc432db04c91cbfec58f5a17b7	2026-08-12 20:24:54.263326+08	20260812170000_add_purchasing_lookup_department_role	\N	\N	2026-08-12 20:24:54.250651+08	1
e1d3eab4-b977-4817-8633-75658b9e1385	043001ec1b6cd0458fbbd4f264bb6ac3c05c1b829f99771f00f71fd4d1aaa557	2026-08-12 20:35:41.190145+08	20260812173000_remove_purchasing_lookup_department_role	\N	\N	2026-08-12 20:35:41.180598+08	1
d27f6512-609a-4911-807c-0238482f324c	98ee3bba0417b56312a9f96d06849d3d95ad978d79d3ab722a530b5e38a01775	2026-08-13 09:31:06.619414+08	20260813093000_add_supplier_inventory_items	\N	\N	2026-08-13 09:31:06.587738+08	1
9763d90d-a60f-4e38-bc60-b499c2b88a5e	a918ffc4f79f56b2881533147c120fb084b728813107e57ecbfd2163dd0642ac	2026-08-13 17:12:16.779537+08	20260813110000_add_supplier_inventory_tax	\N	\N	2026-08-13 17:12:16.762364+08	1
11551499-ea12-4cb7-8eb1-7c6dd72d12ba	ecb885370e52e88f0db8f4f286099f62e7851e153a831b881b3c723acbd40490	2026-08-13 18:01:12.177565+08	20260813120000_set_supplier_inventory_tax_to_10_percent	\N	\N	2026-08-13 18:01:12.165261+08	1
c460839d-a816-4327-8ca2-2e1c5e78794b	65ee57cba465b9f1b9f58091cfb82c4f3bdf311bc1288b679bc5d0af478d8150	2026-08-14 16:26:27.066752+08	20260814082613_add_monthly_budget_model		\N	2026-08-14 16:26:27.066752+08	0
b93435a3-d66f-4d73-95af-efaa2c161b95	6bade4aa11c3a10ca9b9fc0d2632672d4b36072912b3a8f083201d00425f5589	2026-08-14 19:59:59.232186+08	20260814195912_add_budget_prediction_model		\N	2026-08-14 19:59:59.232186+08	0
be3b766c-b205-4fff-9b2b-ecf9bed2f1df	02c9df4cc5a1aaa648f1b74c1a1462a5119dde0ad2fa8afd5122d830128155cc	2026-08-14 20:09:15.033542+08	20260814120842_add_budget_adjustment_request_model		\N	2026-08-14 20:09:15.033542+08	0
d860e4e1-7991-40be-b795-dea45dbbda01	4d671fe34e5dc30341f777534071081642643e5a290e043674cf8751c3c8bbf7	2026-08-15 14:22:43.847829+08	20260814000000_add_department_model	\N	\N	2026-08-15 14:22:43.821379+08	1
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, action, entity, "entityId", "userId", "userEmail", "userName", "ipAddress", "userAgent", changes, metadata, status, "errorMsg", "createdAt") FROM stdin;
1	TEST	TestEntity	test-123	1	test@example.com	Test User	127.0.0.1	test-agent	null	{"test": true}	SUCCESS	\N	2026-08-09 05:21:16.682
2	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "test@example.com"}	FAILED	\N	2026-08-09 05:25:05.182
3	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "test@example.com"}	FAILED	\N	2026-08-09 05:25:05.184
4	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "admin@test.com"}	FAILED	\N	2026-08-09 05:25:26.805
5	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "admin@test.com"}	FAILED	\N	2026-08-09 05:25:26.807
6	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "test@example.com"}	FAILED	\N	2026-08-09 05:25:54.906
7	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "test@example.com"}	FAILED	\N	2026-08-09 05:25:54.91
8	CREATE	User	156	\N	\N	\N	::1	curl/8.19.0	{"after": {"role": "EMPLOYEE", "email": "testuser2@test.com"}}	null	SUCCESS	\N	2026-08-09 05:27:52.947
9	CREATE	User	\N	\N	\N	\N	::1	curl/8.19.0	{"after": {"role": "EMPLOYEE", "email": "testuser2@test.com"}}	null	SUCCESS	\N	2026-08-09 05:27:52.949
10	UPDATE	User	156	\N	\N	\N	::1	curl/8.19.0	{"after": {"name": "Updated User Name", "department": "HR"}}	null	SUCCESS	\N	2026-08-09 05:28:13.437
11	UPDATE	User	156	\N	\N	\N	::1	curl/8.19.0	{"after": {"name": "Updated User Name", "department": "HR"}}	null	SUCCESS	\N	2026-08-09 05:28:13.44
12	UPDATE	User	156	\N	\N	\N	::1	curl/8.19.0	{"after": {"isActive": false}}	null	SUCCESS	\N	2026-08-09 05:28:17.446
13	UPDATE	User	156	\N	\N	\N	::1	curl/8.19.0	{"after": {"isActive": false}}	null	SUCCESS	\N	2026-08-09 05:28:17.447
14	CREATE	PurchaseRequest	PR-TEST-001	\N	\N	\N	::1	curl/8.19.0	null	{"itemCount": 1}	FAILED	\N	2026-08-09 05:28:30.739
15	CREATE	PurchaseRequest	PR-TEST-001	\N	\N	\N	::1	curl/8.19.0	null	{"itemCount": 1}	FAILED	\N	2026-08-09 05:28:30.74
16	CREATE	PurchaseRequest	PR-TEST-001	\N	\N	\N	::1	curl/8.19.0	null	{"itemCount": 1}	FAILED	\N	2026-08-09 05:28:36.936
17	CREATE	PurchaseRequest	PR-TEST-001	\N	\N	\N	::1	curl/8.19.0	null	{"itemCount": 1}	FAILED	\N	2026-08-09 05:28:36.938
18	CREATE	User	157	\N	\N	\N	::1	curl/8.19.0	{"after": {"role": "EMPLOYEE", "email": "finaltest@test.com"}}	null	SUCCESS	\N	2026-08-09 05:29:09.833
19	CREATE	User	\N	\N	\N	\N	::1	curl/8.19.0	{"after": {"role": "EMPLOYEE", "email": "finaltest@test.com"}}	null	SUCCESS	\N	2026-08-09 05:29:09.836
20	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "wronguser@test.com"}	FAILED	\N	2026-08-09 05:29:19.134
21	LOGIN	Auth	\N	\N	\N	\N	::1	curl/8.19.0	null	{"success": false, "failedEmail": "wronguser@test.com"}	FAILED	\N	2026-08-09 05:29:19.137
22	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:45:46.633
23	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:45:46.633
24	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:46:10.155
25	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:46:10.156
26	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:57:15.923
27	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:57:15.922
28	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:57:32.29
29	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 06:57:32.29
30	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:06:58.038
31	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:06:58.038
32	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:07:04.948
33	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:07:04.948
34	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:07:09.403
35	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:07:09.403
36	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:13:37.743
37	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-15 07:13:37.744
38	LOGIN	User	1	1	admin@fyp.local	\N	\N	\N	null	null	SUCCESS	\N	2026-08-16 17:08:50.74
39	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-16 17:09:44.17
40	LOGIN	Auth	\N	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0	null	{"success": true}	SUCCESS	\N	2026-08-16 17:09:44.171
\.


--
-- Data for Name: backup_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.backup_history (id, "backupType", "fileName", "filePath", "fileSize", status, "startedAt", "completedAt", "errorMsg", metadata) FROM stdin;
1	DATABASE	db_backup_2026-08-09T05-16-18.sql	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-09T05-16-18.sql	\N	FAILED	2026-08-09 05:16:18.799	2026-08-09 05:16:18.87	Command failed: "C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe" -h localhost -p 5432 -U postgres -d FYPData -F p -f "C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-09T05-16-18.sql"\nThe system cannot find the path specified.\r\n	\N
2	DATABASE	db_backup_2026-08-09T05-17-13.sql	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-09T05-17-13.sql	96628	SUCCESS	2026-08-09 05:17:13.337	2026-08-09 05:17:14.146	\N	{"rowCounts": {"users": 7, "sources": 0, "auditLogs": 0, "chatMessages": 4, "chatSessions": 82, "notifications": 97, "purchaseOrders": 1, "purchaseRequests": 17}}
3	FILES	files_backup_2026-08-09T05-17-19.zip	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\files\\files_backup_2026-08-09T05-17-19.zip	13200648	SUCCESS	2026-08-09 05:17:19.508	2026-08-09 05:17:23.256	\N	{"fileCount": 66}
4	DATABASE	db_backup_2026-08-09T05-30-06.sql	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-09T05-30-06.sql	100391	SUCCESS	2026-08-09 05:30:06.165	2026-08-09 05:30:06.643	\N	{"rowCounts": {"users": 10, "sources": 0, "auditLogs": 21, "chatMessages": 4, "chatSessions": 82, "notifications": 97, "purchaseOrders": 1, "purchaseRequests": 17}}
5	DATABASE	db_backup_2026-08-09T05-36-06.sql	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-09T05-36-06.sql	100979	SUCCESS	2026-08-09 05:36:06.41	2026-08-09 05:36:06.897	\N	{"rowCounts": {"users": 10, "sources": 0, "auditLogs": 21, "chatMessages": 4, "chatSessions": 82, "notifications": 97, "purchaseOrders": 1, "purchaseRequests": 17}}
6	FILES	files_backup_2026-08-09T05-36-06.zip	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\files\\files_backup_2026-08-09T05-36-06.zip	13200648	SUCCESS	2026-08-09 05:36:06.412	2026-08-09 05:36:11.005	\N	{"fileCount": 66}
7	DATABASE	db_backup_2026-08-09T08-17-43.sql	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-09T08-17-43.sql	\N	IN_PROGRESS	2026-08-09 08:17:43.771	\N	\N	\N
8	DATABASE	db_backup_2026-08-16T17-16-12.sql	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-16T17-16-12.sql	90669	SUCCESS	2026-08-16 17:16:12.055	2026-08-16 17:16:12.46	\N	{"rowCounts": {"users": 7, "sources": 0, "auditLogs": 40, "chatMessages": 4, "chatSessions": 82, "notifications": 97, "purchaseOrders": 0, "purchaseRequests": 0}}
9	DATABASE	db_backup_2026-08-16T17-20-15.sql	C:\\Users\\mch\\Desktop\\FYP\\FYP-MoeyChingWei\\backend\\backups\\database\\db_backup_2026-08-16T17-20-15.sql	\N	IN_PROGRESS	2026-08-16 17:20:15.888	\N	\N	\N
\.


--
-- Data for Name: budget_adjustment_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_adjustment_requests (id, "departmentId", reason, "requestType", "requestedAmount", "requestedAt", "requestedBy", "reviewNotes", "reviewedAt", "reviewedBy", status, "targetMonth", "targetYear") FROM stdin;
\.


--
-- Data for Name: budget_predictions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_predictions (id, "departmentId", "aiInsights", algorithm, "categoryBreakdown", "comparisonData", confidence, "createdAt", "predictedAmount", "targetMonth", "targetYear", "triggerType") FROM stdin;
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, "sessionId", role, content, metadata, "createdAt") FROM stdin;
577	1c288be9-0861-4a38-aed2-7ed206860260	user	What can you help me with?	\N	2026-08-08 10:17:54.586
578	1c288be9-0861-4a38-aed2-7ed206860260	assistant	Hello, Employee1! 👋 Welcome to OptiMind ERP! I'm your general assistant here to make your workday smoother. Here's a quick overview of what I can help you with:\n\n---\n\n### 📋 **Purchase Requests**\n- View your existing purchase requests\n- Create new purchase requests (walk you through it step-by-step)\n- Track the status of your requests\n\n### 📦 **Purchase Orders**\n- Check purchase orders across the system\n- Stay updated on order statuses\n\n### 📊 **Dashboard & Stats**\n- View department spending summaries\n- Get a snapshot of key metrics\n\n### 🔔 **Notifications**\n- Check your latest alerts and messages\n- Stay on top of approvals and updates\n\n### 🧭 **General Guidance**\n- Navigate the OptiMind system\n- Answer questions about features and workflows\n\n---\n\nWould you like me to pull up any of these right now? For example, I can quickly show you your recent purchase requests, notifications, or dashboard stats — just say the word! 😊	\N	2026-08-08 10:17:54.591
579	c4164f88-32fb-4991-91d0-639673484191	user	hi	\N	2026-08-09 03:47:29.242
580	c4164f88-32fb-4991-91d0-639673484191	assistant	Hello there, Employee1! 👋\n\nWelcome to **OptiMind ERP**! I'm your AI assistant, and I'm here to help you with anything you need. Here's a quick overview of what I can do:\n\n- 📋 **View & Create Purchase Requests** — Need to order something for the IT department? I've got you covered.\n- 📊 **Check Dashboard Stats** — Want to see spending summaries or order counts.\n- 📦 **Track Purchase Orders** — Keep an eye on your orders.\n- 🔔 **Check Notifications** — Stay updated on approvals and updates.\n- 📤 **Export Data** — Download purchase requests, orders, invoices, or supplier lists in CSV, JSON, PDF, or Excel format.\n\nSo, what can I help you with today?	\N	2026-08-09 03:47:29.261
\.


--
-- Data for Name: chat_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_sessions (id, "userId", title, "createdAt", "updatedAt") FROM stdin;
b6c6b078-e796-43f2-85ad-1e517974f55b	8	General Assistant Conversation	2026-08-08 06:39:42.025	2026-08-08 06:39:42.025
a37b6e5e-20ab-4274-b8cd-4933a8e8903b	8	General Assistant Conversation	2026-08-08 06:39:42.356	2026-08-08 06:39:42.356
13b6852b-b48f-47a6-9b6e-ccc0d4190785	8	General Assistant Conversation	2026-08-08 06:39:49.721	2026-08-08 06:39:49.721
78da5733-0ecc-451d-97e3-2fd68210a8e3	8	General Assistant Conversation	2026-08-08 06:42:55.189	2026-08-08 06:42:55.189
abe12ab4-a756-4c6b-9855-7d68c1c31d7f	8	General Assistant Conversation	2026-08-08 06:42:55.503	2026-08-08 06:42:55.503
688e9841-3f03-494b-82d3-9df77007afe1	8	General Assistant Conversation	2026-08-08 06:58:54.801	2026-08-08 06:58:54.801
2ca6dc2c-611b-4690-a1b6-3c0515d065b2	8	General Assistant Conversation	2026-08-08 06:58:55.122	2026-08-08 06:58:55.122
bcabd25b-8ef7-4301-93bb-c07fcabcc87c	8	General Assistant Conversation	2026-08-08 06:58:59.543	2026-08-08 06:58:59.543
d8adc183-b5c5-4024-9ce0-46234879027f	8	General Assistant Conversation	2026-08-08 06:58:59.859	2026-08-08 06:58:59.859
fa9e2f20-c4f0-4e17-ad62-5d3cc5d6c39c	8	New Conversation	2026-08-08 06:59:02.981	2026-08-08 06:59:02.981
de9280f8-f09e-433a-9ef4-215e940162e7	1	General Assistant Conversation	2026-08-08 07:09:37.491	2026-08-08 07:09:37.491
5fec6fe8-f188-4f99-aa6d-552d30e9f708	1	General Assistant Conversation	2026-08-08 07:09:37.8	2026-08-08 07:09:37.8
7af3023e-02a7-449d-8901-9468123b50df	1	General Assistant Conversation	2026-08-08 07:09:41.551	2026-08-08 07:09:41.551
f2378a79-e9fb-4d63-9603-ff1a30881d51	1	General Assistant Conversation	2026-08-08 07:09:41.87	2026-08-08 07:09:41.87
eab41890-902e-43be-815b-eb63662c8299	1	General Assistant Conversation	2026-08-08 07:28:18.673	2026-08-08 07:28:18.673
ab176b3c-c121-4ea4-9ea2-d40efa652006	1	General Assistant Conversation	2026-08-08 08:03:58.902	2026-08-08 08:03:58.902
faf5dc70-170c-481e-bd1d-cce84be68dfd	1	General Assistant Conversation	2026-08-08 08:06:36.61	2026-08-08 08:06:36.61
971ccec4-e18d-4d59-871d-c4938379f8bc	1	General Assistant Conversation	2026-08-08 08:06:36.924	2026-08-08 08:06:36.924
4dcfa72a-3801-4414-b573-5dc0a607e047	1	General Assistant Conversation	2026-08-08 08:06:49.535	2026-08-08 08:06:49.535
82e2631e-de68-468e-9f3c-2c3038a9def4	1	General Assistant Conversation	2026-08-08 08:14:19.97	2026-08-08 08:14:19.97
df5fdf8f-76ac-43c4-abe3-0563e39b1060	1	General Assistant Conversation	2026-08-08 08:14:20.281	2026-08-08 08:14:20.281
c474c345-af2d-41bd-a1f1-7f049631a240	1	General Assistant Conversation	2026-08-08 08:19:02.737	2026-08-08 08:19:02.737
2a970f9b-d0d4-485e-8734-773526d587ba	1	General Assistant Conversation	2026-08-08 08:42:00.121	2026-08-08 08:42:00.121
cb8f8124-a6a7-4059-aff0-bcd847360eae	1	General Assistant Conversation	2026-08-08 08:42:00.337	2026-08-08 08:42:00.337
f8199c78-1c50-4984-817e-d9eda9b24bc9	1	Purchase Expert Conversation	2026-08-08 08:42:11.562	2026-08-08 08:42:11.562
97d4801a-b329-4785-abf3-10fcd7d72e4b	1	Data Analyst Conversation	2026-08-08 08:42:13.303	2026-08-08 08:42:13.303
715cc563-74f2-41cf-bd8a-11c352a9a9b1	1	General Assistant Conversation	2026-08-08 08:42:14.333	2026-08-08 08:42:14.333
c8d22fef-361a-4b25-921f-d92ffa51bb52	1	General Assistant Conversation	2026-08-08 08:44:10.753	2026-08-08 08:44:10.753
9fa1824f-b4c0-4a64-a201-e12c331be727	1	General Assistant Conversation	2026-08-08 08:44:10.972	2026-08-08 08:44:10.972
525bd66b-3cd5-47c1-83b9-cc85c4cdd3ed	1	General Assistant Conversation	2026-08-08 09:11:25.65	2026-08-08 09:11:25.65
18c5300d-012d-4243-9dde-f3745de75154	1	General Assistant Conversation	2026-08-08 09:11:25.721	2026-08-08 09:11:25.721
d499491c-74b8-456f-98dd-14c1774ac18f	1	General Assistant Conversation	2026-08-08 09:40:22.615	2026-08-08 09:40:22.615
2bca5726-e442-4c40-8025-b9c7c233d5d0	1	General Assistant Conversation	2026-08-08 09:40:22.923	2026-08-08 09:40:22.923
9d82f724-463a-4819-8c36-1ce0180f6a80	1	General Assistant Conversation	2026-08-08 09:40:28.14	2026-08-08 09:40:28.14
6fa65e88-4734-48fe-98cd-a4518109c2c8	1	General Assistant Conversation	2026-08-08 09:40:56.462	2026-08-08 09:40:56.462
fdbf4f64-a4af-46b8-9fee-3092f2745c15	8	General Assistant Conversation	2026-08-08 09:41:19.672	2026-08-08 09:41:19.672
302162d6-b6fd-441c-8e9d-5e2ae891ac53	8	General Assistant Conversation	2026-08-08 09:43:47.546	2026-08-08 09:43:47.546
8713d657-6bc2-4302-a28d-07644043be71	8	General Assistant Conversation	2026-08-08 09:43:47.859	2026-08-08 09:43:47.859
f24afa09-9eb7-4177-add6-cecc23b25582	8	General Assistant Conversation	2026-08-08 09:47:12.662	2026-08-08 09:47:12.662
43a5105b-e43f-4dd8-9908-1708e766e515	8	General Assistant Conversation	2026-08-08 09:47:16.304	2026-08-08 09:47:16.304
db41026d-682d-4b02-b41e-fc1f8ca07c12	8	General Assistant Conversation	2026-08-08 10:17:45.326	2026-08-08 10:17:45.326
ed9e3346-3c18-4153-9abf-648fff069f0b	8	General Assistant Conversation	2026-08-08 10:17:47.02	2026-08-08 10:17:47.02
1c288be9-0861-4a38-aed2-7ed206860260	8	General Assistant Conversation	2026-08-08 10:17:47.025	2026-08-08 10:17:54.592
975f9575-7a16-40bb-b21f-f809e81a58d6	8	General Assistant Conversation	2026-08-08 10:18:01.401	2026-08-08 10:18:01.401
50c3a2b9-04ce-4849-a384-0e37cb426914	8	General Assistant Conversation	2026-08-08 10:18:01.629	2026-08-08 10:18:01.629
c73da322-9031-4213-8d83-86b19f9d1506	8	General Assistant Conversation	2026-08-08 06:39:49.723	2026-08-08 06:39:49.723
188e9fcb-9944-4893-80c0-57c347061bae	8	General Assistant Conversation	2026-08-08 06:43:12.87	2026-08-08 06:43:12.87
2c404d44-1ae0-4098-b0c9-135224038ebd	8	General Assistant Conversation	2026-08-08 06:43:13.069	2026-08-08 06:43:13.069
920f36a7-1022-4a51-86a1-0d424a37fc12	8	New Conversation	2026-08-08 06:59:02.983	2026-08-08 06:59:02.983
268a0d11-a938-4785-9b89-4dc517e1d7b7	1	General Assistant Conversation	2026-08-08 07:26:45.365	2026-08-08 07:26:45.365
c062e973-32da-455e-9eed-b8d2a93af8a5	1	General Assistant Conversation	2026-08-08 07:26:45.67	2026-08-08 07:26:45.67
6cff2368-2f71-4daf-93b1-9b59bb130946	1	General Assistant Conversation	2026-08-08 07:26:52.364	2026-08-08 07:26:52.364
2d1228e0-f19f-4a00-bf4b-94a279137cb0	1	General Assistant Conversation	2026-08-08 07:26:52.683	2026-08-08 07:26:52.683
d94a55dd-5cf6-4a37-8b6a-2a355abbc428	1	General Assistant Conversation	2026-08-08 07:28:18.683	2026-08-08 07:28:18.683
ae8d5604-b140-4c9a-89e2-f643a743a0fc	1	General Assistant Conversation	2026-08-08 08:03:58.908	2026-08-08 08:03:58.908
eac6dc68-4e7f-43f2-9920-5fc261411331	1	General Assistant Conversation	2026-08-08 08:06:49.677	2026-08-08 08:06:49.677
b99f22fb-2f95-48c6-a75b-e26db55d3d96	1	General Assistant Conversation	2026-08-08 08:14:48.323	2026-08-08 08:14:48.323
05713249-7b42-4df4-9cef-b8b0028674ba	1	General Assistant Conversation	2026-08-08 08:14:48.65	2026-08-08 08:14:48.65
d8c28e85-cd21-4ff8-ad02-fb2a713c1c5f	1	General Assistant Conversation	2026-08-08 08:14:57.793	2026-08-08 08:14:57.793
fa15d76b-6edb-4d26-9e56-e539e113c13b	1	General Assistant Conversation	2026-08-08 08:14:58.102	2026-08-08 08:14:58.102
0f66f008-1283-406b-b311-18da2f7357d5	1	General Assistant Conversation	2026-08-08 08:15:03.323	2026-08-08 08:15:03.323
e2bc0d5f-c83a-400e-b663-f747c25c1e9c	1	General Assistant Conversation	2026-08-08 08:15:03.639	2026-08-08 08:15:03.639
575dd080-a0cc-4a52-927a-2fc74c07544c	1	General Assistant Conversation	2026-08-08 08:19:02.74	2026-08-08 08:19:02.74
010d594c-168e-40ba-804f-585590090f94	1	General Assistant Conversation	2026-08-08 08:43:24.18	2026-08-08 08:43:24.18
d3128dd3-e305-40cb-92cc-219209f92b43	1	General Assistant Conversation	2026-08-08 08:43:24.301	2026-08-08 08:43:24.301
d8cc7491-686f-4f65-9c4b-639f95ed7d5d	1	General Assistant Conversation	2026-08-08 08:45:08.32	2026-08-08 08:45:08.32
ae2d0ad7-9f55-4db3-ada8-77dbdc8f2317	1	General Assistant Conversation	2026-08-08 08:45:08.442	2026-08-08 08:45:08.442
774e9091-7fa2-484f-9a1f-edc31187ecc2	1	General Assistant Conversation	2026-08-08 09:40:10.618	2026-08-08 09:40:10.618
8ccb9fa9-45ba-444c-97bc-efd852c71303	1	General Assistant Conversation	2026-08-08 09:40:10.678	2026-08-08 09:40:10.678
ba1bfe5e-1f1f-41dd-9469-b0619bc4a9a0	1	General Assistant Conversation	2026-08-08 09:40:28.141	2026-08-08 09:40:28.141
946a4217-6184-4b42-af83-6bf889859962	1	General Assistant Conversation	2026-08-08 09:40:50.056	2026-08-08 09:40:50.056
369920bb-f2b0-4ed5-a046-f81487d95488	1	General Assistant Conversation	2026-08-08 09:40:50.374	2026-08-08 09:40:50.374
b3e6e858-4bc5-4fc5-a24e-096906c5e843	1	General Assistant Conversation	2026-08-08 09:40:56.466	2026-08-08 09:40:56.466
00fd0a09-3c24-4ff1-8236-4b7589825d51	8	General Assistant Conversation	2026-08-08 09:41:19.671	2026-08-08 09:41:19.671
45f5c41f-e295-4b5f-ba06-ab90bd068808	8	General Assistant Conversation	2026-08-08 09:41:42.657	2026-08-08 09:41:42.657
674d19c4-26e0-4c65-939f-f6182722cd2c	8	General Assistant Conversation	2026-08-08 09:41:42.663	2026-08-08 09:41:42.663
095a35f3-e257-47db-99a4-9198a6e04cf4	8	General Assistant Conversation	2026-08-08 09:47:12.656	2026-08-08 09:47:12.656
1a901d52-271b-407e-83a3-06f7e217a5c4	8	General Assistant Conversation	2026-08-08 09:47:14.607	2026-08-08 09:47:14.607
267f52ed-c3b6-4ee7-acf7-e59a6155a8dc	8	General Assistant Conversation	2026-08-08 09:47:14.919	2026-08-08 09:47:14.919
aa7b6cfa-2ccc-41d2-a5fd-fe4256b0ce21	8	General Assistant Conversation	2026-08-08 09:47:16.305	2026-08-08 09:47:16.305
6a1d426f-0850-400c-80df-30eacf7d44fb	8	General Assistant Conversation	2026-08-08 10:17:44.926	2026-08-08 10:17:44.926
c4164f88-32fb-4991-91d0-639673484191	8	hi	2026-08-09 03:47:24.817	2026-08-09 03:47:29.262
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, code, name, description, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedbacks (id, "userId", type, description, status, "adminComment", "createdAt", "updatedAt") FROM stdin;
1	8	IMPROVEMENT	need to improve a lot	OPEN	\N	2026-04-20 17:51:04.943	2026-04-20 17:51:04.943
3	1	ISSUE	Improve Feature for AI	OPEN	\N	2026-08-06 09:41:55.273	2026-08-06 09:41:55.272
4	8	IMPROVEMENT	Testing for feedback	OPEN	\N	2026-08-08 09:38:09.042	2026-08-08 09:38:09.042
\.


--
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_attachments (id, "messageId", "fileName", "fileUrl", "fileType", "fileSize", "mimeType", "thumbnailUrl", "aiAnalysis", "uploadedAt", metadata) FROM stdin;
\.


--
-- Data for Name: monthly_budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monthly_budgets (id, "departmentId", "allocatedAmount", "createdAt", month, notes, "reservedAmount", "spentAmount", "updatedAt", year) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", title, message, type, channel, "refType", "refId", "isRead", "createdAt", "readAt") FROM stdin;
270	9	Purchase Request Pending Approval	PR-IT-20260808-001 submitted by Employee1 requires your approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	940	f	2026-08-08 05:47:50.894	\N
273	4	New Purchase Request Approval	PR-IT-20260808-001 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	d7816e66-d957-471a-af12-e068aaaf2c71	f	2026-08-08 06:40:58.432	\N
275	4	New Purchase Request Approval	PR-IT-20260808-002 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	b25cdc86-7952-4f24-8819-9305b7cb6abe	f	2026-08-08 06:41:04.8	\N
281	3	New Feedback Submitted	Employee1 submitted IMPROVEMENT feedback.	FEEDBACK	IN_APP	feedback	4	f	2026-08-08 09:38:09.05	\N
280	1	New Feedback Submitted	Employee1 submitted IMPROVEMENT feedback.	FEEDBACK	IN_APP	feedback	4	t	2026-08-08 09:38:09.05	2026-08-08 09:40:03.854
272	8	Purchase Request Generated	PR-IT-20260808-001 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	d7816e66-d957-471a-af12-e068aaaf2c71	t	2026-08-08 06:40:52.756	2026-08-08 09:41:12.632
274	8	Purchase Request Generated	PR-IT-20260808-002 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	b25cdc86-7952-4f24-8819-9305b7cb6abe	t	2026-08-08 06:41:01.862	2026-08-08 09:41:12.632
276	8	Purchase Request Generated	PR-20260808-8S0Z has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 06:41:07.739	2026-08-08 09:41:12.632
277	4	New Purchase Request Approval	PR-20260808-8S0Z has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 06:41:10.865	2026-08-08 09:42:03.683
284	6	New Order Acknowledge Request	PO-20260808-UDA6 needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	1eb67d36-5931-4dc5-9bf6-586a6b45f11d	t	2026-08-08 09:42:46.736	2026-08-08 09:43:17.629
289	6	Order Completed	PO-20260808-UDA6 has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	db611cf9-4615-4ac4-b29a-ccd63c9208e7	f	2026-08-08 09:43:45.317	\N
292	4	New Purchase Request Approval	PR-20260808-R3W7 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	4ae6bdaf-222e-4ffc-b09f-bde0d75068f8	f	2026-08-08 09:50:47.723	\N
296	4	New Purchase Request Approval	PR-20260808-SHZY has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	4140f0e3-8093-4b0a-844d-83f8d537db55	f	2026-08-08 10:12:28.768	\N
300	4	New Purchase Request Approval	PR-20260808-8CBP has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	78befccc-6444-453c-b912-18cc2b6a0909	f	2026-08-08 12:02:53.15	\N
304	4	New Purchase Request Approval	PR-20260808-G42N has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	6a61c7db-dd73-4193-8570-e49c67dd9159	f	2026-08-08 12:11:57.53	\N
308	4	New Purchase Request Approval	PR-TEST-001 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	test-pr-001	f	2026-08-08 12:24:28.865	\N
312	4	New Purchase Request Approval	PR-20260808-G42N has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	6a61c7db-dd73-4193-8570-e49c67dd9159	f	2026-08-08 12:28:33.86	\N
314	4	New Purchase Request Approval	PR-20260808-OWTW has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	168b832c-508e-4924-b60e-f406f08031e0	f	2026-08-08 12:28:40.071	\N
316	4	New Purchase Request Approval	PR-20260808-Y24Z has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	79968a97-7bf2-4074-8ddc-6cf9db2a3a00	f	2026-08-08 12:28:46.149	\N
269	3	New Feedback Submitted	Super Admin submitted ISSUE feedback.	FEEDBACK	IN_APP	feedback	3	f	2026-08-06 09:41:55.28	\N
268	1	New Feedback Submitted	Super Admin submitted ISSUE feedback.	FEEDBACK	IN_APP	feedback	3	t	2026-08-06 09:41:55.28	2026-08-06 09:42:52.736
50	6	Delivery Updated	PO-20260420-C36X delivery status changed from PENDING_DELIVERY to DELIVERED.	SUPPLIER_UPDATE	IN_APP	delivery	32eb2489-a03b-4239-bbd4-76f54f695594	t	2026-04-20 09:41:09.007	2026-08-07 13:28:33.835
271	9	Purchase Request Pending Approval	PR-IT-20260808-002 submitted by Employee1 requires your approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	941	f	2026-08-08 05:54:15.639	\N
279	4	New Purchase Request Approval	PR-20260808-P61L has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	092c8712-95f8-4409-9085-6f195bb8cd06	t	2026-08-08 09:33:27.659	2026-08-08 09:33:48.424
278	8	Purchase Request Generated	PR-20260808-P61L has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	092c8712-95f8-4409-9085-6f195bb8cd06	t	2026-08-08 09:33:24.085	2026-08-08 09:34:00.997
86	3	New Feedback Submitted	Employee1 submitted IMPROVEMENT feedback.	FEEDBACK	IN_APP	feedback	1	f	2026-04-20 17:51:04.956	\N
283	9	New Purchase Order Approval	PO-20260808-UDA6 has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	3c5900a7-424e-4dcf-8859-7a996c512645	t	2026-08-08 09:42:10.142	2026-08-08 09:42:39.988
288	8	Order Delivered	DLV-20260808-QX91 has been delivered by supplier. Please collect your parcel and verify the order in system.	REQUESTER_UPDATE	IN_APP	tracking-item	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 09:43:21.082	2026-08-08 09:43:29.719
294	4	New Purchase Request Approval	PR-20260808-Y24Z has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	79968a97-7bf2-4074-8ddc-6cf9db2a3a00	f	2026-08-08 10:01:06.049	\N
298	4	New Purchase Request Approval	PR-20260808-OWTW has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	168b832c-508e-4924-b60e-f406f08031e0	f	2026-08-08 10:15:31.393	\N
302	4	New Purchase Request Approval	PR-20260808-M39M has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	f1c23884-2685-4583-863a-f150a88a53f3	f	2026-08-08 12:03:30.392	\N
306	4	New Purchase Request Approval	PR-TEST-001 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	test-pr-001	f	2026-08-08 12:22:00.704	\N
310	4	New Purchase Request Approval	PR-TEST-002 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	test-pr-002	f	2026-08-08 12:24:49.854	\N
318	4	New Purchase Request Approval	PR-IT-20260808-002 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	b25cdc86-7952-4f24-8819-9305b7cb6abe	f	2026-08-08 12:28:52.159	\N
320	4	New Purchase Request Approval	PR-20260808-P61L has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	092c8712-95f8-4409-9085-6f195bb8cd06	f	2026-08-08 12:28:58.011	\N
322	4	New Purchase Request Approval	PR-IT-20260808-001 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	d7816e66-d957-471a-af12-e068aaaf2c71	f	2026-08-08 12:29:03.79	\N
324	4	New Purchase Request Approval	PR-20260808-R3W7 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	4ae6bdaf-222e-4ffc-b09f-bde0d75068f8	f	2026-08-08 12:29:09.62	\N
326	4	New Purchase Request Approval	PR-20260808-SHZY has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	4140f0e3-8093-4b0a-844d-83f8d537db55	f	2026-08-08 12:29:15.312	\N
328	4	New Purchase Request Approval	PR-20260808-8CBP has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	78befccc-6444-453c-b912-18cc2b6a0909	f	2026-08-08 12:29:21.127	\N
330	4	New Purchase Request Approval	PR-20260808-M39M has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	f1c23884-2685-4583-863a-f150a88a53f3	f	2026-08-08 12:29:26.822	\N
332	4	New Purchase Request Approval	PR-20260808-Z4Z3 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	fe86caa3-bde8-4af1-b559-c260a420be81	f	2026-08-08 12:29:32.739	\N
334	4	New Purchase Request Approval	PR-TEST-002 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	test-pr-002	f	2026-08-08 17:35:25.038	\N
336	4	New Purchase Request Approval	PR-20260808-G42N has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	6a61c7db-dd73-4193-8570-e49c67dd9159	f	2026-08-08 17:35:30.901	\N
338	4	New Purchase Request Approval	PR-20260808-OWTW has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	168b832c-508e-4924-b60e-f406f08031e0	f	2026-08-08 17:35:36.973	\N
340	4	New Purchase Request Approval	PR-20260808-Y24Z has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	79968a97-7bf2-4074-8ddc-6cf9db2a3a00	f	2026-08-08 17:35:42.862	\N
342	4	New Purchase Request Approval	PR-IT-20260808-002 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	b25cdc86-7952-4f24-8819-9305b7cb6abe	f	2026-08-08 17:35:48.637	\N
344	4	New Purchase Request Approval	PR-20260808-P61L has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	092c8712-95f8-4409-9085-6f195bb8cd06	f	2026-08-08 17:35:54.393	\N
346	4	New Purchase Request Approval	PR-IT-20260808-001 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	d7816e66-d957-471a-af12-e068aaaf2c71	f	2026-08-08 17:36:00.241	\N
348	4	New Purchase Request Approval	PR-20260808-R3W7 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	4ae6bdaf-222e-4ffc-b09f-bde0d75068f8	f	2026-08-08 17:36:05.935	\N
350	4	New Purchase Request Approval	PR-20260808-SHZY has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	4140f0e3-8093-4b0a-844d-83f8d537db55	f	2026-08-08 17:36:11.499	\N
352	4	New Purchase Request Approval	PR-20260808-8CBP has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	78befccc-6444-453c-b912-18cc2b6a0909	f	2026-08-08 17:36:17.225	\N
354	4	New Purchase Request Approval	PR-20260808-M39M has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	f1c23884-2685-4583-863a-f150a88a53f3	f	2026-08-08 17:36:22.891	\N
356	4	New Purchase Request Approval	PR-20260808-Z4Z3 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	fe86caa3-bde8-4af1-b559-c260a420be81	f	2026-08-08 17:36:29.087	\N
358	4	New Purchase Request Approval	PR-20260809-BQS4 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	cc4e4340-9e5a-47da-bbd0-c70c625381cb	f	2026-08-08 17:36:34.833	\N
360	4	New Purchase Request Approval	PR-20260809-8RA1 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	63c18ae6-2b16-4ff8-92e2-5d33f917c0a7	f	2026-08-09 03:54:10.821	\N
362	4	New Purchase Request Approval	PR-20260809-HWU0 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	f4c01707-f9ba-45f2-bcd1-06bc2f5c216b	f	2026-08-09 04:05:12.169	\N
286	8	Order Acknowledged By Supplier	PO-20260808-UDA6 was acknowledged by Ah Wei (Supplier). Please wait for delivery.	REQUESTER_UPDATE	IN_APP	tracking-item	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 09:43:19.537	2026-08-15 07:13:44.565
291	8	Purchase Request Generated	PR-20260808-R3W7 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	4ae6bdaf-222e-4ffc-b09f-bde0d75068f8	t	2026-08-08 09:50:44.452	2026-08-15 07:13:44.565
295	8	Purchase Request Generated	PR-20260808-SHZY has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	4140f0e3-8093-4b0a-844d-83f8d537db55	t	2026-08-08 10:12:24.94	2026-08-15 07:13:44.565
299	8	Purchase Request Generated	PR-20260808-8CBP has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	78befccc-6444-453c-b912-18cc2b6a0909	t	2026-08-08 12:02:49.709	2026-08-15 07:13:44.565
303	8	Purchase Request Generated	PR-20260808-G42N has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	6a61c7db-dd73-4193-8570-e49c67dd9159	t	2026-08-08 12:11:54.318	2026-08-15 07:13:44.565
307	8	Purchase Request Generated	PR-TEST-001 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	test-pr-001	t	2026-08-08 12:24:25.801	2026-08-15 07:13:44.565
311	8	Purchase Request Generated	PR-20260808-G42N has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	6a61c7db-dd73-4193-8570-e49c67dd9159	t	2026-08-08 12:28:28.97	2026-08-15 07:13:44.565
313	8	Purchase Request Generated	PR-20260808-OWTW has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	168b832c-508e-4924-b60e-f406f08031e0	t	2026-08-08 12:28:37.084	2026-08-15 07:13:44.565
315	8	Purchase Request Generated	PR-20260808-Y24Z has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	79968a97-7bf2-4074-8ddc-6cf9db2a3a00	t	2026-08-08 12:28:43.159	2026-08-15 07:13:44.565
282	8	Purchase Request Approved	PR-20260808-8S0Z is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 09:42:05.869	2026-08-15 07:13:44.565
285	8	Purchase Order Approved	Manager approved PO-20260808-UDA6. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 09:42:46.739	2026-08-15 07:13:44.565
287	8	Supplier Started New Delivery	DLV-20260808-QX91 has a new pending delivery submitted by supplier. You can track progress in Tracking Item.	REQUESTER_UPDATE	IN_APP	tracking-item	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 09:43:19.54	2026-08-15 07:13:44.565
290	8	Item Completed	PO-20260808-UDA6 is completed. Your requested item flow has finished.	REQUESTER_UPDATE	IN_APP	tracking-item	2b2aa733-4b05-4133-873d-5a91ba3b7861	t	2026-08-08 09:43:52.242	2026-08-15 07:13:44.565
293	8	Purchase Request Generated	PR-20260808-Y24Z has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	79968a97-7bf2-4074-8ddc-6cf9db2a3a00	t	2026-08-08 10:01:02.261	2026-08-15 07:13:44.565
297	8	Purchase Request Generated	PR-20260808-OWTW has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	168b832c-508e-4924-b60e-f406f08031e0	t	2026-08-08 10:15:27.968	2026-08-15 07:13:44.565
301	8	Purchase Request Generated	PR-20260808-M39M has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	f1c23884-2685-4583-863a-f150a88a53f3	t	2026-08-08 12:03:27.395	2026-08-15 07:13:44.565
305	8	Purchase Request Generated	PR-TEST-001 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	test-pr-001	t	2026-08-08 12:21:56.293	2026-08-15 07:13:44.565
309	8	Purchase Request Generated	PR-TEST-002 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	test-pr-002	t	2026-08-08 12:24:46.706	2026-08-15 07:13:44.565
317	8	Purchase Request Generated	PR-IT-20260808-002 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	b25cdc86-7952-4f24-8819-9305b7cb6abe	t	2026-08-08 12:28:49.187	2026-08-15 07:13:44.565
319	8	Purchase Request Generated	PR-20260808-P61L has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	092c8712-95f8-4409-9085-6f195bb8cd06	t	2026-08-08 12:28:54.939	2026-08-15 07:13:44.565
321	8	Purchase Request Generated	PR-IT-20260808-001 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	d7816e66-d957-471a-af12-e068aaaf2c71	t	2026-08-08 12:29:00.989	2026-08-15 07:13:44.565
323	8	Purchase Request Generated	PR-20260808-R3W7 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	4ae6bdaf-222e-4ffc-b09f-bde0d75068f8	t	2026-08-08 12:29:06.755	2026-08-15 07:13:44.565
325	8	Purchase Request Generated	PR-20260808-SHZY has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	4140f0e3-8093-4b0a-844d-83f8d537db55	t	2026-08-08 12:29:12.289	2026-08-15 07:13:44.565
327	8	Purchase Request Generated	PR-20260808-8CBP has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	78befccc-6444-453c-b912-18cc2b6a0909	t	2026-08-08 12:29:18.16	2026-08-15 07:13:44.565
329	8	Purchase Request Generated	PR-20260808-M39M has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	f1c23884-2685-4583-863a-f150a88a53f3	t	2026-08-08 12:29:23.98	2026-08-15 07:13:44.565
331	8	Purchase Request Generated	PR-20260808-Z4Z3 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	fe86caa3-bde8-4af1-b559-c260a420be81	t	2026-08-08 12:29:29.84	2026-08-15 07:13:44.565
333	8	Purchase Request Generated	PR-TEST-002 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	test-pr-002	t	2026-08-08 17:35:21.721	2026-08-15 07:13:44.565
335	8	Purchase Request Generated	PR-20260808-G42N has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	6a61c7db-dd73-4193-8570-e49c67dd9159	t	2026-08-08 17:35:27.998	2026-08-15 07:13:44.565
337	8	Purchase Request Generated	PR-20260808-OWTW has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	168b832c-508e-4924-b60e-f406f08031e0	t	2026-08-08 17:35:33.904	2026-08-15 07:13:44.565
339	8	Purchase Request Generated	PR-20260808-Y24Z has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	79968a97-7bf2-4074-8ddc-6cf9db2a3a00	t	2026-08-08 17:35:39.992	2026-08-15 07:13:44.565
341	8	Purchase Request Generated	PR-IT-20260808-002 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	b25cdc86-7952-4f24-8819-9305b7cb6abe	t	2026-08-08 17:35:45.709	2026-08-15 07:13:44.565
343	8	Purchase Request Generated	PR-20260808-P61L has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	092c8712-95f8-4409-9085-6f195bb8cd06	t	2026-08-08 17:35:51.519	2026-08-15 07:13:44.565
345	8	Purchase Request Generated	PR-IT-20260808-001 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	d7816e66-d957-471a-af12-e068aaaf2c71	t	2026-08-08 17:35:57.283	2026-08-15 07:13:44.565
347	8	Purchase Request Generated	PR-20260808-R3W7 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	4ae6bdaf-222e-4ffc-b09f-bde0d75068f8	t	2026-08-08 17:36:03.191	2026-08-15 07:13:44.565
349	8	Purchase Request Generated	PR-20260808-SHZY has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	4140f0e3-8093-4b0a-844d-83f8d537db55	t	2026-08-08 17:36:08.654	2026-08-15 07:13:44.565
351	8	Purchase Request Generated	PR-20260808-8CBP has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	78befccc-6444-453c-b912-18cc2b6a0909	t	2026-08-08 17:36:14.292	2026-08-15 07:13:44.565
353	8	Purchase Request Generated	PR-20260808-M39M has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	f1c23884-2685-4583-863a-f150a88a53f3	t	2026-08-08 17:36:19.927	2026-08-15 07:13:44.565
355	8	Purchase Request Generated	PR-20260808-Z4Z3 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	fe86caa3-bde8-4af1-b559-c260a420be81	t	2026-08-08 17:36:25.885	2026-08-15 07:13:44.565
357	8	Purchase Request Generated	PR-20260809-BQS4 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	cc4e4340-9e5a-47da-bbd0-c70c625381cb	t	2026-08-08 17:36:31.963	2026-08-15 07:13:44.565
359	8	Purchase Request Generated	PR-20260809-8RA1 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	63c18ae6-2b16-4ff8-92e2-5d33f917c0a7	t	2026-08-09 03:54:10.811	2026-08-15 07:13:44.565
361	8	Purchase Request Generated	PR-20260809-HWU0 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	f4c01707-f9ba-45f2-bcd1-06bc2f5c216b	t	2026-08-09 04:05:08.728	2026-08-15 07:13:44.565
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
-- Data for Name: purchase_order_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchase_request_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_request_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: purchasing_lookups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchasing_lookups (id, kind, value, "createdAt") FROM stdin;
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
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 40, true);


--
-- Name: backup_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.backup_history_id_seq', 9, true);


--
-- Name: budget_adjustment_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_adjustment_requests_id_seq', 1, false);


--
-- Name: budget_predictions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budget_predictions_id_seq', 1, false);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 580, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 1, false);


--
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedbacks_id_seq', 4, true);


--
-- Name: monthly_budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monthly_budgets_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 362, true);


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_codes_id_seq', 22, true);


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

SELECT pg_catalog.setval('public.users_id_seq', 157, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: budget_adjustment_requests budget_adjustment_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_adjustment_requests
    ADD CONSTRAINT budget_adjustment_requests_pkey PRIMARY KEY (id);


--
-- Name: budget_predictions budget_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_predictions
    ADD CONSTRAINT budget_predictions_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: monthly_budgets monthly_budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budgets
    ADD CONSTRAINT monthly_budgets_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: budget_adjustment_requests_departmentId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_adjustment_requests_departmentId_status_idx" ON public.budget_adjustment_requests USING btree ("departmentId", status);


--
-- Name: budget_adjustment_requests_status_requestedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_adjustment_requests_status_requestedAt_idx" ON public.budget_adjustment_requests USING btree (status, "requestedAt");


--
-- Name: budget_predictions_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_predictions_createdAt_idx" ON public.budget_predictions USING btree ("createdAt");


--
-- Name: budget_predictions_departmentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_predictions_departmentId_idx" ON public.budget_predictions USING btree ("departmentId");


--
-- Name: budget_predictions_targetYear_targetMonth_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "budget_predictions_targetYear_targetMonth_idx" ON public.budget_predictions USING btree ("targetYear", "targetMonth");


--
-- Name: departments_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX departments_code_idx ON public.departments USING btree (code);


--
-- Name: departments_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX departments_code_key ON public.departments USING btree (code);


--
-- Name: departments_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "departments_isActive_idx" ON public.departments USING btree ("isActive");


--
-- Name: monthly_budgets_departmentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "monthly_budgets_departmentId_idx" ON public.monthly_budgets USING btree ("departmentId");


--
-- Name: monthly_budgets_departmentId_year_month_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "monthly_budgets_departmentId_year_month_key" ON public.monthly_budgets USING btree ("departmentId", year, month);


--
-- Name: monthly_budgets_year_month_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX monthly_budgets_year_month_idx ON public.monthly_budgets USING btree (year, month);


--
-- Name: budget_adjustment_requests budget_adjustment_requests_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_adjustment_requests
    ADD CONSTRAINT "budget_adjustment_requests_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget_adjustment_requests budget_adjustment_requests_requestedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_adjustment_requests
    ADD CONSTRAINT "budget_adjustment_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget_adjustment_requests budget_adjustment_requests_reviewedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_adjustment_requests
    ADD CONSTRAINT "budget_adjustment_requests_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: budget_predictions budget_predictions_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_predictions
    ADD CONSTRAINT "budget_predictions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: monthly_budgets monthly_budgets_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budgets
    ADD CONSTRAINT "monthly_budgets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict NeM5VPryhDHYBygKuFMAlgXWlerDRxcgXtuIojUyGwcj5A17HCKVu6VVJfsxRpu

