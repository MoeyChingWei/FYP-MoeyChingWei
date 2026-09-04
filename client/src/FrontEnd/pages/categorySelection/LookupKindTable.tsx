import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

import type { PurchasingLookupKind } from "../../shared/api/purchasingLookups";
import { useTranslation } from "react-i18next";
import {
  createPurchasingLookup,
  defaultOptionsForKind,
  deletePurchasingLookup,
  fetchPurchasingLookups,
  PURCHASING_LOOKUPS_UPDATED_EVENT,
} from "../../shared/api/purchasingLookups";

export interface LookupKindTableProps {
  kind: PurchasingLookupKind;
}

export default function LookupKindTable({
  kind,
}: LookupKindTableProps): React.ReactElement {
  const { t: tLookup } = useTranslation('lookupTable');
  const { t: tCommon } = useTranslation('common');
  const { t: tMsg } = useTranslation('messages');
  const { t: tPurchasing } = useTranslation('purchasing');

  const displayValue = (value: string): string => {
    if (kind !== "PAYMENT_TERM") return value;
    return tPurchasing(`purchaseRequest.creation.form.paymentTermOptions.${value}`, {
      defaultValue: value,
    });
  };

  const builtIns = useMemo(() => [...defaultOptionsForKind(kind)], [kind]);
  const [customRows, setCustomRows] = useState<
    { id: number; value: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [newValue, setNewValue] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const rows = await fetchPurchasingLookups(kind);
    setCustomRows(rows);
  }, [kind]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void load()
      .catch((err) => {
        if (!cancelled) {
          const msg =
            axios.isAxiosError(err) && err.response?.data?.message
              ? String(err.response.data.message)
              : tLookup('error.couldNotLoad');
          message.error({ content: msg, duration: 3 });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  useEffect(() => {
    const refreshIfSameKind = (event: Event) => {
      const changedKind = (event as CustomEvent<{ kind?: PurchasingLookupKind }>).detail?.kind;
      if (changedKind === kind) void load();
    };
    window.addEventListener(PURCHASING_LOOKUPS_UPDATED_EVENT, refreshIfSameKind);
    return () => window.removeEventListener(PURCHASING_LOOKUPS_UPDATED_EVENT, refreshIfSameKind);
  }, [kind, load]);

  const dataSource = useMemo(() => {
    const builtRows = builtIns.map((value) => ({
      key: `b:${value}`,
      value,
      source: tLookup('source.builtin'),
      id: undefined as number | undefined,
    }));
    const customOnly = customRows.filter(
      (r) =>
        !builtIns.some(
          (b) => b.toLowerCase() === String(r.value).trim().toLowerCase(),
        ),
    );
    const customTableRows = customOnly.map((r) => ({
      key: `c:${r.id}`,
      value: r.value,
      source: tLookup('source.added'),
      id: r.id,
    }));
    return [...builtRows, ...customTableRows];
  }, [builtIns, customRows, tLookup]);

  const onAdd = async (): Promise<void> => {
    const v = newValue.trim();
    if (!v) {
      message.info(tMsg('info.general'));
      return;
    }
    if (dataSource.some((r) => r.value.toLowerCase() === v.toLowerCase())) {
      message.info(tMsg('info.general'));
      return;
    }
    setAdding(true);
    try {
      await createPurchasingLookup(kind, v);
      setNewValue("");
      message.success(tMsg('success.save'));
      await load();
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tLookup('error.couldNotAdd');
      message.error({ content: msg, duration: 3 });
    } finally {
      setAdding(false);
    }
  };

  const onDelete = async (id: number): Promise<void> => {
    try {
      await deletePurchasingLookup(id, kind);
      message.success(tMsg('success.save'));
      await load();
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tLookup('error.couldNotDelete');
      message.error({ content: msg, duration: 3 });
    }
  };

  const deleteIconForRow = (row: {
    id?: number;
    source: string;
  }): React.ReactElement => {
    if (row.id != null) {
      return (
        <Tooltip title={tLookup('tooltip.delete')}>
          <Popconfirm
            title={tLookup('confirm.removeTitle')}
            okText={tCommon('buttons.delete')}
            cancelText={tCommon('buttons.cancel')}
            onConfirm={() => void onDelete(row.id!)}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined style={{ fontSize: 16 }} />}
              aria-label={tCommon('buttons.delete')}
            />
          </Popconfirm>
        </Tooltip>
      );
    }
    return (
      <Tooltip title={tLookup('tooltip.cannotDelete')}>
        <span>
          <Button
            type="text"
            size="small"
            disabled
            icon={<DeleteOutlined style={{ fontSize: 16, opacity: 0.35 }} />}
            aria-label={tLookup('aria.cannotDelete')}
          />
        </span>
      </Tooltip>
    );
  };

  return (
    <Flex vertical gap={16}>
      <Space.Compact style={{ maxWidth: 480 }}>
        <Input
          placeholder={tLookup('newValuePlaceholder')}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onPressEnter={() => void onAdd()}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          loading={adding}
          onClick={() => void onAdd()}
        >
          {tCommon('buttons.add')}
        </Button>
      </Space.Compact>
      <Table
        size="small"
        loading={loading}
        pagination={false}
        dataSource={dataSource}
        columns={[
          {
            title: tLookup('columns.value'),
            dataIndex: "value",
            key: "value",
            render: (value: string) => displayValue(value),
          },
          { title: tLookup('columns.source'), dataIndex: "source", key: "source", width: 120 },
          {
            title: tLookup('columns.actions'),
            key: "actions",
            width: 88,
            align: "center" as const,
            render: (_, row) => deleteIconForRow(row),
          },
        ]}
      />
    </Flex>
  );
}
