import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { todayIsoDate } from "../../modules/purchasing/requestCreation/constants";
import {
  appendSupplierDelivery,
  createDeliveryFromGrnDiscrepancy,
  loadSupplierGrns,
  type SupplierGrnRecord,
} from "../../modules/supplierFulfillment/workflow";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";

import styles from "../purchasing/ApprovalDetailSubmodule.module.css";

const { Paragraph, Title } = Typography;

type DeliveryItemForm = {
  itemDescription: string;
  quantity: number;
  unitOfMeasurement: string;
  unitPrice: number;
};

type DeliveryFormValues = {
  items: DeliveryItemForm[];
};

function currencyLabel(currency: string, amount: number): string {
  return `${currency} ${amount.toFixed(2)}`;
}

export default function CreateDeliveryFromGrnSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const { localId } = useParams();
  const [rows, setRows] = useState<SupplierGrnRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [generatedDeliveryNo, setGeneratedDeliveryNo] = useState("");
  const [form] = Form.useForm<DeliveryFormValues>();
  const sessionUser = useMemo(() => getSessionUser(), []);

  useEffect(() => {
    const sync = (): void => {
      setRows(loadSupplierGrns());
    };
    const handleSync = (): void => {
      sync();
    };

    sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-grns", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-grns", handleSync);
    };
  }, []);

  const row = useMemo(() => rows.find((item) => item.localId === localId), [localId, rows]);
  useEffect(() => {
    if (!row) {
      setGeneratedDeliveryNo("");
      return;
    }
    setGeneratedDeliveryNo(createDeliveryFromGrnDiscrepancy(row).deliveryNo || "");
  }, [row?.localId]);

  useEffect(() => {
    if (!row) return;
    form.setFieldsValue({
      items: row.items.map((item) => ({
        itemDescription: item.itemDescription || "",
        quantity: item.quantity,
        unitOfMeasurement: item.unitOfMeasurement || "",
        unitPrice: item.unitPrice,
      })),
    });
  }, [form, row]);

  const onSubmit = async (): Promise<void> => {
    if (!row) return;
    try {
      setSaving(true);
      const values = await form.validateFields();
      const updatedItems: DraftLineItem[] = row.items.map((item, index) => {
        const formItem = values.items[index];
        return {
          ...item,
          itemDescription: String(formItem.itemDescription || "").trim(),
          quantity: Number(formItem.quantity),
          unitOfMeasurement: String(formItem.unitOfMeasurement || "").trim(),
          unitPrice: Number(formItem.unitPrice),
        };
      });

      const draftDelivery = createDeliveryFromGrnDiscrepancy({
        ...row,
        createdDate: todayIsoDate(),
        createdBy: sessionUser?.name?.trim() || sessionUser?.email || row.createdBy,
      }, generatedDeliveryNo);

      appendSupplierDelivery({
        ...draftDelivery,
        items: updatedItems,
      });

      message.success(t("grnStatus.createDelivery.messages.created", { deliveryNo: draftDelivery.deliveryNo || row.poNumber }));
      navigate("/supplier-overview/delivery");
    } catch {
      // antd form validation already shows details
    } finally {
      setSaving(false);
    }
  };

  if (!row) {
    return (
      <Card>
        <Empty description={t("grnStatus.createDelivery.messages.notFound")} />
      </Card>
    );
  }

  if (row.status !== "DISCREPANCY") {
    return (
      <Card>
        <Empty description={t("grnStatus.createDelivery.messages.onlyFromDiscrepancy")} />
      </Card>
    );
  }

  const total = row.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.header}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/supplier-overview/grn-status/${row.localId}`)}
              style={{ paddingInline: 0 }}
              aria-label={t("grnStatus.createDelivery.actions.back")}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t("grnStatus.createDelivery.title")}
            </Title>
          </Flex>
          <Tag color="orange">{t("grnStatus.createDelivery.status.pendingDelivery")}</Tag>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.createDelivery.summary.orderNumber")}</div>
            <div className={styles.summaryValue}>
              {generatedDeliveryNo}
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.createDelivery.summary.sourcePr")}</div>
            <div className={styles.summaryValue}>{row.sourcePrNumber}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.createDelivery.summary.items")}</div>
            <div className={styles.summaryValue}>{row.items.length}</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{t("grnStatus.createDelivery.summary.total")}</div>
            <div className={styles.summaryValue}>{currencyLabel(row.currency, total)}</div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>{t("grnStatus.createDelivery.info.title")}</h3>
          <Descriptions column={2} bordered size="middle">
            <Descriptions.Item label={t("grnStatus.createDelivery.info.sourcePr")}>{row.sourcePrNumber}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.createDelivery.info.originalOrderNo")}>{row.poNumber}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.createDelivery.info.purchaseRequester")}>{row.sourceRequester || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.createDelivery.info.supplier")}>{row.supplierName || row.supplierEmail || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.createDelivery.info.supplierEmail")}>{row.supplierEmail || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.createDelivery.info.department")}>{row.department || "-"}</Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.createDelivery.info.companyAddress")} span={2}>
              {row.companyAddress}
            </Descriptions.Item>
            <Descriptions.Item label={t("grnStatus.createDelivery.info.discrepancyReason")} span={2}>
              {row.discrepancyReason || "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div className={styles.itemsCard}>
          <h3 className={styles.sectionTitle}>{t("grnStatus.createDelivery.items.title")}</h3>
          <Paragraph type="secondary">
            {t("grnStatus.createDelivery.items.description")}
          </Paragraph>

          <Form form={form} layout="vertical">
            {row.items.map((item, index) => (
              <div key={item.tempId} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <div>
                    <div className={styles.itemIndex}>{t("grnStatus.createDelivery.items.item", { index: index + 1 })}</div>
                    <h4 className={styles.itemTitle}>{item.itemName}</h4>
                  </div>
                  <Tag>{item.itemCategory || t("common.uncategorized")}</Tag>
                </div>

                <Space direction="vertical" style={{ width: "100%" }} size={10}>
                  <Form.Item
                    label={t("grnStatus.createDelivery.items.fields.description")}
                    name={["items", index, "itemDescription"]}
                    rules={[{ required: true, message: t("grnStatus.createDelivery.items.validation.descriptionRequired") }]}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                  <Flex gap={12} wrap="wrap">
                    <Form.Item
                      label={t("grnStatus.createDelivery.items.fields.quantity")}
                      name={["items", index, "quantity"]}
                      rules={[{ required: true, message: t("grnStatus.createDelivery.items.validation.quantityRequired") }]}
                      style={{ minWidth: 160 }}
                    >
                      <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      label={t("grnStatus.createDelivery.items.fields.unit")}
                      name={["items", index, "unitOfMeasurement"]}
                      rules={[{ required: true, message: t("grnStatus.createDelivery.items.validation.unitRequired") }]}
                      style={{ minWidth: 160 }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={t("grnStatus.createDelivery.items.fields.unitPrice", { currency: row.currency })}
                      name={["items", index, "unitPrice"]}
                      rules={[{ required: true, message: t("grnStatus.createDelivery.items.validation.unitPriceRequired") }]}
                      style={{ minWidth: 200 }}
                    >
                      <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
                    </Form.Item>
                  </Flex>
                </Space>
              </div>
            ))}
          </Form>
        </div>

        <div className={styles.actionRow}>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => void onSubmit()}>
            {t("grnStatus.createDelivery.actions.submitNewDelivery")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
