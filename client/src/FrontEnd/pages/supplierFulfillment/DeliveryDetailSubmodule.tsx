import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { todayIsoDate } from "../../modules/purchasing/requestCreation/constants";
import {
  appendSupplierGrn,
  createGrnFromDelivery,
  loadSupplierDeliveries,
  type SupplierDeliveryRecord,
  updateSupplierDelivery,
} from "../../modules/supplierFulfillment/workflow";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";

import styles from "../purchasing/ApprovalDetailSubmodule.module.css";
import WorkflowDocumentActions from "../../components/shared/WorkflowDocumentActions";
import WorkflowPartyInfo from "../../components/shared/WorkflowPartyInfo";

const { Paragraph, Title } = Typography;

function currencyLabel(currency: string, amount: number): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function statusColor(status: SupplierDeliveryRecord["status"]): string {
  return status === "DELIVERED" ? "green" : "orange";
}

function statusText(status: SupplierDeliveryRecord["status"], t: any): string {
  return status === "DELIVERED" ? t("delivery.detail.status.delivered") : t("delivery.detail.status.pendingDelivery");
}

function displayDeliveryNo(row: SupplierDeliveryRecord): string {
  return row.deliveryNo || row.poNumber;
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

export default function DeliveryDetailSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const { localId } = useParams();
  const [rows, setRows] = useState<SupplierDeliveryRecord[]>([]);

  useEffect(() => {
    const sync = (): void => {
      setRows(loadSupplierDeliveries());
    };
    const handleSync = (): void => {
      sync();
    };

    sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-deliveries", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-deliveries", handleSync);
    };
  }, []);

  const row = useMemo(() => rows.find((item) => item.localId === localId), [localId, rows]);

  const onDeliver = (): void => {
    if (!row) return;
    const deliveredDate = todayIsoDate();
    appendSupplierGrn(
      createGrnFromDelivery({
        ...row,
        status: "DELIVERED",
        deliveredDate,
      }),
    );
    updateSupplierDelivery(row.localId, (draft) => ({
      ...draft,
      status: "DELIVERED",
      deliveredDate,
    }));
    message.success(t("delivery.list.messages.delivered", { deliveryNo: displayDeliveryNo(row) }));
    navigate("/supplier-overview/grn-status");
  };

  if (!row) {
    return (
      <Card>
        <Empty description={t("delivery.detail.messages.notFound")} />
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
              onClick={() => navigate("/supplier-overview/delivery")}
              style={{ paddingInline: 0 }}
              aria-label={t("delivery.detail.actions.back")}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t("delivery.detail.title")}
            </Title>
          </Flex>
          <Flex align="center" gap={8} wrap="wrap">
            <WorkflowDocumentActions workflowType="delivery" record={row} filenamePrefix="delivery" />
            <Tag color={statusColor(row.status)}>{statusText(row.status, t)}</Tag>
          </Flex>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("delivery.detail.summary.orderNumber")}</div>
            <div className={styles.summaryValue}>{displayDeliveryNo(row)}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("delivery.detail.summary.createdDate")}</div>
            <div className={styles.summaryValue}>{row.createdDate}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("delivery.detail.summary.items")}</div>
            <div className={styles.summaryValue}>{row.items.length}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("delivery.detail.summary.total")}</div>
            <div className={styles.summaryValue}>{currencyLabel(row.currency, total)}</div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t("delivery.detail.info.title")}</h3>
          <WorkflowPartyInfo workflowType="delivery" record={row} />
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label={t("delivery.detail.info.sourcePr")}>{row.sourcePrNumber}</Descriptions.Item>
            <Descriptions.Item label={t("delivery.detail.info.originalOrderNo")}>
              {row.originalOrderNo || row.poNumber}
            </Descriptions.Item>
            <Descriptions.Item label={t("delivery.detail.info.purchaseRequester")}>
              {row.sourceRequester || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("delivery.detail.info.createdBy")}>{row.createdBy}</Descriptions.Item>
            <Descriptions.Item label={t("delivery.detail.info.department")}>{row.department || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("delivery.detail.info.currentStatus")}>{statusText(row.status, t)}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t("delivery.detail.items.title")}</h3>
          <Paragraph type="secondary">
            {t("delivery.detail.items.description")}
          </Paragraph>
          <div className={styles.itemList}>
            {row.items.map((item, index) => (
              <ItemDetailCard key={item.tempId} item={item} currency={row.currency} index={index} t={t} />
            ))}
          </div>
        </div>

        {row.status === "PENDING_DELIVERY" ? (
          <div className={styles.actionRow}>
            <Button type="primary" icon={<CheckOutlined />} onClick={onDeliver}>
              {t("delivery.detail.actions.deliver")}
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
