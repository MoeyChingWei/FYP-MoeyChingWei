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
  Spin,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CalculatorOutlined,
  ClearOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import CreatableLookupSelect from "../../components/purchasing/CreatableLookupSelect";
import { getSessionUser } from "../../shared/auth/session";
import { displayCurrency } from "../../shared/utils/currency";
import {
  computeLineTotal,
  computeTaxBreakdown,
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
import {
  fetchPurchasingLookups,
  mergePurchasingOptions,
} from "../../shared/api/purchasingLookups";
import {
  getBudgetUsage,
  getDepartments,
  releaseBudgetForPR,
  reserveBudgetForPR,
  type BudgetUsageSummary,
} from "../../shared/api/departmentBudget";
import { getCompanyLogo } from "../../modules/settings/companyAddress";
import {
  createSupplierInventory,
  fetchSupplierInventory,
  reserveSupplierInventory,
  seedSampleSupplierInventory,
  type SupplierInventoryItem,
} from "../../modules/supplierFulfillment/inventory";
import { fetchSupplierTaxSettings, type SupplierTaxRule, type SupplierTaxSettings } from "../../shared/api/supplierTaxSettings";

import creationStyles from "./CreationSubmodule.module.css";

const { Text } = Typography;

const DEFAULT_CURRENCY = "MYR";
const API = API_ROOT;

const PAYMENT_TERM_VALUES = [
  "DUE_ON_RECEIPT",
  "NET_7",
  "NET_30",
  "NET_60",
  "NET_90",
] as const;

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
  supplierInventoryItemId?: string;
  itemImageUrl?: string;
  inventoryAvailableQuantity?: number;
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
  supplierTaxApplies?: boolean;
  supplierTaxType?: string;
  supplierTaxRate?: number;
  supplierTaxRules?: SupplierTaxRule[];
};

type OrderTax = { applies: boolean; type: string; rate: number; rules: SupplierTaxRule[] };

function orderTaxForRows(rows: LineItemFormRow[] | undefined): OrderTax {
  const source = rows?.find((row) => row.supplierId != null);
  const legacy = source?.supplierTaxType && source.supplierTaxType !== "NO_TAX" ? [{ taxType: source.supplierTaxType as SupplierTaxRule["taxType"], taxRate: Number(source.supplierTaxRate ?? 0) }] : [];
  const rules = source?.supplierTaxRules?.length ? source.supplierTaxRules : legacy;
  const first = rules[0];
  return { applies: Boolean(source?.supplierTaxApplies && rules.length), type: String(first?.taxType ?? "NO_TAX"), rate: Number(first?.taxRate ?? 0), rules };
}

function orderTaxLabel(type: string): string {
  return ({ SALES_TAX: "Sales tax", SERVICE_TAX: "Service tax", OTHER: "Other tax" } as Record<string, string>)[type] ?? "Tax";
}

