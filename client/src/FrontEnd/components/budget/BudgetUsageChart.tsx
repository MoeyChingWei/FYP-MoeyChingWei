import React from "react";
import { Card } from "antd";
import { Line } from "@ant-design/charts";
import type { HistoricalData } from "../../shared/api/departmentBudget";

interface BudgetUsageChartProps {
  data: HistoricalData[];
  loading?: boolean;
  title?: string;
}

export const BudgetUsageChart: React.FC<BudgetUsageChartProps> = ({
  data,
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
        formatter: (v: string) => `$${parseFloat(v).toLocaleString()}`
      }
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `$${datum.amount.toFixed(2)}`
      })
    }
  };

  return (
    <Card title={title} loading={loading}>
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
