import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { Line } from "@ant-design/charts";
import type { HistoricalComparison, HistoricalData } from "../../shared/api/departmentBudget";
import { displayCurrency } from "../../shared/utils/currency";
import { useTranslation } from "react-i18next";

interface BudgetUsageChartProps {
  data: HistoricalData[];
  summary?: HistoricalComparison["summary"];
  loading?: boolean;
  title?: string;
}

export const BudgetUsageChart: React.FC<BudgetUsageChartProps> = ({
  data,
  summary,
  loading,
  title
}) => {
  const { t } = useTranslation("budgetManagement");
  const chartData = data.flatMap(d => [
    { period: d.period, type: "Allocated", amount: d.allocatedAmount },
    { period: d.period, type: "Spent", amount: d.spentAmount }
  ]);

  const config = {
    data: chartData,
    xField: "period",
    yField: "amount",
    seriesField: "type",
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000
      }
    },
    color: ["#1890ff", "#52c41a"],
    legend: {
      position: "top" as const
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${displayCurrency("MYR")} ${parseFloat(v).toLocaleString()}`
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${displayCurrency("MYR")} ${datum.amount.toFixed(2)}`
      })
    }
  };

  return (
    <Card title={title || t("budgetUsageTrend")} loading={loading}>
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={8}>
            <Statistic title={t("historicalBudget")} value={summary.totalAllocated} precision={2} prefix={displayCurrency("MYR")} />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic title={t("actualPurchasingSpend")} value={summary.totalSpent} precision={2} prefix={displayCurrency("MYR")} />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title={t("averageUsage", { count: summary.budgetedPeriods })}
              value={summary.avgUtilization}
              precision={1}
              suffix="%"
            />
          </Col>
        </Row>
      )}
      {data.length > 0 ? (
        <Line {...config} />
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#8c8c8c" }}>
          {t("noHistoricalData")}
        </div>
      )}
    </Card>
  );
};
