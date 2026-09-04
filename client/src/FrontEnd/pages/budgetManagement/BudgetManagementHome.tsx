import React from "react";
import { Card, Row, Col, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApartmentOutlined, ArrowRightOutlined, FundOutlined } from "@ant-design/icons";
import { getSessionUser } from "../../shared/auth/session";
import { canAccessFinanceModule } from "../../shared/types/roles";

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
      key: "finance-dashboard",
      title: t("budgetManagement:financeBudgetDashboard"),
      description: t("budgetManagement:financeDashboardDescription"),
      icon: <FundOutlined className={styles.cardIcon} />,
      path: "/budget/finance-dashboard",
      visible: canAccessFinanceModule(role, sessionUser?.department),
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Financial planning</span>
          <h1 className={styles.title}>{t("budgetManagement:budgetManagement")}</h1>
          <p className={styles.subtitle}>{t("budgetManagement:homeDescription")}</p>
        </div>
        <Tag className={styles.periodTag}>Planning workspace</Tag>
      </header>

      <Row gutter={[24, 24]} className={styles.cardsRow}>
        {modules.filter((module) => module.visible !== false).map((module) => (
          <Col key={module.key} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className={styles.moduleCard}
              onClick={() => navigate(module.path)}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  {module.icon}
                  <span className={styles.cardType}>{module.key === "department-forecasting" ? "Department" : "Finance"}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{module.title}</h3>
                  <p className={styles.cardDescription}>{module.description}</p>
                </div>
                <div className={styles.cardAction}>Open workspace <ArrowRightOutlined /></div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
