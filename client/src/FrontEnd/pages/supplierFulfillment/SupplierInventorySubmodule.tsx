import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSessionUser } from "../../shared/auth/session";
import {
  fetchPurchasingLookups,
  mergePurchasingOptions,
} from "../../shared/api/purchasingLookups";
import {
  createSupplierInventory,
  deleteSupplierInventory,
  fetchSupplierInventory,
  loadSupplierInventory,
  saveSupplierInventory,
  seedSampleSupplierInventory,
  updateSupplierInventory,
  type SupplierInventoryItem,
} from "../../modules/supplierFulfillment/inventory";
import styles from "./SupplierInventorySubmodule.module.css";

const { Text, Title } = Typography;

type InventoryFormValues = Omit<SupplierInventoryItem, "id" | "supplierId" | "updatedAt" | "reservedQuantity" | "imageDataUrl">;

const EMPTY_FORM: InventoryFormValues = {
  itemName: "",
  category: "",
  quantity: 0,
  reorderLevel: 0,
  unit: "pcs",
  unitPrice: 0,
};

function readImageFile(file: File): Promise<{ preview: string; file: File }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Image must be smaller than 5 MB"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Image could not be read"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Image could not be processed"));
      image.onload = () => {
        const maxSide = 720;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Image could not be processed"));
          return;
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const preview = canvas.toDataURL("image/jpeg", 0.82);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Image could not be processed"));
            return;
          }
          resolve({ preview, file: new File([blob], "inventory-image.jpg", { type: "image/jpeg" }) });
        }, "image/jpeg", 0.82);
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function availableQuantity(row: SupplierInventoryItem): number {
  return Math.max(0, row.quantity - Number(row.reservedQuantity ?? 0));
}

function stockStatus(row: SupplierInventoryItem): "In stock" | "Low stock" | "Out of stock" {
  const available = availableQuantity(row);
  if (available <= 0) return "Out of stock";
  if (available <= row.reorderLevel) return "Low stock";
  return "In stock";
}

