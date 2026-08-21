import React, { useEffect, useState } from "react";
import { Card, Row, Col, Select, Button, Space, Typography, message, Spin } from "antd";
import { ReloadOutlined, ThunderboltOutlined, FormOutlined, AuditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BudgetUsageCard } from "../components/budget/BudgetUsageCard";
import { PredictionCard } from "../components/budget/PredictionCard";
import { BudgetUsageChart } from "../components/budget/BudgetUsageChart";
import {
  getHistoricalComparison,
  getPredictions,
  type BudgetUsageSummary,
  type BudgetPrediction,
  type HistoricalComparison
} from "../shared/api/departmentBudget";
import { API_ROOT } from "../shared/api/base";
import { getSessionUser } from "../shared/auth/session";
import { UserRole } from "../shared/types/roles";

const { Title } = Typography;

interface ForecastDepartment {
  id: number;
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

const DEPARTMENT_OVERVIEW_ROLES = new Set<string>([
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.ACCOUNT_PAYABLE,
  UserRole.TREASURY_FINANCE_OFFICER,
  UserRole.PAYMENT_TEAM,
  UserRole.BUDGET_CONTROLLER,
]);

function matchesDepartment(department: ForecastDepartment, userDepartment?: string | null): boolean {
  const normalizedUserDepartment = String(userDepartment ?? "").trim().toLowerCase();
  return Boolean(normalizedUserDepartment) && (
    department.code.trim().toLowerCase() === normalizedUserDepartment ||
    department.name.trim().toLowerCase() === normalizedUserDepartment
  );
}

export const DepartmentBudgetOverview: React.FC = () => {
  const navigate = useNavigate();
  const [sessionUser] = useState(() => getSessionUser());
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

  const canViewAllDepartments = DEPARTMENT_OVERVIEW_ROLES.has(sessionUser?.role ?? "");

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
      const params = new URLSearchParams({
        userId: String(sessionUser?.id ?? ""),
        email: String(sessionUser?.email ?? ""),
      });
      const response = await fetch(`${API_ROOT}/department-budget/departments?${params}`);
      const result = await response.json();
      const allDepartments: ForecastDepartment[] = result.success ? result.data ?? [] : [];
      const availableDepartments = canViewAllDepartments
        ? allDepartments
        : allDepartments.filter((department) => matchesDepartment(department, sessionUser?.department));

      setDepartments(availableDepartments);
      if (availableDepartments.length === 0) {
        setSelectedDepartmentCode(null);
        message.warning("No purchasing forecast data is available for your department");
        return;
      }

      if (!selectedDepartmentCode || !availableDepartments.some(
        (department) => department.code === selectedDepartmentCode || department.name === selectedDepartmentCode
      )) {
        setSelectedDepartmentCode(availableDepartments[0].name);
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
      const forecastParams = new URLSearchParams({
        period: "monthly",
        departmentCode: selectedDepartmentCode,
      });
      const department = departments.find((dept) =>
        dept.code === selectedDepartmentCode || dept.name === selectedDepartmentCode
      );
      const forecastResponse = await fetch(`${API_ROOT}/budget/forecast?${forecastParams}`);
      const result: ForecastResponse = await forecastResponse.json();
      if (!result.success) throw new Error("Forecast request failed");

      const selectedPeriod = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
      const currentPeriodData = result.data.historical.find((item) => item.period === selectedPeriod);
      const averageAmount = result.data.summary.avgPerPeriod;
      let budgetUsage: BudgetUsageSummary | null = null;
      if (department?.id && sessionUser?.id && sessionUser.email) {
        const usageParams = new URLSearchParams({
          userId: String(sessionUser.id),
          email: sessionUser.email,
          year: String(currentYear),
          month: String(currentMonth),
        });
        const usageResponse = await fetch(
          `${API_ROOT}/department-budget/usage/${department.id}?${usageParams}`
        );
        const usageResult = await usageResponse.json();
        if (usageResult.success) budgetUsage = usageResult.data;
      }

      const allocatedAmount = budgetUsage?.allocatedAmount ?? averageAmount;
      const spentAmount = budgetUsage?.spentAmount ?? currentPeriodData?.totalAmount ?? 0;
      const reservedAmount = budgetUsage?.reservedAmount ?? 0;
      const remainingAmount = budgetUsage?.remainingAmount ?? allocatedAmount - spentAmount;
      const usagePercentage = budgetUsage?.usagePercentage ?? (
        allocatedAmount > 0 ? (spentAmount / allocatedAmount) * 100 : 0
      );

      setUsage({
        budgetId: budgetUsage?.budgetId ?? 0,
        department: budgetUsage?.department ?? {
          id: department?.id ?? 0,
          code: department?.code ?? selectedDepartmentCode,
          name: department?.name ?? selectedDepartmentCode,
        },
        year: currentYear,
        month: currentMonth,
        allocatedAmount,
        spentAmount,
        reservedAmount,
        remainingAmount,
        usagePercentage,
        status: usagePercentage > 100 ? "exceeded" : usagePercentage >= 80 ? "warning" : "normal",
      });

      const storedPredictions = department?.id && sessionUser?.id && sessionUser.email
        ? await getPredictions(department.id, { limit: 6 })
        : [];
      setPredictions(storedPredictions.length > 0
        ? storedPredictions
        : result.data.forecast.map((item, index) => {
            const [year, month] = item.period.split("-").map(Number);
            return {
              id: index + 1,
              departmentId: department?.id ?? 0,
              targetYear: year,
              targetMonth: month,
              predictedAmount: item.forecastAmount,
              confidence: item.confidence,
              triggerType: "automatic" as const,
              triggeredBy: 0,
              createdAt: new Date().toISOString(),
              department: { id: department?.id ?? 0, code: department?.code ?? selectedDepartmentCode, name: department?.name ?? selectedDepartmentCode, isActive: true },
              metadata: { algorithm: "Three-period moving average", basedOnMonths: 3 },
            };
          }));

      const historicalComparison = department?.id
        ? await getHistoricalComparison(department.id, { preset: "last-6-months" })
        : null;
      setHistorical(historicalComparison);
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
    if (!selectedDepartmentCode || !sessionUser?.id || !sessionUser.email) return;

    setTriggeringPrediction(true);
    message.loading({
      key: "generate-prediction",
      content: "AI Agent is analyzing purchasing history...",
      duration: 0,
    });
    try {
      const department = departments.find((dept) =>
        dept.code === selectedDepartmentCode || dept.name === selectedDepartmentCode
      );
      if (!department) throw new Error("Department not found");

      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const response = await fetch(`${API_ROOT}/department-budget/predict/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentCode: department.name,
          targetYear: nextYear,
          targetMonth: nextMonth,
          userId: sessionUser.id,
          email: sessionUser.email,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to generate prediction");
      }
      await loadBudgetData();
      const usedFallback = Boolean(result.data?.comparisonData?.usedFallback);
      message[usedFallback ? "warning" : "success"]({
        key: "generate-prediction",
        content: usedFallback
          ? `System fallback prediction generated for ${nextYear}-${String(nextMonth).padStart(2, "0")}`
          : `AI prediction generated for ${nextYear}-${String(nextMonth).padStart(2, "0")}`,
      });
    } catch (error: any) {
      console.error("Trigger prediction error:", error);
      message.error({
        key: "generate-prediction",
        content: error.message || "Failed to generate prediction",
      });
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
            disabled={!canViewAllDepartments}
          >
            {departments.map(d => (
              <Select.Option key={d.code} value={d.name}>
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
            {triggeringPrediction ? "Generating..." : "Generate Prediction"}
          </Button>
          <Button
            icon={<FormOutlined />}
            onClick={() => navigate("/budget/adjustment-request")}
          >
            Request Adjustment
          </Button>
          {canViewAllDepartments && (
            <Button
              icon={<AuditOutlined />}
              onClick={() => navigate("/budget/approval-queue")}
            >
              Approval Queue
            </Button>
          )}
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
              summary={historical.summary}
              title="Historical Budget vs Actual Purchasing Spend"
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DepartmentBudgetOverview;
