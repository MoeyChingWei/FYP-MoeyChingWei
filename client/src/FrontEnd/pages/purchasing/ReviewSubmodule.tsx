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

import {
  hydratePurchaseRequestDrafts,
  loadPurchaseRequestDrafts,
  removePurchaseRequestDrafts,
} from "../../modules/purchasing/requestCreation/storage";
import type { PurchaseRequestDraft } from "../../modules/purchasing/requestCreation/types";
import type { PurchaseOrderStatus } from "../../modules/purchasing/types";
import { computeDraftLineAmountAfterTax } from "../../modules/purchasing/requestCreation/constants";
import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";

import styles from "./ReviewSubmodule.module.css";

const { Text, Title } = Typography;

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
    case "PENDING_APPROVAL":
      return "gold";
    case "APPROVED":
      return "green";
    case "REJECTED":
      return "red";
    case "ORDERED":
      return "cyan";
    case "CLOSED":
      return "purple";
    default:
      return "default";
  }
}

function sortRequestsByDate(requests: PurchaseRequestDraft[]): PurchaseRequestDraft[] {
  return requests
    .map((request, index) => ({ request, index }))
    .sort((left, right) => {
      const leftTime = Date.parse(left.request.requestDate);
      const rightTime = Date.parse(right.request.requestDate);

      if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
        return rightTime - leftTime;
      }

      // Keep the latest request first when requests share a date (or have an
      // invalid date), matching the insertion order used by the drafts store.
      return right.index - left.index;
    })
    .map(({ request }) => request);
}