function formatCurrency(amount: number): string {
  return `RM ${amount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function SupplierInventorySubmodule(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("supplier");
  const sessionUser = useMemo(() => getSessionUser(), []);
  const supplierId = sessionUser?.id;
  const [rows, setRows] = useState<SupplierInventoryItem[]>(() => seedSampleSupplierInventory(supplierId));
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<SupplierInventoryItem | null>(null);
  const [itemImage, setItemImage] = useState<string | undefined>();
  const [itemImageFile, setItemImageFile] = useState<File | undefined>();
  const [categoryOptions, setCategoryOptions] = useState<string[]>(() => mergePurchasingOptions("ITEM_CATEGORY", []));
  const [unitOptions, setUnitOptions] = useState<string[]>(() => mergePurchasingOptions("UNIT_OF_MEASURE", []));
  const [form] = Form.useForm<InventoryFormValues>();

  useEffect(() => {
    if (!supplierId) return;
    void fetchSupplierInventory(supplierId)
      .then(async (serverRows) => {
        if (serverRows.length) {
          setRows(serverRows);
          saveSupplierInventory(supplierId, serverRows);
          return;
        }
        const legacyRows = seedSampleSupplierInventory(supplierId);
        if (!legacyRows.length) return;
        const migrated = await Promise.all(legacyRows.map(({ id: _id, updatedAt: _updatedAt, ...item }) => createSupplierInventory(item)));
        setRows(migrated);
        saveSupplierInventory(supplierId, migrated);
      })
      .catch(() => {
        setRows(loadSupplierInventory(supplierId));
      });
  }, [supplierId]);

  useEffect(() => {
    const sync = () => setRows(loadSupplierInventory(supplierId));
    window.addEventListener("storage", sync);
    window.addEventListener("erp-supplier-inventory", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("erp-supplier-inventory", sync);
    };
  }, [supplierId]);

  useEffect(() => {
    void fetchPurchasingLookups("ITEM_CATEGORY")
      .then((customRows) => setCategoryOptions(mergePurchasingOptions("ITEM_CATEGORY", customRows)))
      .catch(() => {
        // Built-in categories remain available when the API is offline.
      });
  }, []);

  useEffect(() => {
    void fetchPurchasingLookups("UNIT_OF_MEASURE")
      .then((customRows) => setUnitOptions(mergePurchasingOptions("UNIT_OF_MEASURE", customRows)))
      .catch(() => {
        // Built-in units remain available when the API is offline.
      });
  }, []);

  const filteredRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !query
        || [row.itemName, row.category].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === "ALL" || stockStatus(row) === statusFilter);
    });
  }, [rows, searchValue, statusFilter]);

  const totalUnits = rows.reduce((sum, row) => sum + availableQuantity(row), 0);
  const lowStockCount = rows.filter((row) => stockStatus(row) !== "In stock").length;
  const inventoryValue = rows.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);
  const statusLabel = (status: ReturnType<typeof stockStatus>): string => {
    if (status === "In stock") return t("inventory.inStock");
    if (status === "Low stock") return t("inventory.lowStock");
    return t("inventory.outOfStock");
  };

  const openCreate = () => {
    setEditingRow(null);
    setItemImage(undefined);
    setItemImageFile(undefined);
    form.setFieldsValue(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row: SupplierInventoryItem) => {
    setEditingRow(row);
    setItemImage(row.imageDataUrl);
    setItemImageFile(undefined);
    form.setFieldsValue({
      itemName: row.itemName,
      category: row.category,
      quantity: row.quantity,
      reorderLevel: row.reorderLevel,
      unit: row.unit,
      unitPrice: row.unitPrice,
    });
    setModalOpen(true);
  };

  const persistRows = (nextRows: SupplierInventoryItem[]) => {
    if (!supplierId) return;
    setRows(nextRows);
    saveSupplierInventory(supplierId, nextRows);
  };

  const handleSubmit = async (values: InventoryFormValues) => {
    if (!supplierId) return;
    const normalized = {
      ...values,
      itemName: values.itemName.trim(),
      category: values.category.trim() || "Uncategorized",
      imageDataUrl: itemImageFile ? undefined : itemImage,
    };
    try {
      if (editingRow) {
        const updated = await updateSupplierInventory({ ...editingRow, ...normalized }, itemImageFile);
        persistRows(rows.map((row) => row.id === editingRow.id ? updated : row));
        message.success(t("inventory.updated"));
      } else {
        const created = await createSupplierInventory({ supplierId, ...normalized }, itemImageFile);
        persistRows([...rows, created]);
        message.success(t("inventory.added"));
      }
      setModalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("inventory.saveError"));
    }
  };

  const removeRow = (row: SupplierInventoryItem) => {
    Modal.confirm({
      title: t("inventory.deleteTitle", { itemName: row.itemName }),
      content: t("inventory.deleteDescription"),
      okText: t("common.delete"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteSupplierInventory(row.id);
          persistRows(rows.filter((item) => item.id !== row.id));
          message.success(t("inventory.deleted"));
        } catch (error) {
          message.error(error instanceof Error ? error.message : t("inventory.deleteError"));
        }
      },
    });
  };

  const columns: TableProps<SupplierInventoryItem>["columns"] = [
    {
      title: t("inventory.items"),
      key: "item",
      render: (_, row) => <div className={styles.itemCell}>{row.imageDataUrl ? <img src={row.imageDataUrl} alt="" className={styles.itemThumbnail} /> : <span className={styles.itemThumbnailPlaceholder}><PictureOutlined /></span>}<span className={styles.itemCopy}><strong>{row.itemName}</strong><Text type="secondary">{row.category}</Text></span></div>,
    },
    { title: t("inventory.category"), dataIndex: "category", key: "category" },
    {
      title: t("inventory.available"),
      key: "available",
      sorter: (a, b) => availableQuantity(a) - availableQuantity(b),
      render: (_, row) => <strong>{availableQuantity(row).toLocaleString()} {row.unit}</strong>,
    },
    {
      title: t("inventory.reserved"),
      key: "reserved",
      sorter: (a, b) => Number(a.reservedQuantity ?? 0) - Number(b.reservedQuantity ?? 0),
      render: (_, row) => <Text type={row.reservedQuantity ? "warning" : "secondary"}>{Number(row.reservedQuantity ?? 0).toLocaleString()} {row.unit}</Text>,
    },
    {
      title: t("inventory.unitPrice"),
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      render: (value) => formatCurrency(value),
    },
    {
      title: t("inventory.totalValue"),
      key: "totalValue",
      align: "right",
      sorter: (a, b) => a.quantity * a.unitPrice - b.quantity * b.unitPrice,
      render: (_, row) => formatCurrency(row.quantity * row.unitPrice),
    },
    {
      title: t("inventory.status"),
      key: "status",
      render: (_, row) => {
        const status = stockStatus(row);
        return <Tag color={status === "In stock" ? "green" : status === "Low stock" ? "orange" : "red"}>{statusLabel(status)}</Tag>;
      },
    },
    {
      title: t("inventory.actions"),
      key: "actions",
      align: "right",
      render: (_, row) => <Flex justify="flex-end" gap={4}><Button type="text" icon={<EditOutlined />} aria-label={`${t("inventory.edit")} ${row.itemName}`} onClick={() => openEdit(row)} /><Button type="text" danger icon={<DeleteOutlined />} aria-label={`${t("common.delete")} ${row.itemName}`} onClick={() => removeRow(row)} /></Flex>,
    },
  ];

  return (
    <div className={styles.page}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <div>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/supplier-overview")} className={styles.backButton}>{t("inventory.back")}</Button>
          <Title level={3} className={styles.title}>{t("inventory.title")}</Title>
          <Text type="secondary">{t("inventory.description")}</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>{t("inventory.add")}</Button>
      </Flex>

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={6}><Card className={styles.metricCard}><Statistic title={t("inventory.items")} value={rows.length} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className={styles.metricCard}><Statistic title={t("inventory.unitsOnHand")} value={totalUnits} prefix={<InboxOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className={styles.metricCard}><Statistic title={t("inventory.inventoryValue")} value={inventoryValue} precision={2} prefix="RM " /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className={`${styles.metricCard} ${lowStockCount ? styles.warningMetric : ""}`}><Statistic title={t("inventory.lowStockItems")} value={lowStockCount} prefix={<WarningOutlined />} /></Card></Col>
      </Row>

      <Card className={styles.tableCard} bordered={false}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={12} className={styles.tableToolbar}>
          <Input allowClear prefix={<SearchOutlined />} placeholder={t("inventory.searchPlaceholder")} value={searchValue} onChange={(event) => setSearchValue(event.target.value)} className={styles.search} />
        <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: "ALL", label: t("inventory.allStatuses") }, { value: "In stock", label: t("inventory.inStock") }, { value: "Low stock", label: t("inventory.lowStock") }, { value: "Out of stock", label: t("inventory.outOfStock") }]} />
        </Flex>
        {filteredRows.length ? <Table rowKey="id" columns={columns} dataSource={filteredRows} pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: 1160 }} /> : <Empty description={rows.length ? t("inventory.noMatching") : t("inventory.noItems")} className={styles.empty} />}
      </Card>

      <Modal title={editingRow ? t("inventory.edit") : t("inventory.add")} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText={editingRow ? t("inventory.saveChanges") : t("inventory.add")} destroyOnHidden>
        <Form form={form} layout="vertical" initialValues={EMPTY_FORM} onFinish={handleSubmit}>
          <Form.Item label={t("inventory.itemImage")}>
            <div className={styles.imageField}>
              <Upload
                accept="image/png,image/jpeg,image/webp"
                showUploadList={false}
                beforeUpload={(file) => {
                  void readImageFile(file)
                    .then(({ preview, file: compressedFile }) => {
                      setItemImage(preview);
                      setItemImageFile(compressedFile);
                    })
                    .catch((error: Error) => message.error(error.message));
                  return false;
                }}
              >
                <button type="button" className={styles.imageUploadButton}>
                  {itemImage ? <img src={itemImage} alt={t("inventory.itemPreview")} /> : <><PictureOutlined /><span>{t("inventory.uploadImage")}</span><small>{t("inventory.imageFormats")}</small></>}
                </button>
              </Upload>
              {itemImage && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => { setItemImage(undefined); setItemImageFile(undefined); }}>{t("inventory.removeImage")}</Button>}
            </div>
          </Form.Item>
          <Row gutter={12}>
            <Col span={24}><Form.Item name="itemName" label={t("inventory.itemName")} rules={[{ required: true, message: t("inventory.enterItemName") }]}><Input placeholder={t("inventory.itemNamePlaceholder")} /></Form.Item></Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="category" label={t("inventory.category")} rules={[{ required: true, message: t("inventory.selectCategory") }]}><Select showSearch placeholder={t("inventory.categoryPlaceholder")} optionFilterProp="label" options={categoryOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col span={12}><Form.Item name="unit" label={t("inventory.unit")} rules={[{ required: true }]}><Select showSearch optionFilterProp="label" options={unitOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="quantity" label={t("inventory.quantity")} rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="reorderLevel" label={t("inventory.reorderLevel")}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item></Col>
          </Row>
          <Form.Item name="unitPrice" label={t("inventory.unitPrice")}><InputNumber min={0} precision={2} style={{ width: "100%" }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
