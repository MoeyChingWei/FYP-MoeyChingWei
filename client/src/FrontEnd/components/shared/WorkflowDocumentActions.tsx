import React, { useState } from "react";
import { Button, Flex, message } from "antd";
import { DownloadOutlined, PrinterOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { getSupplierCompanyAddress } from "../../modules/settings/companyAddress";

export type WorkflowDocumentType = "purchase-request" | "purchase-order" | "acknowledgement" | "delivery" | "grn";

interface Props {
  workflowType: WorkflowDocumentType;
  record: any;
  pageTitle?: string;
  filenamePrefix?: string;
}

export default function WorkflowDocumentActions({ workflowType, record, pageTitle, filenamePrefix }: Props): React.ReactElement {
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
    const supplierAddress = record.supplierAddress ||
      (Number.isFinite(supplierId) ? getSupplierCompanyAddress(supplierId) : "");
    return supplierAddress ? { ...record, supplierAddress } : record;
  };

  const onExport = async (): Promise<void> => {
    if (loading) return;
    setLoading("pdf");
    try {
      const url = URL.createObjectURL(await getPdf());
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filenamePrefix || workflowType}-${String(record.prNumber || record.poNumber || record.deliveryNo || "document")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      message.success("PDF exported");
    } catch (error) {
      console.error(error);
      message.error("Unable to export PDF");
    } finally { setLoading(null); }
  };

  const onPrint = async (): Promise<void> => {
    if (loading) return;
    setLoading("print");
    let printFrame: HTMLIFrameElement | null = null;
    try {
      const html = await getPrintHtml();
      printFrame = document.createElement("iframe");
      printFrame.setAttribute("title", "Print preview");
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
      message.success("Print preview opened");
      window.setTimeout(() => printFrame?.remove(), 1000);
    } catch (error) {
      console.error(error);
      message.error("Unable to open print document");
      printFrame?.remove();
    } finally { setLoading(null); }
  };

  return <Flex gap={8} wrap="wrap">
    <Button icon={loading === "print" ? <LoadingOutlined /> : <PrinterOutlined />} onClick={() => void onPrint()} disabled={Boolean(loading)}>Print</Button>
    <Button icon={loading === "pdf" ? <LoadingOutlined /> : <DownloadOutlined />} onClick={() => void onExport()} disabled={Boolean(loading)}>Export PDF</Button>
  </Flex>;
}
