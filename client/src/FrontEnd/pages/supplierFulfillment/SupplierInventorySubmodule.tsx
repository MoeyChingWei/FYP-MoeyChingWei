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
import { getSessionUser } from "../../shared/auth/session";
import {
  fetchPurchasingLookups,
  mergePurchasingOptions,
} from "../../shared/api/purchasingLookups";
import {
  createSupplierInventoryItem,
  loadSupplierInventory,
  saveSupplierInventory,
  type SupplierInventoryItem,
} from "../../modules/supplierFulfillment/inventory";
import styles from "./SupplierInventorySubmodule.module.css";

const { Text, Title } = Typography;

type InventoryFormValues = Omit<SupplierInventoryItem, "id" | "supplierId" | "updatedAt" | "imageDataUrl">;

const EMPTY_FORM: InventoryFormValues = {
  itemName: "",
  category: "",
  quantity: 0,
  reorderLevel: 0,
  unit: "pcs",
  unitPrice: 0,
};

function readImageFile(file: File): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function stockStatus(row: SupplierInventoryItem): "Healthy" | "Low stock" | "Out of stock" {
  if (row.quantity <= 0) return "Out of stock";
  if (row.quantity <= row.reorderLevel) return "Low stock";
  return "Healthy";
}

export default function SupplierInventorySubmodule(): React.ReactElement {
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const supplierId = sessionUser?.id;
  const [rows, setRows] = useState<SupplierInventoryItem[]>(() => loadSupplierInventory(supplierId));
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<SupplierInventoryItem | null>(null);
  const [itemImage, setItemImage] = useState<string | undefined>();
  const [categoryOptions, setCategoryOptions] = useState<string[]>(() => mergePurchasingOptions("ITEM_CATEGORY", []));
  const [form] = Form.useForm<InventoryFormValues>();

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

  const filteredRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !query
        || [row.itemName, row.category].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === "ALL" || stockStatus(row) === statusFilter);
    });
  }, [rows, searchValue, statusFilter]);

  const totalUnits = rows.reduce((sum, row) => sum + row.quantity, 0);
  const lowStockCount = rows.filter((row) => stockStatus(row) !== "Healthy").length;
  const inventoryValue = rows.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);

  const openCreate = () => {
    setEditingRow(null);
    setItemImage(undefined);
    form.setFieldsValue(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (row: SupplierInventoryItem) => {
    setEditingRow(row);
    setItemImage(row.imageDataUrl);
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
      imageDataUrl: itemImage,
    };
    if (editingRow) {
      persistRows(rows.map((row) => row.id === editingRow.id ? { ...row, ...normalized, updatedAt: new Date().toISOString() } : row));
      message.success("Inventory item updated");
    } else {
      persistRows([...rows, createSupplierInventoryItem(supplierId, normalized)]);
      message.success("Inventory item added");
    }
    setModalOpen(false);
  };

  const removeRow = (row: SupplierInventoryItem) => {
    Modal.confirm({
      title: `Delete ${row.itemName}?`,
      content: "This inventory record will be removed from your supplier stock list.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => {
        persistRows(rows.filter((item) => item.id !== row.id));
        message.success("Inventory item deleted");
      },
    });
  };

  const columns: TableProps<SupplierInventoryItem>["columns"] = [
    {
      title: "Item",
      key: "item",
      render: (_, row) => <div className={styles.itemCell}>{row.imageDataUrl ? <img src={row.imageDataUrl} alt="" className={styles.itemThumbnail} /> : <span className={styles.itemThumbnailPlaceholder}><PictureOutlined /></span>}<span className={styles.itemCopy}><strong>{row.itemName}</strong><Text type="secondary">{row.category}</Text></span></div>,
    },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Quantity",
      key: "available",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (_, row) => <strong>{row.quantity.toLocaleString()} {row.unit}</strong>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, row) => {
        const status = stockStatus(row);
        return <Tag color={status === "Healthy" ? "green" : status === "Low stock" ? "orange" : "red"}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, row) => <Flex justify="flex-end" gap={4}><Button type="text" icon={<EditOutlined />} aria-label={`Edit ${row.itemName}`} onClick={() => openEdit(row)} /><Button type="text" danger icon={<DeleteOutlined />} aria-label={`Delete ${row.itemName}`} onClick={() => removeRow(row)} /></Flex>,
    },
  ];

  return (
    <div className={styles.page}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <div>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/supplier-overview")} className={styles.backButton}>Supplier Overview</Button>
          <Title level={3} className={styles.title}>My Inventory</Title>
          <Text type="secondary">Track stock available for incoming orders and deliveries.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add inventory item</Button>
      </Flex>

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} lg={6}><Card className={styles.metricCard}><Statistic title="Items" value={rows.length} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className={styles.metricCard}><Statistic title="Units on hand" value={totalUnits} prefix={<InboxOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className={styles.metricCard}><Statistic title="Inventory value" value={inventoryValue} precision={2} prefix="$" /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className={`${styles.metricCard} ${lowStockCount ? styles.warningMetric : ""}`}><Statistic title="Low stock items" value={lowStockCount} prefix={<WarningOutlined />} /></Card></Col>
      </Row>

      <Card className={styles.tableCard} bordered={false}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={12} className={styles.tableToolbar}>
          <Input allowClear prefix={<SearchOutlined />} placeholder="Search item or category" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} className={styles.search} />
          <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: "ALL", label: "All statuses" }, { value: "Healthy", label: "Healthy" }, { value: "Low stock", label: "Low stock" }, { value: "Out of stock", label: "Out of stock" }]} />
        </Flex>
        {filteredRows.length ? <Table rowKey="id" columns={columns} dataSource={filteredRows} pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: 980 }} /> : <Empty description={rows.length ? "No matching inventory items" : "No inventory items yet"} className={styles.empty} />}
      </Card>

      <Modal title={editingRow ? "Edit inventory item" : "Add inventory item"} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText={editingRow ? "Save changes" : "Add item"} destroyOnHidden>
        <Form form={form} layout="vertical" initialValues={EMPTY_FORM} onFinish={handleSubmit}>
          <Form.Item label="Item image">
            <div className={styles.imageField}>
              <Upload
                accept="image/png,image/jpeg,image/webp"
                showUploadList={false}
                beforeUpload={(file) => {
                  void readImageFile(file)
                    .then(setItemImage)
                    .catch((error: Error) => message.error(error.message));
                  return false;
                }}
              >
                <button type="button" className={styles.imageUploadButton}>
                  {itemImage ? <img src={itemImage} alt="Item preview" /> : <><PictureOutlined /><span>Upload image</span><small>PNG, JPG or WebP</small></>}
                </button>
              </Upload>
              {itemImage && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => setItemImage(undefined)}>Remove image</Button>}
            </div>
          </Form.Item>
          <Row gutter={12}>
            <Col span={24}><Form.Item name="itemName" label="Item name" rules={[{ required: true, message: "Enter an item name" }]}><Input placeholder="Product or material name" /></Form.Item></Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="category" label="Category" rules={[{ required: true, message: "Select a category" }]}><Select showSearch placeholder="Select category" optionFilterProp="label" options={categoryOptions.map((value) => ({ value, label: value }))} /></Form.Item></Col>
            <Col span={12}><Form.Item name="unit" label="Unit" rules={[{ required: true }]}><Select options={["pcs", "box", "carton", "kg", "litre", "set"].map((value) => ({ value, label: value }))} /></Form.Item></Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="reorderLevel" label="Reorder level"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item></Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}><Form.Item name="unitPrice" label="Unit price"><InputNumber min={0} precision={2} style={{ width: "100%" }} /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
