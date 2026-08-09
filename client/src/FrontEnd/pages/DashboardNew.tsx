import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Empty, Flex, List, Row, Tag, Typography, message } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TruckOutlined,
  InboxOutlined,
  ArrowRightOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./Overview.module.css";
import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";
import { fetchNotifications, type NotificationRow } from "../shared/api/notifications";
import { fetchDashboardStatistics, type DashboardStatistics } from "../shared/api/dashboard";
import { loadPurchaseRequestDrafts } from "../modules/purchasing/requestCreation/storage";
import { loadPurchaseOrderDrafts } from "../modules/purchasing/purchaseOrder/storage";

import StatCard from "../components/shared/StatCard";
import PurchasingTrendChart from "../components/shared/PurchasingTrendChart";
import SpendingByCategory from "../components/shared/SpendingByCategory";
import UserGuideModal from "../components/UserGuide/UserGuideModal";

const { Title, Text } = Typography;

export default function Dashboard(): React.ReactElement {
  const { t } = useTranslation('dashboard');
  const { t: tMsg } = useTranslation('messages');
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const role = sessionUser?.role;
  const department = sessionUser?.department;
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatistics | null>(null);
  const [userGuideVisible, setUserGuideVisible] = useState(false);

  const isAdmin = role === UserRole.ADMIN;
  const isSupplier = role === UserRole.SUPPLIER;
  const isEmployee = role === UserRole.EMPLOYEE;

  useEffect(() => {
    const loadData = async () => {
      if (!sessionUser?.id) return;
      setLoading(true);
      try {
        // Fetch notifications
        const notifs = await fetchNotifications(sessionUser.id);
        const filtered = isAdmin
          ? notifs.filter((n) => n.type === "FEEDBACK" || n.refType === "feedback")
          : notifs;
        setNotifications(filtered);

        // Fetch dashboard statistics filtered by department
        // Super Admin sees all data, others see only their department's data
        const stats = await fetchDashboardStatistics(
          isAdmin ? undefined : department
        );
        setDashboardStats(stats);
      } catch (err: any) {
        message.error(err?.message ?? tMsg('loadDataFailed'));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [sessionUser?.id, isAdmin, department]);

  // Calculate statistics from dashboard API
  const pendingApprovals = dashboardStats?.pendingApprovals ?? 0;
  const totalRequests = dashboardStats?.totalRequests ?? 0;
  const totalOrders = dashboardStats?.totalOrders ?? 0;
  const currentMonthSpending = dashboardStats?.currentMonthSpending ?? 0;
  const spendingTrend = dashboardStats?.spendingTrend ?? 0;
  const requestsTrend = dashboardStats?.requestsTrend ?? 0;
  const ordersTrend = dashboardStats?.ordersTrend ?? 0;

  const purchaseRequests = useMemo(() => {
    try {
      return loadPurchaseRequestDrafts();
    } catch {
      return [];
    }
  }, []);

  const purchaseOrders = useMemo(() => {
    try {
      return loadPurchaseOrderDrafts();
    } catch {
      return [];
    }
  }, []);

  // Use real data from API
  const trendData = dashboardStats?.trendData ?? [];
  const categoryData = dashboardStats?.categoryData ?? [];

  const recentActivities = useMemo(() => {
    return notifications
      .filter((n) => !n.isRead)
      .slice(0, 5)
      .map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        time: new Date(n.createdAt).toLocaleString(),
        type: n.type,
        notification: n, // Keep reference to full notification
      }));
  }, [notifications]);

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
    return "#";
  };

  const quickActions = [
    {
      icon: <FileTextOutlined style={{ fontSize: 20 }} />,
      label: t('quickActions.createPurchaseRequest'),
      path: "/purchasing/creation",
      color: "#3b82f6",
      show: !isSupplier,
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: 20 }} />,
      label: t('quickActions.approveRequests'),
      path: "/purchasing/approval",
      color: "#22c55e",
      show: role === UserRole.ADMIN || role === UserRole.DEPARTMENT_EXECUTIVE,
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
      label: t('quickActions.createPurchaseOrder'),
      path: "/purchasing/po-creation",
      color: "#f59e0b",
      show: role === UserRole.ADMIN || role === UserRole.DEPARTMENT_EXECUTIVE,
    },
    {
      icon: <TruckOutlined style={{ fontSize: 20 }} />,
      label: t('quickActions.supplierDelivery'),
      path: "/supplier-overview/delivery",
      color: "#14b8a6",
      show: isSupplier,
    },
    {
      icon: <InboxOutlined style={{ fontSize: 20 }} />,
      label: t('quickActions.trackingItems'),
      path: "/tracking-item",
      color: "#ec4899",
      show: !isSupplier,
    },
  ].filter((action) => action.show);

  if (isSupplier) {
    return (
      <div className={styles.page}>
        <Title level={3}>{t('supplier.title')}</Title>
        <Text type="secondary">{t('welcome', { name: sessionUser?.name || sessionUser?.email })}</Text>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                onClick={() => navigate(action.path)}
                style={{ textAlign: "center", borderRadius: 12 }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: action.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  {action.icon}
                </div>
                <Text strong>{action.label}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Card style={{ marginTop: 24, borderRadius: 12 }}>
          <Title level={5}>{t('recentActivity.title')}</Title>
          {recentActivities.length === 0 ? (
            <Empty description={t('recentActivity.noNewActivity')} />
          ) : (
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <div>
                        <Text type="secondary">{item.message}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.titleWrap}>
          <Title level={3} style={{ marginBottom: 4 }}>
            {t('title')}
          </Title>
          <Text type="secondary">{t('welcome', { name: sessionUser?.name || sessionUser?.email })}</Text>
        </div>
        <Button
          type="default"
          icon={<QuestionCircleOutlined />}
          onClick={() => setUserGuideVisible(true)}
        >
          {t('userGuide')}
        </Button>
      </div>

      {!isEmployee && <>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('cards.pendingApprovals')}
            value={pendingApprovals}
            icon={<ClockCircleOutlined />}
            color="#f59e0b"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('cards.purchaseRequests')}
            value={totalRequests}
            icon={<FileTextOutlined />}
            color="#3b82f6"
            loading={loading}
            trend={
              requestsTrend !== 0
                ? { value: Math.abs(requestsTrend), isPositive: requestsTrend > 0 }
                : undefined
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('cards.purchaseOrders')}
            value={totalOrders}
            icon={<ShoppingCartOutlined />}
            color="#22c55e"
            loading={loading}
            trend={
              ordersTrend !== 0
                ? { value: Math.abs(ordersTrend), isPositive: ordersTrend > 0 }
                : undefined
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('cards.monthlySpending')}
            value={(currentMonthSpending / 1000).toFixed(1)}
            suffix="K"
            icon={<TruckOutlined />}
            color="#ec4899"
            loading={loading}
            trend={
              spendingTrend !== 0
                ? { value: Math.abs(spendingTrend), isPositive: spendingTrend > 0 }
                : undefined
            }
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <PurchasingTrendChart data={trendData} loading={loading} />
        </Col>
        <Col xs={24} lg={10}>
          <SpendingByCategory data={categoryData} loading={loading} />
        </Col>
      </Row>
      </>}

      {/* Quick Actions and Recent Activity */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={isEmployee ? 24 : 12}>
          <Card
            title={t('quickActions.title')}
            bordered={false}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(2, 6, 23, 0.08)",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Flex vertical gap={8}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  type="text"
                  size="large"
                  onClick={() => navigate(action.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "auto",
                    padding: "12px 16px",
                    textAlign: "left",
                    borderRadius: 8,
                  }}
                >
                  <Flex align="center" gap={12}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: action.color,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {action.icon}
                    </div>
                    <Text strong>{action.label}</Text>
                  </Flex>
                  <ArrowRightOutlined style={{ color: "#94a3b8" }} />
                </Button>
              ))}
            </Flex>
          </Card>
        </Col>

        {!isEmployee && <Col xs={24} lg={12}>
          <Card
            title={t('recentActivity.title')}
            extra={
              recentActivities.length > 0 && (
                <Button type="link" onClick={() => navigate("/notifications")}>
                  {t('viewAll')}
                </Button>
              )
            }
            bordered={false}
            style={{
              borderRadius: 12,
              border: "1px solid rgba(2, 6, 23, 0.08)",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            {recentActivities.length === 0 ? (
              <Empty description={t('recentActivity.noNewActivity')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                dataSource={recentActivities}
                renderItem={(item) => {
                  const route = resolveNotificationRoute(item.notification);
                  return (
                    <List.Item
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #f3f4f6",
                        cursor: route !== "#" ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (route !== "#") {
                          navigate(route);
                        }
                      }}
                    >
                      <List.Item.Meta
                        title={
                          <Text strong style={{ fontSize: 14 }}>
                            {item.title}
                          </Text>
                        }
                        description={
                          <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              {item.message}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.time}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>}
      </Row>

      <UserGuideModal
        visible={userGuideVisible}
        onClose={() => setUserGuideVisible(false)}
        userRole={role}
      />
    </div>
  );
}
