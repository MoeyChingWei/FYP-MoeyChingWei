import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, BankOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Flex, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { getSupplierBankDetails, saveSupplierBankDetails, type SupplierBankDetails } from "../../shared/api/supplierFinance";
import { UserRole } from "../../shared/types/roles";
import styles from "./Settings.module.css";

const { Paragraph, Text, Title } = Typography;

export default function SupplierPaymentDetailsSubmodule(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("settings");
  const sessionUser = getSessionUser();
  const isSupplier = sessionUser?.role === UserRole.SUPPLIER;
  const [form] = Form.useForm<SupplierBankDetails>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupplier) { navigate("/settings", { replace: true }); return; }
    void getSupplierBankDetails().then((details) => form.setFieldsValue(details)).catch((error: unknown) => {
      message.error(error instanceof Error ? error.message : t("paymentDetails.loadError"));
    });
  }, [form, isSupplier, navigate, t]);

  const save = async (values: SupplierBankDetails): Promise<void> => {
    setSaving(true);
    try { await saveSupplierBankDetails(values); message.success(t("paymentDetails.saved")); }
    catch (error) { message.error(error instanceof Error ? error.message : t("paymentDetails.saveError")); }
    finally { setSaving(false); }
  };

  return <Flex vertical gap={20} className={styles.detailWrap}>
    <Flex align="center" gap={8}><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/settings")} style={{ paddingInline: 0 }} aria-label={t("paymentDetails.backLabel")} /><Title level={4} className={styles.pageTitle}>{t("paymentDetails.title")}</Title></Flex>
    <Alert type="info" showIcon message={t("paymentDetails.description")} />
    <Card className={styles.detailCard}><Flex vertical gap={18}>
      <Flex align="center" gap={10}><div className={styles.iconWrap} aria-hidden><BankOutlined className={styles.tileIcon} /></div><div><Text strong>{t("paymentDetails.title")}</Text><Paragraph type="secondary" style={{ margin: "4px 0 0" }}>{t("paymentDetails.description")}</Paragraph></div></Flex>
      <Form form={form} layout="vertical" onFinish={(values) => void save(values)}>
        <Form.Item name="bankName" label={t("paymentDetails.bankName")}><Input maxLength={120} /></Form.Item>
        <Form.Item name="accountName" label={t("paymentDetails.accountName")}><Input maxLength={120} /></Form.Item>
        <Form.Item name="accountNumber" label={t("paymentDetails.accountNumber")} rules={[{ pattern: /^[A-Za-z0-9 -]*$/, message: t("paymentDetails.accountNumberRule") }]}><Input maxLength={50} /></Form.Item>
        <Flex align="center" gap={6}><InfoCircleOutlined /><Text type="secondary">{t("paymentDetails.description")}</Text></Flex>
        <Flex justify="flex-end" gap={8} style={{ marginTop: 20 }}><Button onClick={() => navigate("/settings")}>{t("actions.cancel")}</Button><Button type="primary" htmlType="submit" loading={saving}>{t("paymentDetails.save")}</Button></Flex>
      </Form>
    </Flex></Card>
  </Flex>;
}
