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
  appendSupplierDelivery,
  createDeliveryFromAcknowledgement,
  hydrateSupplierOrderAcknowledgements,
  loadSupplierOrderAcknowledgements,
  type SupplierOrderAcknowledgementRecord,
  updateSupplierOrderAcknowledgement,
} from "../../modules/supplierFulfillment/workflow";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";
import { getSessionUser } from "../../shared/auth/session";
import { formatPaymentTerm } from "../../shared/utils/paymentTerms";
import { workflowLineTax, workflowTaxRules, workflowTaxSummary } from "../../shared/utils/workflowTax";
import RejectReasonModal from "../../shared/components/RejectReasonModal";

import styles from "../purchasing/ApprovalDetailSubmodule.module.css";
import WorkflowDocumentActions from "../../components/shared/WorkflowDocumentActions";
import WorkflowPartyInfo from "../../components/shared/WorkflowPartyInfo";

const { Paragraph, Title } = Typography;

function currencyLabel(currency: string, amount: number): string {
  return `${currency === "MYR" ? "RM" : currency} ${amount.toFixed(2)}`;
}

function statusColor(status: SupplierOrderAcknowledgementRecord["status"]): string {
  switch (status) {
    case "PENDING_ORDER_ACKNOWLEDGE":
      return "orange";
    case "APPROVED":
      return "green";
    case "REJECTED":
      return "red";
    default:
      return "default";
  }
}

function statusText(status: SupplierOrderAcknowledgementRecord["status"], t: any): string {
  switch (status) {
    case "PENDING_ORDER_ACKNOWLEDGE":
      return t("orderAcknowledgement.detail.status.pendingOrderAcknowledge");
    case "APPROVED":
      return t("orderAcknowledgement.detail.status.approved");
    case "REJECTED":
      return t("orderAcknowledgement.detail.status.rejected");
    default:
      return status;
  }
}

