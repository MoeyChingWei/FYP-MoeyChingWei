import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, Space, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { API_ROOT } from "../shared/api/base";

const { Title, Text } = Typography;

interface ForgotFormValues {
  email: string;
}

const API = API_ROOT;

declare const __APP_ENV__: Record<string, string | undefined> | undefined;

function readRecaptchaSiteKey(): string {
  if (typeof __APP_ENV__ !== "undefined" && __APP_ENV__) {
    return String(__APP_ENV__.REACT_APP_RECAPTCHA_SITE_KEY ?? "").trim();
  }
  const maybeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return String(maybeProcess?.env?.REACT_APP_RECAPTCHA_SITE_KEY ?? "").trim();
}

export default function ForgetPasswordPage(): React.ReactElement {
  const { t: tAuth } = useTranslation('auth');
  const { t: tCommon } = useTranslation('common');
  const { t: tMsg } = useTranslation('messages');
  const { t: tVal } = useTranslation('validation');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");

  const siteKey = useMemo(
    () => readRecaptchaSiteKey(),
    [],
  );
  const captchaEnabled = siteKey.length > 0;

  const onFinish = async (values: ForgotFormValues) => {
    try {
      setSubmitting(true);

      const res = await axios.post(`${API}/forgot-password`, {
        email: values.email,
        captchaToken: captchaEnabled ? captchaToken : undefined,
      });

      if (res.data.success) {
        message.success(tMsg('success.emailSent'));
        navigate("/reset-password", {
          state: { email: values.email.trim() },
        });
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tMsg('error.networkError');
      message.error(msg);
    } finally {
      setCaptchaToken("");
      setSubmitting(false);
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
            onClick={() => navigate("/login")}
            style={{ paddingLeft: 0, marginBottom: 8 }}
          >
            {tAuth('backToLogin')}
          </Button>

          <div>
            <Title level={3} style={{ marginBottom: 4 }}>
              {tAuth('forgotPassword.title')}
            </Title>
            <Text type="secondary">
              {tAuth('forgotPassword.subtitle')}
            </Text>
          </div>

          <Form<ForgotFormValues>
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

            <div style={{ marginBottom: 12 }}>
              {captchaEnabled ? (
                <ReCAPTCHA
                  sitekey={siteKey}
                  hl="en"
                  onChange={(t) => setCaptchaToken(t ?? "")}
                  onExpired={() => setCaptchaToken("")}
                />
              ) : (
                <Text type="secondary">
                  {tAuth('config.recaptchaNotConfigured')}
                </Text>
              )}
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                disabled={captchaEnabled && captchaToken.length === 0}
              >
                {tAuth('forgotPassword.submitButton')}
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
            {tAuth('forgotPassword.rememberPassword')}{" "}
            <Link to="/login">{tAuth('signIn')}</Link>
          </Text>
        </Space>
      </Card>
    </div>
  );
}
