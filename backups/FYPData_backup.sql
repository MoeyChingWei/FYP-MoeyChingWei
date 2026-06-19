--
-- PostgreSQL database dump
--

\restrict 4ZeFgrIJaePrW0YbhN7V8dMphpoq5RxWXAdFCqLrtNJliCtpYenpWhasRwbBlrD

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
    "isActive" boolean DEFAULT true NOT NULL
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
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks ALTER COLUMN id SET DEFAULT nextval('public.feedbacks_id_seq'::regclass);


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
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedbacks (id, "userId", type, description, status, "adminComment", "createdAt", "updatedAt") FROM stdin;
1	8	IMPROVEMENT	need to improve a lot	OPEN	\N	2026-04-20 17:51:04.943	2026-04-20 17:51:04.943
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", title, message, type, channel, "refType", "refId", "isRead", "createdAt", "readAt") FROM stdin;
176	8	Purchase Request Generated	PR-20260507-8UGL has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	8bd39b3a-fad0-4a4e-8346-8b3c9fb35658	f	2026-05-07 02:41:17.304	\N
177	4	New Purchase Request Approval	PR-20260507-8UGL has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	8bd39b3a-fad0-4a4e-8346-8b3c9fb35658	f	2026-05-07 02:41:20.551	\N
2	4	New Purchase Request Approval	PR-20260420-664O is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	3b80c1c6-bc4a-4e83-a029-370e7637c925	t	2026-04-20 07:58:55.992	2026-04-20 08:04:56.348
186	4	New Purchase Request Approval	PR-20260507-M9W5 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	1e1f4e35-6c74-4de1-8a45-42f0152d2af5	f	2026-05-07 02:52:24.687	\N
196	8	Purchase Request Rejected	PR-20260507-UGT4 was rejected. Rejected by: Unknown approver. Description: Reject the Purchase Request	REQUESTER_UPDATE	IN_APP	tracking-item	2db74a88-cb52-4784-adbe-5d1f35739e11	f	2026-05-07 02:55:56.367	\N
218	8	Purchase Order Approved	Manager approved PO-20260507-LR5H. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 02:59:12.384	\N
219	8	Purchase Order Approved	Manager approved PO-20260507-MVEO. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 02:59:15.577	\N
220	6	New Order Acknowledge Request	PO-20260507-AMMY needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	9c6630e5-67a6-44d2-bb1d-fd3bcb0ec0b3	f	2026-05-07 02:59:17.964	\N
5	4	New Purchase Request Approval	PR-20260420-PYGG is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	328f2408-b3b6-4573-a39b-71ef2fdbe7ca	t	2026-04-20 08:17:11.815	2026-04-20 08:18:22.938
221	8	Purchase Order Approved	Manager approved PO-20260507-AMMY. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	5347f4f6-d6ab-4be0-8968-423080e44fa5	f	2026-05-07 02:59:19.009	\N
222	8	Purchase Order Approved	Manager approved PO-20260507-S1S1. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	1e1f4e35-6c74-4de1-8a45-42f0152d2af5	f	2026-05-07 02:59:21.608	\N
223	6	New Order Acknowledge Request	PO-20260507-MVEO needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	4ff3252e-792b-481a-93f6-4db515554699	f	2026-05-07 02:59:23.913	\N
224	6	New Order Acknowledge Request	PO-20260507-IER4 needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	4124ce26-b95b-4cda-8b5a-38c3f424e1bb	f	2026-05-07 02:59:25.844	\N
241	6	Discrepancy Reported	PO-20260507-MVEO has a discrepancy. Description: Discrenpancy	SUPPLIER_UPDATE	IN_APP	grn	5fc7b9a2-4ca4-4cf1-ac8c-473391a72bce	f	2026-05-07 03:02:13.314	\N
242	6	Order Completed	PO-20260507-LR5H has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	e98bcb54-e625-4ab2-8bdb-c566ab40a8b7	f	2026-05-07 03:02:17.567	\N
10	6	New Order Acknowledge Request	PO-20260420-DXT9 needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	aba3f255-e089-4f4d-bda6-2dcd2a3d1115	t	2026-04-20 08:19:34.999	2026-04-20 08:26:05.054
243	8	GRN Discrepancy Detected	PO-20260507-MVEO has a discrepancy. Please check Tracking Item for follow-up.	REQUESTER_UPDATE	IN_APP	tracking-item	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 03:02:19.467	\N
244	8	Item Completed	PO-20260507-LR5H is completed. Your requested item flow has finished.	REQUESTER_UPDATE	IN_APP	tracking-item	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 03:02:24.41	\N
13	4	New Purchase Request Approval	PR-20260420-R9L8 is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	61826ffa-5e2c-4d74-8b47-449ed48286e6	t	2026-04-20 08:31:11.965	2026-04-20 08:31:57.397
250	8	Purchase Order Approved	Manager approved PO-20260507-XEZJ. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:40:52.468	\N
251	7	New Order Acknowledge Request	PO-20260507-XEZJ needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	52bfde61-2622-45ff-8e41-da494ee4e246	f	2026-05-07 07:40:58.296	\N
258	8	Order Acknowledged By Supplier	PO-20260507-XEZJ was acknowledged by Ah Wei (Supplier). Please wait for delivery.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:45:32.163	\N
9	4	Purchase Order Updated	PO-20260420-DXT9 changed from DRAFT to SUBMITTED.	REQUESTER_UPDATE	IN_APP	purchase-order	c4a11998-f372-4f31-b724-a4b28a2bd588	t	2026-04-20 08:18:50.922	2026-04-20 08:32:52.796
11	4	Purchase Order Updated	PO-20260420-DXT9 changed from SUBMITTED to APPROVED.	REQUESTER_UPDATE	IN_APP	purchase-order	c4a11998-f372-4f31-b724-a4b28a2bd588	t	2026-04-20 08:19:35.013	2026-04-20 08:32:52.796
16	4	Purchase Order Updated	PO-20260420-QBEP changed from DRAFT to SUBMITTED.	REQUESTER_UPDATE	IN_APP	purchase-order	ea5de7cc-ca61-4f33-bcb0-059c2f9c3513	t	2026-04-20 08:32:10.988	2026-04-20 08:32:52.796
18	4	Purchase Order Updated	PO-20260420-QBEP changed from SUBMITTED to APPROVED.	REQUESTER_UPDATE	IN_APP	purchase-order	ea5de7cc-ca61-4f33-bcb0-059c2f9c3513	t	2026-04-20 08:33:05.359	2026-04-20 08:33:16.523
17	6	New Order Acknowledge Request	PO-20260420-QBEP needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	5f2bd2aa-8faa-4d69-bfb8-c27fd570d303	t	2026-04-20 08:33:05.342	2026-04-20 08:46:40.969
24	6	New Order Acknowledge Request	PO-20260420-BV5L needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	591067fe-6dd7-44f5-8144-f1de4fae5fac	t	2026-04-20 08:51:12.402	2026-04-20 08:52:47.481
30	4	New Purchase Request Approval	PR-20260420-4YKZ is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	46387d94-8ba3-4c45-b585-cfe93f7556e6	t	2026-04-20 09:16:57.73	2026-04-20 09:18:00.35
34	6	New Order Acknowledge Request	PO-20260420-S278 needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	1ddd52a1-4d30-4c27-8095-48c227a74aef	t	2026-04-20 09:18:32.791	2026-04-20 09:30:04.422
178	8	Purchase Request Generated	PR-20260507-X7QN has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	de53a199-9459-41b2-9803-cb1ddb1985c0	t	2026-05-07 02:42:55.552	2026-05-07 02:43:58.863
71	4	New Purchase Request Approval	PR-20260421-ZX39 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	babe09ab-6b45-488c-b3bb-e7efb2656830	t	2026-04-20 17:39:13.143	2026-04-20 17:39:43.833
187	8	Purchase Request Generated	PR-20260507-4SCM has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	5347f4f6-d6ab-4be0-8968-423080e44fa5	f	2026-05-07 02:52:55.212	\N
74	6	New Order Acknowledge Request	PO-20260421-4TGL needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	2a3f218c-6362-4eff-bc33-d1bf0ef1ffdc	t	2026-04-20 17:40:07.947	2026-04-20 17:40:53.188
20	4	New Purchase Request Approval	PR-20260420-0NBV is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	6a1fb5bd-17eb-41d4-8ece-abf13d246286	t	2026-04-20 08:50:02.138	2026-04-20 09:39:27.667
23	4	Purchase Order Updated	PO-20260420-BV5L changed from DRAFT to SUBMITTED.	REQUESTER_UPDATE	IN_APP	purchase-order	5c8f4b59-3889-4e04-ad12-74b7239ea2c9	t	2026-04-20 08:50:48.401	2026-04-20 09:39:27.667
25	4	Purchase Order Updated	PO-20260420-BV5L changed from SUBMITTED to APPROVED.	REQUESTER_UPDATE	IN_APP	purchase-order	5c8f4b59-3889-4e04-ad12-74b7239ea2c9	t	2026-04-20 08:51:12.409	2026-04-20 09:39:27.667
33	4	Purchase Order Updated	PO-20260420-S278 changed from DRAFT to SUBMITTED.	REQUESTER_UPDATE	IN_APP	purchase-order	a26567e8-dbeb-463a-bed1-71d76250b315	t	2026-04-20 09:18:10.685	2026-04-20 09:39:27.667
35	4	Purchase Order Updated	PO-20260420-S278 changed from SUBMITTED to APPROVED.	REQUESTER_UPDATE	IN_APP	purchase-order	a26567e8-dbeb-463a-bed1-71d76250b315	t	2026-04-20 09:18:32.807	2026-04-20 09:39:27.667
37	4	New Purchase Request Approval	PR-20260420-CHC5 is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	c4a4b896-5a29-4e43-a846-03c87705a676	t	2026-04-20 09:33:52.089	2026-04-20 09:39:27.667
40	4	Purchase Order Updated	PO-20260420-S278 changed from APPROVED to SUBMITTED.	REQUESTER_UPDATE	IN_APP	purchase-order	a26567e8-dbeb-463a-bed1-71d76250b315	t	2026-04-20 09:34:48.247	2026-04-20 09:39:27.667
41	4	Purchase Order Updated	PO-20260420-S278 changed from SUBMITTED to APPROVED.	REQUESTER_UPDATE	IN_APP	purchase-order	a26567e8-dbeb-463a-bed1-71d76250b315	t	2026-04-20 09:35:14.638	2026-04-20 09:39:27.667
43	4	New Purchase Request Approval	PR-20260420-SG80 is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	84989cbc-a43e-41c1-b307-b69962a2dcfe	t	2026-04-20 09:39:25.404	2026-04-20 09:39:27.667
197	8	Purchase Request Approved	PR-20260507-7J6W is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 02:56:15.679	\N
199	8	Purchase Request Approved	PR-20260507-4SCM is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	5347f4f6-d6ab-4be0-8968-423080e44fa5	f	2026-05-07 02:56:23.966	\N
201	8	Purchase Request Approved	PR-20260507-9VKH is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	301eaca4-2456-40f2-a5a3-6a143d21891a	f	2026-05-07 02:56:28.545	\N
86	3	New Feedback Submitted	Employee1 submitted IMPROVEMENT feedback.	FEEDBACK	IN_APP	feedback	1	f	2026-04-20 17:51:04.956	\N
203	8	Purchase Request Approved	PR-20260507-IPP2 is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	5f812150-2dfc-4fde-b50c-b4a1bd1f47ee	f	2026-05-07 02:56:33.86	\N
47	6	New Order Acknowledge Request	PO-20260420-C36X needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	4f94182c-f7b7-4248-afd8-54157c0091ff	t	2026-04-20 09:39:54.582	2026-04-20 09:40:29.44
205	8	Purchase Request Approved	PR-20260423-VBTU is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	381fb48d-50f2-4593-85c7-91c5324534d1	f	2026-05-07 02:56:38.677	\N
50	6	Delivery Updated	PO-20260420-C36X delivery status changed from PENDING_DELIVERY to DELIVERED.	SUPPLIER_UPDATE	IN_APP	delivery	32eb2489-a03b-4239-bbd4-76f54f695594	t	2026-04-20 09:41:09.007	2026-04-20 09:41:16.463
48	4	Purchase Order Updated	PO-20260420-C36X changed from SUBMITTED to APPROVED.	REQUESTER_UPDATE	IN_APP	purchase-order	131c7738-df38-4f1b-a70a-dd2fbb6d8c8a	t	2026-04-20 09:39:54.616	2026-04-20 09:41:22.049
225	8	Purchase Order Approved	Manager approved PO-20260507-0VQ7. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	89c4e153-3863-41eb-96d0-ea87f65f8ace	f	2026-05-07 02:59:25.969	\N
226	8	Purchase Order Approved	Manager approved PO-20260507-IER4. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	381fb48d-50f2-4593-85c7-91c5324534d1	f	2026-05-07 02:59:29.819	\N
227	6	New Order Acknowledge Request	PO-20260507-LR5H needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	aa0782fa-f553-49de-ad9c-def41e15f19a	f	2026-05-07 02:59:31.203	\N
228	6	New Order Acknowledge Request	PO-20260507-0VQ7 needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	0802ea3e-e63b-4b0c-8a17-93dd64a0947d	f	2026-05-07 02:59:31.801	\N
206	9	New Purchase Order Approval	PO-20260507-IER4 has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	2956b1ae-970b-4f0d-814b-158ea1ebccb7	t	2026-05-07 02:56:42.97	2026-05-07 07:40:24.651
207	9	New Purchase Order Approval	PO-20260507-0VQ7 has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	f98f1d87-6f1f-47d0-b3bf-2f865385bce8	t	2026-05-07 02:56:49.663	2026-05-07 07:40:24.651
52	6	GRN Updated	PO-20260420-C36X grn status changed from PENDING_GRN to COMPLETED.	SUPPLIER_UPDATE	IN_APP	grn	02d50ac5-3826-4a6e-824c-e6de2b2aa1f9	t	2026-04-20 09:41:41.855	2026-04-20 09:41:50.779
57	4	New Purchase Request Approval	PR-20260420-C3BJ has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	604f03bf-9a0a-4777-a65f-1243025b17bc	t	2026-04-20 10:41:22.746	2026-04-20 10:44:11.826
60	6	New Order Acknowledge Request	PO-20260420-160P needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	ff067ce6-fff2-4536-9d73-4d3fa9c935cb	t	2026-04-20 10:45:20.2	2026-04-20 10:57:09.976
46	4	Purchase Order Updated	PO-20260420-C36X changed from DRAFT to SUBMITTED.	REQUESTER_UPDATE	IN_APP	purchase-order	131c7738-df38-4f1b-a70a-dd2fbb6d8c8a	t	2026-04-20 09:39:42.005	2026-04-20 17:31:58.519
54	4	Purchase Request Created	PR-20260420-ZN1B was created successfully.	REQUESTER_CREATED	IN_APP	tracking-item	d3615077-c095-4914-a32f-59a880275463	t	2026-04-20 09:42:51.328	2026-04-20 17:31:58.519
55	4	New Purchase Request Approval	PR-20260420-ZN1B is waiting for approval.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	d3615077-c095-4914-a32f-59a880275463	t	2026-04-20 09:42:54.41	2026-04-20 17:31:58.519
61	4	Purchase Order Approved	Manager approved PO-20260420-160P. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	604f03bf-9a0a-4777-a65f-1243025b17bc	t	2026-04-20 10:45:20.208	2026-04-20 17:31:58.519
66	4	New Purchase Request Approval	PR-20260421-JQU1 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	51bfb7a9-f13b-418c-a037-42ca03cccbd0	t	2026-04-20 17:31:11.727	2026-04-20 17:31:58.519
83	6	Order Completed	PO-20260421-4TGL has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	90d4d863-40e0-4807-9444-35c40ba88ce9	t	2026-04-20 17:48:15.571	2026-04-30 21:00:34.137
179	8	Purchase Request Generated	PR-20260507-9VKH has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	301eaca4-2456-40f2-a5a3-6a143d21891a	f	2026-05-07 02:43:50.779	\N
180	4	New Purchase Request Approval	PR-20260507-9VKH has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	301eaca4-2456-40f2-a5a3-6a143d21891a	f	2026-05-07 02:43:53.408	\N
188	8	Purchase Request Generated	PR-20260507-9X16 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	d2dde6f5-74ea-48fc-821a-b6710ef7426d	f	2026-05-07 02:53:13.571	\N
189	4	New Purchase Request Approval	PR-20260507-9X16 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	d2dde6f5-74ea-48fc-821a-b6710ef7426d	f	2026-05-07 02:53:16.217	\N
190	4	New Purchase Request Approval	PR-20260507-4SCM has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	5347f4f6-d6ab-4be0-8968-423080e44fa5	f	2026-05-07 02:53:16.272	\N
79	6	Discrepancy Reported	PO-20260421-4TGL has a discrepancy. Description: cannot	SUPPLIER_UPDATE	IN_APP	grn	095ce2e8-a9d0-4ba0-ad0d-680984ff81d5	t	2026-04-20 17:45:34.258	2026-04-20 17:46:55.273
198	8	Purchase Request Approved	PR-20260507-9X16 is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	d2dde6f5-74ea-48fc-821a-b6710ef7426d	f	2026-05-07 02:56:20.85	\N
200	8	Purchase Request Approved	PR-20260507-M9W5 is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	1e1f4e35-6c74-4de1-8a45-42f0152d2af5	f	2026-05-07 02:56:26.363	\N
202	8	Purchase Request Approved	PR-20260507-8UGL is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	8bd39b3a-fad0-4a4e-8346-8b3c9fb35658	f	2026-05-07 02:56:30.761	\N
204	8	Purchase Request Approved	PR-20260423-3SHJ is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	89c4e153-3863-41eb-96d0-ea87f65f8ace	f	2026-05-07 02:56:36.305	\N
229	8	Supplier Rejected Acknowledgement	PO-20260507-0VQ7 acknowledgement was rejected. Rejected by: Ah Wei (Supplier). Description: Cancel	REQUESTER_UPDATE	IN_APP	tracking-item	89c4e153-3863-41eb-96d0-ea87f65f8ace	f	2026-05-07 03:00:27.639	\N
230	8	Order Acknowledged By Supplier	PO-20260507-IER4 was acknowledged by Ah Wei (Supplier). Please wait for delivery.	REQUESTER_UPDATE	IN_APP	tracking-item	381fb48d-50f2-4593-85c7-91c5324534d1	f	2026-05-07 03:00:32.56	\N
232	8	Order Acknowledged By Supplier	PO-20260507-LR5H was acknowledged by Ah Wei (Supplier). Please wait for delivery.	REQUESTER_UPDATE	IN_APP	tracking-item	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 03:00:37.357	\N
235	8	Supplier Started New Delivery	DLV-20260507-1JHC has a new pending delivery submitted by supplier. You can track progress in Tracking Item.	REQUESTER_UPDATE	IN_APP	tracking-item	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 03:00:41.444	\N
236	8	Supplier Rejected Acknowledgement	PO-20260507-AMMY acknowledgement was rejected. Rejected by: Ah Wei (Supplier). Description: Rejected	REQUESTER_UPDATE	IN_APP	tracking-item	5347f4f6-d6ab-4be0-8968-423080e44fa5	f	2026-05-07 03:00:51.628	\N
237	8	Order Acknowledged By Supplier	PO-20260507-44JH was acknowledged by Ah Wei (Supplier). Please wait for delivery.	REQUESTER_UPDATE	IN_APP	tracking-item	d2dde6f5-74ea-48fc-821a-b6710ef7426d	f	2026-05-07 03:00:55.826	\N
245	8	Purchase Request Generated	PR-20260507-0A9P has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:34:52.585	\N
88	4	New Purchase Request Approval	PR-20260421-32QJ has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	5e943e82-04eb-4499-92d5-1cefff345abf	f	2026-04-21 08:58:43.692	\N
90	4	New Purchase Request Approval	PR-20260421-R6KO has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	9cd0a96c-3405-41b8-bc01-52379d8ec8c2	f	2026-04-21 08:59:19.075	\N
246	4	New Purchase Request Approval	PR-20260507-0A9P has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	0971ee41-2a53-401b-85f3-4f906c1b2aaf	t	2026-05-07 07:34:56.263	2026-05-07 07:36:07.737
92	4	New Purchase Request Approval	PR-20260421-FMNF has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	f76a6521-12d8-4518-8719-df9d94a06881	f	2026-04-21 08:59:53.1	\N
252	8	Supplier Rejected Acknowledgement	PO-20260507-XEZJ acknowledgement was rejected. Rejected by: MeMe. Description: Reject the request from meme	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:43:19.234	\N
94	4	New Purchase Request Approval	PR-20260421-DU5C has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	b89712b6-8ba5-4dc2-8bf2-d7e39e4f00a4	f	2026-04-21 09:00:25.534	\N
96	4	New Purchase Request Approval	PR-20260421-TPO5 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	a326d654-4d51-40ee-a10a-788ded1cccfa	f	2026-04-21 09:01:44.985	\N
259	8	Order Delivered	DLV-20260507-44YA has been delivered by supplier. Please collect your parcel and verify the order in system.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	t	2026-05-07 07:46:20.224	2026-05-07 07:46:57.318
98	4	New Purchase Request Approval	PR-20260421-LUJH has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	ab489f7a-f0ca-4278-bb90-ce0a82e04fec	f	2026-04-21 09:02:36.252	\N
122	6	New Order Acknowledge Request	PO-20260421-F76A needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	3647595d-0da9-47c4-9c84-2c3d81475f55	t	2026-04-21 10:21:18.339	2026-04-30 21:00:34.137
100	4	New Purchase Request Approval	PR-20260421-TW4D has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	cc74a2a4-ed3c-4a8f-b230-747ca6545ab8	f	2026-04-21 09:03:16.626	\N
124	6	New Order Acknowledge Request	PO-20260421-QQ9R needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	b65d1e3c-04e5-42d3-94e5-8a3fe9328983	t	2026-04-21 10:21:25.932	2026-04-30 21:00:34.137
102	4	New Purchase Request Approval	PR-20260421-BU1A has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	b5d49271-4db5-4b35-8911-661c53e35660	f	2026-04-21 09:03:52.927	\N
126	6	New Order Acknowledge Request	PO-20260421-1NXJ needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	9248705f-994a-4955-9417-71ffcd019b95	t	2026-04-21 10:21:33.34	2026-04-30 21:00:34.137
104	4	New Purchase Request Approval	PR-20260421-QYX4 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	ce8d9a28-2d22-4dcf-876a-08dcd3b76574	f	2026-04-21 09:05:00.936	\N
128	6	New Order Acknowledge Request	PO-20260421-EIS9 needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	a7d73a52-940b-493c-944f-41b425eb7bb1	t	2026-04-21 10:21:37.934	2026-04-30 21:00:34.137
130	6	New Order Acknowledge Request	PO-20260421-VT1O needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	72462670-556a-46e4-b32b-90a2d64e9188	t	2026-04-21 10:21:44.065	2026-04-30 21:00:34.137
181	8	Purchase Request Generated	PR-20260507-IPP2 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	5f812150-2dfc-4fde-b50c-b4a1bd1f47ee	f	2026-05-07 02:51:15.849	\N
182	4	New Purchase Request Approval	PR-20260507-IPP2 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	5f812150-2dfc-4fde-b50c-b4a1bd1f47ee	f	2026-05-07 02:51:18.935	\N
191	8	Purchase Request Generated	PR-20260507-7J6W has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 02:53:43.779	\N
231	8	Supplier Started New Delivery	DLV-20260507-PFQ3 has a new pending delivery submitted by supplier. You can track progress in Tracking Item.	REQUESTER_UPDATE	IN_APP	tracking-item	381fb48d-50f2-4593-85c7-91c5324534d1	f	2026-05-07 03:00:32.798	\N
233	8	Supplier Started New Delivery	DLV-20260507-H3I6 has a new pending delivery submitted by supplier. You can track progress in Tracking Item.	REQUESTER_UPDATE	IN_APP	tracking-item	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 03:00:37.369	\N
234	8	Order Acknowledged By Supplier	PO-20260507-MVEO was acknowledged by Ah Wei (Supplier). Please wait for delivery.	REQUESTER_UPDATE	IN_APP	tracking-item	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 03:00:41.433	\N
247	8	Purchase Request Approved	PR-20260507-0A9P is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:36:38.371	\N
208	9	New Purchase Order Approval	PO-20260507-SHVX has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	19fe3e2e-9d0e-41ca-bc78-996cb350ffa7	t	2026-05-07 02:57:14.369	2026-05-07 07:40:24.651
209	9	New Purchase Order Approval	PO-20260507-S1S1 has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	9ecdf624-e33f-4108-ab39-a6d1ab0adbbb	t	2026-05-07 02:57:18.462	2026-05-07 07:40:24.651
210	9	New Purchase Order Approval	PO-20260507-AMMY has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	551788f1-2621-4fc5-af99-7e83d7c9d0b5	t	2026-05-07 02:57:27.995	2026-05-07 07:40:24.651
211	9	New Purchase Order Approval	PO-20260507-MVEO has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	96fa821d-abb1-4e72-8601-cb643bc4a25e	t	2026-05-07 02:57:30.636	2026-05-07 07:40:24.651
114	9	New Purchase Order Approval	PO-20260421-F76A has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	e48996c2-be7c-4665-9311-aaeabac4e077	t	2026-04-21 10:11:03.643	2026-05-07 07:40:24.651
253	9	New Purchase Order Approval	PO-20260507-1O5L has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	6c9b3f14-17aa-4cfc-a092-5be43ea5e074	f	2026-05-07 07:44:14.089	\N
254	6	New Order Acknowledge Request	PO-20260507-1O5L needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	88278b82-cdec-48f9-bf77-f5b0e7254f19	f	2026-05-07 07:44:21.462	\N
260	6	Discrepancy Reported	PO-20260507-XEZJ has a discrepancy. Description: One item is broken 1pcs	SUPPLIER_UPDATE	IN_APP	grn	7f9b1dab-da7c-4e12-a043-46320d7c98ed	f	2026-05-07 07:48:16.833	\N
261	8	GRN Discrepancy Detected	PO-20260507-XEZJ has a discrepancy. Please check Tracking Item for follow-up.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:48:22.463	\N
141	6	Order Completed	PO-20260421-EIS9 has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	c08985e6-f8c7-4f43-9e24-73ff1a72126f	t	2026-04-21 10:30:52.131	2026-04-30 21:00:34.137
183	8	Purchase Request Generated	PR-20260507-UGT4 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	2db74a88-cb52-4784-adbe-5d1f35739e11	f	2026-05-07 02:51:48.892	\N
192	4	New Purchase Request Approval	PR-20260507-7J6W has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 02:53:47.693	\N
214	6	New Order Acknowledge Request	PO-20260507-44JH needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	9c9dbfec-c280-488f-8e40-40b811cf6c6b	f	2026-05-07 02:58:42.651	\N
238	8	Supplier Started New Delivery	DLV-20260507-R7U1 has a new pending delivery submitted by supplier. You can track progress in Tracking Item.	REQUESTER_UPDATE	IN_APP	tracking-item	d2dde6f5-74ea-48fc-821a-b6710ef7426d	f	2026-05-07 03:00:55.966	\N
248	9	New Purchase Order Approval	PO-20260507-XEZJ has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	8a97d62d-8be8-4203-b59d-552a4a12c173	t	2026-05-07 07:37:07.935	2026-05-07 07:40:24.651
255	8	Purchase Order Approved	Manager approved PO-20260507-1O5L. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	5f812150-2dfc-4fde-b50c-b4a1bd1f47ee	f	2026-05-07 07:44:21.591	\N
262	8	Supplier Started New Delivery	DLV-20260507-4YAP has a new pending delivery submitted by supplier. You can track progress in Tracking Item.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:49:38.932	\N
263	8	Order Delivered	DLV-20260507-4YAP has been delivered by supplier. Please collect your parcel and verify the order in system.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	t	2026-05-07 07:49:41.475	2026-05-07 07:50:21.619
143	6	Discrepancy Reported	PO-20260421-VT1O has a discrepancy. Description: Test for Reject and delivery back	SUPPLIER_UPDATE	IN_APP	grn	1e42b3bb-0146-4176-bb0a-e510e3900298	t	2026-04-21 12:25:05.551	2026-04-30 21:00:34.137
147	6	Order Completed	PO-20260421-VT1O has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	404524db-0392-47fe-b608-cd40fe1b1943	t	2026-04-21 12:57:25.39	2026-04-30 21:00:34.137
149	6	New Order Acknowledge Request	PO-20260421-1SGE needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	bc8107fd-c8bf-418f-bfc2-9764a4dd677c	t	2026-04-21 12:58:22.699	2026-04-30 21:00:34.137
160	6	Discrepancy Reported	PO-20260421-1SGE has a discrepancy. Description: Again testing reject	SUPPLIER_UPDATE	IN_APP	grn	b1305276-b13c-4fe9-b989-04cb5167d5c8	t	2026-04-21 13:00:19.488	2026-04-30 21:00:34.137
164	6	Order Completed	PO-20260421-1SGE has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	6cc64eb0-da77-4efd-bc4b-da2fa880cae6	t	2026-04-21 13:01:44.056	2026-04-30 21:00:34.137
184	4	New Purchase Request Approval	PR-20260507-UGT4 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	2db74a88-cb52-4784-adbe-5d1f35739e11	f	2026-05-07 02:51:56.124	\N
193	8	Purchase Request Generated	PR-20260507-TAIE has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 02:54:04.182	\N
194	4	New Purchase Request Approval	PR-20260507-TAIE has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 02:54:10.227	\N
215	8	Purchase Order Approved	Manager approved PO-20260507-44JH. Please wait for supplier acknowledgement.	REQUESTER_UPDATE	IN_APP	tracking-item	d2dde6f5-74ea-48fc-821a-b6710ef7426d	f	2026-05-07 02:58:42.815	\N
239	8	Order Delivered	DLV-20260507-H3I6 has been delivered by supplier. Please collect your parcel and verify the order in system.	REQUESTER_UPDATE	IN_APP	tracking-item	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 03:01:29.974	\N
115	9	New Purchase Order Approval	PO-20260421-B1DB has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	fcdda349-876d-47ee-9709-1d9c42264b15	t	2026-04-21 10:11:08.032	2026-05-07 07:40:24.651
116	9	New Purchase Order Approval	PO-20260421-QQ9R has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	c228958b-9840-4249-81e9-bbc53821a81a	t	2026-04-21 10:11:11.047	2026-05-07 07:40:24.651
151	7	New Order Acknowledge Request	PO-20260421-1SGE needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	4c14f296-ff10-4045-af0b-d3252a3419bf	f	2026-04-21 12:58:30.385	\N
117	9	New Purchase Order Approval	PO-20260421-1NXJ has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	8d62ba5f-34f3-4777-89a3-d284eb98f981	t	2026-04-21 10:11:14.113	2026-05-07 07:40:24.651
118	9	New Purchase Order Approval	PO-20260421-EIS9 has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	ba284132-f079-418a-9cfe-f1ec72dee38a	t	2026-04-21 10:11:16.955	2026-05-07 07:40:24.651
119	9	New Purchase Order Approval	PO-20260421-VT1O has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	68e3219a-e364-4f2b-a928-b0b2cb1bd650	t	2026-04-21 10:11:19.753	2026-05-07 07:40:24.651
212	9	New Purchase Order Approval	PO-20260507-LR5H has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	c7cb7988-abe2-4b3e-8f19-6f6d426b9604	t	2026-05-07 02:57:33.206	2026-05-07 07:40:24.651
256	8	Supplier Rejected Acknowledgement	PO-20260507-1O5L acknowledgement was rejected. Rejected by: Ah Wei (Supplier). Description: Reject from the Meme	REQUESTER_UPDATE	IN_APP	tracking-item	5f812150-2dfc-4fde-b50c-b4a1bd1f47ee	f	2026-05-07 07:44:56.77	\N
264	6	Order Completed	PO-20260507-XEZJ has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	027eef9a-cea7-48ee-a46b-156b7bec606c	f	2026-05-07 07:51:42.458	\N
158	7	Order Completed	PO-20260421-1SGE has been received by requester. Thank you, this order is completed.	SUPPLIER_UPDATE	IN_APP	grn	ecc3b4ed-8737-4180-a669-cae675ba2575	f	2026-04-21 13:00:09.176	\N
265	8	Item Completed	PO-20260507-XEZJ is completed. Your requested item flow has finished.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:51:49.614	\N
167	4	New Purchase Request Approval	PR-20260422-HIU5 has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	39b51fb0-561e-41f7-b3c0-6708a7b99d9d	f	2026-04-22 14:59:23.8	\N
170	6	New Order Acknowledge Request	PO-20260422-DS3T needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	554de1f6-71fd-4d27-b09a-094b056af021	t	2026-04-22 15:00:11.244	2026-04-30 21:00:34.137
185	8	Purchase Request Generated	PR-20260507-M9W5 has been generated. You can check it in Tracking Item.	REQUESTER_CREATED	IN_APP	tracking-item	1e1f4e35-6c74-4de1-8a45-42f0152d2af5	f	2026-05-07 02:52:21.808	\N
195	8	Purchase Request Approved	PR-20260507-TAIE is approved. Please wait for Department Executive to submit the Purchase Order.	REQUESTER_UPDATE	IN_APP	tracking-item	53a38cf2-52e7-4bce-a3f4-e62c682da302	f	2026-05-07 02:55:28.929	\N
216	8	Purchase Order Rejected	PO-20260507-SHVX was rejected. Rejected by: Manager. Description: Purchase Order Rejected	REQUESTER_UPDATE	IN_APP	tracking-item	8bd39b3a-fad0-4a4e-8346-8b3c9fb35658	f	2026-05-07 02:59:09.52	\N
217	6	New Order Acknowledge Request	PO-20260507-S1S1 needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	82eaaab3-ab1e-454b-9631-9f1deb91874a	f	2026-05-07 02:59:12.141	\N
240	8	Order Delivered	DLV-20260507-1JHC has been delivered by supplier. Please collect your parcel and verify the order in system.	REQUESTER_UPDATE	IN_APP	tracking-item	298527a4-c1ef-4990-b05d-21509e480823	f	2026-05-07 03:01:33.237	\N
169	9	New Purchase Order Approval	PO-20260422-DS3T has a new item approval waiting. Please review it in the system.	PURCHASE_ORDER_APPROVAL	IN_APP	purchase-order	5c312e26-1c9d-4183-a38d-64658277b095	t	2026-04-22 14:59:39.727	2026-05-07 07:40:24.651
249	6	New Order Acknowledge Request	PO-20260507-XEZJ needs your acknowledgement.	SUPPLIER_ORDER_ACK	IN_APP	supplier-order-ack	54d59a86-2bb9-400b-9e45-e2cdf342a935	f	2026-05-07 07:40:52.24	\N
257	8	Supplier Started New Delivery	DLV-20260507-44YA has a new pending delivery submitted by supplier. You can track progress in Tracking Item.	REQUESTER_UPDATE	IN_APP	tracking-item	0971ee41-2a53-401b-85f3-4f906c1b2aaf	f	2026-05-07 07:45:32.058	\N
173	4	New Purchase Request Approval	PR-20260423-VBTU has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	381fb48d-50f2-4593-85c7-91c5324534d1	f	2026-04-23 05:03:02.658	\N
175	4	New Purchase Request Approval	PR-20260423-3SHJ has a new item approval waiting. Please review it in the system.	PURCHASE_REQUEST_APPROVAL	IN_APP	purchase-request	89c4e153-3863-41eb-96d0-ea87f65f8ace	f	2026-04-23 05:03:25.468	\N
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
\.


