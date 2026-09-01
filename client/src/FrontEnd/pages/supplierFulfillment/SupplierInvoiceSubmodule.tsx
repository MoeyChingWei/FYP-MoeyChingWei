import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Empty, Flex, Table, Tabs, Tag, Typography, message } from "antd";
import { ArrowLeftOutlined, CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { formatPaymentTerm } from "../../shared/utils/paymentTerms";
import { canApproveSupplierInvoices, UserRole } from "../../shared/types/roles";
import { hydrateSupplierInvoices, loadSupplierInvoices, updateSupplierInvoice, type SupplierInvoiceRecord } from "../../modules/supplierFulfillment/workflow";
import { submitSupplierInvoice } from "../../shared/api/supplierFinance";
import SupplierFinanceDocumentActions from "../../components/shared/SupplierFinanceDocumentActions";
import { computeDraftLineAmountAfterTax, computeTaxBreakdown } from "../../modules/purchasing/requestCreation/constants";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";
import styles from "../purchasing/ApprovalDetailSubmodule.module.css";

const { Paragraph, Title } = Typography;

function currencyLabel(currency: string, amount: number): string { return `${currency === "MYR" ? "RM" : currency} ${amount.toFixed(2)}`; }
function statusColor(status: SupplierInvoiceRecord["status"]): string {
  if (status === "SUBMITTED") return "blue";
  if (status === "APPROVED") return "green";
  if (status === "REJECTED") return "red";
  return "orange";
}

function ItemRow({ item, currency }: { item: DraftLineItem; currency: string }): React.ReactElement {
  return <div className={styles.itemCard}>
    <div className={styles.itemHeader}><h4 className={styles.itemTitle}>{item.itemName}</h4><Tag>{item.itemCategory || "-"}</Tag></div>
    <div className={styles.itemGrid}>
      <div className={`${styles.detailBlock} ${styles.detailWide}`}><span className={styles.detailLabel}>Description</span><div className={styles.detailValue}>{item.itemDescription || "-"}</div></div>
      <div className={styles.detailBlock}><span className={styles.detailLabel}>Quantity</span><div className={styles.detailValue}>{item.quantity}</div></div>
      <div className={styles.detailBlock}><span className={styles.detailLabel}>Unit</span><div className={styles.detailValue}>{item.unitOfMeasurement || "-"}</div></div>
      <div className={styles.detailBlock}><span className={styles.detailLabel}>Unit price</span><div className={styles.detailValue}>{currencyLabel(currency, item.unitPrice)}</div></div>
      <div className={styles.detailBlock}><span className={styles.detailLabel}>Line total</span><div className={styles.detailValue}>{currencyLabel(currency, computeDraftLineAmountAfterTax(item))}</div></div>
    </div>
  </div>;
}

export default function SupplierInvoiceSubmodule(): React.ReactElement {
  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const location = useLocation();
  const { localId } = useParams();
  const [rows, setRows] = useState<SupplierInvoiceRecord[]>([]);
  const sessionUser = useMemo(() => getSessionUser(), []);
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const detailBackPath = returnTo === "/finance/invoice-approval" || canApproveSupplierInvoices(sessionUser?.role)
    ? "/finance/invoice-approval"
    : "/supplier-overview/invoice";

  useEffect(() => {
    const sync = async (): Promise<void> => { await hydrateSupplierInvoices(); setRows(loadSupplierInvoices()); };
    const handleSync = (): void => { void sync(); };
    void sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-invoices", handleSync);
    return () => { window.removeEventListener("storage", handleSync); window.removeEventListener("erp-supplier-invoices", handleSync); };
  }, []);

  const visibleRows = useMemo(() => rows.filter((row) => {
    if (!sessionUser || sessionUser.role !== UserRole.SUPPLIER) return true;
    return (row.supplierId != null && row.supplierId === sessionUser.id) || row.supplierEmail === sessionUser.email;
  }), [rows, sessionUser]);
  const orderedRows = useMemo(() => {
    const dateValue = (invoice: SupplierInvoiceRecord): number => {
      const date = invoice.status === "APPROVED"
        ? invoice.approvedDate || invoice.reviewedDate || invoice.submittedDate || invoice.createdDate
        : invoice.submittedDate || invoice.createdDate;
      const timestamp = date ? Date.parse(date) : 0;
      return Number.isFinite(timestamp) ? timestamp : 0;
    };

    return [...visibleRows].sort((a, b) => dateValue(b) - dateValue(a));
  }, [visibleRows]);
  const row = useMemo(() => visibleRows.find((item) => item.localId === localId), [localId, visibleRows]);

  const onSubmit = async (): Promise<void> => {
    if (!row) return;
    if (row.status !== "DRAFT" && row.status !== "REJECTED") return;
    if (!row.grnLocalId || !row.poNumber || !row.supplierEmail || !row.items.length || !Number.isFinite(row.grandTotal) || row.grandTotal <= 0) {
      message.error("This invoice is missing required supplier, PO/GRN, item or amount information");
      return;
    }
    try {
      const invoice = await submitSupplierInvoice(row.localId);
      updateSupplierInvoice(row.localId, () => invoice);
      message.success(t("invoice.messages.submitted"));
      navigate("/supplier-overview/invoice");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Unable to submit supplier invoice");
    }
  };

  if (localId) {
    if (!row) return <Card><Empty description={t("invoice.messages.notFound")} /></Card>;
    const invoiceRules = row.supplierTaxRules?.length ? row.supplierTaxRules : (row.supplierTaxApplies && row.supplierTaxType ? [{ taxType: row.supplierTaxType, taxRate: row.supplierTaxRate ?? 0 }] : []);
    const invoiceTaxBreakdown = computeTaxBreakdown(row.subtotal, invoiceRules);
    return <Card><div className={styles.page}>
      <div className={styles.header}><Flex align="center" gap={8}><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(detailBackPath)} aria-label={t("invoice.actions.back")} /><Title level={3} style={{ margin: 0 }}>{t("invoice.detail.title")}</Title></Flex><Tag color={statusColor(row.status)}>{t(`invoice.status.${row.status.toLowerCase()}`)}</Tag></div>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}><div className={styles.summaryLabel}>{t("invoice.fields.poNumber")}</div><div className={styles.summaryValue}>{row.poNumber}</div></div>
        <div className={styles.summaryCard}><div className={styles.summaryLabel}>{t("invoice.fields.grnNumber")}</div><div className={styles.summaryValue}>{row.deliveryNo || "-"}</div></div>
        <div className={styles.summaryCard}><div className={styles.summaryLabel}>{t("invoice.fields.paymentTerms")}</div><div className={styles.summaryValue}>{formatPaymentTerm(row.paymentTerms)}</div></div>
        <div className={styles.summaryCard}><div className={styles.summaryLabel}>{t("invoice.fields.grandTotal")}</div><div className={styles.summaryValue}>{currencyLabel(row.currency, row.grandTotal)}</div></div>
      </div>
      <div className={styles.sectionCard}><h3 className={styles.sectionTitle}>{t("invoice.detail.information")}</h3><Descriptions column={2} bordered size="middle">
        <Descriptions.Item label={t("invoice.fields.invoiceNumber")}>{row.invoiceNumber || "-"}</Descriptions.Item><Descriptions.Item label={t("invoice.fields.invoiceDate")}>{row.invoiceDate || "-"}</Descriptions.Item>
        <Descriptions.Item label={t("invoice.fields.sourcePr")}>{row.sourcePrNumber}</Descriptions.Item><Descriptions.Item label={t("invoice.fields.supplier")}>{row.supplierName || row.supplierEmail || "-"}</Descriptions.Item>
        <Descriptions.Item label={t("invoice.fields.subtotal")}>{currencyLabel(row.currency, row.subtotal)}</Descriptions.Item><Descriptions.Item label={t("invoice.fields.taxTotal")}>{currencyLabel(row.currency, row.taxTotal)}</Descriptions.Item>
      </Descriptions></div>
      <div className={styles.sectionCard}><h3 className={styles.sectionTitle}>Calculation summary</h3><Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Items subtotal">{currencyLabel(row.currency, row.subtotal)}</Descriptions.Item>
        {invoiceRules.map((rule, index) => <Descriptions.Item key={`${rule.taxType}-${index}`} label={`${({ SALES_TAX: "Sales tax", SERVICE_TAX: "Service tax", OTHER: "Other tax" } as Record<string, string>)[rule.taxType] ?? "Tax"} (${Number(rule.taxRate ?? 0).toFixed(2)}%)`}>{currencyLabel(row.currency, invoiceTaxBreakdown.amounts[index] ?? 0)}</Descriptions.Item>)}
        <Descriptions.Item label="Total payable">{currencyLabel(row.currency, row.grandTotal)}</Descriptions.Item>
      </Descriptions></div>
      {row.status === "REJECTED" ? <div className={styles.sectionCard}><h3 className={styles.sectionTitle}>{t("invoice.detail.rejectionTitle")}</h3><Paragraph type="danger">{row.rejectionReason || t("invoice.detail.noRejectionReason")}</Paragraph><Paragraph>Rejected by: {row.rejectedBy || row.reviewedBy || "-"}<br/>Rejected date: {row.rejectedDate || row.reviewedDate || "-"}</Paragraph></div> : null}
      {row.approvalHistory?.length ? <div className={styles.sectionCard}><h3 className={styles.sectionTitle}>Approval history</h3>{row.approvalHistory.map((entry) => <Paragraph key={`${entry.action}-${entry.date}`}>{entry.action} by {entry.by} on {new Date(entry.date).toLocaleString()}{entry.reason ? `: ${entry.reason}` : ""}</Paragraph>)}</div> : null}
      <div className={styles.itemsCard}><h3 className={styles.sectionTitle}>{t("invoice.detail.items")}</h3><Paragraph type="secondary">{t("invoice.detail.itemsHint")}</Paragraph><div className={styles.itemList}>{row.items.map((item) => <ItemRow key={item.tempId} item={item} currency={row.currency} />)}</div></div>
      <div className={styles.actionRow}>{row.status === "DRAFT" || row.status === "REJECTED" ? <Button type="primary" icon={<CheckOutlined />} onClick={() => void onSubmit()}>{row.status === "REJECTED" ? t("invoice.actions.resubmit") : t("invoice.actions.submit")}</Button> : null}<SupplierFinanceDocumentActions kind="invoice" localId={row.localId} documentNumber={row.invoiceNumber || row.poNumber} /></div>
    </div></Card>;
  }

  const columns = [
    { title: t("invoice.fields.invoiceNumber"), dataIndex: "invoiceNumber", render: (value: string | undefined, item: SupplierInvoiceRecord) => value || `${t("invoice.labels.pending")} (${item.poNumber})` },
    { title: t("invoice.fields.poNumber"), dataIndex: "poNumber" },
    { title: t("invoice.fields.grnNumber"), dataIndex: "deliveryNo", render: (value: string | undefined) => value || "-" },
    { title: t("invoice.fields.paymentTerms"), dataIndex: "paymentTerms", render: (value: string | undefined) => formatPaymentTerm(value) },
    { title: t("invoice.fields.grandTotal"), key: "total", render: (_: unknown, item: SupplierInvoiceRecord) => currencyLabel(item.currency, item.grandTotal) },
    { title: t("invoice.fields.status"), dataIndex: "status", render: (value: SupplierInvoiceRecord["status"]) => <Tag color={statusColor(value)}>{t(`invoice.status.${value.toLowerCase()}`)}</Tag> },
    { title: t("invoice.actions.view"), key: "action", render: (_: unknown, item: SupplierInvoiceRecord) => <Button icon={<EyeOutlined />} onClick={() => navigate(`/supplier-overview/invoice/${item.localId}`)}>{t("invoice.actions.view")}</Button> },
  ];
  const pendingRows = orderedRows.filter((item) => item.status === "SUBMITTED");
  const draftRows = orderedRows.filter((item) => item.status === "DRAFT");
  const approvedRows = orderedRows.filter((item) => item.status === "APPROVED");
  const rejectedRows = orderedRows.filter((item) => item.status === "REJECTED");
  const invoiceTable = (dataSource: SupplierInvoiceRecord[]): React.ReactElement => (
    <Table rowKey="localId" dataSource={dataSource} columns={columns} pagination={{ pageSize: 8 }} locale={{ emptyText: <Empty description={t("invoice.empty")} /> }} scroll={{ x: 980 }} />
  );
  return <Card><div className={styles.page}><div className={styles.header}><Flex align="center" gap={8}><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/supplier-overview")} aria-label={t("invoice.actions.back")} /><Title level={3} style={{ margin: 0 }}>{t("invoice.title")}</Title></Flex></div><Tabs defaultActiveKey="pending" items={[
    { key: "pending", label: t("invoice.tabs.pending", { count: pendingRows.length }), children: invoiceTable(pendingRows) },
    { key: "draft", label: t("invoice.tabs.draft", { count: draftRows.length }), children: invoiceTable(draftRows) },
    { key: "approved", label: t("invoice.tabs.approved", { count: approvedRows.length }), children: invoiceTable(approvedRows) },
    { key: "rejected", label: t("invoice.tabs.rejected", { count: rejectedRows.length }), children: invoiceTable(rejectedRows) },
  ]} /></div></Card>;
}
