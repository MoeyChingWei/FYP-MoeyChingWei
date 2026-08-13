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
import type { Dayjs } from "dayjs";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  hydratePurchaseRequestDrafts,
  loadPurchaseRequestDrafts,
  updatePurchaseRequestDraft,
} from "../../modules/purchasing/requestCreation/storage";
import {
  appendPurchaseOrderDraft,
  createPurchaseOrderFromRequest,
} from "../../modules/purchasing/purchaseOrder/storage";
import type { PurchaseRequestDraft } from "../../modules/purchasing/requestCreation/types";
import { computeDraftLineAmountAfterTax } from "../../modules/purchasing/requestCreation/constants";
import { getSessionUser } from "../../shared/auth/session";
import RejectReasonModal from "../../shared/components/RejectReasonModal";
import { UserRole } from "../../shared/types/roles";

import styles from "./ApprovalSubmodule.module.css";

const { Text, Title } = Typography;

function sortRequestsByDate(requests: PurchaseRequestDraft[]): PurchaseRequestDraft[] {
  return requests
    .map((request, index) => ({ request, index }))
    .sort((left, right) => {
      const leftTime = Date.parse(left.request.requestDate);
      const rightTime = Date.parse(right.request.requestDate);

      if (Number.isFinite(leftTime) && Number.isFinite(rightTime) && leftTime !== rightTime) {
        return rightTime - leftTime;
      }

      return right.index - left.index;
    })
    .map(({ request }) => request);
}

