import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Descriptions,
  Empty,
  Flex,
  Tag,
  Typography,
  Button,
} from "antd";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { loadSupplierGrns, type SupplierGrnRecord } from "../../modules/supplierFulfillment/workflow";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";

import styles from "../purchasing/ApprovalDetailSubmodule.module.css";
import WorkflowDocumentActions from "../../components/shared/WorkflowDocumentActions";
import WorkflowPartyInfo from "../../components/shared/WorkflowPartyInfo";

const { Paragraph, Title } = Typography;

function currencyLabel(currency: string, amount: number): string {
  return `${currency === "MYR" ? "RM" : currency} ${amount.toFixed(2)}`;
}

function statusColor(status: SupplierGrnRecord["status"]): string {
  switch (status) {
    case "PENDING_GRN":
      return "orange";
    case "RECEIVED":
    case "COMPLETED":
      return "green";
    case "DISCREPANCY":
      return "red";
    default:
      return "default";
  }
}

function statusText(status: SupplierGrnRecord["status"], t: any): string {
  switch (status) {
    case "PENDING_GRN":
      return t("grnStatus.detail.status.pendingGrn");
    case "RECEIVED":
    case "COMPLETED":
      return t("grnStatus.detail.status.received");
    case "DISCREPANCY":
      return t("grnStatus.detail.status.discrepancy");
    default:
      return status;
  }
}

function ItemDetailCard({
  item,
  currency,
  index,
  t,
}: {
  item: DraftLineItem;
  currency: string;
  index: number;
  t: any;
}): React.ReactElement {
  const lineTotal = item.quantity * item.unitPrice;
  return (
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <div>
          <div className={styles.itemIndex}>{t("orderAcknowledgement.detail.items.item", { index: index + 1 })}</div>
          <h4 className={styles.itemTitle}>{item.itemName}</h4>
        </div>
        <Tag>{item.itemCategory || t("common.uncategorized")}</Tag>
      </div>
      <div className={styles.itemGrid}>
        <div className={`${styles.detailBlock} ${styles.detailWide}`}>
          <span className={styles.detailLabel}>{t("orderAcknowledgement.detail.items.fields.description")}</span>
          <div className={styles.detailValue}>
            {item.itemDescription || t("orderAcknowledgement.detail.items.fields.noDescription")}
          </div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t("orderAcknowledgement.detail.items.fields.quantity")}</span>
          <div className={styles.detailValue}>{item.quantity}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t("orderAcknowledgement.detail.items.fields.unit")}</span>
          <div className={styles.detailValue}>{item.unitOfMeasurement || "-"}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t("orderAcknowledgement.detail.items.fields.unitPrice")}</span>
          <div className={styles.detailValue}>{currencyLabel(currency, item.unitPrice)}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t("orderAcknowledgement.detail.items.fields.lineTotal")}</span>
          <div className={styles.detailValue}>{currencyLabel(currency, lineTotal)}</div>
        </div>

        <div className={`${styles.detailBlock} ${styles.detailWide}`}>
          <span className={styles.detailLabel}>{t("orderAcknowledgement.detail.items.fields.assignedSupplier")}</span>
          <div className={styles.detailValue}>
            {item.supplierName || item.supplierEmail || t("orderAcknowledgement.detail.items.fields.noSupplier")}
          </div>
        </div>

        <div className={`${styles.detailBlock} ${styles.detailWide}`}>
          <span className={styles.detailLabel}>{t("orderAcknowledgement.detail.items.fields.supplierEmail")}</span>
          <div className={styles.detailValue}>{item.supplierEmail || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default function GoodsReceivedNoteDetailSubmodule(): React.ReactElement {
  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const { localId } = useParams();
  const [rows, setRows] = useState<SupplierGrnRecord[]>([]);

  useEffect(() => {
    const sync = (): void => {
      setRows(loadSupplierGrns());
    };
    const handleSync = (): void => {
      sync();
    };

    sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-grns", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-grns", handleSync);
    };
  }, []);

  const row = useMemo(() => rows.find((item) => item.localId === localId), [localId, rows]);

  if (!row) {
    return (
      <Card>
        <Empty description={t("grnStatus.detail.messages.notFound")} />
      </Card>
    );
  }

  const total = row.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/supplier-overview/grn-status")}
              style={{ paddingInline: 0 }}
              aria-label={t("grnStatus.detail.actions.back")}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t("grnStatus.detail.title")}
            </Title>
          </Flex>
          <Flex align="center" gap={10}>
            {row.status === "DISCREPANCY" ? (
              <Button
                type="primary"
                onClick={() => navigate(`/supplier-overview/grn-status/${row.localId}/create-delivery`)}
              >
                {t("grnStatus.detail.actions.createNewDelivery")}
              </Button>
            ) : null}
          <Flex align="center" gap={8} wrap="wrap">
            <WorkflowDocumentActions workflowType="grn" record={row} filenamePrefix="grn" />
            <Tag color={statusColor(row.status)}>{statusText(row.status, t)}</Tag>
          </Flex>
          </Flex>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.detail.summary.orderNumber")}</div>
            <div className={styles.summaryValue}>{row.poNumber}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.detail.summary.createdDate")}</div>
            <div className={styles.summaryValue}>{row.createdDate}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.detail.summary.items")}</div>
            <div className={styles.summaryValue}>{row.items.length}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.detail.summary.total")}</div>
            <div className={styles.summaryValue}>{currencyLabel(row.currency, total)}</div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t("grnStatus.detail.info.title")}</h3>
          <WorkflowPartyInfo workflowType="grn" record={row} />
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label={t("grnStatus.detail.info.sourcePr")}>{row.sourcePrNumber}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.detail.info.purchaseRequester")}>
              {row.sourceRequester || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.detail.info.createdBy")}>{row.createdBy}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.detail.info.department")}>{row.department || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.detail.info.currentStatus")}>{statusText(row.status, t)}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.detail.info.discrepancyReason")} span={2}>
              {row.discrepancyReason || "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t("grnStatus.detail.items.title")}</h3>
          <Paragraph type="secondary">
            {t("grnStatus.detail.items.description")}
          </Paragraph>
          <div className={styles.itemList}>
            {row.items.map((item, index) => (
              <ItemDetailCard key={item.tempId} item={item} currency={row.currency} index={index} t={t} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
