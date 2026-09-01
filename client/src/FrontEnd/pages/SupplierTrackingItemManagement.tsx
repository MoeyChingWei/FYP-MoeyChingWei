import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Empty, Flex, Input, Modal, Spin, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import {
  hydrateSupplierInvoices,
  hydrateSupplierPayments,
  loadSupplierInvoices,
  loadSupplierPayments,
  type SupplierInvoiceRecord,
  type SupplierPaymentRecord,
} from "../modules/supplierFulfillment/workflow";
import styles from "./TrackingItemManagement.module.css";

const { Text, Title } = Typography;

type SupplierStage = "invoice" | "payment" | "completed";

type SupplierTrackingRow = {
  id: string;
  invoice: SupplierInvoiceRecord;
  payment?: SupplierPaymentRecord;
  stage: SupplierStage;
  statusLabel: string;
  description: string;
  isRejected: boolean;
};

const READ_KEY = "supplier-tracking-items-read-status";

function readItems(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadItems(items: Set<string>): void {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...items]));
  } catch {
    // Keep the page usable when browser storage is unavailable.
  }
}

function stageText(t: (key: string, options?: Record<string, unknown>) => string, stage: SupplierStage): string {
  if (stage === "invoice") return t("supplier.stages.invoice.pending", { defaultValue: "Pending Invoice" });
  if (stage === "payment") return t("supplier.stages.payment.pending", { defaultValue: "Pending Payment" });
  return t("supplier.stages.completed.label", { defaultValue: "Completed" });
}

function progressText(t: (key: string, options?: Record<string, unknown>) => string, stage: SupplierStage): string {
  if (stage === "invoice") return t("supplier.stages.invoice.complete", { defaultValue: "Invoice Approved" });
  if (stage === "payment") return t("supplier.stages.payment.complete", { defaultValue: "Payment Processed" });
  return t("supplier.stages.completed.complete", { defaultValue: "Completed" });
}

