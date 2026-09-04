import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Badge, Button, Card, Col, Empty, Flex, List, Progress, Row, Tag, Typography, message } from "antd";
import {
  AlertOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TruckOutlined,
  InboxOutlined,
  ArrowRightOutlined,
  QuestionCircleOutlined,
  CreditCardOutlined,
  DollarOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./Overview.module.css";
import { getSessionUser } from "../shared/auth/session";
import { canAccessBudgetManagement, UserRole } from "../shared/types/roles";
import { fetchNotifications, type NotificationRow } from "../shared/api/notifications";
import { fetchDashboardStatistics, type DashboardStatistics } from "../shared/api/dashboard";
import {
  hydratePurchaseRequestDrafts,
  loadPurchaseRequestDrafts,
} from "../modules/purchasing/requestCreation/storage";
import type { PurchaseRequestDraft } from "../modules/purchasing/requestCreation/types";
import {
  hydrateSupplierGrns,
  isGrnReceived,
  loadSupplierGrns,
  hydrateSupplierPayments,
  loadSupplierPayments,
  type SupplierGrnRecord,
  type SupplierPaymentRecord,
} from "../modules/supplierFulfillment/workflow";
import { resolveNotificationRoute } from "../shared/notifications/notificationRoutes";

import StatCard from "../components/shared/StatCard";
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
  const [paymentRows, setPaymentRows] = useState<SupplierPaymentRecord[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequestDraft[]>(() => loadPurchaseRequestDrafts());
  const [grns, setGrns] = useState<SupplierGrnRecord[]>(() => loadSupplierGrns());
  const [userGuideVisible, setUserGuideVisible] = useState(false);

  const isAdmin = role === UserRole.ADMIN;
  const isSupplier = role === UserRole.SUPPLIER;
  const isEmployee = role === UserRole.EMPLOYEE;
  const canManageBudget = canAccessBudgetManagement(role);

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
          isAdmin ? undefined : (department ?? undefined)
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

  useEffect(() => {
    if (role !== UserRole.PAYMENT_TEAM) return;
    const syncPayments = async (): Promise<void> => {
      await hydrateSupplierPayments();
      setPaymentRows(loadSupplierPayments());
    };
    void syncPayments();
    window.addEventListener("erp-supplier-payments", syncPayments);
    return () => window.removeEventListener("erp-supplier-payments", syncPayments);
  }, [role]);

  useEffect(() => {
    if (!isEmployee) return;

    const syncEmployeeWorkflow = async (): Promise<void> => {
      await Promise.all([hydratePurchaseRequestDrafts(), hydrateSupplierGrns()]);
      setPurchaseRequests(loadPurchaseRequestDrafts());
      setGrns(loadSupplierGrns());
    };

    void syncEmployeeWorkflow();
    window.addEventListener("erp-purchase-request-drafts", syncEmployeeWorkflow);
    window.addEventListener("erp-supplier-grns", syncEmployeeWorkflow);
    return () => {
      window.removeEventListener("erp-purchase-request-drafts", syncEmployeeWorkflow);
      window.removeEventListener("erp-supplier-grns", syncEmployeeWorkflow);
    };
  }, [isEmployee]);

  // Calculate statistics from dashboard API
  const pendingApprovals = dashboardStats?.pendingApprovals ?? 0;
  const totalRequests = dashboardStats?.totalRequests ?? 0;
  const totalOrders = dashboardStats?.totalOrders ?? 0;
  const currentMonthSpending = dashboardStats?.currentMonthSpending ?? 0;
  const spendingTrend = dashboardStats?.spendingTrend ?? 0;
  const requestsTrend = dashboardStats?.requestsTrend ?? 0;
  const ordersTrend = dashboardStats?.ordersTrend ?? 0;

  const ownedRequests = useMemo(() => {
    if (!sessionUser) return [];
    const email = String(sessionUser.email ?? "").trim().toLowerCase();
    const name = String(sessionUser.name ?? "").trim().toLowerCase();
    return purchaseRequests.filter((request) =>
      (request.createdByUserId != null && String(request.createdByUserId) === String(sessionUser.id)) ||
      String(request.createdByEmail ?? "").trim().toLowerCase() === email ||
      (name.length > 0 && String(request.requestBy ?? "").trim().toLowerCase() === name),
    );
  }, [purchaseRequests, sessionUser]);

  const completedOwnedRequests = useMemo(() => {
    const completedRequestNumbers = new Set(
      grns
        .filter((grn) => isGrnReceived(grn.status))
        .map((grn) => grn.sourcePrNumber),
    );
    return ownedRequests.filter(
      (request) => String(request.status) === "COMPLETED" || completedRequestNumbers.has(request.prNumber),
    );
  }, [grns, ownedRequests]);

  // Use real data from API
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
      show: role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.DEPARTMENT_EXECUTIVE,
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 20 }} />,
      label: t('quickActions.createPurchaseOrder'),
      path: "/purchasing/po-creation",
      color: "#f59e0b",
      show: role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.DEPARTMENT_EXECUTIVE,
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
    {
      icon: <DollarOutlined style={{ fontSize: 20 }} />,
      label: "Department budget",
      path: "/budget/department-overview",
      color: "#8b5cf6",
      show: canManageBudget,
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 20 }} />,
      label: "Supplier invoice approval",
      path: "/finance/invoice-approval",
      color: "#0f766e",
      show: role === UserRole.TREASURY_FINANCE_OFFICER,
    },
    {
      icon: <CreditCardOutlined style={{ fontSize: 20 }} />,
      label: "Payment processing",
      path: "/finance/payment-processing",
      color: "#2563eb",
      show: role === UserRole.PAYMENT_TEAM,
    },
    {
      icon: <DollarOutlined style={{ fontSize: 20 }} />,
      label: "Budget adjustment",
      path: "/budget/adjustment-request",
      color: "#d97706",
      show: role === UserRole.MANAGER,
    },
    {
      icon: <DollarOutlined style={{ fontSize: 20 }} />,
      label: "Submit next month budget",
      path: "/budget/next-month-submission",
      color: "#7c3aed",
      show: role === UserRole.DEPARTMENT_EXECUTIVE,
    },
    {
      icon: <DollarOutlined style={{ fontSize: 20 }} />,
      label: "Budget control centre",
      path: "/budget/finance-dashboard",
      color: "#f59e0b",
      show: role === UserRole.TREASURY_FINANCE_OFFICER,
    },
  ].filter((action) => action.show);

  const roleTitle = isEmployee
    ? "My Work"
    : role === UserRole.MANAGER
      ? "Department Manager Overview"
      : role === UserRole.DEPARTMENT_EXECUTIVE
        ? "Department Executive Overview"
        : role === UserRole.TREASURY_FINANCE_OFFICER
          ? "Treasury Control Centre"
          : role === UserRole.PAYMENT_TEAM
            ? "Payment Operations"
            : t("title");
  const roleSubtitle = isEmployee
    ? "Your requests, purchase orders and tracked items in one place."
    : role === UserRole.MANAGER || role === UserRole.DEPARTMENT_EXECUTIVE
      ? "Monitor department purchasing, budget usage and work waiting for action."
      : role === UserRole.TREASURY_FINANCE_OFFICER
        ? "Review invoice approvals, budget submissions and financial exceptions."
        : role === UserRole.PAYMENT_TEAM
          ? "Prioritise upcoming, overdue and completed supplier payments."
          : t("welcome", { name: sessionUser?.name || sessionUser?.email });
  const departmentFocus: Record<string, string> = {
    finance: "Invoice, payment and budget exceptions",
    "human resources": "People-related requests and training spend",
    it: "Hardware, software and licence requests",
    purchasing: "Supplier lead time, approvals and delivery flow",
    operations: "Operational spend, open orders and delivery status",
    sales: "Sales requests, events and travel-related spend",
    warehouse: "Stock levels, incoming deliveries and GRN discrepancies",
    marketing: "Campaign procurement and agency spend",
    administration: "Facilities, office suppliers and service requests",
    legal: "Contract vendors, renewals and compliance documents",
  };
  const departmentFocusLabel = departmentFocus[String(department ?? "").trim().toLowerCase()];

  const statCards = isEmployee
    ? [
        { title: "Draft purchase requests", value: ownedRequests.filter((r) => r.status === "DRAFT").length, icon: <FileTextOutlined />, color: "#3b82f6" },
        { title: "Submitted requests", value: ownedRequests.filter((r) => r.status !== "DRAFT").length, icon: <ClockCircleOutlined />, color: "#f59e0b" },
        { title: "Completed requests", value: completedOwnedRequests.length, icon: <CheckCircleOutlined />, color: "#22c55e" },
        { title: "Unread notifications", value: notifications.filter((n) => !n.isRead).length, icon: <InboxOutlined />, color: "#ec4899" },
      ]
    : role === UserRole.PAYMENT_TEAM
      ? [
          { title: "Pending payments", value: paymentRows.filter((row) => row.status === "PENDING_PAYMENT").length, icon: <ClockCircleOutlined />, color: "#f59e0b" },
          { title: "Pending payment amount", value: paymentRows.filter((row) => row.status === "PENDING_PAYMENT").reduce((sum, row) => sum + Number(row.amount || 0), 0).toFixed(2), suffix: " RM", icon: <CreditCardOutlined />, color: "#2563eb" },
          { title: "Paid payments", value: paymentRows.filter((row) => row.status === "PAID").length, icon: <CheckCircleOutlined />, color: "#14b8a6" },
          { title: "Department monthly spend", value: (currentMonthSpending / 1000).toFixed(1), suffix: "K", icon: <DollarOutlined />, color: "#8b5cf6" },
        ]
      : [
          { title: role === UserRole.TREASURY_FINANCE_OFFICER ? "Pending workflow approvals" : t("cards.pendingApprovals"), value: pendingApprovals, icon: <ClockCircleOutlined />, color: "#f59e0b" },
          { title: t("cards.purchaseRequests"), value: totalRequests, icon: <FileTextOutlined />, color: "#3b82f6", trend: requestsTrend !== 0 ? { value: Math.abs(requestsTrend), isPositive: requestsTrend > 0 } : undefined },
          { title: t("cards.purchaseOrders"), value: totalOrders, icon: <ShoppingCartOutlined />, color: "#22c55e", trend: ordersTrend !== 0 ? { value: Math.abs(ordersTrend), isPositive: ordersTrend > 0 } : undefined },
          { title: t("cards.monthlySpending"), value: (currentMonthSpending / 1000).toFixed(1), suffix: "K", icon: <TruckOutlined />, color: "#ec4899", trend: spendingTrend !== 0 ? { value: Math.abs(spendingTrend), isPositive: spendingTrend > 0 } : undefined },
        ];

  const requestStages = isEmployee
    ? [
        { label: "Draft", value: ownedRequests.filter((request) => request.status === "DRAFT").length, color: "#64748b", path: "/purchasing/creation" },
        { label: "In review", value: ownedRequests.filter((request) => !["DRAFT", "COMPLETED", "REJECTED", "CANCELLED"].includes(String(request.status))).length, color: "#f59e0b", path: "/tracking-item?journey=in-review" },
        { label: "Completed", value: completedOwnedRequests.length, color: "#10b981", path: "/tracking-item?stage=completed" },
      ]
    : [];
  const totalEmployeeRequests = ownedRequests.length;
  const completedEmployeeRequests = requestStages.find((stage) => stage.label === "Completed")?.value ?? 0;
  const completionRate = totalEmployeeRequests > 0
    ? Math.round((completedEmployeeRequests / totalEmployeeRequests) * 100)
    : 0;
  const urgentCount = isEmployee
    ? requestStages.find((stage) => stage.label === "Draft")?.value ?? 0
    : pendingApprovals;
  const urgentLabel = isEmployee
    ? urgentCount > 0
      ? `${urgentCount} draft request${urgentCount === 1 ? "" : "s"} needs your attention`
      : "No unfinished drafts — you are all caught up"
    : urgentCount > 0
      ? `${urgentCount} workflow item${urgentCount === 1 ? "" : "s"} waiting for action`
      : "No workflow items waiting for action";
  const primaryAction = quickActions[0];
  const operationsSnapshot = role === UserRole.PAYMENT_TEAM
    ? [
        { label: "Ready for payment", helper: "Supplier payments in queue", value: paymentRows.filter((row) => row.status === "PENDING_PAYMENT").length, icon: <CreditCardOutlined />, color: "#d97706", path: "/finance/payment-processing" },
        { label: "Paid payments", helper: "Payments processed successfully", value: paymentRows.filter((row) => row.status === "PAID").length, icon: <CheckCircleOutlined />, color: "#059669", path: "/finance/payment-processing" },
        { label: "Unread updates", helper: "Notifications to review", value: notifications.filter((notification) => !notification.isRead).length, icon: <BellOutlined />, color: "#2563eb", path: "/notifications" },
      ]
    : [
        { label: "Needs approval", helper: "Workflow items waiting for review", value: pendingApprovals, icon: <ClockCircleOutlined />, color: "#d97706", path: "/purchasing/approval" },
        { label: "Purchase requests", helper: "Requests in your department", value: totalRequests, icon: <FileTextOutlined />, color: "#2563eb", path: "/purchasing/approval" },
        { label: "Purchase orders", helper: "Orders currently tracked", value: totalOrders, icon: <ShoppingCartOutlined />, color: "#059669", path: "/purchasing/po-creation" },
      ];

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
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}><RocketOutlined /> WORKSPACE OVERVIEW</div>
          <Title level={2} className={styles.heroTitle}>
            {roleTitle}
          </Title>
          <Text className={styles.heroWelcome}>
            {t('welcome', { name: sessionUser?.name || sessionUser?.email })}
            {department ? ` · ${department}` : ""}
          </Text>
          <Text className={styles.heroSubtitle}>
            {roleSubtitle}
          </Text>
          {departmentFocusLabel && (
            <Text className={styles.heroFocus}>
              Focus: {departmentFocusLabel}
            </Text>
          )}
        </div>
        <Flex vertical align="flex-end" gap={14} className={styles.heroActions}>
          <Flex align="center" gap={8} wrap justify="end">
            <Tag color="blue" className={styles.roleTag}>{role || "User"}</Tag>
          <Button
            type="default"
            icon={<QuestionCircleOutlined />}
            onClick={() => setUserGuideVisible(true)}
          >
            {t('userGuide')}
            </Button>
          </Flex>
          <div className={styles.datePill}><CalendarOutlined /> {new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "short" }).format(new Date())}</div>
        </Flex>
      </section>

      <section className={styles.insightStrip} aria-label="Today's overview">
        <div className={styles.insightItem}>
          <div className={`${styles.insightIcon} ${urgentCount > 0 ? styles.attentionIcon : styles.successIcon}`}>
            {urgentCount > 0 ? <AlertOutlined /> : <CheckCircleFilled />}
          </div>
          <div><Text className={styles.insightLabel}>Action centre</Text><Text className={styles.insightValue}>{urgentLabel}</Text></div>
        </div>
        <div className={styles.insightDivider} />
        <div className={styles.insightItem}>
          <div className={`${styles.insightIcon} ${styles.infoIcon}`}><BellOutlined /></div>
          <div><Text className={styles.insightLabel}>Notifications</Text><Text className={styles.insightValue}>{notifications.filter((notification) => !notification.isRead).length} unread update{notifications.filter((notification) => !notification.isRead).length === 1 ? "" : "s"}</Text></div>
        </div>
        {primaryAction && <Button type="primary" className={styles.insightButton} icon={<RocketOutlined />} onClick={() => navigate(primaryAction.path)}>{primaryAction.label}</Button>}
      </section>

      {/* Statistics Cards are not part of the department manager overview. */}
      {role !== UserRole.MANAGER && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {statCards.map((stat) => (
            <Col xs={24} sm={12} lg={6} key={stat.title}>
              <StatCard {...stat} loading={loading && !isEmployee && role !== UserRole.PAYMENT_TEAM} />
            </Col>
          ))}
        </Row>
      )}

      {!isEmployee && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={15}>
            <Card
              className={styles.operationsCard}
              bordered={false}
              title={<span className={styles.cardTitle}>Operations snapshot</span>}
              extra={<Text type="secondary">Live workload</Text>}
            >
              <div className={styles.operationsIntro}>
                <div>
                  <Text strong>Keep work flowing</Text>
                  <Text className={styles.operationsDescription}>Prioritise the items that need a decision or follow-up today.</Text>
                </div>
                <Tag color={urgentCount > 0 ? "orange" : "green"} icon={urgentCount > 0 ? <AlertOutlined /> : <CheckCircleFilled />}>
                  {urgentCount > 0 ? "Action required" : "All clear"}
                </Tag>
              </div>
              <div className={styles.queueGrid}>
                {operationsSnapshot.map((item) => (
                  <button className={styles.queueItem} key={item.label} onClick={() => navigate(item.path)}>
                    <span className={styles.queueIcon} style={{ color: item.color, backgroundColor: `${item.color}14` }}>{item.icon}</span>
                    <span className={styles.queueCount}>{item.value}</span>
                    <span className={styles.queueLabel}>{item.label}</span>
                    <span className={styles.queueHelper}>{item.helper}</span>
                    <ArrowRightOutlined className={styles.queueArrow} />
                  </button>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={9}><SpendingByCategory data={categoryData} loading={loading} /></Col>
        </Row>
      )}

      {/* Quick Actions and Recent Activity */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={isEmployee ? 10 : 12}>
          <Card
            title={<span className={styles.cardTitle}>{t('quickActions.title')}</span>}
            extra={<Text type="secondary">Start a task</Text>}
            bordered={false}
            className={styles.workspaceCard}
          >
            <Flex vertical gap={8}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  type="text"
                  size="large"
                  onClick={() => navigate(action.path)}
                  className={styles.actionButton}
                >
                  <Flex align="center" gap={12}>
                    <div className={styles.actionIcon} style={{ background: action.color }}>{action.icon}</div>
                    <div><Text strong>{action.label}</Text><Text className={styles.actionHint}>Open workspace</Text></div>
                  </Flex>
                  <ArrowRightOutlined style={{ color: "#94a3b8" }} />
                </Button>
              ))}
            </Flex>
          </Card>
        </Col>

        {isEmployee && (
          <Col xs={24} lg={14}>
            <Card title={<span className={styles.cardTitle}>My request journey</span>} extra={<Tag color="green">{completionRate}% complete</Tag>} bordered={false} className={styles.workspaceCard}>
              <div className={styles.journeyHeader}>
                <div><Text strong>Request progress</Text><Text className={styles.journeyDescription}>A clear view of every request you have started.</Text></div>
                <Progress type="circle" percent={completionRate} size={56} strokeColor="#10b981" trailColor="#e2e8f0" />
              </div>
              <div className={styles.stageGrid}>
                {requestStages.map((stage) => (
                  <button className={styles.stageCard} key={stage.label} onClick={() => navigate(stage.path)}>
                    <span className={styles.stageDot} style={{ background: stage.color }} />
                    <span className={styles.stageValue}>{stage.value}</span>
                    <span className={styles.stageLabel}>{stage.label}</span>
                  </button>
                ))}
              </div>
              <div className={styles.journeyFooter}><CheckCircleFilled /> Keep requests moving by completing drafts and checking status updates.</div>
            </Card>
          </Col>
        )}

        <Col xs={24} lg={isEmployee ? 24 : 12}>
          <Card
            title={<span className={styles.cardTitle}>{t('recentActivity.title')}</span>}
            extra={
              recentActivities.length > 0 && (
                <Button type="link" onClick={() => navigate("/notifications")}>
                  {t('viewAll')}
                </Button>
              )
            }
            bordered={false}
            className={styles.workspaceCard}
          >
            {recentActivities.length === 0 ? (
              <Empty description={t('recentActivity.noNewActivity')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                dataSource={recentActivities}
                renderItem={(item) => {
                  const route = resolveNotificationRoute(item.notification, sessionUser?.role);
                  return (
                    <List.Item
                      className={styles.activityItem}
                      onClick={() => {
                        if (route !== "#") {
                          navigate(route);
                        }
                      }}
                    >
                      <List.Item.Meta
                        avatar={<Badge dot={!item.notification.isRead} color="#3b82f6"><Avatar className={styles.activityAvatar} icon={<BellOutlined />} /></Badge>}
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
        </Col>
      </Row>

      <UserGuideModal
        visible={userGuideVisible}
        onClose={() => setUserGuideVisible(false)}
        userRole={role}
      />
    </div>
  );
}
