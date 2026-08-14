import React, { useState, useEffect } from "react";
import {
  Card,
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Table,
  Spin,
  message,
  Empty,
} from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { getDepartments, type Department } from "../../shared/api/departmentBudget";
import styles from "./BudgetForecasting.module.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface HistoricalData {
  period: string;
  totalAmount: number;
  requestCount: number;
  categories: Record<string, number>;
}

interface ForecastData {
  period: string;
  forecastAmount: number;
  confidence: string;
}

interface CategoryData {
  category: string;
  amount: number;
}

interface BudgetForecastResponse {
  success: boolean;
  data: {
    historical: HistoricalData[];
    forecast: ForecastData[];
    summary: {
      totalHistoricalAmount: number;
      totalRequests: number;
      avgPerPeriod: number;
      periodType: string;
      dateRange: {
        start: string;
        end: string;
      };
    };
  };
}

const COLORS = ["#16A34A", "#0EA5E9", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6"];

const BudgetForecasting: React.FC = () => {
  const { t } = useTranslation(["budgetManagement", "common"]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [forecastData, setForecastData] = useState<BudgetForecastResponse["data"] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState<string | null>(null);

  const fetchForecastData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ period });
      if (dateRange) {
        params.append("startDate", dateRange[0].format("YYYY-MM-DD"));
        params.append("endDate", dateRange[1].format("YYYY-MM-DD"));
      }
      if (selectedDepartmentCode) {
        params.append("departmentCode", selectedDepartmentCode);
      }

      const response = await fetch(`http://localhost:4000/api/budget/forecast?${params}`);
      const result: BudgetForecastResponse = await response.json();

      if (result.success) {
        setForecastData(result.data);
      } else {
        message.error(t("common:fetchError"));
      }
    } catch (error) {
      console.error("Fetch forecast error:", error);
      message.error(t("common:fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append("startDate", dateRange[0].format("YYYY-MM-DD"));
        params.append("endDate", dateRange[1].format("YYYY-MM-DD"));
      }
      if (selectedDepartmentCode) {
        params.append("departmentCode", selectedDepartmentCode);
      }

      const response = await fetch(`http://localhost:4000/api/budget/categories?${params}`);
      const result = await response.json();

      if (result.success) {
        setCategoryData(result.data);
      }
    } catch (error) {
      console.error("Fetch category error:", error);
    }
  };

  useEffect(() => {
    const loadDepartments = async () => {
      const depts = await getDepartments(true);
      setDepartments(depts);
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    fetchForecastData();
    fetchCategoryData();
  }, [period, dateRange, selectedDepartmentCode]);

  const combinedChartData = [
    ...(forecastData?.historical || []).map((item) => ({
      period: item.period,
      actual: item.totalAmount,
      forecast: null,
      type: "historical",
    })),
    ...(forecastData?.forecast || []).map((item) => ({
      period: item.period,
      actual: null,
      forecast: item.forecastAmount,
      type: "forecast",
    })),
  ];

  const categoryChartData = categoryData.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const columns = [
    {
      title: t("budgetManagement:period"),
      dataIndex: "period",
      key: "period",
    },
    {
      title: t("budgetManagement:amount"),
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => `RM ${value.toLocaleString()}`,
    },
    {
      title: t("budgetManagement:requestCount"),
      dataIndex: "requestCount",
      key: "requestCount",
    },
  ];

  const historicalTableData = forecastData?.historical.map((item, index) => ({
    key: index,
    period: item.period,
    amount: item.totalAmount,
    requestCount: item.requestCount,
  })) || [];

  const forecastColumns = [
    {
      title: t("budgetManagement:period"),
      dataIndex: "period",
      key: "period",
    },
    {
      title: t("budgetManagement:forecastAmount"),
      dataIndex: "forecastAmount",
      key: "forecastAmount",
      render: (value: number) => `RM ${value.toLocaleString()}`,
    },
    {
      title: t("budgetManagement:confidence"),
      dataIndex: "confidence",
      key: "confidence",
      render: (value: string) => (
        <span className={styles[`confidence-${value}`]}>
          {t(`budgetManagement:${value}`)}
        </span>
      ),
    },
  ];

  const forecastTableData = forecastData?.forecast.map((item, index) => ({
    key: index,
    period: item.period,
    forecastAmount: item.forecastAmount,
    confidence: item.confidence,
  })) || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("budgetManagement:budgetForecasting")}</h1>
        <div className={styles.controls}>
          <Select
            value={selectedDepartmentCode}
            onChange={setSelectedDepartmentCode}
            style={{ width: 200 }}
            placeholder={t("budgetManagement:allDepartments")}
            allowClear
            className={styles.select}
          >
            {departments.map(d => (
              <Option key={d.code} value={d.code}>
                {d.name}
              </Option>
            ))}
          </Select>
          <Select
            value={period}
            onChange={setPeriod}
            style={{ width: 150 }}
            className={styles.select}
          >
            <Option value="monthly">{t("budgetManagement:monthly")}</Option>
            <Option value="quarterly">{t("budgetManagement:quarterly")}</Option>
            <Option value="yearly">{t("budgetManagement:yearly")}</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            format="YYYY-MM-DD"
            className={styles.datePicker}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : forecastData ? (
        <>
          <Row gutter={[16, 16]} className={styles.statsRow}>
            <Col xs={24} sm={12} lg={8}>
              <Card className={styles.statCard}>
                <Statistic
                  title={t("budgetManagement:totalSpending")}
                  value={forecastData.summary.totalHistoricalAmount}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="RM"
                  valueStyle={{ color: "#16A34A" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className={styles.statCard}>
                <Statistic
                  title={t("budgetManagement:totalRequests")}
                  value={forecastData.summary.totalRequests}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: "#0EA5E9" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className={styles.statCard}>
                <Statistic
                  title={t("budgetManagement:avgPerPeriod")}
                  value={forecastData.summary.avgPerPeriod}
                  precision={2}
                  suffix="RM"
                  valueStyle={{ color: "#D97706" }}
                />
              </Card>
            </Col>
          </Row>

          <Card className={styles.chartCard} title={t("budgetManagement:trendAnalysis")}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={combinedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="period" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#16A34A"
                  strokeWidth={2}
                  name={t("budgetManagement:actualSpending")}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name={t("budgetManagement:forecastSpending")}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card className={styles.tableCard} title={t("budgetManagement:historicalData")}>
                <Table
                  columns={columns}
                  dataSource={historicalTableData}
                  pagination={{ pageSize: 10 }}
                  className={styles.table}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card className={styles.chartCard} title={t("budgetManagement:categoryBreakdown")}>
                {categoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description={t("common:noData")} />
                )}
              </Card>
            </Col>
          </Row>

          <Card className={styles.tableCard} title={t("budgetManagement:forecastPredictions")}>
            <Table
              columns={forecastColumns}
              dataSource={forecastTableData}
              pagination={false}
              className={styles.table}
            />
          </Card>
        </>
      ) : (
        <Empty description={t("common:noData")} />
      )}
    </div>
  );
};

export default BudgetForecasting;
