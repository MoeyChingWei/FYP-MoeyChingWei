import React from "react";
import { Card, Flex, Typography, Skeleton } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import styles from "./StatCard.module.css";

const { Text, Title } = Typography;

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  suffix?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  loading = false,
  suffix,
}: StatCardProps): React.ReactElement {
  if (loading) {
    return (
      <Card className={styles.card} bordered={false}>
        <Skeleton active paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  return (
    <Card className={styles.card} bordered={false}>
      <Flex justify="space-between" align="flex-start">
        <div className={styles.content}>
          <Text className={styles.title}>{title}</Text>
          <Title level={2} className={styles.value}>
            {value}
            {suffix && <span className={styles.suffix}>{suffix}</span>}
          </Title>
          {trend && (
            <Flex align="center" gap={4} className={styles.trend}>
              {trend.isPositive ? (
                <ArrowUpOutlined className={styles.trendUp} />
              ) : (
                <ArrowDownOutlined className={styles.trendDown} />
              )}
              <Text
                className={
                  trend.isPositive ? styles.trendUp : styles.trendDown
                }
              >
                {Math.abs(trend.value)}%
              </Text>
              <Text type="secondary" className={styles.trendLabel}>
                vs last month
              </Text>
            </Flex>
          )}
        </div>
        <div className={styles.iconWrap} style={{ background: color }}>
          {icon}
        </div>
      </Flex>
    </Card>
  );
}
