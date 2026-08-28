import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined, DeleteOutlined, DollarOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Flex, Form, InputNumber, Row, Select, Switch, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { fetchSupplierTaxSettings, saveSupplierTaxSettings, type SupplierTaxRule, type SupplierTaxSettings, type SupplierTaxType } from "../../shared/api/supplierTaxSettings";
import { UserRole } from "../../shared/types/roles";
import { computeTaxBreakdown } from "../../modules/purchasing/requestCreation/constants";
import styles from "./Settings.module.css";

const { Paragraph, Text, Title } = Typography;
type TaxFormValues = Omit<SupplierTaxSettings, "supplierId" | "updatedAt">;
const EMPTY_SETTINGS: TaxFormValues = { taxApplies: false, taxType: "NO_TAX", taxRate: 0, taxRules: [{ taxType: "SALES_TAX", taxRate: 10 }] };
export default function SupplierTaxInformationSubmodule(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("settings");
  const sessionUser = getSessionUser();
  const supplierId = sessionUser?.id;
  const isSupplier = sessionUser?.role === UserRole.SUPPLIER;
  const [form] = Form.useForm<TaxFormValues>();
  const [saving, setSaving] = useState(false);
  const taxApplies = Form.useWatch("taxApplies", form) ?? false;
  const taxRules = (Form.useWatch("taxRules", form) ?? []) as SupplierTaxRule[];
  const taxOptions: Array<{ value: SupplierTaxType; label: string }> = [
    { value: "SALES_TAX", label: t("taxInformation.salesTax") },
    { value: "SERVICE_TAX", label: t("taxInformation.serviceTax") },
    { value: "OTHER", label: t("taxInformation.otherTax") },
  ];
  const taxLabel = (type: SupplierTaxType): string => taxOptions.find((option) => option.value === type)?.label ?? t("taxInformation.noTax");
  const preview = taxApplies ? (() => { const breakdown = computeTaxBreakdown(1000, taxRules); return { running: 1000 + breakdown.total, amounts: breakdown.amounts }; })() : { running: 1000, amounts: [] as number[] };

  useEffect(() => {
    if (!isSupplier || !supplierId) { navigate("/settings", { replace: true }); return; }
    void fetchSupplierTaxSettings([supplierId])
      .then((settings) => {
        const saved = settings.find((item) => item.supplierId === supplierId);
        const rules = saved?.taxRules?.length ? saved.taxRules : saved?.taxApplies ? [{ taxType: saved.taxType as Exclude<SupplierTaxType, "NO_TAX">, taxRate: saved.taxRate }] : EMPTY_SETTINGS.taxRules;
        form.setFieldsValue(saved ? { ...saved, taxRules: rules } : EMPTY_SETTINGS);
      })
      .catch((error: unknown) => { form.setFieldsValue(EMPTY_SETTINGS); message.error(error instanceof Error ? error.message : t("taxInformation.loadError")); });
  }, [form, isSupplier, navigate, supplierId, t]);

  const save = async (values: TaxFormValues): Promise<void> => {
    setSaving(true);
    try {
      const rules = values.taxApplies ? (values.taxRules ?? []).map((rule) => ({ taxType: rule.taxType, taxRate: Number(rule.taxRate) })) : [];
      const first = rules[0];
      await saveSupplierTaxSettings({ taxApplies: Boolean(values.taxApplies && rules.length), taxType: first?.taxType ?? "NO_TAX", taxRate: first?.taxRate ?? 0, taxRules: rules });
      message.success(t("taxInformation.saved"));
    } catch (error) { message.error(error instanceof Error ? error.message : t("taxInformation.saveError"));
    } finally { setSaving(false); }
  };

  return <Flex vertical gap={20} className={styles.detailWrap}>
    <Flex align="center" gap={8}><Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/settings")} style={{ paddingInline: 0 }} aria-label={t("taxInformation.backLabel")} /><Title level={4} className={styles.pageTitle}>{t("taxInformation.title")}</Title></Flex>
    <Alert type="info" showIcon message={t("taxInformation.notice")} />
    <Card className={styles.detailCard}><Flex vertical gap={18}>
      <Flex align="center" gap={10}><div className={styles.iconWrap} aria-hidden><DollarOutlined className={styles.tileIcon} /></div><div><Text strong>{t("taxInformation.defaultOrderTax")}</Text><Paragraph type="secondary" style={{ margin: "4px 0 0" }}>{t("taxInformation.description")}</Paragraph></div></Flex>
      <Form form={form} layout="vertical" initialValues={EMPTY_SETTINGS} onFinish={(values) => void save(values)}>
        <Form.Item name="taxApplies" label={t("taxInformation.taxApplies")} valuePropName="checked"><Switch checkedChildren={t("taxInformation.yes")} unCheckedChildren={t("taxInformation.no")} /></Form.Item>
        <Text strong>{t("taxInformation.taxes")}</Text>
        <Form.List name="taxRules">
          {(fields, { add, remove }) => <Flex vertical gap={8} style={{ marginTop: 8, marginBottom: 16 }}>
            {fields.map((field, index) => <Row gutter={12} align="middle" key={field.key}>
              <Col xs={24} md={9}><Form.Item name={[field.name, "taxType"]} rules={taxApplies ? [{ required: true, message: t("taxInformation.selectTaxTypeError") }] : []} style={{ marginBottom: 0 }}><Select disabled={!taxApplies} options={taxOptions} placeholder={t("taxInformation.selectTaxType")} /></Form.Item></Col>
              <Col xs={18} md={7}><Form.Item name={[field.name, "taxRate"]} rules={taxApplies ? [{ required: true, message: t("taxInformation.taxRateError") }] : []} style={{ marginBottom: 0 }}><InputNumber disabled={!taxApplies} min={0} max={100} precision={2} suffix="%" style={{ width: "100%" }} /></Form.Item></Col>
              <Col xs={6} md={8}><Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} disabled={!taxApplies || fields.length <= 1} aria-label={t("taxInformation.removeTax")} /></Col>
            </Row>)}
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ taxType: "SALES_TAX", taxRate: 0 })} disabled={!taxApplies}>{t("taxInformation.addTax")}</Button>
          </Flex>}
        </Form.List>
        <Text strong>{t("taxInformation.preview")}</Text><div className={styles.taxPreview}><span>{t("taxInformation.orderSubtotal")} <strong>RM 1,000.00</strong></span>{taxApplies && taxRules.length ? taxRules.map((rule, index) => <span key={`${rule.taxType}-${index}`}>{taxLabel(rule.taxType)} ({Number(rule.taxRate || 0).toFixed(2)}%)<strong>RM {(preview.amounts[index] ?? 0).toFixed(2)}</strong></span>) : <span>{t("taxInformation.noTax")}<strong>RM 0.00</strong></span>}<span className={styles.taxPreviewTotal}>{t("taxInformation.totalPayable")} <strong>RM {preview.running.toFixed(2)}</strong></span></div>
        <Flex align="center" gap={6} style={{ marginTop: 12 }}><InfoCircleOutlined /><Text type="secondary">{t("taxInformation.newRequestsOnly")}</Text></Flex>
        <Flex justify="flex-end" gap={8} style={{ marginTop: 20 }}><Button onClick={() => navigate("/settings")}>{t("actions.cancel")}</Button><Button type="primary" htmlType="submit" loading={saving}>{t("taxInformation.save")}</Button></Flex>
      </Form>
    </Flex></Card>
  </Flex>;
}
