import React from "react";
import { Card, Flex, Tabs } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./userAccess.module.css";

export default function RbacSubmodule(): React.ReactElement {
  const { t } = useTranslation("userAccess");
  const navigate = useNavigate();
  const itemKey = "roles";

  return (
    <Card>
      <Flex vertical gap={12}>
        <Tabs
          activeKey={itemKey}
          onChange={() => navigate(`/users-access/rbac/roles`)}
          items={[
            { key: "roles", label: <span className={styles.noSelect}>{t("rbac.tabs.roles")}</span> },
          ]}
        />
        <Outlet />
      </Flex>
    </Card>
  );
}
