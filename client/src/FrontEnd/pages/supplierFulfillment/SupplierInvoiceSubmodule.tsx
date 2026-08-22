import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function SupplierInvoiceSubmodule(): React.ReactElement {
  const { t } = useTranslation("supplier");
  const navigate = useNavigate();

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/supplier-overview")}
            style={{ paddingInline: 0 }}
            aria-label={t("invoice.actions.back")}
          />
          <Title level={4} style={{ margin: 0 }}>
            {t("invoice.title")}
          </Title>
        </Flex>
      }
    >
      <Empty description={t("invoice.empty")} />
    </Card>
  );
}
