import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApartmentOutlined, FormOutlined, AuditOutlined, FundOutlined } from "@ant-design/icons";
import { getSessionUser } from "../../shared/auth/session";
import { UserRole, isFinanceRole } from "../../shared/types/roles";

import styles from "./BudgetManagementHome.module.css";

export default function BudgetManagementHome(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation(["budgetManagement", "common"]);
  const sessionUser = getSessionUser();
  const role = sessionUser?.role;

  const modules = [
    {
      key: "department-forecasting",
      title: t("budgetManagement:departmentBudgetForecasting"),
      description: t("budgetManagement:departmentForecastingDescription"),
      icon: <ApartmentOutlined className={`${styles.cardIcon} ${styles.departmentCardIcon}`} />,
      path: "/budget/department-overview",
    },
    {
      key: "adjustment-request",
      title: "Budget Adjustment Request",
      description: "Submit and track a request to adjust a department budget",
      icon: <FormOutlined className={styles.cardIcon} />,
      path: "/budget/adjustment-request",
      visible: role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.DEPARTMENT_EXECUTIVE,
    },
    {
      key: "approval-queue",
      title: "Budget Approval Queue",
      description: "Review pending budget adjustment requests",
      icon: <AuditOutlined className={styles.cardIcon} />,
      path: "/budget/approval-queue",
      visible: role === UserRole.ADMIN || role === UserRole.MANAGER || isFinanceRole(role),
    },
    {
      key: "finance-dashboard",
      title: "Finance Budget Dashboard",
      description: "Review budget allocation and department spending",
      icon: <FundOutlined className={styles.cardIcon} />,
      path: "/budget/finance-dashboard",
      visible: role === UserRole.ADMIN || role === UserRole.MANAGER || isFinanceRole(role),
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("budgetManagement:budgetManagement")}</h1>
      <p className={styles.subtitle}>{t("budgetManagement:homeDescription")}</p>

      <Row gutter={[24, 24]} className={styles.cardsRow}>
        {modules.filter((module) => module.visible !== false).map((module) => (
          <Col key={module.key} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className={styles.moduleCard}
              onClick={() => navigate(module.path)}
            >
              <div className={styles.cardContent}>
                {module.icon}
                <h3 className={styles.cardTitle}>{module.title}</h3>
                <p className={styles.cardDescription}>{module.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
