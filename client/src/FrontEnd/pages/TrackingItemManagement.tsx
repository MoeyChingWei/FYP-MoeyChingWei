import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Descriptions,
  Empty,
  Flex,
  Input,
  Modal,
  Spin,
  Tag,
  Typography,
  Button,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  InboxOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";
import {
  hydratePurchaseRequestDrafts,
  loadPurchaseRequestDrafts,
} from "../modules/purchasing/requestCreation/storage";
import type { PurchaseRequestDraft } from "../modules/purchasing/requestCreation/types";
import {
  hydratePurchaseOrderDrafts,
  loadPurchaseOrderDrafts,
} from "../modules/purchasing/purchaseOrder/storage";
import type { PurchaseOrderDraft } from "../modules/purchasing/purchaseOrder/types";
import {
  hydrateSupplierDeliveries,
  hydrateSupplierGrns,
  hydrateSupplierOrderAcknowledgements,
  loadSupplierDeliveries,
  loadSupplierGrns,
  isGrnReceived,
  loadSupplierOrderAcknowledgements,
  type SupplierDeliveryRecord,
  type SupplierGrnRecord,
  type SupplierOrderAcknowledgementRecord,
} from "../modules/supplierFulfillment/workflow";

import styles from "./TrackingItemManagement.module.css";

const { Paragraph, Text, Title } = Typography;

type StageKey =
  | "pr"
  | "po"
  | "ack"
  | "delivery"
  | "grn"
  | "completed";

type TrackingRow = {
  id: string;
  requestNo: string;
  requester: string;
  department: string;
  itemSummary: string;
  itemTempId: string;
  itemDescription: string;
  itemCategory: string;
  itemQuantity: number;
  itemUnit: string;
  itemUnitPrice: number;
  stage: StageKey;
  isRejected?: boolean;
  rejectionReason?: string;
  rejectedBy?: string;
  statusLabel: string;
  description: string;
  sourceRequest: PurchaseRequestDraft;
  purchaseOrders: PurchaseOrderDraft[];
  acknowledgements: SupplierOrderAcknowledgementRecord[];
  deliveries: SupplierDeliveryRecord[];
  grns: SupplierGrnRecord[];
};

// Read/Unread tracking storage
const TRACKING_READ_STORAGE_KEY = "tracking-items-read-status";

