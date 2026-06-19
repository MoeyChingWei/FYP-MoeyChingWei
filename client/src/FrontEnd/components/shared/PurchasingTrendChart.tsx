import React from "react";
import { Card, Typography, Skeleton } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

type DataPoint = {
  month: string;
  requests: number;
  orders: number;
  amount: number;
};

type PurchasingTrendChartProps = {
  data: DataPoint[];
  loading?: boolean;
};

export default function PurchasingTrendChart({
  data,
  loading = false,
}: PurchasingTrendChartProps): React.ReactElement {
  if (loading) {
    return (
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 12,
        border: "1px solid rgba(2, 6, 23, 0.08)",
        background: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <Title level={5} style={{ marginBottom: 16 }}>
        Purchasing Trend
      </Title>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            style={{ fontSize: 12 }}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.98)",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="requests"
            name="Purchase Requests"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRequests)"
          />
          <Area
            type="monotone"
            dataKey="orders"
            name="Purchase Orders"
            stroke="#22c55e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
