import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Flex,
  Input,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  hydratePurchaseOrderDrafts,
  loadPurchaseOrderDrafts,
  updatePurchaseOrderDraft,
} from "../../modules/purchasing/purchaseOrder/storage";
import type { PurchaseOrderDraft } from "../../modules/purchasing/purchaseOrder/types";
import { computeDraftLineAmountAfterTax } from "../../modules/purchasing/requestCreation/constants";
import {
  appendSupplierOrderAcknowledgements,
  createOrderAcknowledgementRecordsFromPurchaseOrder,
} from "../../modules/supplierFulfillment/workflow";
import { getSessionUser } from "../../shared/auth/session";
import RejectReasonModal from "../../shared/components/RejectReasonModal";

import styles from "./ApprovalSubmodule.module.css";

const { Text, Title } = Typography;

function sortOrdersByDate(orders: PurchaseOrderDraft[]): PurchaseOrderDraft[] {
  return orders
    .map((order, index) => ({ order, index }))
    .sort((left, right) => {
      const leftTime = Date.parse(left.order.createdDate);
      const rightTime = Date.parse(right.order.createdDate);

      if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
        return rightTime - leftTime;
      }

      return right.index - left.index;
    })
    .map(({ order }) => order);
}

export default function PurchaseOrderApproval(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrderDraft[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [rejectTarget, setRejectTarget] = useState<PurchaseOrderDraft | null>(null);
  const sessionUser = useMemo(() => getSessionUser(), []);
  const normalizedRole = String(sessionUser?.role ?? "").trim().toLowerCase();
  const canViewAllOrders =
    sessionUser?.role === "Admin" ||
    sessionUser?.role === "Manager" ||
    normalizedRole === "super admin";

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

  const submittedOrders = useMemo(() => {
    const visibleOrders = orders.filter((order) => {
      if (canViewAllOrders) return true;
      if (!sessionUser) return false;

      if (sessionUser.id && order.createdByUserId != null) {
        return String(order.createdByUserId) === String(sessionUser.id);
      }

      const sessionEmail = String(sessionUser.email ?? "").trim().toLowerCase();
      const creatorEmail = String(order.createdByEmail ?? "").trim().toLowerCase();
      return !!sessionEmail && creatorEmail === sessionEmail;
    });

    return sortOrdersByDate(
      visibleOrders.filter((order) => order.status === "SUBMITTED"),
    );
  }, [canViewAllOrders, orders, sessionUser]);

  const filteredOrders = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return submittedOrders.filter((order) => {
      const matchesDate = !selectedDate || order.createdDate === selectedDate;

      const itemText = order.lineItems
        .map((item) =>
          [
            item.itemName,
            item.itemDescription,
            item.itemCategory,
            item.unitOfMeasurement,
          ]
            .join(" ")
            .toLowerCase(),
        )
        .join(" ");

      const matchesKeyword = [
        order.poNumber,
        order.sourcePrNumber,
        order.createdDate,
        order.createdBy,
        order.department || "",
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [searchValue, selectedDate, submittedOrders]);

  // Get unique dates that have submitted orders
  const datesWithOrders = useMemo(() => {
    const dates = new Set<string>();
    submittedOrders.forEach((order) => {
      if (order.createdDate) {
        dates.add(order.createdDate);
      }
    });
    return dates;
  }, [submittedOrders]);

  // Custom date cell render - highlight dates with orders
  const cellRender = (current: Dayjs, info: any) => {
    // Only apply custom styling to date cells (not month/year cells)
    if (info.type !== 'date') {
      return info.originNode;
    }

    const dateString = current.format("YYYY-MM-DD");
    const hasOrder = datesWithOrders.has(dateString);

    return (
      <div
        className="ant-picker-cell-inner"
        style={{
          color: hasOrder ? '#000000' : '#d9d9d9',
          fontWeight: hasOrder ? 600 : 400,
        }}
      >
        {current.date()}
      </div>
    );
  };

  const onApprove = (order: PurchaseOrderDraft): void => {
    const acknowledgementRows =
      createOrderAcknowledgementRecordsFromPurchaseOrder(order);

    appendSupplierOrderAcknowledgements(acknowledgementRows);
    updatePurchaseOrderDraft(order.localId, (draft) => ({
      ...draft,
      status: "APPROVED",
    }));

    if (acknowledgementRows.length > 1) {
      message.success(
        t('purchaseOrder.approval.messages.approvedWithAcknowledgements', { poNumber: order.poNumber, count: acknowledgementRows.length }),
      );
      return;
    }

    if (acknowledgementRows.length === 1) {
      message.success(
        t('purchaseOrder.approval.messages.approvedWithAcknowledgement', { poNumber: order.poNumber }),
      );
      return;
    }

    message.warning(
      t('purchaseOrder.approval.messages.approvedNoAcknowledgement', { poNumber: order.poNumber }),
    );
  };

  const onRejectConfirm = (reason: string): void => {
    if (!rejectTarget) return;

    updatePurchaseOrderDraft(rejectTarget.localId, (draft) => ({
      ...draft,
      status: "REJECTED",
      rejectionReason: reason,
      rejectedBy:
        sessionUser?.name?.trim() || sessionUser?.email || draft.createdBy,
    }));
    message.success(t('purchaseOrder.approval.messages.rejected', { poNumber: rejectTarget.poNumber }));
    setRejectTarget(null);
  };

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing")}
              style={{ paddingInline: 0 }}
              aria-label={t('purchaseOrder.approval.actions.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseOrder.approval.title')}
            </Title>
          </Flex>

          <Flex gap={12} wrap="wrap">
            <DatePicker
              allowClear
              placeholder={t('purchaseOrder.approval.filter.filterByDate')}
              format="YYYY-MM-DD"
              cellRender={cellRender}
              onChange={(_, dateString) =>
                setSelectedDate(
                  typeof dateString === "string" ? dateString : "",
                )
              }
            />
            <Input
              allowClear
              style={{ width: "min(100%, 320px)" }}
              placeholder={t('purchaseOrder.approval.filter.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </Flex>
        </div>

        <div className={styles.summary}>
          <Text className={styles.summaryText}>
            {t('purchaseOrder.approval.summary', { count: filteredOrders.length })}
          </Text>
        </div>

        <div className={styles.tableWrap}>
          <Table
            rowKey="localId"
            dataSource={filteredOrders}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
            }}
            scroll={{ x: 1060 }}
            locale={{
              emptyText: (
                <Empty description={t('purchaseOrder.approval.messages.noPendingApprovals')} />
              ),
            }}
            columns={[
              {
                title: "",
                key: "detail",
                width: 72,
                align: "center",
                render: (_, order) => (
                  <Button
                    size="small"
                    onClick={() => navigate(`/purchasing/po-approval/${order.localId}`)}
                    aria-label={`Open ${order.poNumber} detail`}
                  >
                    {t('purchaseOrder.approval.actions.view')}
                  </Button>
                ),
              },
              {
                title: t('purchaseOrder.approval.table.poNo'),
                key: "poNumber",
                render: (_, order) => (
                  <div className={styles.prCell}>
                    <Text strong>{order.poNumber}</Text>
                    <span className={styles.prMeta}>{order.createdDate}</span>
                  </div>
                ),
              },
              {
                title: t('purchaseOrder.approval.table.status'),
                key: "status",
                render: () => <Tag color="blue">{t('purchaseOrder.review.status.submitted')}</Tag>,
              },
              {
                title: t('purchaseOrder.approval.table.createdBy'),
                dataIndex: "createdBy",
                key: "createdBy",
              },
              {
                title: t('purchaseOrder.approval.table.department'),
                dataIndex: "department",
                key: "department",
                render: (value?: string) => value || "-",
              },
              {
                title: t('purchaseOrder.approval.table.items'),
                key: "itemCount",
                align: "center",
                render: (_, order) => order.lineItems.length,
              },
              {
                title: t('purchaseOrder.approval.table.total'),
                key: "total",
                align: "right",
                render: (_, order) => {
                  const total = order.lineItems.reduce(
                    (sum, item) => sum + computeDraftLineAmountAfterTax(item),
                    0,
                  );

                  return (
                    <Text strong>
                      {order.currency} {total.toFixed(2)}
                    </Text>
                  );
                },
              },
              {
                title: t('common.actions'),
                key: "action",
                align: "center",
                render: (_, order) => (
                  <Flex justify="center" gap={8} wrap="wrap">
                    <Button
                      danger
                      icon={<CloseOutlined />}
                      onClick={() => setRejectTarget(order)}
                    >
                      {t('purchaseOrder.approval.actions.reject')}
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => onApprove(order)}
                    >
                      {t('purchaseOrder.approval.actions.approve')}
                    </Button>
                  </Flex>
                ),
              },
            ]}
          />
        </div>
        <RejectReasonModal
          open={!!rejectTarget}
          title={t('purchaseOrder.detail.modal.rejectTitle')}
          itemLabel={rejectTarget?.poNumber || t('purchaseOrder.detail.modal.rejectLabel')}
          onCancel={() => setRejectTarget(null)}
          onConfirm={onRejectConfirm}
        />
      </div>
    </Card>
  );
}
