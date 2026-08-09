import React, { useEffect, useState, useMemo } from "react";
import { Badge, Button, Dropdown, List, Typography, Empty, Spin } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../shared/auth/session";
import { fetchNotifications, markNotificationRead, type NotificationRow } from "../../shared/api/notifications";
import { UserRole } from "../../shared/types/roles";
import styles from "./NotificationBell.module.css";

const { Text } = Typography;

function formatNotificationTime(createdAt: string): string {
  const date = new Date(createdAt);
  const elapsed = Date.now() - date.getTime();
  const minutes = Math.floor(elapsed / 60000);

  if (minutes >= 0 && minutes < 1) return "Just now";
  if (minutes >= 1 && minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getNotificationPresentation(notification: NotificationRow): {
  icon: React.ReactNode;
  tone: "success" | "info" | "warning" | "feedback";
  label: string;
} {
  if (notification.refType === "feedback" || notification.type === "FEEDBACK") {
    return { icon: <MessageOutlined />, tone: "feedback", label: "Feedback" };
  }

  if (notification.refType === "delivery" || notification.refType === "grn") {
    return { icon: <TruckOutlined />, tone: "warning", label: "Delivery" };
  }

  if (notification.type.includes("APPROVAL")) {
    return { icon: <CheckCircleOutlined />, tone: "success", label: "Approval" };
  }

  return { icon: <FileTextOutlined />, tone: "info", label: "Purchasing" };
}

export default function NotificationBell(): React.ReactElement {
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = sessionUser?.role === UserRole.ADMIN;

  const loadNotifications = async () => {
    if (!sessionUser?.id) return;
    setLoading(true);
    try {
      const rows = await fetchNotifications(sessionUser.id);
      const filtered = isAdmin
        ? rows.filter((n) => n.type === "FEEDBACK" || n.refType === "feedback")
        : rows;
      setNotifications(filtered);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      void loadNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [sessionUser?.id, isAdmin]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const resolveNotificationRoute = (n: NotificationRow): string => {
    if (n.type === "PURCHASE_REQUEST_APPROVAL" && n.refId) return `/purchasing/approval/${n.refId}`;
    if (n.type === "PURCHASE_ORDER_APPROVAL" && n.refId) return `/purchasing/po-approval/${n.refId}`;
    if (n.refType === "purchase-request" && n.refId) return `/purchasing/review/${n.refId}`;
    if (n.refType === "purchase-order" && n.refId) return `/purchasing/po-review/${n.refId}`;
    if (n.refType === "supplier-order-ack" && n.refId) return `/supplier-overview/order-acknowledgement/${n.refId}`;
    if (n.refType === "delivery" && n.refId) return `/supplier-overview/delivery/${n.refId}`;
    if (n.refType === "grn" && n.refId) return `/supplier-overview/grn-status/${n.refId}`;
    if (n.refType === "feedback") return "/settings/feedback";
    if (n.refType === "tracking-item" && n.refId) return `/tracking-item?requestLocalId=${encodeURIComponent(n.refId)}`;
    return "/overview";
  };

  const handleNotificationClick = async (n: NotificationRow) => {
    setDropdownOpen(false);
    try {
      if (!n.isRead) {
        await markNotificationRead(n.id);
        await loadNotifications();
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
    navigate(resolveNotificationRoute(n));
  };

  const dropdownContent = (
    <div className={styles.dropdownContent}>
      <div className={styles.dropdownHeader}>
        <div>
          <Text strong className={styles.headerTitle}>Notifications</Text>
          <Text className={styles.headerSubtitle}>
            {unreadCount === 1 ? "1 unread update" : `${unreadCount} unread updates`}
          </Text>
        </div>
        <Button type="link" size="small" onClick={() => { setDropdownOpen(false); navigate("/notifications"); }}>
          View All
        </Button>
      </div>
      {loading ? (
        <div className={styles.loadingWrap}>
          <Spin size="small" />
        </div>
      ) : unreadNotifications.length === 0 ? (
        <div className={styles.emptyWrap}>
          <Empty description="No new notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <List
          className={styles.notificationList}
          dataSource={unreadNotifications.slice(0, 5)}
          renderItem={(n) => {
            const presentation = getNotificationPresentation(n);

            return (
              <List.Item className={styles.notificationItem}>
                <button
                  type="button"
                  className={styles.notificationAction}
                  onClick={() => void handleNotificationClick(n)}
                  aria-label={`${n.title}. ${n.message}`}
                >
                  <span className={`${styles.notificationIcon} ${styles[presentation.tone]}`}>
                    {presentation.icon}
                  </span>
                  <span className={styles.notificationContent}>
                    <span className={styles.notificationMeta}>
                      <span className={styles.notificationLabel}>{presentation.label}</span>
                      <time className={styles.notificationTime} dateTime={n.createdAt} title={new Date(n.createdAt).toLocaleString()}>
                        {formatNotificationTime(n.createdAt)}
                      </time>
                    </span>
                    <Text strong className={styles.notificationTitle}>
                      {n.title}
                    </Text>
                    <Text type="secondary" className={styles.notificationMessage}>
                      {n.message}
                    </Text>
                  </span>
                  <span className={styles.unreadDot} aria-label="Unread" />
                </button>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Badge count={unreadCount} offset={[-2, 2]} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          className={styles.bellButton}
        />
      </Badge>
    </Dropdown>
  );
}
