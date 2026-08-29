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
import { reserveBudgetForPR } from "../../shared/api/departmentBudget";

import {
  hydratePurchaseRequestDrafts,
  loadPurchaseRequestDrafts,
  updatePurchaseRequestDraft,
} from "../../modules/purchasing/requestCreation/storage";
import type {
  DraftLineItem,
  PurchaseRequestDraft,
} from "../../modules/purchasing/requestCreation/types";
import type { PurchaseOrderStatus } from "../../modules/purchasing/types";
import { computeTaxBreakdown } from "../../modules/purchasing/requestCreation/constants";

import styles from "./ReviewDetailSubmodule.module.css";
import WorkflowDocumentActions from "../../components/shared/WorkflowDocumentActions";

const { Paragraph, Text, Title } = Typography;

function formatStatus(status: PurchaseOrderStatus): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
  return `${currency === "MYR" ? "RM" : currency} ${amount.toFixed(2)}`;
}

function ItemDetailCard({
  item,
  currency,
  index,
}: {
  item: DraftLineItem;
  currency: string;
  index: number;
}): React.ReactElement {
  const { t } = useTranslation('purchasing');
  const lineSubtotal = item.quantity * item.unitPrice;

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <div>
          <div className={styles.itemIndex}>{t('purchaseRequest.detail.items.item', { index: index + 1 })}</div>
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

export default function ReviewDetailSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const { localId } = useParams();
  const [requests, setRequests] = useState<PurchaseRequestDraft[]>([]);

  useEffect(() => {
    const syncRequests = async (): Promise<void> => {
      await hydratePurchaseRequestDrafts();
      setRequests(loadPurchaseRequestDrafts());
    };

    void syncRequests();
    const handleSync = (): void => {
      void syncRequests();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-purchase-request-drafts", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-purchase-request-drafts", handleSync);
    };
  }, []);

  const request = useMemo(
    () => requests.find((item) => item.localId === localId),
    [localId, requests],
  );

  const onSubmit = async (): Promise<void> => {
    if (!request) return;

    let budgetReservedAt = request.budgetReservedAt;
    if (!budgetReservedAt) {
      const budgetResult = await reserveBudgetForPR({
        ...request,
        status: "SUBMITTED",
        requestedBy: request.createdByUserId,
        createdAt: request.requestDate,
      });
      if (!budgetResult.success) {
        message.error(budgetResult.reason ?? "Could not reserve department budget");
        return;
      }
      budgetReservedAt = new Date().toISOString();
    }

    updatePurchaseRequestDraft(request.localId, (draft) => ({
      ...draft,
      status: "SUBMITTED",
      budgetReservedAt,
      budgetReleasedAt: undefined,
    }));
    message.success(t('purchaseRequest.detail.messages.submitted', { prNumber: request.prNumber }));
    navigate("/purchasing/review");
  };

  if (!request) {
    return (
      <Card>
        <Empty description={t('purchaseRequest.detail.messages.notFound')} />
      </Card>
    );
  }

  const orderSubtotal = request.subtotal ?? request.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const orderRules = request.supplierTaxRules?.length ? request.supplierTaxRules : (request.supplierTaxApplies && request.supplierTaxType && request.supplierTaxType !== "NO_TAX" ? [{ taxType: request.supplierTaxType, taxRate: request.supplierTaxRate ?? 0 }] : []);
  const orderTaxBreakdown = computeTaxBreakdown(orderSubtotal, orderRules);
  const total = request.amountAfterTax ?? Math.round((orderSubtotal + orderTaxBreakdown.total) * 100) / 100;
  const supplierCount = new Set(
    request.lineItems.map((item) => item.supplierEmail || item.supplierName).filter(Boolean),
  ).size;

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing/review")}
              style={{ paddingInline: 0 }}
              aria-label={t('common.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseRequest.detail.title')}
            </Title>
          </Flex>

          <Flex align="center" gap={8}>
            {request.status === "DRAFT" ? (
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/purchasing/creation/${request.localId}`)}
                aria-label="Edit purchase request"
              >
                {t('purchaseRequest.detail.actions.edit')}
              </Button>
            ) : null}
            <WorkflowDocumentActions workflowType="purchase-request" record={request} filenamePrefix="purchase-request" />
            <Tag color={statusColor(request.status)}>{formatStatus(request.status)}</Tag>
          </Flex>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseRequest.detail.summary.prNumber')}</div>
            <div className={styles.summaryValue}>{request.prNumber}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseRequest.detail.summary.requestDate')}</div>
            <div className={styles.summaryValue}>{request.requestDate}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseRequest.detail.summary.items')}</div>
            <div className={styles.summaryValue}>{request.lineItems.length}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('purchaseRequest.detail.summary.total')}</div>
            <div className={styles.summaryValue}>
              {currencyLabel(request.currency, total)}
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t('purchaseRequest.detail.info.title')}</h3>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label={t('purchaseRequest.detail.info.requester')}>
              {request.requestBy}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseRequest.detail.info.department')}>
              {request.department || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseRequest.detail.info.paymentTerms')}>
              {request.paymentTerms ? t(`purchaseRequest.creation.form.paymentTermOptions.${request.paymentTerms}`, { defaultValue: request.paymentTerms }) : "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseRequest.detail.info.status')}>
              {formatStatus(request.status)}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseRequest.detail.info.matchedSuppliers')}>
              {supplierCount || 0}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t('purchaseRequest.detail.items.title')}</h3>
          <Paragraph type="secondary">
            {t('purchaseRequest.detail.items.description')}
          </Paragraph>

          <div className={styles.itemList}>
            {request.lineItems.map((item, index) => (
              <ItemDetailCard
                key={item.tempId}
                item={item}
                currency={request.currency}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Calculation summary</h3>
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Items subtotal">{currencyLabel(request.currency, orderSubtotal)}</Descriptions.Item>
            {orderRules.map((rule, index) => <Descriptions.Item key={`${rule.taxType}-${index}`} label={`${({ SALES_TAX: "Sales tax", SERVICE_TAX: "Service tax", OTHER: "Other tax" } as Record<string, string>)[rule.taxType] ?? "Tax"} (${Number(rule.taxRate ?? 0).toFixed(2)}%)`}>{currencyLabel(request.currency, orderTaxBreakdown.amounts[index] ?? 0)}</Descriptions.Item>)}
            <Descriptions.Item label="Total payable">{currencyLabel(request.currency, total)}</Descriptions.Item>
          </Descriptions>
        </div>

        {request.status === "DRAFT" ? (
          <div className={styles.actionRow}>
            <Button type="primary" icon={<SendOutlined />} onClick={onSubmit}>
              {t('purchaseRequest.detail.actions.submit')}
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
