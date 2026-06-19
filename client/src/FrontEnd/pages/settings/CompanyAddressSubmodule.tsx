import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Input, Typography, message } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getCompanyAddress,
  saveCompanyAddress,
} from "../../modules/settings/companyAddress";

import styles from "./Settings.module.css";

const { Paragraph, Title, Text } = Typography;

export default function CompanyAddressSubmodule(): React.ReactElement {
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const { t: tMsg } = useTranslation('messages');
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  useEffect(() => {
    setAddress(getCompanyAddress());
  }, []);

  const onSave = (): void => {
    saveCompanyAddress(address);
    message.success(tMsg('companyAddressUpdated'));
  };

  return (
    <Flex vertical gap={20} className={styles.detailWrap}>
      <Flex align="center" gap={8}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/settings")}
          style={{ paddingInline: 0 }}
          aria-label={tCommon('backToSettings')}
        />
        <Title level={4} className={styles.pageTitle}>
          {tSettings('companyAddress.title')}
        </Title>
      </Flex>

      <Card className={styles.detailCard}>
        <Flex vertical gap={16}>
          <Flex align="center" gap={10}>
            <div className={styles.iconWrap} aria-hidden>
              <EnvironmentOutlined className={styles.tileIcon} />
            </div>
            <div>
              <Text strong>{tSettings('companyAddress.label')}</Text>
              <Paragraph type="secondary" style={{ margin: "4px 0 0" }}>
                {tSettings('companyAddress.description')}
              </Paragraph>
            </div>
          </Flex>

          <Input.TextArea
            rows={4}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={tSettings('companyAddress.placeholder')}
          />

          <Flex justify="flex-end">
            <Button type="primary" onClick={onSave}>
              {tSettings('companyAddress.saveButton')}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
