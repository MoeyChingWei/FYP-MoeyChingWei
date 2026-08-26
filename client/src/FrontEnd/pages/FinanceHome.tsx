import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Row, Typography } from "antd";
import { CreditCardOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../shared/auth/session";
import { canApproveSupplierInvoices, isFinanceRole, UserRole } from "../shared/types/roles";
import { hydrateSupplierInvoices, hydrateSupplierPayments, loadSupplierInvoices, loadSupplierPayments } from "../modules/supplierFulfillment/workflow";
import styles from "./FinanceHome.module.css";

const { Title, Paragraph } = Typography;

export default function FinanceHome(): React.ReactElement {
  const navigate = useNavigate();
  const user = getSessionUser();
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);

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

  if (!user || !(isFinanceRole(user.role) || user.role === UserRole.ADMIN)) {
    return <div className={styles.container}><Title level={3}>Finance</Title><Paragraph>Finance access required.</Paragraph></div>;
  }

  return <div className={styles.container}>
    <Title level={2} className={styles.title}>Finance</Title>
    <Paragraph type="secondary" className={styles.subtitle}>Finance operations and approval workflows</Paragraph>
    <Row gutter={[20, 20]}>
      {canApproveSupplierInvoices(user.role) ? <Col xs={24} sm={12} lg={8} xl={6}>
        <Card hoverable className={styles.moduleCard} onClick={() => navigate("/finance/invoice-approval")}>
          <div className={styles.cardContent}>
            <div className={styles.iconWrap}><FileTextOutlined /></div>
            <Title level={4} className={styles.cardTitle}>Supplier Invoice Approval <Badge count={pendingInvoices} overflowCount={99} /></Title>
            <Paragraph type="secondary" className={styles.cardDescription}>Review and process supplier invoices submitted for Finance approval.</Paragraph>
          </div>
        </Card>
      </Col> : null}
      {(user.role === UserRole.PAYMENT_TEAM || user.role === UserRole.ADMIN) ? <Col xs={24} sm={12} lg={8} xl={6}>
        <Card hoverable className={styles.moduleCard} onClick={() => navigate("/finance/payment-processing")}>
          <div className={styles.cardContent}>
            <div className={styles.paymentIconWrap}><CreditCardOutlined /></div>
            <Title level={4} className={styles.cardTitle}>Payment Processing <Badge count={pendingPayments} overflowCount={99} /></Title>
            <Paragraph type="secondary" className={styles.cardDescription}>View approved supplier invoices ready for Payment Team processing.</Paragraph>
          </div>
        </Card>
      </Col> : null}
    </Row>
  </div>;
}
