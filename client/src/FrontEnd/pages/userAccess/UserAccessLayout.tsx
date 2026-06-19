import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flex, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import AnimatedOutlet from "../../shared/components/AnimatedOutlet";

const TAB_KEYS = ["users", "rbac"] as const;
type TabKey = (typeof TAB_KEYS)[number];

function tabKeyFromPath(pathname: string): TabKey {
  const parts = pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("users-access");
  const key = idx >= 0 ? parts[idx + 1] : undefined;
  if (key && TAB_KEYS.includes(key as TabKey)) return key as TabKey;
  return "users";
}

export default function UserAccessLayout(): React.ReactElement {
  const { t } = useTranslation("userAccess");
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = tabKeyFromPath(location.pathname);

  return (
    <Flex vertical gap={16}>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => navigate(`/users-access/${key}`)}
        items={[
          {
            key: "users",
            label: t("layout.tabs.userManagement"),
          },
          {
            key: "rbac",
            label: t("layout.tabs.rbac"),
          },
        ]}
      />

      <AnimatedOutlet />
    </Flex>
  );
}
