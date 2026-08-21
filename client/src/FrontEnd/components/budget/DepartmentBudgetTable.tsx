import React from "react";
import { Table, Tag, Progress, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { toBudgetNumber, type MonthlyBudget } from "../../shared/api/departmentBudget";

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
      render: (amount: unknown) => `$${toBudgetNumber(amount).toFixed(2)}`,
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => toBudgetNumber(a.allocatedAmount) - toBudgetNumber(b.allocatedAmount)
    },
    {
      title: "Spent",
      dataIndex: "spentAmount",
      key: "spentAmount",
      render: (amount: unknown) => `$${toBudgetNumber(amount).toFixed(2)}`,
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => toBudgetNumber(a.spentAmount) - toBudgetNumber(b.spentAmount)
    },
    {
      title: "Remaining",
      key: "remaining",
      render: (_: any, record: MonthlyBudget) => {
        const remaining = toBudgetNumber(record.allocatedAmount) - toBudgetNumber(record.spentAmount);
        return (
          <span style={{ color: remaining < 0 ? "#ff4d4f" : "#52c41a" }}>
            ${remaining.toFixed(2)}
          </span>
        );
      },
      sorter: (a: MonthlyBudget, b: MonthlyBudget) => {
        const aRem = toBudgetNumber(a.allocatedAmount) - toBudgetNumber(a.spentAmount);
        const bRem = toBudgetNumber(b.allocatedAmount) - toBudgetNumber(b.spentAmount);
        return aRem - bRem;
      }
    },
    {
      title: "Usage",
      key: "usage",
      render: (_: any, record: MonthlyBudget) => {
        const allocated = toBudgetNumber(record.allocatedAmount);
        const percentage = allocated === 0 ? 0 : (toBudgetNumber(record.spentAmount) / allocated) * 100;
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
        const aAllocated = toBudgetNumber(a.allocatedAmount);
        const bAllocated = toBudgetNumber(b.allocatedAmount);
        const aPerc = aAllocated === 0 ? 0 : (toBudgetNumber(a.spentAmount) / aAllocated) * 100;
        const bPerc = bAllocated === 0 ? 0 : (toBudgetNumber(b.spentAmount) / bAllocated) * 100;
        return aPerc - bPerc;
      }
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: MonthlyBudget) => {
        const allocated = toBudgetNumber(record.allocatedAmount);
        const percentage = allocated === 0 ? 0 : (toBudgetNumber(record.spentAmount) / allocated) * 100;
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
        const allocated = toBudgetNumber(record.allocatedAmount);
        const percentage = allocated === 0 ? 0 : (toBudgetNumber(record.spentAmount) / allocated) * 100;
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
