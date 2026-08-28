import React from "react";
import { Card, Progress, Tag, Statistic, Row, Col } from "antd";
import { WarningOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { BudgetUsageSummary } from "../../shared/api/departmentBudget";

interface BudgetUsageCardProps {
  usage: BudgetUsageSummary;
  loading?: boolean;
}

const formatPeriod = (year: number, month: number): string => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[month - 1]} ${year}`;
};

export const BudgetUsageCard: React.FC<BudgetUsageCardProps> = ({ usage, loading }) => {
  const { t } = useTranslation("budgetManagement");
  const getStatusColor = () => {
    if (usage.status === "exceeded") return "red";
    if (usage.status === "warning") return "orange";
    return "green";
  };

  const getStatusIcon = () => {
    if (usage.status === "exceeded") return <ExclamationCircleOutlined />;
    if (usage.status === "warning") return <WarningOutlined />;
    return <CheckCircleOutlined />;
  };

  const getStatusText = () => {
    if (usage.status === "exceeded") return t("exceeded");
    if (usage.status === "warning") return t("warning");
    return t("onTrack");
  };

  return (
    <Card
      className="budgetUsageCard"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{t("budgetUsage", { department: usage.department.name })}</span>
          <Tag color={getStatusColor()} icon={getStatusIcon()}>
            {getStatusText()}
          </Tag>
        </div>
      }
      loading={loading}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title={t("allocated")}
            value={usage.allocatedAmount}
            precision={2}
            prefix="RM"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t("spent")}
            value={usage.spentAmount}
            precision={2}
            prefix="RM"
            styles={{ content: { color: usage.status === "exceeded" ? "#ff4d4f" : undefined } }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t("reserved")}
            value={usage.reservedAmount}
            precision={2}
            prefix="RM"
            styles={{ content: { color: "#fa8c16" } }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t("remaining")}
            value={usage.remainingAmount}
            precision={2}
            prefix="RM"
            styles={{ content: { color: usage.remainingAmount < 0 ? "#ff4d4f" : "#3f8600" } }}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>{t("usage")}:</span>
          <span style={{ fontWeight: 600 }}>{usage.usagePercentage.toFixed(1)}%</span>
        </div>
        <Progress
          percent={Math.min(usage.usagePercentage, 100)}
          status={usage.status === "exceeded" ? "exception" : usage.status === "warning" ? "normal" : "success"}
          strokeColor={
            usage.usagePercentage >= 100
              ? "#ff4d4f"
              : usage.usagePercentage >= 80
              ? "#faad14"
              : "#52c41a"
          }
        />
        {usage.usagePercentage > 100 && (
          <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
            {t("exceededBy", { amount: Math.abs(usage.remainingAmount).toFixed(2) })}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: "#8c8c8c" }}>
        {t("periodLabel", { period: formatPeriod(usage.year, usage.month) })}
      </div>
    </Card>
  );
};
