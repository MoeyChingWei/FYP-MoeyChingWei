import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Badge, Button, Dropdown, Typography, Empty, Spin } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  MessageOutlined,
  TruckOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  RobotOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../../shared/auth/session";
import {
  fetchNotifications,
  markNotificationRead,
  NOTIFICATIONS_CHANGED_EVENT,
  type NotificationRow,
} from "../../shared/api/notifications";
import { UserRole } from "../../shared/types/roles";
import styles from "./NotificationBell.module.css";
import { resolveNotificationRoute } from "../../shared/notifications/notificationRoutes";

const { Text } = Typography;

const BUDGET_NOTIFICATION_TYPES = [
  "BUDGET_THRESHOLD_WARNING",
  "BUDGET_EXCEEDED",
  "BUDGET_THRESHOLD_EXCEEDED",
  "BUDGET_PREDICTION_READY",
  "BUDGET_PREDICTION_FAILED",
  "BUDGET_AUTO_GENERATED",
  "BUDGET_SUBMISSION_REMINDER",
  "BUDGET_ADJUSTMENT_REQUESTED",
  "BUDGET_ADJUSTMENT_SUBMITTED",
  "BUDGET_ADJUSTMENT_APPROVED",
  "BUDGET_ADJUSTMENT_REJECTED"
] as const;

type BudgetNotificationType = typeof BUDGET_NOTIFICATION_TYPES[number];

function isBudgetNotification(type: string): type is BudgetNotificationType {
  return BUDGET_NOTIFICATION_TYPES.includes(type as BudgetNotificationType);
}

function getBudgetNotificationIcon(type: BudgetNotificationType): React.ReactNode {
  switch (type) {
    case "BUDGET_THRESHOLD_WARNING":
      return <WarningOutlined style={{ color: "#faad14" }} />;
    case "BUDGET_THRESHOLD_EXCEEDED":
      return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
    case "BUDGET_PREDICTION_READY":
      return <RobotOutlined style={{ color: "#1890ff" }} />;
    case "BUDGET_PREDICTION_FAILED":
      return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    case "BUDGET_ADJUSTMENT_SUBMITTED":
      return <FileTextOutlined style={{ color: "#1890ff" }} />;
    case "BUDGET_ADJUSTMENT_APPROVED":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    case "BUDGET_ADJUSTMENT_REJECTED":
      return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    default:
      return <BellOutlined />;
  }
}

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
  // Handle budget notifications first
  if (isBudgetNotification(notification.type)) {
    const type = notification.type as BudgetNotificationType;
    let tone: "success" | "info" | "warning" | "feedback" = "info";
    let label = "Budget";

    if (type === "BUDGET_THRESHOLD_WARNING") {
      tone = "warning";
      label = "Budget Alert";
    } else if (type === "BUDGET_EXCEEDED" || type === "BUDGET_THRESHOLD_EXCEEDED" || type === "BUDGET_PREDICTION_FAILED" || type === "BUDGET_ADJUSTMENT_REJECTED") {
      tone = "warning";
      label = "Budget";
    } else if (type === "BUDGET_ADJUSTMENT_APPROVED") {
      tone = "success";
      label = "Budget";
    }

    return { icon: getBudgetNotificationIcon(type), tone, label };
  }

  if (notification.refType === "feedback" || notification.type === "FEEDBACK") {
    return { icon: <MessageOutlined />, tone: "feedback", label: "Feedback" };
  }

  if (notification.refType === "delivery" || notification.refType === "grn") {
    return { icon: <TruckOutlined />, tone: "warning", label: "Delivery" };
  }

  if (notification.type.includes("PAYMENT") || notification.refType === "supplier-payment") {
    return {
      icon: <DollarOutlined />,
      tone: notification.type.includes("COMPLETED") ? "success" : "info",
      label: "Payment",
    };
  }

  if (notification.refType === "supplier-invoice" || notification.type === "SUPPLIER_UPDATE") {
    return { icon: <FileTextOutlined />, tone: "info", label: "Supplier Finance" };
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

  const loadNotifications = useCallback(async () => {
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
  }, [isAdmin, sessionUser?.id]);

  useEffect(() => {
    void loadNotifications();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      void loadNotifications();
    }, 30000);
    const syncNotifications = () => void loadNotifications();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, syncNotifications);
    return () => {
      clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, syncNotifications);
    };
  }, [loadNotifications]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const resolveRoute = (n: NotificationRow): string => {
    // Budget notifications use dedicated dashboard pages.
    if (isBudgetNotification(n.type)) {
      const type = n.type as BudgetNotificationType;

      switch (type) {
        case "BUDGET_THRESHOLD_WARNING":
        case "BUDGET_EXCEEDED":
        case "BUDGET_THRESHOLD_EXCEEDED":
        case "BUDGET_PREDICTION_READY":
        case "BUDGET_PREDICTION_FAILED":
        case "BUDGET_AUTO_GENERATED":
        case "BUDGET_SUBMISSION_REMINDER":
          return "/budget/department-overview";

        case "BUDGET_ADJUSTMENT_REQUESTED":
        case "BUDGET_ADJUSTMENT_SUBMITTED":
        case "BUDGET_ADJUSTMENT_APPROVED":
        case "BUDGET_ADJUSTMENT_REJECTED":
          return "/budget/adjustment-request";

        default:
          return "/budget/department-overview";
      }
    }

    return resolveNotificationRoute(n, sessionUser?.role);
  };

  const handleNotificationClick = async (n: NotificationRow) => {
    setDropdownOpen(false);
    try {
      if (!n.isRead) {
        await markNotificationRead(n.id);
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
    navigate(resolveRoute(n));
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
        <ul className={styles.notificationList}>
          {unreadNotifications.slice(0, 5).map((n) => {
            const presentation = getNotificationPresentation(n);

            return (
              <li key={n.id} className={styles.notificationItem}>
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  return (
    <Dropdown
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      popupRender={() => dropdownContent}
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
