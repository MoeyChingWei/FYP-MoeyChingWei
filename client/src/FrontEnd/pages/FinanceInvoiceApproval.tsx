import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Empty, Flex, Table, Tag, Typography, message } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../shared/auth/session";
import { canApproveSupplierInvoices } from "../shared/types/roles";
import RejectReasonModal from "../shared/components/RejectReasonModal";
import {
  hydrateSupplierInvoices,
  loadSupplierPayments,
  loadSupplierInvoices,
  saveSupplierPayments,
  updateSupplierInvoice,
  type SupplierInvoiceRecord,
} from "../modules/supplierFulfillment/workflow";
import { approveSupplierInvoice, rejectSupplierInvoice, supplierFinancePdfUrl } from "../shared/api/supplierFinance";
import styles from "./purchasing/ApprovalDetailSubmodule.module.css";

const { Title, Text } = Typography;

function money(row: SupplierInvoiceRecord): string {
  return `${row.currency} ${Number(row.grandTotal || 0).toFixed(2)}`;
}

export default function FinanceInvoiceApproval(): React.ReactElement {
  const navigate = useNavigate();
  const user = useMemo(() => getSessionUser(), []);
  const [rows, setRows] = useState<SupplierInvoiceRecord[]>([]);
  const [selected, setSelected] = useState<SupplierInvoiceRecord | null>(null);
  const [rejecting, setRejecting] = useState<SupplierInvoiceRecord | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const sync = async (): Promise<void> => {
    await hydrateSupplierInvoices();
    const nextRows = loadSupplierInvoices();
    setRows(nextRows);
    setSelected((current) => current ? nextRows.find((row) => row.localId === current.localId) || null : null);
  };
  useEffect(() => {
    if (!user || !canApproveSupplierInvoices(user.role)) {
      navigate("/overview", { replace: true });
      return;
    }
    void sync();
    const onSync = (): void => { void sync(); };
    window.addEventListener("storage", onSync);
    window.addEventListener("erp-supplier-invoices", onSync);
    return () => {
      window.removeEventListener("storage", onSync);
      window.removeEventListener("erp-supplier-invoices", onSync);
    };
  }, [navigate, user]);

  const pending = useMemo(() => rows.filter((row) => row.status === "SUBMITTED"), [rows]);

  const approve = async (row: SupplierInvoiceRecord): Promise<void> => {
    if (row.status !== "SUBMITTED") return;
    if (!row.grnLocalId || !row.poNumber || !row.supplierEmail || !row.items.length || !Number.isFinite(row.grandTotal) || row.grandTotal <= 0) {
      message.error("Invoice cannot be approved because required linkage or amount information is missing");
      return;
    }
    if (processingId) return;
    setProcessingId(row.localId);
    try {
      const result = await approveSupplierInvoice(row.localId);
      updateSupplierInvoice(row.localId, () => result.invoice);
      if (!loadSupplierPayments().some((payment) => payment.localId === result.payment.localId)) {
        saveSupplierPayments([...loadSupplierPayments(), result.payment]);
      }
      setSelected(null);
      message.success("Supplier invoice approved and sent to Payment Team");
      void sync();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Unable to approve supplier invoice");
      void sync();
    } finally {
      setProcessingId(null);
    }
  };

  const reject = async (reason: string): Promise<void> => {
    if (!rejecting) return;
    if (processingId) return;
    setProcessingId(rejecting.localId);
    try {
      const invoice = await rejectSupplierInvoice(rejecting.localId, reason);
      updateSupplierInvoice(rejecting.localId, () => invoice);
      setRejecting(null);
      setSelected(null);
      message.success("Supplier invoice rejected");
      void sync();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Unable to reject supplier invoice");
      void sync();
    } finally {
      setProcessingId(null);
    }
  };

  const columns = [
    { title: "Invoice", dataIndex: "invoiceNumber", render: (value: string, row: SupplierInvoiceRecord) => value || row.poNumber },
    { title: "Supplier", key: "supplier", render: (_: unknown, row: SupplierInvoiceRecord) => row.supplierCompanyName || row.supplierName || row.supplierEmail || "-" },
    { title: "PO / GRN", key: "source", render: (_: unknown, row: SupplierInvoiceRecord) => `${row.poNumber} / ${row.deliveryNo || "-"}` },
    { title: "Amount", key: "amount", render: (_: unknown, row: SupplierInvoiceRecord) => money(row), sorter: (a: SupplierInvoiceRecord, b: SupplierInvoiceRecord) => a.grandTotal - b.grandTotal },
    { title: "Submitted", dataIndex: "submittedDate", render: (value: string) => value ? new Date(value).toLocaleDateString() : "-" },
    { title: "Action", key: "action", render: (_: unknown, row: SupplierInvoiceRecord) => <Button icon={<EyeOutlined />} onClick={() => setSelected(row)}>Review</Button> },
  ];

  if (!canApproveSupplierInvoices(user?.role)) return <Card><Empty description="Treasury / Finance Officer access required" /></Card>;
  return <div className={styles.page}>
    <Flex justify="space-between" align="center" className={styles.header}>
      <Flex align="center" gap={8}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/finance")} aria-label="Back to Finance" title="Back to Finance" />
        <Title level={3} style={{ margin: 0 }}>Supplier Invoice Approval</Title>
      </Flex>
      <Tag color="blue">{pending.length} pending</Tag>
    </Flex>
    <Card>
      <Table rowKey="localId" dataSource={pending} columns={columns} pagination={{ pageSize: 10 }} locale={{ emptyText: <Empty description="No supplier invoices pending approval" /> }} scroll={{ x: 900 }} />
    </Card>
    {selected ? <Card className={styles.sectionCard} title={<Flex justify="space-between"><span>{selected.invoiceNumber || selected.poNumber}</span><Tag color={selected.status === "SUBMITTED" ? "blue" : selected.status === "APPROVED" ? "green" : "red"}>{selected.status}</Tag></Flex>}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Supplier">{selected.supplierCompanyName || selected.supplierName || selected.supplierEmail || "-"}</Descriptions.Item>
        <Descriptions.Item label="Amount">{money(selected)}</Descriptions.Item>
        <Descriptions.Item label="PO">{selected.poNumber}</Descriptions.Item>
        <Descriptions.Item label="GRN">{selected.deliveryNo || "-"}</Descriptions.Item>
        <Descriptions.Item label="Invoice date">{selected.invoiceDate || "-"}</Descriptions.Item>
        <Descriptions.Item label="Payment terms">{selected.paymentTerms || "-"}</Descriptions.Item>
      </Descriptions>
      <Flex gap={8} style={{ marginTop: 16 }}>
        <Button type="primary" icon={<CheckCircleOutlined />} loading={processingId === selected.localId} disabled={selected.status !== "SUBMITTED" || Boolean(processingId)} onClick={() => void approve(selected)}>Approve</Button>
        <Button danger icon={<CloseCircleOutlined />} disabled={selected.status !== "SUBMITTED" || Boolean(processingId)} onClick={() => setRejecting(selected)}>Reject</Button>
        <Button onClick={() => navigate(`/supplier-overview/invoice/${selected.localId}`)}>View full invoice</Button>
        <Button icon={<DownloadOutlined />} onClick={() => window.open(supplierFinancePdfUrl("invoices", selected.localId), "_blank", "noopener,noreferrer")}>Download PDF</Button>
      </Flex>
      {selected.notes ? <Text type="secondary">Notes: {selected.notes}</Text> : null}
    </Card> : null}
    <RejectReasonModal open={Boolean(rejecting)} title="Reject supplier invoice" itemLabel={rejecting?.invoiceNumber || rejecting?.poNumber || "invoice"} onCancel={() => setRejecting(null)} onConfirm={reject} />
  </div>;
}
