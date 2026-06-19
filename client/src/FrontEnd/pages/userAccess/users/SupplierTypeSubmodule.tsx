import React, { useEffect, useMemo, useState } from "react";
import { Card, Select, Space, Table, Tag, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { ITEM_CATEGORIES } from "../../../modules/purchasing/requestCreation/constants";
import {
  fetchSupplierTypeMap,
  updateSupplierTypes,
  type SupplierTypeMap,
} from "../../../shared/api/supplierTypes";
import { API_ROOT } from "../../../shared/api/base";
import { UserRole } from "../../../shared/types/roles";

const { Text } = Typography;

type ApiUser = {
  id: number;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  avatarUrl: string | null;
  isActive: boolean;
};

const API = API_ROOT;

export default function SupplierTypeSubmodule(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("userAccess");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [typeMap, setTypeMap] = useState<SupplierTypeMap>({});

  useEffect(() => {
    let cancelled = false;

    async function loadData(): Promise<void> {
      setLoading(true);
      try {
        const [usersRes, supplierTypeMap] = await Promise.all([
          axios.get(`${API}/admin/users`),
          fetchSupplierTypeMap(),
        ]);
        if (!cancelled && usersRes.data?.success) {
          setUsers(usersRes.data.users ?? []);
          setTypeMap(supplierTypeMap);
        }
      } catch (err: any) {
        if (!cancelled) {
          message.error(
            err?.response?.data?.message ?? err?.message ?? t("supplierTypes.messages.loadFailed"),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const supplierUsers = useMemo(
    () => users.filter((user) => user.role === UserRole.SUPPLIER),
    [users],
  );

  const categoryOptions = useMemo(
    () => ITEM_CATEGORIES.map((category) => ({ value: category, label: category })),
    [],
  );

  const onChangeTypes = async (userId: number, values: string[]): Promise<void> => {
    try {
      const savedCategories = await updateSupplierTypes(userId, values);
      setTypeMap((current) => ({
        ...current,
        [String(userId)]: savedCategories,
      }));
      message.success(t("supplierTypes.messages.updateSuccess"));
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ?? err?.message ?? t("supplierTypes.messages.updateFailed"),
      );
    }
  };

  return (
    <Card size="small" title={t("supplierTypes.title")}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Text type="secondary">
          {t("supplierTypes.description")}
        </Text>

        <Table<ApiUser>
          rowKey="id"
          loading={loading}
          dataSource={supplierUsers}
          pagination={{ pageSize: 8 }}
          locale={{
            emptyText: t("supplierTypes.messages.noSuppliers"),
          }}
          columns={[
            {
              title: t("supplierTypes.table.supplier"),
              key: "supplier",
              render: (_, user) => (
                <Space direction="vertical" size={0}>
                  <Text strong>{user.name ?? "-"}</Text>
                  <Text type="secondary">{user.email}</Text>
                </Space>
              ),
            },
            {
              title: t("supplierTypes.table.department"),
              dataIndex: "department",
              key: "department",
              render: (value?: string | null) => value || "-",
              width: 180,
            },
            {
              title: t("supplierTypes.table.status"),
              dataIndex: "isActive",
              key: "isActive",
              width: 120,
              render: (active: boolean) =>
                active ? <Tag color="green">{t("supplierTypes.status.active")}</Tag> : <Tag color="red">{t("supplierTypes.status.inactive")}</Tag>,
            },
            {
              title: t("supplierTypes.table.supplierTypes"),
              key: "supplierTypes",
              render: (_, user) => (
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder={t("supplierTypes.placeholders.selectSupplierTypes")}
                  options={categoryOptions}
                  value={typeMap[String(user.id)] ?? []}
                  onChange={(values) => void onChangeTypes(user.id, values)}
                  optionFilterProp="label"
                />
              ),
            },
          ]}
        />
      </Space>
    </Card>
  );
}
