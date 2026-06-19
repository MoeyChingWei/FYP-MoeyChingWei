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

import {
  loadSupplierGrns,
  type SupplierGrnRecord,
} from "../../modules/supplierFulfillment/workflow";
import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";

import styles from "./ApprovalSubmodule.module.css";

const { Text, Title } = Typography;

function displayDeliveryNo(row: SupplierGrnRecord): string {
  return row.deliveryNo || row.poNumber;
}

function statusTag(status: SupplierGrnRecord["status"], t: any): React.ReactNode {
  switch (status) {
    case "PENDING_GRN":
      return <Tag color="orange">{t('grn.list.status.pendingGrn')}</Tag>;
    case "COMPLETED":
      return <Tag color="green">{t('grn.list.status.completed')}</Tag>;
    case "DISCREPANCY":
      return <Tag color="red">{t('grn.list.status.discrepancy')}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

export default function GoodsReceivedNoteSubmodule(): React.ReactElement {
  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const [rows, setRows] = useState<SupplierGrnRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [ownSearchValue, setOwnSearchValue] = useState("");
  const [otherSearchValue, setOtherSearchValue] = useState("");
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

  const filteredRows = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    const canSeeAll =
      sessionUser?.role === UserRole.ADMIN || sessionUser?.role === UserRole.MANAGER;
    const sessionName = sessionUser?.name?.trim().toLowerCase() || "";
    const sessionEmail = sessionUser?.email?.trim().toLowerCase() || "";

    return [...rows].reverse().filter((row) => {
      const rowRequester = (row.sourceRequester || row.createdBy || "").trim().toLowerCase();
      const isOwnRow =
        (!!sessionName && rowRequester === sessionName) ||
        (!!sessionEmail && row.createdBy.trim().toLowerCase() === sessionEmail);

      if (!canSeeAll && !isOwnRow) {
        return false;
      }

      const matchesDate = !selectedDate || row.createdDate === selectedDate;
      const itemText = row.items
        .map((item) =>
          [
            item.itemName,
            item.itemDescription,
            item.itemCategory,
            item.supplierName,
            item.supplierEmail,
          ]
            .join(" ")
            .toLowerCase(),
        )
        .join(" ");

      const matchesKeyword = [
        row.deliveryNo || "",
        row.originalOrderNo || "",
        row.poNumber,
        row.sourcePrNumber,
        row.sourceRequester || "",
        row.createdBy,
        row.department || "",
        row.supplierName || "",
        row.supplierEmail || "",
        row.discrepancyReason || "",
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [rows, searchValue, selectedDate, sessionUser]);

  const ownRows = useMemo(() => {
    const sessionName = sessionUser?.name?.trim().toLowerCase() || "";
    const sessionEmail = sessionUser?.email?.trim().toLowerCase() || "";

    return filteredRows.filter((row) => {
      const rowRequester = (row.sourceRequester || row.createdBy || "").trim().toLowerCase();
      return (
        (!!sessionName && rowRequester === sessionName) ||
        (!!sessionEmail && row.createdBy.trim().toLowerCase() === sessionEmail)
      );
    });
  }, [filteredRows, sessionUser]);

  const otherRows = useMemo(() => {
    const ownIds = new Set(ownRows.map((row) => row.localId));
    return filteredRows.filter((row) => !ownIds.has(row.localId));
  }, [filteredRows, ownRows]);

  const filteredOwnRows = useMemo(() => {
    const keyword = ownSearchValue.trim().toLowerCase();
    if (!keyword) return ownRows;

    return ownRows.filter((row) =>
      [
        row.deliveryNo || "",
        row.originalOrderNo || "",
        row.poNumber,
        row.sourcePrNumber,
        row.sourceRequester || "",
        row.createdBy,
        row.supplierName || "",
        row.supplierEmail || "",
        row.discrepancyReason || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [ownRows, ownSearchValue]);

  const filteredOtherRows = useMemo(() => {
    const keyword = otherSearchValue.trim().toLowerCase();
    if (!keyword) return otherRows;

    return otherRows.filter((row) =>
      [
        row.deliveryNo || "",
        row.originalOrderNo || "",
        row.poNumber,
        row.sourcePrNumber,
        row.sourceRequester || "",
        row.createdBy,
        row.supplierName || "",
        row.supplierEmail || "",
        row.discrepancyReason || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [otherRows, otherSearchValue]);

  const canSeeAll =
    sessionUser?.role === UserRole.ADMIN || sessionUser?.role === UserRole.MANAGER;

  const columns = [
    {
      title: "",
      key: "detail",
      width: 72,
      align: "center" as const,
      render: (_: unknown, row: SupplierGrnRecord) => (
        <Button
          size="small"
          onClick={() => navigate(`/purchasing/goods-received-note/${row.localId}`)}
          aria-label={`Open ${row.poNumber} detail`}
        >
          {t('grn.list.actions.view')}
        </Button>
      ),
    },
    {
      title: t('grn.list.table.orderNo'),
      key: "poNumber",
      render: (_: unknown, row: SupplierGrnRecord) => (
        <div className={styles.prCell}>
          <Text strong>{displayDeliveryNo(row)}</Text>
          <span className={styles.prMeta}>{row.createdDate}</span>
        </div>
      ),
    },
    {
      title: t('grn.list.table.status'),
      key: "status",
      render: (_: unknown, row: SupplierGrnRecord) => statusTag(row.status, t),
    },
    {
      title: t('grn.list.table.requester'),
      key: "sourceRequester",
      render: (_: unknown, row: SupplierGrnRecord) => row.sourceRequester || row.createdBy || "-",
    },
    {
      title: t('grn.list.table.supplier'),
      key: "supplier",
      render: (_: unknown, row: SupplierGrnRecord) => row.supplierName || row.supplierEmail || "-",
    },
    {
      title: t('grn.list.table.items'),
      key: "itemCount",
      align: "center" as const,
      render: (_: unknown, row: SupplierGrnRecord) => row.items.length,
    },
    {
      title: t('grn.list.table.reason'),
      key: "reason",
      render: (_: unknown, row: SupplierGrnRecord) => row.discrepancyReason || "-",
    },
  ];

  return (
    <Card>
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/purchasing")}
              style={{ paddingInline: 0 }}
              aria-label={t('grn.list.actions.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('grn.list.title')}
            </Title>
          </Flex>

          <Flex gap={12} wrap="wrap">
            <DatePicker
              allowClear
              placeholder={t('grn.list.filter.filterByDate')}
              format="YYYY-MM-DD"
              onChange={(_, dateString) =>
                setSelectedDate(typeof dateString === "string" ? dateString : "")
              }
            />
            <Input
              allowClear
              style={{ width: "min(100%, 320px)" }}
              placeholder={t('grn.list.filter.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </Flex>
        </div>

        {canSeeAll ? (
          <>
            <div className={styles.summary}>
              <Text className={styles.summaryText}>{t('grn.list.section.myGrnData')}</Text>
            </div>
            <Flex justify="flex-end" style={{ marginBottom: 12 }}>
              <Input
                allowClear
                style={{ width: "min(100%, 320px)" }}
                placeholder={t('grn.list.section.searchMyGrn')}
                prefix={<SearchOutlined />}
                value={ownSearchValue}
                onChange={(event) => setOwnSearchValue(event.target.value)}
              />
            </Flex>
            <div className={styles.tableWrap}>
              <Table
                rowKey="localId"
                dataSource={filteredOwnRows}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                scroll={{ x: 1120 }}
                locale={{ emptyText: <Empty description={t('grn.list.messages.noGrnRecordsInMy')} /> }}
                columns={columns}
              />
            </div>

            <div className={styles.summary}>
              <Text className={styles.summaryText}>{t('grn.list.section.otherGrnData')}</Text>
            </div>
            <Flex justify="flex-end" style={{ marginBottom: 12 }}>
              <Input
                allowClear
                style={{ width: "min(100%, 320px)" }}
                placeholder={t('grn.list.section.searchOtherGrn')}
                prefix={<SearchOutlined />}
                value={otherSearchValue}
                onChange={(event) => setOtherSearchValue(event.target.value)}
              />
            </Flex>
            <div className={styles.tableWrap}>
              <Table
                rowKey="localId"
                dataSource={filteredOtherRows}
                pagination={{ pageSize: 8, showSizeChanger: false }}
                scroll={{ x: 1120 }}
                locale={{ emptyText: <Empty description={t('grn.list.messages.noGrnRecordsInOther')} /> }}
                columns={columns}
              />
            </div>
          </>
        ) : (
          <div className={styles.tableWrap}>
            <Table
              rowKey="localId"
              dataSource={ownRows}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: 1120 }}
              locale={{ emptyText: <Empty description={t('grn.list.messages.noGrnRecords')} /> }}
              columns={columns}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
