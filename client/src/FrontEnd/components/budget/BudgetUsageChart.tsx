import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import { Line } from "@ant-design/charts";
import type { HistoricalComparison, HistoricalData } from "../../shared/api/departmentBudget";

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
  title = "Budget Usage Trend"
}) => {
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
        formatter: (v: string) => `MYR ${parseFloat(v).toLocaleString()}`
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `MYR ${datum.amount.toFixed(2)}`
      })
    }
  };

  return (
    <Card title={title} loading={loading}>
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 12 }}>
          <Col xs={24} sm={8}>
            <Statistic title="Historical Budget" value={summary.totalAllocated} precision={2} prefix="MYR" />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic title="Actual Purchasing Spend" value={summary.totalSpent} precision={2} prefix="MYR" />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title={`Average Usage (${summary.budgetedPeriods} Budgeted Months)`}
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
          No historical data available
        </div>
      )}
    </Card>
  );
};
