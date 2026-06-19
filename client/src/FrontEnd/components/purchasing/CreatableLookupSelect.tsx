import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Divider, Input, Select, Space, message } from "antd";
import axios from "axios";

import type { PurchasingLookupKind } from "../../shared/api/purchasingLookups";
import { useTranslation } from "react-i18next";
import {
  createPurchasingLookup,
  fetchPurchasingLookups,
  mergePurchasingOptions,
} from "../../shared/api/purchasingLookups";

export interface CreatableLookupSelectProps {
  kind: PurchasingLookupKind;
  value?: string;
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Single-value select with built-in options plus server-stored custom values.
 * Footer lets users add a new value (saved to DB) and selects it.
 */
export default function CreatableLookupSelect({
  kind,
  value,
  onChange,
  placeholder,
  disabled,
}: CreatableLookupSelectProps): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const [customRows, setCustomRows] = useState<
    { id: number; value: string; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [addDraft, setAddDraft] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const rows = await fetchPurchasingLookups(kind);
      setCustomRows(rows);
    } catch {
      setCustomRows([]);
      message.warning(tMsg('warning.general'));
    }
  }, [kind]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void load().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const options = useMemo(
    () => mergePurchasingOptions(kind, customRows),
    [kind, customRows],
  );

  const selectOptions = useMemo(
    () => options.map((v) => ({ label: v, value: v })),
    [options],
  );

  const handleAdd = async (): Promise<void> => {
    const v = addDraft.trim();
    if (!v) {
      message.info(tMsg('info.general'));
      return;
    }
    const lower = v.toLowerCase();
    if (options.some((o) => o.toLowerCase() === lower)) {
      message.info(tMsg('info.general'));
      onChange?.(v);
      setAddDraft("");
      return;
    }
    setAdding(true);
    try {
      await createPurchasingLookup(kind, v);
      await load();
      onChange?.(v);
      setAddDraft("");
      message.success(tMsg('success.save'));
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Could not save";
      message.error(msg);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Select
      showSearch
      allowClear
      disabled={disabled}
      loading={loading}
      placeholder={placeholder}
      options={selectOptions}
      value={value}
      onChange={onChange}
      optionFilterProp="label"
      popupRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space.Compact
            style={{ display: "flex", width: "100%", padding: "0 8px 8px" }}
          >
            <Input
              placeholder="Add new…"
              value={addDraft}
              onChange={(e) => setAddDraft(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              disabled={adding}
              onPressEnter={() => void handleAdd()}
            />
            <Button
              type="primary"
              loading={adding}
              onClick={() => void handleAdd()}
            >
              Add
            </Button>
          </Space.Compact>
        </>
      )}
    />
  );
}
