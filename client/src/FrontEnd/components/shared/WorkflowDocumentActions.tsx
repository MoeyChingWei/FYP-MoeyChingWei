import React, { useState } from "react";
import { Button, Flex, message } from "antd";
import { DownloadOutlined, PrinterOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getCompanyAddress, getCompanyLogo, getCompanyName, getSupplierCompanyAddress, getSupplierCompanyLogo, getSupplierCompanyName } from "../../modules/settings/companyAddress";

export type WorkflowDocumentType = "purchase-request" | "purchase-order" | "acknowledgement" | "delivery" | "grn";

interface Props {
  workflowType: WorkflowDocumentType;
  record: any;
  pageTitle?: string;
  filenamePrefix?: string;
}

const WORKFLOW_FILENAME_PREFIXES: Record<WorkflowDocumentType, string> = {
  "purchase-request": "purchase-request",
  "purchase-order": "purchase-order",
  acknowledgement: "order-acknowledgement",
  delivery: "delivery",
  grn: "grn",
};

function safeFilenamePart(value: unknown): string {
  return String(value || "document")
    .trim()
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "document";
}

export function workflowPdfFilename(workflowType: WorkflowDocumentType, record: any, filenamePrefix?: string): string {
  const number = record?.prNumber || record?.poNumber || record?.deliveryNo || record?.grnNumber || record?.localId;
  return `${safeFilenamePart(filenamePrefix || WORKFLOW_FILENAME_PREFIXES[workflowType])}-${safeFilenamePart(number)}.pdf`;
}

export default function WorkflowDocumentActions({ workflowType, record, pageTitle, filenamePrefix }: Props): React.ReactElement {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState<"print" | "pdf" | null>(null);

  const getPdf = async (): Promise<Blob> => {
    const response = await axios.post("/api/export/workflow", { workflowType, record: documentRecord(), pageTitle }, { responseType: "blob", timeout: 60000 });
    return new Blob([response.data], { type: "application/pdf" });
  };

  const getPrintHtml = async (): Promise<string> => {
    const response = await axios.post("/api/export/workflow/html", { workflowType, record: documentRecord(), pageTitle }, { responseType: "text", timeout: 60000 });
    return response.data;
  };

  const documentRecord = (): any => {
    const supplierId = Number(record.supplierId);
    const supplierCompanyName = record.supplierCompanyName ||
      (Number.isFinite(supplierId) ? getSupplierCompanyName(supplierId) : "");
    const supplierLogo = record.supplierLogo ||
      (Number.isFinite(supplierId) ? getSupplierCompanyLogo(supplierId) : "");
    const supplierName = record.supplierName ||
      supplierCompanyName;
    const supplierAddress = record.supplierAddress ||
      (Number.isFinite(supplierId) ? getSupplierCompanyAddress(supplierId) : "");
    return {
      ...record,
      companyName: getCompanyName(),
      companyAddress: getCompanyAddress(),
      companyLogo: getCompanyLogo(),
      ...(supplierCompanyName ? { supplierCompanyName } : {}),
      ...(supplierLogo ? { supplierLogo } : {}),
      ...(supplierName ? { supplierName } : {}),
      ...(supplierAddress ? { supplierAddress } : {}),
    };
  };

  const onExport = async (): Promise<void> => {
    if (loading) return;
    setLoading("pdf");
    try {
      const url = URL.createObjectURL(await getPdf());
      const link = document.createElement("a");
      link.href = url;
      link.download = workflowPdfFilename(workflowType, record, filenamePrefix);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      message.success(t("documentActions.pdfExported"));
    } catch (error) {
      console.error(error);
      message.error(t("documentActions.pdfExportFailed"));
    } finally { setLoading(null); }
  };

  const onPrint = async (): Promise<void> => {
    if (loading) return;
    setLoading("print");
    let printFrame: HTMLIFrameElement | null = null;
    try {
      const html = await getPrintHtml();
      printFrame = document.createElement("iframe");
      printFrame.setAttribute("title", t("documentActions.printPreview"));
      printFrame.style.position = "fixed";
      printFrame.style.left = "-10000px";
      printFrame.style.top = "-10000px";
      printFrame.style.width = "1px";
      printFrame.style.height = "1px";
      printFrame.style.border = "0";
      document.body.appendChild(printFrame);

      await new Promise<void>((resolve, reject) => {
        if (!printFrame) return reject(new Error("Print frame unavailable"));
        printFrame.onload = () => resolve();
        printFrame.onerror = () => reject(new Error("Print document failed to load"));
        printFrame.srcdoc = html;
      });

      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
      message.success(t("documentActions.printPreviewOpened"));
      window.setTimeout(() => printFrame?.remove(), 1000);
    } catch (error) {
      console.error(error);
      message.error(t("documentActions.printFailed"));
      printFrame?.remove();
    } finally { setLoading(null); }
  };

  return <Flex gap={8} wrap="wrap">
    <Button icon={loading === "print" ? <LoadingOutlined /> : <PrinterOutlined />} onClick={() => void onPrint()} disabled={Boolean(loading)}>{t("buttons.print")}</Button>
    <Button icon={loading === "pdf" ? <LoadingOutlined /> : <DownloadOutlined />} onClick={() => void onExport()} disabled={Boolean(loading)}>{t("buttons.exportPDF")}</Button>
  </Flex>;
}
