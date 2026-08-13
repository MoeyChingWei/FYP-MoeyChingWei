import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Flex,
  Input,
  Popconfirm,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import {
  hydratePurchaseOrderDrafts,
  loadPurchaseOrderDrafts,
  removePurchaseOrderDrafts,
} from "../../modules/purchasing/purchaseOrder/storage";
import type { PurchaseOrderDraft } from "../../modules/purchasing/purchaseOrder/types";
import type { PurchaseOrderStatus } from "../../modules/purchasing/types";
import { computeDraftLineAmountAfterTax } from "../../modules/purchasing/requestCreation/constants";
import { UserRole } from "../../shared/types/roles";
import ExportButton from "../../components/shared/ExportButton";
import PrintButton from "../../components/shared/PrintButton";

import styles from "./PurchaseOrderReview.module.css";

const { Text, Title } = Typography;

function formatStatus(status: PurchaseOrderStatus, t: any): string {
  const key = `purchaseOrder.review.status.${status.toLowerCase()}`;
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

export default function PurchaseOrderReview(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrderDraft[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  const sessionUser = useMemo(() => getSessionUser(), []);
  const normalizedRole = String(sessionUser?.role ?? "").trim().toLowerCase();
  const canViewAllOrders =
    sessionUser?.role === UserRole.ADMIN ||
    sessionUser?.role === UserRole.MANAGER ||
    normalizedRole === "super admin";
  const isAdmin = canViewAllOrders;

  const filteredOrders = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    const source = [...orders].reverse().filter((order) => {
      if (canViewAllOrders) return true;
      if (!sessionUser) return false;

      if (sessionUser.id && order.createdByUserId != null) {
        return String(order.createdByUserId) === String(sessionUser.id);
      }

      const sessionEmail = String(sessionUser.email ?? "").trim().toLowerCase();
      const creatorEmail = String(order.createdByEmail ?? "").trim().toLowerCase();
      return !!sessionEmail && creatorEmail === sessionEmail;
    });

    return source.filter((order) => {
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
        formatStatus(order.status, t),
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [canViewAllOrders, orders, searchValue, selectedDate, sessionUser]);

  const draftOrders = useMemo(
    () => filteredOrders.filter((order) => order.status === "DRAFT"),
    [filteredOrders],
  );

  const otherOrders = useMemo(
    () => filteredOrders.filter((order) => order.status !== "DRAFT"),
    [filteredOrders],
  );

  // Get unique dates that have purchase orders
  const datesWithOrders = useMemo(() => {
    const dates = new Set<string>();
    orders.forEach((order) => {
      if (order.createdDate) {
        dates.add(order.createdDate);
      }
    });
    return dates;
  }, [orders]);

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

  const columns = [
    {
      title: "",
      key: "detail",
      width: 72,
      align: "center" as const,
      render: (_: unknown, order: PurchaseOrderDraft) => (
        <Button
          size="small"
          onClick={() => navigate(`/purchasing/po-review/${order.localId}`)}
          aria-label={`Open ${order.poNumber} detail`}
        >
          {t('purchaseOrder.review.actions.view')}
        </Button>
      ),
    },
    {
      title: t('purchaseOrder.review.table.poNo'),
      key: "poNumber",
      render: (_: unknown, order: PurchaseOrderDraft) => (
        <div className={styles.poCell}>
          <Text strong>{order.poNumber}</Text>
          <span className={styles.poMeta}>{order.createdDate}</span>
        </div>
      ),
    },
    {
      title: t('purchaseOrder.review.table.status'),
      dataIndex: "status",
      key: "status",
      filters: [
        { text: t('purchaseOrder.review.status.draft'), value: "DRAFT" },
        { text: t('purchaseOrder.review.status.submitted'), value: "SUBMITTED" },
        { text: t('purchaseOrder.review.status.approved'), value: "APPROVED" },
        { text: t('purchaseOrder.review.status.rejected'), value: "REJECTED" },
      ],
      onFilter: (value: React.Key | boolean, order: PurchaseOrderDraft) =>
        order.status === value,
      render: (status: PurchaseOrderStatus) => (
        <Tag color={statusColor(status)}>{formatStatus(status, t)}</Tag>
      ),
    },
    {
      title: t('purchaseOrder.review.table.itemSummary'),
      key: "itemSummary",
      render: (_: unknown, order: PurchaseOrderDraft) => {
        const firstItem = order.lineItems[0];
        const extraCount = Math.max(order.lineItems.length - 1, 0);

        return (
          <div className={styles.poCell}>
            <Text>{firstItem?.itemName || "-"}</Text>
            <span className={styles.poMeta}>
              {extraCount > 0
                ? t('purchaseOrder.review.table.moreItems', { count: extraCount })
                : firstItem?.itemCategory || "-"}
            </span>
          </div>
        );
      },
    },
    {
      title: t('purchaseOrder.review.table.department'),
      dataIndex: "department",
      key: "department",
      render: (value?: string) => (
        <span className={styles.muted}>{value || "-"}</span>
      ),
    },
    {
      title: t('purchaseOrder.review.table.createdBy'),
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: t('purchaseOrder.review.table.items'),
      key: "itemCount",
      align: "center" as const,
      render: (_: unknown, order: PurchaseOrderDraft) => order.lineItems.length,
    },
    {
      title: t('purchaseOrder.review.table.total'),
      key: "total",
      align: "right" as const,
      render: (_: unknown, order: PurchaseOrderDraft) => {
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
  ];

  const onDeleteSelected = (): void => {
    const ids = selectedRowKeys.map(String);
    if (!ids.length) return;
    removePurchaseOrderDrafts(ids);
    setSelectedRowKeys([]);
    message.success(t('purchaseOrder.review.messages.deleteSuccess'));
  };

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.topbar}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing")}
              style={{ paddingInline: 0 }}
              aria-label={t('purchaseOrder.review.actions.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseOrder.review.title')}
            </Title>
          </Flex>

          <div className={styles.toolbar}>
            {isAdmin ? (
              <Popconfirm
                title={t('purchaseOrder.review.actions.deleteSelected')}
                okText={t('common.delete')}
                cancelText={t('common.cancel')}
                onConfirm={onDeleteSelected}
                disabled={!selectedRowKeys.length}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!selectedRowKeys.length}
                  aria-label="Delete selected purchase orders"
                />
              </Popconfirm>
            ) : null}
            <DatePicker
              allowClear
              className={styles.datePicker}
              placeholder={t('purchaseOrder.review.filter.filterByDate')}
              format="YYYY-MM-DD"
              cellRender={cellRender}
              onChange={(_, dateString) =>
                setSelectedDate(typeof dateString === "string" ? dateString : "")
              }
            />
            <Input
              allowClear
              className={styles.search}
              placeholder={t('purchaseOrder.review.filter.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <Flex gap={8}>
              <ExportButton
                dataType="purchase-orders"
                data={filteredOrders as unknown as Record<string, unknown>[]}
                onExportSuccess={() => message.success(tMsg('export.success'))}
                onExportError={() => message.error(tMsg('export.error'))}
              />
              <PrintButton
                dataType="purchase-orders"
                data={filteredOrders as unknown as Record<string, unknown>[]}
                onPrintError={() => message.error(tMsg('print.error'))}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/purchasing/po-creation")}
              >
                {t('purchaseOrder.review.actions.create')}
              </Button>
            </Flex>
          </div>
        </div>
        {draftOrders.length ? (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('purchaseOrder.review.section.draft')}</h3>
            <div className={styles.tableWrap}>
              <Table
                rowKey="localId"
                dataSource={draftOrders}
                pagination={false}
                scroll={{ x: 980 }}
                columns={columns}
                rowSelection={
                  isAdmin
                    ? {
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        ) : null}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('purchaseOrder.review.section.otherStatus')}</h3>
          <div className={styles.tableWrap}>
            <Table
              rowKey="localId"
              dataSource={otherOrders}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: 980 }}
              locale={{ emptyText: <Empty description={t('purchaseOrder.review.messages.noPurchaseOrdersFound')} /> }}
              columns={columns}
              rowSelection={
                isAdmin
                  ? {
                      selectedRowKeys,
                      onChange: setSelectedRowKeys,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
