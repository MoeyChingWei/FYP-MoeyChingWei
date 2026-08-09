import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../../shared/auth/session";
import {
  fetchFeedbacks,
  submitFeedback,
  type FeedbackRow,
  type FeedbackType,
} from "../../shared/api/feedback";

const { Title, Text } = Typography;

type FormValues = {
  type: FeedbackType;
  description: string;
};

export default function FeedbackSubmodule(): React.ReactElement {
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const { t: tMsg } = useTranslation('messages');
  const { t: tVal } = useTranslation('validation');
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<FeedbackRow[]>([]);

  const load = async () => {
    if (!sessionUser?.id || !sessionUser.email) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchFeedbacks(sessionUser);
      setRows(data);
    } catch (err: any) {
      message.error(err?.message ?? tMsg('loadFeedbackFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onFinish = async (values: FormValues) => {
    if (!sessionUser?.id) {
      message.error(tMsg('pleaseSignInFirst'));
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback({
        userId: sessionUser.id,
        email: sessionUser.email,
        type: values.type,
        description: values.description.trim(),
      });
      message.success(tMsg('feedbackSubmitted'));
      form.resetFields();
      await load();
    } catch (err: any) {
      message.error(err?.message ?? tMsg('submitFeedbackFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Card>
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/settings")}
            style={{ paddingInline: 0 }}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>{tSettings('feedback.title')}</Title>
            <Text type="secondary">
              {tSettings('feedback.subtitle')}
            </Text>
          </div>
        </Space>
      </Card>

      <Card title={tSettings('feedback.submitTitle')}>
        <Form<FormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => void onFinish(values)}
          initialValues={{ type: "ISSUE" }}
        >
          <Form.Item
            label={tSettings('feedback.typeLabel')}
            name="type"
            rules={[{ required: true, message: tVal('feedback.typeRequired') }]}
          >
            <Select
              options={[
                { value: "ISSUE", label: tSettings('feedback.type.issue') },
                { value: "IMPROVEMENT", label: tSettings('feedback.type.improvement') },
                { value: "COMMENT", label: tSettings('feedback.type.comment') },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={tSettings('feedback.descriptionLabel')}
            name="description"
            rules={[
              { required: true, message: tVal('feedback.descriptionRequired') },
              { min: 5, message: tVal('feedback.minLength') },
            ]}
          >
            <Input.TextArea rows={5} placeholder={tSettings('feedback.descriptionPlaceholder')} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {tCommon('buttons.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={tSettings('feedback.allFeedbackTitle')}>
        <Table<FeedbackRow>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          pagination={{ pageSize: 8 }}
          columns={[
            {
              title: tSettings('feedback.table.type'),
              dataIndex: "type",
              width: 140,
              render: (v: string) => <Tag>{v}</Tag>,
            },
            {
              title: tSettings('feedback.table.description'),
              dataIndex: "description",
            },
            {
              title: tSettings('feedback.table.from'),
              key: "from",
              width: 240,
              render: (_, row) =>
                `${row.user?.name ?? "-"} (${row.user?.email ?? "Unknown"})`,
            },
            {
              title: tSettings('feedback.table.status'),
              dataIndex: "status",
              width: 120,
              render: (v: string) => <Tag color={v === "OPEN" ? "orange" : "green"}>{v}</Tag>,
            },
            {
              title: tSettings('feedback.table.created'),
              dataIndex: "createdAt",
              width: 180,
              render: (v: string) => new Date(v).toLocaleString(),
            },
          ]}
        />
      </Card>
    </Space>
  );
}