function InventoryProductPicker({
  index,
  supplierUsers,
  supplierTaxSettings,
}: {
  index: number;
  supplierUsers: ApiUser[];
  supplierTaxSettings: SupplierTaxSettings[];
}): React.ReactElement {
  const form = Form.useFormInstance();
  const category = Form.useWatch(["lineItems", index, "itemCategory"], form);
  const selectedId = Form.useWatch(["lineItems", index, "supplierInventoryItemId"], form);
  const [inventory, setInventory] = useState<SupplierInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;

    const localRows = supplierUsers.flatMap((supplier) =>
      seedSampleSupplierInventory(supplier.id).map((item) => ({
        ...item,
        supplierId: supplier.id,
      })),
    );

    const itemKey = (item: SupplierInventoryItem) =>
      `${item.supplierId}|${item.itemName.trim().toLowerCase()}|${item.category.trim().toLowerCase()}`;

    const refreshInventory = async (): Promise<void> => {
      if (!cancelled) setLoading(true);
      try {
        const serverRows = await fetchSupplierInventory();
        const serverKeys = new Set(serverRows.map(itemKey));
        const legacyRows = localRows.filter((item) => !serverKeys.has(itemKey(item)));
        if (!cancelled) setInventory([...serverRows, ...legacyRows]);

        if (legacyRows.length) {
          const migrated = await Promise.allSettled(
            legacyRows.map(({ id: _id, updatedAt: _updatedAt, ...item }) =>
              createSupplierInventory(item),
            ),
          );
          const createdRows = migrated.flatMap((result) =>
            result.status === "fulfilled" ? [result.value] : [],
          );
          if (!cancelled && createdRows.length) {
            const createdKeys = new Set(createdRows.map(itemKey));
            setInventory([
              ...serverRows,
              ...createdRows,
              ...legacyRows.filter((item) => !createdKeys.has(itemKey(item))),
            ]);
          }
        }
      } catch {
        if (!cancelled) setInventory(localRows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void refreshInventory();
    const sync = (): void => { void refreshInventory(); };
    window.addEventListener("storage", sync);
    window.addEventListener("erp-supplier-inventory", sync);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", sync);
      window.removeEventListener("erp-supplier-inventory", sync);
    };
  }, [supplierUsers]);

  const products = useMemo(() => {
    const wanted = String(category ?? "").trim().toLowerCase();
    if (!wanted) return [];
    return inventory.filter((item) => item.category.trim().toLowerCase() === wanted);
  }, [category, inventory]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;
    return products.filter((item) => item.itemName.toLowerCase().includes(query));
  }, [products, searchTerm]);

  useEffect(() => {
    if (!selectedId || inventory.some((item) => item.id === selectedId && (item.quantity - Number(item.reservedQuantity ?? 0)) > 0 && item.category.trim().toLowerCase() === String(category ?? "").trim().toLowerCase())) return;
    form.setFieldValue(["lineItems", index, "supplierInventoryItemId"], undefined);
    form.setFieldValue(["lineItems", index, "itemImageUrl"], undefined);
    form.setFieldValue(["lineItems", index, "inventoryAvailableQuantity"], undefined);
    form.setFieldValue(["lineItems", index, "unitOfMeasurement"], undefined);
  }, [category, form, index, inventory, selectedId]);

  const chooseProduct = (item: SupplierInventoryItem) => {
    const availableQuantity = Math.max(0, item.quantity - Number(item.reservedQuantity ?? 0));
    if (availableQuantity <= 0) return;
    const supplier = supplierUsers.find((user) => user.id === item.supplierId);
    const taxSetting = supplierTaxSettings.find((setting) => setting.supplierId === item.supplierId);
    const rows = ([...(form.getFieldValue("lineItems") ?? [])] as LineItemFormRow[]);
    rows[index] = {
      ...rows[index],
      supplierInventoryItemId: item.id,
      itemImageUrl: item.imageDataUrl,
      inventoryAvailableQuantity: availableQuantity,
      itemName: item.itemName,
      itemCategory: item.category,
      supplierId: item.supplierId,
      supplierName: supplier?.name ?? supplier?.email,
      supplierEmail: supplier?.email,
      supplierDepartment: supplier?.department ?? undefined,
      quantity: 1,
      unitOfMeasurement: item.unit,
      estimatedUnitPrice: item.unitPrice,
      supplierTaxApplies: taxSetting?.taxApplies ?? false,
      supplierTaxType: taxSetting?.taxType ?? "NO_TAX",
      supplierTaxRate: Number(taxSetting?.taxRate ?? 0),
      supplierTaxRules: taxSetting?.taxRules ?? [],
    } as LineItemFormRow;
    form.setFieldsValue({ lineItems: rows });
  };

  if (!category) return <Text type="secondary">Select a category to browse supplier inventory.</Text>;
  if (loading) return <div className={creationStyles.inventoryLoading}><Spin size="small" /><Text type="secondary">Loading supplier inventory...</Text></div>;
  if (!products.length) return <Text type="secondary">No inventory items found for this category. You can enter an item manually.</Text>;

  return (
    <div className={creationStyles.inventoryPicker}>
      <div className={creationStyles.inventoryPickerHeader}>
        <Text strong>Available from supplier inventory</Text>
        <div className={creationStyles.inventoryPickerTools}>
          <Input
            allowClear
            size="small"
            prefix={<SearchOutlined />}
            placeholder="Search item"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className={creationStyles.inventorySearch}
          />
          <Text type="secondary">
            {filteredProducts.length === products.length
              ? `${products.length} item${products.length === 1 ? "" : "s"}`
              : `${filteredProducts.length} of ${products.length} items`}
          </Text>
        </div>
      </div>
      {filteredProducts.length ? (
        <div className={creationStyles.inventoryProductGrid}>
          {filteredProducts.map((item) => {
          const supplier = supplierUsers.find((user) => user.id === item.supplierId);
          const taxSetting = supplierTaxSettings.find((setting) => setting.supplierId === item.supplierId);
          const selected = selectedId === item.id;
          const reservedQuantity = Number(item.reservedQuantity ?? 0);
          const availableQuantity = Math.max(0, item.quantity - reservedQuantity);
          const outOfStock = availableQuantity <= 0;
          return (
            <button
              type="button"
              key={`${item.supplierId}-${item.id}`}
              className={`${creationStyles.inventoryProduct} ${selected ? creationStyles.inventoryProductSelected : ""} ${outOfStock ? creationStyles.inventoryProductOutOfStock : ""}`}
              onClick={() => chooseProduct(item)}
              disabled={outOfStock}
            >
              {item.imageDataUrl ? <img src={item.imageDataUrl} alt="" className={creationStyles.inventoryProductImage} /> : <span className={creationStyles.inventoryProductPlaceholder}><InboxOutlined /></span>}
              <span className={creationStyles.inventoryProductCopy}>
                <strong>{item.itemName}</strong>
                <span>{supplier?.name ?? supplier?.email ?? "Supplier"}</span>
                <span>{taxSetting?.taxApplies && taxSetting.taxRules?.length ? `Order tax: ${taxSetting.taxRules.map((rule) => `${orderTaxLabel(rule.taxType)} (${Number(rule.taxRate).toFixed(2)}%)`).join(" + ")}` : "No order tax"}</span>
                <span>
                  {outOfStock
                    ? "Out of stock"
                    : `${availableQuantity.toLocaleString()} ${item.unit} available`}
                  {reservedQuantity > 0 && !outOfStock
                    ? ` · ${reservedQuantity.toLocaleString()} reserved`
                    : ""}
                </span>
                {selected && !outOfStock ? (
                  <span className={creationStyles.inventoryProductReserve}>
                    <LockOutlined /> Reserve
                  </span>
                ) : null}
              </span>
              <span className={creationStyles.inventoryProductPrice}>{displayCurrency(DEFAULT_CURRENCY)} {item.unitPrice.toFixed(2)}</span>
            </button>
          );
          })}
        </div>
      ) : (
        <Text type="secondary" className={creationStyles.inventoryEmpty}>No inventory items match your search.</Text>
      )}
    </div>
  );
}

