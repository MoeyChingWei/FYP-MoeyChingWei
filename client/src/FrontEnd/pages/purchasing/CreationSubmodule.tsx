import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
  Select,
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
import { fetchSupplierTypeMap, type SupplierTypeMap } from "../../shared/api/supplierTypes";
import {
  computeLineTotal,
  generatePrNumber,
  todayIsoDate,
} from "../../modules/purchasing/requestCreation/constants";
import {
  appendPurchaseRequestDraft,
  loadPurchaseRequestDrafts,
  replacePurchaseRequestDraft,
} from "../../modules/purchasing/requestCreation/storage";
import type { PurchaseOrderStatus } from "../../modules/purchasing/types";
import type {
  DraftLineItem,
  PurchaseRequestDraft,
} from "../../modules/purchasing/requestCreation/types";
import { UserRole } from "../../shared/types/roles";
import { API_ROOT } from "../../shared/api/base";

import creationStyles from "./CreationSubmodule.module.css";

const { Text } = Typography;

const DEFAULT_CURRENCY = "MYR";
const API = API_ROOT;

type ApiUser = {
  id: number;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  avatarUrl: string | null;
  isActive: boolean;
};

function newTempId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `tmp-${Date.now()}`;
}

type LineItemFormRow = {
  itemName?: string;
  itemDescription?: string;
  itemCategory?: string;
  supplierId?: number | string;
  supplierName?: string;
  supplierEmail?: string;
  supplierDepartment?: string;
  quantity?: number;
  unitOfMeasurement?: string;
  estimatedUnitPrice?: number;
};

type FormValues = {
  lineItems: LineItemFormRow[];
};

function emptyLineRow(): LineItemFormRow {
  return {};
}

function normalizeCategoryText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\//g, " ")
    .replace(/\bstationary\b/g, "stationery")
    .replace(/\bfixtures\b/g, "fixture")
    .replace(/\bmaterials\b/g, "material")
    .replace(/\bbooks\b/g, "book")
    .replace(/\bitems\b/g, "item")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function LineRowTotal({
  index,
}: {
  index: number;
}): React.ReactElement {
  const form = Form.useFormInstance();
  const q = Form.useWatch(["lineItems", index, "quantity"], form);
  const p = Form.useWatch(["lineItems", index, "estimatedUnitPrice"], form);
  const total = computeLineTotal(q, p);

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
        v != null && !Number.isNaN(Number(v))
          ? Number(v).toFixed(2)
          : "0.00"
      }
    />
  );
}

