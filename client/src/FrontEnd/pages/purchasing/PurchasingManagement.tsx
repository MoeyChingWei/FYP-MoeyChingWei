import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "antd";
import {
  CheckCircleOutlined,
  FileSearchOutlined,
  InboxOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import styles from "./PurchasingManagement.module.css";
import { getSessionUser } from "../../shared/auth/session";
import { UserRole } from "../../shared/types/roles";

const { Title } = Typography;

type ModuleCard = {
  title: string;
  hint: string;
  icon: React.ReactNode;
  route: string;
};

export default function PurchasingManagement(): React.ReactElement {
  const { t } = useTranslation('purchasing');
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const role = sessionUser?.role;

  const purchaseRequestCards: ModuleCard[] = useMemo(() => [
    {
      title: t('purchaseRequest.review.title'),
      hint: t('purchaseRequest.review.hint'),
      icon: <FileSearchOutlined />,
      route: "/purchasing/review",
    },
    {
      title: t('purchaseRequest.approval.title'),
      hint: t('purchaseRequest.approval.hint'),
      icon: <CheckCircleOutlined />,
      route: "/purchasing/approval",
    },
  ], [t]);

  const purchaseOrderCards: ModuleCard[] = useMemo(() => [
    {
      title: t('purchaseOrder.review.title'),
      hint: t('purchaseOrder.review.hint'),
      icon: <ShoppingOutlined />,
      route: "/purchasing/po-review",
    },
    {
      title: t('purchaseOrder.approval.title'),
      hint: t('purchaseOrder.approval.hint'),
      icon: <CheckCircleOutlined />,
      route: "/purchasing/po-approval",
    },
  ], [t]);

  const visibleRequestCards = useMemo(() => {
    if (!role || role === UserRole.ADMIN || role === UserRole.MANAGER) {
      return purchaseRequestCards;
    }
    if (role === UserRole.DEPARTMENT_EXECUTIVE) return purchaseRequestCards;
    if (role === UserRole.EMPLOYEE) {
      return purchaseRequestCards.filter((card) => card.route === "/purchasing/review");
    }
    return [];
  }, [role]);

  const visibleOrderCards = useMemo(() => {
    if (!role || role === UserRole.ADMIN || role === UserRole.MANAGER) {
      return purchaseOrderCards;
    }
    if (role === UserRole.DEPARTMENT_EXECUTIVE) {
      return purchaseOrderCards.filter((card) => card.route !== "/purchasing/po-approval");
    }
    return [];
  }, [role]);

  const showGrn = !role || role === UserRole.ADMIN || role === UserRole.MANAGER || role === UserRole.DEPARTMENT_EXECUTIVE || role === UserRole.EMPLOYEE;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.content}>
          <div className={styles.header}>
            <Title level={2} className={styles.title}>
              {t('moduleTitle')}
            </Title>
          </div>

          <div className={styles.layout}>
            <div className={styles.mainStack}>
              {visibleRequestCards.length ? (
                <Card className={styles.sectionCard} bordered={false}>
                  <div className={styles.sectionHeader}>
                    <Title level={4} className={styles.sectionTitle}>
                      {t('purchaseRequest.title')}
                    </Title>
                  </div>
                  <div className={styles.cardGrid}>
                    {visibleRequestCards.map((item) => (
                      <Button
                        key={item.route}
                        type="text"
                        className={styles.moduleButton}
                        onClick={() => navigate(item.route)}
                      >
                        <div className={styles.moduleIcon}>{item.icon}</div>
                        <div className={styles.moduleTitle}>{item.title}</div>
                        <div className={styles.moduleHint}>{item.hint}</div>
                      </Button>
                    ))}
                  </div>
                </Card>
              ) : null}

              {visibleOrderCards.length ? (
                <Card className={styles.sectionCard} bordered={false}>
                  <div className={styles.sectionHeader}>
                    <Title level={4} className={styles.sectionTitle}>
                      {t('purchaseOrder.title')}
                    </Title>
                  </div>
                  <div className={styles.cardGrid}>
                    {visibleOrderCards.map((item) => (
                      <Button
                        key={item.route}
                        type="text"
                        className={styles.moduleButton}
                        onClick={() => navigate(item.route)}
                      >
                        <div className={styles.moduleIcon}>{item.icon}</div>
                        <div className={styles.moduleTitle}>{item.title}</div>
                        <div className={styles.moduleHint}>{item.hint}</div>
                      </Button>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>

            {showGrn ? (
              <Card className={styles.grnCard} bordered={false}>
                <Button
                  type="text"
                  className={styles.grnButton}
                  onClick={() => navigate("/purchasing/goods-received-note")}
                >
                  <div className={styles.grnIcon}>
                    <InboxOutlined />
                  </div>
                  <div className={styles.grnTitle}>{t('grn.title')}</div>
                  <div className={styles.grnHint}>{t('grn.hint')}</div>
                </Button>
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
