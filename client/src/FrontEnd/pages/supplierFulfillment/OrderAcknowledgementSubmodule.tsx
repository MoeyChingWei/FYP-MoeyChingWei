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
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";
import {
  appendSupplierDelivery,
  createDeliveryFromAcknowledgement,
  hydrateSupplierOrderAcknowledgements,
  loadSupplierOrderAcknowledgements,
  sortWorkflowRowsByStatusAndDate,
  type SupplierOrderAcknowledgementRecord,
  updateSupplierOrderAcknowledgement,
} from "../../modules/supplierFulfillment/workflow";
import RejectReasonModal from "../../shared/components/RejectReasonModal";

import styles from "../purchasing/ApprovalSubmodule.module.css";

const { Text, Title } = Typography;

function matchesCurrentSupplier(
  row: SupplierOrderAcknowledgementRecord,
  sessionUser: ReturnType<typeof getSessionUser>,
): boolean {
  if (!sessionUser) return false;
  if (sessionUser.role !== UserRole.SUPPLIER) return true;
  if (row.supplierId && row.supplierId === sessionUser.id) return true;
  if (row.supplierEmail && row.supplierEmail === sessionUser.email) return true;
  return false;
}

function statusTag(status: SupplierOrderAcknowledgementRecord["status"], t: any): React.ReactNode {
  switch (status) {
    case "PENDING_ORDER_ACKNOWLEDGE":
      return <Tag color="orange">{t("orderAcknowledgement.list.status.pendingOrderAcknowledge")}</Tag>;
    case "APPROVED":
      return <Tag color="green">{t("orderAcknowledgement.list.status.approved")}</Tag>;
    case "REJECTED":
      return <Tag color="red">{t("orderAcknowledgement.list.status.rejected")}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

export default function OrderAcknowledgementSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("supplier");
  const navigate = useNavigate();
  const [rows, setRows] = useState<SupplierOrderAcknowledgementRecord[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [rejectTarget, setRejectTarget] = useState<SupplierOrderAcknowledgementRecord | null>(null);
  const sessionUser = useMemo(() => getSessionUser(), []);

  useEffect(() => {
    const sync = async (): Promise<void> => {
      await hydrateSupplierOrderAcknowledgements();
      setRows(loadSupplierOrderAcknowledgements());
    };
    const handleSync = (): void => {
      void sync();
    };

    void sync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-supplier-order-acks", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-supplier-order-acks", handleSync);
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
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [searchValue, selectedDate, visibleRows]);

  const onApprove = (row: SupplierOrderAcknowledgementRecord): void => {
    appendSupplierDelivery(createDeliveryFromAcknowledgement(row));
    updateSupplierOrderAcknowledgement(row.localId, (draft) => ({
      ...draft,
      status: "APPROVED",
    }));
    message.success(t("orderAcknowledgement.list.messages.acknowledged", { poNumber: row.poNumber }));
  };

  const onRejectConfirm = (reason: string): void => {
    if (!rejectTarget) return;

    updateSupplierOrderAcknowledgement(rejectTarget.localId, (draft) => ({
      ...draft,
      status: "REJECTED",
      rejectionReason: reason,
      rejectedBy:
        sessionUser?.name?.trim() ||
        sessionUser?.email ||
        draft.supplierName ||
        draft.supplierEmail,
    }));
    message.success(t("orderAcknowledgement.list.messages.rejected", { poNumber: rejectTarget.poNumber }));
    setRejectTarget(null);
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
              aria-label={t("orderAcknowledgement.list.actions.back")}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t("orderAcknowledgement.title")}
            </Title>
          </Flex>

          <Flex gap={12} wrap="wrap">
            <DatePicker
              allowClear
              placeholder={t("orderAcknowledgement.list.filter.filterByDate")}
              format="YYYY-MM-DD"
              onChange={(_, dateString) =>
                setSelectedDate(typeof dateString === "string" ? dateString : "")
              }
            />
            <Input
              allowClear
              style={{ width: "min(100%, 320px)" }}
              placeholder={t("orderAcknowledgement.list.filter.searchPlaceholder")}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </Flex>
        </div>

        <div className={styles.summary}>
          <Text className={styles.summaryText}>
            {t("orderAcknowledgement.list.summary", { count: filteredRows.length })}
          </Text>
        </div>

        <div className={styles.tableWrap}>
          <Table
            rowKey="localId"
            dataSource={filteredRows}
            pagination={{ pageSize: 8, showSizeChanger: false }}
            scroll={{ x: 1060 }}
            locale={{
              emptyText: <Empty description={t("orderAcknowledgement.list.messages.noAcknowledgements")} />,
            }}
            columns={[
              {
                title: "",
                key: "detail",
                width: 72,
                align: "center",
                render: (_, row) => (
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/supplier-overview/order-acknowledgement/${row.localId}`)
                    }
                    aria-label={`Open ${row.poNumber} detail`}
                  >
                    {t("orderAcknowledgement.list.actions.view")}
                  </Button>
                ),
              },
              {
                title: t("orderAcknowledgement.list.table.orderNo"),
                key: "poNumber",
                render: (_, row) => (
                  <div className={styles.prCell}>
                    <Text strong>{row.poNumber}</Text>
                    <span className={styles.prMeta}>{row.createdDate}</span>
                  </div>
                ),
              },
              {
                title: t("orderAcknowledgement.list.table.status"),
                key: "status",
                render: (_, row) => statusTag(row.status, t),
              },
              {
                title: t("orderAcknowledgement.list.table.supplier"),
                key: "supplier",
                render: (_, row) => row.supplierName || row.supplierEmail || "-",
              },
              {
                title: t("orderAcknowledgement.list.table.items"),
                key: "itemCount",
                align: "center",
                render: (_, row) => row.items.length,
              },
              {
                title: t("orderAcknowledgement.list.table.total"),
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
                title: t("orderAcknowledgement.list.table.action"),
                key: "action",
                align: "center",
                render: (_, row) =>
                  row.status === "PENDING_ORDER_ACKNOWLEDGE" ? (
                    <Flex justify="center" gap={8} wrap="wrap">
                      <Button danger icon={<CloseOutlined />} onClick={() => setRejectTarget(row)}>
                        {t("orderAcknowledgement.list.actions.reject")}
                      </Button>
                      <Button type="primary" icon={<CheckOutlined />} onClick={() => onApprove(row)}>
                        {t("orderAcknowledgement.list.actions.approve")}
                      </Button>
                    </Flex>
                  ) : (
                    "-"
                  ),
              },
            ]}
          />
        </div>
        <RejectReasonModal
          open={!!rejectTarget}
          title={t("orderAcknowledgement.detail.modal.rejectTitle")}
          itemLabel={rejectTarget?.poNumber || t("orderAcknowledgement.detail.modal.rejectLabel")}
          onCancel={() => setRejectTarget(null)}
          onConfirm={onRejectConfirm}
        />
      </div>
    </Card>
  );
}
