import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getSessionUser } from "../shared/auth/session";
import { API_ROOT } from "../shared/api/base";

const { Title, Text } = Typography;

const API = API_ROOT;

type FormValues = {
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfileResetPassword(): React.ReactElement {
  const { t } = useTranslation('profile');
  const { t: tMsg } = useTranslation('messages');
  const { t: tVal } = useTranslation('validation');
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      message.warning(tMsg('warning.unsavedChanges'));
      navigate("/login", { replace: true });
      return;
    }
    setEmail(u.email);
  }, [navigate, tMsg]);

  const sendCode = async () => {
    if (!email) return;
    setSending(true);
    try {
      const res = await axios.post(`${API}/forgot-password`, { email });
      if (res.data?.success) {
        message.success(
          res.data.message ??
            tMsg('success.emailSent'),
        );
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tMsg('error.send');
      message.error(msg);
    } finally {
      setSending(false);
    }
  };

  const onFinish = async (values: FormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(tVal('password.match'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/reset-password`, {
        email,
        code: values.code,
        newPassword: values.newPassword,
      });
      if (res.data?.success) {
        message.success(res.data.message ?? tMsg('success.passwordReset'));
        navigate("/profile", { replace: true });
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tMsg('error.update');
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex vertical gap={16}>
      <div>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/profile")}
          style={{ paddingLeft: 0, marginBottom: 8 }}
        >
          {t('resetPassword.backToProfile')}
        </Button>
        <Title level={3} style={{ marginBottom: 4 }}>
          {t('resetPassword.title')}
        </Title>
        <Text type="secondary">
          {t('resetPassword.subtitle')}
        </Text>
      </div>

      <Card style={{ maxWidth: 480 }}>
        <Flex vertical gap={16}>
          <div>
            <Text type="secondary">{t('resetPassword.accountEmail')}</Text>
            <div>
              <Text strong>{email || "—"}</Text>
            </div>
          </div>
          <Button onClick={sendCode} loading={sending} disabled={!email}>
            {t('resetPassword.sendCode')}
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('resetPassword.smtpNote')}
          </Text>

          <Form<FormValues>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label={t('resetPassword.verificationCodeLabel')}
              name="code"
              rules={[{ required: true, message: tVal('required') }]}
            >
              <Input
                placeholder={t('resetPassword.verificationCodePlaceholder')}
                maxLength={6}
                style={{ letterSpacing: "0.25em" }}
              />
            </Form.Item>
            <Form.Item
              label={t('resetPassword.newPasswordLabel')}
              name="newPassword"
              rules={[
                { required: true, message: tVal('password.required') },
                { min: 6, message: tVal('password.minLength', { min: 6 }) },
              ]}
            >
              <Input.Password placeholder={t('resetPassword.newPasswordPlaceholder')} />
            </Form.Item>
            <Form.Item
              label={t('resetPassword.confirmPasswordLabel')}
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: tVal('password.confirmRequired') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(tVal('password.match')),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder={t('resetPassword.confirmPasswordPlaceholder')} />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                {t('resetPassword.updateButton')}
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
    </Flex>
  );
}