export default function ApprovalSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PurchaseRequestDraft[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [rejectTarget, setRejectTarget] = useState<PurchaseRequestDraft | null>(null);
  const sessionUser = useMemo(() => getSessionUser(), []);

  useEffect(() => {
    const syncRequests = async (): Promise<void> => {
      await hydratePurchaseRequestDrafts();
      setRequests(loadPurchaseRequestDrafts());
    };

    void syncRequests();
    const handleSync = (): void => {
      void syncRequests();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-purchase-request-drafts", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-purchase-request-drafts", handleSync);
    };
  }, []);

  const submittedRequests = useMemo(
    () =>
      requests
        .filter((request) => request.status === "SUBMITTED")
        .filter((request) => {
          const canViewAll =
            sessionUser?.role === UserRole.ADMIN ||
            sessionUser?.role === UserRole.MANAGER ||
            sessionUser?.role === UserRole.DEPARTMENT_EXECUTIVE;

          if (canViewAll) return true;

          if (sessionUser?.id && request.createdByUserId != null) {
            return String(request.createdByUserId) === String(sessionUser.id);
          }

          if (sessionUser?.email) {
            return (
              String(request.createdByEmail ?? "").trim().toLowerCase() ===
              String(sessionUser.email).trim().toLowerCase()
            );
          }

          return false;
        }),
    [requests, sessionUser],
  );

  const filteredRequests = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return sortRequestsByDate(submittedRequests).filter((request) => {
      const matchesDate =
        !selectedDate || request.requestDate === selectedDate;

      const lineItems = Array.isArray(request.lineItems) ? request.lineItems : [];
      const itemText = lineItems
        .map((item) =>
          [
            item.itemName,
            item.itemDescription,
            item.itemCategory,
            item.unitOfMeasurement,
          ]
            .join(" ")
            .toLowerCase(),
        )
        .join(" ");

      const matchesKeyword = [
        request.prNumber,
        request.requestDate,
        request.requestBy,
        request.department || "",
        itemText,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      return matchesDate && (!keyword || matchesKeyword);
    });
  }, [searchValue, selectedDate, submittedRequests]);

  // Get unique dates that have submitted requests
  const datesWithRequests = useMemo(() => {
    const dates = new Set<string>();
    submittedRequests.forEach((request) => {
      if (request.requestDate) {
        dates.add(request.requestDate);
      }
    });
    return dates;
  }, [submittedRequests]);

  // Custom date cell render - highlight dates with requests
  const cellRender = (current: Dayjs, info: any) => {
    // Only apply custom styling to date cells (not month/year cells)
    if (info.type !== 'date') {
      return info.originNode;
    }

    const dateString = current.format("YYYY-MM-DD");
    const hasRequest = datesWithRequests.has(dateString);

    return (
      <div
        className="ant-picker-cell-inner"
        style={{
          color: hasRequest ? '#000000' : '#d9d9d9',
          fontWeight: hasRequest ? 600 : 400,
        }}
      >
        {current.date()}
      </div>
    );
  };

  const onApprove = (request: PurchaseRequestDraft): void => {
    appendPurchaseOrderDraft(createPurchaseOrderFromRequest(request, sessionUser));
    updatePurchaseRequestDraft(request.localId, (draft) => ({
      ...draft,
      status: "APPROVED",
    }));
    message.success(t('purchaseRequest.approval.messages.approved', { prNumber: request.prNumber }));
    navigate("/purchasing/po-review");
  };

  const onRejectConfirm = (reason: string): void => {
    if (!rejectTarget) return;

    updatePurchaseRequestDraft(rejectTarget.localId, (draft) => ({
      ...draft,
      status: "REJECTED",
      rejectionReason: reason,
    }));
    message.success(t('purchaseRequest.approval.messages.rejected', { prNumber: rejectTarget.prNumber }));
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
              onClick={() => navigate("/purchasing")}
              style={{ paddingInline: 0 }}
              aria-label={t('common.back')}
            />
            <Title level={3} style={{ margin: 0 }}>
              {t('purchaseRequest.approval.title')}
            </Title>
          </Flex>

          <Flex gap={12} wrap="wrap">
            <DatePicker
              allowClear
              placeholder={t('purchaseRequest.approval.filter.filterByDate')}
              format="YYYY-MM-DD"
              cellRender={cellRender}
              onChange={(_, dateString) =>
                setSelectedDate(
                  typeof dateString === "string" ? dateString : "",
                )
              }
            />
            <Input
              allowClear
              style={{ width: "min(100%, 320px)" }}
              placeholder={t('purchaseRequest.approval.filter.searchPlaceholder')}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </Flex>
        </div>

        <div className={styles.summary}>
          <Text className={styles.summaryText}>
            {t('purchaseRequest.approval.summary', { count: filteredRequests.length })}
          </Text>
        </div>

        <div className={styles.tableWrap}>
          <Table
            rowKey="localId"
            dataSource={filteredRequests}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
            }}
            scroll={{ x: 980 }}
            locale={{
              emptyText: (
                <Empty description={t('purchaseRequest.approval.messages.noPendingApprovals')} />
              ),
            }}
            columns={[
              {
                title: "",
                key: "detail",
                width: 72,
                align: "center",
                render: (_, request) => (
                  <Button
                    size="small"
                    onClick={() => navigate(`/purchasing/approval/${request.localId}`)}
                    aria-label={`Open ${request.prNumber} detail`}
                  >
                    {t('purchaseRequest.approval.actions.view')}
                  </Button>
                ),
              },
              {
                title: t('purchaseRequest.approval.table.prNo'),
                key: "prNumber",
                render: (_, request) => {
                  const isSelfApprovalCase =
                    sessionUser?.role === UserRole.MANAGER &&
                    request.requesterRole === UserRole.MANAGER &&
                    request.createdByUserId === sessionUser.id;

                  return (
                    <div className={styles.prCell}>
                      <Flex gap={8} align="center">
                        <Text strong>{request.prNumber}</Text>
                        {isSelfApprovalCase && (
                          <Tag color="orange" style={{ fontSize: '11px', padding: '0 6px' }}>
                            {t('purchaseRequest.approval.selfApproval')}
                          </Tag>
                        )}
                      </Flex>
                      <span className={styles.prMeta}>{request.requestDate}</span>
                    </div>
                  );
                },
              },
              {
                title: t('purchaseRequest.approval.table.status'),
                key: "status",
                render: () => <Tag color="blue">{t('purchaseRequest.review.status.submitted')}</Tag>,
              },
              {
                title: t('purchaseRequest.approval.table.requester'),
                dataIndex: "requestBy",
                key: "requestBy",
              },
              {
                title: t('purchaseRequest.approval.table.department'),
                dataIndex: "department",
                key: "department",
                render: (value?: string) => value || "-",
              },
              {
                title: t('purchaseRequest.approval.table.items'),
                key: "itemCount",
                align: "center",
                render: (_, request) =>
                  (Array.isArray(request.lineItems) ? request.lineItems : []).length,
              },
              {
                title: t('purchaseRequest.approval.table.total'),
                key: "total",
                align: "right",
                render: (_, request) => {
                  const lineItems = Array.isArray(request.lineItems)
                    ? request.lineItems
                    : [];
                  const total = lineItems.reduce(
                    (sum, item) => sum + computeDraftLineAmountAfterTax(item),
                    0,
                  );

                  return (
                    <Text strong>
                      {request.currency} {total.toFixed(2)}
                    </Text>
                  );
                },
              },
              {
                title: t('common.actions'),
                key: "action",
                align: "center",
                render: (_, request) => (
                  <Flex justify="center" gap={8} wrap="wrap">
                    <Button danger icon={<CloseOutlined />} onClick={() => setRejectTarget(request)}>
                      {t('purchaseRequest.approval.actions.reject')}
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      onClick={() => onApprove(request)}
                    >
                      {t('purchaseRequest.approval.actions.approve')}
                    </Button>
                  </Flex>
                ),
              },
            ]}
          />
        </div>
        <RejectReasonModal
          open={!!rejectTarget}
          title={t('purchaseRequest.detail.modal.rejectTitle')}
          itemLabel={rejectTarget?.prNumber || t('purchaseRequest.detail.modal.rejectLabel')}
          onCancel={() => setRejectTarget(null)}
          onConfirm={onRejectConfirm}
        />
      </div>
    </Card>
  );
}
