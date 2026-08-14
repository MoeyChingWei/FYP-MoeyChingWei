import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Statistic, Select, Space, Button, Modal, message } from "antd";
import { ReloadOutlined, DollarOutlined, WarningOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { DepartmentBudgetTable } from "../components/budget/DepartmentBudgetTable";
import { BudgetUsageChart } from "../components/budget/BudgetUsageChart";
import {
  getDepartments,
  getMonthlyBudgets,
  getHistoricalComparison,
  type MonthlyBudget,
  type HistoricalComparison
} from "../shared/api/departmentBudget";

const { Title } = Typography;

const FinanceBudgetDashboard: React.FC = () => {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<MonthlyBudget | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalComparison | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const depts = await getDepartments(true);

      const budgetPromises = depts.map(d =>
        getMonthlyBudgets(d.id, selectedYear, selectedMonth)
      );
      const budgetResults = await Promise.all(budgetPromises);
      const allBudgets = budgetResults.flat();
      setBudgets(allBudgets);
    } catch (error) {
      console.error("Load data error:", error);
      message.error("Failed to load budget data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (budget: MonthlyBudget) => {
    setSelectedBudget(budget);
    setDetailModalVisible(true);

    try {
      const historical = await getHistoricalComparison(budget.departmentId, {
        preset: "last-6-months"
      });
      setHistoricalData(historical);
    } catch (error) {
      console.error("Load historical data error:", error);
      message.error("Failed to load historical data.");
    }
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const totalRemaining = totalAllocated - totalSpent;

  const onTrackCount = budgets.filter(b => {
    const percentage = b.allocatedAmount === 0 ? 0 : (b.spentAmount / b.allocatedAmount);
    return percentage < 0.8;
  }).length;
  const warningCount = budgets.filter(b => {
    const p = b.allocatedAmount === 0 ? 0 : (b.spentAmount / b.allocatedAmount);
    return p >= 0.8 && p < 1.0;
  }).length;
  const exceededCount = budgets.filter(b => {
    const percentage = b.allocatedAmount === 0 ? 0 : (b.spentAmount / b.allocatedAmount);
    return percentage >= 1.0;
  }).length;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2}>Finance Budget Dashboard</Title>
        <Space>
          <Select
            style={{ width: 100 }}
            value={selectedYear}
            onChange={setSelectedYear}
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <Select.Option key={y} value={y}>{y}</Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100 }}
            value={selectedMonth}
            onChange={setSelectedMonth}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <Select.Option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </Select.Option>
            ))}
          </Select>
          <Button icon={<ReloadOutlined />} onClick={loadData}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Allocated"
              value={totalAllocated}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={totalSpent}
              precision={2}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Remaining"
              value={totalRemaining}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: totalRemaining < 0 ? "#ff4d4f" : "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 16 }} />
                <span>On Track: {onTrackCount}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <WarningOutlined style={{ color: "#faad14", fontSize: 16 }} />
                <span>Warning: {warningCount}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <WarningOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
                <span>Exceeded: {exceededCount}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Department Budgets">
        <DepartmentBudgetTable
          budgets={budgets}
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </Card>

      <Modal
        title={`Budget Details - ${selectedBudget?.department?.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBudget && (
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Allocated"
                  value={selectedBudget.allocatedAmount}
                  precision={2}
                  prefix="$"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Spent"
                  value={selectedBudget.spentAmount}
                  precision={2}
                  prefix="$"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Remaining"
                  value={selectedBudget.allocatedAmount - selectedBudget.spentAmount}
                  precision={2}
                  prefix="$"
                  valueStyle={{
                    color: selectedBudget.allocatedAmount - selectedBudget.spentAmount < 0
                      ? "#ff4d4f"
                      : "#52c41a"
                  }}
                />
              </Col>
            </Row>

            {historicalData && (
              <BudgetUsageChart
                data={historicalData.historicalData}
                title="6-Month History"
              />
            )}

            {selectedBudget.notes && (
              <div>
                <strong>Notes:</strong>
                <p style={{ marginTop: 8, color: "#595959" }}>{selectedBudget.notes}</p>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default FinanceBudgetDashboard;
