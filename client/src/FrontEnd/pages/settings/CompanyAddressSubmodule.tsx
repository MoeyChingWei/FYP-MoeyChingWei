import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Input, Typography, message } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getCompanyAddress,
  getSupplierCompanyAddress,
  saveCompanyAddress,
  saveSupplierCompanyAddress,
} from "../../modules/settings/companyAddress";
import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";

import styles from "./Settings.module.css";

const { Paragraph, Title, Text } = Typography;

export default function CompanyAddressSubmodule(): React.ReactElement {
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const { t: tMsg } = useTranslation('messages');
  const navigate = useNavigate();
  const sessionUser = getSessionUser();
  const isSupplier = sessionUser?.role === UserRole.SUPPLIER;
  const supplierId = sessionUser?.id;
  const [address, setAddress] = useState("");

  useEffect(() => {
    setAddress(isSupplier && supplierId ? getSupplierCompanyAddress(supplierId) : getCompanyAddress());
  }, [isSupplier, supplierId]);

  const onSave = (): void => {
    const normalizedAddress = address.trim();
    if (!normalizedAddress) {
      message.error("Enter a company address");
      return;
    }
    if (isSupplier && supplierId) {
      saveSupplierCompanyAddress(supplierId, normalizedAddress);
    } else {
      saveCompanyAddress(normalizedAddress);
    }
    message.success(tMsg('companyAddressUpdated'));
  };

  const title = isSupplier
    ? tSettings('companyAddress.supplierTitle')
    : tSettings('companyAddress.title');
  const label = isSupplier
    ? tSettings('companyAddress.supplierLabel')
    : tSettings('companyAddress.label');
  const description = isSupplier
    ? tSettings('companyAddress.supplierDescription')
    : tSettings('companyAddress.description');
  const placeholder = isSupplier
    ? tSettings('companyAddress.supplierPlaceholder')
    : tSettings('companyAddress.placeholder');

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
          {title}
        </Title>
      </Flex>

      <Card className={styles.detailCard}>
        <Flex vertical gap={16}>
          <Flex align="center" gap={10}>
            <div className={styles.iconWrap} aria-hidden>
              <EnvironmentOutlined className={styles.tileIcon} />
            </div>
            <div>
              <Text strong>{label}</Text>
              <Paragraph type="secondary" style={{ margin: "4px 0 0" }}>
                {description}
              </Paragraph>
            </div>
          </Flex>

          <Input.TextArea
            rows={4}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={placeholder}
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
