import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export default function PurchasingDeliverySubmodule(): React.ReactElement {
  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/purchasing")}
            style={{ paddingInline: 0 }}
            aria-label={t('common.back')}
          />
          <span>{t('delivery.title')}</span>
        </Flex>
      }
    >
      <Flex vertical gap={12}>
        <Text type="secondary">
          {t('delivery.description')}
        </Text>
      </Flex>
    </Card>
  );
}

