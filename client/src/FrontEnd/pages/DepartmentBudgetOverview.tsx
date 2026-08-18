import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, Button, Space, Typography, message, Spin } from "antd";
import { ReloadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { BudgetUsageCard } from "../components/budget/BudgetUsageCard";
import { PredictionCard } from "../components/budget/PredictionCard";
import { BudgetUsageChart } from "../components/budget/BudgetUsageChart";
import {
  type BudgetUsageSummary,
  type BudgetPrediction,
  type HistoricalComparison
} from "../shared/api/departmentBudget";
import { API_ROOT } from "../shared/api/base";

const { Title } = Typography;

interface ForecastDepartment {
  code: string;
  name: string;
}

interface ForecastResponse {
  success: boolean;
  data: {
    historical: Array<{ period: string; totalAmount: number; requestCount: number }>;
    forecast: Array<{ period: string; forecastAmount: number; confidence: "high" | "medium" | "low" }>;
    summary: { avgPerPeriod: number };
  };
}

export const DepartmentBudgetOverview: React.FC = () => {
  const [departments, setDepartments] = useState<ForecastDepartment[]>([]);
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  const [usage, setUsage] = useState<BudgetUsageSummary | null>(null);
  const [predictions, setPredictions] = useState<BudgetPrediction[]>([]);
  const [historical, setHistorical] = useState<HistoricalComparison | null>(null);

  const [loadingUsage, setLoadingUsage] = useState(false);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [loadingHistorical, setLoadingHistorical] = useState(false);
  const [triggeringPrediction, setTriggeringPrediction] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartmentCode) {
      loadBudgetData();
    }
  }, [selectedDepartmentCode, currentYear, currentMonth]);

  const loadDepartments = async () => {
    try {
      const response = await fetch(`${API_ROOT}/budget/departments`);
      const result = await response.json();
      const depts: ForecastDepartment[] = result.success ? result.data ?? [] : [];
      setDepartments(depts);
      if (depts.length > 0 && !selectedDepartmentCode) {
        setSelectedDepartmentCode(depts[0].code);
      }
    } catch (error) {
      console.error("Load purchasing departments error:", error);
      message.error("Failed to load departments");
    }
  };

  const loadBudgetData = async () => {
    if (!selectedDepartmentCode) return;

    setLoadingUsage(true);
    setLoadingPredictions(true);
    setLoadingHistorical(true);

    try {
      const params = new URLSearchParams({
        period: "monthly",
        departmentCode: selectedDepartmentCode,
      });
      const response = await fetch(`${API_ROOT}/budget/forecast?${params}`);
      const result: ForecastResponse = await response.json();
      if (!result.success) throw new Error("Forecast request failed");

      const department = departments.find((dept) => dept.code === selectedDepartmentCode);
      const selectedPeriod = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
      const currentPeriodData = result.data.historical.find((item) => item.period === selectedPeriod);
      const averageAmount = result.data.summary.avgPerPeriod;
      const spentAmount = currentPeriodData?.totalAmount ?? 0;
      const usagePercentage = averageAmount > 0 ? (spentAmount / averageAmount) * 100 : 0;

      setUsage({
        budgetId: 0,
        department: { id: 0, code: selectedDepartmentCode, name: department?.name ?? selectedDepartmentCode },
        year: currentYear,
        month: currentMonth,
        allocatedAmount: averageAmount,
        spentAmount,
        reservedAmount: 0,
        remainingAmount: averageAmount - spentAmount,
        usagePercentage,
        status: usagePercentage > 100 ? "exceeded" : usagePercentage >= 80 ? "warning" : "normal",
      });

      setPredictions(result.data.forecast.map((item, index) => {
        const [year, month] = item.period.split("-").map(Number);
        return {
          id: index + 1,
          departmentId: 0,
          targetYear: year,
          targetMonth: month,
          predictedAmount: item.forecastAmount,
          confidence: item.confidence,
          triggerType: "automatic",
          triggeredBy: 0,
          createdAt: new Date().toISOString(),
          department: { id: 0, code: selectedDepartmentCode, name: department?.name ?? selectedDepartmentCode, isActive: true },
          metadata: { algorithm: "Three-period moving average", basedOnMonths: 3 },
        };
      }));

      setHistorical({
        historicalData: result.data.historical.slice(-6).map((item) => {
          const [year, month] = item.period.split("-").map(Number);
          return {
            year,
            month,
            period: item.period,
            allocatedAmount: averageAmount,
            spentAmount: item.totalAmount,
            remainingAmount: averageAmount - item.totalAmount,
            utilization: averageAmount > 0 ? (item.totalAmount / averageAmount) * 100 : 0,
          };
        }),
        summary: {
          totalPeriods: result.data.historical.length,
          avgAllocated: averageAmount,
          avgSpent: averageAmount,
          avgUtilization: 100,
          totalAllocated: averageAmount * result.data.historical.length,
          totalSpent: result.data.historical.reduce((total, item) => total + item.totalAmount, 0),
        },
      });
    } catch (error) {
      console.error("Load budget data error:", error);
      message.error("Failed to load budget data");
    } finally {
      setLoadingUsage(false);
      setLoadingPredictions(false);
      setLoadingHistorical(false);
    }
  };

  const handleTriggerPrediction = async () => {
    if (!selectedDepartmentCode) return;

    setTriggeringPrediction(true);
    try {
      await loadBudgetData();
      message.success("Predictions generated from purchasing history");
    } catch (error: any) {
      console.error("Trigger prediction error:", error);
      message.error(error.message || "Failed to generate prediction");
    } finally {
      setTriggeringPrediction(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2}>Department Budget Overview</Title>
        <Space>
          <Select
            style={{ width: 200 }}
            value={selectedDepartmentCode}
            onChange={setSelectedDepartmentCode}
            placeholder="Select Department"
          >
            {departments.map(d => (
              <Select.Option key={d.code} value={d.code}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100 }}
            value={currentYear}
            onChange={setCurrentYear}
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <Select.Option key={y} value={y}>{y}</Select.Option>
            ))}
          </Select>
          <Select
            style={{ width: 100 }}
            value={currentMonth}
            onChange={setCurrentMonth}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <Select.Option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </Select.Option>
            ))}
          </Select>
          <Button icon={<ReloadOutlined />} onClick={loadBudgetData}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={handleTriggerPrediction}
            loading={triggeringPrediction}
          >
            Generate Prediction
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          {loadingUsage ? (
            <Card><Spin /></Card>
          ) : usage ? (
            <BudgetUsageCard usage={usage} />
          ) : (
            <Card>No budget data for selected period</Card>
          )}
        </Col>

        <Col span={24}>
          <Card title="AI Budget Predictions" loading={loadingPredictions}>
            {predictions.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {predictions.map(p => (
                  <PredictionCard key={p.id} prediction={p} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#8c8c8c" }}>
                No predictions available. Click "Generate Prediction" to create one.
              </div>
            )}
          </Card>
        </Col>

        <Col span={24}>
          {historical && (
            <BudgetUsageChart
              data={historical.historicalData}
              loading={loadingHistorical}
              title="Budget Usage History (Last 6 Months)"
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DepartmentBudgetOverview;