function SupplierDetailPanel({
  index,
  supplierUsers,
  supplierTypeMap,
}: {
  index: number;
  supplierUsers: ApiUser[];
  supplierTypeMap: SupplierTypeMap;
}): React.ReactElement {
  const { t } = useTranslation('purchasing');
  const form = Form.useFormInstance();
  const itemCategory = Form.useWatch(["lineItems", index, "itemCategory"], form);
  const selectedSupplierId = Form.useWatch(
    ["lineItems", index, "supplierId"],
    form,
  );
  const selectedSupplierName = Form.useWatch(
    ["lineItems", index, "supplierName"],
    form,
  );
  const selectedSupplierEmail = Form.useWatch(
    ["lineItems", index, "supplierEmail"],
    form,
  );
  const selectedSupplierDepartment = Form.useWatch(
    ["lineItems", index, "supplierDepartment"],
    form,
  );
  const normalizedCategory = String(itemCategory ?? "").trim();
  const normalizedSupplierId =
    selectedSupplierId == null || selectedSupplierId === ""
      ? undefined
      : Number(selectedSupplierId);

  const setSupplierFields = (supplier?: ApiUser): void => {
    form.setFields([
      { name: ["lineItems", index, "supplierId"], value: supplier?.id },
      { name: ["lineItems", index, "supplierName"], value: supplier?.name ?? undefined },
      { name: ["lineItems", index, "supplierEmail"], value: supplier?.email ?? undefined },
      {
        name: ["lineItems", index, "supplierDepartment"],
        value: supplier?.department ?? undefined,
      },
    ]);
  };

  const matchedSuppliers = useMemo(() => {
    if (!normalizedCategory) return [];
    const normalizedSelectedCategory = normalizeCategoryText(normalizedCategory);

    return supplierUsers.filter((user) => {
      const assignedTypes = supplierTypeMap[String(user.id)] ?? [];
      return assignedTypes.some(
        (assignedType) =>
          normalizeCategoryText(String(assignedType)) === normalizedSelectedCategory,
      );
    });
  }, [normalizedCategory, supplierTypeMap, supplierUsers]);

  useEffect(() => {
    if (!normalizedCategory) {
      setSupplierFields(undefined);
      return;
    }

    if (matchedSuppliers.length === 1) {
      setSupplierFields(matchedSuppliers[0]);
      return;
    }

    if (
      matchedSuppliers.length > 1 &&
      normalizedSupplierId != null &&
      matchedSuppliers.some((supplier) => supplier.id === normalizedSupplierId)
    ) {
      const currentSupplier = matchedSuppliers.find(
        (supplier) => supplier.id === normalizedSupplierId,
      );
      setSupplierFields(currentSupplier);
      return;
    }

    setSupplierFields(undefined);
  }, [form, index, matchedSuppliers, normalizedCategory, normalizedSupplierId]);

  const selectedSupplier =
    matchedSuppliers.find((supplier) => supplier.id === normalizedSupplierId) ??
    (matchedSuppliers.length === 1 ? matchedSuppliers[0] : undefined);
  const selectedSupplierDisplay =
    selectedSupplier ??
    (selectedSupplierName || selectedSupplierEmail
      ? {
          id: normalizedSupplierId ?? -1,
          name:
            typeof selectedSupplierName === "string" ? selectedSupplierName : null,
          email:
            typeof selectedSupplierEmail === "string"
              ? selectedSupplierEmail
              : "",
          department:
            typeof selectedSupplierDepartment === "string"
              ? selectedSupplierDepartment
              : null,
          role: UserRole.SUPPLIER,
          avatarUrl: null,
          isActive: true,
        }
      : undefined);

  return (
    <div className={creationStyles.supplierDetailBox}>
      {!normalizedCategory ? (
        <Text type="secondary">{t('purchaseRequest.creation.supplier.selectCategory')}</Text>
      ) : matchedSuppliers.length > 1 ? (
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <Form.Item
            name={["lineItems", index, "supplierId"]}
            label={null}
            style={{ marginBottom: 0 }}
          >
            <Select
              placeholder="Select supplier"
              options={matchedSuppliers.map((supplier) => ({
                value: supplier.id,
                label: supplier.name ?? supplier.email,
              }))}
              onChange={(value) => {
                const chosenSupplier = matchedSuppliers.find(
                  (supplier) => supplier.id === Number(value),
                );
                setSupplierFields(chosenSupplier);
              }}
            />
          </Form.Item>

          {selectedSupplierDisplay ? (
            <div className={creationStyles.supplierEntry}>
              <Text strong>
                {selectedSupplierDisplay.name ?? selectedSupplierDisplay.email}
              </Text>
              <Text type="secondary">{selectedSupplierDisplay.email}</Text>
              <Text type="secondary">
                {selectedSupplierDisplay.department || t('purchaseRequest.creation.supplier.noDepartment')}
              </Text>
            </div>
          ) : (
            <Text type="secondary">
              {t('purchaseRequest.creation.supplier.multipleMatched')}
            </Text>
          )}
        </Space>
      ) : matchedSuppliers.length ? (
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          {matchedSuppliers.map((supplier) => (
            <div key={supplier.id} className={creationStyles.supplierEntry}>
              <Text strong>{supplier.name ?? supplier.email}</Text>
              <Text type="secondary">{supplier.email}</Text>
              <Text type="secondary">{supplier.department || t('purchaseRequest.creation.supplier.noDepartment')}</Text>
            </div>
          ))}
        </Space>
      ) : (
        <Text type="secondary">
          {t('purchaseRequest.creation.supplier.noMatch', { category: normalizedCategory })}
        </Text>
      )}
    </div>
  );
}

