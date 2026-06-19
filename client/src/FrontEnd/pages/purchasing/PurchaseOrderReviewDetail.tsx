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
import { ArrowLeftOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  hydratePurchaseOrderDrafts,
  loadPurchaseOrderDrafts,
  updatePurchaseOrderDraft,
} from "../../modules/purchasing/purchaseOrder/storage";
import type { PurchaseOrderDraft } from "../../modules/purchasing/purchaseOrder/types";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";
import type { PurchaseOrderStatus } from "../../modules/purchasing/types";

import styles from "./ReviewDetailSubmodule.module.css";

const { Paragraph, Title } = Typography;

function formatStatus(status: PurchaseOrderStatus, t: any): string {
  const key = `purchaseOrder.detail.status.${status.toLowerCase()}`;
  return t(key);
}

function statusColor(status: PurchaseOrderStatus): string {
  switch (status) {
    case "DRAFT":
      return "default";
    case "SUBMITTED":
      return "blue";
    case "APPROVED":
      return "green";
    case "REJECTED":
      return "red";
    default:
      return "default";
  }
}

function currencyLabel(currency: string, amount: number): string {
  return `${currency} ${amount.toFixed(2)}`;
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
          <div className={styles.itemIndex}>{t('purchaseOrder.detail.items.item', { index: index + 1 })}</div>
          <h4 className={styles.itemTitle}>{item.itemName}</h4>
        </div>
        <Tag>{item.itemCategory || t('common.uncategorized')}</Tag>
      </div>

      <div className={styles.itemGrid}>
        <div className={`${styles.detailBlock} ${styles.detailWide}`}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.description')}</span>
          <div className={styles.detailValue}>
            {item.itemDescription || t('purchaseRequest.detail.items.fields.noDescription')}
          </div>
        </div>

        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.quantity')}</span>
          <div className={styles.detailValue}>{item.quantity}</div>
        </div>

        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.unit')}</span>
          <div className={styles.detailValue}>
            {item.unitOfMeasurement || "-"}
          </div>
        </div>

        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.unitPrice')}</span>
          <div className={styles.detailValue}>
            {currencyLabel(currency, item.unitPrice)}
          </div>
        </div>

        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.lineTotal')}</span>
          <div className={styles.detailValue}>
            {currencyLabel(currency, lineTotal)}
          </div>
        </div>

        <div className={`${styles.detailBlock} ${styles.detailWide}`}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.assignedSupplier')}</span>
          <div className={styles.detailValue}>
            {item.supplierName || item.supplierEmail || t('purchaseRequest.detail.items.fields.noSupplier')}
          </div>
        </div>

        <div className={`${styles.detailBlock} ${styles.detailWide}`}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.supplierEmail')}</span>
          <div className={styles.detailValue}>{item.supplierEmail || "-"}</div>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseOrderReviewDetail(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const { localId } = useParams();
  const [orders, setOrders] = useState<PurchaseOrderDraft[]>([]);

  useEffect(() => {
    const syncOrders = async (): Promise<void> => {
      await hydratePurchaseOrderDrafts();
      setOrders(loadPurchaseOrderDrafts());
    };

    void syncOrders();
    const handleSync = (): void => {
      void syncOrders();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-purchase-order-drafts", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-purchase-order-drafts", handleSync);
    };
  }, []);

  const order = useMemo(
    () => orders.find((item) => item.localId === localId),
    [localId, orders],
  );

  const onSubmit = (): void => {
    if (!order) return;

    updatePurchaseOrderDraft(order.localId, (draft) => ({
      ...draft,
      status: "SUBMITTED",
    }));
    message.success(t('purchaseOrder.detail.messages.submitted', { poNumber: order.poNumber }));
    navigate("/purchasing/po-review");
  };

  if (!order) {
    return (
      <Card>
        <Empty description={t('purchaseOrder.detail.messages.notFound')} />
      </Card>
    );
  }

  const total = order.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const supplierCount = new Set(
    order.lineItems.map((item) => item.supplierEmail || item.supplierName).filter(Boolean),
  ).size;

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing/po-review")}
              style={{ paddingInline: 0 }}
              aria-label={t('purchaseOrder.detail.actions.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseOrder.detail.title')}
            </Title>
          </Flex>

          <Flex align="center" gap={8}>
            {order.status === "DRAFT" ? (
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/purchasing/po-creation/${order.localId}`)}
                aria-label={t('purchaseOrder.detail.actions.edit')}
              >
                {t('purchaseOrder.detail.actions.edit')}
              </Button>
            ) : null}
            <Tag color={statusColor(order.status)}>{formatStatus(order.status, t)}</Tag>
          </Flex>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseOrder.detail.summary.poNumber')}</div>
            <div className={styles.summaryValue}>{order.poNumber}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseOrder.detail.summary.createdDate')}</div>
            <div className={styles.summaryValue}>{order.createdDate}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseOrder.detail.summary.items')}</div>
            <div className={styles.summaryValue}>{order.lineItems.length}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseOrder.detail.summary.total')}</div>
            <div className={styles.summaryValue}>
              {currencyLabel(order.currency, total)}
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t('purchaseOrder.detail.info.title')}</h3>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label={t('purchaseOrder.detail.info.sourcePr')}>
              {order.sourcePrNumber}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.prRequester')}>
              {order.sourceRequester || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.createdBy')}>
              {order.createdBy}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.department')}>
              {order.department || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.status')}>
              {formatStatus(order.status, t)}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.matchedSuppliers')}>
              {supplierCount || 0}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.currency')}>
              {order.currency}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t('purchaseOrder.detail.items.title')}</h3>
          <Paragraph type="secondary">
            {t('purchaseOrder.detail.items.description')}
          </Paragraph>

          <div className={styles.itemList}>
            {order.lineItems.map((item, index) => (
              <ItemDetailCard
                key={item.tempId}
                item={item}
                currency={order.currency}
                index={index}
                t={t}
              />
            ))}
          </div>
        </div>

        {order.status === "DRAFT" ? (
          <div className={styles.actionRow}>
            <Button type="primary" icon={<SendOutlined />} onClick={onSubmit}>
              {t('purchaseOrder.detail.actions.submit')}
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
