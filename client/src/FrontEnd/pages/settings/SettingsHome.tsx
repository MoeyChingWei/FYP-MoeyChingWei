import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Flex, message, Tag, Typography } from "antd";
import RightOutlined from "@ant-design/icons/RightOutlined";
import TagsOutlined from "@ant-design/icons/TagsOutlined";
import EnvironmentOutlined from "@ant-design/icons/EnvironmentOutlined";
import MessageOutlined from "@ant-design/icons/MessageOutlined";
import RobotOutlined from "@ant-design/icons/RobotOutlined";
import MailOutlined from "@ant-design/icons/MailOutlined";
import DollarOutlined from "@ant-design/icons/DollarOutlined";
import BankOutlined from "@ant-design/icons/BankOutlined";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";
import { API_ROOT } from "../../shared/api/base";
import axios from "axios";
import styles from "./Settings.module.css";

const { Title, Text } = Typography;

export default function SettingsHome(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("settings");
  const isSupplier = getSessionUser()?.role === UserRole.SUPPLIER;
  const companyAddressTitle = isSupplier
    ? t("sections.supplierCompanyAddress")
    : t("sections.companyAddress");
  const sessionUser = getSessionUser();
  const [gmailConnected, setGmailConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("gmail") !== "connected") return;
    message.success(t("gmail.connectedMessage"));
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    let cancelled = false;
    const email = String(sessionUser?.email || "").trim();
    if (!email) {
      setGmailConnected(false);
      return () => {
        cancelled = true;
      };
    }

    setGmailConnected(null);
    axios
      .get(`${API_ROOT}/gmail/status?email=${encodeURIComponent(email)}`)
      .then(({ data }) => {
        if (!cancelled) setGmailConnected(Boolean(data?.connected));
      })
      .catch(() => {
        if (!cancelled) setGmailConnected(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionUser?.email]);

  return (
    <Flex vertical gap={20} className={styles.wrap}>
      <div className={styles.settingsHero}>
        <Title level={3} className={styles.pageTitle}>{t("title")}</Title>
        <Text type="secondary" className={styles.pageDescription}>{t("description")}</Text>
      </div>

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
          aria-label={t("sections.categorySelection")}
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

        <Card className={styles.tile}>
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden>
              <MailOutlined className={styles.tileIcon} />
            </div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>
                {t("gmail.title")}
              </Text>
              <Text type="secondary" style={{ display: "block", marginTop: 6 }}>
                {t("gmail.description")}
              </Text>
              {gmailConnected !== null && (
                <Tag
                  color={gmailConnected ? "cyan" : "red"}
                  style={{ marginTop: 12, fontWeight: 600 }}
                >
                  {gmailConnected ? t("gmail.connected") : t("gmail.disconnected")}
                </Tag>
              )}
              {gmailConnected === false && (
                <Button
                  type="primary"
                  size="small"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    const email = encodeURIComponent(String(sessionUser?.email || "").trim());
                    window.location.assign(`${API_ROOT}/gmail/oauth/start?email=${email}`);
                  }}
                >
                  {t("gmail.title")}
                </Button>
              )}
            </div>
          </Flex>
        </Card>

        {isSupplier && <Card
          hoverable
          className={styles.tile}
          role="button"
          tabIndex={0}
          onClick={() => navigate("/settings/tax-information")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/settings/tax-information");
            }
          }}
          aria-label={t("taxInformation.title")}
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden><DollarOutlined className={styles.tileIcon} /></div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>{t("taxInformation.title")}</Text>
              <Text type="secondary" style={{ display: "block", marginTop: 6 }}>{t("taxInformation.tileDescription")}</Text>
              <Flex align="center" gap={6} className={styles.tileAction}><Text type="secondary">{t("actions.open")}</Text><RightOutlined className={styles.tileChevron} /></Flex>
            </div>
          </Flex>
        </Card>}

        {isSupplier && <Card
          hoverable
          className={styles.tile}
          role="button"
          tabIndex={0}
          onClick={() => navigate("/settings/payment-details")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/settings/payment-details");
            }
          }}
          aria-label={t("paymentDetails.title")}
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden><BankOutlined className={styles.tileIcon} /></div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>{t("paymentDetails.title")}</Text>
              <Text type="secondary" style={{ display: "block", marginTop: 6 }}>{t("paymentDetails.tileDescription")}</Text>
              <Flex align="center" gap={6} className={styles.tileAction}><Text type="secondary">{t("actions.open")}</Text><RightOutlined className={styles.tileChevron} /></Flex>
            </div>
          </Flex>
        </Card>}

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
          aria-label={companyAddressTitle}
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={styles.iconWrap} aria-hidden>
              <EnvironmentOutlined className={styles.tileIcon} />
            </div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>
                {companyAddressTitle}
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
          aria-label={t("sections.feedback")}
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

        {!isSupplier && <Card
          hoverable
          className={`${styles.tile} ${styles.aiAssistantTile}`}
          role="button"
          tabIndex={0}
          onClick={() => navigate("/settings/ai-assistant")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/settings/ai-assistant");
            }
          }}
          aria-label={t("sections.aiAssistant")}
        >
          <Flex vertical align="center" gap={14} className={styles.tileInner}>
            <div className={`${styles.iconWrap} ${styles.aiAssistantIconWrap}`} aria-hidden>
              <RobotOutlined className={`${styles.tileIcon} ${styles.aiAssistantIcon}`} />
            </div>
            <div className={styles.tileTextBlock}>
              <Text strong className={styles.tileTitle}>
                {t("sections.aiAssistant")}
              </Text>
              <Flex align="center" gap={6} className={styles.tileAction}>
                <Text type="secondary">{t("actions.manage")}</Text>
                <RightOutlined className={`${styles.tileChevron} ${styles.aiAssistantChevron}`} />
              </Flex>
            </div>
          </Flex>
        </Card>}
      </Flex>
    </Flex>
  );
}
