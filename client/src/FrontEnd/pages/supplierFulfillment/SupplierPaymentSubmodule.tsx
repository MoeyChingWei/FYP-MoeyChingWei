import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Input,
  Button,
  Modal,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";
import {
  hydrateSupplierPayments,
  loadSupplierPayments,
  type SupplierPaymentRecord,
} from "../../modules/supplierFulfillment/workflow";
import SupplierFinanceDocumentActions from "../../components/shared/SupplierFinanceDocumentActions";
import styles from "./SupplierPaymentSubmodule.module.css";

const { Text, Title } = Typography;

function paymentStatusLabel(status: SupplierPaymentRecord["status"], t: (key: string, options?: Record<string, unknown>) => string): string {
  const key = status === "PAID" ? "paid" : status === "FAILED" ? "failed" : status === "PROCESSING" ? "processing" : "pending";
  return t(`payment.status.${key}`, { defaultValue: status === "PAID" ? "Completed" : status === "PENDING_PAYMENT" ? "Pending Payment" : status });
}

function paymentStatusTag(status: SupplierPaymentRecord["status"], t: (key: string, options?: Record<string, unknown>) => string): React.ReactElement {
  const color = status === "PAID" ? "green" : status === "FAILED" ? "red" : status === "PROCESSING" ? "blue" : "orange";
  return <Tag color={color}>{paymentStatusLabel(status, t)}</Tag>;
}

function money(row: SupplierPaymentRecord): string {
  return `${row.currency === "MYR" ? "RM" : row.currency} ${Number(row.amount || 0).toFixed(2)}`;
}

