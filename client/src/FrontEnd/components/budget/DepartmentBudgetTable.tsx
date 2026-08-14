import React from "react";
import { Table, Tag, Progress, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { MonthlyBudget } from "../../shared/api/departmentBudget";

interface DepartmentBudgetTableProps {
  budgets: MonthlyBudget[];
  loading?: boolean;
  onViewDetails?: (budget: MonthlyBudget) => void;
}

export const DepartmentBudgetTable: React.FC<DepartmentBudgetTableProps> = ({
  budgets,
  loading,
  onViewDetails
}) => {
  const columns = [
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
      sorter: (a: MonthlyBudget, b: MonthlyBudget) =>
        (a.department?.name || "").localeCompare(b.department?.name || "")
    },
    {
      title: "Period",
      key: "period",
      render: (_: any, record: MonthlyBudget) =>
        `${record.year}-${String(record.month).padStart(2, "0")}`,
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => {
        const aVal = a.year * 100 + a.month;
        const bVal = b.year * 100 + b.month;
        return aVal - bVal;
      }
    },
    {
      title: "Allocated",
      dataIndex: "allocatedAmount",
      key: "allocatedAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => a.allocatedAmount - b.allocatedAmount
    },
    {
      title: "Spent",
      dataIndex: "spentAmount",
      key: "spentAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => a.spentAmount - b.spentAmount
    },
    {
      title: "Remaining",
      key: "remaining",
      render: (_: any, record: MonthlyBudget) => {
        const remaining = record.allocatedAmount - record.spentAmount;
        return (
          <span style={{ color: remaining < 0 ? "#ff4d4f" : "#52c41a" }}>
            ${remaining.toFixed(2)}
          </span>
        );
      },
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => {
        const aRem = a.allocatedAmount - a.spentAmount;
        const bRem = b.allocatedAmount - b.spentAmount;
        return aRem - bRem;
      }
    },
    {
      title: "Usage",
      key: "usage",
      render: (_: any, record: MonthlyBudget) => {
        const percentage = record.allocatedAmount === 0 ? 0 : (record.spentAmount / record.allocatedAmount) * 100;
        const status = percentage >= 100 ? "exception" : percentage >= 80 ? "normal" : "success";
        return (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Progress
              percent={Math.min(percentage, 100)}
              status={status}
              size="small"
              showInfo={false}
            />
            <span style={{ fontSize: 11 }}>{percentage.toFixed(1)}%</span>
          </Space>
        );
      },
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => {
        const aPerc = a.allocatedAmount === 0 ? 0 : (a.spentAmount / a.allocatedAmount) * 100;
        const bPerc = b.allocatedAmount === 0 ? 0 : (b.spentAmount / b.allocatedAmount) * 100;
        return aPerc - bPerc;
      }
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: MonthlyBudget) => {
        const percentage = record.allocatedAmount === 0 ? 0 : (record.spentAmount / record.allocatedAmount) * 100;
        if (percentage >= 100) {
          return <Tag color="red">EXCEEDED</Tag>;
        } else if (percentage >= 80) {
          return <Tag color="orange">WARNING</Tag>;
        }
        return <Tag color="green">ON TRACK</Tag>;
      },
      filters: [
        { text: "On Track", value: "on-track" },
        { text: "Warning", value: "warning" },
        { text: "Exceeded", value: "exceeded" }
      ],
      onFilter: (value: any, record: MonthlyBudget) => {
        const percentage = record.allocatedAmount === 0 ? 0 : (record.spentAmount / record.allocatedAmount) * 100;
        if (value === "exceeded") return percentage >= 100;
        if (value === "warning") return percentage >= 80 && percentage < 100;
        return percentage < 80;
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: MonthlyBudget) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => onViewDetails?.(record)}
        >
          Details
        </Button>
      )
    }
  ];

  return (
    <Table
      dataSource={budgets}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      scroll={{ x: 1200 }}
    />
  );
};
