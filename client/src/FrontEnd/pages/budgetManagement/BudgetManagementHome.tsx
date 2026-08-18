import React from "react";
import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApartmentOutlined, LineChartOutlined } from "@ant-design/icons";

import styles from "./BudgetManagementHome.module.css";

export default function BudgetManagementHome(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation(["budgetManagement", "common"]);

  const modules = [
    {
      key: "forecasting",
      title: t("budgetManagement:budgetForecasting"),
      description: t("budgetManagement:forecastingDescription"),
      icon: <LineChartOutlined className={styles.cardIcon} />,
      path: "/budget-management/forecasting",
    },
    {
      key: "department-forecasting",
      title: t("budgetManagement:departmentBudgetForecasting"),
      description: t("budgetManagement:departmentForecastingDescription"),
      icon: <ApartmentOutlined className={`${styles.cardIcon} ${styles.departmentCardIcon}`} />,
      path: "/budget/department-overview",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("budgetManagement:budgetManagement")}</h1>
      <p className={styles.subtitle}>{t("budgetManagement:homeDescription")}</p>

      <Row gutter={[24, 24]} className={styles.cardsRow}>
        {modules.map((module) => (
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
