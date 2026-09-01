import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Empty, Flex, List, Popconfirm, Tabs, Tag, Typography, message } from "antd";
import {
  BellOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./Overview.module.css";
import { getSessionUser } from "../shared/auth/session";
import { isFinanceRole, UserRole } from "../shared/types/roles";
import {
  fetchNotifications,
  deleteNotification,
  deleteReadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "../shared/api/notifications";
import UserGuideModal from "../components/UserGuide/UserGuideModal";
import { resolveNotificationRoute } from "../shared/notifications/notificationRoutes";

const { Title, Text } = Typography;

type NotificationType = "info" | "success" | "warning";
type NotificationItem = {
  id: number;
  title: string;
  when: string;
  type: NotificationType;
  message: string;
  refType?: string | null;
  refId?: string | null;
  rawType?: string;
};

export default function Dashboard(): React.ReactElement {
  const navigate = useNavigate();
  const { t: tMsg } = useTranslation('messages');
  const sessionUser = useMemo(() => getSessionUser(), []);
  const role = sessionUser?.role;
  const [activeNotifTab, setActiveNotifTab] = useState<"latest" | "history">("latest");
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [userGuideVisible, setUserGuideVisible] = useState(false);

  const isAdmin = role === UserRole.ADMIN;

  const roleAllowedNotification = (n: NotificationRow): boolean => {
    if (isAdmin) {
      return n.type === "FEEDBACK" || n.refType === "feedback";
    }
    return true;
  };

  const mapNotification = (n: NotificationRow): NotificationItem => {
    const when = new Date(n.createdAt).toLocaleString();
    const t = String(n.type || "").toUpperCase();
    const visualType: NotificationType =
      t.includes("REJECT") ? "warning" : t.includes("APPROV") || t.includes("CREATED") ? "success" : "info";

    return {
      id: n.id,
      title: n.title,
      when,
      type: visualType,
      message: n.message,
      refType: n.refType,
      refId: n.refId,
      rawType: n.type,
    };
  };

  const loadNotifications = async () => {
    if (!sessionUser?.id) return;
    try {
      const rows = await fetchNotifications(sessionUser.id);
      setNotifications(rows.filter(roleAllowedNotification));
    } catch (err: any) {
      message.error(err?.message ?? tMsg('error.loadFailed'));
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [sessionUser?.id, role]);

  const latestNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead).map(mapNotification),
    [notifications],
  );

  const historyNotifications = useMemo(
    () => notifications.filter((n) => n.isRead).map(mapNotification),
    [notifications],
  );

  function markAllRead(): void {
    if (!sessionUser?.id || latestNotifications.length === 0) return;
    void (async () => {
      try {
        await markAllNotificationsRead(sessionUser.id);
        await loadNotifications();
      } catch (err: any) {
        message.error(err?.message ?? tMsg('error.operationFailed'));
      }
    })();
  }

  function deleteAllHistory(): void {
    if (!sessionUser?.id || historyNotifications.length === 0) return;
    void (async () => {
      try {
        await deleteReadNotifications(sessionUser.id);
        await loadNotifications();
        message.success(tMsg('success.delete'));
      } catch (err: any) {
        message.error(err?.message ?? tMsg('error.deleteFailed'));
      }
    })();
  }

  function deleteOneFromHistory(id: number): void {
    if (!sessionUser?.id) return;
    void (async () => {
      try {
        await deleteNotification(id, sessionUser.id);
        await loadNotifications();
        message.success(tMsg('success.delete'));
      } catch (err: any) {
        message.error(err?.message ?? tMsg('error.deleteFailed'));
      }
    })();
  }

  async function openNotification(n: NotificationItem): Promise<void> {
    try {
      await markNotificationRead(n.id);
      await loadNotifications();
    } catch {
      // still navigate to avoid blocking user.
    }
    navigate(resolveNotificationRoute(n, sessionUser?.role));
  }

  function renderNotificationList(items: NotificationItem[]): React.ReactNode {
    if (items.length === 0) {
      return (
        <div className={styles.emptyWrap}>
          <Empty description="No notifications right now." />
        </div>
      );
    }

    return (
      <List
        size="small"
        dataSource={items}
        renderItem={(n) => (
          <List.Item className={`${styles.notificationItem} ${styles.notificationUnread}`}>
            <Flex vertical gap={6} style={{ width: "100%" }}>
              <Flex justify="space-between" align="center" gap={12}>
                <Button
                  type="link"
                  className={styles.notificationTitle}
                  onClick={() => void openNotification(n)}
                >
                  {n.title}
                </Button>
                <Tag
                  color={
                    n.type === "success"
                      ? "green"
                      : n.type === "warning"
                        ? "orange"
                        : "blue"
                  }
                >
                  {n.type}
                </Tag>
              </Flex>
              <Text type="secondary" className={styles.notificationMessage}>
                {n.message}
              </Text>
              <Text type="secondary" className={styles.notificationTime}>{n.when}</Text>
            </Flex>
          </List.Item>
        )}
      />
    );
  }

  function renderHistoryList(items: NotificationItem[]): React.ReactNode {
    if (items.length === 0) {
      return (
        <div className={styles.emptyWrap}>
          <Empty description="No notification history." />
        </div>
      );
    }

    return (
      <List
        size="small"
        dataSource={items}
        renderItem={(n) => (
          <List.Item
            className={`${styles.notificationItem} ${styles.notificationRead}`}
            extra={
              <Popconfirm
                title="Delete this notification?"
                okText="Delete"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                onConfirm={() => deleteOneFromHistory(n.id)}
              >
                <Button
                  type="text"
                  size="small"
                  aria-label="Delete notification"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            }
          >
            <Flex vertical gap={6} style={{ width: "100%" }}>
              <Flex justify="space-between" align="center" gap={12}>
                <Button
                  type="link"
                  className={styles.notificationTitle}
                  onClick={() => void openNotification(n)}
                >
                  {n.title}
                </Button>
                <Tag
                  color={
                    n.type === "success"
                      ? "green"
                      : n.type === "warning"
                        ? "orange"
                        : "blue"
                  }
                >
                  {n.type}
                </Tag>
              </Flex>
              <Text type="secondary" className={styles.notificationMessage}>
                {n.message}
              </Text>
              <Text type="secondary" className={styles.notificationTime}>{n.when}</Text>
            </Flex>
          </List.Item>
        )}
      />
    );
  }

  const tiles: Array<{
    key: string;
    label: string;
    hint: string;
    to: string;
    icon: React.ReactNode;
    color: string;
    badge?: string;
  }> = [
    {
      key: "users-access",
      label: "User & Access",
      hint: "Authentication, users, RBAC",
      to: "/users-access",
      icon: <SafetyCertificateOutlined style={{ fontSize: 30 }} />,
      color: "#6366f1",
    },
    {
      key: "purchasing",
      label: "Purchasing",
      hint: "Create, review, approval",
      to: "/purchasing",
      icon: <ShoppingCartOutlined style={{ fontSize: 30 }} />,
      color: "#22c55e",
    },
    {
      key: "supplier-overview",
      label: "Supplier Overview",
      hint: "Orders, delivery, GRN status",
      to: "/supplier-overview",
      icon: <ShopOutlined style={{ fontSize: 30 }} />,
      color: "#14b8a6",
    },
    {
      key: "tracking-item",
      label: "Tracking Item",
      hint: "Track items & status",
      to: "/tracking-item",
      icon: <InboxOutlined style={{ fontSize: 30 }} />,
      color: "#ec4899",
    },
  ];

  const visibleTiles = useMemo(() => {
    if (!role || role === UserRole.ADMIN) return tiles;
    if (role === UserRole.MANAGER) {
      return tiles.filter((t) => t.key !== "supplier-overview");
    }
    if (role === UserRole.DEPARTMENT_EXECUTIVE) {
      return tiles.filter((t) => t.key !== "supplier-overview" && t.key !== "users-access");
    }
    if (role === UserRole.EMPLOYEE || isFinanceRole(role)) {
      return tiles.filter(
        (t) => t.key === "purchasing" || t.key === "tracking-item",
      );
    }
    if (role === UserRole.SUPPLIER) {
      return [];
    }
    return tiles;
  }, [role]);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleWrap}>
          <Title level={3} style={{ marginBottom: 0 }}>
            Overview
          </Title>
        </div>
        <Button
          type="default"
          icon={<QuestionCircleOutlined />}
          onClick={() => setUserGuideVisible(true)}
          style={{ marginLeft: "auto" }}
        >
          User Guide
        </Button>
      </div>

      <div className={styles.content}>
        <Card
          className={styles.notifications}
          bordered={false}
          styles={{ body: { padding: 16 } }}
        >
          <div className={styles.notificationsBody}>
            <div className={styles.notificationsHeader}>
              <div>
                <div className={styles.notificationsTitle}>
                  <BellOutlined /> Notifications
                </div>
                <div className={styles.notificationsHint}>
                  Latest system updates and activity.
                </div>
              </div>
              <Flex gap={8}>
                {activeNotifTab === "history" ? (
                  <Popconfirm
                    title="Delete all history notifications?"
                    okText="Delete all"
                    okButtonProps={{ danger: true }}
                    cancelText="Cancel"
                    onConfirm={deleteAllHistory}
                  >
                    <Button
                      size="small"
                      type="default"
                      icon={<DeleteOutlined />}
                      disabled={historyNotifications.length === 0}
                    >
                      Delete all
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    size="small"
                    type="default"
                    onClick={markAllRead}
                    disabled={latestNotifications.length === 0}
                  >
                    Mark all read
                  </Button>
                )}
              </Flex>
            </div>

            <div className={styles.notificationsScroll}>
              <Tabs
                className={styles.notificationsTabs}
                size="small"
                activeKey={activeNotifTab}
                onChange={(k) => setActiveNotifTab(k as "latest" | "history")}
                items={[
                  {
                    key: "latest",
                    label: `Latest (${latestNotifications.length})`,
                    children: renderNotificationList(latestNotifications),
                  },
                  {
                    key: "history",
                    label: `History (${historyNotifications.length})`,
                    children: renderHistoryList(historyNotifications),
                  },
                ]}
              />
            </div>
          </div>
        </Card>

        <div className={styles.mainColumn}>
          <div className={styles.grid}>
            {visibleTiles.map((t) => (
              <Card
                key={t.key}
                className={styles.tile}
                bordered={false}
                hoverable
                onClick={() => navigate(t.to)}
                styles={{ body: { padding: 0 } }}
              >
                {t.badge && <span className={styles.badge}>{t.badge}</span>}
                <div className={styles.tileInner}>
                  <div className={styles.iconWrap} style={{ background: t.color }}>
                    {t.icon}
                  </div>
                  <div className={styles.label}>{t.label}</div>
                  <div className={styles.hint}>{t.hint}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <UserGuideModal
        visible={userGuideVisible}
        onClose={() => setUserGuideVisible(false)}
        userRole={role}
      />
    </div>
  );
}
