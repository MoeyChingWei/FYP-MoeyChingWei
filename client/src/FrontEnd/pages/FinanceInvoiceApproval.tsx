import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Empty, Flex, Table, Tag, Typography, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../shared/auth/session";
import { canApproveSupplierInvoices } from "../shared/types/roles";
import RejectReasonModal from "../shared/components/RejectReasonModal";
import {
  hydrateSupplierInvoices,
  loadSupplierInvoices,
  updateSupplierInvoice,
  type SupplierInvoiceRecord,
} from "../modules/supplierFulfillment/workflow";
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

  const sync = async (): Promise<void> => {
    await hydrateSupplierInvoices();
    setRows(loadSupplierInvoices());
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

  const approve = (row: SupplierInvoiceRecord): void => {
    if (row.status !== "SUBMITTED") return;
    if (!row.grnLocalId || !row.poNumber || !row.supplierEmail || !row.items.length || !Number.isFinite(row.grandTotal) || row.grandTotal <= 0) {
      message.error("Invoice cannot be approved because required linkage or amount information is missing");
      return;
    }
    updateSupplierInvoice(row.localId, (current) => ({
      ...current,
      status: "APPROVED",
      reviewedDate: new Date().toISOString(),
      reviewedBy: user?.name || user?.email || "Finance Officer",
      rejectionReason: undefined,
    }));
    setSelected(null);
    message.success("Supplier invoice approved");
    void sync();
  };

  const reject = (reason: string): void => {
    if (!rejecting) return;
    updateSupplierInvoice(rejecting.localId, (current) => ({
      ...current,
      status: "REJECTED",
      reviewedDate: new Date().toISOString(),
      reviewedBy: user?.name || user?.email || "Finance Officer",
      rejectionReason: reason,
    }));
    setRejecting(null);
    setSelected(null);
    message.success("Supplier invoice rejected");
    void sync();
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
      <Title level={3} style={{ margin: 0 }}>Supplier Invoice Approval</Title>
      <Tag color="blue">{pending.length} pending</Tag>
    </Flex>
    <Card>
      <Table rowKey="localId" dataSource={pending} columns={columns} pagination={{ pageSize: 10 }} locale={{ emptyText: <Empty description="No supplier invoices pending approval" /> }} scroll={{ x: 900 }} />
    </Card>
    {selected ? <Card className={styles.sectionCard} title={<Flex justify="space-between"><span>{selected.invoiceNumber || selected.poNumber}</span><Tag color="blue">SUBMITTED</Tag></Flex>}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Supplier">{selected.supplierCompanyName || selected.supplierName || selected.supplierEmail || "-"}</Descriptions.Item>
        <Descriptions.Item label="Amount">{money(selected)}</Descriptions.Item>
        <Descriptions.Item label="PO">{selected.poNumber}</Descriptions.Item>
        <Descriptions.Item label="GRN">{selected.deliveryNo || "-"}</Descriptions.Item>
        <Descriptions.Item label="Invoice date">{selected.invoiceDate || "-"}</Descriptions.Item>
        <Descriptions.Item label="Payment terms">{selected.paymentTerms || "-"}</Descriptions.Item>
      </Descriptions>
      <Flex gap={8} style={{ marginTop: 16 }}>
        <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => approve(selected)}>Approve</Button>
        <Button danger icon={<CloseCircleOutlined />} onClick={() => setRejecting(selected)}>Reject</Button>
        <Button onClick={() => navigate(`/supplier-overview/invoice/${selected.localId}`)}>View full invoice</Button>
      </Flex>
      {selected.notes ? <Text type="secondary">Notes: {selected.notes}</Text> : null}
    </Card> : null}
    <RejectReasonModal open={Boolean(rejecting)} title="Reject supplier invoice" itemLabel={rejecting?.invoiceNumber || rejecting?.poNumber || "invoice"} onCancel={() => setRejecting(null)} onConfirm={reject} />
  </div>;
}
