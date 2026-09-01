import React, { useState } from "react";
import { Button, Flex, message } from "antd";
import { DownloadOutlined, LoadingOutlined, PrinterOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { supplierFinanceDocumentPayload, supplierFinancePdfUrl, supplierFinancePrintUrl } from "../../shared/api/supplierFinance";

export type SupplierFinanceDocumentKind = "invoice" | "payment";

interface Props {
  kind: SupplierFinanceDocumentKind;
  localId: string;
  documentNumber?: string;
  disabled?: boolean;
}

function safeFilenamePart(value: unknown): string {
  return String(value || "document")
    .trim()
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "document";
}

function pdfFilename(kind: SupplierFinanceDocumentKind, documentNumber?: string): string {
  const prefix = kind === "invoice" ? "supplier-invoice" : "payment-advice";
  return `${prefix}-${safeFilenamePart(documentNumber)}.pdf`;
}

export default function SupplierFinanceDocumentActions({ kind, localId, documentNumber, disabled = false }: Props): React.ReactElement {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState<"print" | "pdf" | null>(null);
  const endpointKind = kind === "invoice" ? "invoices" : "payments";

  const getPdf = async (): Promise<Blob> => {
    const response = await axios.post(supplierFinancePdfUrl(endpointKind, localId), supplierFinanceDocumentPayload(), { responseType: "blob", timeout: 60000 });
    return new Blob([response.data], { type: "application/pdf" });
  };

  const getPrintHtml = async (): Promise<string> => {
    const response = await axios.post(supplierFinancePrintUrl(endpointKind, localId), supplierFinanceDocumentPayload(), { responseType: "text", timeout: 60000 });
    return response.data;
  };

  const onExport = async (): Promise<void> => {
    if (loading || disabled) return;
    setLoading("pdf");
    try {
      const url = URL.createObjectURL(await getPdf());
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfFilename(kind, documentNumber);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      message.success(t("documentActions.pdfExported"));
    } catch (error) {
      console.error(error);
      message.error(t("documentActions.pdfExportFailed"));
    } finally {
      setLoading(null);
    }
  };

  const onPrint = async (): Promise<void> => {
    if (loading || disabled) return;
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
    } finally {
      setLoading(null);
    }
  };

  return <Flex gap={8} wrap="wrap">
    <Button icon={loading === "print" ? <LoadingOutlined /> : <PrinterOutlined />} onClick={() => void onPrint()} disabled={disabled || Boolean(loading)}>{t("buttons.print")}</Button>
    <Button icon={loading === "pdf" ? <LoadingOutlined /> : <DownloadOutlined />} onClick={() => void onExport()} disabled={disabled || Boolean(loading)}>{t("buttons.exportPDF")}</Button>
  </Flex>;
}
