import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { CreditCardOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../shared/auth/session";
import { isFinanceRole, UserRole } from "../shared/types/roles";
import styles from "./FinanceHome.module.css";

const { Title, Paragraph } = Typography;

export default function FinanceHome(): React.ReactElement {
  const navigate = useNavigate();
  const user = getSessionUser();

  if (!user || !(isFinanceRole(user.role) || user.role === UserRole.ADMIN)) {
    return <div className={styles.container}><Title level={3}>Finance</Title><Paragraph>Finance access required.</Paragraph></div>;
  }

  return <div className={styles.container}>
    <Title level={2} className={styles.title}>Finance</Title>
    <Paragraph type="secondary" className={styles.subtitle}>Finance operations and approval workflows</Paragraph>
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} lg={8} xl={6}>
        <Card hoverable className={styles.moduleCard} onClick={() => navigate("/finance/invoice-approval")}>
          <div className={styles.cardContent}>
            <div className={styles.iconWrap}><FileTextOutlined /></div>
            <Title level={4} className={styles.cardTitle}>Supplier Invoice Approval</Title>
            <Paragraph type="secondary" className={styles.cardDescription}>Review and process supplier invoices submitted for Finance approval.</Paragraph>
          </div>
        </Card>
      </Col>
      {(user.role === UserRole.PAYMENT_TEAM || user.role === UserRole.ADMIN) ? <Col xs={24} sm={12} lg={8} xl={6}>
        <Card hoverable className={styles.moduleCard} onClick={() => navigate("/finance/payment-processing")}>
          <div className={styles.cardContent}>
            <div className={styles.paymentIconWrap}><CreditCardOutlined /></div>
            <Title level={4} className={styles.cardTitle}>Payment Processing</Title>
            <Paragraph type="secondary" className={styles.cardDescription}>View approved supplier invoices ready for Payment Team processing.</Paragraph>
          </div>
        </Card>
      </Col> : null}
    </Row>
  </div>;
}