function SupplierTrackingProgress({
  activeStage,
  selectedFilter,
  onFilterChange,
  stageCounts,
  isCompact,
  t,
}: {
  activeStage: SupplierStage;
  selectedFilter: SupplierStage | "all";
  onFilterChange: (stage: SupplierStage | "all") => void;
  stageCounts: Record<SupplierStage, number>;
  isCompact: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
}): React.ReactElement {
  const steps: Array<{ key: SupplierStage; icon: React.ReactNode }> = [
    { key: "invoice", icon: <FileTextOutlined /> },
    { key: "payment", icon: <DollarOutlined /> },
    { key: "completed", icon: <CheckCircleOutlined /> },
  ];
  const activeIndex = steps.findIndex((step) => step.key === activeStage);

  return (
    <div className={`${styles.processWrap} ${isCompact ? styles.processWrapCompact : ""}`} style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
      {steps.map((step, index) => {
        const completed = index < activeIndex;
        const active = index === activeIndex;
        const count = stageCounts[step.key] || 0;
        const label = completed ? progressText(t, step.key) : stageText(t, step.key);
        return (
          <div key={step.key} className={styles.stepGroup}>
            <button
              type="button"
              className={`${styles.stepIconButton} ${selectedFilter === step.key ? styles.stepIconButtonSelected : ""} ${count ? styles.stepIconButtonHasItems : ""}`}
              onClick={() => onFilterChange(step.key)}
              title={`${label} (${count})`}
            >
              <div className={`${styles.stepIcon} ${completed ? styles.stepIconCompleted : ""} ${active ? styles.stepIconActive : ""} ${selectedFilter === step.key ? styles.stepIconSelected : ""} ${count ? styles.stepIconHasItems : ""}`}>
                {active ? <ClockCircleOutlined /> : step.icon}
              </div>
              {count > 0 ? <div className={styles.stepCount}>{count}</div> : null}
            </button>
            {!isCompact ? <>
              <div className={`${styles.stepDot} ${completed ? styles.stepDotCompleted : ""} ${active ? styles.stepDotActive : ""}`} />
              <div className={styles.stepLabel}>{label}</div>
            </> : null}
            {index < steps.length - 1 ? <div className={`${styles.stepLine} ${index < activeIndex ? styles.stepLineCompleted : ""}`} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function supplierDescription(t: (key: string, options?: Record<string, unknown>) => string, row: SupplierTrackingRow): string {
  if (row.isRejected) return t("supplier.descriptions.rejected", { defaultValue: "This supplier invoice was rejected. Review the rejection reason and resubmit it." });
  if (row.stage === "invoice") return t("supplier.descriptions.invoice", { defaultValue: "Supplier invoice is waiting for Finance approval." });
  if (row.stage === "payment") return t("supplier.descriptions.payment", { defaultValue: "Invoice approved and waiting for the Payment Team to process." });
  return t("supplier.descriptions.completed", { defaultValue: "Payment has been completed for this supplier invoice." });
}

function statusTag(row: SupplierTrackingRow, t: (key: string, options?: Record<string, unknown>) => string): React.ReactElement {
  if (row.isRejected) return <Tag color="red">{t("supplier.status.rejected", { defaultValue: "Rejected" })}</Tag>;
  if (row.stage === "completed") return <Tag color="green">{t("supplier.status.completed", { defaultValue: "Completed" })}</Tag>;
  return <Tag color={row.stage === "payment" ? "orange" : "blue"}>{row.statusLabel}</Tag>;
}

export default function SupplierTrackingItemManagement(): React.ReactElement {
  const { t } = useTranslation("tracking");
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<SupplierInvoiceRecord[]>([]);
  const [payments, setPayments] = useState<SupplierPaymentRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [stageFilter, setStageFilter] = useState<SupplierStage | "all">("all");
  const [read, setRead] = useState<Set<string>>(() => readItems());
  const [selected, setSelected] = useState<SupplierTrackingRow | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);

  const sync = async (): Promise<void> => {
    setLoading(true);
    try {
      await Promise.all([hydrateSupplierInvoices(), hydrateSupplierPayments()]);
      setInvoices(loadSupplierInvoices());
      setPayments(loadSupplierPayments());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void sync();
    const onSync = (): void => { void sync(); };
    window.addEventListener("storage", onSync);
    window.addEventListener("erp-supplier-invoices", onSync);
    window.addEventListener("erp-supplier-payments", onSync);
    const content = document.getElementById("main-content");
    const onScroll = (): void => setIsCompact(Boolean(content && content.scrollTop > 50));
    content?.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("storage", onSync);
      window.removeEventListener("erp-supplier-invoices", onSync);
      window.removeEventListener("erp-supplier-payments", onSync);
      content?.removeEventListener("scroll", onScroll);
    };
  }, []);

  const rows = useMemo<SupplierTrackingRow[]>(() => {
    const paymentByInvoice = new Map<string, SupplierPaymentRecord>();
    payments.forEach((payment) => paymentByInvoice.set(payment.invoiceLocalId, payment));
    return invoices
      .map((invoice) => {
        const payment = paymentByInvoice.get(invoice.localId);
        const stage: SupplierStage = payment?.status === "PAID" ? "completed" : invoice.status === "APPROVED" || Boolean(payment) ? "payment" : "invoice";
        const row: SupplierTrackingRow = {
          id: `supplier-${invoice.localId}`,
          invoice,
          payment,
          stage,
          statusLabel: stageText(t, stage),
          description: "",
          isRejected: invoice.status === "REJECTED",
        };
        row.description = supplierDescription(t, row);
        return row;
      })
      .sort((a, b) => new Date(b.invoice.createdDate).getTime() - new Date(a.invoice.createdDate).getTime());
  }, [invoices, payments, t]);

  const filteredRows = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return rows.filter((row) => {
      if (stageFilter !== "all" && row.stage !== stageFilter) return false;
      if (!keyword) return true;
      return [row.invoice.invoiceNumber, row.invoice.poNumber, row.invoice.deliveryNo, row.payment?.paymentNumber]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [rows, searchValue, stageFilter]);

  const counts = useMemo(() => {
    const next: Record<SupplierStage, number> = { invoice: 0, payment: 0, completed: 0 };
    rows.forEach((row) => { if (!read.has(row.id)) next[row.stage] += 1; });
    return next;
  }, [read, rows]);
  const inProgress = filteredRows.filter((row) => row.stage !== "completed" && !row.isRejected);
  const completed = filteredRows.filter((row) => row.stage === "completed" || row.isRejected);
  const focused = filteredRows.find((row) => row.id === focusedId) || inProgress[0] || completed[0] || null;

  const renderRow = (row: SupplierTrackingRow, index: number): React.ReactElement => {
    const unread = !read.has(row.id);
    return <div key={row.id} className={`${styles.trackRow} ${focused?.id === row.id ? styles.trackRowFocused : ""} ${unread ? styles.trackRowUnread : ""}`} style={{ animationDelay: `${index * 0.05}s` }} onClick={() => {
      setFocusedId(row.id);
      setSelected(row);
      if (unread) {
        const next = new Set(read);
        next.add(row.id);
        setRead(next);
        saveReadItems(next);
      }
    }}>
      <div className={styles.rowContent}>
        <div className={styles.rowItemBlock}>
          <div className={styles.rowLabel}>{t("supplier.row.invoice", { defaultValue: "Invoice" })}</div>
          <div className={styles.rowValue}>{unread ? <span className={styles.unreadDot} /> : null}{row.invoice.invoiceNumber || row.invoice.poNumber}</div>
          <div className={styles.rowMeta}>{t("supplier.row.createdDate", { defaultValue: "Invoice Date" })}: {row.invoice.invoiceDate || row.invoice.createdDate}</div>
        </div>
        <div className={styles.rowStatusBlock}><div className={styles.rowLabel}>{t("row.status")}</div>{statusTag(row, t)}</div>
        <div className={styles.rowDescriptionBlock}><div className={styles.rowLabel}>{t("row.description")}</div><div className={styles.rowDescription}>{row.description}</div></div>
      </div>
    </div>;
  };

  if (loading) return <div className={styles.page}><Card className={styles.shell}><Flex vertical align="center" justify="center" style={{ minHeight: 400 }} gap={16}><Spin size="large" /><Text type="secondary">{t("page.loadingData")}</Text></Flex></Card></div>;

  return <div className={styles.page}>
    <Card className={styles.shell}>
      <div className={styles.stickyHeader}>
        <Title level={3} className={styles.pageTitle}>{t("supplier.page.title", { defaultValue: "Supplier Tracking" })}</Title>
        <div className={styles.headerSearchRow}>
          <div className={styles.filterInfo}>
            {stageFilter !== "all" ? <Button size="small" onClick={() => setStageFilter("all")}>{t("search.clearFilter")} ({counts[stageFilter]} {t("search.unreadCount")})</Button> : null}
            {Object.values(counts).some(Boolean) ? <Button size="small" className={styles.markAllReadButton} onClick={() => { const next = new Set(read); rows.forEach((row) => next.add(row.id)); setRead(next); saveReadItems(next); }}>{t("search.markAllAsRead")}</Button> : null}
          </div>
          <Input allowClear className={styles.headerSearch} placeholder={t("supplier.search.placeholder", { defaultValue: "Search invoice or payment..." })} prefix={<SearchOutlined />} value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
        </div>
        <SupplierTrackingProgress activeStage={focused?.stage || "invoice"} selectedFilter={stageFilter} onFilterChange={(stage) => { setStageFilter(stage); setFocusedId(null); }} stageCounts={counts} isCompact={isCompact} t={t} />
        {focused && !isCompact ? <div className={styles.focusedStatusBanner}><Text strong>{focused.invoice.invoiceNumber || focused.invoice.poNumber}</Text><span className={styles.focusedDivider}>|</span><span>{focused.invoice.supplierCompanyName || focused.invoice.supplierName || t("supplier.row.invoice", { defaultValue: "Supplier Invoice" })}</span><span className={styles.focusedDivider}>|</span>{statusTag(focused, t)}</div> : null}
      </div>
      <div className={styles.sectionsWrap}>
        <div className={styles.sectionPanel}><div className={styles.sectionTitle}>{t("sections.inProgress")}</div><div className={styles.rowsWrap}>{inProgress.length ? inProgress.map(renderRow) : <Empty description={t("sections.noInProgress")} />}</div></div>
        <div className={styles.sectionPanel}><div className={styles.sectionTitle}>{t("supplier.sections.completed", { defaultValue: "Completed / Rejected" })}</div><div className={styles.rowsWrap}>{completed.length ? completed.map(renderRow) : <Empty description={t("sections.noCompleted")} />}</div></div>
      </div>
    </Card>
    <Modal open={Boolean(selected)} onCancel={() => setSelected(null)} footer={<Button onClick={() => setSelected(null)}>{t("modal.close")}</Button>} width={760} title={t("supplier.modal.title", { defaultValue: "Supplier Payment Tracking Detail" })}>
      {selected ? <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label={t("supplier.row.invoice", { defaultValue: "Invoice" })}>{selected.invoice.invoiceNumber || "-"}</Descriptions.Item>
        <Descriptions.Item label={t("row.status")}>{statusTag(selected, t)}</Descriptions.Item>
        <Descriptions.Item label="PO">{selected.invoice.poNumber || "-"}</Descriptions.Item>
        <Descriptions.Item label="GRN / Delivery">{selected.invoice.deliveryNo || "-"}</Descriptions.Item>
        <Descriptions.Item label={t("supplier.details.amount", { defaultValue: "Amount" })}>{selected.invoice.currency === "MYR" ? "RM" : selected.invoice.currency} {Number(selected.invoice.grandTotal || 0).toFixed(2)}</Descriptions.Item>
        <Descriptions.Item label={t("supplier.details.invoiceDate", { defaultValue: "Invoice Date" })}>{selected.invoice.invoiceDate || "-"}</Descriptions.Item>
        {selected.payment ? <>
          <Descriptions.Item label={t("supplier.details.payment", { defaultValue: "Payment" })}>{selected.payment.paymentNumber || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("supplier.details.paidDate", { defaultValue: "Paid Date" })}>{selected.payment.paidDate || "-"}</Descriptions.Item>
          <Descriptions.Item label={t("supplier.details.reference", { defaultValue: "Transaction Reference" })}>{selected.payment.transactionReference || "-"}</Descriptions.Item>
        </> : null}
        {selected.invoice.rejectionReason ? <Descriptions.Item label={t("supplier.details.rejectionReason", { defaultValue: "Rejection Reason" })} span={2}>{selected.invoice.rejectionReason}</Descriptions.Item> : null}
        <Descriptions.Item label={t("row.description")} span={2}>{selected.description}</Descriptions.Item>
      </Descriptions> : null}
    </Modal>
  </div>;
}