function ItemDetailCard({
  item,
  currency,
  index,
  t,
  fallbackRules,
}: {
  item: DraftLineItem;
  currency: string;
  index: number;
  t: any;
  fallbackRules: ReturnType<typeof workflowTaxRules>;
}): React.ReactElement {
  const line = workflowLineTax(item, fallbackRules);

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
          <span className={styles.detailLabel}>Line subtotal</span>
          <div className={styles.detailValue}>{currencyLabel(currency, line.subtotal)}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>Amount after tax</span>
          <div className={styles.detailValue}>{currencyLabel(currency, line.amountAfterTax)}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>Tax</span>
          <div className={styles.detailValue}>{line.label}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>Tax amount</span>
          <div className={styles.detailValue}>{currencyLabel(currency, line.taxAmount)}</div>
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

export default function OrderAcknowledgementDetailSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const { localId } = useParams();
  const [rows, setRows] = useState<SupplierOrderAcknowledgementRecord[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const sessionUser = useMemo(() => getSessionUser(), []);

  useEffect(() => {
    const sync = async (): Promise<void> => {
      await hydrateSupplierOrderAcknowledgements();
      setRows(loadSupplierOrderAcknowledgements());
    };
    const handleSync = (): void => {
      void sync();
    };

    void sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-order-acks", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-order-acks", handleSync);
    };
  }, []);

  const row = useMemo(() => rows.find((item) => item.localId === localId), [localId, rows]);

  const onApprove = (): void => {
    if (!row) return;
    appendSupplierDelivery(createDeliveryFromAcknowledgement(row));
    updateSupplierOrderAcknowledgement(row.localId, (draft) => ({
      ...draft,
      status: "APPROVED",
    }));
    message.success(t("orderAcknowledgement.list.messages.acknowledged", { poNumber: row.poNumber }));
    navigate("/supplier-overview/delivery");
  };

  const onReject = (): void => {
    if (!row) return;
    setRejectOpen(true);
  };

  const onRejectConfirm = (reason: string): void => {
    if (!row) return;
    updateSupplierOrderAcknowledgement(row.localId, (draft) => ({
      ...draft,
      status: "REJECTED",
      rejectionReason: reason,
      rejectedBy:
        sessionUser?.name?.trim() ||
        sessionUser?.email ||
        draft.supplierName ||
        draft.supplierEmail,
    }));
    message.success(t("orderAcknowledgement.list.messages.rejected", { poNumber: row.poNumber }));
    navigate("/supplier-overview/order-acknowledgement");
  };

  if (!row) {
    return (
      <Card>
        <Empty description={t("orderAcknowledgement.detail.messages.notFound")} />
      </Card>
    );
  }

  const taxSummary = workflowTaxSummary(row);
  const taxRules = workflowTaxRules(row);

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/supplier-overview/order-acknowledgement")}
              style={{ paddingInline: 0 }}
              aria-label={t("orderAcknowledgement.detail.actions.back")}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t("orderAcknowledgement.detail.title")}
            </Title>
          </Flex>

          <Flex align="center" gap={8} wrap="wrap">
            <WorkflowDocumentActions workflowType="acknowledgement" record={row} filenamePrefix="order-acknowledgement" />
            <Tag color={statusColor(row.status)}>{statusText(row.status, t)}</Tag>
          </Flex>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("orderAcknowledgement.detail.summary.orderNumber")}</div>
            <div className={styles.summaryValue}>{row.poNumber}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("orderAcknowledgement.detail.summary.createdDate")}</div>
            <div className={styles.summaryValue}>{row.createdDate}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("orderAcknowledgement.detail.summary.items")}</div>
            <div className={styles.summaryValue}>{row.items.length}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("orderAcknowledgement.detail.summary.total")}</div>
            <div className={styles.summaryValue}>{currencyLabel(row.currency, taxSummary.total)}</div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t("orderAcknowledgement.detail.info.title")}</h3>
          <WorkflowPartyInfo workflowType="acknowledgement" record={row} />
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label={t("orderAcknowledgement.detail.info.sourcePr")}>{row.sourcePrNumber}</Descriptions.Item>
            <Descriptions.Item label={t("orderAcknowledgement.detail.info.purchaseRequester")}>
              {row.sourceRequester || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("orderAcknowledgement.detail.info.createdBy")}>{row.createdBy}</Descriptions.Item>
            <Descriptions.Item label={t("orderAcknowledgement.detail.info.department")}>{row.department || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("orderAcknowledgement.detail.info.paymentTerms")}>{formatPaymentTerm(row.paymentTerms)}</Descriptions.Item>
            <Descriptions.Item label={t("orderAcknowledgement.detail.info.currentStatus")}>{statusText(row.status, t)}</Descriptions.Item>
            {row.status === "REJECTED" ? (
              <>
                <Descriptions.Item label={t("orderAcknowledgement.detail.info.rejectedBy")}>
                  {row.rejectedBy || "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t("orderAcknowledgement.detail.info.rejectDescription")}>
                  {row.rejectionReason || "-"}
                </Descriptions.Item>
              </>
            ) : null}
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t("orderAcknowledgement.detail.items.title")}</h3>
          <Paragraph type="secondary">
            {t("orderAcknowledgement.detail.items.description")}
          </Paragraph>
          <div className={styles.itemList}>
            {row.items.map((item, index) => (
              <ItemDetailCard key={item.tempId} item={item} currency={row.currency} index={index} t={t} fallbackRules={taxRules} />
            ))}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Calculation summary</h3>
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Items subtotal">{currencyLabel(row.currency, taxSummary.subtotal)}</Descriptions.Item>
            {taxSummary.taxBreakdown.map((tax, index) => (
              <Descriptions.Item key={`${tax.label}-${index}`} label={`${tax.label}${tax.rate !== undefined ? ` (${tax.rate.toFixed(2)}%)` : ""}`}>
                {currencyLabel(row.currency, tax.amount)}
              </Descriptions.Item>
            ))}
            {!taxSummary.taxBreakdown.length ? <Descriptions.Item label="Tax">{currencyLabel(row.currency, 0)}</Descriptions.Item> : null}
            <Descriptions.Item label="Total payable">{currencyLabel(row.currency, taxSummary.total)}</Descriptions.Item>
          </Descriptions>
        </div>

        {row.status === "PENDING_ORDER_ACKNOWLEDGE" ? (
          <div className={styles.actionRow}>
            <Button danger icon={<CloseOutlined />} onClick={onReject}>
              {t("orderAcknowledgement.detail.actions.reject")}
            </Button>
            <Button type="primary" icon={<CheckOutlined />} onClick={onApprove}>
              {t("orderAcknowledgement.detail.actions.approve")}
            </Button>
          </div>
        ) : null}
        <RejectReasonModal
          open={rejectOpen}
          title={t("orderAcknowledgement.detail.modal.rejectTitle")}
          itemLabel={row.poNumber}
          onCancel={() => setRejectOpen(false)}
          onConfirm={(reason) => {
            setRejectOpen(false);
            onRejectConfirm(reason);
          }}
        />
      </div>
    </Card>
  );
}
