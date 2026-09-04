import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Modal,
  notification as antdNotification,
  Spin,
  theme,
  Tooltip,
} from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  AppstoreOutlined,
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  TeamOutlined,
  InboxOutlined,
  SettingOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

import {
  clearSessionUser,
  getSessionUser,
  type SessionUser,
} from "./shared/auth/session";
import { canAccessBudgetManagement, canAccessFinanceModule, canApproveSupplierInvoices, isFinanceRole, UserRole } from "./shared/types/roles";
import NotificationBell from "./components/shared/NotificationBell";
import BreadcrumbNav from "./components/shared/BreadcrumbNav";
import ChatBotWidget from "./components/ChatBot/ChatBotWidget";
import ScrollButtons from "./components/shared/ScrollButtons";
import LanguageSelector from "./components/shared/LanguageSelector";
import { API_ROOT } from "./shared/api/base";

import sidebarStyles from "./Sidebar.module.css";
import appStyles from "./App.module.css";

const { Sider, Content } = Layout;

const LoginPage = lazy(() => import("./pages/Login"));
const ForgetPasswordPage = lazy(() => import("./pages/ForgetPassword"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword"));

const Dashboard = lazy(() => import("./pages/DashboardNew"));
const AdminOverview = lazy(() => import("./pages/AdminOverview"));
const UserAccessLayout = lazy(() => import("./pages/userAccess/UserAccessLayout"));
const UserAccessUserManagement = lazy(
  () => import("./pages/userAccess/UserManagementSubmodule"),
);
const UserAccessRbac = lazy(() => import("./pages/userAccess/RbacSubmodule"));
const UserList = lazy(() => import("./pages/userAccess/users/UserList"));
const CreateUser = lazy(() => import("./pages/userAccess/users/CreateUser"));
const RbacRoles = lazy(() => import("./pages/userAccess/rbac/Roles"));
const PurchasingManagement = lazy(() => import("./pages/purchasing/PurchasingManagement"));
const PurchasingCreation = lazy(() => import("./pages/purchasing/CreationSubmodule"));
const CategorySelectionManagement = lazy(
  () => import("./pages/categorySelection/CategorySelectionManagement"),
);
const ItemCategoriesPage = lazy(() => import("./pages/categorySelection/ItemCategoriesPage"));
const UnitsOfMeasurementPage = lazy(
  () => import("./pages/categorySelection/UnitsOfMeasurementPage"),
);
const PaymentTermsPage = lazy(
  () => import("./pages/categorySelection/PaymentTermsPage"),
);
const DepartmentSubmodule = lazy(
  () => import("./pages/categorySelection/DepartmentSubmodule"),
);
const RoleSubmodule = lazy(
  () => import("./pages/categorySelection/RoleSubmodule"),
);
const PurchasingReview = lazy(() => import("./pages/purchasing/ReviewSubmodule"));
const PurchasingReviewDetail = lazy(() => import("./pages/purchasing/ReviewDetailSubmodule"));
const PurchasingApproval = lazy(() => import("./pages/purchasing/ApprovalSubmodule"));
const PurchasingApprovalDetail = lazy(
  () => import("./pages/purchasing/ApprovalDetailSubmodule"),
);
const PurchaseOrderCreation = lazy(() => import("./pages/purchasing/PurchaseOrderCreation"));
const PurchaseOrderReview = lazy(() => import("./pages/purchasing/PurchaseOrderReview"));
const PurchaseOrderReviewDetail = lazy(
  () => import("./pages/purchasing/PurchaseOrderReviewDetail"),
);
const PurchaseOrderApproval = lazy(() => import("./pages/purchasing/PurchaseOrderApproval"));
const PurchaseOrderApprovalDetail = lazy(
  () => import("./pages/purchasing/PurchaseOrderApprovalDetail"),
);
const PurchasingDeliverySubmodule = lazy(() => import("./pages/purchasing/DeliverySubmodule"));
const PurchasingGoodsReceivedNoteSubmodule = lazy(
  () => import("./pages/purchasing/GoodsReceivedNoteSubmodule"),
);
const PurchasingGoodsReceivedNoteDetailSubmodule = lazy(
  () => import("./pages/purchasing/GoodsReceivedNoteDetailSubmodule"),
);
const SupplierFulfillmentHome = lazy(
  () => import("./pages/supplierFulfillment/SupplierFulfillmentHome"),
);
const SupplierPaymentSubmodule = lazy(
  () => import("./pages/supplierFulfillment/SupplierPaymentSubmodule"),
);
const SupplierInventorySubmodule = lazy(
  () => import("./pages/supplierFulfillment/SupplierInventorySubmodule"),
);
const SupplierInvoiceSubmodule = lazy(
  () => import("./pages/supplierFulfillment/SupplierInvoiceSubmodule"),
);
const DeliverySubmodule = lazy(() => import("./pages/supplierFulfillment/DeliverySubmodule"));
const OrderAcknowledgementSubmodule = lazy(
  () => import("./pages/supplierFulfillment/OrderAcknowledgementSubmodule"),
);
const OrderAcknowledgementDetailSubmodule = lazy(
  () => import("./pages/supplierFulfillment/OrderAcknowledgementDetailSubmodule"),
);
const DeliveryDetailSubmodule = lazy(
  () => import("./pages/supplierFulfillment/DeliveryDetailSubmodule"),
);
const GoodsReceivedNoteStatusSubmodule = lazy(
  () => import("./pages/supplierFulfillment/GoodsReceivedNoteStatusSubmodule"),
);
const GoodsReceivedNoteDetailSubmodule = lazy(
  () => import("./pages/supplierFulfillment/GoodsReceivedNoteDetailSubmodule"),
);
const CreateDeliveryFromGrnSubmodule = lazy(
  () => import("./pages/supplierFulfillment/CreateDeliveryFromGrnSubmodule"),
);
const Profile = lazy(() => import("./pages/Profile"));
const ProfileResetPassword = lazy(() => import("./pages/ProfileResetPassword"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const TrackingItemManagement = lazy(() => import("./pages/TrackingItemManagement"));
const SettingsHome = lazy(() => import("./pages/settings/SettingsHome"));
const CompanyAddressSubmodule = lazy(() => import("./pages/settings/CompanyAddressSubmodule"));
const SupplierTaxInformationSubmodule = lazy(() => import("./pages/settings/SupplierTaxInformationSubmodule"));
const SupplierPaymentDetailsSubmodule = lazy(() => import("./pages/settings/SupplierPaymentDetailsSubmodule"));
const FeedbackSubmodule = lazy(() => import("./pages/settings/FeedbackSubmodule"));
const AIAssistantSubmodule = lazy(() => import("./pages/settings/AIAssistantSubmodule"));
const AIAssistantRedesign = lazy(() => import("./pages/settings/AIAssistantRedesign"));
const SubAgentsPage = lazy(() => import("./pages/settings/SubAgentsPage"));
const ChatBotPage = lazy(() => import("./pages/ChatBotPage"));
const BudgetManagementHome = lazy(
  () => import("./pages/budgetManagement/BudgetManagementHome"),
);
const DepartmentBudgetOverview = lazy(() => import("./pages/DepartmentBudgetOverview"));
const BudgetAdjustmentRequest = lazy(() => import("./pages/BudgetAdjustmentRequest"));
const FinanceBudgetDashboard = lazy(() => import("./pages/FinanceBudgetDashboard"));
const BudgetApprovalQueue = lazy(() => import("./pages/BudgetApprovalQueue"));
const NextMonthBudgetSubmission = lazy(() => import("./pages/NextMonthBudgetSubmission"));
const FinanceInvoiceApproval = lazy(() => import("./pages/FinanceInvoiceApproval"));
const FinancePaymentProcessing = lazy(() => import("./pages/FinancePaymentProcessing"));
const FinanceHome = lazy(() => import("./pages/FinanceHome"));

type MenuKey =
  | "overview"
  | "users-access"
  | "purchasing"
  | "budget-management"
  | "finance"
  | "supplier-overview"
  | "tracking-item"
  | "chatbot"
  | "settings";

function useMenuKeyFromPath(pathname: string): MenuKey {
  if (pathname.startsWith("/users-access")) return "users-access";
  if (pathname.startsWith("/purchasing")) return "purchasing";
  if (
    pathname.startsWith("/budget-management") ||
    pathname.startsWith("/budget/")
  ) {
    return "budget-management";
  }
  if (pathname.startsWith("/finance")) return "finance";
  if (pathname.startsWith("/supplier-overview")) return "supplier-overview";
  if (pathname.startsWith("/tracking-item")) return "tracking-item";
  if (pathname.startsWith("/chatbot")) return "chatbot";
  if (
    pathname.startsWith("/settings") ||
    pathname.startsWith("/category-selection")
  ) {
    return "settings";
  }
  return "overview";
}

function MainLayout(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const contentBg = "#f4f7fb";
  const { t } = useTranslation('navigation');

  const selectedKey = useMenuKeyFromPath(location.pathname);
  const isChatbotPage = location.pathname.startsWith("/chatbot");
  const [sessionUser, setSessionUserState] = useState<SessionUser | null>(() =>
    getSessionUser(),
  );
  const [gmailPromptVisible, setGmailPromptVisible] = useState(false);
  const gmailNotificationKey = useRef<string | null>(null);
  const gmailStatusRequestId = useRef(0);

  useEffect(() => {
    const sync = () => {
      const next = getSessionUser();
      setSessionUserState((previous) => {
        if (
          previous?.id === next?.id &&
          previous?.email?.toLowerCase() === next?.email?.toLowerCase()
        ) {
          return previous;
        }
        return next;
      });
    };
    sync();
    window.addEventListener("erp-portal-session", sync);
    return () => window.removeEventListener("erp-portal-session", sync);
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++gmailStatusRequestId.current;
    if (!sessionUser) {
      setGmailPromptVisible(false);
      if (gmailNotificationKey.current) {
        antdNotification.destroy(gmailNotificationKey.current);
        gmailNotificationKey.current = null;
      }
      return () => {
        cancelled = true;
      };
    }

    const statusEmail = encodeURIComponent(String(sessionUser.email || "").trim());
    axios
      .get(`${API_ROOT}/gmail/status?email=${statusEmail}`)
      .then(({ data }) => {
        if (cancelled || requestId !== gmailStatusRequestId.current) return;
        // The backend resolves aliases between the OptiMind login and the
        // Google account authorized by the user. A connected response is
        // therefore sufficient; comparing raw Gmail addresses can prompt
        // repeatedly when a university alias is used.
        const connected = Boolean(data?.connected);
        const authorizationExpired = data?.code === "invalid_grant";
        const authorizationRequired =
          data?.code === "authorization_required" || !data?.code;
        // Missing authorization uses the existing modal. An expired/revoked
        // token uses the actionable notification below so the reason is clear.
        setGmailPromptVisible(!connected && !authorizationExpired && authorizationRequired);
        if (connected) {
          if (gmailNotificationKey.current) {
            antdNotification.destroy(gmailNotificationKey.current);
            gmailNotificationKey.current = null;
          }
          return;
        }

        // Surface expired/revoked OAuth credentials at startup. The keyed
        // notification prevents duplicate alerts when the layout re-renders.
        if (!authorizationExpired) {
          if (gmailNotificationKey.current) {
            antdNotification.destroy(gmailNotificationKey.current);
            gmailNotificationKey.current = null;
          }
          return;
        }

        const notificationKey = `gmail-auth-${String(sessionUser.email || "").trim().toLowerCase()}`;
        gmailNotificationKey.current = notificationKey;
        antdNotification.warning({
          key: notificationKey,
          message: "Gmail verification required",
          description:
            data?.reason ||
            "Please reconnect your Gmail account so OptiMind can apply email labels.",
          duration: 0,
          btn: (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                const email = encodeURIComponent(String(sessionUser.email || "").trim());
                window.location.assign(`${API_ROOT}/gmail/oauth/start?email=${email}`);
              }}
            >
              Reconnect Gmail
            </Button>
          ),
        });
      })
      .catch(() => {
        if (!cancelled && requestId === gmailStatusRequestId.current) {
          setGmailPromptVisible(false);
          if (gmailNotificationKey.current) {
            antdNotification.destroy(gmailNotificationKey.current);
            gmailNotificationKey.current = null;
          }
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionUser]);

  const connectGmail = () => {
    const email = encodeURIComponent(String(sessionUser?.email || "").trim());
    window.location.assign(`${API_ROOT}/gmail/oauth/start?email=${email}`);
  };

  const role = sessionUser?.role;
  const canAccessFinance = canAccessFinanceModule(role, sessionUser?.department);

  const canAccessPath = (pathname: string): boolean => {
    if (!role) return true;
    if (role === UserRole.ADMIN) return true;
    if (pathname.startsWith("/finance") && !canAccessFinance) return false;
    if (pathname === "/budget/finance-dashboard" && !canAccessFinance) return false;
    if (role === UserRole.MANAGER) return !pathname.startsWith("/supplier-overview");
    if (role === UserRole.DEPARTMENT_EXECUTIVE) {
      if (pathname.startsWith("/users-access")) return false;
      if (pathname.startsWith("/supplier-overview")) return false;
      if (pathname.startsWith("/purchasing/po-approval")) return false;
      return true;
    }
    if (role === UserRole.EMPLOYEE || isFinanceRole(role)) {
      if (pathname.startsWith("/overview")) return true;
      if (pathname.startsWith("/profile")) return true;
      if (pathname.startsWith("/notifications")) return true;
      if (pathname === "/purchasing") return true;
      if (pathname.startsWith("/purchasing/creation")) return true;
      if (pathname.startsWith("/purchasing/review")) return true;
      if (pathname.startsWith("/purchasing/goods-received-note")) return true;
      if (pathname.startsWith("/supplier-overview/invoice")) return isFinanceRole(role);
      if (
        pathname.startsWith("/budget-management") ||
        pathname === "/budget" ||
        pathname.startsWith("/budget/")
      ) {
        return canAccessBudgetManagement(role);
      }
      if (pathname.startsWith("/finance/invoice-approval")) return canAccessFinance && canApproveSupplierInvoices(role);
      if (pathname.startsWith("/finance/payment-processing")) return role === UserRole.PAYMENT_TEAM || role === UserRole.ADMIN;
      if (pathname.startsWith("/finance")) return canAccessFinance;
      if (pathname.startsWith("/tracking-item")) return true;
      if (pathname.startsWith("/chatbot")) return true;
      if (pathname.startsWith("/ai-agents")) return true;
      if (pathname.startsWith("/settings")) return true;
      if (pathname.startsWith("/category-selection")) return true;
      return false;
    }
    if (role === UserRole.SUPPLIER) {
      if (pathname.startsWith("/supplier-overview")) return true;
      if (pathname.startsWith("/profile")) return true;
      if (pathname.startsWith("/notifications")) return true;
      if (pathname.startsWith("/tracking-item")) return true;
      if (pathname.startsWith("/settings/ai-assistant")) return false;
      if (pathname.startsWith("/settings")) return true;
      if (pathname.startsWith("/category-selection")) return true;
      return false;
    }
    return true;
  };

  const fallbackPath = (): string => {
    if (role === UserRole.SUPPLIER) return "/supplier-overview";
    return "/overview";
  };

  useEffect(() => {
    if (!canAccessPath(location.pathname)) {
      navigate(fallbackPath(), { replace: true });
    }
  }, [location.pathname, role, sessionUser?.department]);
  const accentByKey: Record<MenuKey, string> = useMemo(
    () => ({
      overview: "#0ea5e9",
      "users-access": "#6366f1",
      purchasing: "#22c55e",
      "budget-management": "#f59e0b",
      finance: "#0f766e",
      "supplier-overview": "#14b8a6",
      "tracking-item": "#ec4899",
      chatbot: "#f59e0b",
      settings: "#64748b",
    }),
    [],
  );
  const routes: Record<MenuKey, string> = {
    overview: "/overview",
    "users-access": "/users-access",
    purchasing: "/purchasing",
    "budget-management": "/budget-management",
    finance: "/finance",
    "supplier-overview": "/supplier-overview",
    "tracking-item": "/tracking-item",
    chatbot: "/chatbot",
    settings: "/settings",
  };

  const primaryAdminMenuKeys: MenuKey[] = [
    "overview",
    "users-access",
    "budget-management",
    "chatbot",
    "settings",
  ];

  const canSeeMenuKey = (key: MenuKey): boolean => {
    if (!role) return true;
    if (role === UserRole.ADMIN) return true;
    if (role === UserRole.MANAGER) {
      if (key === "finance") return canAccessFinance;
      return key !== "supplier-overview";
    }
    if (role === UserRole.DEPARTMENT_EXECUTIVE) {
      if (key === "finance") return canAccessFinance;
      return key !== "supplier-overview" && key !== "users-access";
    }
    if (role === UserRole.EMPLOYEE || isFinanceRole(role)) {
      return (
        key === "overview" ||
        key === "purchasing" ||
        (key === "budget-management" && canAccessBudgetManagement(role)) ||
        (key === "finance" && canAccessFinance) ||
        key === "tracking-item" ||
        key === "chatbot" ||
        key === "settings"
      );
    }
    if (role === UserRole.SUPPLIER) {
      return key === "supplier-overview" || key === "tracking-item" || key === "settings";
    }
    return true;
  };

  const menuItems = [
    { key: "overview", icon: <DashboardOutlined />, label: t("sidebar.overview") },
    { key: "users-access", icon: <TeamOutlined />, label: t("sidebar.userAccess") },
    { key: "purchasing", icon: <ShoppingCartOutlined />, label: t("sidebar.purchasing") },
    { key: "budget-management", icon: <DollarOutlined />, label: t("sidebar.budgetManagement") },
    { key: "finance", icon: <DollarOutlined />, label: "Finance" },
    { key: "tracking-item", icon: <InboxOutlined />, label: t("sidebar.trackingItem") },
    { key: "supplier-overview", icon: <ShopOutlined />, label: t("sidebar.supplierOverview") },
    { key: "chatbot", icon: <CommentOutlined />, label: t("sidebar.chatbot") },
    { key: "settings", icon: <SettingOutlined />, label: t("sidebar.settings") },
  ];
  const sidebarItems = menuItems
    .filter((item) => {
      const key = item.key as MenuKey;
      return canSeeMenuKey(key) && (role !== UserRole.ADMIN || primaryAdminMenuKeys.includes(key));
    })
    .sort((a, b) => {
      if (role !== UserRole.SUPPLIER) return 0;
      const supplierOrder: MenuKey[] = ["supplier-overview", "tracking-item", "settings"];
      return supplierOrder.indexOf(a.key as MenuKey) - supplierOrder.indexOf(b.key as MenuKey);
    });
  const otherModuleItems = menuItems.filter((item) => {
    const key = item.key as MenuKey;
    return role === UserRole.ADMIN && canSeeMenuKey(key) && !primaryAdminMenuKeys.includes(key);
  });

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Modal
        open={gmailPromptVisible}
        title="Connect Gmail"
        okText="Connect Gmail"
        cancelText="Later"
        onOk={connectGmail}
        onCancel={() => setGmailPromptVisible(false)}
        centered
      >
        <p>
          Connect the Gmail account you use for OptiMind notifications so the
          system can organise them under the OptiMind label.
        </p>
      </Modal>
      <Sider
        width={240}
        collapsedWidth={72}
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme="light"
        className={sidebarStyles.sider}
        style={{ background: colorBgContainer }}
      >
        <div className={sidebarStyles.siderInner}>
          <div className={sidebarStyles.brand}>
            <Button
              type="text"
              aria-label={collapsed ? "Expand menu" : "Collapse menu"}
              className={sidebarStyles.collapseBtn}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((v) => !v)}
            />
            {!collapsed && <span className={sidebarStyles.brandText}>OptiMind</span>}
          </div>

          <div className={sidebarStyles.menuWrap}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={(e) => navigate(routes[e.key as MenuKey])}
              className={sidebarStyles.menu}
              style={
                {
                  ["--active-accent" as any]: accentByKey[selectedKey],
                  ["--active-accent-soft" as any]: `${accentByKey[selectedKey]}1F`,
                  ["--active-accent-softer" as any]: `${accentByKey[selectedKey]}14`,
                } as React.CSSProperties
              }
              items={sidebarItems}
            />
          </div>

          <div className={sidebarStyles.accountArea}>
            <Dropdown
              trigger={["click"]}
              placement="topLeft"
              menu={{
                items: [
                  { key: "profile", icon: <UserOutlined />, label: "Profile" },
                  { type: "divider" },
                  { key: "signout", icon: <LogoutOutlined />, label: "Sign out" },
                ],
                onClick: ({ key }) => {
                  if (key === "profile") navigate("/profile");
                  if (key === "signout") {
                    clearSessionUser();
                    navigate("/login");
                  }
                },
              }}
            >
              <Button className={sidebarStyles.accountButton}>
                <Avatar
                  size={collapsed ? 28 : 32}
                  src={
                    sessionUser?.avatarUrl &&
                    String(sessionUser.avatarUrl).trim().length > 0
                      ? String(sessionUser.avatarUrl).trim()
                      : undefined
                  }
                  style={{ flexShrink: 0 }}
                >
                  {!(
                    sessionUser?.avatarUrl &&
                    String(sessionUser.avatarUrl).trim().length > 0
                  )
                    ? (sessionUser?.name ?? sessionUser?.email ?? "A")
                        .slice(0, 1)
                        .toUpperCase()
                    : null}
                </Avatar>
                {!collapsed && (
                  <span className={sidebarStyles.accountName}>
                    {sessionUser?.name ?? sessionUser?.email ?? "Account"}
                  </span>
                )}
              </Button>
            </Dropdown>
          </div>
        </div>
      </Sider>

      <Layout style={{ background: contentBg }}>
        <div style={{
          minHeight: 68,
          padding: "0 clamp(18px, 2.4vw, 32px)",
          background: colorBgContainer,
          borderBottom: "1px solid var(--app-line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <BreadcrumbNav />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {otherModuleItems.length > 0 && (
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                menu={{
                  items: otherModuleItems,
                  selectedKeys: primaryAdminMenuKeys.includes(selectedKey) ? [] : [selectedKey],
                  onClick: ({ key }) => navigate(routes[key as MenuKey]),
                }}
              >
                <Tooltip title={t("sidebar.otherModules")}>
                  <Button
                    type="text"
                    shape="circle"
                    aria-label={t("sidebar.otherModules")}
                    className={appStyles.moduleSwitcherButton}
                    icon={<AppstoreOutlined />}
                  />
                </Tooltip>
              </Dropdown>
            )}
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
        <Content
          id="main-content"
          className={`${appStyles.contentRoot} ${isChatbotPage ? appStyles.chatbotContentRoot : ""}`}
          style={{
            margin: isChatbotPage ? 0 : '0 clamp(12px, 1.8vw, 24px) 24px',
            padding: isChatbotPage ? 0 : '24px clamp(14px, 2.4vw, 32px) 32px',
            background: contentBg,
            borderRadius: isChatbotPage ? 0 : 8,
            overflow: isChatbotPage ? 'hidden' : 'auto',
            minHeight: 0,
          }}
        >
          <Suspense
            fallback={
              <Flex
                align="center"
                justify="center"
                style={{ minHeight: "55vh", color: "#6b7280", gap: 12 }}
              >
                <Spin size="large" />
                <span>Loading module...</span>
              </Flex>
            }
          >
            <Routes>
          <Route
            path="/overview"
            element={
              role === UserRole.ADMIN ? (
                <AdminOverview />
              ) : (
                <Dashboard />
              )
            }
          />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile/reset-password" element={<ProfileResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users-access" element={<UserAccessLayout />}>
            <Route
              index
              element={<Navigate to="/users-access/users" replace />}
            />
            <Route path="users" element={<UserAccessUserManagement />}>
              <Route index element={<Navigate to="list" replace />} />
              <Route path="list" element={<UserList />} />
              <Route path="create" element={<CreateUser />} />
              <Route path="*" element={<Navigate to="list" replace />} />
            </Route>
            <Route path="rbac" element={<UserAccessRbac />}>
              <Route index element={<Navigate to="roles" replace />} />
              <Route path="roles" element={<RbacRoles />} />
              <Route path="*" element={<Navigate to="roles" replace />} />
            </Route>
          </Route>
          <Route path="/purchasing" element={<PurchasingManagement />} />
          <Route path="/purchasing/creation" element={<PurchasingCreation />} />
          <Route path="/purchasing/creation/:localId" element={<PurchasingCreation />} />
          <Route
            path="/purchasing/settings/lists"
            element={<Navigate to="/category-selection" replace />}
          />
          <Route
            path="/category-selection"
            element={<CategorySelectionManagement />}
          />
          <Route
            path="/category-selection/item-categories"
            element={<ItemCategoriesPage />}
          />
          <Route
            path="/category-selection/units-of-measurement"
            element={<UnitsOfMeasurementPage />}
          />
          <Route
            path="/category-selection/payment-terms"
            element={<PaymentTermsPage />}
          />
          <Route
            path="/category-selection/departments"
            element={<DepartmentSubmodule />}
          />
          <Route path="/category-selection/roles" element={<RoleSubmodule />} />
          <Route
            path="/category-selection/*"
            element={<Navigate to="/category-selection" replace />}
          />
          <Route path="/purchasing/review" element={<PurchasingReview />} />
          <Route
            path="/purchasing/review/:localId"
            element={<PurchasingReviewDetail />}
          />
          <Route path="/purchasing/approval" element={<PurchasingApproval />} />
          <Route
            path="/purchasing/approval/:localId"
            element={<PurchasingApprovalDetail />}
          />
          <Route path="/purchasing/po-creation" element={<PurchaseOrderCreation />} />
          <Route path="/purchasing/po-creation/:localId" element={<PurchaseOrderCreation />} />
          <Route path="/purchasing/po-review" element={<PurchaseOrderReview />} />
          <Route
            path="/purchasing/po-review/:localId"
            element={<PurchaseOrderReviewDetail />}
          />
          <Route path="/purchasing/po-approval" element={<PurchaseOrderApproval />} />
          <Route
            path="/purchasing/po-approval/:localId"
            element={<PurchaseOrderApprovalDetail />}
          />
          <Route
            path="/purchasing/delivery"
            element={<PurchasingDeliverySubmodule />}
          />
          <Route
            path="/purchasing/goods-received-note"
            element={<PurchasingGoodsReceivedNoteSubmodule />}
          />
          <Route
            path="/purchasing/goods-received-note/:localId"
            element={<PurchasingGoodsReceivedNoteDetailSubmodule />}
          />
          <Route path="/purchasing/*" element={<Navigate to="/purchasing" replace />} />
          <Route path="/budget-management" element={<BudgetManagementHome />} />
          <Route path="/budget" element={<Navigate to="/budget-management" replace />} />
          <Route path="/budget/department-overview" element={<DepartmentBudgetOverview />} />
          <Route path="/budget/adjustment-request" element={<BudgetAdjustmentRequest />} />
          <Route path="/budget/next-month-submission" element={<NextMonthBudgetSubmission />} />
          <Route path="/budget/finance-dashboard" element={<FinanceBudgetDashboard />} />
          <Route path="/budget/approval-queue" element={<BudgetApprovalQueue />} />
          <Route path="/finance" element={<FinanceHome />} />
          <Route path="/finance/invoice-approval" element={<FinanceInvoiceApproval />} />
          <Route path="/finance/payment-processing" element={<FinancePaymentProcessing />} />
          <Route path="/budget/*" element={<Navigate to="/budget-management" replace />} />
          <Route
            path="/budget-management/*"
            element={<Navigate to="/budget-management" replace />}
          />
          <Route path="/tracking-item" element={<TrackingItemManagement />} />
          <Route path="/supplier-overview" element={<SupplierFulfillmentHome />} />
          <Route
            path="/supplier-overview/inventory"
            element={<SupplierInventorySubmodule />}
          />
          <Route
            path="/supplier-overview/invoice"
            element={<SupplierInvoiceSubmodule />}
          />
          <Route
            path="/supplier-overview/invoice/:localId"
            element={<SupplierInvoiceSubmodule />}
          />
          <Route
            path="/supplier-overview/payment"
            element={<SupplierPaymentSubmodule />}
          />
          <Route
            path="/supplier-overview/delivery"
            element={<DeliverySubmodule />}
          />
          <Route
            path="/supplier-overview/delivery/:localId"
            element={<DeliveryDetailSubmodule />}
          />
          <Route
            path="/supplier-overview/order-acknowledgement"
            element={<OrderAcknowledgementSubmodule />}
          />
          <Route
            path="/supplier-overview/order-acknowledgement/:localId"
            element={<OrderAcknowledgementDetailSubmodule />}
          />
          <Route
            path="/supplier-overview/grn-status"
            element={<GoodsReceivedNoteStatusSubmodule />}
          />
          <Route
            path="/supplier-overview/grn-status/:localId"
            element={<GoodsReceivedNoteDetailSubmodule />}
          />
          <Route
            path="/supplier-overview/grn-status/:localId/create-delivery"
            element={<CreateDeliveryFromGrnSubmodule />}
          />
          <Route
            path="/supplier-overview/*"
            element={<Navigate to="/supplier-overview" replace />}
          />
          <Route
            path="/supplier-fulfillment/*"
            element={<Navigate to="/supplier-overview" replace />}
          />
          <Route path="/tracking-item/*" element={<Navigate to="/tracking-item" replace />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/ai-agents" element={<Navigate to="/chatbot" replace />} />
          <Route path="/settings" element={<SettingsHome />} />
          <Route
            path="/settings/company-address"
            element={<CompanyAddressSubmodule />}
          />
          <Route
            path="/settings/tax-information"
            element={<SupplierTaxInformationSubmodule />}
          />
          <Route path="/settings/payment-details" element={<SupplierPaymentDetailsSubmodule />} />
          <Route
            path="/settings/feedback"
            element={<FeedbackSubmodule />}
          />
          <Route
            path="/settings/ai-assistant"
            element={<AIAssistantRedesign />}
          />
          <Route
            path="/settings/ai-assistant/:slug"
            element={<SubAgentsPage />}
          />
          <Route
            path="/settings/*"
            element={<Navigate to="/settings" replace />}
          />
          <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
          <Route path="/" element={<Navigate to="/overview" replace />} />
          </Routes>
        </Suspense>
      </Content>
      </Layout>

      {/* ChatBot Widget - Global floating chatbot */}
      {sessionUser && role !== UserRole.SUPPLIER && !isChatbotPage && (
        <ChatBotWidget userId={sessionUser.id} />
      )}

      {/* Scroll Buttons - Only show on specific pages */}
      {(location.pathname.startsWith('/users-access') ||
        location.pathname.startsWith('/tracking-item')) && (
        <ScrollButtons containerId="main-content" />
      )}
    </Layout>
  );
}

export default function App(): React.ReactElement {
  return (
    <Router>
      <Suspense
        fallback={
          <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
            <Spin size="large" />
          </Flex>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
