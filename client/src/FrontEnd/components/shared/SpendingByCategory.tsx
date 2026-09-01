import React from "react";
import { Card, Empty, Typography, Skeleton } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const { Title } = Typography;

type CategoryData = {
  category: string;
  amount: number;
  count: number;
};

type SpendingByCategoryProps = {
  data: CategoryData[];
  loading?: boolean;
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

export default function SpendingByCategory({
  data,
  loading = false,
}: SpendingByCategoryProps): React.ReactElement {
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
        Spending by Category
      </Title>
      {data.length === 0 ? (
        <div style={{ height: 280, display: "grid", placeItems: "center", textAlign: "center" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <div style={{ color: "#334155", fontWeight: 600 }}>No category spend yet</div>
                <div style={{ marginTop: 4, color: "#94a3b8", fontSize: 12 }}>Spending insights will appear as orders are recorded.</div>
              </div>
            }
          />
        </div>
      ) : <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="category"
            stroke="#94a3b8"
            style={{ fontSize: 11 }}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.98)",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: number, name: string) => {
              if (name === "amount") return [`RM ${value.toLocaleString()}`, "Amount"];
              if (name === "count") return [value, "Count"];
              return [value, name];
            }}
          />
          <Bar dataKey="amount" name="amount" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>}
    </Card>
  );
}
