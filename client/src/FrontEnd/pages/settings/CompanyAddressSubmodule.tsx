import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Flex, Input, Typography, message } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, EnvironmentOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  getCompanyAddress,
  getCompanyLogo,
  getCompanyName,
  getSupplierCompanyLogo,
  getSupplierCompanyName,
  getSupplierCompanyAddress,
  saveCompanyName,
  saveCompanyAddress,
  saveCompanyLogo,
  saveSupplierCompanyLogo,
  saveSupplierCompanyName,
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
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCompanyName(isSupplier && supplierId ? getSupplierCompanyName(supplierId) : getCompanyName());
    setAddress(isSupplier && supplierId ? getSupplierCompanyAddress(supplierId) : getCompanyAddress());
    setLogo(isSupplier && supplierId ? getSupplierCompanyLogo(supplierId) : getCompanyLogo());
  }, [isSupplier, supplierId]);

  const onLogoSelected = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      message.error("Logo must be 2 MB or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setLogo(reader.result);
    };
    reader.onerror = () => message.error("Unable to read the logo file");
    reader.readAsDataURL(file);
  };

  const onSave = (): void => {
    const normalizedName = companyName.trim();
    const normalizedAddress = address.trim();
    if (!normalizedName || !normalizedAddress) {
      message.error("Enter both the company name and address");
      return;
    }
    if (isSupplier && supplierId) {
      saveSupplierCompanyName(supplierId, normalizedName);
      saveSupplierCompanyAddress(supplierId, normalizedAddress);
      saveSupplierCompanyLogo(supplierId, logo);
    } else {
      saveCompanyName(normalizedName);
      saveCompanyAddress(normalizedAddress);
      saveCompanyLogo(logo);
    }
    message.success(tMsg('companyAddressUpdated'));
  };

  const title = isSupplier
    ? tSettings('companyAddress.supplierTitle')
    : tSettings('companyAddress.title');
  const label = isSupplier
    ? tSettings('companyAddress.supplierLabel')
    : tSettings('companyAddress.label');
  const nameLabel = isSupplier
    ? tSettings('companyAddress.supplierNameLabel')
    : tSettings('companyAddress.nameLabel');
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

          <Text strong>{nameLabel}</Text>
          <Input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder={isSupplier ? tSettings('companyAddress.supplierNamePlaceholder') : tSettings('companyAddress.namePlaceholder')}
            aria-label={nameLabel}
          />

          <Flex vertical gap={8}>
            <Text strong>{tSettings('companyAddress.logoLabel')}</Text>
            <Flex align="center" gap={12} wrap="wrap">
              {logo ? (
                <img
                  src={logo}
                  alt={nameLabel}
                  style={{ width: 96, height: 64, objectFit: "contain", border: "1px solid #d9d9d9", borderRadius: 6, background: "#fff" }}
                />
              ) : null}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={onLogoSelected}
                style={{ display: "none" }}
              />
              <Button icon={<UploadOutlined />} onClick={() => logoInputRef.current?.click()}>
                {tSettings('companyAddress.uploadLogo')}
              </Button>
              {logo ? (
                <Button icon={<DeleteOutlined />} danger onClick={() => setLogo("")}>
                  {tSettings('companyAddress.removeLogo')}
                </Button>
              ) : null}
            </Flex>
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