function InventoryQuantityInput({
  index,
  value,
  onChange,
}: {
  index: number;
  value?: number | null;
  onChange?: (value: number | null) => void;
}): React.ReactElement {
  const form = Form.useFormInstance();
  const available = Form.useWatch(["lineItems", index, "inventoryAvailableQuantity"], form);
  return (
    <InputNumber
      value={value}
      onChange={onChange}
      min={0}
      max={typeof available === "number" ? available : undefined}
      step={1}
      style={{ width: "100%" }}
    />
  );
}

type FormValues = {
  paymentTerms?: string;
  lineItems: LineItemFormRow[];
};

function emptyLineRow(): LineItemFormRow {
  return {};
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
      prefix={displayCurrency(DEFAULT_CURRENCY)}
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
}: {
  index: number;
  supplierUsers: ApiUser[];
}): React.ReactElement {
  const { t } = useTranslation('purchasing');
  const form = Form.useFormInstance();
  const selectedSupplierId = Form.useWatch(
    ["lineItems", index, "supplierId"],
    form,
  );
  const selectedInventoryItemId = Form.useWatch(
    ["lineItems", index, "supplierInventoryItemId"],
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
  const normalizedSupplierId =
    selectedSupplierId == null || selectedSupplierId === ""
      ? undefined
      : Number(selectedSupplierId);

  const selectedSupplierDisplay =
    (selectedInventoryItemId && normalizedSupplierId != null
      ? supplierUsers.find((supplier) => supplier.id === normalizedSupplierId)
      : undefined) ??
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
      {!selectedInventoryItemId ? (
        <Text type="secondary">Select an inventory item below to view its supplier.</Text>
      ) : selectedSupplierDisplay ? (
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <div className={creationStyles.supplierEntry}>
            <Text strong>{selectedSupplierDisplay.name ?? selectedSupplierDisplay.email}</Text>
            <Text type="secondary">{selectedSupplierDisplay.email}</Text>
            <Text type="secondary">{selectedSupplierDisplay.department || t('purchaseRequest.creation.supplier.noDepartment')}</Text>
          </div>
        </Space>
      ) : (
        <Text type="secondary">The selected item's supplier is unavailable.</Text>
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
  const [supplierTaxSettings, setSupplierTaxSettings] = useState<SupplierTaxSettings[]>([]);
  const [editingDraft, setEditingDraft] = useState<PurchaseRequestDraft | null>(null);
  const [departmentBudget, setDepartmentBudget] = useState<BudgetUsageSummary | null>(null);
  const [loadingDepartmentBudget, setLoadingDepartmentBudget] = useState(false);
  const [paymentTermOptions, setPaymentTermOptions] = useState<string[]>(
    () => [...PAYMENT_TERM_VALUES],
  );
  useEffect(() => {
    let cancelled = false;

    void fetchPurchasingLookups("PAYMENT_TERM")
      .then((rows) => {
        if (!cancelled) {
          setPaymentTermOptions(mergePurchasingOptions("PAYMENT_TERM", rows));
        }
      })
      .catch((error) => {
        console.error("Load payment terms error:", error);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setSessionUser(getSessionUser());
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDepartmentBudget = async (): Promise<void> => {
      if (!sessionUser?.department) {
        setDepartmentBudget(null);
        return;
      }

      setLoadingDepartmentBudget(true);
      try {
        const departments = await getDepartments(true);
        const departmentValue = String(sessionUser.department).trim().toLowerCase();
        const matchedDepartment = departments.find((item) =>
          item.code.trim().toLowerCase() === departmentValue ||
          item.name.trim().toLowerCase() === departmentValue,
        );

        const today = new Date();
        const usage = matchedDepartment
          ? await getBudgetUsage(matchedDepartment.id, today.getFullYear(), today.getMonth() + 1)
          : null;

        if (!cancelled) setDepartmentBudget(usage);
      } catch (error) {
        console.error("Load purchase request department budget error:", error);
        if (!cancelled) setDepartmentBudget(null);
      } finally {
        if (!cancelled) setLoadingDepartmentBudget(false);
      }
    };

    void loadDepartmentBudget();
    return () => {
      cancelled = true;
    };
  }, [sessionUser?.department, sessionUser?.id, sessionUser?.email]);

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
      paymentTerms: foundDraft.paymentTerms,
      lineItems: foundDraft.lineItems.map((item) => ({
        supplierInventoryItemId: item.supplierInventoryItemId,
        itemImageUrl: item.itemImageUrl,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        itemCategory: item.itemCategory,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        supplierEmail: item.supplierEmail,
        supplierDepartment: item.supplierDepartment,
        supplierTaxApplies: foundDraft.supplierTaxApplies ?? false,
        supplierTaxType: foundDraft.supplierTaxType ?? "NO_TAX",
        supplierTaxRate: foundDraft.supplierTaxRate ?? 0,
        supplierTaxRules: foundDraft.supplierTaxRules ?? [],
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
        const usersRes = await axios.get(`${API}/admin/users`);
        if (!cancelled && usersRes.data?.success) {
          const users = (usersRes.data.users ?? []) as ApiUser[];
          const suppliers = users.filter((user) => user.role === UserRole.SUPPLIER && Boolean(user.isActive));
          setSupplierUsers(suppliers);
          const taxSettings = await fetchSupplierTaxSettings(suppliers.map((supplier) => supplier.id));
          if (!cancelled) setSupplierTaxSettings(taxSettings);
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

  const requestSubtotal = useMemo(() => (lineItemsWatch ?? []).reduce(
    (sum, row) => sum + computeLineTotal(row?.quantity, row?.estimatedUnitPrice), 0,
  ), [lineItemsWatch]);
  const requestTax = useMemo(() => orderTaxForRows(lineItemsWatch), [lineItemsWatch]);
  const requestTaxBreakdown = useMemo(() => computeTaxBreakdown(requestSubtotal, requestTax.rules), [requestSubtotal, requestTax]);
  const requestTaxAmount = requestTax.applies ? requestTaxBreakdown.total : 0;
  const requestTotal = Math.round((requestSubtotal + requestTaxAmount) * 100) / 100;

  const recalcRequestTotal = (): void => {
    const rows =
      (form.getFieldValue("lineItems") as LineItemFormRow[] | undefined) ?? [];
    const subtotal = rows.reduce((sum, row) => sum + computeLineTotal(row?.quantity, row?.estimatedUnitPrice), 0);
    const tax = orderTaxForRows(rows);
    const total = Math.round((subtotal + (tax.applies ? computeTaxBreakdown(subtotal, tax.rules).total : 0)) * 100) / 100;
    message.info(
      tMsg('info.totalCalculated', {
        currency: displayCurrency(DEFAULT_CURRENCY),
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
    const supplierIds = Array.from(new Set(rows.map((row) => Number(row.supplierId)).filter((id) => Number.isInteger(id) && id > 0)));
    if (supplierIds.length > 1) {
      message.warning("A purchase request must contain inventory items from one supplier so one order tax can be applied.");
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
        supplierInventoryItemId: row.supplierInventoryItemId,
        itemImageUrl: row.itemImageUrl,
        itemName: String(row.itemName ?? "").trim(),
        itemDescription: String(row.itemDescription ?? "").trim(),
        itemCategory: String(row.itemCategory ?? "").trim(),
        supplierId: normalizedSupplierId,
        supplierName: row.supplierName ?? selectedSupplier?.name ?? undefined,
        supplierEmail: row.supplierEmail ?? selectedSupplier?.email ?? undefined,
        quantity: Number(row.quantity),
        unitOfMeasurement: String(row.unitOfMeasurement ?? "").trim(),
        unitPrice: Number(row.estimatedUnitPrice),
        amountAfterTax: computeLineTotal(row.quantity, row.estimatedUnitPrice),
      };
    });
    const requestAmount = requestTotal;
    const localId = editingDraft?.localId ?? newTempId();

    // A submitted request must fit the current department's available budget.
    // Drafts remain available even when finance has not configured a budget yet.
    if (status === "SUBMITTED") {
      if (!departmentBudget) {
        message.error("No department budget is available for the current month.");
        return;
      }
      if (requestAmount > departmentBudget.remainingAmount + 0.005) {
        message.error(
          `Request total ${displayCurrency(DEFAULT_CURRENCY)} ${requestAmount.toFixed(2)} exceeds the available budget of ${displayCurrency(DEFAULT_CURRENCY)} ${departmentBudget.remainingAmount.toFixed(2)}.`,
        );
        return;
      }
    }

    let budgetReservedAt = editingDraft?.budgetReservedAt;
    if (status === "SUBMITTED" && !budgetReservedAt) {
      const budgetResult = await reserveBudgetForPR({
        ...editingDraft,
        localId,
        status: "SUBMITTED",
        createdByUserId: editingDraft?.createdByUserId ?? sessionUser?.id,
        createdAt: editingDraft?.requestDate ?? requestDate,
        requestDate,
        department: department === "â€”" ? undefined : department,
        lineItems,
        amountAfterTax: requestAmount,
      });
      if (!budgetResult.success) {
        message.error(budgetResult.reason ?? "Could not reserve department budget");
        throw new Error(budgetResult.reason ?? "Could not reserve department budget");
      }
      budgetReservedAt = new Date().toISOString();
    }
    const inventoryReservations = lineItems
      .filter((item) => item.supplierInventoryItemId && item.quantity > 0)
      .map((item) => ({
        inventoryItemId: item.supplierInventoryItemId,
        quantity: item.quantity,
        supplierId: item.supplierId,
        itemName: item.itemName,
        category: item.itemCategory,
        unit: item.unitOfMeasurement,
      }));

    if (
      status === "SUBMITTED" &&
      inventoryReservations.length > 0 &&
      editingDraft?.inventoryReservationStatus !== "RESERVED"
    ) {
      try {
        await reserveSupplierInventory(inventoryReservations);
      } catch (error) {
        if (budgetReservedAt) {
          await releaseBudgetForPR({
            ...editingDraft,
            localId,
            status: "REJECTED",
            requestedBy: editingDraft?.createdByUserId ?? sessionUser?.id,
            createdAt: requestDate,
            requestDate,
            department: department === "â€”" ? undefined : department,
            lineItems,
          });
        }
        message.error(error instanceof Error ? error.message : "Could not reserve inventory");
        throw error;
      }
    }

    const draft: PurchaseRequestDraft = {
      localId,
      prNumber,
      requestDate,
      requestBy,
      createdByUserId: editingDraft?.createdByUserId ?? sessionUser?.id,
      createdByEmail: editingDraft?.createdByEmail ?? sessionUser?.email,
      department: department === "—" ? undefined : department,
      companyLogo: getCompanyLogo(),
      currency: DEFAULT_CURRENCY,
      status,
      lineItems,
      subtotal: requestSubtotal,
      supplierTaxApplies: requestTax.applies,
      supplierTaxType: requestTax.applies ? requestTax.type : "NO_TAX",
      supplierTaxRate: requestTax.applies ? requestTax.rate : 0,
      supplierTaxRules: requestTax.applies ? requestTax.rules : [],
      taxAmount: requestTaxAmount,
      amountAfterTax: requestTotal,
      paymentTerms: String(form.getFieldValue("paymentTerms") ?? "").trim() || undefined,
      requesterRole: editingDraft?.requesterRole ?? sessionUser?.role ?? UserRole.EMPLOYEE,
      inventoryReservationStatus:
        status === "SUBMITTED" && inventoryReservations.length > 0
          ? "RESERVED"
          : editingDraft?.inventoryReservationStatus,
      inventoryReservedItemIds:
        status === "SUBMITTED" && inventoryReservations.length > 0
          ? inventoryReservations.map((item) => item.inventoryItemId as string)
          : editingDraft?.inventoryReservedItemIds,
      budgetReservedAt,
      budgetReleasedAt: undefined,
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
        paymentTerms: undefined,
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

        <Form<FormValues>
          form={form}
          layout="vertical"
          initialValues={{
            paymentTerms: undefined,
            lineItems: [emptyLineRow()],
          }}
        >
          <Form.Item
            label={t('purchaseRequest.creation.form.paymentTerms')}
            name="paymentTerms"
            rules={[{ required: true, message: t('purchaseRequest.creation.form.validation.paymentTermsRequired') }]}
          >
            <Select
              placeholder={t('purchaseRequest.creation.form.placeholders.paymentTerms')}
              options={paymentTermOptions.map((value) => ({
                value,
                label: PAYMENT_TERM_VALUES.includes(
                  value as (typeof PAYMENT_TERM_VALUES)[number],
                )
                  ? t(`purchaseRequest.creation.form.paymentTermOptions.${value}`)
                  : value,
              }))}
            />
          </Form.Item>

          <Divider titlePlacement="left">{t('purchaseRequest.creation.form.itemDetails')}</Divider>

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
                      <Form.Item name={[field.name, "supplierInventoryItemId"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "itemImageUrl"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "inventoryAvailableQuantity"]} hidden>
                        <InputNumber />
                      </Form.Item>
                      <Form.Item name={[field.name, "supplierId"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "supplierName"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "supplierEmail"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "supplierDepartment"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "supplierTaxApplies"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "supplierTaxType"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, "supplierTaxRate"]} hidden>
                        <InputNumber />
                      </Form.Item>
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
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={8}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.itemName')}
                          name={[field.name, "itemName"]}
                        >
                          <Input readOnly />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <InventoryProductPicker index={index} supplierUsers={supplierUsers} supplierTaxSettings={supplierTaxSettings} />
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
                          validateTrigger="onChange"
                          rules={[
                            { required: true, message: t('purchaseRequest.creation.form.validation.quantityRequired') },
                            {
                              type: "number",
                              min: 0.0001,
                              message: t('purchaseRequest.creation.form.validation.quantityPositive'),
                            },
                            {
                              validator: async (_, value) => {
                                const available = form.getFieldValue([
                                  "lineItems",
                                  field.name,
                                  "inventoryAvailableQuantity",
                                ]);
                                const quantity = Number(value);
                                if (
                                  typeof available === "number" &&
                                  Number.isFinite(quantity) &&
                                  quantity > available
                                ) {
                                  throw new Error(
                                    `Quantity cannot exceed available inventory (${available}).`,
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <InventoryQuantityInput index={index} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Form.Item
                          label={t('purchaseRequest.creation.form.unitOfMeasurement')}
                          name={[field.name, "unitOfMeasurement"]}
                        >
                          <Input
                            readOnly
                            placeholder={t('purchaseRequest.creation.form.placeholders.unitOfMeasurement')}
                            aria-label={t('purchaseRequest.creation.form.unitOfMeasurement')}
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
                            readOnly
                            min={0}
                            step={0.01}
                            prefix={displayCurrency(DEFAULT_CURRENCY)}
                            style={{ width: "100%", ...autoFieldStyle }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={16}>
                        <Form.Item label="Line subtotal">
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
              <Text strong>Order total (including supplier tax)</Text>
              <div className={creationStyles.taxSummary}>
                <div><span>Items subtotal</span><strong>{displayCurrency(DEFAULT_CURRENCY)} {requestSubtotal.toFixed(2)}</strong></div>
                {requestTax.applies && requestTax.rules.length ? requestTax.rules.map((rule, index) => <div key={`${rule.taxType}-${index}`}><span>{orderTaxLabel(rule.taxType)} ({Number(rule.taxRate).toFixed(2)}%)</span><strong>{displayCurrency(DEFAULT_CURRENCY)} {(requestTaxBreakdown.amounts[index] ?? 0).toFixed(2)}</strong></div>) : <div><span>Supplier tax</span><strong>{displayCurrency(DEFAULT_CURRENCY)} 0.00</strong></div>}
                <div><span>Amount to reserve</span><strong>{displayCurrency(DEFAULT_CURRENCY)} {requestTotal.toFixed(2)}</strong></div>
              </div>
              <InputNumber
                readOnly
                value={requestTotal}
                prefix={displayCurrency(DEFAULT_CURRENCY)}
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

          <Card
            size="small"
            title={
              departmentBudget
                ? `Department Budget (${departmentBudget.year}-${String(departmentBudget.month).padStart(2, "0")})`
                : "Department Budget"
            }
            loading={loadingDepartmentBudget}
            style={{ marginTop: 16 }}
          >
            {departmentBudget ? (
              <Row gutter={[16, 12]}>
                <Col xs={24}>
                  <Text type="secondary">Department</Text>
                  <div><Text strong>{departmentBudget.department.name}</Text></div>
                </Col>
                <Col xs={24} sm={6}>
                  <Statistic
                    title="Allocated"
                    value={departmentBudget.allocatedAmount}
                    precision={2}
                    prefix={displayCurrency(DEFAULT_CURRENCY)}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Statistic
                    title="Spent"
                    value={departmentBudget.spentAmount}
                    precision={2}
                    prefix={displayCurrency(DEFAULT_CURRENCY)}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Statistic
                    title="Reserved"
                    value={departmentBudget.reservedAmount}
                    precision={2}
                    prefix={displayCurrency(DEFAULT_CURRENCY)}
                    styles={{
                      content: { color: "#fa8c16" },
                    }}
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Statistic
                    title="Remaining"
                    value={departmentBudget.remainingAmount}
                    precision={2}
                    prefix={displayCurrency(DEFAULT_CURRENCY)}
                    styles={{
                      content: {
                        color: departmentBudget.remainingAmount < 0 ? "#ff4d4f" : "#52c41a",
                      },
                    }}
                  />
                </Col>
                <Col span={24}>
                  <div className={creationStyles.budgetUsageStatus}>
                    <Text type="secondary">
                      Usage: {departmentBudget.usagePercentage.toFixed(2)}%
                    </Text>
                    {departmentBudget.status === "exceeded" ? (
                      <Tag
                        color="red"
                        icon={<ExclamationCircleOutlined />}
                        className={creationStyles.budgetStatusExceeded}
                      >
                        EXCEEDED
                      </Tag>
                    ) : departmentBudget.status === "warning" ? (
                      <Tag
                        color="orange"
                        icon={<WarningOutlined />}
                        className={creationStyles.budgetStatusWarning}
                      >
                        WARNING
                      </Tag>
                    ) : (
                      <Tag color="green">ON TRACK</Tag>
                    )}
                  </div>
                </Col>
              </Row>
            ) : (
              <Text type="secondary">
                No budget has been allocated for your department in the current month.
              </Text>
            )}
          </Card>

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
