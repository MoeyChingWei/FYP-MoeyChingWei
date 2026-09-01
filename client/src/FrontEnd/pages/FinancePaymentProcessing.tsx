import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Descriptions, Divider, Drawer, Empty, Input, Modal, Select, Space, Statistic, Table, Tabs, Tag, Timeline, Typography, Upload, message } from "antd";
import { ArrowLeftOutlined, BankOutlined, CheckCircleOutlined, ClockCircleOutlined, CreditCardOutlined, DownloadOutlined, EyeOutlined, FileTextOutlined, FilterOutlined, PaperClipOutlined, SearchOutlined, WarningOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSessionUser } from "../shared/auth/session";
import { formatPaymentTerm } from "../shared/utils/paymentTerms";
import { UserRole } from "../shared/types/roles";
import {
  hydrateSupplierPayments,
  loadSupplierPayments,
  updateSupplierPayment,
  type SupplierPaymentRecord,
} from "../modules/supplierFulfillment/workflow";
import { processSupplierPayment } from "../shared/api/supplierFinance";
import SupplierFinanceDocumentActions from "../components/shared/SupplierFinanceDocumentActions";
import styles from "./purchasing/ApprovalDetailSubmodule.module.css";

const { Title, Text } = Typography;
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_ATTACHMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

type Attachment = Pick<SupplierPaymentRecord, "attachmentName" | "attachmentType" | "attachmentDataUrl">;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read attachment"));
    reader.readAsDataURL(file);
  });
}

