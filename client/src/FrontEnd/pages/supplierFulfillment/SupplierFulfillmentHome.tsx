import React, { useEffect, useMemo, useState } from "react";
import {
  BellOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  InboxOutlined,
  ShopOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, Card, Empty, Flex, Popconfirm, Tabs, Tag, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";
import {
  deleteNotification,
  deleteReadNotifications,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "../../shared/api/notifications";
import {
  hydrateSupplierDeliveries,
  hydrateSupplierGrns,
  hydrateSupplierOrderAcknowledgements,
  loadSupplierDeliveries,
  loadSupplierGrns,
  loadSupplierOrderAcknowledgements,
} from "../../modules/supplierFulfillment/workflow";

import styles from "./SupplierFulfillmentHome.module.css";

const { Text, Title } = Typography;

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

type StatusCard = {
  label: string;
  value: number;
  accent: string;
};

type ModuleCard = {
  title: string;
  hint: string;
  icon: React.ReactNode;
  route: string;
};

export default function SupplierFulfillmentHome(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const [activeNotifTab, setActiveNotifTab] = useState<"latest" | "history">("latest");
  const [orderAcks, setOrderAcks] = useState(() => loadSupplierOrderAcknowledgements());
  const [deliveries, setDeliveries] = useState(() => loadSupplierDeliveries());
  const [grns, setGrns] = useState(() => loadSupplierGrns());
  const sessionUser = useMemo(() => getSessionUser(), []);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const isAdmin = sessionUser?.role === UserRole.ADMIN;

  const moduleCards: ModuleCard[] = useMemo(
    () => [
      {
        title: t("modules.orderAcknowledge.title"),
        hint: t("modules.orderAcknowledge.hint"),
        icon: <CheckCircleOutlined style={{ fontSize: 28 }} />,
        route: "/supplier-overview/order-acknowledgement",
      },
      {
        title: t("modules.delivery.title"),
        hint: t("modules.delivery.hint"),
        icon: <TruckOutlined style={{ fontSize: 28 }} />,
        route: "/supplier-overview/delivery",
      },
      {
        title: t("modules.grn.title"),
        hint: t("modules.grn.hint"),
        icon: <InboxOutlined style={{ fontSize: 28 }} />,
        route: "/supplier-overview/grn-status",
      },
      {
        title: t("modules.inventory.title", { defaultValue: "Inventory" }),
        hint: t("modules.inventory.hint", { defaultValue: "Manage your available stock and reorder levels" }),
        icon: <DatabaseOutlined style={{ fontSize: 28 }} />,
        route: "/supplier-overview/inventory",
      },
    ],
    [t],
  );

  useEffect(() => {
    const sync = async (): Promise<void> => {
      await Promise.all([
        hydrateSupplierOrderAcknowledgements(),
        hydrateSupplierDeliveries(),
        hydrateSupplierGrns(),
      ]);
      setOrderAcks(loadSupplierOrderAcknowledgements());
      setDeliveries(loadSupplierDeliveries());
      setGrns(loadSupplierGrns());
    };
    const handleSync = (): void => {
      void sync();
    };

    void sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-order-acks", handleSync);
    window.addEventListener("erp-supplier-deliveries", handleSync);
    window.addEventListener("erp-supplier-grns", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-order-acks", handleSync);
      window.removeEventListener("erp-supplier-deliveries", handleSync);
      window.removeEventListener("erp-supplier-grns", handleSync);
    };
  }, []);

  const loadNotifications = async () => {
    if (!sessionUser?.id) return;
    try {
      const rows = await fetchNotifications(sessionUser.id);
      setNotifications(rows);
    } catch (err: any) {
      message.error(err?.message ?? t("notifications.messages.noNotifications"));
    }
  };

  useEffect(() => {
    if (isAdmin) {
      setNotifications([]);
      return;
    }
    void loadNotifications();
  }, [isAdmin, sessionUser?.id]);

  const mapNotification = (n: NotificationRow): NotificationItem => {
    const when = new Date(n.createdAt).toLocaleString();
    const rawType = String(n.type || "").toUpperCase();
    const visualType: NotificationType =
      rawType.includes("REJECT") ? "warning" : rawType.includes("APPROV") || rawType.includes("CREATED") ? "success" : "info";

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

  const latestNotifications = useMemo(
    () => notifications.filter((n) => !n.isRead).map(mapNotification),
    [notifications],
  );

  const historyNotifications = useMemo(
    () => notifications.filter((n) => n.isRead).map(mapNotification),
    [notifications],
  );

  const resolveNotificationRoute = (n: NotificationItem): string => {
    if (n.rawType === "SUPPLIER_ORDER_ACK" && n.refId) {
      return `/supplier-overview/order-acknowledgement/${n.refId}`;
    }
    if (n.refType === "supplier-order-ack" && n.refId) {
      return `/supplier-overview/order-acknowledgement/${n.refId}`;
    }
    if (n.refType === "delivery" && n.refId) {
      return `/supplier-overview/delivery/${n.refId}`;
    }
    if (n.refType === "grn" && n.refId) {
      return `/supplier-overview/grn-status/${n.refId}`;
    }
    return "/supplier-overview";
  };

  const openNotification = async (n: NotificationItem): Promise<void> => {
    try {
      await markNotificationRead(n.id);
      await loadNotifications();
    } catch {
      // Keep navigation responsive even if mark-read fails.
    }
    navigate(resolveNotificationRoute(n));
  };

  const supplierFilter = <T extends { supplierId?: number; supplierEmail?: string }>(
    row: T,
  ): boolean => {
    if (!sessionUser) return false;
    if (sessionUser.role !== UserRole.SUPPLIER) return true;
    if (row.supplierId && row.supplierId === sessionUser.id) return true;
    if (row.supplierEmail && row.supplierEmail === sessionUser.email) return true;
    return false;
  };

  const visibleOrderAcks = useMemo(
    () => orderAcks.filter((row) => supplierFilter(row)),
    [orderAcks, sessionUser],
  );
  const visibleDeliveries = useMemo(
    () => deliveries.filter((row) => supplierFilter(row)),
    [deliveries, sessionUser],
  );
  const visibleGrns = useMemo(
    () => grns.filter((row) => supplierFilter(row)),
    [grns, sessionUser],
  );

  const statusCards: StatusCard[] = useMemo(
    () => [
      {
        label: t("statusCards.pendingOrderAcknowledge"),
        value: visibleOrderAcks.filter((row) => row.status === "PENDING_ORDER_ACKNOWLEDGE")
          .length,
        accent: "#f59e0b",
      },
      {
        label: t("statusCards.pendingDelivery"),
        value: visibleDeliveries.filter((row) => row.status === "PENDING_DELIVERY").length,
        accent: "#fb7185",
      },
      {
        label: t("statusCards.pendingGrn"),
        value: visibleGrns.filter((row) => row.status === "PENDING_GRN").length,
        accent: "#0ea5e9",
      },
      {
        label: t("statusCards.discrepancy"),
        value: visibleGrns.filter((row) => row.status === "DISCREPANCY").length,
        accent: "#ef4444",
      },
      {
        label: t("statusCards.completed"),
        value: visibleGrns.filter((row) => row.status === "COMPLETED").length,
        accent: "#14b8a6",
      },
    ],
    [visibleDeliveries, visibleGrns, visibleOrderAcks, t],
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
        message.success(t("notifications.messages.historyDeleted"));
      } catch (err: any) {
        message.error(err?.message ?? tMsg('error.operationFailed'));
      }
    })();
  }

  function deleteOneFromHistory(id: number): void {
    if (!sessionUser?.id) return;
    void (async () => {
      try {
        await deleteNotification(id, sessionUser.id);
        await loadNotifications();
        message.success(t("notifications.messages.deleted"));
      } catch (err: any) {
        message.error(err?.message ?? tMsg('error.operationFailed'));
      }
    })();
  }

  function renderNotificationList(items: NotificationItem[]): React.ReactNode {
    if (items.length === 0) {
      return (
        <div className={styles.emptyWrap}>
          <Empty description={t("notifications.messages.noNotifications")} />
        </div>
      );
    }

    return (
      <ul className={styles.notificationList}>
        {items.map((n) => (
          <li key={n.id} className={`${styles.notificationItem} ${styles.notificationUnread}`}>
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
                  {t(`notifications.type.${n.type}`)}
                </Tag>
              </Flex>
              <Text type="secondary" className={styles.notificationMessage}>
                {n.message}
              </Text>
              <Text type="secondary" className={styles.notificationTime}>{n.when}</Text>
            </Flex>
          </li>
        ))}
      </ul>
    );
  }

  function renderHistoryList(items: NotificationItem[]): React.ReactNode {
    if (items.length === 0) {
      return (
        <div className={styles.emptyWrap}>
          <Empty description={t("notifications.messages.noHistory")} />
        </div>
      );
    }

    return (
      <ul className={styles.notificationList}>
        {items.map((n) => (
          <li key={n.id} className={`${styles.notificationItem} ${styles.notificationRead}`}>
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
                  {t(`notifications.type.${n.type}`)}
                </Tag>
              </Flex>
              <Text type="secondary" className={styles.notificationMessage}>
                {n.message}
              </Text>
              <Text type="secondary" className={styles.notificationTime}>{n.when}</Text>
            </Flex>
            <div className={styles.notificationExtra}>
              <Popconfirm
                title={t("notifications.deleteOneConfirm")}
                okText={t("common.delete")}
                okButtonProps={{ danger: true }}
                cancelText={t("common.cancel")}
                onConfirm={() => deleteOneFromHistory(n.id)}
              >
                <Button
                  type="text"
                  size="small"
                  aria-label="Delete notification"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleWrap}>
          <Title level={3} style={{ marginBottom: 0 }}>
            {t("moduleTitle")}
          </Title>
        </div>
      </div>

      <div className={`${styles.content} ${isAdmin ? styles.contentNoNotification : ""}`}>
        {!isAdmin && (
          <Card
            className={styles.notifications}
            variant="borderless"
            styles={{ body: { padding: 16 } }}
          >
            <div className={styles.notificationsBody}>
              <div className={styles.notificationsHeader}>
                <div>
                  <div className={styles.notificationsTitle}>
                    <BellOutlined /> {t("notifications.title")}
                  </div>
                  <div className={styles.notificationsHint}>
                    {t("notifications.hint")}
                  </div>
                </div>
                <Flex gap={8}>
                  {activeNotifTab === "history" ? (
                    <Popconfirm
                      title={t("notifications.deleteAllConfirm")}
                      okText={t("notifications.deleteAll")}
                      okButtonProps={{ danger: true }}
                      cancelText={t("common.cancel")}
                      onConfirm={deleteAllHistory}
                    >
                      <Button
                        size="small"
                        type="default"
                        icon={<DeleteOutlined />}
                        disabled={historyNotifications.length === 0}
                      >
                        {t("notifications.deleteAll")}
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Button
                      size="small"
                      type="default"
                      onClick={markAllRead}
                      disabled={latestNotifications.length === 0}
                    >
                      {t("notifications.markAllRead")}
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
                      label: t("notifications.latest", { count: latestNotifications.length }),
                      children: renderNotificationList(latestNotifications),
                    },
                    {
                      key: "history",
                      label: t("notifications.history", { count: historyNotifications.length }),
                      children: renderHistoryList(historyNotifications),
                    },
                  ]}
                />
              </div>
            </div>
          </Card>
        )}

        <div className={styles.mainColumn}>
          <div className={styles.statusGrid}>
            {statusCards.map((item) => (
              <Card
                key={item.label}
                className={styles.statusCard}
                variant="borderless"
                styles={{ body: { padding: 16 } }}
              >
                <div className={styles.statusLabel}>{item.label}</div>
                <div className={styles.statusValue}>{item.value}</div>
                <div
                  className={styles.statusAccent}
                  style={{ background: item.accent }}
                />
              </Card>
            ))}
          </div>

          <div className={styles.moduleGrid}>
            {moduleCards.map((item) => (
              <Card
                key={item.route}
                className={styles.tile}
                variant="borderless"
                hoverable
                onClick={() => navigate(item.route)}
                styles={{ body: { padding: 0 } }}
              >
                <div className={styles.tileInner}>
                  <div className={styles.iconWrap}>
                    {item.icon}
                  </div>
                  <div className={styles.label}>{item.title}</div>
                  <div className={styles.hint}>{item.hint}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
