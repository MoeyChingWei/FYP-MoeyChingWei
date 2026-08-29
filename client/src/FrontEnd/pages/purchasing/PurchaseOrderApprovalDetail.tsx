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
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  hydratePurchaseOrderDrafts,
  loadPurchaseOrderDrafts,
  updatePurchaseOrderDraft,
} from "../../modules/purchasing/purchaseOrder/storage";
import type { PurchaseOrderDraft } from "../../modules/purchasing/purchaseOrder/types";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";
import {
  computeTaxBreakdown,
} from "../../modules/purchasing/requestCreation/constants";
import {
  appendSupplierOrderAcknowledgements,
  createOrderAcknowledgementRecordsFromPurchaseOrder,
} from "../../modules/supplierFulfillment/workflow";
import { getSessionUser } from "../../shared/auth/session";
import RejectReasonModal from "../../shared/components/RejectReasonModal";

import styles from "./ApprovalDetailSubmodule.module.css";
import WorkflowDocumentActions from "../../components/shared/WorkflowDocumentActions";

const { Paragraph, Title } = Typography;

function currencyLabel(currency: string, amount: number): string {
  return `${currency === "MYR" ? "RM" : currency} ${amount.toFixed(2)}`;
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
  const lineSubtotal = item.quantity * item.unitPrice;

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <div>
          <div className={styles.itemIndex}>{t('purchaseOrder.detail.items.item', { index: index + 1 })}</div>
          <div className={styles.itemTitleRow}>
            {item.itemImageUrl ? <img src={item.itemImageUrl} alt="" className={styles.itemImage} /> : null}
            <h4 className={styles.itemTitle}>{item.itemName}</h4>
          </div>
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
          <span className={styles.detailLabel}>Line subtotal</span>
          <div className={styles.detailValue}>
            {currencyLabel(currency, lineSubtotal)}
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

export default function PurchaseOrderApprovalDetail(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const { localId } = useParams();
  const [orders, setOrders] = useState<PurchaseOrderDraft[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const sessionUser = useMemo(() => getSessionUser(), []);

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

  const onUpdateStatus = (
    nextStatus: "APPROVED" | "REJECTED",
    rejectionReason?: string,
  ): void => {
    if (!order) return;

    let acknowledgementCount = 0;

    if (nextStatus === "APPROVED") {
      const acknowledgementRows =
        createOrderAcknowledgementRecordsFromPurchaseOrder(order);
      acknowledgementCount = acknowledgementRows.length;
      appendSupplierOrderAcknowledgements(acknowledgementRows);
    }

    updatePurchaseOrderDraft(order.localId, (draft) => ({
      ...draft,
      status: nextStatus,
      rejectionReason:
        nextStatus === "REJECTED" ? rejectionReason : draft.rejectionReason,
      rejectedBy:
        nextStatus === "REJECTED"
          ? sessionUser?.name?.trim() || sessionUser?.email || draft.createdBy
          : draft.rejectedBy,
    }));

    if (nextStatus === "APPROVED" && acknowledgementCount > 1) {
      message.success(
        t('purchaseOrder.approval.messages.approvedWithAcknowledgements', { poNumber: order.poNumber, count: acknowledgementCount }),
      );
    } else if (nextStatus === "APPROVED" && acknowledgementCount === 1) {
      message.success(
        t('purchaseOrder.approval.messages.approvedWithAcknowledgement', { poNumber: order.poNumber }),
      );
    } else if (nextStatus === "APPROVED") {
      message.warning(
        t('purchaseOrder.approval.messages.approvedNoAcknowledgement', { poNumber: order.poNumber }),
      );
    } else {
      message.success(t('purchaseOrder.approval.messages.rejected', { poNumber: order.poNumber }));
    }
    navigate("/purchasing/po-approval");
  };

  if (!order) {
    return (
      <Card>
        <Empty description={t('purchaseOrder.detail.messages.notFound')} />
      </Card>
    );
  }

  const supplierCount = new Set(
    order.lineItems.map((item) => item.supplierEmail || item.supplierName).filter(Boolean),
  ).size;
  const orderSubtotal = order.subtotal ?? order.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const orderRules = order.supplierTaxRules?.length ? order.supplierTaxRules : (order.supplierTaxApplies && order.supplierTaxType && order.supplierTaxType !== "NO_TAX" ? [{ taxType: order.supplierTaxType, taxRate: order.supplierTaxRate ?? 0 }] : []);
  const taxBreakdown = computeTaxBreakdown(orderSubtotal, orderRules);
  const total = order.amountAfterTax ?? Math.round((orderSubtotal + taxBreakdown.total) * 100) / 100;

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing/po-approval")}
              style={{ paddingInline: 0 }}
              aria-label={t('purchaseOrder.detail.actions.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseOrder.detail.approvalTitle')}
            </Title>
          </Flex>

          <Flex align="center" gap={8} wrap="wrap">
            <WorkflowDocumentActions workflowType="purchase-order" record={order} filenamePrefix="purchase-order" />
            <Tag color="blue">{t('purchaseOrder.review.status.submitted')}</Tag>
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
          <h3 className={styles.sectionTitle}>{t('purchaseOrder.detail.info.approvalTitle')}</h3>
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
            <Descriptions.Item label={t('purchaseOrder.detail.info.currentStatus')}>
              {t('purchaseOrder.review.status.submitted')}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.matchedSuppliers')}>
              {supplierCount || 0}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.currency')}>
              {order.currency === "MYR" ? "RM" : order.currency}
            </Descriptions.Item>
            {order.status === "REJECTED" ? (
              <>
                <Descriptions.Item label={t('purchaseOrder.detail.info.rejectedBy')}>
                  {order.rejectedBy || "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t('purchaseOrder.detail.info.rejectDescription')}>
                  {order.rejectionReason || "-"}
                </Descriptions.Item>
              </>
            ) : null}
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t('purchaseOrder.detail.items.submittedTitle')}</h3>
          <Paragraph type="secondary">
            {t('purchaseOrder.detail.items.approvalDescription')}
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

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Calculation summary</h3>
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Items subtotal">{currencyLabel(order.currency, orderSubtotal)}</Descriptions.Item>
            {orderRules.map((rule, index) => <Descriptions.Item key={`${rule.taxType}-${index}`} label={`${({ SALES_TAX: "Sales tax", SERVICE_TAX: "Service tax", OTHER: "Other tax" } as Record<string, string>)[rule.taxType] ?? "Tax"} (${Number(rule.taxRate ?? 0).toFixed(2)}%)`}>{currencyLabel(order.currency, taxBreakdown.amounts[index] ?? 0)}</Descriptions.Item>)}
            <Descriptions.Item label="Total payable">{currencyLabel(order.currency, total)}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.actionRow}>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => setRejectOpen(true)}
          >
            {t('purchaseOrder.detail.actions.reject')}
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => onUpdateStatus("APPROVED")}
          >
            {t('purchaseOrder.detail.actions.approve')}
          </Button>
        </div>
        <RejectReasonModal
          open={rejectOpen}
          title={t('purchaseOrder.detail.modal.rejectTitle')}
          itemLabel={order.poNumber}
          onCancel={() => setRejectOpen(false)}
          onConfirm={(reason) => {
            setRejectOpen(false);
            onUpdateStatus("REJECTED", reason);
          }}
        />
      </div>
    </Card>
  );
}
