import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, Col, Flex, Row, Typography } from "antd";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  DeploymentUnitOutlined,
  DollarOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import styles from "./CategorySelection.module.css";

const { Text } = Typography;

export default function CategorySelectionManagement(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("lookupTable");

  return (
    <Flex vertical gap={20} className={styles.wrap}>
      <Flex align="center" gap={8}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/settings")}
          style={{ paddingInline: 0 }}
          aria-label={t("page.backToSettings")}
        />
        <Text strong className={styles.pageHeading}>
          {t("page.title")}
        </Text>
      </Flex>
      <Row gutter={[20, 20]} className={styles.grid}>
        <Col xs={24} sm={12} lg={4}>
          <Card
            hoverable
            className={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate("/category-selection/item-categories")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/category-selection/item-categories");
              }
            }}
            aria-label={t("page.itemCategories")}
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <AppstoreOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  {t("page.itemCategories")}
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">{t("page.open")}</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            hoverable
            className={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate("/category-selection/units-of-measurement")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/category-selection/units-of-measurement");
              }
            }}
            aria-label={t("page.unitsOfMeasurement")}
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <DeploymentUnitOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  {t("page.unitsOfMeasurement")}
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">{t("page.open")}</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            hoverable
            className={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate("/category-selection/payment-terms")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/category-selection/payment-terms");
              }
            }}
            aria-label={t("page.paymentTerms")}
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <DollarOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  {t("page.paymentTerms")}
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">{t("page.open")}</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            hoverable
            className={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate("/category-selection/departments")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/category-selection/departments");
              }
            }}
            aria-label={t("page.departments")}
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <TeamOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  {t("page.departments")}
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">{t("page.open")}</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            hoverable
            className={styles.tile}
            role="button"
            tabIndex={0}
            onClick={() => navigate("/category-selection/roles")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/category-selection/roles");
              }
            }}
            aria-label={t("page.roles")}
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <SafetyCertificateOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  {t("page.roles")}
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">{t("page.open")}</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
}