function loadReadItems(): Set<string> {
  try {
    const stored = localStorage.getItem(TRACKING_READ_STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

function saveReadItems(readItems: Set<string>): void {
  try {
    localStorage.setItem(TRACKING_READ_STORAGE_KEY, JSON.stringify([...readItems]));
  } catch {
    // Ignore storage errors
  }
}

function markItemAsRead(itemId: string): void {
  const readItems = loadReadItems();
  readItems.add(itemId);
  saveReadItems(readItems);
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent("tracking-item-read", { detail: { itemId } }));
}

function getStageMeta(t: any): Array<{
  key: StageKey;
  label: string;
  completeLabel: string;
  icon: React.ReactNode;
}> {
  return [
    {
      key: "pr",
      label: t('stages.pr.pending'),
      completeLabel: t('stages.pr.complete'),
      icon: <FileTextOutlined />,
    },
    {
      key: "po",
      label: t('stages.po.pending'),
      completeLabel: t('stages.po.complete'),
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "ack",
      label: t('stages.ack.pending'),
      completeLabel: t('stages.ack.complete'),
      icon: <FileDoneOutlined />,
    },
    {
      key: "delivery",
      label: t('stages.delivery.pending'),
      completeLabel: t('stages.delivery.complete'),
      icon: <TruckOutlined />,
    },
    {
      key: "grn",
      label: t('stages.grn.pending'),
      completeLabel: t('stages.grn.complete'),
      icon: <InboxOutlined />,
    },
    {
      key: "completed",
      label: t('stages.completed.label'),
      completeLabel: t('stages.completed.complete'),
      icon: <CheckCircleOutlined />,
    },
  ];
}

const stageMeta: Array<{
  key: StageKey;
  label: string;
  completeLabel: string;
  icon: React.ReactNode;
}> = [
  {
    key: "pr",
    label: "Pending Purchase Request",
    completeLabel: "Purchase Request Approved",
    icon: <FileTextOutlined />,
  },
  {
    key: "po",
    label: "Pending Purchase Order",
    completeLabel: "Purchase Order Approved",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: "ack",
    label: "Pending Acknowledge Order",
    completeLabel: "Order Acknowledged",
    icon: <FileDoneOutlined />,
  },
  {
    key: "delivery",
    label: "Pending Delivery",
    completeLabel: "Delivered",
    icon: <TruckOutlined />,
  },
  {
    key: "grn",
    label: "Pending GRN",
    completeLabel: "GRN Received",
    icon: <InboxOutlined />,
  },
  {
    key: "completed",
    label: "Completed",
    completeLabel: "Completed",
    icon: <CheckCircleOutlined />,
  },
];

function statusTag(label: string, t: any): React.ReactElement {
  if (label === t('status.rejected')) {
    return <Tag color="red">{label}</Tag>;
  }
  if (label === t('status.completed') || label === t('stages.grn.complete')) {
    return <Tag color="green">{label}</Tag>;
  }
  if (label.includes(t('stages.pr.complete').split(' ')[2]) || label === t('stages.ack.complete') || label === t('stages.delivery.complete')) {
    return <Tag color="blue">{label}</Tag>;
  }
  return <Tag color="orange">{label}</Tag>;
}

function buildDescription(row: TrackingRow, t: any): string {
  if (row.isRejected) {
    switch (row.stage) {
      case "pr":
        return t('descriptions.prRejected');
      case "po":
        return t('descriptions.poRejected');
      case "ack":
        return t('descriptions.ackRejected');
      default:
        return t('descriptions.rejected');
    }
  }

  switch (row.stage) {
    case "pr":
      return t('descriptions.prPending');
    case "po":
      return t('descriptions.poApproved');
    case "ack":
      return t('descriptions.ackPending');
    case "delivery":
      return t('descriptions.deliveryPending');
    case "grn":
      return row.grns.some((grn) => grn.status === "DISCREPANCY")
        ? t('descriptions.grnDiscrepancy')
        : t('descriptions.grnPending');
    case "completed":
      return t('descriptions.completed');
    default:
      return "-";
  }
}

function getTrackingStage(
  request: PurchaseRequestDraft,
  itemTempId: string,
  purchaseOrders: PurchaseOrderDraft[],
  acknowledgements: SupplierOrderAcknowledgementRecord[],
  deliveries: SupplierDeliveryRecord[],
  grns: SupplierGrnRecord[],
  t: any,
): { stage: StageKey; statusLabel: string; isRejected?: boolean } {
  const relatedOrders = purchaseOrders.filter((order) =>
    (order.lineItems ?? []).some((item) => item.tempId === itemTempId),
  );
  const relatedAcks = acknowledgements.filter((row) =>
    (row.items ?? []).some((item) => item.tempId === itemTempId),
  );
  const relatedDeliveries = deliveries.filter((row) =>
    (row.items ?? []).some((item) => item.tempId === itemTempId),
  );
  const relatedGrns = grns.filter((row) =>
    (row.items ?? []).some((item) => item.tempId === itemTempId),
  );
  const latestDelivery =
    relatedDeliveries.length > 0 ? relatedDeliveries[relatedDeliveries.length - 1] : undefined;
  const latestGrnForLatestDelivery = latestDelivery
    ? relatedGrns.filter((grn) => grn.deliveryLocalId === latestDelivery.localId)
    : [];
  const latestGrn =
    (latestGrnForLatestDelivery.length > 0
      ? latestGrnForLatestDelivery[latestGrnForLatestDelivery.length - 1]
      : undefined) ||
    (relatedGrns.length > 0 ? relatedGrns[relatedGrns.length - 1] : undefined);

  if (request.status === "REJECTED") {
    return { stage: "pr", statusLabel: t('status.rejected'), isRejected: true };
  }

  if (relatedOrders.some((row) => row.status === "REJECTED")) {
    return { stage: "po", statusLabel: t('status.rejected'), isRejected: true };
  }

  if (relatedAcks.some((row) => row.status === "REJECTED")) {
    return { stage: "ack", statusLabel: t('status.rejected'), isRejected: true };
  }

  if (latestDelivery) {
    if (latestDelivery.status === "PENDING_DELIVERY") {
      return { stage: "delivery", statusLabel: t('stages.delivery.pending') };
    }

    if (isGrnReceived(latestGrn?.status)) {
      return { stage: "completed", statusLabel: t('status.completed') };
    }
    if (latestGrn?.status === "DISCREPANCY") {
      return { stage: "grn", statusLabel: t('status.discrepancy') };
    }
    return { stage: "grn", statusLabel: t('stages.grn.pending') };
  }

  if (relatedAcks.some((row) => row.status === "APPROVED")) {
    return { stage: "delivery", statusLabel: t('stages.delivery.pending') };
  }

  if (relatedAcks.length > 0) {
    return { stage: "ack", statusLabel: t('stages.ack.pending') };
  }

  if (relatedOrders.some((row) => row.status === "APPROVED")) {
    return { stage: "ack", statusLabel: t('stages.ack.pending') };
  }

  if (relatedOrders.length > 0) {
    return { stage: "po", statusLabel: t('stages.po.pending') };
  }

  if (request.status === "APPROVED") {
    return { stage: "po", statusLabel: t('stages.po.pending') };
  }

  return { stage: "pr", statusLabel: t('stages.pr.pending') };
}

function TrackingProgress({
  activeStage,
  isRejected,
  onRejectedDetailClick,
  selectedFilter,
  onFilterChange,
  stageCounts,
  isCompact = false,
  t,
}: {
  activeStage: StageKey;
  isRejected?: boolean;
  onRejectedDetailClick?: () => void;
  selectedFilter: StageKey | "all";
  onFilterChange: (stage: StageKey | "all") => void;
  stageCounts: Record<StageKey, number>;
  isCompact?: boolean;
  t: any;
}): React.ReactElement {
  const steps = getStageMeta(t);
  const activeIndex = steps.findIndex((step) => step.key === activeStage);

  return (
    <div className={`${styles.processWrap} ${isCompact ? styles.processWrapCompact : ''}`}>
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isRejectedActive = isActive && isRejected;
        const label = isCompleted ? step.completeLabel : step.label;
        const isFilterActive = selectedFilter === step.key;
        const count = stageCounts[step.key] || 0;
        const hasItems = count > 0;

        return (
          <div key={step.key} className={styles.stepGroup}>
            <button
              type="button"
              className={[
                styles.stepIconButton,
                isFilterActive ? styles.stepIconButtonSelected : "",
                hasItems ? styles.stepIconButtonHasItems : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onFilterChange(step.key)}
              title={`Filter by ${label} (${count} items)`}
            >
              <div
                className={[
                  styles.stepIcon,
                  isCompleted ? styles.stepIconCompleted : "",
                  isActive && !isRejected ? styles.stepIconActive : "",
                  isRejectedActive ? styles.stepIconRejected : "",
                  isFilterActive ? styles.stepIconSelected : "",
                  hasItems ? styles.stepIconHasItems : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isActive ? (
                  isRejectedActive ? (
                    <CloseCircleOutlined />
                  ) : step.key === "ack" || step.key === "delivery" ? (
                    <TruckOutlined />
                  ) : step.key === "grn" ? (
                    <InboxOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                ) : (
                  step.icon
                )}
              </div>
              {count > 0 && (
                <div className={styles.stepCount}>{count}</div>
              )}
            </button>
            {!isCompact && (
              <>
                <div
                  className={[
                    styles.stepDot,
                    isCompleted ? styles.stepDotCompleted : "",
                    isActive && !isRejected ? styles.stepDotActive : "",
                    isRejectedActive ? styles.stepDotRejected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                <div className={styles.stepLabel}>{label}</div>
                {isRejectedActive ? (
                  <button
                    type="button"
                    className={styles.stepRejectedButton}
                    onClick={onRejectedDetailClick}
                  >
                    {t('status.rejected')}
                  </button>
                ) : null}
              </>
            )}
            {index < steps.length - 1 ? (
              <div
                className={[
                  styles.stepLine,
                  index < activeIndex ? styles.stepLineCompleted : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackingItemManagement(): React.ReactElement {
  const { t } = useTranslation('tracking');
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<PurchaseRequestDraft[]>([]);
  const [orders, setOrders] = useState<PurchaseOrderDraft[]>([]);
  const [acks, setAcks] = useState<SupplierOrderAcknowledgementRecord[]>([]);
  const [deliveries, setDeliveries] = useState<SupplierDeliveryRecord[]>([]);
  const [grns, setGrns] = useState<SupplierGrnRecord[]>([]);
  const [selectedRow, setSelectedRow] = useState<TrackingRow | null>(null);
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [rejectDetailOpen, setRejectDetailOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stageFilter, setStageFilter] = useState<StageKey | "all">("all");
  const [readItems, setReadItems] = useState<Set<string>>(() => loadReadItems());
  const sessionUser = useMemo(() => getSessionUser(), []);

  useEffect(() => {
    const sync = async (): Promise<void> => {
      setLoading(true);
      try {
        await Promise.all([
          hydratePurchaseRequestDrafts(),
          hydratePurchaseOrderDrafts(),
          hydrateSupplierOrderAcknowledgements(),
          hydrateSupplierDeliveries(),
          hydrateSupplierGrns(),
        ]);
        setRequests(loadPurchaseRequestDrafts());
        setOrders(loadPurchaseOrderDrafts());
        setAcks(loadSupplierOrderAcknowledgements());
        setDeliveries(loadSupplierDeliveries());
        setGrns(loadSupplierGrns());
      } finally {
        setLoading(false);
      }
    };

    void sync();
    const handleSync = (): void => {
      void sync();
    };
    const handleReadStatusChange = (): void => {
      setReadItems(loadReadItems());
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("erp-purchase-request-drafts", handleSync);
    window.addEventListener("erp-purchase-order-drafts", handleSync);
    window.addEventListener("erp-supplier-order-acks", handleSync);
    window.addEventListener("erp-supplier-deliveries", handleSync);
    window.addEventListener("erp-supplier-grns", handleSync);
    window.addEventListener("tracking-item-read", handleReadStatusChange);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("erp-purchase-request-drafts", handleSync);
      window.removeEventListener("erp-purchase-order-drafts", handleSync);
      window.removeEventListener("erp-supplier-order-acks", handleSync);
      window.removeEventListener("erp-supplier-deliveries", handleSync);
      window.removeEventListener("erp-supplier-grns", handleSync);
      window.removeEventListener("tracking-item-read", handleReadStatusChange);
    };
  }, []);

  // Listen to Content scroll, enable compact mode when scrolling past a certain distance
  useEffect(() => {
    const handleScroll = () => {
      const contentElement = document.getElementById('main-content');
      if (contentElement) {
        const scrollTop = contentElement.scrollTop;
        // Enable compact mode when scrolling past 50px
        setIsCompact(scrollTop > 50);
      }
    };

    const contentElement = document.getElementById('main-content');
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const trackingRows = useMemo(() => {
    const requestOrdersMap = new Map<string, PurchaseOrderDraft[]>();
    const requestOrderIdsMap = new Map<string, Set<string>>();
    const requestOrderNosMap = new Map<string, Set<string>>();
    const requestAcksMap = new Map<string, SupplierOrderAcknowledgementRecord[]>();
    const requestAckIdsMap = new Map<string, Set<string>>();
    const requestDeliveriesMap = new Map<string, SupplierDeliveryRecord[]>();
    const requestKeyByDeliveryId = new Map<string, string>();
    const requestGrnsMap = new Map<string, SupplierGrnRecord[]>();

    const requestKeyByOrderRef = new Map<string, string>();
    orders.forEach((order) => {
      const requestKey = order.sourceRequestLocalId || `pr:${order.sourcePrNumber}`;
      requestKeyByOrderRef.set(`id:${order.localId}`, requestKey);
      requestKeyByOrderRef.set(`no:${order.poNumber}`, requestKey);

      const requestOrders = requestOrdersMap.get(requestKey) ?? [];
      requestOrders.push(order);
      requestOrdersMap.set(requestKey, requestOrders);

      const requestOrderIds = requestOrderIdsMap.get(requestKey) ?? new Set<string>();
      requestOrderIds.add(order.localId);
      requestOrderIdsMap.set(requestKey, requestOrderIds);

      const requestOrderNos = requestOrderNosMap.get(requestKey) ?? new Set<string>();
      requestOrderNos.add(order.poNumber);
      requestOrderNosMap.set(requestKey, requestOrderNos);
    });

    const requestKeyByAckId = new Map<string, string>();
    acks.forEach((ack) => {
      const requestKey =
        requestKeyByOrderRef.get(`id:${ack.poLocalId}`) ??
        requestKeyByOrderRef.get(`no:${ack.poNumber}`) ??
        "";
      if (!requestKey) return;

      requestKeyByAckId.set(ack.localId, requestKey);
      const requestAcks = requestAcksMap.get(requestKey) ?? [];
      requestAcks.push(ack);
      requestAcksMap.set(requestKey, requestAcks);

      const requestAckIds = requestAckIdsMap.get(requestKey) ?? new Set<string>();
      requestAckIds.add(ack.localId);
      requestAckIdsMap.set(requestKey, requestAckIds);
    });

    deliveries.forEach((delivery) => {
      const requestKey =
        requestKeyByAckId.get(delivery.acknowledgementLocalId) ??
        requestKeyByOrderRef.get(`id:${delivery.poLocalId}`) ??
        requestKeyByOrderRef.get(`no:${delivery.poNumber}`) ??
        "";
      if (!requestKey) return;

      const requestDeliveries = requestDeliveriesMap.get(requestKey) ?? [];
      requestDeliveries.push(delivery);
      requestDeliveriesMap.set(requestKey, requestDeliveries);

      requestKeyByDeliveryId.set(delivery.localId, requestKey);
    });

    grns.forEach((grn) => {
      let requestKey = requestKeyByDeliveryId.get(grn.deliveryLocalId) ?? "";
      if (!requestKey) {
        requestKey =
          requestKeyByOrderRef.get(`id:${grn.poLocalId}`) ??
          requestKeyByOrderRef.get(`no:${grn.poNumber}`) ??
          "";
      }
      if (!requestKey) return;

      const requestGrns = requestGrnsMap.get(requestKey) ?? [];
      requestGrns.push(grn);
      requestGrnsMap.set(requestKey, requestGrns);
    });

    const baseRows = requests
      .filter((request) => {
        // Draft PRs are not finalized and must not appear in tracking.
        if (request.status === "DRAFT") return false;

        if (
          sessionUser?.role === UserRole.ADMIN ||
          sessionUser?.role === UserRole.MANAGER
        ) {
          return true;
        }

        if (sessionUser?.role === UserRole.DEPARTMENT_EXECUTIVE) {
          return true;
        }

        if (sessionUser?.role === UserRole.EMPLOYEE) {
          return (
            request.createdByUserId === sessionUser.id ||
            request.createdByEmail === sessionUser.email
          );
        }

        return false;
      })
      .flatMap((request) => {
        const requestKey = request.localId || `pr:${request.prNumber}`;
        const relatedOrders = requestOrdersMap.get(requestKey) ?? [];
        const relatedAcks = requestAcksMap.get(requestKey) ?? [];
        const relatedDeliveries = requestDeliveriesMap.get(requestKey) ?? [];
        const relatedGrns = requestGrnsMap.get(requestKey) ?? [];

        return (request.lineItems ?? [])
          .map((requestItem) => {
            const stageInfo = getTrackingStage(
              request,
              requestItem.tempId,
              relatedOrders,
              relatedAcks,
              relatedDeliveries,
              relatedGrns,
              t,
            );

            const row: TrackingRow = {
              id: `${request.localId}-${requestItem.tempId}`,
              requestNo: request.prNumber,
              requester: request.requestBy,
              department: request.department || "-",
              itemSummary: requestItem.itemName || "No item",
              itemTempId: requestItem.tempId,
              itemDescription: requestItem.itemDescription || "",
              itemCategory: requestItem.itemCategory || "",
              itemQuantity: requestItem.quantity,
              itemUnit: requestItem.unitOfMeasurement || "",
              itemUnitPrice: requestItem.unitPrice,
              stage: stageInfo.stage,
              isRejected: stageInfo.isRejected,
              rejectionReason:
                request.status === "REJECTED"
                  ? request.rejectionReason
                  : relatedOrders.find((order) => order.status === "REJECTED")?.rejectionReason ||
                    relatedAcks.find((ack) => ack.status === "REJECTED")?.rejectionReason,
              rejectedBy:
                request.status === "REJECTED"
                  ? request.rejectedBy
                  : relatedOrders.find((order) => order.status === "REJECTED")?.rejectedBy ||
                    relatedAcks.find((ack) => ack.status === "REJECTED")?.rejectedBy,
              statusLabel: stageInfo.statusLabel,
              description: "",
              sourceRequest: request,
              purchaseOrders: relatedOrders,
              acknowledgements: relatedAcks,
              deliveries: relatedDeliveries,
              grns: relatedGrns,
            };

            row.description = buildDescription(row, t);
            return row;
          });
      });

    return baseRows.reverse();
  }, [acks, deliveries, grns, orders, requests, sessionUser, t]);

  const filteredTrackingRows = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    const canSearchAll =
      sessionUser?.role === UserRole.ADMIN || sessionUser?.role === UserRole.MANAGER;
    const sessionName = sessionUser?.name?.trim().toLowerCase() || "";
    const sessionEmail = sessionUser?.email?.trim().toLowerCase() || "";
    const sessionId = sessionUser?.id;

    const ownRows = trackingRows.filter((row) => {
      const requester = row.requester.trim().toLowerCase();
      const creatorEmail = row.sourceRequest.createdByEmail?.trim().toLowerCase() || "";
      const creatorId = row.sourceRequest.createdByUserId;
      return (
        (sessionId != null && creatorId != null && String(creatorId) === String(sessionId)) ||
        (!!sessionName && requester === sessionName) ||
        (!!sessionEmail && creatorEmail === sessionEmail)
      );
    });

    if (!keyword) return canSearchAll ? trackingRows : ownRows;

    const searchBase = canSearchAll ? trackingRows : ownRows;

    return searchBase.filter((row) =>
      row.itemSummary.toLowerCase().includes(keyword),
    );
  }, [trackingRows, searchValue, sessionUser]);

  // Calculate stage counts for UNREAD items only
  const stageCounts = useMemo(() => {
    const counts: Record<StageKey, number> = {
      pr: 0,
      po: 0,
      ack: 0,
      delivery: 0,
      grn: 0,
      completed: 0,
    };

    filteredTrackingRows.forEach((row) => {
      // Only count unread items
      if (!readItems.has(row.id)) {
        counts[row.stage] = (counts[row.stage] || 0) + 1;
      }
    });

    return counts;
  }, [filteredTrackingRows, readItems]);

  // Apply stage filter
  const stageFilteredRows = useMemo(() => {
    if (stageFilter === "all") return filteredTrackingRows;
    return filteredTrackingRows.filter((row) => row.stage === stageFilter);
  }, [filteredTrackingRows, stageFilter]);

  const inProgressRows = useMemo(
    () =>
      stageFilteredRows.filter(
        (row) => row.stage !== "completed" && !row.isRejected,
      ),
    [stageFilteredRows],
  );
  const completedRows = useMemo(
    () =>
      stageFilteredRows.filter(
        (row) => row.stage === "completed" || row.isRejected,
      ),
    [stageFilteredRows],
  );

  const focusedRow = useMemo(() => {
    if (!stageFilteredRows.length) return null;
    if (focusedRowId) {
      return stageFilteredRows.find((row) => row.id === focusedRowId) || null;
    }
    return inProgressRows[0] || completedRows[0] || stageFilteredRows[0] || null;
  }, [completedRows, stageFilteredRows, focusedRowId, inProgressRows]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestLocalId = params.get("requestLocalId");
    if (!requestLocalId || !stageFilteredRows.length) return;

    const target = stageFilteredRows.find((row) => row.sourceRequest.localId === requestLocalId);
    if (!target) return;
    setFocusedRowId(target.id);
    setSelectedRow(target);
  }, [stageFilteredRows, location.search]);

  const renderRow = (row: TrackingRow, index: number): React.ReactElement => {
    const isUnread = !readItems.has(row.id);

    return (
      <div
        key={row.id}
        className={[
          styles.trackRow,
          focusedRow?.id === row.id ? styles.trackRowFocused : "",
          isUnread ? styles.trackRowUnread : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          animationDelay: `${index * 0.05}s`,
        }}
        onClick={() => {
          // Make entire row clickable to open detail
          setSelectedRow(row);
          setFocusedRowId(row.id);
          // Mark as read when clicked
          if (isUnread) {
            markItemAsRead(row.id);
          }
        }}
      >
        <div className={styles.rowContent}>
          <div className={styles.rowItemBlock}>
            <div className={styles.rowLabel}>{t('row.item')}</div>
            <div className={styles.rowValue}>
              {isUnread && <span className={styles.unreadDot} />}
              {row.itemSummary}
            </div>
            <div className={styles.rowMeta}>
              {t('row.createdDate')}: {row.sourceRequest.requestDate}
            </div>
          </div>
          <div className={styles.rowStatusBlock}>
            <div className={styles.rowLabel}>{t('row.status')}</div>
            {statusTag(row.statusLabel, t)}
          </div>
          <div className={styles.rowDescriptionBlock}>
            <div className={styles.rowLabel}>{t('row.description')}</div>
            <div className={styles.rowDescription}>{row.description}</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Card className={styles.shell}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Spin size="large" />
            <Typography.Text type="secondary">{t('page.loadingData')}</Typography.Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Card className={styles.shell}>
        <div className={styles.stickyHeader}>
          <Title level={3} className={styles.pageTitle}>
            {t('page.title')}
          </Title>

          <div className={styles.headerSearchRow}>
            <div className={styles.filterInfo}>
              {stageFilter !== "all" && (
                <Button
                  type="default"
                  size="small"
                  onClick={() => setStageFilter("all")}
                  className={styles.clearFilterButton}
                >
                  {t('search.clearFilter')} ({stageCounts[stageFilter]} {t('search.unreadCount')})
                </Button>
              )}
              {Object.values(stageCounts).some(count => count > 0) && (
                <Button
                  type="default"
                  size="small"
                  onClick={() => {
                    const allIds = filteredTrackingRows.map(row => row.id);
                    const newReadItems = new Set(readItems);
                    allIds.forEach(id => newReadItems.add(id));
                    setReadItems(newReadItems);
                    saveReadItems(newReadItems);
                  }}
                  className={styles.markAllReadButton}
                >
                  {t('search.markAllAsRead')}
                </Button>
              )}
            </div>
            <Input
              allowClear
              className={styles.headerSearch}
              placeholder={t('search.placeholder')}
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>

          <TrackingProgress
            activeStage={focusedRow?.stage || "pr"}
            isRejected={focusedRow?.isRejected}
            onRejectedDetailClick={
              focusedRow?.isRejected ? () => setRejectDetailOpen(true) : undefined
            }
            selectedFilter={stageFilter}
            onFilterChange={(stage) => {
              setStageFilter(stage);
              setFocusedRowId(null); // Reset focus when filter changes
            }}
            stageCounts={stageCounts}
            isCompact={isCompact}
            t={t}
          />

          {focusedRow && !isCompact ? (
            <div className={styles.focusedStatusBanner}>
              <Text strong>{focusedRow.requestNo}</Text>
              <span className={styles.focusedDivider}>|</span>
              <span>{focusedRow.itemSummary}</span>
              <span className={styles.focusedDivider}>|</span>
              {statusTag(focusedRow.statusLabel, t)}
              {focusedRow.isRejected ? (
                <>
                  <span className={styles.focusedDivider}>|</span>
                  <Button
                    type="link"
                    danger
                    size="small"
                    className={styles.rejectedDetailButton}
                    onClick={() => setRejectDetailOpen(true)}
                  >
                    {t('modal.viewRejectDetail')}
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className={styles.sectionsWrap}>
          <div className={styles.sectionPanel}>
            <div className={styles.sectionTitle}>{t('sections.inProgress')}</div>
            <div className={styles.rowsWrap}>
              {inProgressRows.length > 0 ? (
                inProgressRows.map((row, index) => renderRow(row, index))
              ) : (
                <Empty description={t('sections.noInProgress')} />
              )}
            </div>
          </div>

          <div className={styles.sectionPanel}>
            <div className={styles.sectionTitle}>{t('sections.completedRejected')}</div>
            <div className={styles.rowsWrap}>
              {completedRows.length > 0 ? (
                completedRows.map((row, index) => renderRow(row, index))
              ) : (
                <Empty description={t('sections.noCompleted')} />
              )}
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={rejectDetailOpen}
        onCancel={() => setRejectDetailOpen(false)}
        footer={null}
        width={560}
        title={t('modal.rejectDetail')}
      >
        {focusedRow?.isRejected ? (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label={t('details.requestNo')}>
              {focusedRow.requestNo}
            </Descriptions.Item>
            <Descriptions.Item label={t('details.item')}>
              {focusedRow.itemSummary}
            </Descriptions.Item>
            <Descriptions.Item label={t('details.rejectedStage')}>
              {focusedRow.stage.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label={t('details.rejectedBy')}>
              {focusedRow.rejectedBy || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t('details.rejectDescription')}>
              {focusedRow.rejectionReason || t('details.noRejectDescription')}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      <Modal
        open={!!selectedRow}
        onCancel={() => setSelectedRow(null)}
        footer={
          <Button onClick={() => setSelectedRow(null)}>
            {t('modal.close')}
          </Button>
        }
        width={920}
        title={t('modal.trackingDetail')}
      >
        {selectedRow ? (
          <Flex vertical gap={20}>
            <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label={t('details.requestNo')}>
                {selectedRow.requestNo}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.item')}>
                {selectedRow.itemSummary}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.requester')}>
                {selectedRow.requester}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.department')}>
                {selectedRow.department}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.currentStatus')}>
                {selectedRow.statusLabel}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.poNumber')}>
                {selectedRow.purchaseOrders.map((row) => row.poNumber).join(", ") || "-"}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.ackNumber')}>
                {selectedRow.acknowledgements
                  .map((row) => row.poNumber)
                  .join(", ") || "-"}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.deliveryNumber')}>
                {selectedRow.deliveries.map((row) => row.deliveryNo || row.poNumber).join(", ") || "-"}
              </Descriptions.Item>
              <Descriptions.Item label={t('details.grnNumber')}>
                {selectedRow.grns.map((row) => row.poNumber).join(", ") || "-"}
              </Descriptions.Item>
              <Descriptions.Item label={t('row.description')} span={2}>
                {selectedRow.description}
              </Descriptions.Item>
              {selectedRow.isRejected ? (
                <>
                  <Descriptions.Item label={t('details.rejectedBy')}>
                    {selectedRow.rejectedBy || "-"}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('details.rejectDescription')}>
                    {selectedRow.rejectionReason || "-"}
                  </Descriptions.Item>
                </>
              ) : null}
            </Descriptions>

            <div className={styles.detailSection}>
              <Text strong>{t('details.trackedItem')}</Text>
              <div className={styles.detailList}>
                <div className={styles.detailCard}>
                  <div className={styles.detailCardTitle}>{selectedRow.itemSummary}</div>
                  <Paragraph className={styles.detailCardParagraph}>
                    {selectedRow.itemDescription || t('details.noDescription')}
                  </Paragraph>
                  <div className={styles.detailMetaRow}>
                    <span>{selectedRow.itemCategory || t('details.uncategorized')}</span>
                    <span>
                      {selectedRow.itemQuantity} {selectedRow.itemUnit}
                    </span>
                    <span>
                      {selectedRow.sourceRequest.currency} {selectedRow.itemUnitPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {(selectedRow.sourceRequest.lineItems ?? []).length > 1 ? (
              <div className={styles.detailSection}>
                <Text strong>{t('details.otherItems')}</Text>
                <div className={styles.detailList}>
                  {(selectedRow.sourceRequest.lineItems ?? [])
                    .filter((item) => item.tempId !== selectedRow.itemTempId)
                    .map((item) => (
                      <div key={item.tempId} className={styles.detailCard}>
                        <div className={styles.detailCardTitle}>{item.itemName}</div>
                        <Paragraph className={styles.detailCardParagraph}>
                          {item.itemDescription || t('details.noDescription')}
                        </Paragraph>
                        <div className={styles.detailMetaRow}>
                          <span>{item.itemCategory || t('details.uncategorized')}</span>
                          <span>
                            {item.quantity} {item.unitOfMeasurement}
                          </span>
                          <span>
                            {selectedRow.sourceRequest.currency} {item.unitPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </Flex>
        ) : null}
      </Modal>
    </div>
  );
}
