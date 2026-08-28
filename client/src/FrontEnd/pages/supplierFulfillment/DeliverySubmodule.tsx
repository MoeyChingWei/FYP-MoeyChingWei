import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Flex,
  Input,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { todayIsoDate } from "../../modules/purchasing/requestCreation/constants";
import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";
import {
  appendSupplierGrn,
  createGrnFromDelivery,
  hydrateSupplierDeliveries,
  loadSupplierDeliveries,
  sortWorkflowRowsByStatusAndDate,
  type SupplierDeliveryRecord,
  updateSupplierDelivery,
} from "../../modules/supplierFulfillment/workflow";

import styles from "../purchasing/ApprovalSubmodule.module.css";

const { Text, Title } = Typography;

function matchesCurrentSupplier(
  row: SupplierDeliveryRecord,
  sessionUser: ReturnType<typeof getSessionUser>,
): boolean {
  if (!sessionUser) return false;
  if (sessionUser.role !== UserRole.SUPPLIER) return true;
  if (row.supplierId && row.supplierId === sessionUser.id) return true;
  if (row.supplierEmail && row.supplierEmail === sessionUser.email) return true;
  return false;
}

function statusTag(status: SupplierDeliveryRecord["status"], t: any): React.ReactNode {
  switch (status) {
    case "PENDING_DELIVERY":
      return <Tag color="orange">{t("delivery.list.status.pendingDelivery")}</Tag>;
    case "DELIVERED":
      return <Tag color="green">{t("delivery.list.status.delivered")}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

function displayDeliveryNo(row: SupplierDeliveryRecord): string {
  return row.deliveryNo || row.poNumber;
}

export default function DeliverySubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const [rows, setRows] = useState<SupplierDeliveryRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const sessionUser = useMemo(() => getSessionUser(), []);

  useEffect(() => {
    const sync = async (): Promise<void> => {
      await hydrateSupplierDeliveries();
      setRows(loadSupplierDeliveries());
    };
    const handleSync = (): void => {
      void sync();
    };

    void sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-deliveries", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-deliveries", handleSync);
    };
  }, []);

  const visibleRows = useMemo(
    () => sortWorkflowRowsByStatusAndDate(
      rows.filter((row) => matchesCurrentSupplier(row, sessionUser)),
    ),
    [rows, sessionUser],
  );

  const filteredRows = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return visibleRows.filter((row) => {
      const matchesDate = !selectedDate || row.createdDate === selectedDate;
      const itemText = row.items
        .map((item) => [item.itemName, item.itemDescription, item.itemCategory].join(" "))
        .join(" ")
        .toLowerCase();

      const matchesKeyword = [
        row.deliveryNo || "",
        row.originalOrderNo || "",
        row.poNumber,
        row.sourcePrNumber,
        row.createdBy,
        row.supplierName || "",
        row.supplierEmail || "",
        row.department || "",
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [searchValue, selectedDate, visibleRows]);

  const onDeliver = (row: SupplierDeliveryRecord): void => {
    const deliveredDate = todayIsoDate();
    appendSupplierGrn(
      createGrnFromDelivery({
        ...row,
        status: "DELIVERED",
        deliveredDate,
      }),
    );
    updateSupplierDelivery(row.localId, (draft) => ({
      ...draft,
      status: "DELIVERED",
      deliveredDate,
    }));
    message.success(t("delivery.list.messages.delivered", { deliveryNo: displayDeliveryNo(row) }));
  };

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/supplier-overview")}
              style={{ paddingInline: 0 }}
              aria-label={t("delivery.list.actions.back")}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t("delivery.title")}
            </Title>
          </Flex>

          <Flex gap={12} wrap="wrap">
            <DatePicker
              allowClear
              placeholder={t("delivery.list.filter.filterByDate")}
              format="YYYY-MM-DD"
              onChange={(_, dateString) =>
                setSelectedDate(typeof dateString === "string" ? dateString : "")
              }
            />
            <Input
              allowClear
              style={{ width: "min(100%, 320px)" }}
              placeholder={t("delivery.list.filter.searchPlaceholder")}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </Flex>
        </div>

        <div className={styles.summary}>
          <Text className={styles.summaryText}>{t("delivery.list.summary", { count: filteredRows.length })}</Text>
        </div>

        <div className={styles.tableWrap}>
          <Table
            rowKey="localId"
            dataSource={filteredRows}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 1060 }}
            locale={{ emptyText: <Empty description={t("delivery.list.messages.noDeliveryRecords")} /> }}
            columns={[
              {
                title: "",
                key: "detail",
                width: 72,
                align: "center",
                render: (_, row) => (
                  <Button
                    size="small"
                    onClick={() => navigate(`/supplier-overview/delivery/${row.localId}`)}
                    aria-label={`Open ${row.poNumber} detail`}
                  >
                    {t("delivery.list.actions.view")}
                  </Button>
                ),
              },
              {
                title: t("delivery.list.table.orderNo"),
                key: "poNumber",
                render: (_, row) => (
                  <div className={styles.prCell}>
                    <Text strong>{displayDeliveryNo(row)}</Text>
                    <span className={styles.prMeta}>{row.createdDate}</span>
                  </div>
                ),
              },
              {
                title: t("delivery.list.table.status"),
                key: "status",
                render: (_, row) => statusTag(row.status, t),
              },
              {
                title: t("delivery.list.table.supplier"),
                key: "supplier",
                render: (_, row) => row.supplierName || row.supplierEmail || "-",
              },
              {
                title: t("delivery.list.table.items"),
                key: "itemCount",
                align: "center",
                render: (_, row) => row.items.length,
              },
              {
                title: t("delivery.list.table.total"),
                key: "total",
                align: "right",
                render: (_, row) => {
                  const total = row.items.reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0,
                  );
                  return (
                    <Text strong>
                      {row.currency === "MYR" ? "RM" : row.currency} {total.toFixed(2)}
                    </Text>
                  );
                },
              },
              {
                title: t("delivery.list.table.action"),
                key: "action",
                align: "center",
                render: (_, row) =>
                  row.status === "PENDING_DELIVERY" ? (
                    <Button type="primary" icon={<CheckOutlined />} onClick={() => onDeliver(row)}>
                      {t("delivery.list.actions.deliver")}
                    </Button>
                  ) : (
                    "-"
                  ),
              },
            ]}
          />
        </div>
      </div>
    </Card>
  );
}
