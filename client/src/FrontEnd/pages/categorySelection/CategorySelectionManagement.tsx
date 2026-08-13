import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Flex, Row, Typography } from "antd";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  DeploymentUnitOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import styles from "./CategorySelection.module.css";

const { Text } = Typography;

export default function CategorySelectionManagement(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <Flex vertical gap={20} className={styles.wrap}>
      <Flex align="center" gap={8}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/settings")}
          style={{ paddingInline: 0 }}
          aria-label="Back to Settings"
        />
        <Text strong className={styles.pageHeading}>
          Category of Selection
        </Text>
      </Flex>
      <Row gutter={[20, 20]} className={styles.grid}>
        <Col xs={24} sm={12} lg={10}>
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
            aria-label="Open item categories"
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <AppstoreOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  Item categories
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">Open</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={10}>
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
            aria-label="Open units of measurement"
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <DeploymentUnitOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  Units of measurement
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">Open</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={10}>
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
            aria-label="Open departments"
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <TeamOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  Departments
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">Open</Text>
                  <RightOutlined className={styles.tileChevron} />
                </Flex>
              </div>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={10}>
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
            aria-label="Open roles"
          >
            <Flex vertical align="center" gap={14} className={styles.tileInner}>
              <div className={styles.iconWrap} aria-hidden>
                <SafetyCertificateOutlined className={styles.tileIcon} />
              </div>
              <div className={styles.tileTextBlock}>
                <Text strong className={styles.tileTitle}>
                  Roles
                </Text>
                <Flex align="center" gap={6} className={styles.tileAction}>
                  <Text type="secondary">Open</Text>
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
