import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Empty, Input, Modal, Select, Table, Tabs, Tag, Typography, Upload, message } from "antd";
import { ArrowLeftOutlined, CreditCardOutlined, DownloadOutlined, PaperClipOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload/interface";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";
import {
  hydrateSupplierPayments,
  loadSupplierPayments,
  updateSupplierPayment,
  type SupplierPaymentRecord,
} from "../modules/supplierFulfillment/workflow";
import { processSupplierPayment, supplierFinancePdfUrl } from "../shared/api/supplierFinance";
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

  return <div className={styles.page}>
    <div className={styles.header}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/finance")} aria-label={t("payment.back")} title={t("payment.back")} />
        <Title level={3} style={{ margin: 0 }}>{t("payment.title")}</Title>
      </div>
      <Tag color="blue">{t("payment.pending", { count: pending.length })}</Tag>
    </div>
    <Card>
      <Tabs
        items={[
          {
            key: "pending",
            label: t("payment.pendingTab", { count: pending.length }),
            children: <Table rowKey="localId" dataSource={pending} pagination={{ pageSize: 10 }} scroll={{ x: 980 }} locale={{ emptyText: <Empty description={t("payment.noPending")} /> }} columns={[
              { title: t("payment.columns.payment"), dataIndex: "paymentNumber" },
              { title: t("payment.columns.invoice"), dataIndex: "invoiceNumber", render: (value: string | undefined, row: SupplierPaymentRecord) => value || row.invoiceLocalId },
              { title: t("payment.columns.supplier"), dataIndex: "supplierName", render: (value: string | undefined, row: SupplierPaymentRecord) => value || row.supplierEmail || "-" },
              { title: t("payment.columns.amount"), key: "amount", render: (_: unknown, row: SupplierPaymentRecord) => `${row.currency === "MYR" ? "RM" : row.currency} ${Number(row.amount || 0).toFixed(2)}` },
              { title: t("payment.columns.paymentTerms"), dataIndex: "paymentTerms", render: (value: string | undefined) => value || "-" },
              { title: t("payment.columns.status"), dataIndex: "status", render: (value: string) => <Tag color="orange">{value}</Tag> },
              { title: t("payment.columns.action"), key: "action", render: (_: unknown, row: SupplierPaymentRecord) => <Button type="primary" icon={<CreditCardOutlined />} onClick={() => openPayment(row)}>{t("payment.process")}</Button> },
            ]} />,
          },
          {
            key: "paid",
            label: t("payment.paidTab", { count: paid.length }),
            children: <Table rowKey="localId" dataSource={paid} pagination={{ pageSize: 10 }} scroll={{ x: 980 }} locale={{ emptyText: <Empty description={t("payment.noPaid")} /> }} columns={[
              { title: t("payment.columns.payment"), dataIndex: "paymentNumber" },
              { title: t("payment.columns.invoice"), dataIndex: "invoiceNumber", render: (value: string | undefined, row: SupplierPaymentRecord) => value || row.invoiceLocalId },
              { title: t("payment.columns.amount"), key: "amount", render: (_: unknown, row: SupplierPaymentRecord) => `${row.currency === "MYR" ? "RM" : row.currency} ${Number(row.amount || 0).toFixed(2)}` },
              { title: t("payment.columns.paidDate"), dataIndex: "paidDate", render: (value: string | undefined) => value || "-" },
              { title: t("payment.columns.reference"), dataIndex: "transactionReference", render: (value: string | undefined) => value || "-" },
              { title: t("payment.columns.proof"), dataIndex: "attachmentName", render: (value: string | undefined) => value || "-" },
              { title: t("payment.columns.status"), dataIndex: "status", render: (value: string) => <Tag color="green">{value}</Tag> },
              { title: t("payment.columns.action"), key: "action", render: (_: unknown, row: SupplierPaymentRecord) => <Button icon={<DownloadOutlined />} disabled={!row.paymentAdvicePdf} onClick={() => window.open(supplierFinancePdfUrl("payments", row.localId), "_blank", "noopener,noreferrer")}>{t("payment.downloadAdvice")}</Button> },
            ]} />,
          },
        ]}
      />
    </Card>
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
          <label>{t("payment.proof")}<Upload accept=".pdf,.jpg,.jpeg,.png" beforeUpload={handleAttachment} showUploadList={false}><Button icon={<PaperClipOutlined />} style={{ display: "block", marginTop: 4 }}>{t("payment.chooseAttachment")}</Button></Upload>{attachment?.attachmentName ? <Text type="secondary">{t("payment.attached", { name: attachment.attachmentName })}</Text> : <Text type="secondary">{t("payment.proofHint")}</Text>}</label>
          <label>{t("payment.remarks")}<Input.TextArea rows={3} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder={t("payment.remarksPlaceholder")} style={{ marginTop: 4 }} /></label>
        </div>
      </> : null}
    </Modal>
  </div>;
}
