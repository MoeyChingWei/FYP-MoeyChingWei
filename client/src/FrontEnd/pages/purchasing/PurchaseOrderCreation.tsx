import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CalculatorOutlined,
  ClearOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import CreatableLookupSelect from "../../components/purchasing/CreatableLookupSelect";
import { getSessionUser } from "../../shared/auth/session";
import {
  computeAmountAfterTax,
  computeTaxAmount,
  taxRateForCodes,
  todayIsoDate,
} from "../../modules/purchasing/requestCreation/constants";
import type { DraftLineItem } from "../../modules/purchasing/requestCreation/types";
import {
  appendPurchaseOrderDraft,
  generatePoNumber,
  loadPurchaseOrderDrafts,
  replacePurchaseOrderDraft,
} from "../../modules/purchasing/purchaseOrder/storage";
import type { PurchaseOrderDraft } from "../../modules/purchasing/purchaseOrder/types";
import { getCompanyLogo } from "../../modules/settings/companyAddress";
import type { PurchaseOrderStatus } from "../../modules/purchasing/types";

import creationStyles from "./CreationSubmodule.module.css";

const { Text } = Typography;

const DEFAULT_CURRENCY = "MYR";

type LineItemFormRow = {
  itemName?: string;
  itemDescription?: string;
  itemCategory?: string;
  supplierName?: string;
  supplierEmail?: string;
  quantity?: number;
  unitOfMeasurement?: string;
  estimatedUnitPrice?: number;
  taxType?: string;
  taxRate?: number;
};

type FormValues = {
  sourcePrNumber?: string;
  sourceRequester?: string;
  paymentTerms?: string;
  lineItems: LineItemFormRow[];
};

function newTempId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `tmp-${Date.now()}`;
}

function emptyLineRow(): LineItemFormRow {
  return {};
}

function LineRowTotal({ index }: { index: number }): React.ReactElement {
  const form = Form.useFormInstance();
  const q = Form.useWatch(["lineItems", index, "quantity"], form);
  const p = Form.useWatch(["lineItems", index, "estimatedUnitPrice"], form);
  const taxRate = Form.useWatch(["lineItems", index, "taxRate"], form);
  const total = computeAmountAfterTax(q, p, taxRate);

  return (
    <InputNumber
      readOnly
      value={total}
      prefix={DEFAULT_CURRENCY}
      style={{
        width: "100%",
        backgroundColor: "var(--ant-color-fill-quaternary, #fafafa)",
      }}
      formatter={(v) =>
        v != null && !Number.isNaN(Number(v)) ? Number(v).toFixed(2) : "0.00"
      }
    />
  );
}