--
-- Data for Name: purchase_order_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
56366c79-8bb2-47f4-b703-fcca047a2cae	{"status": "APPROVED", "localId": "56366c79-8bb2-47f4-b703-fcca047a2cae", "currency": "MYR", "poNumber": "PO-20260501-NT6P", "createdBy": "Manager", "lineItems": [{"tempId": "3c1b9977-9df8-4d64-853f-47efd18a797e", "itemName": "Testing for rejecting", "quantity": 1, "unitPrice": 2000, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "hi", "unitOfMeasurement": "pcs"}], "department": "IT", "createdDate": "2026-05-01", "createdByEmail": "finalypmanager@gmail.com", "sourcePrNumber": "PR-20260423-3SHJ", "createdByUserId": 9, "sourceRequester": "Employee1", "sourceRequestLocalId": "89c4e153-3863-41eb-96d0-ea87f65f8ace"}	2026-05-07 02:55:28.777	2026-05-07 07:44:21.568
5c312e26-1c9d-4183-a38d-64658277b095	{"status": "APPROVED", "localId": "5c312e26-1c9d-4183-a38d-64658277b095", "currency": "MYR", "poNumber": "PO-20260422-DS3T", "createdBy": "Executive", "lineItems": [{"tempId": "6c9ec80d-938d-414e-b6df-fc01342fd7c2", "itemName": "Testing for draft", "quantity": 1, "unitPrice": 500, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "testing1", "unitOfMeasurement": "pcs"}], "department": "IT", "createdDate": "2026-04-22", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260422-HIU5", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "39b51fb0-561e-41f7-b3c0-6708a7b99d9d"}	2026-04-22 14:59:36.921	2026-05-07 07:44:21.562
9ecdf624-e33f-4108-ab39-a6d1ab0adbbb	{"status": "APPROVED", "localId": "9ecdf624-e33f-4108-ab39-a6d1ab0adbbb", "currency": "MYR", "poNumber": "PO-20260507-S1S1", "createdBy": "Executive", "lineItems": [{"tempId": "2314e4bb-69cb-4b71-80aa-2ee1badf7cd0", "itemName": "Testing again for Purchase Order Approve", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Order Approve", "unitOfMeasurement": "unit"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-M9W5", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "1e1f4e35-6c74-4de1-8a45-42f0152d2af5"}	2026-05-07 02:56:26.34	2026-05-07 07:44:21.575
c7cb7988-abe2-4b3e-8f19-6f6d426b9604	{"status": "APPROVED", "localId": "c7cb7988-abe2-4b3e-8f19-6f6d426b9604", "currency": "MYR", "poNumber": "PO-20260507-LR5H", "createdBy": "Executive", "lineItems": [{"tempId": "7bf531ad-b0c5-4ef9-8a47-95253b726a66", "itemName": "Testing again for Completed", "quantity": 22, "unitPrice": 2222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Completed", "unitOfMeasurement": "box"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-TAIE", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "53a38cf2-52e7-4bce-a3f4-e62c682da302"}	2026-05-07 02:55:28.779	2026-05-07 07:44:21.565
551788f1-2621-4fc5-af99-7e83d7c9d0b5	{"status": "APPROVED", "localId": "551788f1-2621-4fc5-af99-7e83d7c9d0b5", "currency": "MYR", "poNumber": "PO-20260507-AMMY", "createdBy": "Executive", "lineItems": [{"tempId": "3d9569ab-e263-413c-ac84-4b09ce4aca06", "itemName": "Testing again for Supplier Reject", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Supplier Reject", "unitOfMeasurement": "box"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-4SCM", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "5347f4f6-d6ab-4be0-8968-423080e44fa5"}	2026-05-07 02:56:23.935	2026-05-07 07:44:21.57
f6afc9d7-13d9-4ab7-9433-eede0c2e0be9	{"status": "APPROVED", "localId": "f6afc9d7-13d9-4ab7-9433-eede0c2e0be9", "currency": "MYR", "poNumber": "PO-20260507-44JH", "createdBy": "Executive", "lineItems": [{"tempId": "99ecc1d8-064a-4063-a919-632f2444415b", "itemName": "Testing again for Supplier Delivery", "quantity": 22, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Supplier Delivery", "unitOfMeasurement": "box"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-9X16", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "d2dde6f5-74ea-48fc-821a-b6710ef7426d"}	2026-05-07 02:56:20.816	2026-05-07 07:44:21.564
96fa821d-abb1-4e72-8601-cb643bc4a25e	{"status": "APPROVED", "localId": "96fa821d-abb1-4e72-8601-cb643bc4a25e", "currency": "MYR", "poNumber": "PO-20260507-MVEO", "createdBy": "Executive", "lineItems": [{"tempId": "6df43c45-0ca0-4c11-8598-22d3b5f88477", "itemName": "Testing again for GRN Discrepancy", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for GRN Discrepancy", "unitOfMeasurement": "unit"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-7J6W", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "298527a4-c1ef-4990-b05d-21509e480823"}	2026-05-07 02:56:15.651	2026-05-07 07:44:21.569
a4a170d5-e8b7-41a2-a204-feece74b1c62	{"status": "DRAFT", "localId": "a4a170d5-e8b7-41a2-a204-feece74b1c62", "currency": "MYR", "poNumber": "PO-20260507-UYYE", "createdBy": "Executive", "lineItems": [{"tempId": "f36b740d-7b60-46f6-9eb0-a5491b592beb", "itemName": "Testing again for Purchase Request Submitted", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Submitted", "unitOfMeasurement": "pcs"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-9VKH", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "301eaca4-2456-40f2-a5a3-6a143d21891a"}	2026-05-07 02:56:28.52	2026-05-07 07:44:21.571
6c9b3f14-17aa-4cfc-a092-5be43ea5e074	{"status": "APPROVED", "localId": "6c9b3f14-17aa-4cfc-a092-5be43ea5e074", "currency": "MYR", "poNumber": "PO-20260507-1O5L", "createdBy": "Executive", "lineItems": [{"tempId": "913cb8cf-1b84-4176-ba20-73cfdbbae8a5", "itemName": "Testing again for Purchase Request Approve", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Approve", "unitOfMeasurement": "box"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-IPP2", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "5f812150-2dfc-4fde-b50c-b4a1bd1f47ee"}	2026-05-07 02:56:33.838	2026-05-07 07:44:21.572
f98f1d87-6f1f-47d0-b3bf-2f865385bce8	{"status": "APPROVED", "localId": "f98f1d87-6f1f-47d0-b3bf-2f865385bce8", "currency": "MYR", "poNumber": "PO-20260507-0VQ7", "createdBy": "Executive", "lineItems": [{"tempId": "3c1b9977-9df8-4d64-853f-47efd18a797e", "itemName": "Testing for rejecting", "quantity": 1, "unitPrice": 2000, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "hi", "unitOfMeasurement": "pcs"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260423-3SHJ", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "89c4e153-3863-41eb-96d0-ea87f65f8ace"}	2026-05-07 02:56:36.275	2026-05-07 07:44:21.575
1aaa79f8-7fef-4db6-8eaa-8a201c9d1488	{"status": "APPROVED", "localId": "1aaa79f8-7fef-4db6-8eaa-8a201c9d1488", "currency": "MYR", "poNumber": "PO-20260420-VN6Y", "createdBy": "Moey Ching Wei", "lineItems": [{"tempId": "81905805-3698-4b56-a986-424b160d098f", "itemName": "Testing for employee part", "quantity": 10, "unitPrice": 200, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "employee part", "unitOfMeasurement": "pcs"}], "department": "IT", "createdDate": "2026-04-20", "createdByEmail": "chingweimoey@gmail.com", "sourcePrNumber": "PR-20260419-YB6P", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "e0b1167c-0f11-4cb7-93bd-d7c8cc6ab843"}	2026-05-07 02:55:28.772	2026-05-07 07:44:21.566
19fe3e2e-9d0e-41ca-bc78-996cb350ffa7	{"status": "REJECTED", "localId": "19fe3e2e-9d0e-41ca-bc78-996cb350ffa7", "currency": "MYR", "poNumber": "PO-20260507-SHVX", "createdBy": "Executive", "lineItems": [{"tempId": "0cc3a211-5614-4a72-a255-fe17bc7226de", "itemName": "Testing again for Purchase Order Reject", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Order Reject", "unitOfMeasurement": "pcs"}], "department": "IT", "rejectedBy": "Manager", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-8UGL", "createdByUserId": 4, "rejectionReason": "Purchase Order Rejected", "sourceRequester": "Employee1", "sourceRequestLocalId": "8bd39b3a-fad0-4a4e-8346-8b3c9fb35658"}	2026-05-07 02:56:30.737	2026-05-07 07:44:21.574
2956b1ae-970b-4f0d-814b-158ea1ebccb7	{"status": "APPROVED", "localId": "2956b1ae-970b-4f0d-814b-158ea1ebccb7", "currency": "MYR", "poNumber": "PO-20260507-IER4", "createdBy": "Executive", "lineItems": [{"tempId": "f8ba4875-d2f6-4d71-8bce-8f3b10f44e08", "itemName": "testing for approve", "quantity": 22, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "test", "unitOfMeasurement": "pcs"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260423-VBTU", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "381fb48d-50f2-4593-85c7-91c5324534d1"}	2026-05-07 02:56:38.659	2026-05-07 07:44:21.576
8a97d62d-8be8-4203-b59d-552a4a12c173	{"status": "APPROVED", "localId": "8a97d62d-8be8-4203-b59d-552a4a12c173", "currency": "MYR", "poNumber": "PO-20260507-XEZJ", "createdBy": "Executive", "lineItems": [{"tempId": "a6d19310-fd18-4396-9004-76edc63bcadc", "itemName": "FYP Testing Completed", "quantity": 20, "unitPrice": 50, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "FYP Testing Completed", "unitOfMeasurement": "pcs"}, {"tempId": "6d88ee46-f09d-429b-8f4a-e4b401c5f3f3", "itemName": "Testing for FYP second supplier", "quantity": 2, "unitPrice": 33, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "Testing for FYP second supplier", "unitOfMeasurement": "box"}], "department": "IT", "createdDate": "2026-05-07", "createdByEmail": "fypexecutive@gmail.com", "sourcePrNumber": "PR-20260507-0A9P", "createdByUserId": 4, "sourceRequester": "Employee1", "sourceRequestLocalId": "0971ee41-2a53-401b-85f3-4f906c1b2aaf"}	2026-05-07 07:36:38.344	2026-05-07 07:44:21.577
\.


--
-- Data for Name: purchase_request_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_request_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
cc74a2a4-ed3c-4a8f-b230-747ca6545ab8	{"status": "APPROVED", "localId": "cc74a2a4-ed3c-4a8f-b230-747ca6545ab8", "currency": "MYR", "prNumber": "PR-20260421-TW4D", "lineItems": [{"tempId": "9ad48137-9dea-4bac-9b3f-b6aa35175655", "itemName": "Testing for GRN Approved", "quantity": 1, "unitPrice": 909, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for GRN Approved", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 09:03:12.122	2026-05-07 07:36:38.331
2db74a88-cb52-4784-adbe-5d1f35739e11	{"status": "REJECTED", "localId": "2db74a88-cb52-4784-adbe-5d1f35739e11", "currency": "MYR", "prNumber": "PR-20260507-UGT4", "lineItems": [{"tempId": "e2bd87be-ec80-47de-a7dd-7c8f2f3474ff", "itemName": "Testing again for Purchase Request Rejected", "quantity": 22, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Rejected", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8, "rejectionReason": "Reject the Purchase Request"}	2026-05-07 02:51:48.881	2026-05-07 07:36:38.359
298527a4-c1ef-4990-b05d-21509e480823	{"status": "APPROVED", "localId": "298527a4-c1ef-4990-b05d-21509e480823", "currency": "MYR", "prNumber": "PR-20260507-7J6W", "lineItems": [{"tempId": "6df43c45-0ca0-4c11-8598-22d3b5f88477", "itemName": "Testing again for GRN Discrepancy", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for GRN Discrepancy", "unitOfMeasurement": "unit"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:53:43.769	2026-05-07 07:36:38.359
f76a6521-12d8-4518-8719-df9d94a06881	{"status": "APPROVED", "localId": "f76a6521-12d8-4518-8719-df9d94a06881", "currency": "MYR", "prNumber": "PR-20260421-FMNF", "lineItems": [{"tempId": "53276ae7-4ca0-4bdf-82a0-53ec41c4286b", "itemName": "Testing for PO Approved", "quantity": 1, "unitPrice": 122, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for PO Approve", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 08:59:47.307	2026-05-07 07:36:38.328
b5d49271-4db5-4b35-8911-661c53e35660	{"status": "APPROVED", "localId": "b5d49271-4db5-4b35-8911-661c53e35660", "currency": "MYR", "prNumber": "PR-20260421-BU1A", "lineItems": [{"tempId": "57a08b8b-ade0-4ec9-a6f1-118892fd4ad7", "itemName": "Testing for GRN Rejected and Delivery Back", "quantity": 2222, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for GRN Rejected and Delivery Back", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 09:03:48.501	2026-05-07 07:36:38.337
8bd39b3a-fad0-4a4e-8346-8b3c9fb35658	{"status": "APPROVED", "localId": "8bd39b3a-fad0-4a4e-8346-8b3c9fb35658", "currency": "MYR", "prNumber": "PR-20260507-8UGL", "lineItems": [{"tempId": "0cc3a211-5614-4a72-a255-fe17bc7226de", "itemName": "Testing again for Purchase Order Reject", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Order Reject", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:41:17.24	2026-05-07 07:36:38.352
1e1f4e35-6c74-4de1-8a45-42f0152d2af5	{"status": "APPROVED", "localId": "1e1f4e35-6c74-4de1-8a45-42f0152d2af5", "currency": "MYR", "prNumber": "PR-20260507-M9W5", "lineItems": [{"tempId": "2314e4bb-69cb-4b71-80aa-2ee1badf7cd0", "itemName": "Testing again for Purchase Order Approve", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Order Approve", "unitOfMeasurement": "unit"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:52:21.793	2026-05-07 07:36:38.356
53a38cf2-52e7-4bce-a3f4-e62c682da302	{"status": "APPROVED", "localId": "53a38cf2-52e7-4bce-a3f4-e62c682da302", "currency": "MYR", "prNumber": "PR-20260507-TAIE", "lineItems": [{"tempId": "7bf531ad-b0c5-4ef9-8a47-95253b726a66", "itemName": "Testing again for Completed", "quantity": 22, "unitPrice": 2222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Completed", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:54:04.168	2026-05-07 07:36:38.361
ce8d9a28-2d22-4dcf-876a-08dcd3b76574	{"status": "APPROVED", "localId": "ce8d9a28-2d22-4dcf-876a-08dcd3b76574", "currency": "MYR", "prNumber": "PR-20260421-QYX4", "lineItems": [{"tempId": "fc40ae8e-6757-4190-a0ee-9f101508fc5c", "itemName": "Try about 2 supplier", "quantity": 222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Try 2 supplier", "unitOfMeasurement": "unit"}, {"tempId": "3943ad1f-4c5a-4dc4-9707-891a4b0fb8df", "itemName": "Try about 2 supplier for run", "quantity": 33, "unitPrice": 222, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "Try about 2 supplier for run", "unitOfMeasurement": "unit"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 09:04:56.109	2026-05-07 07:36:38.34
de53a199-9459-41b2-9803-cb1ddb1985c0	{"status": "DRAFT", "localId": "de53a199-9459-41b2-9803-cb1ddb1985c0", "currency": "MYR", "prNumber": "PR-20260507-X7QN", "lineItems": [{"tempId": "edc0e36b-8242-4b42-93a8-c0c7f929f9f3", "itemName": "Testing again for Purchase Request Draft", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Draft", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:42:55.542	2026-05-07 07:36:38.345
b89712b6-8ba5-4dc2-8bf2-d7e39e4f00a4	{"status": "APPROVED", "localId": "b89712b6-8ba5-4dc2-8bf2-d7e39e4f00a4", "currency": "MYR", "prNumber": "PR-20260421-DU5C", "lineItems": [{"tempId": "9d5b6d6a-136d-4fb6-a9fb-ffb1dd647547", "itemName": "Testing for PO Rejected", "quantity": 1, "unitPrice": 111, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for PO Reject", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 09:00:21.974	2026-05-07 07:36:38.329
39b51fb0-561e-41f7-b3c0-6708a7b99d9d	{"status": "APPROVED", "localId": "39b51fb0-561e-41f7-b3c0-6708a7b99d9d", "currency": "MYR", "prNumber": "PR-20260422-HIU5", "lineItems": [{"tempId": "6c9ec80d-938d-414e-b6df-fc01342fd7c2", "itemName": "Testing for draft", "quantity": 1, "unitPrice": 500, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "testing1", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-22", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-22 08:13:44.935	2026-05-07 07:36:38.342
301eaca4-2456-40f2-a5a3-6a143d21891a	{"status": "APPROVED", "localId": "301eaca4-2456-40f2-a5a3-6a143d21891a", "currency": "MYR", "prNumber": "PR-20260507-9VKH", "lineItems": [{"tempId": "f36b740d-7b60-46f6-9eb0-a5491b592beb", "itemName": "Testing again for Purchase Request Submitted", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Submitted", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:43:50.769	2026-05-07 07:36:38.354
5347f4f6-d6ab-4be0-8968-423080e44fa5	{"status": "APPROVED", "localId": "5347f4f6-d6ab-4be0-8968-423080e44fa5", "currency": "MYR", "prNumber": "PR-20260507-4SCM", "lineItems": [{"tempId": "3d9569ab-e263-413c-ac84-4b09ce4aca06", "itemName": "Testing again for Supplier Reject", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Supplier Reject", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:52:55.201	2026-05-07 07:36:38.358
5e943e82-04eb-4499-92d5-1cefff345abf	{"status": "APPROVED", "localId": "5e943e82-04eb-4499-92d5-1cefff345abf", "currency": "MYR", "prNumber": "PR-20260421-32QJ", "lineItems": [{"tempId": "f4581e1c-0a31-4574-ae68-a6e392e8c060", "itemName": "Testing for PR Approved", "quantity": 1, "unitPrice": 111, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for PR Approved", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 08:58:39.518	2026-05-07 07:36:38.326
a326d654-4d51-40ee-a10a-788ded1cccfa	{"status": "APPROVED", "localId": "a326d654-4d51-40ee-a10a-788ded1cccfa", "currency": "MYR", "prNumber": "PR-20260421-TPO5", "lineItems": [{"tempId": "ecd30db8-8bca-47ed-bee2-d52e61a6ccac", "itemName": "Testing for Supplier Rejected", "quantity": 11, "unitPrice": 111, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for Supplier Reject", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 09:01:40.504	2026-05-07 07:36:38.333
381fb48d-50f2-4593-85c7-91c5324534d1	{"status": "APPROVED", "localId": "381fb48d-50f2-4593-85c7-91c5324534d1", "currency": "MYR", "prNumber": "PR-20260423-VBTU", "lineItems": [{"tempId": "f8ba4875-d2f6-4d71-8bce-8f3b10f44e08", "itemName": "testing for approve", "quantity": 22, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "test", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-23", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-23 05:02:57.708	2026-05-07 07:36:38.339
be4e67e2-3a95-427f-ad87-47831e3bc684	{"status": "DRAFT", "localId": "be4e67e2-3a95-427f-ad87-47831e3bc684", "currency": "MYR", "prNumber": "PR-20260507-YISE", "lineItems": [{"tempId": "4a4e9447-468e-4903-a67f-a10f4bb444ff", "itemName": "Testing again for Purchase Request Draft", "quantity": 1, "unitPrice": 111, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Draft 1", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:50:33.203	2026-05-07 07:36:38.357
d2dde6f5-74ea-48fc-821a-b6710ef7426d	{"status": "APPROVED", "localId": "d2dde6f5-74ea-48fc-821a-b6710ef7426d", "currency": "MYR", "prNumber": "PR-20260507-9X16", "lineItems": [{"tempId": "99ecc1d8-064a-4063-a919-632f2444415b", "itemName": "Testing again for Supplier Delivery", "quantity": 22, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Supplier Delivery", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:53:13.562	2026-05-07 07:36:38.36
babe09ab-6b45-488c-b3bb-e7efb2656830	{"status": "APPROVED", "localId": "babe09ab-6b45-488c-b3bb-e7efb2656830", "currency": "MYR", "prNumber": "PR-20260421-ZX39", "lineItems": [{"tempId": "9e0598b9-72ce-4921-9a0f-e5e69451e72d", "itemName": "Again 9", "quantity": 2222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Again", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-20 17:39:45.404	2026-05-07 07:36:38.322
9cd0a96c-3405-41b8-bc01-52379d8ec8c2	{"status": "REJECTED", "localId": "9cd0a96c-3405-41b8-bc01-52379d8ec8c2", "currency": "MYR", "prNumber": "PR-20260421-R6KO", "lineItems": [{"tempId": "90c3e3da-0bf5-44fb-8b95-87e951e7e3e4", "itemName": "Testing for PR Rejected", "quantity": 1, "unitPrice": 111, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for PR Reject", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8, "rejectionReason": "Test for Reject on Purchase Request"}	2026-04-21 08:59:15.891	2026-05-07 07:36:38.325
ab489f7a-f0ca-4278-bb90-ce0a82e04fec	{"status": "APPROVED", "localId": "ab489f7a-f0ca-4278-bb90-ce0a82e04fec", "currency": "MYR", "prNumber": "PR-20260421-LUJH", "lineItems": [{"tempId": "26d7e837-3fd4-46f9-9e1a-0bf8f27963dc", "itemName": "Testing for Supplier Approved", "quantity": 1, "unitPrice": 333, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for Supplier Approve", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-21", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-21 09:02:32.438	2026-05-07 07:36:38.335
89c4e153-3863-41eb-96d0-ea87f65f8ace	{"status": "APPROVED", "localId": "89c4e153-3863-41eb-96d0-ea87f65f8ace", "currency": "MYR", "prNumber": "PR-20260423-3SHJ", "lineItems": [{"tempId": "3c1b9977-9df8-4d64-853f-47efd18a797e", "itemName": "Testing for rejecting", "quantity": 1, "unitPrice": 2000, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "hi", "unitOfMeasurement": "pcs"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-04-23", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-04-23 05:03:22.482	2026-05-07 07:36:38.343
5f812150-2dfc-4fde-b50c-b4a1bd1f47ee	{"status": "APPROVED", "localId": "5f812150-2dfc-4fde-b50c-b4a1bd1f47ee", "currency": "MYR", "prNumber": "PR-20260507-IPP2", "lineItems": [{"tempId": "913cb8cf-1b84-4176-ba20-73cfdbbae8a5", "itemName": "Testing again for Purchase Request Approve", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Approve", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 02:51:15.838	2026-05-07 07:36:38.348
0971ee41-2a53-401b-85f3-4f906c1b2aaf	{"status": "APPROVED", "localId": "0971ee41-2a53-401b-85f3-4f906c1b2aaf", "currency": "MYR", "prNumber": "PR-20260507-0A9P", "lineItems": [{"tempId": "a6d19310-fd18-4396-9004-76edc63bcadc", "itemName": "FYP Testing Completed", "quantity": 20, "unitPrice": 50, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "FYP Testing Completed", "unitOfMeasurement": "pcs"}, {"tempId": "6d88ee46-f09d-429b-8f4a-e4b401c5f3f3", "itemName": "Testing for FYP second supplier", "quantity": 2, "unitPrice": 33, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "Testing for FYP second supplier", "unitOfMeasurement": "box"}], "requestBy": "Employee1", "department": "IT", "requestDate": "2026-05-07", "createdByEmail": "chingweimoey@1utar.my", "createdByUserId": 8}	2026-05-07 07:34:52.57	2026-05-07 07:36:38.362
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
\.


--
-- Data for Name: supplier_delivery_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_delivery_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
961d904c-df48-4a21-a3ad-734bae8f3b89	{"items": [{"tempId": "b7784761-4a33-4b93-a6f1-ca686c022ec0", "itemName": "Testing again whole flow", "quantity": 1, "unitPrice": 100, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Again", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "961d904c-df48-4a21-a3ad-734bae8f3b89", "currency": "MYR", "poNumber": "PO-20260420-160P", "createdBy": "Executive", "poLocalId": "bb0b9ac1-cd51-4cad-8558-12772b6769e1", "department": "IT", "supplierId": 6, "createdDate": "2026-04-20", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-20", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260420-C3BJ", "sourceRequester": "Employee1", "acknowledgementLocalId": "ff067ce6-fff2-4536-9d73-4d3fa9c935cb"}	2026-04-20 17:47:35.485	2026-05-07 07:49:41.455
ab28ca82-946c-40ad-82ec-9f3abb642e4a	{"items": [{"tempId": "9e0598b9-72ce-4921-9a0f-e5e69451e72d", "itemName": "Again 9", "quantity": 2222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Again", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "ab28ca82-946c-40ad-82ec-9f3abb642e4a", "currency": "MYR", "poNumber": "PO-20260421-4TGL", "createdBy": "Executive", "poLocalId": "32663d5e-4263-494c-b2a9-07d3b3a83f23", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-ZX39", "sourceRequester": "Employee1", "acknowledgementLocalId": "2a3f218c-6362-4eff-bc33-d1bf0ef1ffdc"}	2026-04-20 17:47:35.485	2026-05-07 07:49:41.455
32eb2489-a03b-4239-bbd4-76f54f695594	{"items": [{"tempId": "d015be8d-1f4e-4198-a7f5-8cb349ef1c22", "itemName": "Again5", "quantity": 1, "unitPrice": 200, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "again", "unitOfMeasurement": "box"}], "status": "DELIVERED", "localId": "32eb2489-a03b-4239-bbd4-76f54f695594", "currency": "MYR", "poNumber": "PO-20260420-C36X", "createdBy": "Executive", "poLocalId": "131c7738-df38-4f1b-a70a-dd2fbb6d8c8a", "department": "IT", "supplierId": 6, "createdDate": "2026-04-20", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-20", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260420-SG80", "sourceRequester": "Employee1", "acknowledgementLocalId": "4f94182c-f7b7-4248-afd8-54157c0091ff"}	2026-04-20 17:47:35.485	2026-05-07 07:49:41.454
21ae57f9-aacd-4da6-adb9-42ada625a6a0	{"items": [{"tempId": "9e0598b9-72ce-4921-9a0f-e5e69451e72d", "itemName": "Again 9", "quantity": 2222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Again", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "21ae57f9-aacd-4da6-adb9-42ada625a6a0", "currency": "MYR", "poNumber": "PO-20260421-4TGL", "createdBy": "Ah Wei (Supplier)", "poLocalId": "32663d5e-4263-494c-b2a9-07d3b3a83f23", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-ZX39", "sourceRequester": "Employee1", "acknowledgementLocalId": "ab28ca82-946c-40ad-82ec-9f3abb642e4a"}	2026-04-20 17:47:35.485	2026-05-07 07:49:41.458
1c6ed72e-26fd-404a-904c-78ff0b1fdc45	{"items": [{"tempId": "9ad48137-9dea-4bac-9b3f-b6aa35175655", "itemName": "Testing for GRN Approved", "quantity": 1, "unitPrice": 909, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for GRN Approved", "unitOfMeasurement": "box"}], "status": "DELIVERED", "localId": "1c6ed72e-26fd-404a-904c-78ff0b1fdc45", "currency": "MYR", "poNumber": "PO-20260421-EIS9", "createdBy": "Executive", "poLocalId": "ba284132-f079-418a-9cfe-f1ec72dee38a", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-TW4D", "sourceRequester": "Employee1", "acknowledgementLocalId": "a7d73a52-940b-493c-944f-41b425eb7bb1"}	2026-04-21 10:27:07.735	2026-05-07 07:49:41.46
bbaffd31-72c3-4def-8e13-409176c305bf	{"items": [{"tempId": "26d7e837-3fd4-46f9-9e1a-0bf8f27963dc", "itemName": "Testing for Supplier Approved", "quantity": 1, "unitPrice": 333, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for Supplier Approve", "unitOfMeasurement": "pcs"}], "status": "PENDING_DELIVERY", "localId": "bbaffd31-72c3-4def-8e13-409176c305bf", "currency": "MYR", "poNumber": "PO-20260421-1NXJ", "createdBy": "Executive", "poLocalId": "8d62ba5f-34f3-4777-89a3-d284eb98f981", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-LUJH", "sourceRequester": "Employee1", "acknowledgementLocalId": "9248705f-994a-4955-9417-71ffcd019b95"}	2026-04-21 10:26:58.259	2026-05-07 07:49:41.457
33c6ad13-4c2c-4b09-a4a1-683c06c215d5	{"items": [{"tempId": "57a08b8b-ade0-4ec9-a6f1-118892fd4ad7", "itemName": "Testing for GRN Rejected and Delivery Back", "quantity": 2222, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for Delivery Back", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "33c6ad13-4c2c-4b09-a4a1-683c06c215d5", "currency": "MYR", "poNumber": "PO-20260421-VT1O", "createdBy": "Ah Wei (Supplier)", "poLocalId": "68e3219a-e364-4f2b-a928-b0b2cb1bd650", "deliveryNo": "DLV-20260421-ZB5Y", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-BU1A", "originalOrderNo": "PO-20260421-VT1O", "sourceRequester": "Employee1", "acknowledgementLocalId": "657e136d-5076-4141-af2c-109cd82d81b9"}	2026-04-21 12:27:29.149	2026-05-07 07:49:41.461
d0e2037e-4373-434d-bc42-0d2e04f462f0	{"items": [{"tempId": "fc40ae8e-6757-4190-a0ee-9f101508fc5c", "itemName": "Try about 2 supplier", "quantity": 222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Try 2 supplier", "unitOfMeasurement": "unit"}], "status": "DELIVERED", "localId": "d0e2037e-4373-434d-bc42-0d2e04f462f0", "currency": "MYR", "poNumber": "PO-20260421-1SGE", "createdBy": "Executive", "poLocalId": "b96a03c7-6545-4325-a877-4b2acb6f47bc", "deliveryNo": "DLV-20260421-3217", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-QYX4", "originalOrderNo": "PO-20260421-1SGE", "sourceRequester": "Employee1", "acknowledgementLocalId": "bc8107fd-c8bf-418f-bfc2-9764a4dd677c"}	2026-04-21 12:59:01.289	2026-05-07 07:49:41.462
657e136d-5076-4141-af2c-109cd82d81b9	{"items": [{"tempId": "57a08b8b-ade0-4ec9-a6f1-118892fd4ad7", "itemName": "Testing for GRN Rejected and Delivery Back", "quantity": 2222, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for GRN Rejected and Delivery Back", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "657e136d-5076-4141-af2c-109cd82d81b9", "currency": "MYR", "poNumber": "PO-20260421-VT1O", "createdBy": "Executive", "poLocalId": "68e3219a-e364-4f2b-a928-b0b2cb1bd650", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-BU1A", "sourceRequester": "Employee1", "acknowledgementLocalId": "72462670-556a-46e4-b32b-90a2d64e9188"}	2026-04-21 10:27:13.905	2026-05-07 07:49:41.459
68e914e7-ed52-442e-9e2b-72cdcaaae2f5	{"items": [{"tempId": "fc40ae8e-6757-4190-a0ee-9f101508fc5c", "itemName": "Try about 2 supplier", "quantity": 222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Try 2 supplier", "unitOfMeasurement": "unit"}], "status": "DELIVERED", "localId": "68e914e7-ed52-442e-9e2b-72cdcaaae2f5", "currency": "MYR", "poNumber": "PO-20260421-1SGE", "createdBy": "Ah Wei (Supplier)", "poLocalId": "b96a03c7-6545-4325-a877-4b2acb6f47bc", "deliveryNo": "DLV-20260421-U6MD", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-QYX4", "originalOrderNo": "PO-20260421-1SGE", "sourceRequester": "Employee1", "acknowledgementLocalId": "d0e2037e-4373-434d-bc42-0d2e04f462f0"}	2026-04-21 13:01:08.322	2026-05-07 07:49:41.463
b6ec9ff6-fb41-4043-8ac9-a086fe616802	{"items": [{"tempId": "3943ad1f-4c5a-4dc4-9707-891a4b0fb8df", "itemName": "Try about 2 supplier for run", "quantity": 33, "unitPrice": 222, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "Try about 2 supplier for run", "unitOfMeasurement": "unit"}], "status": "DELIVERED", "localId": "b6ec9ff6-fb41-4043-8ac9-a086fe616802", "currency": "MYR", "poNumber": "PO-20260421-1SGE", "createdBy": "Executive", "poLocalId": "b96a03c7-6545-4325-a877-4b2acb6f47bc", "deliveryNo": "DLV-20260421-KTFD", "department": "IT", "supplierId": 7, "createdDate": "2026-04-21", "supplierName": "MeMe", "deliveredDate": "2026-04-21", "supplierEmail": "meme@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-QYX4", "originalOrderNo": "PO-20260421-1SGE", "sourceRequester": "Employee1", "acknowledgementLocalId": "4c14f296-ff10-4045-af0b-d3252a3419bf"}	2026-04-21 12:59:27.82	2026-05-07 07:49:41.461
bf288c4c-e00c-45d9-b8fb-79b46472a906	{"items": [{"tempId": "f8ba4875-d2f6-4d71-8bce-8f3b10f44e08", "itemName": "testing for approve", "quantity": 22, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "test", "unitOfMeasurement": "pcs"}], "status": "PENDING_DELIVERY", "localId": "bf288c4c-e00c-45d9-b8fb-79b46472a906", "currency": "MYR", "poNumber": "PO-20260507-IER4", "createdBy": "Executive", "poLocalId": "2956b1ae-970b-4f0d-814b-158ea1ebccb7", "deliveryNo": "DLV-20260507-PFQ3", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260423-VBTU", "originalOrderNo": "PO-20260507-IER4", "sourceRequester": "Employee1", "acknowledgementLocalId": "4124ce26-b95b-4cda-8b5a-38c3f424e1bb"}	2026-05-07 03:00:32.787	2026-05-07 07:49:41.464
fd1a9f45-a667-4fd2-b7eb-8a155266103c	{"items": [{"tempId": "3c1b9977-9df8-4d64-853f-47efd18a797e", "itemName": "Testing for rejecting", "quantity": 1, "unitPrice": 2000, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "hi", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "fd1a9f45-a667-4fd2-b7eb-8a155266103c", "currency": "MYR", "poNumber": "PO-20260501-NT6P", "createdBy": "Manager", "poLocalId": "56366c79-8bb2-47f4-b703-fcca047a2cae", "deliveryNo": "DLV-20260501-9IPA", "department": "IT", "supplierId": 6, "createdDate": "2026-05-01", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-05-01", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260423-3SHJ", "originalOrderNo": "PO-20260501-NT6P", "sourceRequester": "Employee1", "acknowledgementLocalId": "64a92532-b406-4540-b9d6-e8093f628324"}	2026-05-07 03:00:32.786	2026-05-07 07:49:41.465
d761c4b9-50f7-4875-b56d-2019460e6bc8	{"items": [{"tempId": "81905805-3698-4b56-a986-424b160d098f", "itemName": "Testing for employee part", "quantity": 10, "unitPrice": 200, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "employee part", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "d761c4b9-50f7-4875-b56d-2019460e6bc8", "currency": "MYR", "poNumber": "PO-20260420-VN6Y", "createdBy": "Moey Ching Wei", "poLocalId": "1aaa79f8-7fef-4db6-8eaa-8a201c9d1488", "department": "IT", "supplierId": 7, "createdDate": "2026-04-20", "supplierName": "MeMe", "deliveredDate": "2026-04-20", "supplierEmail": "meme@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260419-YB6P", "sourceRequester": "Employee1", "acknowledgementLocalId": "3ff84576-c3c7-459e-a51b-8634c1899f94"}	2026-05-07 03:00:32.782	2026-05-07 07:49:41.463
0e689de8-05ee-4628-88b7-7dee2cb0cc46	{"items": [{"tempId": "6df43c45-0ca0-4c11-8598-22d3b5f88477", "itemName": "Testing again for GRN Discrepancy", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for GRN Discrepancy", "unitOfMeasurement": "unit"}], "status": "DELIVERED", "localId": "0e689de8-05ee-4628-88b7-7dee2cb0cc46", "currency": "MYR", "poNumber": "PO-20260507-MVEO", "createdBy": "Executive", "poLocalId": "96fa821d-abb1-4e72-8601-cb643bc4a25e", "deliveryNo": "DLV-20260507-1JHC", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-05-07", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-7J6W", "originalOrderNo": "PO-20260507-MVEO", "sourceRequester": "Employee1", "acknowledgementLocalId": "4ff3252e-792b-481a-93f6-4db515554699"}	2026-05-07 03:00:41.436	2026-05-07 07:49:41.466
6a2c49ff-6681-4e5e-9ef6-031dafbdbadb	{"items": [{"tempId": "7bf531ad-b0c5-4ef9-8a47-95253b726a66", "itemName": "Testing again for Completed", "quantity": 22, "unitPrice": 2222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Completed", "unitOfMeasurement": "box"}], "status": "DELIVERED", "localId": "6a2c49ff-6681-4e5e-9ef6-031dafbdbadb", "currency": "MYR", "poNumber": "PO-20260507-LR5H", "createdBy": "Executive", "poLocalId": "c7cb7988-abe2-4b3e-8f19-6f6d426b9604", "deliveryNo": "DLV-20260507-H3I6", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-05-07", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-TAIE", "originalOrderNo": "PO-20260507-LR5H", "sourceRequester": "Employee1", "acknowledgementLocalId": "aa0782fa-f553-49de-ad9c-def41e15f19a"}	2026-05-07 03:00:37.356	2026-05-07 07:49:41.466
8f5eb8de-54a3-47e0-a79c-cb16215a5ddc	{"items": [{"tempId": "99ecc1d8-064a-4063-a919-632f2444415b", "itemName": "Testing again for Supplier Delivery", "quantity": 22, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Supplier Delivery", "unitOfMeasurement": "box"}], "status": "PENDING_DELIVERY", "localId": "8f5eb8de-54a3-47e0-a79c-cb16215a5ddc", "currency": "MYR", "poNumber": "PO-20260507-44JH", "createdBy": "Executive", "poLocalId": "f6afc9d7-13d9-4ab7-9433-eede0c2e0be9", "deliveryNo": "DLV-20260507-R7U1", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-9X16", "originalOrderNo": "PO-20260507-44JH", "sourceRequester": "Employee1", "acknowledgementLocalId": "9c9dbfec-c280-488f-8e40-40b811cf6c6b"}	2026-05-07 03:00:55.957	2026-05-07 07:49:41.467
b61589de-00df-4738-8b63-379d787070ad	{"items": [{"tempId": "a6d19310-fd18-4396-9004-76edc63bcadc", "itemName": "FYP Testing Completed", "quantity": 20, "unitPrice": 50, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "FYP Testing Completed", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "b61589de-00df-4738-8b63-379d787070ad", "currency": "MYR", "poNumber": "PO-20260507-XEZJ", "createdBy": "Executive", "poLocalId": "8a97d62d-8be8-4203-b59d-552a4a12c173", "deliveryNo": "DLV-20260507-44YA", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-05-07", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-0A9P", "originalOrderNo": "PO-20260507-XEZJ", "sourceRequester": "Employee1", "acknowledgementLocalId": "54d59a86-2bb9-400b-9e45-e2cdf342a935"}	2026-05-07 07:45:32.05	2026-05-07 07:49:41.467
d5bd9961-c3a6-4de7-a311-8b964743fe96	{"items": [{"tempId": "a6d19310-fd18-4396-9004-76edc63bcadc", "itemName": "FYP Testing Completed", "quantity": 1, "unitPrice": 50, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "FYP Testing Completed", "unitOfMeasurement": "pcs"}], "status": "DELIVERED", "localId": "d5bd9961-c3a6-4de7-a311-8b964743fe96", "currency": "MYR", "poNumber": "PO-20260507-XEZJ", "createdBy": "Ah Wei (Supplier)", "poLocalId": "8a97d62d-8be8-4203-b59d-552a4a12c173", "deliveryNo": "DLV-20260507-4YAP", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "deliveredDate": "2026-05-07", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-0A9P", "originalOrderNo": "PO-20260507-XEZJ", "sourceRequester": "Employee1", "acknowledgementLocalId": "b61589de-00df-4738-8b63-379d787070ad"}	2026-05-07 07:49:38.922	2026-05-07 07:49:41.468
\.


--
-- Data for Name: supplier_grn_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_grn_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
8e608d23-0e6d-4902-a5b1-bcd06098e832	{"items": [{"tempId": "b7784761-4a33-4b93-a6f1-ca686c022ec0", "itemName": "Testing again whole flow", "quantity": 1, "unitPrice": 100, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Again", "unitOfMeasurement": "pcs"}], "status": "COMPLETED", "localId": "8e608d23-0e6d-4902-a5b1-bcd06098e832", "currency": "MYR", "poNumber": "PO-20260420-160P", "createdBy": "Executive", "poLocalId": "bb0b9ac1-cd51-4cad-8558-12772b6769e1", "department": "IT", "supplierId": 6, "createdDate": "2026-04-20", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-04-20", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260420-C3BJ", "deliveryLocalId": "961d904c-df48-4a21-a3ad-734bae8f3b89", "sourceRequester": "Employee1"}	2026-04-20 17:48:15.559	2026-05-07 07:51:42.44
095ce2e8-a9d0-4ba0-ad0d-680984ff81d5	{"items": [{"tempId": "9e0598b9-72ce-4921-9a0f-e5e69451e72d", "itemName": "Again 9", "quantity": 2222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Again", "unitOfMeasurement": "pcs"}], "status": "DISCREPANCY", "localId": "095ce2e8-a9d0-4ba0-ad0d-680984ff81d5", "currency": "MYR", "poNumber": "PO-20260421-4TGL", "createdBy": "Executive", "poLocalId": "32663d5e-4263-494c-b2a9-07d3b3a83f23", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-ZX39", "deliveryLocalId": "ab28ca82-946c-40ad-82ec-9f3abb642e4a", "sourceRequester": "Employee1", "discrepancyReason": "cannot"}	2026-04-20 17:48:15.559	2026-05-07 07:51:42.44
02d50ac5-3826-4a6e-824c-e6de2b2aa1f9	{"items": [{"tempId": "d015be8d-1f4e-4198-a7f5-8cb349ef1c22", "itemName": "Again5", "quantity": 1, "unitPrice": 200, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "again", "unitOfMeasurement": "box"}], "status": "COMPLETED", "localId": "02d50ac5-3826-4a6e-824c-e6de2b2aa1f9", "currency": "MYR", "poNumber": "PO-20260420-C36X", "createdBy": "Executive", "poLocalId": "131c7738-df38-4f1b-a70a-dd2fbb6d8c8a", "department": "IT", "supplierId": 6, "createdDate": "2026-04-20", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-04-20", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260420-SG80", "deliveryLocalId": "32eb2489-a03b-4239-bbd4-76f54f695594", "sourceRequester": "Employee1"}	2026-04-20 17:48:15.559	2026-05-07 07:51:42.438
1e42b3bb-0146-4176-bb0a-e510e3900298	{"items": [{"tempId": "57a08b8b-ade0-4ec9-a6f1-118892fd4ad7", "itemName": "Testing for GRN Rejected and Delivery Back", "quantity": 2222, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for GRN Rejected and Delivery Back", "unitOfMeasurement": "pcs"}], "status": "DISCREPANCY", "localId": "1e42b3bb-0146-4176-bb0a-e510e3900298", "currency": "MYR", "poNumber": "PO-20260421-VT1O", "createdBy": "Executive", "poLocalId": "68e3219a-e364-4f2b-a928-b0b2cb1bd650", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-BU1A", "deliveryLocalId": "657e136d-5076-4141-af2c-109cd82d81b9", "sourceRequester": "Employee1", "discrepancyReason": "Test for Reject and delivery back"}	2026-04-21 10:28:23.978	2026-05-07 07:51:42.441
c08985e6-f8c7-4f43-9e24-73ff1a72126f	{"items": [{"tempId": "9ad48137-9dea-4bac-9b3f-b6aa35175655", "itemName": "Testing for GRN Approved", "quantity": 1, "unitPrice": 909, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for GRN Approved", "unitOfMeasurement": "box"}], "status": "COMPLETED", "localId": "c08985e6-f8c7-4f43-9e24-73ff1a72126f", "currency": "MYR", "poNumber": "PO-20260421-EIS9", "createdBy": "Executive", "poLocalId": "ba284132-f079-418a-9cfe-f1ec72dee38a", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-TW4D", "deliveryLocalId": "1c6ed72e-26fd-404a-904c-78ff0b1fdc45", "sourceRequester": "Employee1"}	2026-04-21 10:28:08.182	2026-05-07 07:51:42.441
90d4d863-40e0-4807-9444-35c40ba88ce9	{"items": [{"tempId": "9e0598b9-72ce-4921-9a0f-e5e69451e72d", "itemName": "Again 9", "quantity": 2222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Again", "unitOfMeasurement": "pcs"}], "status": "COMPLETED", "localId": "90d4d863-40e0-4807-9444-35c40ba88ce9", "currency": "MYR", "poNumber": "PO-20260421-4TGL", "createdBy": "Ah Wei (Supplier)", "poLocalId": "32663d5e-4263-494c-b2a9-07d3b3a83f23", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-ZX39", "deliveryLocalId": "21ae57f9-aacd-4da6-adb9-42ada625a6a0", "sourceRequester": "Employee1"}	2026-04-20 17:48:15.559	2026-05-07 07:51:42.439
b1305276-b13c-4fe9-b989-04cb5167d5c8	{"items": [{"tempId": "fc40ae8e-6757-4190-a0ee-9f101508fc5c", "itemName": "Try about 2 supplier", "quantity": 222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Try 2 supplier", "unitOfMeasurement": "unit"}], "status": "DISCREPANCY", "localId": "b1305276-b13c-4fe9-b989-04cb5167d5c8", "currency": "MYR", "poNumber": "PO-20260421-1SGE", "createdBy": "Executive", "poLocalId": "b96a03c7-6545-4325-a877-4b2acb6f47bc", "deliveryNo": "DLV-20260421-3217", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-QYX4", "deliveryLocalId": "d0e2037e-4373-434d-bc42-0d2e04f462f0", "originalOrderNo": "PO-20260421-1SGE", "sourceRequester": "Employee1", "discrepancyReason": "Again testing reject"}	2026-04-21 12:59:05.839	2026-05-07 07:51:42.442
ecc3b4ed-8737-4180-a669-cae675ba2575	{"items": [{"tempId": "3943ad1f-4c5a-4dc4-9707-891a4b0fb8df", "itemName": "Try about 2 supplier for run", "quantity": 33, "unitPrice": 222, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "Try about 2 supplier for run", "unitOfMeasurement": "unit"}], "status": "COMPLETED", "localId": "ecc3b4ed-8737-4180-a669-cae675ba2575", "currency": "MYR", "poNumber": "PO-20260421-1SGE", "createdBy": "Executive", "poLocalId": "b96a03c7-6545-4325-a877-4b2acb6f47bc", "deliveryNo": "DLV-20260421-KTFD", "department": "IT", "supplierId": 7, "createdDate": "2026-04-21", "supplierName": "MeMe", "completedDate": "2026-04-21", "supplierEmail": "meme@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-QYX4", "deliveryLocalId": "b6ec9ff6-fb41-4043-8ac9-a086fe616802", "originalOrderNo": "PO-20260421-1SGE", "sourceRequester": "Employee1"}	2026-04-21 12:59:29.473	2026-05-07 07:51:42.443
404524db-0392-47fe-b608-cd40fe1b1943	{"items": [{"tempId": "57a08b8b-ade0-4ec9-a6f1-118892fd4ad7", "itemName": "Testing for GRN Rejected and Delivery Back", "quantity": 2222, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Test for Delivery Back", "unitOfMeasurement": "pcs"}], "status": "COMPLETED", "localId": "404524db-0392-47fe-b608-cd40fe1b1943", "currency": "MYR", "poNumber": "PO-20260421-VT1O", "createdBy": "Ah Wei (Supplier)", "poLocalId": "68e3219a-e364-4f2b-a928-b0b2cb1bd650", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-BU1A", "deliveryLocalId": "33c6ad13-4c2c-4b09-a4a1-683c06c215d5", "sourceRequester": "Employee1"}	2026-04-21 12:29:14.792	2026-05-07 07:51:42.442
df7e5a8a-5069-4b10-9095-973f2eea7e36	{"items": [{"tempId": "81905805-3698-4b56-a986-424b160d098f", "itemName": "Testing for employee part", "quantity": 10, "unitPrice": 200, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "employee part", "unitOfMeasurement": "pcs"}], "status": "COMPLETED", "localId": "df7e5a8a-5069-4b10-9095-973f2eea7e36", "currency": "MYR", "poNumber": "PO-20260420-VN6Y", "createdBy": "Moey Ching Wei", "poLocalId": "1aaa79f8-7fef-4db6-8eaa-8a201c9d1488", "department": "IT", "supplierId": 7, "createdDate": "2026-04-20", "supplierName": "MeMe", "completedDate": "2026-04-20", "supplierEmail": "meme@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260419-YB6P", "deliveryLocalId": "d761c4b9-50f7-4875-b56d-2019460e6bc8", "sourceRequester": "Employee1"}	2026-05-07 03:01:29.815	2026-05-07 07:51:42.444
f1ad665a-5a23-4709-a860-ef560e60c6bb	{"items": [{"tempId": "3c1b9977-9df8-4d64-853f-47efd18a797e", "itemName": "Testing for rejecting", "quantity": 1, "unitPrice": 2000, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "hi", "unitOfMeasurement": "pcs"}], "status": "PENDING_GRN", "localId": "f1ad665a-5a23-4709-a860-ef560e60c6bb", "currency": "MYR", "poNumber": "PO-20260501-NT6P", "createdBy": "Manager", "poLocalId": "56366c79-8bb2-47f4-b703-fcca047a2cae", "deliveryNo": "DLV-20260501-9IPA", "department": "IT", "supplierId": 6, "createdDate": "2026-05-01", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260423-3SHJ", "deliveryLocalId": "fd1a9f45-a667-4fd2-b7eb-8a155266103c", "originalOrderNo": "PO-20260501-NT6P", "sourceRequester": "Employee1"}	2026-05-07 03:01:29.817	2026-05-07 07:51:42.445
6cc64eb0-da77-4efd-bc4b-da2fa880cae6	{"items": [{"tempId": "fc40ae8e-6757-4190-a0ee-9f101508fc5c", "itemName": "Try about 2 supplier", "quantity": 222, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Try 2 supplier", "unitOfMeasurement": "unit"}], "status": "COMPLETED", "localId": "6cc64eb0-da77-4efd-bc4b-da2fa880cae6", "currency": "MYR", "poNumber": "PO-20260421-1SGE", "createdBy": "Ah Wei (Supplier)", "poLocalId": "b96a03c7-6545-4325-a877-4b2acb6f47bc", "deliveryNo": "DLV-20260421-U6MD", "department": "IT", "supplierId": 6, "createdDate": "2026-04-21", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-04-21", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260421-QYX4", "deliveryLocalId": "68e914e7-ed52-442e-9e2b-72cdcaaae2f5", "originalOrderNo": "PO-20260421-1SGE", "sourceRequester": "Employee1"}	2026-04-21 13:01:09.839	2026-05-07 07:51:42.443
e98bcb54-e625-4ab2-8bdb-c566ab40a8b7	{"items": [{"tempId": "7bf531ad-b0c5-4ef9-8a47-95253b726a66", "itemName": "Testing again for Completed", "quantity": 22, "unitPrice": 2222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Completed", "unitOfMeasurement": "box"}], "status": "COMPLETED", "localId": "e98bcb54-e625-4ab2-8bdb-c566ab40a8b7", "currency": "MYR", "poNumber": "PO-20260507-LR5H", "createdBy": "Executive", "poLocalId": "c7cb7988-abe2-4b3e-8f19-6f6d426b9604", "deliveryNo": "DLV-20260507-H3I6", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-05-07", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-TAIE", "deliveryLocalId": "6a2c49ff-6681-4e5e-9ef6-031dafbdbadb", "originalOrderNo": "PO-20260507-LR5H", "sourceRequester": "Employee1"}	2026-05-07 03:01:29.818	2026-05-07 07:51:42.445
7f9b1dab-da7c-4e12-a043-46320d7c98ed	{"items": [{"tempId": "a6d19310-fd18-4396-9004-76edc63bcadc", "itemName": "FYP Testing Completed", "quantity": 20, "unitPrice": 50, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "FYP Testing Completed", "unitOfMeasurement": "pcs"}], "status": "DISCREPANCY", "localId": "7f9b1dab-da7c-4e12-a043-46320d7c98ed", "currency": "MYR", "poNumber": "PO-20260507-XEZJ", "createdBy": "Executive", "poLocalId": "8a97d62d-8be8-4203-b59d-552a4a12c173", "deliveryNo": "DLV-20260507-44YA", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-0A9P", "deliveryLocalId": "b61589de-00df-4738-8b63-379d787070ad", "originalOrderNo": "PO-20260507-XEZJ", "sourceRequester": "Employee1", "discrepancyReason": "One item is broken 1pcs"}	2026-05-07 07:46:20.107	2026-05-07 07:51:42.448
5fc7b9a2-4ca4-4cf1-ac8c-473391a72bce	{"items": [{"tempId": "6df43c45-0ca0-4c11-8598-22d3b5f88477", "itemName": "Testing again for GRN Discrepancy", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for GRN Discrepancy", "unitOfMeasurement": "unit"}], "status": "DISCREPANCY", "localId": "5fc7b9a2-4ca4-4cf1-ac8c-473391a72bce", "currency": "MYR", "poNumber": "PO-20260507-MVEO", "createdBy": "Executive", "poLocalId": "96fa821d-abb1-4e72-8601-cb643bc4a25e", "deliveryNo": "DLV-20260507-1JHC", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-7J6W", "deliveryLocalId": "0e689de8-05ee-4628-88b7-7dee2cb0cc46", "originalOrderNo": "PO-20260507-MVEO", "sourceRequester": "Employee1", "discrepancyReason": "Discrenpancy"}	2026-05-07 03:01:33.225	2026-05-07 07:51:42.446
027eef9a-cea7-48ee-a46b-156b7bec606c	{"items": [{"tempId": "a6d19310-fd18-4396-9004-76edc63bcadc", "itemName": "FYP Testing Completed", "quantity": 1, "unitPrice": 50, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "FYP Testing Completed", "unitOfMeasurement": "pcs"}], "status": "COMPLETED", "localId": "027eef9a-cea7-48ee-a46b-156b7bec606c", "currency": "MYR", "poNumber": "PO-20260507-XEZJ", "createdBy": "Ah Wei (Supplier)", "poLocalId": "8a97d62d-8be8-4203-b59d-552a4a12c173", "deliveryNo": "DLV-20260507-4YAP", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "completedDate": "2026-05-07", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-0A9P", "deliveryLocalId": "d5bd9961-c3a6-4de7-a311-8b964743fe96", "originalOrderNo": "PO-20260507-XEZJ", "sourceRequester": "Employee1"}	2026-05-07 07:49:41.577	2026-05-07 07:51:42.447
\.


--
-- Data for Name: supplier_order_acknowledgement_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_order_acknowledgement_records ("localId", payload, "createdAt", "updatedAt") FROM stdin;
54d59a86-2bb9-400b-9e45-e2cdf342a935	{"items": [{"tempId": "a6d19310-fd18-4396-9004-76edc63bcadc", "itemName": "FYP Testing Completed", "quantity": 20, "unitPrice": 50, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "FYP Testing Completed", "unitOfMeasurement": "pcs"}], "status": "APPROVED", "localId": "54d59a86-2bb9-400b-9e45-e2cdf342a935", "currency": "MYR", "poNumber": "PO-20260507-XEZJ", "createdBy": "Executive", "poLocalId": "8a97d62d-8be8-4203-b59d-552a4a12c173", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-0A9P", "sourceRequester": "Employee1"}	2026-05-07 07:40:52.232	2026-05-07 07:45:32.154
52bfde61-2622-45ff-8e41-da494ee4e246	{"items": [{"tempId": "6d88ee46-f09d-429b-8f4a-e4b401c5f3f3", "itemName": "Testing for FYP second supplier", "quantity": 2, "unitPrice": 33, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "Testing for FYP second supplier", "unitOfMeasurement": "box"}], "status": "REJECTED", "localId": "52bfde61-2622-45ff-8e41-da494ee4e246", "currency": "MYR", "poNumber": "PO-20260507-XEZJ", "createdBy": "Executive", "poLocalId": "8a97d62d-8be8-4203-b59d-552a4a12c173", "department": "IT", "rejectedBy": "MeMe", "supplierId": 7, "createdDate": "2026-05-07", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-0A9P", "rejectionReason": "Reject the request from meme", "sourceRequester": "Employee1"}	2026-05-07 07:40:52.234	2026-05-07 07:45:32.155
4124ce26-b95b-4cda-8b5a-38c3f424e1bb	{"items": [{"tempId": "f8ba4875-d2f6-4d71-8bce-8f3b10f44e08", "itemName": "testing for approve", "quantity": 22, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "test", "unitOfMeasurement": "pcs"}], "status": "APPROVED", "localId": "4124ce26-b95b-4cda-8b5a-38c3f424e1bb", "currency": "MYR", "poNumber": "PO-20260507-IER4", "createdBy": "Executive", "poLocalId": "2956b1ae-970b-4f0d-814b-158ea1ebccb7", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260423-VBTU", "sourceRequester": "Employee1"}	2026-05-07 02:59:25.833	2026-05-07 07:45:32.153
88278b82-cdec-48f9-bf77-f5b0e7254f19	{"items": [{"tempId": "913cb8cf-1b84-4176-ba20-73cfdbbae8a5", "itemName": "Testing again for Purchase Request Approve", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Request Approve", "unitOfMeasurement": "box"}], "status": "REJECTED", "localId": "88278b82-cdec-48f9-bf77-f5b0e7254f19", "currency": "MYR", "poNumber": "PO-20260507-1O5L", "createdBy": "Executive", "poLocalId": "6c9b3f14-17aa-4cfc-a092-5be43ea5e074", "department": "IT", "rejectedBy": "Ah Wei (Supplier)", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-IPP2", "rejectionReason": "Reject from the Meme", "sourceRequester": "Employee1"}	2026-05-07 07:44:21.456	2026-05-07 07:45:32.156
0802ea3e-e63b-4b0c-8a17-93dd64a0947d	{"items": [{"tempId": "3c1b9977-9df8-4d64-853f-47efd18a797e", "itemName": "Testing for rejecting", "quantity": 1, "unitPrice": 2000, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "hi", "unitOfMeasurement": "pcs"}], "status": "REJECTED", "localId": "0802ea3e-e63b-4b0c-8a17-93dd64a0947d", "currency": "MYR", "poNumber": "PO-20260507-0VQ7", "createdBy": "Executive", "poLocalId": "f98f1d87-6f1f-47d0-b3bf-2f865385bce8", "department": "IT", "rejectedBy": "Ah Wei (Supplier)", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260423-3SHJ", "rejectionReason": "Cancel", "sourceRequester": "Employee1"}	2026-05-07 02:59:25.835	2026-05-07 07:45:32.153
64a92532-b406-4540-b9d6-e8093f628324	{"items": [{"tempId": "3c1b9977-9df8-4d64-853f-47efd18a797e", "itemName": "Testing for rejecting", "quantity": 1, "unitPrice": 2000, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "hi", "unitOfMeasurement": "pcs"}], "status": "APPROVED", "localId": "64a92532-b406-4540-b9d6-e8093f628324", "currency": "MYR", "poNumber": "PO-20260501-NT6P", "createdBy": "Manager", "poLocalId": "56366c79-8bb2-47f4-b703-fcca047a2cae", "department": "IT", "supplierId": 6, "createdDate": "2026-05-01", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260423-3SHJ", "sourceRequester": "Employee1"}	2026-05-07 02:58:42.638	2026-05-07 07:45:32.148
554de1f6-71fd-4d27-b09a-094b056af021	{"items": [{"tempId": "6c9ec80d-938d-414e-b6df-fc01342fd7c2", "itemName": "Testing for draft", "quantity": 1, "unitPrice": 500, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "testing1", "unitOfMeasurement": "pcs"}], "status": "PENDING_ORDER_ACKNOWLEDGE", "localId": "554de1f6-71fd-4d27-b09a-094b056af021", "currency": "MYR", "poNumber": "PO-20260422-DS3T", "createdBy": "Executive", "poLocalId": "5c312e26-1c9d-4183-a38d-64658277b095", "department": "IT", "supplierId": 6, "createdDate": "2026-04-22", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260422-HIU5", "sourceRequester": "Employee1"}	2026-04-22 15:00:11.237	2026-05-07 07:45:32.145
3ff84576-c3c7-459e-a51b-8634c1899f94	{"items": [{"tempId": "81905805-3698-4b56-a986-424b160d098f", "itemName": "Testing for employee part", "quantity": 10, "unitPrice": 200, "supplierId": 7, "itemCategory": "Office Supplies / Stationery", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "itemDescription": "employee part", "unitOfMeasurement": "pcs"}], "status": "APPROVED", "localId": "3ff84576-c3c7-459e-a51b-8634c1899f94", "currency": "MYR", "poNumber": "PO-20260420-VN6Y", "createdBy": "Moey Ching Wei", "poLocalId": "1aaa79f8-7fef-4db6-8eaa-8a201c9d1488", "department": "IT", "supplierId": 7, "createdDate": "2026-04-20", "supplierName": "MeMe", "supplierEmail": "meme@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260419-YB6P", "sourceRequester": "Employee1"}	2026-05-07 02:58:42.632	2026-05-07 07:45:32.147
9c9dbfec-c280-488f-8e40-40b811cf6c6b	{"items": [{"tempId": "99ecc1d8-064a-4063-a919-632f2444415b", "itemName": "Testing again for Supplier Delivery", "quantity": 22, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Supplier Delivery", "unitOfMeasurement": "box"}], "status": "APPROVED", "localId": "9c9dbfec-c280-488f-8e40-40b811cf6c6b", "currency": "MYR", "poNumber": "PO-20260507-44JH", "createdBy": "Executive", "poLocalId": "f6afc9d7-13d9-4ab7-9433-eede0c2e0be9", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-9X16", "sourceRequester": "Employee1"}	2026-05-07 02:58:42.64	2026-05-07 07:45:32.151
aa0782fa-f553-49de-ad9c-def41e15f19a	{"items": [{"tempId": "7bf531ad-b0c5-4ef9-8a47-95253b726a66", "itemName": "Testing again for Completed", "quantity": 22, "unitPrice": 2222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Completed", "unitOfMeasurement": "box"}], "status": "APPROVED", "localId": "aa0782fa-f553-49de-ad9c-def41e15f19a", "currency": "MYR", "poNumber": "PO-20260507-LR5H", "createdBy": "Executive", "poLocalId": "c7cb7988-abe2-4b3e-8f19-6f6d426b9604", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-TAIE", "sourceRequester": "Employee1"}	2026-05-07 02:59:12.124	2026-05-07 07:45:32.151
4ff3252e-792b-481a-93f6-4db515554699	{"items": [{"tempId": "6df43c45-0ca0-4c11-8598-22d3b5f88477", "itemName": "Testing again for GRN Discrepancy", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for GRN Discrepancy", "unitOfMeasurement": "unit"}], "status": "APPROVED", "localId": "4ff3252e-792b-481a-93f6-4db515554699", "currency": "MYR", "poNumber": "PO-20260507-MVEO", "createdBy": "Executive", "poLocalId": "96fa821d-abb1-4e72-8601-cb643bc4a25e", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-7J6W", "sourceRequester": "Employee1"}	2026-05-07 02:59:12.123	2026-05-07 07:45:32.152
9c6630e5-67a6-44d2-bb1d-fd3bcb0ec0b3	{"items": [{"tempId": "3d9569ab-e263-413c-ac84-4b09ce4aca06", "itemName": "Testing again for Supplier Reject", "quantity": 1, "unitPrice": 222, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Supplier Reject", "unitOfMeasurement": "box"}], "status": "REJECTED", "localId": "9c6630e5-67a6-44d2-bb1d-fd3bcb0ec0b3", "currency": "MYR", "poNumber": "PO-20260507-AMMY", "createdBy": "Executive", "poLocalId": "551788f1-2621-4fc5-af99-7e83d7c9d0b5", "department": "IT", "rejectedBy": "Ah Wei (Supplier)", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-4SCM", "rejectionReason": "Rejected", "sourceRequester": "Employee1"}	2026-05-07 02:59:12.121	2026-05-07 07:45:32.15
82eaaab3-ab1e-454b-9631-9f1deb91874a	{"items": [{"tempId": "2314e4bb-69cb-4b71-80aa-2ee1badf7cd0", "itemName": "Testing again for Purchase Order Approve", "quantity": 11, "unitPrice": 22, "supplierId": 6, "itemCategory": "Office Supplies / Stationery", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "itemDescription": "Testing again for Purchase Order Approve", "unitOfMeasurement": "unit"}], "status": "PENDING_ORDER_ACKNOWLEDGE", "localId": "82eaaab3-ab1e-454b-9631-9f1deb91874a", "currency": "MYR", "poNumber": "PO-20260507-S1S1", "createdBy": "Executive", "poLocalId": "9ecdf624-e33f-4108-ab39-a6d1ab0adbbb", "department": "IT", "supplierId": 6, "createdDate": "2026-05-07", "supplierName": "Ah Wei (Supplier)", "supplierEmail": "chingweimoey@gmail.com", "companyAddress": "Jalan Universiti, Bandar Barat, 31900 Kampar, Perak", "sourcePrNumber": "PR-20260507-M9W5", "sourceRequester": "Employee1"}	2026-05-07 02:59:12.118	2026-05-07 07:45:32.149
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

COPY public.users (id, name, email, password, role, "avatarUrl", department, "isActive") FROM stdin;
6	Ah Wei (Supplier)	chingweimoey@gmail.com	$2b$10$.RkVrW7nDzojO49TtCZFnOQksVzdKhqQvG8XyWQXcNgNvxRb73zOq	Supplier	\N	\N	t
1	Super Admin	admin@fyp.local	$2b$10$1VYVEmFnWC5AeNPw7nU3QOIQApwbHmzRPh33YiA5WTPm5nkN/FYgC	Admin	http://localhost:4000/uploads/avatars/1775897642081-sw9y7j9v.png	Administration	t
7	MeMe	meme@gmail.com	$2b$10$cDCRNZakwPCBIEl/Pz9vdu.IAENBMyZOSBP3KWLCfoWcbzGXw6fNq	Supplier	\N	\N	t
8	Employee1	chingweimoey@1utar.my	$2b$10$Yj2UqgBYp5gBKHS64VqVc.974RS.MIvgR7AAonawfKwhsRsIlFm0W	Employee	\N	IT	t
3	Admin	fypadminsystem@gmail.com	$2b$10$aHPDompAZJrJzYuOluhvEObcqQnboWWtOE1FT1zqtbkaACJt3ghn6	Admin	\N	Administration	t
9	Manager	finalypmanager@gmail.com	$2b$10$7ZtngpMsTei1LxOY0rNeseUGGNh5MUbPnGl39yH9Q.7HfDNlaATPW	Manager	\N	IT	t
4	Executive	fypexecutive@gmail.com	$2b$10$rboVn6CpmNhpZDYdLjrl2.V1Ysdfoblv5jzsGnFrHZWLyG3VsIGoq	Department Executive	http://localhost:4000/uploads/avatars/1775897762851-1a40rgzi.png	IT	t
\.


--
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedbacks_id_seq', 1, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 265, true);


--
-- Name: password_reset_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_codes_id_seq', 20, true);


--
-- Name: purchasing_lookups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchasing_lookups_id_seq', 2, true);


--
-- Name: role_change_audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_change_audits_id_seq', 10, true);


--
-- Name: supplier_type_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_type_assignments_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


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
-- Name: purchase_order_records purchase_order_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_records
    ADD CONSTRAINT purchase_order_records_pkey PRIMARY KEY ("localId");


--
-- Name: purchase_request_records purchase_request_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_records
    ADD CONSTRAINT purchase_request_records_pkey PRIMARY KEY ("localId");


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
-- Name: feedbacks_status_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "feedbacks_status_createdAt_idx" ON public.feedbacks USING btree (status, "createdAt");


--
-- Name: feedbacks_userId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "feedbacks_userId_createdAt_idx" ON public.feedbacks USING btree ("userId", "createdAt");


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
-- Name: feedbacks feedbacks_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
-- Name: role_change_audits role_change_audits_targetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_change_audits
    ADD CONSTRAINT "role_change_audits_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: supplier_type_assignments supplier_type_assignments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_type_assignments
    ADD CONSTRAINT "supplier_type_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 4ZeFgrIJaePrW0YbhN7V8dMphpoq5RxWXAdFCqLrtNJliCtpYenpWhasRwbBlrD

