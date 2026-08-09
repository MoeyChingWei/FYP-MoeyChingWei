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
import RejectReasonModal from "../../shared/components/RejectReasonModal";

import styles from "./ApprovalDetailSubmodule.module.css";

const { Paragraph, Title } = Typography;

function currencyLabel(currency: string, amount: number): string {
  return `${currency} ${amount.toFixed(2)}`;
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
  const lineTotal = item.quantity * item.unitPrice;

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <div>
          <div className={styles.itemIndex}>{t('purchaseRequest.detail.items.item', { index: index + 1 })}</div>
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

  const onUpdateStatus = (
    nextStatus: "APPROVED" | "REJECTED",
    rejectionReason?: string,
  ): void => {
    if (!request) return;

    if (nextStatus === "APPROVED") {
      appendPurchaseOrderDraft(createPurchaseOrderFromRequest(request, sessionUser));
    }

    const isSelfApproved =
      nextStatus === "APPROVED" &&
      sessionUser?.role === "Manager" &&
      request.requesterRole === "Manager" &&
      request.createdByUserId === sessionUser.id;

    updatePurchaseRequestDraft(request.localId, (draft) => ({
      ...draft,
      status: nextStatus,
      rejectionReason:
        nextStatus === "REJECTED" ? rejectionReason : draft.rejectionReason,
      isSelfApproved: isSelfApproved || draft.isSelfApproved,
    }));

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

  const total = request.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
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
              onClick={() => navigate("/purchasing/approval")}
              style={{ paddingInline: 0 }}
              aria-label={t('common.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseRequest.detail.approvalTitle')}
            </Title>
          </Flex>

          <Tag color="blue">{t('purchaseRequest.review.status.submitted')}</Tag>
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
            <Descriptions.Item label={t('purchaseRequest.detail.info.currentStatus')}>
              {t('purchaseRequest.review.status.submitted')}
            </Descriptions.Item>
            <Descriptions.Item label={t('purchaseRequest.detail.info.matchedSuppliers')}>
              {supplierCount || 0}
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
