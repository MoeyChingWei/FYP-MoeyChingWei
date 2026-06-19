import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Flex, Typography } from "antd";
import RightOutlined from "@ant-design/icons/RightOutlined";
import TagsOutlined from "@ant-design/icons/TagsOutlined";
import EnvironmentOutlined from "@ant-design/icons/EnvironmentOutlined";
import MessageOutlined from "@ant-design/icons/MessageOutlined";
import RobotOutlined from "@ant-design/icons/RobotOutlined";
import { useTranslation } from "react-i18next";

import styles from "./Settings.module.css";

const { Title, Text } = Typography;

export default function SettingsHome(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("settings");

  return (
    <Flex vertical gap={20} className={styles.wrap}>
      <Title level={4} className={styles.pageTitle}>
        {t("title")}
      </Title>

      <Flex wrap="wrap" gap={20} className={styles.tilesGrid}>
        <Card
          hoverable
          className={styles.tile}
          role="button"
          tabIndex={0}
          onClick={() => navigate("/category-selection")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/category-selection");
            }
          }}
          aria-label="Open category of selection"
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden>
              <TagsOutlined className={styles.tileIcon} />
            </div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>
                {t("sections.categorySelection")}
              </Text>
              <Flex align="center" gap={6} className={styles.tileAction}>
                <Text type="secondary">{t("actions.open")}</Text>
                <RightOutlined className={styles.tileChevron} />
              </Flex>
            </div>
          </Flex>
        </Card>

        <Card
          hoverable
          className={styles.tile}
          role="button"
          tabIndex={0}
          onClick={() => navigate("/settings/company-address")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/settings/company-address");
            }
          }}
          aria-label="Open company address"
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden>
              <EnvironmentOutlined className={styles.tileIcon} />
            </div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>
                {t("sections.companyAddress")}
              </Text>
              <Flex align="center" gap={6} className={styles.tileAction}>
                <Text type="secondary">{t("actions.open")}</Text>
                <RightOutlined className={styles.tileChevron} />
              </Flex>
            </div>
          </Flex>
        </Card>

        <Card
          hoverable
          className={styles.tile}
          role="button"
          tabIndex={0}
          onClick={() => navigate("/settings/feedback")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/settings/feedback");
            }
          }}
          aria-label="Open feedback"
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden>
              <MessageOutlined className={styles.tileIcon} />
            </div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>
                {t("sections.feedback")}
              </Text>
              <Flex align="center" gap={6} className={styles.tileAction}>
                <Text type="secondary">{t("actions.open")}</Text>
                <RightOutlined className={styles.tileChevron} />
              </Flex>
            </div>
          </Flex>
        </Card>

        <Card
          hoverable
          className={styles.tile}
          role="button"
          tabIndex={0}
          onClick={() => navigate("/settings/ai-assistant")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/settings/ai-assistant");
            }
          }}
          aria-label="Manage AI Assistant"
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden>
              <RobotOutlined className={styles.tileIcon} />
            </div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>
                {t("sections.aiAssistant")}
              </Text>
              <Flex align="center" gap={6} className={styles.tileAction}>
                <Text type="secondary">{t("actions.manage")}</Text>
                <RightOutlined className={styles.tileChevron} />
              </Flex>
            </div>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
