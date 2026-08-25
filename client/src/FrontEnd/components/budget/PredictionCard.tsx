import React from "react";
import { Card, Tag, Statistic, Space, Tooltip, Collapse, Descriptions } from "antd";
import { RobotOutlined, ThunderboltOutlined, ClockCircleOutlined, LineChartOutlined } from "@ant-design/icons";
import type { BudgetPrediction } from "../../shared/api/departmentBudget";
import styles from "./PredictionCard.module.css";

interface PredictionCardProps {
  prediction: BudgetPrediction;
  loading?: boolean;
  onSelect?: (prediction: BudgetPrediction) => void;
}

const formatPeriod = (year: number, month: number): string => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[month - 1]} ${year}`;
};

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, loading, onSelect }) => {
  const getConfidenceColor = () => {
    if (prediction.confidence === "very_high") return "green";
    if (prediction.confidence === "high") return "green";
    if (prediction.confidence === "medium") return "orange";
    return "red";
  };

  const comparison = prediction.comparisonData;
  const algorithm = prediction.algorithm || prediction.metadata?.algorithm;
  const isFallback = Boolean(
    comparison?.usedFallback ||
    algorithm === "default" ||
    algorithm === "similar_department" ||
    algorithm === "moving_average_fallback"
  );
  const interval = comparison?.predictionInterval;
  const modelBreakdown = comparison?.modelBreakdown;
  const categoryBreakdown = prediction.categoryBreakdown;
  const formatAmount = (value?: number) =>
    typeof value === "number"
      ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "-";

  const analysisItems = [
    {
      key: "analysis",
      label: "View AI Analysis",
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          {prediction.aiInsights && (
            <div style={{ lineHeight: 1.55 }}>{prediction.aiInsights}</div>
          )}
          <Descriptions size="small" column={1} bordered>
            {comparison?.historicalPeriods !== undefined && (
              <Descriptions.Item label="Historical data">
                {comparison.historicalPeriods} months
              </Descriptions.Item>
            )}
            {comparison?.similarDepartment && (
              <Descriptions.Item label="Reference department">
                {comparison.similarDepartment}
                {comparison.similarity !== undefined &&
                  ` (${Math.round(comparison.similarity * 100)}% similarity)`}
              </Descriptions.Item>
            )}
            {comparison?.referenceMonths !== undefined && (
              <Descriptions.Item label="Reference history">
                {comparison.referenceMonths} months
              </Descriptions.Item>
            )}
            {comparison?.lastMonthAmount !== undefined && (
              <Descriptions.Item label="Last month">
                {formatAmount(comparison.lastMonthAmount)}
              </Descriptions.Item>
            )}
            {comparison?.avgAmount !== undefined && (
              <Descriptions.Item label="Historical average">
                {formatAmount(comparison.avgAmount)}
              </Descriptions.Item>
            )}
            {comparison?.trend && (
              <Descriptions.Item label="Spending trend">
                {comparison.trend}
              </Descriptions.Item>
            )}
            {(interval?.lower !== undefined || interval?.upper !== undefined) && (
              <Descriptions.Item label="Prediction range">
                {formatAmount(interval?.lower)} - {formatAmount(interval?.upper)}
              </Descriptions.Item>
            )}
            {modelBreakdown && Object.keys(modelBreakdown).length > 0 && (
              <Descriptions.Item label="Model results">
                <Space direction="vertical" size={0}>
                  {Object.entries(modelBreakdown).map(([model, value]) => (
                    <span key={model}>{model}: {formatAmount(Number(value))}</span>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            {categoryBreakdown && Object.keys(categoryBreakdown).length > 0 && (
              <Descriptions.Item label="Category breakdown">
                <Space direction="vertical" size={0}>
                  {Object.entries(categoryBreakdown).map(([category, value]) => (
                    <span key={category}>{category}: {formatAmount(Number(value))}</span>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Space>
      )
    }
  ];

  const getTriggerIcon = () => {
    return prediction.triggerType === "automatic" ? <ClockCircleOutlined /> : <ThunderboltOutlined />;
  };

  return (
    <Card
      hoverable={!!onSelect}
      onClick={() => onSelect?.(prediction)}
      loading={loading}
      className={styles.card}
      styles={{ body: { padding: 0 } }}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.department}>
            {prediction.department?.name || `Dept ${prediction.departmentId}`}
          </div>
          <div className={styles.period}>{formatPeriod(prediction.targetYear, prediction.targetMonth)}</div>
        </div>
        <div className={styles.aiMark} aria-hidden="true"><RobotOutlined /></div>
      </div>

      <div className={styles.body}>
        <div className={styles.summary}>
          <Statistic
            title="Predicted Budget"
            value={prediction.predictedAmount}
            precision={2}
            prefix="$"
            styles={{ content: { fontSize: 28, fontWeight: 650, color: "#0f172a" } }}
          />

          <div className={styles.tags}>
            <Tooltip title="Prediction Confidence">
              <Tag color={getConfidenceColor()}>{prediction.confidence.toUpperCase()}</Tag>
            </Tooltip>
            <Tooltip title="Trigger Type">
              <Tag icon={getTriggerIcon()}>{prediction.triggerType}</Tag>
            </Tooltip>
            <Tag color={isFallback ? "orange" : "blue"} icon={isFallback ? <LineChartOutlined /> : <RobotOutlined />}>
              {algorithm === "similar_department" ? "Similar department" : algorithm === "default" ? "System default" : isFallback ? "System fallback" : "AI analysis"}
            </Tag>
          </div>

          {algorithm && (
            <div className={styles.metadata}>
              Algorithm: {algorithm}
              {prediction.metadata?.basedOnMonths && ` (${prediction.metadata.basedOnMonths}M history)`}
            </div>
          )}
          <div className={styles.created}>Created: {new Date(prediction.createdAt).toLocaleDateString()}</div>
        </div>

        <div className={styles.analysis}>
          <div className={styles.analysisHeading}>Forecast details</div>
          <Collapse ghost items={analysisItems} />
        </div>
      </div>
    </Card>
  );
};
