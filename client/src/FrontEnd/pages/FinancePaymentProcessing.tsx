import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Empty, Input, Modal, Select, Table, Tag, Typography, Upload, message } from "antd";
import { CreditCardOutlined, PaperClipOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";
import {
  hydrateSupplierPayments,
  loadSupplierPayments,
  updateSupplierPayment,
  type SupplierPaymentRecord,
} from "../modules/supplierFulfillment/workflow";
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
  const user = useMemo(() => getSessionUser(), []);
  const [rows, setRows] = useState<SupplierPaymentRecord[]>([]);
  const [selected, setSelected] = useState<SupplierPaymentRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paidDate, setPaidDate] = useState(new Date().toISOString().slice(0, 10));
  const [transactionReference, setTransactionReference] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);

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
      message.error("Only PDF, JPG or PNG payment proofs are allowed");
      return false;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      message.error("Payment proof must be 5MB or smaller");
      return false;
    }
    try {
      setAttachment({
        attachmentName: file.name,
        attachmentType: file.type,
        attachmentDataUrl: await readFileAsDataUrl(file),
      });
    } catch {
      message.error("Unable to read payment proof");
    }
    return false;
  };

  const processPayment = (): void => {
    if (!selected || !transactionReference.trim() || !paidDate || !attachment?.attachmentDataUrl) return;
    const currentPayment = loadSupplierPayments().find((row) => row.localId === selected.localId);
    if (!currentPayment || currentPayment.status !== "PENDING_PAYMENT") {
      message.warning("This payment is no longer pending processing");
      setSelected(null);
      return;
    }
    const currentUser = user?.name || user?.email || "Payment Team";
    updateSupplierPayment(selected.localId, (current) => ({
      ...current,
      status: "PAID",
      paymentMethod,
      paidDate,
      processedBy: currentUser,
      transactionReference: transactionReference.trim(),
      remarks: remarks.trim() || undefined,
      ...attachment,
    }));
    setSelected(null);
    message.success("Payment marked as paid");
    void sync();
  };

  if (!user || (user.role !== UserRole.PAYMENT_TEAM && user.role !== UserRole.ADMIN)) {
    return <Card><Empty description="Payment Team access required" /></Card>;
  }

  return <div className={styles.page}>
    <div className={styles.header}>
      <Title level={3} style={{ margin: 0 }}>Payment Processing</Title>
      <Tag color="blue">{pending.length} pending</Tag>
    </div>
    <Card>
      <Table
        rowKey="localId"
        dataSource={pending}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 980 }}
        locale={{ emptyText: <Empty description="No payments pending processing" /> }}
        columns={[
          { title: "Payment", dataIndex: "paymentNumber" },
          { title: "Invoice", dataIndex: "invoiceNumber", render: (value: string | undefined, row: SupplierPaymentRecord) => value || row.invoiceLocalId },
          { title: "Supplier", dataIndex: "supplierName", render: (value: string | undefined, row: SupplierPaymentRecord) => value || row.supplierEmail || "-" },
          { title: "Amount", key: "amount", render: (_: unknown, row: SupplierPaymentRecord) => `${row.currency} ${Number(row.amount || 0).toFixed(2)}` },
          { title: "Payment Terms", dataIndex: "paymentTerms", render: (value: string | undefined) => value || "-" },
          { title: "Status", dataIndex: "status", render: (value: string) => <Tag color="orange">{value}</Tag> },
          { title: "Action", key: "action", render: (_: unknown, row: SupplierPaymentRecord) => <Button type="primary" icon={<CreditCardOutlined />} onClick={() => openPayment(row)}>Process Payment</Button> },
        ]}
      />
    </Card>
    <Modal
      open={Boolean(selected)}
      title={selected ? `Process ${selected.paymentNumber}` : "Process Payment"}
      okText="Mark as Paid"
      okButtonProps={{ disabled: !transactionReference.trim() || !paidDate || !attachment?.attachmentDataUrl }}
      onCancel={() => setSelected(null)}
      onOk={processPayment}
      destroyOnHidden
    >
      {selected ? <>
        <Text type="secondary">{selected.invoiceNumber || selected.invoiceLocalId} · {selected.currency} {Number(selected.amount || 0).toFixed(2)}</Text>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <label>Payment method<Select value={paymentMethod} onChange={setPaymentMethod} style={{ width: "100%", marginTop: 4 }} options={[{ value: "Bank Transfer", label: "Bank Transfer" }, { value: "GIRO", label: "GIRO" }, { value: "Cheque", label: "Cheque" }]} /></label>
          <label>Paid date<Input type="date" value={paidDate} onChange={(event) => setPaidDate(event.target.value)} style={{ marginTop: 4 }} /></label>
          <label>Transaction reference<Input value={transactionReference} onChange={(event) => setTransactionReference(event.target.value)} placeholder="e.g. MBK-20260923-001" style={{ marginTop: 4 }} /></label>
          <label>Payment proof<Upload accept=".pdf,.jpg,.jpeg,.png" beforeUpload={handleAttachment} showUploadList={false}><Button icon={<PaperClipOutlined />} style={{ display: "block", marginTop: 4 }}>Choose attachment</Button></Upload>{attachment?.attachmentName ? <Text type="secondary">Attached: {attachment.attachmentName}</Text> : <Text type="secondary">PDF, JPG or PNG, maximum 5MB</Text>}</label>
          <label>Remarks<Input.TextArea rows={3} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional payment remarks" style={{ marginTop: 4 }} /></label>
        </div>
      </> : null}
    </Modal>
  </div>;
}
