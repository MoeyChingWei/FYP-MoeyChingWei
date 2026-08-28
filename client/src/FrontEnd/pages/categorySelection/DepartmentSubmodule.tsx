import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LookupKindTable from "./LookupKindTable";

export default function DepartmentSubmodule(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("lookupTable");

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/category-selection")}
            style={{ paddingInline: 0 }}
            aria-label={t("page.back")}
          />
          <span>{t("page.departments")}</span>
        </Flex>
      }
    >
      <LookupKindTable kind="DEPARTMENT" />
    </Card>
  );
}
