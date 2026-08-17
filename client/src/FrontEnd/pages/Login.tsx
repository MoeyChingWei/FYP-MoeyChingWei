import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Space,
  Divider,
} from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";

import styles from "./Login.module.css";
import { setSessionUser, type SessionUser } from "../shared/auth/session";
import { API_ROOT } from "../shared/api/base";
import { LanguageService } from "../services/languageService";

const { Title, Text, Link } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const onFinish = async (values: LoginFormValues) => {
    try {

      const res = await axios.post(`${API_ROOT}/login`, {
        email: values.email,
        password: values.password,
      });

      if (res.data.success) {
        if (res.data.user) {
          const u = res.data.user as SessionUser;
          setSessionUser(u);

          // Sync language preference on login
          try {
            const userLanguage = await LanguageService.getUserLanguage(u.id, u.email);
            await i18n.changeLanguage(userLanguage);
            localStorage.setItem('i18nextLng', userLanguage);
          } catch (error) {
            console.error('Failed to sync language on login:', error);
            // Continue with default language
          }
        }
        navigate("/dashboard");
      }

    } catch (error) {
      alert(t('login.errorInvalidCredentials'));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgLayer} aria-hidden>
        <div className={styles.grid} />
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
        <div className={styles.shimmer} />
      </div>

      <div className={styles.cardWrap}>
        <Card className={styles.card} variant="borderless">
          <Space orientation="vertical" style={{ width: "100%" }} size={16}>
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ marginBottom: 4 }}>
                OptiMind
              </Title>
              <Text type="secondary">
                Please sign in to access approval requests.
              </Text>
            </div>

            <Form<LoginFormValues> layout="vertical" onFinish={onFinish}>
              <Form.Item
                label={t('login.emailLabel')}
                name="email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input placeholder={t('login.emailPlaceholder')} />
              </Form.Item>

              <Form.Item
                label={t('login.passwordLabel')}
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password placeholder={t('login.passwordPlaceholder')} />
              </Form.Item>

              <Form.Item style={{ marginBottom: 16 }}>
                <div className={styles.linkRow}>
                <Button
                  type="link"
                  onClick={() => navigate("/forgot-password")}
                  style={{ padding: 0, height: "auto", marginLeft: "auto" }}
                >
                  {t('login.forgotPassword')}
                </Button>
                </div>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" block>
                  {t('login.submitButton')}
                </Button>
              </Form.Item>
            </Form>

            <Divider plain style={{ margin: "16px 0" }}>
              <Text type="secondary">New to this portal?</Text>
            </Divider>

            <Space
              orientation="vertical"
              style={{ width: "100%", textAlign: "center" }}
              size={8}
            >
              <Text type="secondary">
                Staff accounts are provisioned by your administrator.
              </Text>
              <Text type="secondary">
                If you need access, please{" "}
                <Link href="#signup">contact system admin</Link>.
              </Text>
            </Space>
          </Space>
        </Card>
      </div>
    </div>
  );
}