export default function FinancePaymentProcessing(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("finance");
  const user = useMemo(() => getSessionUser(), []);
  const [rows, setRows] = useState<SupplierPaymentRecord[]>([]);
  const [selected, setSelected] = useState<SupplierPaymentRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paidDate, setPaidDate] = useState(new Date().toISOString().slice(0, 10));
  const [transactionReference, setTransactionReference] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [infoRow, setInfoRow] = useState<SupplierPaymentRecord | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; name: string; type?: string } | null>(null);

  const sync = async (): Promise<void> => {
    await hydrateSupplierPayments();
    setRows(loadSupplierPayments());
  };

  useEffect(() => {
    if (!user || (user.role !== UserRole.PAYMENT_TEAM && user.role !== UserRole.ADMIN)) {
      navigate("/overview", { replace: true });
      return;
    }
    void sync();
    const onSync = (): void => { void sync(); };
    window.addEventListener("storage", onSync);
    window.addEventListener("erp-supplier-payments", onSync);
    return () => {
      window.removeEventListener("storage", onSync);
      window.removeEventListener("erp-supplier-payments", onSync);
    };
  }, [navigate, user]);

  const pending = useMemo(() => rows.filter((row) => row.status === "PENDING_PAYMENT"), [rows]);
  const paid = useMemo(() => rows.filter((row) => row.status === "PAID"), [rows]);

  const dueDate = (row: SupplierPaymentRecord): Date | null => {
    if (!row.invoiceDate) return null;
    const days = Number(String(row.paymentTerms || "").match(/\d+/)?.[0]);
    if (!Number.isFinite(days)) return null;
    const date = new Date(`${row.invoiceDate}T00:00:00`);
    date.setDate(date.getDate() + days);
    return date;
  };
  const amount = (row: SupplierPaymentRecord): number => Number(row.amount || 0);
  const currencyAmount = (row: SupplierPaymentRecord): string => `${row.currency === "MYR" ? "RM" : row.currency} ${amount(row).toFixed(2)}`;
  const statusLabel = (status: string): string => {
    if (status === "PENDING_PAYMENT") return t("payment.status.pendingPayment");
    if (status === "PAID") return t("payment.status.paid");
    return status;
  };
  const matchesFilters = (row: SupplierPaymentRecord): boolean => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [row.paymentNumber, row.invoiceNumber, row.poNumber, row.grnNumber, row.supplierName, row.supplierEmail, row.transactionReference].some((value) => String(value || "").toLowerCase().includes(term));
    const matchesStatus = statusFilter === "all" || row.status === statusFilter;
    const matchesMethod = methodFilter === "all" || (row.paymentMethod || "Bank Transfer") === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  };
  const sortRows = (source: SupplierPaymentRecord[]): SupplierPaymentRecord[] => [...source].filter(matchesFilters).sort((a, b) => {
    if (sortBy === "amount") return amount(b) - amount(a);
    if (sortBy === "supplier") return String(a.supplierName || a.supplierEmail || "").localeCompare(String(b.supplierName || b.supplierEmail || ""));
    const aDate = sortBy === "paidDate" ? a.paidDate : dueDate(a)?.toISOString();
    const bDate = sortBy === "paidDate" ? b.paidDate : dueDate(b)?.toISOString();
    return String(aDate || "9999").localeCompare(String(bDate || "9999"));
  });
  const filteredPending = useMemo(() => sortRows(pending), [pending, search, statusFilter, methodFilter, sortBy]);
  const filteredPaid = useMemo(() => sortRows(paid), [paid, search, statusFilter, methodFilter, sortBy]);
  const pendingAmount = useMemo(() => pending.reduce((sum, row) => sum + amount(row), 0), [pending]);
  const paidAmount = useMemo(() => paid.reduce((sum, row) => sum + amount(row), 0), [paid]);
  const today = new Date();
  const overdueCount = useMemo(() => pending.filter((row) => { const date = dueDate(row); return date ? date < today : false; }).length, [pending]);
  const dueSoonCount = useMemo(() => pending.filter((row) => { const date = dueDate(row); if (!date) return false; const days = (date.getTime() - today.getTime()) / 86400000; return days >= 0 && days <= 7; }).length, [pending]);

  const openPayment = (row: SupplierPaymentRecord): void => {
    setSelected(row);
    setPaymentMethod(row.paymentMethod || "Bank Transfer");
    setPaidDate(new Date().toISOString().slice(0, 10));
    setTransactionReference("");
    setRemarks("");
    setAttachment(null);
  };

  const handleAttachment = async (file: RcFile): Promise<boolean> => {
    if (!ACCEPTED_ATTACHMENT_TYPES.includes(file.type)) {
      message.error(t("payment.onlyAllowed"));
      return false;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      message.error(t("payment.proofTooLarge"));
      return false;
    }
    try {
      setAttachment({
        attachmentName: file.name,
        attachmentType: file.type,
        attachmentDataUrl: await readFileAsDataUrl(file),
      });
    } catch {
      message.error(t("payment.proofReadError"));
    }
    return false;
  };

  const processPayment = async (): Promise<void> => {
    if (!selected || !paymentMethod || !transactionReference.trim() || !paidDate || !attachment?.attachmentDataUrl) return;
    const currentPayment = loadSupplierPayments().find((row) => row.localId === selected.localId);
    if (!currentPayment || currentPayment.status !== "PENDING_PAYMENT") {
      message.warning(t("payment.stale"));
      setSelected(null);
      return;
    }
    try {
      const payment = await processSupplierPayment(selected.localId, {
        paymentMethod,
        paidDate,
        transactionReference: transactionReference.trim(),
        remarks: remarks.trim() || undefined,
        attachment,
      });
      updateSupplierPayment(selected.localId, () => payment);
      setSelected(null);
      message.success(t("payment.paid"));
      void sync();
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("payment.processError"));
      // Reconcile stale localStorage after a server-side conflict (for example,
      // when another tab or an earlier attempt already marked it as paid).
      void sync();
    }
  };

  if (!user || (user.role !== UserRole.PAYMENT_TEAM && user.role !== UserRole.ADMIN)) {
    return <Card><Empty description={t("payment.accessRequired")} /></Card>;
  }

  const pendingColumns = [
    { title: t("payment.columns.payment"), dataIndex: "paymentNumber", render: (value: string, row: SupplierPaymentRecord) => <Space direction="vertical" size={0}><Text strong>{value}</Text><Text type="secondary">{row.invoiceNumber || row.invoiceLocalId}</Text></Space> },
    { title: t("payment.columns.supplier"), dataIndex: "supplierName", render: (value: string | undefined, row: SupplierPaymentRecord) => <Space direction="vertical" size={0}><Text>{value || row.supplierEmail || "-"}</Text><Text type="secondary">{row.poNumber || "No PO reference"}</Text></Space> },
    { title: t("payment.columns.amount"), key: "amount", render: (_: unknown, row: SupplierPaymentRecord) => <Text strong>{currencyAmount(row)}</Text> },
    { title: t("payment.columns.paymentTerms"), dataIndex: "paymentTerms", render: (value: string | undefined, row: SupplierPaymentRecord) => <Space direction="vertical" size={0}><Text>{formatPaymentTerm(value)}</Text>{dueDate(row) ? <Text type={dueDate(row)! < today ? "danger" : "secondary"}>{dueDate(row)!.toLocaleDateString()}</Text> : null}</Space> },
    { title: t("payment.columns.status"), dataIndex: "status", render: (value: string, row: SupplierPaymentRecord) => <Tag color={dueDate(row) && dueDate(row)! < today ? "red" : "orange"}>{dueDate(row) && dueDate(row)! < today ? t("payment.overdue") : statusLabel(value)}</Tag> },
    { title: t("payment.columns.action"), key: "action", width: 245, render: (_: unknown, row: SupplierPaymentRecord) => <Space wrap><Button icon={<EyeOutlined />} onClick={() => setInfoRow(row)}>{t("payment.view")}</Button><Button type="primary" icon={<CreditCardOutlined />} onClick={() => openPayment(row)}>{t("payment.process")}</Button></Space> },
  ];
  const paidColumns = [
    { title: t("payment.columns.payment"), dataIndex: "paymentNumber", render: (value: string, row: SupplierPaymentRecord) => <Space direction="vertical" size={0}><Text strong>{value}</Text><Text type="secondary">{row.invoiceNumber || row.invoiceLocalId}</Text></Space> },
    { title: t("payment.columns.supplier"), dataIndex: "supplierName", render: (value: string | undefined, row: SupplierPaymentRecord) => value || row.supplierEmail || "-" },
    { title: t("payment.columns.amount"), key: "amount", render: (_: unknown, row: SupplierPaymentRecord) => <Text strong>{currencyAmount(row)}</Text> },
    { title: t("payment.columns.paidDate"), dataIndex: "paidDate", render: (value: string | undefined) => value || "-" },
    { title: t("payment.columns.reference"), dataIndex: "transactionReference", render: (value: string | undefined) => value || "-" },
    { title: t("payment.columns.action"), key: "action", width: 245, render: (_: unknown, row: SupplierPaymentRecord) => <Space wrap><Button icon={<EyeOutlined />} onClick={() => setInfoRow(row)}>{t("payment.view")}</Button><SupplierFinanceDocumentActions kind="payment" localId={row.localId} documentNumber={row.paymentNumber} disabled={!row.paymentAdvicePdf} /></Space> },
  ];

  return <div className={styles.page}>
    <div className={styles.header}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/finance")} aria-label={t("payment.back")} title={t("payment.back")} />
        <Title level={3} style={{ margin: 0 }}>{t("payment.title")}</Title>
      </div>
      <Tag color="blue">{t("payment.pending", { count: pending.length })}</Tag>
    </div>
    <div className={styles.metricsGrid}>
      <Card className={styles.metricCard}><Statistic title={t("payment.metrics.pendingAmount")} value={pendingAmount} precision={2} prefix="RM " valueStyle={{ color: "#0f766e" }} /></Card>
      <Card className={styles.metricCard}><Statistic title={t("payment.metrics.dueSoon")} value={dueSoonCount} prefix={<ClockCircleOutlined />} /></Card>
      <Card className={styles.metricCard}><Statistic title={t("payment.metrics.overdue")} value={overdueCount} prefix={<WarningOutlined />} valueStyle={{ color: overdueCount ? "#dc2626" : undefined }} /></Card>
      <Card className={styles.metricCard}><Statistic title={t("payment.metrics.paidAmount")} value={paidAmount} precision={2} prefix="RM " valueStyle={{ color: "#2563eb" }} /></Card>
    </div>
    <Card>
      <div className={styles.toolbar}>
        <Input allowClear prefix={<SearchOutlined />} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("payment.searchPlaceholder")} className={styles.searchInput} />
        <Select value={statusFilter} onChange={setStatusFilter} suffixIcon={<FilterOutlined />} options={[{ value: "all", label: t("payment.filters.allStatuses") }, { value: "PENDING_PAYMENT", label: t("payment.filters.pending") }, { value: "PAID", label: t("payment.filters.paid") }]} />
        <Select value={methodFilter} onChange={setMethodFilter} options={[{ value: "all", label: t("payment.filters.allMethods") }, { value: "Bank Transfer", label: "Bank Transfer" }, { value: "GIRO", label: "GIRO" }, { value: "Cheque", label: "Cheque" }]} />
        <Select value={sortBy} onChange={setSortBy} options={[{ value: "dueDate", label: t("payment.sort.dueDate") }, { value: "amount", label: t("payment.sort.amount") }, { value: "supplier", label: t("payment.sort.supplier") }, { value: "paidDate", label: t("payment.sort.paidDate") }]} />
      </div>
      {(search || statusFilter !== "all" || methodFilter !== "all") ? <Alert type="info" showIcon message={t("payment.filterSummary", { count: filteredPending.length + filteredPaid.length })} className={styles.filterSummary} /> : null}
      <Tabs
        items={[
          {
            key: "pending",
            label: t("payment.pendingTab", { count: pending.length }),
            children: <Table rowKey="localId" dataSource={filteredPending} pagination={{ pageSize: 10 }} scroll={{ x: 1100 }} locale={{ emptyText: <Empty description={t("payment.noPending")} /> }} columns={pendingColumns} />,
          },
          {
            key: "paid",
            label: t("payment.paidTab", { count: paid.length }),
            children: <Table rowKey="localId" dataSource={filteredPaid} pagination={{ pageSize: 10 }} scroll={{ x: 1100 }} locale={{ emptyText: <Empty description={t("payment.noPaid")} /> }} columns={paidColumns} />,
          },
        ]}
      />
    </Card>
    <Drawer
      open={Boolean(infoRow)}
      onClose={() => setInfoRow(null)}
      width={560}
      title={infoRow ? <Space><FileTextOutlined />{t("payment.informationTitle", { paymentNumber: infoRow.paymentNumber })}</Space> : t("payment.viewInformation")}
    >
      {infoRow ? <div className={styles.infoDrawer}>
        {infoRow.status === "PENDING_PAYMENT" && dueDate(infoRow) && dueDate(infoRow)! < today ? <Alert type="warning" showIcon message={t("payment.overdueAlert")} /> : null}
        <div className={styles.infoAmount}><Text type="secondary">{t("payment.columns.amount")}</Text><Text strong>{currencyAmount(infoRow)}</Text><Tag color={infoRow.status === "PAID" ? "green" : "orange"}>{statusLabel(infoRow.status)}</Tag></div>
        <Divider>{t("payment.informationSections.document")}</Divider>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={t("payment.columns.payment")}>{infoRow.paymentNumber}</Descriptions.Item>
          <Descriptions.Item label={t("payment.columns.invoice")}>{infoRow.invoiceNumber || infoRow.invoiceLocalId}</Descriptions.Item>
          <Descriptions.Item label="PO">{infoRow.poNumber || "-"}</Descriptions.Item>
          <Descriptions.Item label="GRN">{infoRow.grnNumber || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.columns.paymentTerms")}>{formatPaymentTerm(infoRow.paymentTerms)}</Descriptions.Item>
          <Descriptions.Item label={t("payment.invoiceDate")}>{infoRow.invoiceDate || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.dueDate")}>{dueDate(infoRow)?.toLocaleDateString() || "-"}</Descriptions.Item>
        </Descriptions>
        <Divider>{t("payment.informationSections.supplier")}</Divider>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={t("payment.columns.supplier")}>{infoRow.supplierName || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.supplierEmail")}>{infoRow.supplierEmail || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.bankDetails")}><Space><BankOutlined />{infoRow.bankDetails?.bankName || "-"}</Space></Descriptions.Item>
          <Descriptions.Item label={t("payment.accountName")}>{infoRow.bankDetails?.accountName || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.accountNumber")}>{infoRow.bankDetails?.accountNumber || "-"}</Descriptions.Item>
        </Descriptions>
        {infoRow.status === "PAID" ? <>
          <Divider>{t("payment.informationSections.payment")}</Divider>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t("payment.method")}>{infoRow.paymentMethod || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("payment.paidDate")}>{infoRow.paidDate || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("payment.reference")}>{infoRow.transactionReference || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("payment.processedBy")}>{infoRow.processedBy || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("payment.remarks")}>{infoRow.remarks || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("payment.proof")}>{infoRow.attachmentDataUrl ? <Button type="link" icon={<EyeOutlined />} onClick={() => setPreviewAttachment({ url: infoRow.attachmentDataUrl!, name: infoRow.attachmentName || t("payment.downloadProof"), type: infoRow.attachmentType })}>{infoRow.attachmentName || t("payment.view")}</Button> : "-"}</Descriptions.Item>
          </Descriptions>
        </> : <Alert type="info" showIcon message={t("payment.pendingInfo")} />}
        {infoRow.paymentHistory?.length ? <>
          <Divider>{t("payment.informationSections.history")}</Divider>
          <Timeline items={infoRow.paymentHistory.map((entry) => ({ dot: entry.action.toLowerCase().includes("paid") ? <CheckCircleOutlined /> : <ClockCircleOutlined />, children: <Space direction="vertical" size={0}><Text strong>{entry.action}</Text><Text type="secondary">{entry.by} - {new Date(entry.date).toLocaleString()}</Text>{entry.transactionReference ? <Text type="secondary">{entry.transactionReference}</Text> : null}</Space> }))} />
        </> : null}
      </div> : null}
    </Drawer>
    <Modal
      open={Boolean(previewAttachment)}
      title={previewAttachment?.name || t("payment.proof")}
      footer={null}
      width={900}
      onCancel={() => setPreviewAttachment(null)}
      destroyOnHidden
    >
      {previewAttachment ? (previewAttachment.type?.startsWith("image/") ? <img src={previewAttachment.url} alt={previewAttachment.name} className={styles.attachmentPreviewImage} /> : <iframe src={previewAttachment.url} title={previewAttachment.name} className={styles.attachmentPreviewFrame} />) : null}
    </Modal>
    <Modal
      open={Boolean(selected)}
      title={selected ? t("payment.dialogTitle", { paymentNumber: selected.paymentNumber }) : t("payment.process")}
      okText={t("payment.markPaid")}
      okButtonProps={{ disabled: !transactionReference.trim() || !paidDate || !attachment?.attachmentDataUrl }}
      onCancel={() => setSelected(null)}
      onOk={() => void processPayment()}
      destroyOnHidden
    >
      {selected ? <>
        <Text type="secondary">{selected.invoiceNumber || selected.invoiceLocalId} · {selected.currency === "MYR" ? "RM" : selected.currency} {Number(selected.amount || 0).toFixed(2)}</Text>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <label>{t("payment.method")}<Select value={paymentMethod} onChange={setPaymentMethod} style={{ width: "100%", marginTop: 4 }} options={[{ value: "Bank Transfer", label: "Bank Transfer" }, { value: "GIRO", label: "GIRO" }, { value: "Cheque", label: "Cheque" }]} /></label>
          <label>{t("payment.paidDate")}<Input type="date" value={paidDate} onChange={(event) => setPaidDate(event.target.value)} style={{ marginTop: 4 }} /></label>
          <label>{t("payment.reference")}<Input value={transactionReference} onChange={(event) => setTransactionReference(event.target.value)} placeholder={t("payment.referencePlaceholder")} style={{ marginTop: 4 }} /></label>
          <label className={styles.paymentProofField}>
            <span className={styles.fieldLabel}>{t("payment.proof")}</span>
            <div className={styles.paymentProofControl}>
              <Upload accept=".pdf,.jpg,.jpeg,.png" beforeUpload={handleAttachment} showUploadList={false}>
                <Button icon={<PaperClipOutlined />}>{t("payment.chooseAttachment")}</Button>
              </Upload>
              {attachment?.attachmentName ? <Text type="secondary" className={styles.attachmentMeta}>{t("payment.attached", { name: attachment.attachmentName })}</Text> : <Text type="secondary" className={styles.attachmentMeta}>{t("payment.proofHint")}</Text>}
            </div>
          </label>
          <label>{t("payment.remarks")}<Input.TextArea rows={3} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder={t("payment.remarksPlaceholder")} style={{ marginTop: 4 }} /></label>
        </div>
      </> : null}
    </Modal>
  </div>;
}
