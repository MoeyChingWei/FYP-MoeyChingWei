import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  Form,
  Input,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

import {
  getSessionUser,
  setSessionUser,
  type SessionUser,
} from "../shared/auth/session";
import { API_ROOT } from "../shared/api/base";
import { getSupplierBankDetails, saveSupplierBankDetails, type SupplierBankDetails } from "../shared/api/supplierFinance";
import { UserRole } from "../shared/types/roles";
import styles from "./Profile.module.css";

const { Title, Text } = Typography;

const API = API_ROOT;

function mapApiUserToSession(r: {
  id: number;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}): SessionUser {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    department: r.department,
    avatarUrl: r.avatarUrl,
    isActive: r.isActive,
  };
}

export default function Profile(): React.ReactElement {
  const { t } = useTranslation('profile');
  const { t: tMsg } = useTranslation('messages');
  const navigate = useNavigate();
  const [user, setUser] = useState<SessionUser | null>(() => getSessionUser());
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingBankDetails, setSavingBankDetails] = useState(false);
  const [bankForm] = Form.useForm<SupplierBankDetails>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileFromServer = async () => {
    const u = getSessionUser();
    if (!u) {
      setLoadingProfile(false);
      navigate("/login", { replace: true });
      return;
    }
    setLoadingProfile(true);
    try {
      const res = await axios.get(`${API}/profile`, {
        params: { userId: u.id, email: u.email },
      });
      if (res.data?.success && res.data.user) {
        const next = mapApiUserToSession(res.data.user);
        setSessionUser(next);
        setUser(next);
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tMsg('error.couldNotLoadProfile');
      message.error(msg);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    void fetchProfileFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.role !== UserRole.SUPPLIER) return;
    void getSupplierBankDetails().then((details) => bankForm.setFieldsValue(details)).catch(() => {
      // A missing bank-information migration should not prevent profile use.
    });
  }, [bankForm, user?.role]);

  const onSaveBankDetails = async (values: SupplierBankDetails): Promise<void> => {
    setSavingBankDetails(true);
    try {
      await saveSupplierBankDetails(values);
      message.success("Bank details updated");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Unable to save bank details");
    } finally {
      setSavingBankDetails(false);
    }
  };

  const displayName = user?.name ?? user?.email ?? "User";
  const avatarSrc =
    user?.avatarUrl && String(user.avatarUrl).trim().length > 0
      ? String(user.avatarUrl).trim()
      : undefined;

  const onAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const u = getSessionUser();
    if (!u) {
      message.error(tMsg('error.notSignedIn'));
      return;
    }

    const fd = new FormData();
    fd.append("avatar", file);
    fd.append("userId", String(u.id));
    fd.append("email", u.email);

    setUploadingAvatar(true);
    try {
      const res = await axios.post(`${API}/profile/avatar`, fd);
      if (res.data?.success && res.data.user) {
        const next = mapApiUserToSession(res.data.user);
        setSessionUser(next);
        setUser(next);
        message.success(tMsg('success.avatarUpdated'));
      } else {
        message.error(res.data?.message ?? tMsg('error.uploadFailed'));
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : tMsg('error.uploadFailed');
      message.error(msg);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Spin spinning={loadingProfile}>
      <Flex vertical gap={16}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            {t('page.title')}
          </Title>
          <Text type="secondary">{t('page.subtitle')}</Text>
        </div>

        <Card>
          <Space align="start" size={24} wrap>
            <div
              className={styles.avatarWrap}
              role="button"
              tabIndex={0}
              aria-label={t('avatar.changePhoto')}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className={styles.hiddenFileInput}
                onChange={onAvatarFile}
              />
              <Avatar size={96} src={avatarSrc} style={{ opacity: uploadingAvatar ? 0.6 : 1 }}>
                {!avatarSrc ? displayName.slice(0, 1).toUpperCase() : null}
              </Avatar>
              <div className={styles.avatarOverlay}>{t('avatar.clickToUpload')}</div>
            </div>
            <div>
              <Descriptions column={1} size="middle" bordered style={{ minWidth: 320 }}>
                <Descriptions.Item label={t('fields.name')}>{user?.name ?? "-"}</Descriptions.Item>
                <Descriptions.Item label={t('fields.email')}>{user?.email ?? "-"}</Descriptions.Item>
                <Descriptions.Item label={t('fields.department')}>
                  {user?.department?.trim() ? user.department : "-"}
                </Descriptions.Item>
                <Descriptions.Item label={t('fields.role')}>{user?.role ?? "-"}</Descriptions.Item>
                <Descriptions.Item label={t('fields.userId')}>{user?.id ?? "-"}</Descriptions.Item>
                <Descriptions.Item label={t('fields.status')}>
                  {user?.isActive === false ? t('status.inactive') : t('status.active')}
                </Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 16 }}>
                <Button type="primary" onClick={() => navigate("/profile/reset-password")}>
                  {t('buttons.resetPassword')}
                </Button>
              </div>
            </div>
          </Space>
        </Card>
        {user?.role === UserRole.SUPPLIER ? <Card title="Bank information">
          <Form form={bankForm} layout="vertical" onFinish={(values) => void onSaveBankDetails(values)}>
            <Form.Item name="bankName" label="Bank name"><Input maxLength={120} /></Form.Item>
            <Form.Item name="accountName" label="Account name"><Input maxLength={120} /></Form.Item>
            <Form.Item name="accountNumber" label="Account number" rules={[{ pattern: /^[A-Za-z0-9 -]*$/, message: "Use letters, numbers, spaces or hyphens only" }]}><Input maxLength={50} /></Form.Item>
            <Button type="primary" htmlType="submit" loading={savingBankDetails}>Save bank information</Button>
          </Form>
        </Card> : null}
      </Flex>
    </Spin>
  );
}
