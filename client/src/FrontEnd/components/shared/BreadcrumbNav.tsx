import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import styles from "./BreadcrumbNav.module.css";

type BreadcrumbItem = {
  title: string | React.ReactNode;
};

const routeNameMap: Record<string, string> = {
  overview: "Overview",
  dashboard: "Dashboard",
  "users-access": "Users & Access",
  users: "User Management",
  list: "User List",
  create: "Create User",
  rbac: "Role Management",
  roles: "Roles",
  purchasing: "Purchasing",
  creation: "Create Request",
  review: "Review",
  approval: "Approval",
  "po-creation": "Create Order",
  "po-review": "Order Review",
  "po-approval": "Order Approval",
  delivery: "Delivery",
  "goods-received-note": "Goods Received Note",
  "supplier-overview": "Supplier Overview",
  invoice: "Supplier Invoice",
  "order-acknowledgement": "Order Acknowledgement",
  "grn-status": "GRN Status",
  "tracking-item": "Tracking Item",
  settings: "Settings",
  "category-selection": "Category Management",
  "item-categories": "Item Categories",
  "units-of-measurement": "Units of Measurement",
  "payment-terms": "Payment Terms",
  "company-address": "Company Address",
  "budget-management": "Budget Management",
  budget: "Budget Management",
  "department-overview": "Department Budget Forecasting",
  "adjustment-request": "Budget Adjustment Request",
  "finance-dashboard": "Finance Budget Dashboard",
  finance: "Finance",
  "invoice-approval": "Supplier Invoice Approval",
  "approval-queue": "Budget Approval Queue",
  feedback: "Feedback",
  profile: "Profile",
  "reset-password": "Reset Password",
};

export default function BreadcrumbNav(): React.ReactElement {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      title: (
        <Link to="/overview">
          <HomeOutlined />
        </Link>
      ),
    },
  ];

  pathSnippets.forEach((snippet, index) => {
    const rawUrl = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    // The budget landing page is named differently from its child routes.
    const url = rawUrl === "/budget" ? "/budget-management" : rawUrl;
    const isLast = index === pathSnippets.length - 1;
    const title = routeNameMap[snippet] || snippet;

    // Adjustment requests and approvals are submodules of the department
    // forecasting page, rather than separate top-level budget modules.
    const isDepartmentForecastingSubmodule =
      index === 1 &&
      pathSnippets[0] === "budget" &&
      ["adjustment-request", "approval-queue"].includes(snippet);
    if (isDepartmentForecastingSubmodule) {
      breadcrumbItems.push({
        title: (
          <Link to="/budget/department-overview">
            Department Budget Forecasting
          </Link>
        ),
      });
    }

    if (!isLast) {
      breadcrumbItems.push({
        title: <Link to={url}>{title}</Link>,
      });
    } else {
      breadcrumbItems.push({
        title: title,
      });
    }
  });

  if (pathSnippets.length === 0) {
    return <div className={styles.breadcrumb}></div>;
  }

  return (
    <div className={styles.breadcrumb}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
}
