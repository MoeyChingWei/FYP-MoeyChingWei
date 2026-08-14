import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Empty, List, Space, Tag, Typography, message, Divider, Input, Segmented } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  FileTextOutlined,
  WarningOutlined,
  MessageOutlined,
  SearchOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "../shared/api/notifications";

const { Text, Title } = Typography;

export default function NotificationsPage(): React.ReactElement {
  const { t: tNotif } = useTranslation('notifications');
  const { t: tCommon } = useTranslation('common');
  const { t: tMsg } = useTranslation('messages');
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const isAdmin = sessionUser?.role === UserRole.ADMIN;
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const load = async () => {
    if (!sessionUser?.id) return;
    setLoading(true);
    try {
      const data = await fetchNotifications(sessionUser.id);
      setRows(
        isAdmin
          ? data.filter((n) => n.type === "FEEDBACK" || n.refType === "feedback")
          : data,
      );
    } catch (err: any) {
      message.error(err?.message ?? tMsg('error.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [isAdmin, sessionUser?.id]);

  // Get notification category from type
  const getNotificationCategory = (type: string): string => {
    if (type.includes("APPROVAL")) return "approval";
    if (type.includes("CREATED")) return "created";
    if (type.includes("UPDATE")) return "update";
    if (type.includes("DELIVERY")) return "delivery";
    if (type.includes("COMPLETED")) return "completed";
    if (type.includes("DISCREPANCY")) return "discrepancy";
    if (type.includes("FEEDBACK")) return "feedback";
    return "other";
  };

  // Filter and search notifications
  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((row) => getNotificationCategory(row.type) === filterType);
    }

    // Filter by read status
    if (filterStatus === "unread") {
      filtered = filtered.filter((row) => !row.isRead);
    } else if (filterStatus === "read") {
      filtered = filtered.filter((row) => row.isRead);
    }

    // Search filter
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row.title.toLowerCase().includes(search) ||
          row.message.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [rows, filterType, filterStatus, searchText]);

  const unreadCount = rows.filter((r) => !r.isRead).length;

  const onRead = async (row: NotificationRow) => {
    if (row.isRead) return;
    try {
      await markNotificationRead(row.id);
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, isRead: true, readAt: new Date().toISOString() } : r)),
      );
    } catch (err: any) {
      message.error(err?.message ?? tMsg('error.update'));
    }
  };

  const resolveNotificationRoute = (row: NotificationRow): string => {
    if (row.type === "PURCHASE_REQUEST_APPROVAL" && row.refId) {
      return `/purchasing/approval/${row.refId}`;
    }
    if (row.type === "PURCHASE_ORDER_APPROVAL" && row.refId) {
      return `/purchasing/po-approval/${row.refId}`;
    }
    if (row.refType === "purchase-request" && row.refId) {
      return `/purchasing/review/${row.refId}`;
    }
    if (row.refType === "purchase-order" && row.refId) {
      return `/purchasing/po-review/${row.refId}`;
    }
    if (row.refType === "supplier-order-ack" && row.refId) {
      return `/supplier-overview/order-acknowledgement/${row.refId}`;
    }
    if (row.refType === "delivery" && row.refId) {
      return `/supplier-overview/delivery/${row.refId}`;
    }
    if (row.refType === "grn" && row.refId) {
      return `/supplier-overview/grn-status/${row.refId}`;
    }
    if (row.refType === "feedback") {
      return "/settings/feedback";
    }
    if (row.refType === "tracking-item" && row.refId) {
      return `/tracking-item?requestLocalId=${encodeURIComponent(row.refId)}`;
    }
    return "/notifications";
  };

  const onOpen = async (row: NotificationRow) => {
    try {
      await onRead(row);
    } finally {
      navigate(resolveNotificationRoute(row));
    }
  };

  const onReadAll = async () => {
    if (!sessionUser?.id) return;
    try {
      await markAllNotificationsRead(sessionUser.id);
      setRows((prev) => prev.map((r) => ({ ...r, isRead: true, readAt: r.readAt ?? new Date().toISOString() })));
      message.success(tMsg('success.update'));
    } catch (err: any) {
      message.error(err?.message ?? tMsg('error.update'));
    }
  };

  const getNotificationIcon = (type: string) => {
    if (type.includes("APPROVAL")) return <ClockCircleOutlined style={{ fontSize: 20, color: "#faad14" }} />;
    if (type.includes("DELIVERY")) return <TruckOutlined style={{ fontSize: 20, color: "#52c41a" }} />;
    if (type.includes("ORDER")) return <ShoppingCartOutlined style={{ fontSize: 20, color: "#1890ff" }} />;
    if (type.includes("GRN") || type.includes("DISCREPANCY")) return <WarningOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />;
    if (type.includes("FEEDBACK")) return <MessageOutlined style={{ fontSize: 20, color: "#722ed1" }} />;
    if (type.includes("COMPLETED")) return <CheckCircleOutlined style={{ fontSize: 20, color: "#52c41a" }} />;
    return <FileTextOutlined style={{ fontSize: 20, color: "#8c8c8c" }} />;
  };

  const getNotificationTypeTag = (type: string) => {
    if (type.includes("APPROVAL")) return <Tag color="orange">{tNotif('type.approval')}</Tag>;
    if (type.includes("CREATED")) return <Tag color="blue">{tNotif('type.created')}</Tag>;
    if (type.includes("UPDATE")) return <Tag color="cyan">{tNotif('type.update')}</Tag>;
    if (type.includes("DELIVERY")) return <Tag color="green">{tNotif('type.delivery')}</Tag>;
    if (type.includes("COMPLETED")) return <Tag color="success">{tNotif('type.completed')}</Tag>;
    if (type.includes("DISCREPANCY")) return <Tag color="error">{tNotif('type.discrepancy')}</Tag>;
    if (type.includes("FEEDBACK")) return <Tag color="purple">{tNotif('type.feedback')}</Tag>;
    return <Tag>{type}</Tag>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return tCommon('time.justNow');
    if (diffMins < 60) return tCommon(diffMins > 1 ? 'time.minutesAgo_plural' : 'time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return tCommon(diffHours > 1 ? 'time.hoursAgo_plural' : 'time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return tCommon(diffDays > 1 ? 'time.daysAgo_plural' : 'time.daysAgo', { count: diffDays });
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%", padding: "24px" }}>
      <Card bordered={false} style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
              <BellOutlined style={{ marginRight: 8 }} />
              {tNotif('title')}
            </Title>
            <Text type="secondary">{tNotif('subtitle')}</Text>
          </div>
          <Space>
            {unreadCount > 0 && <Badge count={unreadCount} style={{ backgroundColor: "#1890ff" }} />}
            <Button onClick={() => void onReadAll()} disabled={unreadCount < 1}>
              {tNotif('markAllAsRead')}
            </Button>
            <Button onClick={() => void load()} loading={loading}>
              {tCommon('buttons.refresh')}
            </Button>
          </Space>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        {/* Filters Section */}
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
            <Space wrap>
              <Text strong style={{ marginRight: 8 }}>
                <FilterOutlined style={{ marginRight: 4 }} />
                {tNotif('filterByType')}
              </Text>
              <Segmented
                options={[
                  { label: tCommon('all'), value: "all" },
                  { label: tNotif('type.approval'), value: "approval" },
                  { label: tNotif('type.created'), value: "created" },
                  { label: tNotif('type.update'), value: "update" },
                  { label: tNotif('type.delivery'), value: "delivery" },
                  { label: tNotif('type.completed'), value: "completed" },
                  { label: tNotif('type.feedback'), value: "feedback" },
                ]}
                value={filterType}
                onChange={(value) => setFilterType(value as string)}
              />
            </Space>
            <Space wrap>
              <Text strong style={{ marginRight: 8 }}>{tCommon('labels.status')}:</Text>
              <Segmented
                options={[
                  { label: tCommon('all'), value: "all" },
                  { label: tNotif('status.unread'), value: "unread" },
                  { label: tNotif('status.read'), value: "read" },
                ]}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as string)}
              />
            </Space>
          </Space>

          <Input
            placeholder={tNotif('searchPlaceholder')}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />

          {(filterType !== "all" || filterStatus !== "all" || searchText.trim()) && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {tNotif('showingCount', { filtered: filteredRows.length, total: rows.length })}
              </Text>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setFilterType("all");
                  setFilterStatus("all");
                  setSearchText("");
                }}
              >
                {tNotif('clearFilters')}
              </Button>
            </div>
          )}
        </Space>
      </Card>

      {loading ? (
        <Card loading={true} />
      ) : filteredRows.length === 0 ? (
        <Card>
          <Empty
            description={
              rows.length === 0
                ? tNotif('empty.noNotifications')
                : tNotif('empty.noMatches')
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: "40px 0" }}
          />
        </Card>
      ) : (
        <List
          dataSource={filteredRows}
          renderItem={(row) => (
            <Card
              key={row.id}
              hoverable
              style={{
                marginBottom: 12,
                backgroundColor: row.isRead ? "#ffffff" : "#f0f7ff",
                border: row.isRead ? "1px solid #f0f0f0" : "1px solid #d6e4ff",
                cursor: "pointer",
              }}
              bodyStyle={{ padding: "16px 24px" }}
              onClick={() => void onOpen(row)}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {getNotificationIcon(row.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Text strong style={{ fontSize: 15 }}>
                      {row.title}
                    </Text>
                    {!row.isRead && (
                      <Tag color="blue" style={{ margin: 0 }}>
                        {tNotif('new')}
                      </Tag>
                    )}
                    {getNotificationTypeTag(row.type)}
                  </div>
                  <Text style={{ display: "block", marginBottom: 8, color: "#595959" }}>
                    {row.message}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {formatDate(row.createdAt)}
                  </Text>
                </div>
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      void onOpen(row);
                    }}
                  >
                    {tCommon('buttons.open')}
                  </Button>
                  {!row.isRead && (
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        void onRead(row);
                      }}
                    >
                      {tNotif('markRead')}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        />
      )}
    </Space>
  );
}

