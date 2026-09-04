import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Tag, Typography } from "antd";
import { ArrowRightOutlined, CreditCardOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSessionUser } from "../shared/auth/session";
import { canAccessFinanceModule, canApproveSupplierInvoices, UserRole } from "../shared/types/roles";
import { hydrateSupplierInvoices, hydrateSupplierPayments, loadSupplierInvoices, loadSupplierPayments } from "../modules/supplierFulfillment/workflow";
import styles from "./FinanceHome.module.css";

const { Title, Paragraph } = Typography;

export default function FinanceHome(): React.ReactElement {
  const navigate = useNavigate();
  const { t } = useTranslation("finance");
  const user = getSessionUser();
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const invoiceStatus = pendingInvoices === 0
    ? "No invoices pending"
    : `${pendingInvoices} invoice${pendingInvoices === 1 ? "" : "s"} pending`;
  const paymentStatus = pendingPayments === 0
    ? "No payments pending"
    : `${pendingPayments} payment${pendingPayments === 1 ? "" : "s"} pending`;

  useEffect(() => {
    const refresh = async (): Promise<void> => {
      if (canApproveSupplierInvoices(user?.role)) {
        await hydrateSupplierInvoices();
        setPendingInvoices(loadSupplierInvoices().filter((invoice) => invoice.status === "SUBMITTED").length);
      }
      if (user?.role === UserRole.PAYMENT_TEAM || user?.role === UserRole.ADMIN) {
        await hydrateSupplierPayments();
        setPendingPayments(loadSupplierPayments().filter((payment) => payment.status === "PENDING_PAYMENT").length);
      }
    };
    void refresh();
    window.addEventListener("erp-supplier-invoices", refresh);
    window.addEventListener("erp-supplier-payments", refresh);
    return () => {
      window.removeEventListener("erp-supplier-invoices", refresh);
      window.removeEventListener("erp-supplier-payments", refresh);
    };
  }, [user?.role]);

  if (!user || !canAccessFinanceModule(user.role, user.department)) {
    return <div className={styles.container}><Title level={3}>{t("home.title")}</Title><Paragraph>{t("home.accessRequired")}</Paragraph></div>;
  }

  return <div className={styles.container}>
    <header className={styles.pageHeader}>
      <div>
        <span className={styles.eyebrow}>Financial operations</span>
        <Title level={2} className={styles.title}>{t("home.title")}</Title>
        <Paragraph type="secondary" className={styles.subtitle}>{t("home.subtitle")}</Paragraph>
      </div>
      <Tag className={styles.periodTag}>Action centre</Tag>
    </header>
    <Row gutter={[20, 20]}>
      {canApproveSupplierInvoices(user.role) ? <Col xs={24} sm={12} lg={8} xl={6}>
        <Card hoverable className={styles.moduleCard} onClick={() => navigate("/finance/invoice-approval")}>
          <div className={styles.cardContent}>
            <div className={styles.cardTop}><div className={styles.iconWrap}><FileTextOutlined /></div><span className={styles.cardType}>Invoice approval</span></div>
            <div className={styles.cardBody}><Title level={4} className={styles.cardTitle}>{t("home.invoiceTitle")}</Title><Paragraph type="secondary" className={styles.cardDescription}>{t("home.invoiceDescription")}</Paragraph></div>
            <div className={styles.cardFooter}>{pendingInvoices > 0 && <Badge count={pendingInvoices} color="#d97706" />}<span>{invoiceStatus}</span><ArrowRightOutlined className={styles.arrow} /></div>
          </div>
        </Card>
      </Col> : null}
      {(user.role === UserRole.PAYMENT_TEAM || user.role === UserRole.ADMIN) ? <Col xs={24} sm={12} lg={8} xl={6}>
        <Card hoverable className={styles.moduleCard} onClick={() => navigate("/finance/payment-processing")}>
          <div className={styles.cardContent}>
            <div className={styles.cardTop}><div className={styles.paymentIconWrap}><CreditCardOutlined /></div><span className={styles.cardType}>Payment queue</span></div>
            <div className={styles.cardBody}><Title level={4} className={styles.cardTitle}>{t("home.paymentTitle")}</Title><Paragraph type="secondary" className={styles.cardDescription}>{t("home.paymentDescription")}</Paragraph></div>
            <div className={styles.cardFooter}>{pendingPayments > 0 && <Badge count={pendingPayments} color="#d97706" />}<span>{paymentStatus}</span><ArrowRightOutlined className={styles.arrow} /></div>
          </div>
        </Card>
      </Col> : null}
    </Row>
  </div>;
}