export default function PurchaseOrderCreation(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const { localId } = useParams();
  const [form] = Form.useForm<FormValues>();
  const [sessionUser, setSessionUser] = useState(() => getSessionUser());
  const [poNumber, setPoNumber] = useState(() => generatePoNumber());
  const [createdDate, setCreatedDate] = useState(() => todayIsoDate());
  const [editingDraft, setEditingDraft] = useState<PurchaseOrderDraft | null>(null);

  useEffect(() => {
    setSessionUser(getSessionUser());
  }, []);

  useEffect(() => {
    if (!localId) {
      setEditingDraft(null);
      return;
    }

    const foundDraft = loadPurchaseOrderDrafts().find(
      (draft) => draft.localId === localId,
    );

    if (!foundDraft) {
      message.warning(t('purchaseOrder.creation.messages.draftNotFound'));
      navigate("/purchasing/po-review");
      return;
    }

    setEditingDraft(foundDraft);
    setPoNumber(foundDraft.poNumber);
    setCreatedDate(foundDraft.createdDate);
    form.setFieldsValue({
      sourcePrNumber: foundDraft.sourcePrNumber,
      sourceRequester: foundDraft.sourceRequester,
      paymentTerms: foundDraft.paymentTerms,
      lineItems: foundDraft.lineItems.map((item) => ({
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemCategory: item.itemCategory,
        supplierName: item.supplierName,
        supplierEmail: item.supplierEmail,
        quantity: item.quantity,
        unitOfMeasurement: item.unitOfMeasurement,
        estimatedUnitPrice: item.unitPrice,
        taxType: item.taxType,
        taxRate: item.taxRate,
      })),
    });
  }, [form, localId, navigate]);

  const createdBy = useMemo(
    () => sessionUser?.name?.trim() || sessionUser?.email || "-",
    [sessionUser],
  );
  const department = useMemo(() => {
    const d = sessionUser?.department;
    if (d == null || String(d).trim() === "") return "-";
    return String(d);
  }, [sessionUser]);

  const lineItemsWatch = Form.useWatch("lineItems", form) as
    | LineItemFormRow[]
    | undefined;

  const orderTotal = useMemo(() => {
    if (!lineItemsWatch?.length) return 0;
    return lineItemsWatch.reduce(
      (sum, row) => sum + computeAmountAfterTax(row?.quantity, row?.estimatedUnitPrice, row?.taxRate),
      0,
    );
  }, [lineItemsWatch]);

  const recalcOrderTotal = (): void => {
    const rows =
      (form.getFieldValue("lineItems") as LineItemFormRow[] | undefined) ?? [];
    const total = rows.reduce(
      (sum, row) => sum + computeAmountAfterTax(row?.quantity, row?.estimatedUnitPrice, row?.taxRate),
      0,
    );
    message.info(t('purchaseOrder.creation.messages.totalCalculated', { currency: DEFAULT_CURRENCY, total: total.toFixed(2) }));
  };

  const persistOrder = async (
    status: PurchaseOrderStatus,
    successMsg: string,
  ): Promise<void> => {
    await form.validateFields();
    const rows =
      (form.getFieldValue("lineItems") as LineItemFormRow[] | undefined) ?? [];
    const sourcePrNumber = String(form.getFieldValue("sourcePrNumber") ?? "").trim();
    const sourceRequester = String(form.getFieldValue("sourceRequester") ?? "").trim();

    if (rows.length < 1) {
      message.warning(t('purchaseOrder.creation.form.validation.atLeastOneItem'));
      return;
    }

    const lineItems: DraftLineItem[] = rows.map((row) => ({
      tempId: newTempId(),
      itemName: String(row.itemName ?? "").trim(),
      itemDescription: String(row.itemDescription ?? "").trim(),
      itemCategory: String(row.itemCategory ?? "").trim(),
      supplierName: String(row.supplierName ?? "").trim() || undefined,
      supplierEmail: String(row.supplierEmail ?? "").trim() || undefined,
      quantity: Number(row.quantity),
      unitOfMeasurement: String(row.unitOfMeasurement ?? "").trim(),
      unitPrice: Number(row.estimatedUnitPrice),
      taxType: String(row.taxType ?? "").trim() || undefined,
      taxRate: Number.isFinite(Number(row.taxRate))
        ? Number(row.taxRate)
        : taxRateForCodes(row.taxType),
      taxAmount: computeTaxAmount(
        row.quantity,
        row.estimatedUnitPrice,
        Number.isFinite(Number(row.taxRate)) ? Number(row.taxRate) : taxRateForCodes(row.taxType),
      ),
      amountAfterTax: computeAmountAfterTax(
        row.quantity,
        row.estimatedUnitPrice,
        Number.isFinite(Number(row.taxRate)) ? Number(row.taxRate) : taxRateForCodes(row.taxType),
      ),
    }));

    const draft: PurchaseOrderDraft = {
      localId: editingDraft?.localId ?? newTempId(),
      poNumber,
      sourceRequestLocalId: editingDraft?.sourceRequestLocalId ?? "",
      sourcePrNumber,
      sourceRequester: sourceRequester || undefined,
      createdDate,
      createdBy: editingDraft?.createdBy ?? createdBy,
      createdByUserId: editingDraft?.createdByUserId ?? sessionUser?.id,
      createdByEmail: editingDraft?.createdByEmail ?? sessionUser?.email,
      department: department === "-" ? undefined : department,
      companyLogo: getCompanyLogo(),
      currency: DEFAULT_CURRENCY,
      status,
      lineItems,
      paymentTerms: editingDraft?.paymentTerms,
      requesterRole: editingDraft?.requesterRole ?? sessionUser?.role ?? "EMPLOYEE",
    };

    if (editingDraft) {
      replacePurchaseOrderDraft(editingDraft.localId, draft);
      message.success(
        status === "DRAFT"
          ? t('purchaseOrder.creation.messages.draftUpdated')
          : t('purchaseOrder.creation.messages.updatedAndSubmitted'),
      );
    } else {
      appendPurchaseOrderDraft(draft);
      message.success(successMsg);
      form.setFieldsValue({
        sourcePrNumber: "",
        sourceRequester: "",
        paymentTerms: undefined,
        lineItems: [emptyLineRow()],
      });
    }
  };

  const onSaveDraft = async (): Promise<void> => {
    try {
      await persistOrder("DRAFT", t('purchaseOrder.creation.messages.draftSaved'));
      navigate("/purchasing/po-review");
    } catch {
      /* validation only */
    }
  };

  const onSubmit = async (): Promise<void> => {
    try {
      await persistOrder("SUBMITTED", t('purchaseOrder.creation.messages.submitted'));
      navigate("/purchasing/po-review");
    } catch {
      /* validation only */
    }
  };

  const autoFieldStyle: React.CSSProperties = {
    backgroundColor: "var(--ant-color-fill-quaternary, #fafafa)",
    cursor: "default",
  };

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              navigate(
                editingDraft
                  ? `/purchasing/po-review/${editingDraft.localId}`
                  : "/purchasing/po-review",
              )
            }
            style={{ paddingInline: 0 }}
            aria-label={t('purchaseOrder.creation.actions.back')}
          />
          <span>{editingDraft ? t('purchaseOrder.creation.editTitle') : t('purchaseOrder.creation.title')}</span>
        </Flex>
      }
    >
      <Flex vertical gap={16}>
        <Row gutter={[16, 8]}>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseOrder.creation.form.poNumber')}</Text>
            <Input readOnly value={poNumber} style={autoFieldStyle} />
          </Col>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseOrder.creation.form.createdDate')}</Text>
            <Input readOnly value={createdDate} style={autoFieldStyle} />
          </Col>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseOrder.creation.form.createdBy')}</Text>
            <Input readOnly value={createdBy} style={autoFieldStyle} />
          </Col>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseOrder.creation.form.department')}</Text>
            <Input readOnly value={department} style={autoFieldStyle} />
          </Col>
        </Row>

        <Divider titlePlacement="left">{t('purchaseOrder.creation.form.poDetails')}</Divider>

        <Form<FormValues>
          form={form}
          layout="vertical"
          initialValues={{
            sourcePrNumber: "",
            paymentTerms: undefined,
            lineItems: [emptyLineRow()],
          }}
        >
          <Form.Item name="paymentTerms" hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={t('purchaseOrder.creation.form.sourcePrNumber')}
                name="sourcePrNumber"
                rules={[{ required: true, message: t('purchaseOrder.creation.form.validation.sourcePrNumberRequired') }]}
              >
                <Input placeholder={t('purchaseOrder.creation.form.placeholders.sourcePrNumber')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={t('purchaseOrder.creation.form.prRequester')} name="sourceRequester">
                <Input placeholder={t('purchaseOrder.creation.form.placeholders.prRequester')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="lineItems">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    className={creationStyles.itemDetailCard}
                    title={t('purchaseOrder.creation.form.poItem', { index: index + 1 })}
                    extra={
                      <Space size="small" wrap>
                        <Button
                          type="link"
                          size="small"
                          icon={<ClearOutlined />}
                          onClick={() => {
                            form.setFieldValue(["lineItems", field.name], emptyLineRow());
                          }}
                        >
                          {t('purchaseOrder.creation.actions.clearAll')}
                        </Button>
                        {fields.length > 1 ? (
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          >
                            {t('purchaseOrder.creation.actions.remove')}
                          </Button>
                        ) : null}
                      </Space>
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} lg={8}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.itemName')}
                          name={[field.name, "itemName"]}
                          rules={[{ required: true, message: t('purchaseOrder.creation.form.validation.itemNameRequired') }]}
                        >
                          <Input placeholder={t('purchaseOrder.creation.form.placeholders.itemName')} allowClear />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.itemCategory')}
                          name={[field.name, "itemCategory"]}
                          rules={[{ required: true, message: t('purchaseOrder.creation.form.validation.categoryRequired') }]}
                        >
                          <CreatableLookupSelect
                            kind="ITEM_CATEGORY"
                            placeholder={t('purchaseOrder.creation.form.placeholders.itemCategory')}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.supplierName')}
                          name={[field.name, "supplierName"]}
                        >
                          <Input placeholder={t('purchaseOrder.creation.form.placeholders.supplierName')} allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.itemDescription')}
                          name={[field.name, "itemDescription"]}
                          rules={[{ required: true, message: t('purchaseOrder.creation.form.validation.descriptionRequired') }]}
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder={t('purchaseOrder.creation.form.placeholders.itemDescription')}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.supplierEmail')}
                          name={[field.name, "supplierEmail"]}
                        >
                          <Input placeholder={t('purchaseOrder.creation.form.placeholders.supplierEmail')} allowClear />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.quantity')}
                          name={[field.name, "quantity"]}
                          rules={[
                            { required: true, message: t('purchaseOrder.creation.form.validation.quantityRequired') },
                            {
                              type: "number",
                              min: 0.0001,
                              message: t('purchaseOrder.creation.form.validation.quantityPositive'),
                            },
                          ]}
                        >
                          <InputNumber min={0} step={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.unitOfMeasurement')}
                          name={[field.name, "unitOfMeasurement"]}
                          rules={[{ required: true, message: t('purchaseOrder.creation.form.validation.unitRequired') }]}
                        >
                          <CreatableLookupSelect
                            kind="UNIT_OF_MEASURE"
                            placeholder={t('purchaseOrder.creation.form.placeholders.unitOfMeasurement')}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseOrder.creation.form.estimatedUnitPrice')}
                          name={[field.name, "estimatedUnitPrice"]}
                          rules={[
                            { required: true, message: t('purchaseOrder.creation.form.validation.unitPriceRequired') },
                            {
                              type: "number",
                              min: 0,
                              message: t('purchaseOrder.creation.form.validation.unitPriceNonNegative'),
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            step={0.01}
                            prefix={DEFAULT_CURRENCY}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={16}>
                        <Form.Item label={t('purchaseOrder.creation.form.lineTotal')}>
                          <LineRowTotal index={index} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add(emptyLineRow())}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  {t('purchaseOrder.creation.actions.addPoItem')}
                </Button>
              </>
            )}
          </Form.List>

          <Row gutter={16} align="bottom" className={creationStyles.summarySection}>
            <Col xs={24} md={16}>
              <Text strong>{t('purchaseOrder.creation.form.poTotal')}</Text>
              <InputNumber
                readOnly
                value={orderTotal}
                prefix={DEFAULT_CURRENCY}
                style={{ width: "100%", marginTop: 8, ...autoFieldStyle }}
                formatter={(v) =>
                  v != null && !Number.isNaN(Number(v)) ? Number(v).toFixed(2) : "0.00"
                }
              />
            </Col>
            <Col xs={24} md={8}>
              <Button
                type="default"
                icon={<CalculatorOutlined />}
                onClick={recalcOrderTotal}
                block
                style={{ marginTop: 8 }}
              >
                {t('purchaseOrder.creation.actions.calculateTotal')}
              </Button>
            </Col>
          </Row>

          <div className={creationStyles.formActions}>
            <Button onClick={() => void onSaveDraft()}>{t('purchaseOrder.creation.actions.saveAsDraft')}</Button>
            <Button type="primary" onClick={() => void onSubmit()}>
              {t('purchaseOrder.creation.actions.submit')}
            </Button>
          </div>
        </Form>
      </Flex>
    </Card>
  );
}
