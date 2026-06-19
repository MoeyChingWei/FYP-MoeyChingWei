import React, { useState } from "react";
import { Button, Card, Form, Input, Select, Space, message } from "antd";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { DEPARTMENT_OPTIONS } from "../../../shared/constants/departments";
import { API_ROOT } from "../../../shared/api/base";
import { UserRole } from "../../../shared/types/roles";

type FormValues = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
};

const API = API_ROOT;

export default function CreateUser(): React.ReactElement {
  const { t } = useTranslation("userAccess");
  const { t: tMsg } = useTranslation('messages');
  const { t: tVal } = useTranslation('validation');
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/admin/users`, values);
      if (res.data?.success) {
        message.success(tMsg('success.create'));
        form.resetFields();
      } else {
        message.error(res.data?.message ?? tMsg('error.create'));
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? tMsg('error.create'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card size="small" title={t("createUser.title")}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Form<FormValues> form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={t("createUser.form.name")}
            name="name"
            rules={[{ required: true, message: tVal('name.required') }]}
          >
            <Input placeholder={t("createUser.form.placeholders.name")} />
          </Form.Item>

          <Form.Item
            label={t("createUser.form.email")}
            name="email"
            rules={[
              { required: true, message: tVal('email.required') },
              { type: "email", message: tVal('email.invalid') },
            ]}
          >
            <Input placeholder={t("createUser.form.placeholders.email")} />
          </Form.Item>

          <Form.Item
            label={t("createUser.form.password")}
            name="password"
            rules={[
              { required: true, message: tVal('password.required') },
              { min: 6, message: tVal('password.minLength', { min: 6 }) },
            ]}
          >
            <Input.Password placeholder={t("createUser.form.placeholders.password")} />
          </Form.Item>

          <Form.Item label={t("createUser.form.department")} name="department">
            <Select
              allowClear
              placeholder={t("createUser.form.placeholders.department")}
              options={DEPARTMENT_OPTIONS}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            label={t("createUser.form.role")}
            name="role"
            initialValue={UserRole.EMPLOYEE}
            rules={[{ required: true, message: tVal('role.required') }]}
          >
            <Select
              options={Object.values(UserRole).map((r) => ({ value: r, label: r }))}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {t("createUser.actions.create")}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
}

