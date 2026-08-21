import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Input,
  Modal,
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
  computeDraftLineAmountAfterTax,
  taxLabelForDraftLine,
  todayIsoDate,
} from "../../modules/purchasing/requestCreation/constants";
import {
  loadSupplierGrns,
  type SupplierGrnRecord,
  updateSupplierGrn,
} from "../../modules/supplierFulfillment/workflow";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";

import styles from "./ApprovalDetailSubmodule.module.css";
import WorkflowDocumentActions from "../../components/shared/WorkflowDocumentActions";

const { Paragraph, Title } = Typography;

function currencyLabel(currency: string, amount: number): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function statusColor(status: SupplierGrnRecord["status"]): string {
  switch (status) {
    case "PENDING_GRN":
      return "orange";
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
      return t('grn.list.status.pendingGrn');
    case "COMPLETED":
      return t('grn.list.status.completed');
    case "DISCREPANCY":
      return t('grn.list.status.discrepancy');
    default:
      return status;
  }
}

function displayDeliveryNo(row: SupplierGrnRecord): string {
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
  const lineTotal = computeDraftLineAmountAfterTax(item);
  const taxAmount = item.taxAmount ??
    Math.round(item.quantity * item.unitPrice * (item.taxRate ?? 0)) / 100;

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
          <div className={styles.detailValue}>{item.unitOfMeasurement || "-"}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>{t('purchaseRequest.detail.items.fields.unitPrice')}</span>
          <div className={styles.detailValue}>{currencyLabel(currency, item.unitPrice)}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>Amount after tax</span>
          <div className={styles.detailValue}>{currencyLabel(currency, lineTotal)}</div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>Tax</span>
          <div className={styles.detailValue}>
            {taxLabelForDraftLine(item.taxType, item.taxRate)}
          </div>
        </div>
        <div className={styles.detailBlock}>
          <span className={styles.detailLabel}>Tax amount</span>
          <div className={styles.detailValue}>{currencyLabel(currency, taxAmount)}</div>
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

export default function GoodsReceivedNoteDetailSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const { localId } = useParams();
  const [rows, setRows] = useState<SupplierGrnRecord[]>([]);
  const [discrepancyModalOpen, setDiscrepancyModalOpen] = useState(false);
  const [discrepancyReason, setDiscrepancyReason] = useState("");

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

  const onReceived = (): void => {
    if (!row) return;
    updateSupplierGrn(row.localId, (draft) => ({
      ...draft,
      status: "COMPLETED",
      completedDate: todayIsoDate(),
      discrepancyReason: undefined,
    }));
    message.success(t('grn.detail.messages.received', { poNumber: row.poNumber }));
    navigate("/purchasing/goods-received-note");
  };

  const onDiscrepancy = (): void => {
    if (!row) return;
    setDiscrepancyModalOpen(true);
  };

  const onConfirmDiscrepancy = (): void => {
    if (!row) return;
    const reason = discrepancyReason.trim();
    if (!reason) {
      message.warning(t('grn.detail.messages.discrepancyReasonRequired'));
      return;
    }

    updateSupplierGrn(row.localId, (draft) => ({
      ...draft,
      status: "DISCREPANCY",
      discrepancyReason: reason,
    }));
    message.success(t('grn.detail.messages.discrepancyUpdated', { poNumber: row.poNumber }));
    setDiscrepancyReason("");
    setDiscrepancyModalOpen(false);
    navigate("/purchasing/goods-received-note");
  };

  if (!row) {
    return (
      <Card>
        <Empty description={t('grn.detail.messages.notFound')} />
      </Card>
    );
  }

  const total = row.items.reduce(
    (sum, item) => sum + computeDraftLineAmountAfterTax(item),
    0,
  );

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing/goods-received-note")}
              style={{ paddingInline: 0 }}
              aria-label={t('grn.detail.actions.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('grn.detail.title')}
            </Title>
          </Flex>
          <Flex align="center" gap={8} wrap="wrap">
            <WorkflowDocumentActions workflowType="grn" record={row} filenamePrefix="grn" />
            <Tag color={statusColor(row.status)}>{statusText(row.status, t)}</Tag>
          </Flex>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('grn.detail.summary.orderNumber')}</div>
            <div className={styles.summaryValue}>{displayDeliveryNo(row)}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('grn.detail.summary.createdDate')}</div>
            <div className={styles.summaryValue}>{row.createdDate}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('grn.detail.summary.items')}</div>
            <div className={styles.summaryValue}>{row.items.length}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t('grn.detail.summary.total')}</div>
            <div className={styles.summaryValue}>{currencyLabel(row.currency, total)}</div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t('grn.detail.info.title')}</h3>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label={t('grn.detail.info.sourcePr')}>{row.sourcePrNumber}</Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.originalOrderNo')}>
              {row.originalOrderNo || row.poNumber}
            </Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.purchaseRequester')}>
              {row.sourceRequester || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.createdBy')}>{row.createdBy}</Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.supplier')}>
              {row.supplierName || row.supplierEmail || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.supplierEmail')}>{row.supplierEmail || "-"}</Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.department')}>{row.department || "-"}</Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.currentStatus')}>{statusText(row.status, t)}</Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.companyAddress')} span={2}>
              {row.companyAddress}
            </Descriptions.Item>
            <Descriptions.Item label={t('grn.detail.info.discrepancyReason')} span={2}>
              {row.discrepancyReason || "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t('grn.detail.items.title')}</h3>
          <Paragraph type="secondary">
            {t('grn.detail.items.description')}
          </Paragraph>
          <div className={styles.itemList}>
            {row.items.map((item, index) => (
              <ItemDetailCard key={item.tempId} item={item} currency={row.currency} index={index} t={t} />
            ))}
          </div>
        </div>

        {row.status === "PENDING_GRN" ? (
          <div className={styles.actionRow}>
            <Button danger icon={<CloseOutlined />} onClick={onDiscrepancy}>
              {t('grn.detail.actions.discrepancy')}
            </Button>
            <Button type="primary" icon={<CheckOutlined />} onClick={onReceived}>
              {t('grn.detail.actions.received')}
            </Button>
          </div>
        ) : null}
      </div>
      <Modal
        open={discrepancyModalOpen}
        title={t('grn.detail.modal.discrepancyTitle')}
        okText={t('grn.detail.modal.submitDiscrepancy')}
        okButtonProps={{ danger: true, disabled: !discrepancyReason.trim() }}
        onCancel={() => {
          setDiscrepancyModalOpen(false);
          setDiscrepancyReason("");
        }}
        onOk={onConfirmDiscrepancy}
        destroyOnHidden
      >
        <Input.TextArea
          autoSize={{ minRows: 4, maxRows: 7 }}
          placeholder={t('grn.detail.modal.discrepancyPlaceholder')}
          value={discrepancyReason}
          onChange={(event) => setDiscrepancyReason(event.target.value)}
        />
      </Modal>
    </Card>
  );
}
