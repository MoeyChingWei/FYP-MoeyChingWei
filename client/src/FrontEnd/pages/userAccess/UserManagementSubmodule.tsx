import React from "react";
import { Card, Flex, Tabs } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./userAccess.module.css";

export default function UserManagementSubmodule(): React.ReactElement {
  const { t } = useTranslation("userAccess");
  const navigate = useNavigate();
  const location = useLocation();

  const parts = location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("users");
  const itemKey = idx >= 0 ? parts[idx + 1] ?? "list" : "list";

  return (
    <Card>
      <Flex vertical gap={12}>
        <Tabs
          activeKey={itemKey}
          onChange={(key) => navigate(`/users-access/users/${key}`)}
          items={[
            { key: "list", label: <span className={styles.noSelect}>{t("userManagement.tabs.userList")}</span> },
            { key: "create", label: <span className={styles.noSelect}>{t("userManagement.tabs.createUser")}</span> },
          ]}
        />
        <Outlet />
      </Flex>
    </Card>
  );
}
