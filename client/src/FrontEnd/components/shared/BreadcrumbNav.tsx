import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import styles from "./BreadcrumbNav.module.css";

type BreadcrumbItem = {
  title: string | React.ReactNode;
  path?: string;
};

const routeNameMap: Record<string, string> = {
  overview: "Overview",
  dashboard: "Dashboard",
  "users-access": "Users & Access",
  users: "User Management",
  list: "User List",
  create: "Create User",
  "supplier-types": "Supplier Types",
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
  "order-acknowledgement": "Order Acknowledgement",
  "grn-status": "GRN Status",
  "tracking-item": "Tracking Item",
  settings: "Settings",
  "category-selection": "Category Management",
  "item-categories": "Item Categories",
  "units-of-measurement": "Units of Measurement",
  "company-address": "Company Address",
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
      path: "/overview",
    },
  ];

  pathSnippets.forEach((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSnippets.length - 1;
    const title = routeNameMap[snippet] || snippet;

    if (!isLast) {
      breadcrumbItems.push({
        title: <Link to={url}>{title}</Link>,
        path: url,
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
