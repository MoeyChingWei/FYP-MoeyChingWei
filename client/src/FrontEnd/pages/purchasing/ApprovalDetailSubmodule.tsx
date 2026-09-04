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
  hydratePurchaseRequestDrafts,
  loadPurchaseRequestDrafts,
  updatePurchaseRequestDraft,
} from "../../modules/purchasing/requestCreation/storage";
import {
  appendPurchaseOrderDraft,
  createPurchaseOrderFromRequest,
} from "../../modules/purchasing/purchaseOrder/storage";
import type {
  DraftLineItem,
  PurchaseRequestDraft,
} from "../../modules/purchasing/requestCreation/types";
import { getSessionUser } from "../../shared/auth/session";
import {
  computeTaxBreakdown,
} from "../../modules/purchasing/requestCreation/constants";
import RejectReasonModal from "../../shared/components/RejectReasonModal";
import { deductBudgetForPR, releaseBudgetForPR } from "../../shared/api/departmentBudget";
import {
  commitSupplierInventory,
  releaseSupplierInventory,
  reserveSupplierInventory,
} from "../../modules/supplierFulfillment/inventory";

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

export default function ApprovalDetailSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const { localId } = useParams();
  const [requests, setRequests] = useState<PurchaseRequestDraft[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const sessionUser = useMemo(() => getSessionUser(), []);

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

  const onUpdateStatus = async (
    nextStatus: "APPROVED" | "REJECTED",
    rejectionReason?: string,
  ): Promise<void> => {
    if (!request) return;

    const inventoryReservations = request.lineItems
      .filter((item) => item.supplierInventoryItemId && item.quantity > 0)
      .map((item) => ({
        inventoryItemId: item.supplierInventoryItemId,
        quantity: item.quantity,
        supplierId: item.supplierId,
        itemName: item.itemName,
        category: item.itemCategory,
        unit: item.unitOfMeasurement,
      }));

    try {
      if (nextStatus === "APPROVED" && inventoryReservations.length) {
        // Legacy requests may predate reservation support; reserve them before
        // committing so approval still has the same inventory semantics.
        if (request.inventoryReservationStatus !== "RESERVED") {
          await reserveSupplierInventory(inventoryReservations);
        }
        await commitSupplierInventory(inventoryReservations);
      }
      if (
        nextStatus === "REJECTED" &&
        request.inventoryReservationStatus === "RESERVED" &&
        inventoryReservations.length
      ) {
        await releaseSupplierInventory(inventoryReservations);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not update inventory");
      return;
    }

    const isSelfApproved =
      nextStatus === "APPROVED" &&
      sessionUser?.role === "Manager" &&
      request.requesterRole === "Manager" &&
      request.createdByUserId === sessionUser.id;

    const updatedRequest = {
      ...request,
      status: nextStatus,
      requestedBy: request.createdByUserId,
      createdAt: request.requestDate,
      inventoryReservationStatus:
        nextStatus === "APPROVED"
          ? "COMMITTED"
          : request.inventoryReservationStatus === "RESERVED"
            ? "RELEASED"
            : request.inventoryReservationStatus,
      rejectionReason:
        nextStatus === "REJECTED" ? rejectionReason : request.rejectionReason,
      isSelfApproved: isSelfApproved || request.isSelfApproved,
    };

    if (nextStatus === "APPROVED") {
      const budgetResult = await deductBudgetForPR(updatedRequest);
      if (!budgetResult.success) {
        message.error(`Approval blocked: ${budgetResult.reason ?? "budget deduction failed"}`);
        return;
      }
      appendPurchaseOrderDraft(createPurchaseOrderFromRequest(request, sessionUser));
    }

    if (nextStatus === "REJECTED" && !request.budgetReleasedAt) {
      const budgetResult = await releaseBudgetForPR({
        ...updatedRequest,
        status: "REJECTED",
        requestedBy: request.createdByUserId,
        createdAt: request.requestDate,
      });
      if (!budgetResult.success) {
        message.error(`Rejection blocked: ${budgetResult.reason ?? "budget release failed"}`);
        return;
      }
    }

    updatePurchaseRequestDraft(request.localId, (draft) => ({
      ...draft,
      status: nextStatus,
      ...(nextStatus === "APPROVED" ? { budgetDeductedAt: new Date().toISOString() } : {}),
      inventoryReservationStatus:
        nextStatus === "APPROVED"
          ? "COMMITTED"
          : draft.inventoryReservationStatus === "RESERVED"
            ? "RELEASED"
            : draft.inventoryReservationStatus,
      rejectionReason:
        nextStatus === "REJECTED" ? rejectionReason : draft.rejectionReason,
      ...(nextStatus === "REJECTED"
        ? { budgetReleasedAt: draft.budgetReleasedAt ?? new Date().toISOString() }
        : {}),
      isSelfApproved: isSelfApproved || draft.isSelfApproved,
    }));

    // Deduct budget when PR is approved
    if (nextStatus === "APPROVED") {
      console.log("🔵 [BUDGET] Triggering budget deduction for approved PR");

      Promise.resolve({
        success: true,
        deductedAmount: 0,
        warnings: [] as Array<{ threshold: number; percentage: number }>,
        reason: undefined as string | undefined,
      })
        .then(result => {
          if (result.success) {
            console.log(`✅ [BUDGET] Deducted $${result.deductedAmount?.toFixed(2)} from department budget`);

            if (result.warnings && result.warnings.length > 0) {
              result.warnings.forEach(w => {
                console.warn(`⚠️ [BUDGET] Warning: ${w.threshold}% budget threshold reached (${w.percentage.toFixed(1)}%)`);
              });
            }
          } else {
            console.warn(`⚠️ [BUDGET] Budget deduction failed: ${result.reason}`);
          }
        })
        .catch(error => {
          console.error("❌ [BUDGET] Budget deduction error:", error);
        });
    }

    message.success(
      nextStatus === "APPROVED"
        ? t('purchaseRequest.approval.messages.approved', { prNumber: request.prNumber })
        : t('purchaseRequest.approval.messages.rejected', { prNumber: request.prNumber })
    );
    navigate(
      nextStatus === "APPROVED"
        ? "/purchasing/po-review"
        : "/purchasing/approval",
    );
  };

  if (!request) {
    return (
      <Card>
        <Empty description={t('purchaseRequest.detail.messages.notFound')} />
      </Card>
    );
  }

  const supplierCount = new Set(
    request.lineItems.map((item) => item.supplierEmail || item.supplierName).filter(Boolean),
  ).size;
  const orderSubtotal = request.subtotal ?? request.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const orderRules = request.supplierTaxRules?.length ? request.supplierTaxRules : (request.supplierTaxApplies && request.supplierTaxType && request.supplierTaxType !== "NO_TAX" ? [{ taxType: request.supplierTaxType, taxRate: request.supplierTaxRate ?? 0 }] : []);
  const orderTaxBreakdown = computeTaxBreakdown(orderSubtotal, orderRules);
  const total = request.amountAfterTax ?? Math.round((orderSubtotal + orderTaxBreakdown.total) * 100) / 100;

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing/approval")}
              style={{ paddingInline: 0 }}
              aria-label={t('common.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseRequest.detail.approvalTitle')}
            </Title>
          </Flex>

          <Flex align="center" gap={8} wrap="wrap">
            <WorkflowDocumentActions workflowType="purchase-request" record={request} filenamePrefix="purchase-request" />
            <Tag color="blue">{t('purchaseRequest.review.status.submitted')}</Tag>
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
          <h3 className={styles.sectionTitle}>{t('purchaseRequest.detail.info.approvalTitle')}</h3>
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
            <Descriptions.Item label={t('purchaseRequest.detail.info.currentStatus')}>
              {t('purchaseRequest.review.status.submitted')}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseRequest.detail.info.matchedSuppliers')}>
              {supplierCount || 0}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseOrder.detail.info.currency')}>
              {request.currency === "MYR" ? "RM" : request.currency}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t('purchaseRequest.detail.items.submittedTitle')}</h3>
          <Paragraph type="secondary">
            {t('purchaseRequest.detail.items.approvalDescription')}
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

        <div className={styles.actionRow}>
          <Button danger icon={<CloseOutlined />} onClick={() => setRejectOpen(true)}>
            {t('purchaseRequest.approval.actions.reject')}
          </Button>
          <Button type="primary" icon={<CheckOutlined />} onClick={() => onUpdateStatus("APPROVED")}>
            {t('purchaseRequest.approval.actions.approve')}
          </Button>
        </div>
        <RejectReasonModal
          open={rejectOpen}
          title={t('purchaseRequest.detail.modal.rejectTitle')}
          itemLabel={request.prNumber}
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
