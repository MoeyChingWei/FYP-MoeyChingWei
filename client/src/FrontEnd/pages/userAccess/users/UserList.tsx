import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { DEPARTMENT_OPTIONS } from "../../../shared/constants/departments";
import { API_ROOT } from "../../../shared/api/base";
import { UserRole } from "../../../shared/types/roles";

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

/** Table filter value for rows with no department */
const DEPT_FILTER_EMPTY = "__dept_empty__";

export default function UserList(): React.ReactElement {
  const { t: tMsg } = useTranslation('messages');

  const { t } = useTranslation("userAccess");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiUser[]>([]);
  const [editing, setEditing] = useState<ApiUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const roleOptions = useMemo(
    () => Object.values(UserRole).map((r) => ({ value: r, label: r })),
    [],
  );

  const departmentOptions = useMemo(() => {
    const base = [...DEPARTMENT_OPTIONS];
    const d = editing?.department?.trim();
    if (d && !base.some((o) => o.value === d)) {
      base.unshift({ value: d, label: d });
    }
    return base;
  }, [editing]);

  const departmentColumnFilters = useMemo(() => {
    const filters: { text: string; value: string }[] = [];
    if (data.some((r) => !r.department?.trim())) {
      filters.push({ text: t("userList.table.noDepartment"), value: DEPT_FILTER_EMPTY });
    }
    const seen = new Set<string>();
    for (const o of DEPARTMENT_OPTIONS) {
      filters.push({ text: o.label, value: o.value });
      seen.add(o.value);
    }
    for (const row of data) {
      const d = row.department?.trim();
      if (d && !seen.has(d)) {
        filters.push({ text: d, value: d });
        seen.add(d);
      }
    }
    return filters;
  }, [data, t]);

  const roleColumnFilters = useMemo(() => {
    const filters: { text: string; value: string }[] = Object.values(UserRole).map(
      (r) => ({ text: r, value: r }),
    );
    const seen = new Set<string>(Object.values(UserRole));
    for (const row of data) {
      const r = row.role?.trim();
      if (r && !seen.has(r)) {
        filters.push({ text: r, value: r });
        seen.add(r);
      }
    }
    return filters;
  }, [data]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/users`);
      if (res.data?.success) setData(res.data.users ?? []);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? t("userList.messages.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        await load();
      } catch (err: any) {
        if (!cancelled) {
          message.error(err?.response?.data?.message ?? t("userList.messages.loadFailed"));
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const openEdit = (u: ApiUser) => {
    setEditing(u);
    form.setFieldsValue({
      name: u.name ?? "",
      email: u.email,
      role: u.role,
      department: u.department?.trim() || undefined,
      password: "",
    });
  };

  const saveEdit = async () => {
    const values = await form.validateFields();
    if (!editing) return;

    const payload: Record<string, unknown> = {
      name: values.name,
      email: values.email,
      department:
        values.department == null || String(values.department).trim() === ""
          ? null
          : String(values.department).trim(),
    };
    if (values.password && String(values.password).length > 0) {
      payload.password = values.password;
    }

    setSaving(true);
    try {
      const res = await axios.put(`${API}/admin/users/${editing.id}`, payload);
      if (res.data?.success) {
        message.success(t("userList.messages.updateSuccess"));
        setEditing(null);
        await load();
      } else {
        message.error(res.data?.message ?? t("userList.messages.updateFailed"));
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? t("userList.messages.updateFailed"));
    } finally {
      setSaving(false);
    }
  };

  const setActive = async (u: ApiUser, isActive: boolean) => {
    setStatusLoadingId(u.id);
    try {
      const res = await axios.patch(`${API}/admin/users/${u.id}/status`, {
        isActive,
      });
      if (res.data?.success) {
        message.success(isActive ? t("userList.messages.activateSuccess") : t("userList.messages.deactivateSuccess"));
        await load();
      } else {
        message.error(res.data?.message ?? t("userList.messages.statusUpdateFailed"));
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? t("userList.messages.statusUpdateFailed"));
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <Card size="small" title={t("userList.title")}>
      <Table<ApiUser>
        style={{ marginTop: 12 }}
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 8 }}
        columns={[
          { title: t("userList.table.name"), dataIndex: "name", render: (v) => v ?? "-" },
          { title: t("userList.table.email"), dataIndex: "email" },
          {
            title: t("userList.table.department"),
            dataIndex: "department",
            width: 160,
            render: (v) => v ?? "-",
            filters: departmentColumnFilters,
            filterSearch: true,
            onFilter: (value, record) => {
              if (value === DEPT_FILTER_EMPTY) {
                return !record.department?.trim();
              }
              return (record.department?.trim() ?? "") === String(value);
            },
          },
          {
            title: t("userList.table.role"),
            dataIndex: "role",
            width: 220,
            render: (role) => <Tag color="blue">{role}</Tag>,
            filters: roleColumnFilters,
            filterSearch: true,
            onFilter: (value, record) => record.role === value,
          },
          {
            title: t("userList.table.status"),
            dataIndex: "isActive",
            width: 100,
            render: (active: boolean) =>
              active ? <Tag color="green">{t("userList.status.active")}</Tag> : <Tag color="red">{t("userList.status.inactive")}</Tag>,
          },
          {
            title: t("userList.table.action"),
            key: "action",
            width: 280,
            render: (_, record) => (
              <Space size="small" wrap>
                <Button size="small" onClick={() => openEdit(record)}>
                  {t("userList.actions.edit")}
                </Button>
                {record.isActive ? (
                  <Popconfirm
                    title={t("userList.modal.deactivateConfirm")}
                    description={t("userList.modal.deactivateDescription")}
                    okText={t("userList.actions.deactivate")}
                    cancelText={t("userList.modal.cancel")}
                    onConfirm={() => setActive(record, false)}
                  >
                    <Button
                      size="small"
                      danger
                      loading={statusLoadingId === record.id}
                    >
                      {t("userList.actions.deactivate")}
                    </Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title={t("userList.modal.activateConfirm")}
                    okText={t("userList.actions.activate")}
                    cancelText={t("userList.modal.cancel")}
                    onConfirm={() => setActive(record, true)}
                  >
                    <Button
                      size="small"
                      type="primary"
                      loading={statusLoadingId === record.id}
                    >
                      {t("userList.actions.activate")}
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={!!editing}
        title={editing ? t("userList.modal.editTitle", { id: editing.id }) : t("userList.modal.editTitleGeneric")}
        onCancel={() => setEditing(null)}
        footer={[
          <Button key="cancel" onClick={() => setEditing(null)}>
            {t("userList.modal.cancel")}
          </Button>,
          <Button key="save" type="primary" loading={saving} onClick={saveEdit}>
            {t("userList.modal.save")}
          </Button>,
        ]}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t("userList.form.name")}
            name="name"
            rules={[{ required: true, message: t("userList.form.validation.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("userList.form.email")}
            name="email"
            rules={[
              { required: true, message: t("userList.form.validation.emailRequired") },
              { type: "email", message: t("userList.form.validation.emailInvalid") },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t("userList.form.department")} name="department">
            <Select
              allowClear
              placeholder={t("userList.form.placeholders.department")}
              options={departmentOptions}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            label={t("userList.form.role")}
            name="role"
            rules={[{ required: true, message: t("userList.form.validation.roleRequired") }]}
          >
            <Select options={roleOptions} disabled />
          </Form.Item>
          <Form.Item
            label={t("userList.form.password")}
            name="password"
            rules={[{ min: 6, message: t("userList.form.validation.passwordMinLength") }]}
          >
            <Input.Password placeholder={t("userList.form.placeholders.password")} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
