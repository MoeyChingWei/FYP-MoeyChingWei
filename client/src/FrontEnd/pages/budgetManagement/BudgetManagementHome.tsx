import React from "react";
import { Empty, Typography } from "antd";
import { DollarOutlined } from "@ant-design/icons";

import styles from "./BudgetManagementHome.module.css";

const { Title, Paragraph } = Typography;

export default function BudgetManagementHome(): React.ReactElement {
  return (
    <div className={styles.container}>
      <Title level={2}>Budget Management</Title>
      <Paragraph type="secondary">
        Budget forecasting and allocation tools will be available here.
      </Paragraph>
      <div className={styles.placeholder}>
        <Empty
          image={<DollarOutlined className={styles.icon} />}
          description="No budget tools are available yet."
        />
      </div>
    </div>
  );
}
