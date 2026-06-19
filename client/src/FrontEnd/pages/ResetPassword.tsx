import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Space,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { API_ROOT } from "../shared/api/base";

const { Title, Text } = Typography;

interface ResetFormValues {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

const API = API_ROOT;

export default function ResetPasswordPage(): React.ReactElement {
  const { t: tAuth } = useTranslation('auth');
  const { t: tCommon } = useTranslation('common');
  const { t: tMsg } = useTranslation('messages');
  const { t: tVal } = useTranslation('validation');
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const emailFromState = (location.state as { email?: string } | null)?.email;

  useEffect(() => {
    if (emailFromState) {
      form.setFieldsValue({ email: emailFromState });
    }
  }, [emailFromState, form]);

  const onFinish = async (values: ResetFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(tVal('password.match'));
      return;
    }

    try {
      const res = await axios.post(`${API}/reset-password`, {
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
      });

      if (res.data.success) {
        message.success(res.data.message || tMsg('success.passwordReset'));
        navigate("/login");
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tMsg('error.operationFailed');
      message.error(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(24, 24, 27, 0.08), transparent), #fafafa",
        padding: 16,
      }}
    >
      <Card
        style={{
          width: 400,
          border: "1px solid #e4e4e7",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
        }}
        bordered={false}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/forgot-password")}
            style={{ paddingLeft: 0, marginBottom: 8 }}
          >
            {tCommon('buttons.back')}
          </Button>

          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              {tAuth('resetPassword.title')}
            </Title>
            <Text type="secondary">
              {tAuth('resetPassword.subtitle')}
            </Text>
          </div>

          <Form<ResetFormValues>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label={tCommon('labels.email')}
              name="email"
              rules={[
                { required: true, message: tVal('email.required') },
                { type: "email", message: tVal('email.format') },
              ]}
            >
              <Input placeholder={tAuth('forgotPassword.emailPlaceholder')} />
            </Form.Item>

            <Form.Item
              label={tAuth('resetPassword.codeLabel')}
              name="code"
              rules={[{ required: true, message: tVal('code.required') }]}
            >
              <Input
                placeholder={tAuth('resetPassword.codePlaceholder')}
                maxLength={6}
                style={{ letterSpacing: "0.25em" }}
              />
            </Form.Item>

            <Form.Item
              label={tCommon('newPassword')}
              name="newPassword"
              rules={[
                { required: true, message: tVal('password.required') },
                { min: 6, message: tVal('string.minLength', { min: 6 }) },
              ]}
            >
              <Input.Password placeholder={tCommon('newPassword')} />
            </Form.Item>

            <Form.Item
              label={tCommon('confirmPassword')}
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: tVal('confirmPassword.required') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(tVal('password.mismatch')),
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder={tCommon('confirmPassword')} />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block>
                {tAuth('resetPassword.submitButton')}
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
            <Link to="/login">{tAuth('backToSignIn')}</Link>
          </Text>
        </Space>
      </Card>
    </div>
  );
}