export default function SupplierPaymentSubmodule(): React.ReactElement {
  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const user = useMemo(() => getSessionUser(), []);
  const [rows, setRows] = useState<SupplierPaymentRecord[]>([]);
  const [selected, setSelected] = useState<SupplierPaymentRecord | null>(null);
  const [proofPreview, setProofPreview] = useState<{ url: string; name: string; type?: string } | null>(null);
  const [search, setSearch] = useState("");

  const sync = async (): Promise<void> => {
    await hydrateSupplierPayments();
    setRows(loadSupplierPayments());
  };

  useEffect(() => {
    if (!user || user.role !== UserRole.SUPPLIER) return;
    void sync();
    const onSync = (): void => { void sync(); };
    window.addEventListener("storage", onSync);
    window.addEventListener("erp-supplier-payments", onSync);
    return () => {
      window.removeEventListener("storage", onSync);
      window.removeEventListener("erp-supplier-payments", onSync);
    };
  }, [user]);

  const visibleRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return rows
      .filter((row) => {
        if (!user || user.role !== UserRole.SUPPLIER) return false;
        return (row.supplierId != null && row.supplierId === user.id) || row.supplierEmail?.toLowerCase() === user.email.toLowerCase();
      })
      .filter((row) => !keyword || [row.paymentNumber, row.invoiceNumber, row.poNumber, row.grnNumber, row.transactionReference].some((value) => String(value || "").toLowerCase().includes(keyword)))
      .sort((a, b) => Date.parse(b.createdDate || "") - Date.parse(a.createdDate || ""));
  }, [rows, search, user]);

  const pending = visibleRows.filter((row) => row.status !== "PAID");
  const completed = visibleRows.filter((row) => row.status === "PAID");
  const totalPending = pending.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const totalCompleted = completed.reduce((sum, row) => sum + Number(row.amount || 0), 0);

  const columns = [
    { title: t("payment.fields.paymentNumber", { defaultValue: "Payment Number" }), dataIndex: "paymentNumber", key: "paymentNumber" },
    { title: t("payment.fields.invoiceNumber", { defaultValue: "Invoice Number" }), dataIndex: "invoiceNumber", key: "invoiceNumber", render: (value: string | undefined) => value || "-" },
    { title: "PO", dataIndex: "poNumber", key: "poNumber", render: (value: string | undefined) => value || "-" },
    { title: t("payment.fields.amount", { defaultValue: "Amount" }), key: "amount", render: (_: unknown, row: SupplierPaymentRecord) => money(row), sorter: (a: SupplierPaymentRecord, b: SupplierPaymentRecord) => a.amount - b.amount },
    { title: t("payment.fields.status", { defaultValue: "Status" }), dataIndex: "status", key: "status", render: (value: SupplierPaymentRecord["status"]) => paymentStatusTag(value, t) },
    { title: t("payment.fields.action", { defaultValue: "View" }), key: "action", render: (_: unknown, row: SupplierPaymentRecord) => <Typography.Link onClick={() => setSelected(row)}><EyeOutlined /> {t("payment.actions.view", { defaultValue: "View details" })}</Typography.Link> },
  ];

  const table = (dataSource: SupplierPaymentRecord[]): React.ReactElement => <Table rowKey="localId" dataSource={dataSource} columns={columns} pagination={{ pageSize: 8 }} scroll={{ x: 850 }} locale={{ emptyText: <Empty description={t("payment.empty", { defaultValue: "No payment records found." })} /> }} />;

  if (!user || user.role !== UserRole.SUPPLIER) return <Card><Empty description={t("payment.accessRequired", { defaultValue: "Supplier access is required." })} /></Card>;

  return <div className={styles.page}>
    <Flex justify="space-between" align="center" className={styles.header} wrap="wrap" gap={12}>
      <Flex align="center" gap={8}><Typography.Link onClick={() => navigate("/supplier-overview")} aria-label={t("payment.actions.back", { defaultValue: "Back" })}><ArrowLeftOutlined /></Typography.Link><Title level={3} style={{ margin: 0 }}>{t("payment.title", { defaultValue: "Supplier Payment" })}</Title></Flex>
      <Input allowClear prefix={<SearchOutlined />} value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("payment.searchPlaceholder", { defaultValue: "Search payment, invoice or PO..." })} className={styles.search} />
    </Flex>
    <div className={styles.summaryGrid}>
      <Card className={styles.summaryCard}><Statistic title={t("payment.summary.pendingCount", { defaultValue: "Pending Payment" })} value={pending.length} /></Card>
      <Card className={styles.summaryCard}><Statistic title={t("payment.summary.pendingAmount", { defaultValue: "Pending Amount" })} value={totalPending} precision={2} prefix="RM " /></Card>
      <Card className={styles.summaryCard}><Statistic title={t("payment.summary.completedCount", { defaultValue: "Completed Payments" })} value={completed.length} /></Card>
      <Card className={styles.summaryCard}><Statistic title={t("payment.summary.completedAmount", { defaultValue: "Completed Amount" })} value={totalCompleted} precision={2} prefix="RM " /></Card>
    </div>
    <Card>
      <Tabs items={[
        { key: "pending", label: t("payment.tabs.pending", { count: pending.length, defaultValue: "Pending ({{count}})" }), children: table(pending) },
        { key: "completed", label: t("payment.tabs.completed", { count: completed.length, defaultValue: "Completed ({{count}})" }), children: table(completed) },
      ]} />
    </Card>
    <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} width={620} title={selected ? <Space><CheckCircleOutlined />{selected.paymentNumber}</Space> : t("payment.details.title", { defaultValue: "Payment Details" })}>
      {selected ? <div className={styles.detail}>
        <div className={styles.statusLine}><Text type="secondary">{t("payment.details.currentStatus", { defaultValue: "Current status" })}</Text>{paymentStatusTag(selected.status, t)}</div>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label={t("payment.fields.paymentNumber", { defaultValue: "Payment Number" })}>{selected.paymentNumber || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.fields.invoiceNumber", { defaultValue: "Invoice Number" })}>{selected.invoiceNumber || selected.invoiceLocalId || "-"}</Descriptions.Item>
          <Descriptions.Item label="PO">{selected.poNumber || "-"}</Descriptions.Item>
          <Descriptions.Item label="GRN / Delivery">{selected.grnNumber || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.fields.amount", { defaultValue: "Amount" })}>{money(selected)}</Descriptions.Item>
          <Descriptions.Item label={t("payment.fields.paymentTerms", { defaultValue: "Payment Terms" })}>{selected.paymentTerms || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.details.invoiceDate", { defaultValue: "Invoice Date" })}>{selected.invoiceDate || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.details.paidDate", { defaultValue: "Paid Date" })}>{selected.paidDate || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.details.method", { defaultValue: "Payment Method" })}>{selected.paymentMethod || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.details.reference", { defaultValue: "Transaction Reference" })}>{selected.transactionReference || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("payment.details.processedBy", { defaultValue: "Processed By" })}>{selected.processedBy || "-"}</Descriptions.Item>
          {selected.remarks ? <Descriptions.Item label={t("payment.details.remarks", { defaultValue: "Remarks" })}>{selected.remarks}</Descriptions.Item> : null}
        </Descriptions>
        <div className={styles.documentActions}>
          <SupplierFinanceDocumentActions kind="payment" localId={selected.localId} documentNumber={selected.paymentNumber} />
        </div>
        {selected.attachmentDataUrl ? <div className={styles.proofSection}>
          <Text strong>{t("payment.details.proof", { defaultValue: "Payment Proof" })}</Text>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setProofPreview({ url: selected.attachmentDataUrl!, name: selected.attachmentName || t("payment.details.proof", { defaultValue: "Payment Proof" }), type: selected.attachmentType })}
          >
            {selected.attachmentName || t("payment.details.viewProof", { defaultValue: "View proof" })}
          </Button>
          <a href={selected.attachmentDataUrl} download={selected.attachmentName || "payment-proof"}>
            {t("payment.details.downloadProof", { defaultValue: "Download" })}
          </a>
        </div> : null}
        {selected.paymentHistory?.length ? <div className={styles.history}><Text strong>{t("payment.details.history", { defaultValue: "Payment History" })}</Text>{selected.paymentHistory.map((entry) => <div className={styles.historyRow} key={`${entry.action}-${entry.date}`}><ClockCircleOutlined /><span><Text strong>{entry.action}</Text><br /><Text type="secondary">{entry.by} · {new Date(entry.date).toLocaleString()}</Text>{entry.transactionReference ? <><br /><Text type="secondary">{entry.transactionReference}</Text></> : null}</span></div>)}</div> : null}
      </div> : null}
    </Drawer>
    <Modal
      open={Boolean(proofPreview)}
      title={proofPreview?.name || t("payment.details.proof", { defaultValue: "Payment Proof" })}
      footer={null}
      width={900}
      onCancel={() => setProofPreview(null)}
      destroyOnHidden
    >
      {proofPreview ? (proofPreview.type?.startsWith("image/") ? <img src={proofPreview.url} alt={proofPreview.name} className={styles.proofImage} /> : <iframe src={proofPreview.url} title={proofPreview.name} className={styles.proofFrame} />) : null}
    </Modal>
  </div>;
}
