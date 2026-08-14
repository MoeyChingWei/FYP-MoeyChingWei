import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, Button, Space, Typography, message, Spin } from "antd";
import { ReloadOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { BudgetUsageCard } from "../components/budget/BudgetUsageCard";
import { PredictionCard } from "../components/budget/PredictionCard";
import { BudgetUsageChart } from "../components/budget/BudgetUsageChart";
import {
  getDepartments,
  getBudgetUsage,
  getPredictions,
  getHistoricalComparison,
  type Department,
  type BudgetUsageSummary,
  type BudgetPrediction,
  type HistoricalComparison
} from "../shared/api/departmentBudget";
import axios from "axios";
import { API_ROOT } from "../shared/api/base";

const { Title } = Typography;

export const DepartmentBudgetOverview: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
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
    if (selectedDeptId) {
      loadBudgetData();
    }
  }, [selectedDeptId, currentYear, currentMonth]);

  const loadDepartments = async () => {
    const depts = await getDepartments(true);
    setDepartments(depts);
    if (depts.length > 0 && !selectedDeptId) {
      setSelectedDeptId(depts[0].id);
    }
  };

  const loadBudgetData = async () => {
    if (!selectedDeptId) return;

    setLoadingUsage(true);
    setLoadingPredictions(true);
    setLoadingHistorical(true);

    try {
      const [usageData, predictionsData, historicalData] = await Promise.all([
        getBudgetUsage(selectedDeptId, currentYear, currentMonth),
        getPredictions(selectedDeptId, { limit: 6 }),
        getHistoricalComparison(selectedDeptId, { preset: "last-6-months" })
      ]);

      setUsage(usageData);
      setPredictions(predictionsData);
      setHistorical(historicalData);
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
    if (!selectedDeptId) return;

    setTriggeringPrediction(true);
    try {
      const dept = departments.find(d => d.id === selectedDeptId);
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

      const res = await axios.post(`${API_ROOT}/department-budget/predict/manual`, {
        departmentCode: dept?.code,
        targetYear: nextYear,
        targetMonth: nextMonth,
        userId: 1
      });

      if (res.data.success) {
        message.success(`Prediction generated: $${res.data.data.predictedAmount.toFixed(2)}`);
        loadBudgetData();
      } else {
        message.error(res.data.message || "Failed to generate prediction");
      }
    } catch (error: any) {
      console.error("Trigger prediction error:", error);
      message.error(error.response?.data?.message || "Failed to trigger prediction");
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
            value={selectedDeptId}
            onChange={setSelectedDeptId}
            placeholder="Select Department"
          >
            {departments.map(d => (
              <Select.Option key={d.id} value={d.id}>
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