export default function CreationSubmodule(): React.ReactElement {
  const { t } = useTranslation('purchasing');
  const { t: tMsg } = useTranslation('messages');
  const { t: tVal } = useTranslation('validation');
  const navigate = useNavigate();
  const { localId } = useParams();
  const [form] = Form.useForm<FormValues>();
  const [sessionUser, setSessionUser] = useState(() => getSessionUser());
  const [prNumber, setPrNumber] = useState(() => generatePrNumber());
  const [requestDate, setRequestDate] = useState(() => todayIsoDate());
  const [supplierUsers, setSupplierUsers] = useState<ApiUser[]>([]);
  const [supplierTypeMap, setSupplierTypeMap] = useState<SupplierTypeMap>({});
  const [editingDraft, setEditingDraft] = useState<PurchaseRequestDraft | null>(null);

  useEffect(() => {
    setSessionUser(getSessionUser());
  }, []);

  useEffect(() => {
    if (!localId) {
      setEditingDraft(null);
      return;
    }

    const foundDraft = loadPurchaseRequestDrafts().find(
      (draft) => draft.localId === localId,
    );

    if (!foundDraft) {
      message.warning(tMsg('warning.draftNotFound'));
      navigate("/purchasing/review");
      return;
    }

    setEditingDraft(foundDraft);
    setPrNumber(foundDraft.prNumber);
    setRequestDate(foundDraft.requestDate);
    form.setFieldsValue({
      lineItems: foundDraft.lineItems.map((item) => ({
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemCategory: item.itemCategory,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        supplierEmail: item.supplierEmail,
        quantity: item.quantity,
        unitOfMeasurement: item.unitOfMeasurement,
        estimatedUnitPrice: item.unitPrice,
      })),
    });
  }, [form, localId, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadSuppliers(): Promise<void> {
      try {
        const [usersRes, supplierMap] = await Promise.all([
          axios.get(`${API}/admin/users`),
          fetchSupplierTypeMap(),
        ]);
        if (!cancelled && usersRes.data?.success) {
          const users = (usersRes.data.users ?? []) as ApiUser[];
          setSupplierUsers(
            users.filter(
              (user) => user.role === UserRole.SUPPLIER && Boolean(user.isActive),
            ),
          );
          setSupplierTypeMap(supplierMap);
        }
      } catch {
        /* keep creation usable even when supplier lookup fails */
      }
    }

    const refreshSupplierData = (): void => {
      void loadSuppliers();
    };

    refreshSupplierData();
    window.addEventListener("focus", refreshSupplierData);
    document.addEventListener("visibilitychange", refreshSupplierData);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshSupplierData);
      document.removeEventListener("visibilitychange", refreshSupplierData);
    };
  }, []);

  const requestBy = useMemo(
    () => sessionUser?.name?.trim() || sessionUser?.email || "—",
    [sessionUser],
  );
  const department = useMemo(() => {
    const d = sessionUser?.department;
    if (d == null || String(d).trim() === "") return "—";
    return String(d);
  }, [sessionUser]);

  const lineItemsWatch = Form.useWatch("lineItems", form) as
    | LineItemFormRow[]
    | undefined;

  const requestTotal = useMemo(() => {
    if (!lineItemsWatch?.length) return 0;
    return lineItemsWatch.reduce((sum, row) => {
      return (
        sum + computeLineTotal(row?.quantity, row?.estimatedUnitPrice)
      );
    }, 0);
  }, [lineItemsWatch]);

  const recalcRequestTotal = (): void => {
    const rows =
      (form.getFieldValue("lineItems") as LineItemFormRow[] | undefined) ?? [];
    const total = rows.reduce(
      (s, r) => s + computeLineTotal(r?.quantity, r?.estimatedUnitPrice),
      0,
    );
    message.info(
      tMsg('info.totalCalculated', {
        currency: DEFAULT_CURRENCY,
        total: total.toFixed(2)
      }),
    );
  };

  const persistRequest = async (
    status: PurchaseOrderStatus,
    successMsg: string,
  ): Promise<void> => {
    await form.validateFields();
    const rows =
      (form.getFieldValue("lineItems") as LineItemFormRow[] | undefined) ?? [];
    if (rows.length < 1) {
      message.warning(tMsg('warning.noSelection'));
      return;
    }
    const lineItems: DraftLineItem[] = rows.map((row) => {
      const normalizedSupplierId =
        row.supplierId == null || row.supplierId === ""
          ? undefined
          : Number(row.supplierId);
      const selectedSupplier = supplierUsers.find(
        (user) => user.id === normalizedSupplierId,
      );

      return {
        tempId: newTempId(),
        itemName: String(row.itemName ?? "").trim(),
        itemDescription: String(row.itemDescription ?? "").trim(),
        itemCategory: String(row.itemCategory ?? "").trim(),
        supplierId: normalizedSupplierId,
        supplierName: row.supplierName ?? selectedSupplier?.name ?? undefined,
        supplierEmail: row.supplierEmail ?? selectedSupplier?.email ?? undefined,
        quantity: Number(row.quantity),
        unitOfMeasurement: String(row.unitOfMeasurement ?? "").trim(),
        unitPrice: Number(row.estimatedUnitPrice),
      };
    });
    const draft: PurchaseRequestDraft = {
      localId: editingDraft?.localId ?? newTempId(),
      prNumber,
      requestDate,
      requestBy,
      createdByUserId: editingDraft?.createdByUserId ?? sessionUser?.id,
      createdByEmail: editingDraft?.createdByEmail ?? sessionUser?.email,
      department: department === "—" ? undefined : department,
      currency: DEFAULT_CURRENCY,
      status,
      lineItems,
      requesterRole: editingDraft?.requesterRole ?? sessionUser?.role ?? UserRole.EMPLOYEE,
    };
    if (editingDraft) {
      replacePurchaseRequestDraft(editingDraft.localId, draft);
      message.success(
        status === "DRAFT"
          ? tMsg('success.update')
          : tMsg('success.submit'),
      );
    } else {
      appendPurchaseRequestDraft(draft);
      message.success(tMsg('success.save'));
      form.setFieldsValue({
        lineItems: [emptyLineRow()],
      });
    }
  };

  const onSaveDraft = async (): Promise<void> => {
    try {
      await persistRequest("DRAFT", t('purchaseRequest.creation.messages.draftSaved'));
      navigate("/purchasing/review");
    } catch {
      /* validation errors only */
    }
  };

  const onSubmit = async (): Promise<void> => {
    try {
      await persistRequest(
        "SUBMITTED",
        t('purchaseRequest.creation.messages.submitted'),
      );
      navigate("/purchasing/review");
    } catch {
      /* validation errors only */
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
                  ? `/purchasing/review/${editingDraft.localId}`
                  : "/purchasing",
              )
            }
            style={{ paddingInline: 0 }}
            aria-label={t('common.back')}
          />
          <span>{editingDraft ? t('purchaseRequest.creation.editTitle') : t('purchaseRequest.creation.title')}</span>
        </Flex>
      }
    >
      <Flex vertical gap={16}>
        <Row gutter={[16, 8]}>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseRequest.creation.form.prNumber')}</Text>
            <Input readOnly value={prNumber} style={autoFieldStyle} />
          </Col>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseRequest.creation.form.requestDate')}</Text>
            <Input readOnly value={requestDate} style={autoFieldStyle} />
          </Col>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseRequest.creation.form.requestBy')}</Text>
            <Input readOnly value={requestBy} style={autoFieldStyle} />
          </Col>
          <Col xs={24} md={12}>
            <Text strong>{t('purchaseRequest.creation.form.department')}</Text>
            <Input readOnly value={department} style={autoFieldStyle} />
          </Col>
        </Row>

        <Divider titlePlacement="left">{t('purchaseRequest.creation.form.itemDetails')}</Divider>

        <Form<FormValues>
          form={form}
          layout="vertical"
          initialValues={{
            lineItems: [emptyLineRow()],
          }}
        >
          <Form.List name="lineItems">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    className={creationStyles.itemDetailCard}
                    title={t('purchaseRequest.creation.form.itemDetail', { index: index + 1 })}
                    extra={
                      <Space size="small" wrap>
                        <Button
                          type="link"
                          size="small"
                          icon={<ClearOutlined />}
                          onClick={() => {
                            form.setFieldValue(
                              ["lineItems", field.name],
                              emptyLineRow(),
                            );
                          }}
                          aria-label={`Clear all fields for item ${index + 1}`}
                        >
                          {t('purchaseRequest.creation.actions.clearAll')}
                        </Button>
                        {fields.length > 1 ? (
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                            aria-label={`Remove item ${index + 1}`}
                          >
                            {t('purchaseRequest.creation.actions.remove')}
                          </Button>
                        ) : null}
                      </Space>
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} lg={8}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.itemName')}
                          name={[field.name, "itemName"]}
                          rules={[
                            { required: true, message: t('purchaseRequest.creation.form.validation.itemNameRequired') },
                          ]}
                        >
                          <Input
                            placeholder={t('purchaseRequest.creation.form.placeholders.itemName')}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.itemCategory')}
                          name={[field.name, "itemCategory"]}
                          rules={[
                            {
                              required: true,
                              message: t('purchaseRequest.creation.form.validation.categoryRequired'),
                            },
                          ]}
                        >
                          <CreatableLookupSelect
                            kind="ITEM_CATEGORY"
                            placeholder={t('purchaseRequest.creation.form.placeholders.itemCategory')}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Form.Item label={t('purchaseRequest.creation.form.supplierDetail')}>
                          <SupplierDetailPanel
                            index={index}
                            supplierUsers={supplierUsers}
                            supplierTypeMap={supplierTypeMap}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.itemDescription')}
                          name={[field.name, "itemDescription"]}
                          rules={[
                            {
                              required: true,
                              message: t('purchaseRequest.creation.form.validation.descriptionRequired'),
                            },
                          ]}
                        >
                          <Input.TextArea
                            rows={3}
                            placeholder={t('purchaseRequest.creation.form.placeholders.itemDescription')}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.quantity')}
                          name={[field.name, "quantity"]}
                          rules={[
                            { required: true, message: t('purchaseRequest.creation.form.validation.quantityRequired') },
                            {
                              type: "number",
                              min: 0.0001,
                              message: t('purchaseRequest.creation.form.validation.quantityPositive'),
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            step={1}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.unitOfMeasurement')}
                          name={[field.name, "unitOfMeasurement"]}
                          rules={[
                            { required: true, message: t('purchaseRequest.creation.form.validation.unitRequired') },
                          ]}
                        >
                          <CreatableLookupSelect
                            kind="UNIT_OF_MEASURE"
                            placeholder={t('purchaseRequest.creation.form.placeholders.unitOfMeasurement')}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.estimatedUnitPrice')}
                          name={[field.name, "estimatedUnitPrice"]}
                          rules={[
                            {
                              required: true,
                              message: t('purchaseRequest.creation.form.validation.unitPriceRequired'),
                            },
                            {
                              type: "number",
                              min: 0,
                              message: t('purchaseRequest.creation.form.validation.unitPriceNonNegative'),
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
                        <Form.Item label={t('purchaseRequest.creation.form.lineTotal')}>
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
                  {t('purchaseRequest.creation.actions.addItemDetail')}
                </Button>
              </>
            )}
          </Form.List>

          <Row
            gutter={16}
            align="bottom"
            className={creationStyles.summarySection}
          >
            <Col xs={24} md={16}>
              <Text strong>{t('purchaseRequest.creation.form.requestTotal')}</Text>
              <InputNumber
                readOnly
                value={requestTotal}
                prefix={DEFAULT_CURRENCY}
                style={{
                  width: "100%",
                  marginTop: 8,
                  ...autoFieldStyle,
                }}
                formatter={(v) =>
                  v != null && !Number.isNaN(Number(v))
                    ? Number(v).toFixed(2)
                    : "0.00"
                }
              />
            </Col>
            <Col xs={24} md={8}>
              <Button
                type="default"
                icon={<CalculatorOutlined />}
                onClick={recalcRequestTotal}
                block
                style={{ marginTop: 8 }}
              >
                {t('purchaseRequest.creation.actions.calculateTotal')}
              </Button>
            </Col>
          </Row>

          <div className={creationStyles.formActions}>
            <Button onClick={() => void onSaveDraft()}>{t('purchaseRequest.creation.actions.saveAsDraft')}</Button>
            <Button type="primary" onClick={() => void onSubmit()}>
              {t('purchaseRequest.creation.actions.submit')}
            </Button>
          </div>
        </Form>
      </Flex>
    </Card>
  );
}
