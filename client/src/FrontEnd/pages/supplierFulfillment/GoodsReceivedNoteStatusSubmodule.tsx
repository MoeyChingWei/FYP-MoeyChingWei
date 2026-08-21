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
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";
import {
  hydrateSupplierGrns,
  loadSupplierGrns,
  sortWorkflowRowsByStatusAndDate,
  type SupplierGrnRecord,
} from "../../modules/supplierFulfillment/workflow";

import styles from "../purchasing/ApprovalSubmodule.module.css";

const { Text, Title } = Typography;

function matchesCurrentSupplier(
  row: SupplierGrnRecord,
  sessionUser: ReturnType<typeof getSessionUser>,
): boolean {
  if (!sessionUser) return false;
  if (sessionUser.role !== UserRole.SUPPLIER) return true;
  if (row.supplierId && row.supplierId === sessionUser.id) return true;
  if (row.supplierEmail && row.supplierEmail === sessionUser.email) return true;
  return false;
}

function statusTag(status: SupplierGrnRecord["status"], t: any): React.ReactNode {
  switch (status) {
    case "PENDING_GRN":
      return <Tag color="orange">{t("grnStatus.list.status.pendingGrn")}</Tag>;
    case "COMPLETED":
      return <Tag color="green">{t("grnStatus.list.status.completed")}</Tag>;
    case "DISCREPANCY":
      return <Tag color="red">{t("grnStatus.list.status.discrepancy")}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

export default function GoodsReceivedNoteStatusSubmodule(): React.ReactElement {
  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const [rows, setRows] = useState<SupplierGrnRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const sessionUser = useMemo(() => getSessionUser(), []);

  useEffect(() => {
    const sync = async (): Promise<void> => {
      await hydrateSupplierGrns();
      setRows(loadSupplierGrns());
    };
    const handleSync = (): void => {
      void sync();
    };

    void sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-grns", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-grns", handleSync);
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
        row.poNumber,
        row.sourcePrNumber,
        row.createdBy,
        row.supplierName || "",
        row.supplierEmail || "",
        row.department || "",
        row.discrepancyReason || "",
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [searchValue, selectedDate, visibleRows]);

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
              aria-label={t("grnStatus.list.actions.back")}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t("grnStatus.title")}
            </Title>
          </Flex>

          <Flex gap={12} wrap="wrap">
            <DatePicker
              allowClear
              placeholder={t("grnStatus.list.filter.filterByDate")}
              format="YYYY-MM-DD"
              onChange={(_, dateString) =>
                setSelectedDate(typeof dateString === "string" ? dateString : "")
              }
            />
            <Input
              allowClear
              style={{ width: "min(100%, 320px)" }}
              placeholder={t("grnStatus.list.filter.searchPlaceholder")}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </Flex>
        </div>

        <div className={styles.summary}>
          <Text className={styles.summaryText}>{t("grnStatus.list.summary", { count: filteredRows.length })}</Text>
        </div>

        <div className={styles.tableWrap}>
          <Table
            rowKey="localId"
            dataSource={filteredRows}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 1100 }}
            locale={{ emptyText: <Empty description={t("grnStatus.list.messages.noGrnRecords")} /> }}
            columns={[
              {
                title: "",
                key: "detail",
                width: 72,
                align: "center",
                render: (_, row) => (
                  <Button
                    size="small"
                    onClick={() => navigate(`/supplier-overview/grn-status/${row.localId}`)}
                    aria-label={`Open ${row.poNumber} detail`}
                  >
                    {t("grnStatus.list.actions.view")}
                  </Button>
                ),
              },
              {
                title: t("grnStatus.list.table.orderNo"),
                key: "poNumber",
                render: (_, row) => (
                  <div className={styles.prCell}>
                    <Text strong>{row.poNumber}</Text>
                    <span className={styles.prMeta}>{row.createdDate}</span>
                  </div>
                ),
              },
              {
                title: t("grnStatus.list.table.status"),
                key: "status",
                render: (_, row) => statusTag(row.status, t),
              },
              {
                title: t("grnStatus.list.table.supplier"),
                key: "supplier",
                render: (_, row) => row.supplierName || row.supplierEmail || "-",
              },
              {
                title: t("grnStatus.list.table.items"),
                key: "itemCount",
                align: "center",
                render: (_, row) => row.items.length,
              },
              {
                title: t("grnStatus.list.table.reason"),
                key: "reason",
                render: (_, row) => row.discrepancyReason || "-",
              },
            ]}
          />
        </div>
      </div>
    </Card>
  );
}