export default function ReviewSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PurchaseRequestDraft[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  const sessionUser = useMemo(() => getSessionUser(), []);
  const isAdmin = sessionUser?.role === UserRole.ADMIN;

  const userRequests = useMemo(() => {
    if (isAdmin) return requests;
    if (!sessionUser) return [];

    return requests.filter((request) => {
      if (
        request.createdByUserId != null &&
        request.createdByUserId === sessionUser.id
      ) {
        return true;
      }

      if (
        request.createdByEmail &&
        request.createdByEmail.toLowerCase() === sessionUser.email.toLowerCase()
      ) {
        return true;
      }

      return (
        request.requestBy?.trim().toLowerCase() ===
          (sessionUser.name?.trim().toLowerCase() || "") ||
        request.requestBy?.trim().toLowerCase() ===
          sessionUser.email?.trim().toLowerCase()
      );
    });
  }, [isAdmin, requests, sessionUser]);

  const filteredRequests = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    const source = sortRequestsByDate(userRequests);

    return source.filter((request) => {
      const matchesDate =
        !selectedDate || request.requestDate === selectedDate;

      const itemText = (request.lineItems || [])
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
        request.prNumber,
        request.requestDate,
        request.requestBy,
        request.department || "",
        formatStatus(request.status),
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [searchValue, selectedDate, userRequests]);

  const draftRequests = useMemo(
    () => filteredRequests.filter((request) => request.status === "DRAFT"),
    [filteredRequests],
  );

  const otherRequests = useMemo(
    () => filteredRequests.filter((request) => request.status !== "DRAFT"),
    [filteredRequests],
  );

  // Get unique dates that have purchase requests
  const datesWithRequests = useMemo(() => {
    const dates = new Set<string>();
    userRequests.forEach((request) => {
      if (request.requestDate) {
        dates.add(request.requestDate);
      }
    });
    return dates;
  }, [userRequests]);

  // Custom date cell render - highlight dates with requests
  const cellRender = (current: Dayjs, info: any) => {
    // Only apply custom styling to date cells (not month/year cells)
    if (info.type !== 'date') {
      return info.originNode;
    }

    const dateString = current.format("YYYY-MM-DD");
    const hasRequest = datesWithRequests.has(dateString);

    return (
      <div
        className="ant-picker-cell-inner"
        style={{
          color: hasRequest ? '#000000' : '#d9d9d9',
          fontWeight: hasRequest ? 600 : 400,
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
      render: (_: unknown, request: PurchaseRequestDraft) => (
        <Button
          size="small"
          onClick={() => navigate(`/purchasing/review/${request.localId}`)}
          aria-label={`Open ${request.prNumber} detail`}
        >
          {t('purchaseRequest.review.actions.view')}
        </Button>
      ),
    },
    {
      title: t('purchaseRequest.review.table.prNo'),
      key: "prNumber",
      render: (_: unknown, request: PurchaseRequestDraft) => (
        <div className={styles.prCell}>
          <Text strong>{request.prNumber}</Text>
          <span className={styles.prMeta}>{request.requestDate}</span>
        </div>
      ),
    },
    {
      title: t('purchaseRequest.review.table.status'),
      dataIndex: "status",
      key: "status",
      filters: [
        { text: t('purchaseRequest.review.status.draft'), value: "DRAFT" },
        { text: t('purchaseRequest.review.status.submitted'), value: "SUBMITTED" },
        { text: t('purchaseRequest.review.status.approved'), value: "APPROVED" },
        { text: t('purchaseRequest.review.status.rejected'), value: "REJECTED" },
      ],
      onFilter: (value: React.Key | boolean, request: PurchaseRequestDraft) =>
        request.status === value,
      render: (status: PurchaseOrderStatus) => (
        <Tag color={statusColor(status)}>{formatStatus(status)}</Tag>
      ),
    },
    {
      title: t('purchaseRequest.review.table.itemSummary'),
      key: "itemSummary",
      render: (_: unknown, request: PurchaseRequestDraft) => {
        // Older persisted requests may not contain lineItems yet.
        const lineItems = Array.isArray(request.lineItems) ? request.lineItems : [];
        const firstItem = lineItems[0];
        const extraCount = Math.max(lineItems.length - 1, 0);

        return (
          <div className={styles.prCell}>
            <Text>{firstItem?.itemName || "-"}</Text>
            <span className={styles.prMeta}>
              {extraCount > 0
                ? t('purchaseRequest.review.table.moreItems', { count: extraCount })
                : firstItem?.itemCategory || "-"}
            </span>
          </div>
        );
      },
    },
    {
      title: t('purchaseRequest.review.table.department'),
      dataIndex: "department",
      key: "department",
      render: (value?: string) => (
        <span className={styles.muted}>{value || "-"}</span>
      ),
    },
    {
      title: t('purchaseRequest.review.table.requester'),
      dataIndex: "requestBy",
      key: "requestBy",
    },
    {
      title: t('purchaseRequest.review.table.items'),
      key: "itemCount",
      align: "center" as const,
      render: (_: unknown, request: PurchaseRequestDraft) =>
        (Array.isArray(request.lineItems) ? request.lineItems : []).length,
    },
    {
      title: t('purchaseRequest.review.table.total'),
      key: "total",
      align: "right" as const,
      render: (_: unknown, request: PurchaseRequestDraft) => {
        const lineItems = Array.isArray(request.lineItems) ? request.lineItems : [];
        const total = lineItems.reduce(
          (sum, item) => sum + computeDraftLineAmountAfterTax(item),
          0,
        );

        return (
          <Text strong>
            {request.currency} {total.toFixed(2)}
          </Text>
        );
      },
    },
  ];

  const onDeleteSelected = (): void => {
    const ids = selectedRowKeys.map(String);
    if (!ids.length) return;
    removePurchaseRequestDrafts(ids);
    setSelectedRowKeys([]);
    message.success(t('purchaseRequest.review.messages.deleteSuccess'));
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
              aria-label={t('common.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseRequest.review.title')}
            </Title>
          </Flex>

          <div className={styles.toolbar}>
            {isAdmin ? (
              <Popconfirm
                title={t('purchaseRequest.review.actions.deleteSelected')}
                okText={t('common.delete')}
                cancelText={t('common.cancel')}
                onConfirm={onDeleteSelected}
                disabled={!selectedRowKeys.length}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!selectedRowKeys.length}
                  aria-label="Delete selected purchase requests"
                />
              </Popconfirm>
            ) : null}
            <DatePicker
              allowClear
              className={styles.datePicker}
              placeholder={t('purchaseRequest.review.filter.filterByDate')}
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
              className={styles.search}
              placeholder={t('purchaseRequest.review.filter.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/purchasing/creation")}
            >
              {t('purchaseRequest.review.actions.create')}
            </Button>
          </div>
        </div>
        {draftRequests.length ? (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('purchaseRequest.review.section.draft')}</h3>
            <div className={styles.tableWrap}>
              <Table
                rowKey="localId"
                dataSource={draftRequests}
                pagination={false}
                scroll={{ x: 920 }}
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
          <h3 className={styles.sectionTitle}>{t('purchaseRequest.review.section.otherStatus')}</h3>
          <div className={styles.tableWrap}>
            <Table
              rowKey="localId"
              dataSource={otherRequests}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
              }}
              scroll={{ x: 920 }}
              locale={{
                emptyText: (
                  <Empty description={t('purchaseRequest.review.messages.noPurchaseRequestsFound')} />
                ),
              }}
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
