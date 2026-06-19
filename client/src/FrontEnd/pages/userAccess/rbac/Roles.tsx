import React, { useEffect, useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Select, Table, message } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { getSessionUser } from "../../../shared/auth/session";
import { API_ROOT } from "../../../shared/api/base";
import { UserRole } from "../../../shared/types/roles";

type ApiUser = {
  id: number;
  name: string | null;
  email: string;
  role: string;
};

type ApiAudit = {
  id: number;
  fromRole: string;
  toRole: string;
  actorEmail: string;
  actorName: string | null;
  createdAt: string;
  target: { id: number; name: string | null; email: string };
};

const API = API_ROOT;

export default function RbacRoles(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("userAccess");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [pendingRoleById, setPendingRoleById] = useState<Record<number, string>>({});
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const [loadingAudits, setLoadingAudits] = useState(false);
  const [audits, setAudits] = useState<ApiAudit[]>([]);

  const roleOptions = useMemo(
    () => Object.values(UserRole).map((r) => ({ value: r, label: r })),
    [],
  );

  const filteredUsers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.name ?? "").toLowerCase().includes(q));
  }, [users, searchText]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${API}/admin/users`);
      if (res.data?.success) setUsers(res.data.users ?? []);
      else message.error(res.data?.message ?? t("rbac.roles.messages.loadUsersFailed"));
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? t("rbac.roles.messages.loadUsersFailed"));
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAudits = async () => {
    setLoadingAudits(true);
    try {
      const res = await axios.get(`${API}/admin/role-change-audits?take=50`);
      if (res.data?.success) setAudits(res.data.audits ?? []);
      else message.error(res.data?.message ?? t("rbac.roles.messages.loadAuditsFailed"));
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? t("rbac.roles.messages.loadAuditsFailed"));
    } finally {
      setLoadingAudits(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadAudits();
  }, []);

  const saveRole = async (u: ApiUser) => {
    const nextRole = pendingRoleById[u.id] ?? u.role;
    if (!nextRole || nextRole === u.role) return;

    const actor = getSessionUser();
    setSavingUserId(u.id);
    try {
      const res = await axios.patch(`${API}/admin/users/${u.id}/role`, {
        role: nextRole,
        actorEmail: actor?.email,
        actorName: actor?.name,
      });
      if (res.data?.success) {
        message.success(t("rbac.roles.messages.updateSuccess"));
        await loadUsers();
        await loadAudits();
        setPendingRoleById((prev) => {
          const copy = { ...prev };
          delete copy[u.id];
          return copy;
        });
      } else {
        message.error(res.data?.message ?? t("rbac.roles.messages.updateFailed"));
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? t("rbac.roles.messages.updateFailed"));
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <Flex vertical gap={12}>
      <Card size="small" title={t("rbac.roles.title")}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Input
            allowClear
            placeholder={t("rbac.roles.search.placeholder")}
            style={{ maxWidth: 360 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
            aria-label="Search users by name"
          />
        </div>
        <Table<ApiUser>
          rowKey="id"
          loading={loadingUsers}
          dataSource={filteredUsers}
          pagination={{ pageSize: 8 }}
          columns={[
            { title: t("rbac.roles.table.id"), dataIndex: "id", width: 80 },
            { title: t("rbac.roles.table.name"), dataIndex: "name", render: (v) => v ?? "-" },
            { title: t("rbac.roles.table.email"), dataIndex: "email" },
            {
              title: t("rbac.roles.table.role"),
              key: "role",
              width: 240,
              render: (_, record) => {
                const value = pendingRoleById[record.id] ?? record.role;
                return (
                  <Select
                    value={value}
                    options={roleOptions}
                    style={{ width: "100%" }}
                    onChange={(v) =>
                      setPendingRoleById((prev) => ({ ...prev, [record.id]: v }))
                    }
                  />
                );
              },
            },
            {
              title: t("rbac.roles.table.action"),
              key: "action",
              width: 120,
              render: (_, record) => {
                const value = pendingRoleById[record.id] ?? record.role;
                const dirty = value !== record.role;
                return (
                  <Button
                    size="small"
                    type="primary"
                    disabled={!dirty}
                    loading={savingUserId === record.id}
                    onClick={() => saveRole(record)}
                  >
                    {t("rbac.roles.actions.save")}
                  </Button>
                );
              },
            },
          ]}
        />
      </Card>

      <Card size="small" title={t("rbac.roleChangeLog.title")}>
        <Table<ApiAudit>
          rowKey="id"
          loading={loadingAudits}
          dataSource={audits}
          pagination={{ pageSize: 8 }}
          columns={[
            {
              title: t("rbac.roleChangeLog.table.time"),
              dataIndex: "createdAt",
              width: 200,
              render: (v: string) => new Date(v).toLocaleString(),
            },
            {
              title: t("rbac.roleChangeLog.table.actor"),
              key: "actor",
              width: 240,
              render: (_, r) => r.actorName ? `${r.actorName} (${r.actorEmail})` : r.actorEmail,
            },
            {
              title: t("rbac.roleChangeLog.table.targetUser"),
              key: "target",
              render: (_, r) =>
                `${r.target.name ?? "-"} (${r.target.email})`,
            },
            { title: t("rbac.roleChangeLog.table.from"), dataIndex: "fromRole", width: 160 },
            { title: t("rbac.roleChangeLog.table.to"), dataIndex: "toRole", width: 160 },
          ]}
        />
      </Card>
    </Flex>
  );
}

