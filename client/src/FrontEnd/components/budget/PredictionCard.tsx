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
  const numericCategoryBreakdown = Object.entries(categoryBreakdown ?? {})
    .filter(([, value]) => Number.isFinite(Number(value)));
  const riskAdjustment = comparison?.riskAdjustment;
  const formatAmount = (value?: number) =>
    typeof value === "number"
      ? `RM ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "-";

  const technicalDetailItems = [
    {
      key: "technical-details",
      label: "See calculation details",
      children: (
        <Space direction="vertical" style={{ width: "100%" }} size="small">
          {prediction.aiInsights && (
            <div className={styles.technicalNote}>{prediction.aiInsights}</div>
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
            {numericCategoryBreakdown.length > 0 && (
              <Descriptions.Item label="Category breakdown">
                <Space direction="vertical" size={0}>
                  {numericCategoryBreakdown.map(([category, value]) => (
                    <span key={category}>{category}: {formatAmount(Number(value))}</span>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            {riskAdjustment && (
              <>
                <Descriptions.Item label="Contingency reserve">
                  {formatAmount(riskAdjustment.contingencyReserve)} ({riskAdjustment.reserveRate}%)
                </Descriptions.Item>
                <Descriptions.Item label="Expected planned procurement needs">
                  {formatAmount(riskAdjustment.expectedEventImpact)}
                </Descriptions.Item>
                <Descriptions.Item label="Recommended allocation">
                  <strong>{formatAmount(riskAdjustment.scenarios.recommended)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Budget scenarios">
                  <Space direction="vertical" size={0}>
                    <span>Conservative: {formatAmount(riskAdjustment.scenarios.conservative)}</span>
                    <span>Recommended: {formatAmount(riskAdjustment.scenarios.recommended)}</span>
                    <span>High risk: {formatAmount(riskAdjustment.scenarios.highRisk)}</span>
                  </Space>
                </Descriptions.Item>
                {riskAdjustment.contributors.length > 0 && (
                  <Descriptions.Item label="Risk contributors">
                    <Space direction="vertical" size={0}>
                      {riskAdjustment.contributors.map((contributor, index) => (
                        <span key={`${contributor.type}-${contributor.label}-${index}`}>
                          {contributor.label}
                          {contributor.amount !== undefined && `: ${formatAmount(contributor.amount)}`}
                          {contributor.likelihood && ` (${contributor.likelihood})`}
                        </span>
                      ))}
                    </Space>
                  </Descriptions.Item>
                )}
              </>
            )}
          </Descriptions>
        </Space>
      )
    }
  ];

  const riskReasons = riskAdjustment?.contributors
    .filter((contributor) => contributor.type !== "upcoming_event")
    .map((contributor) => {
      if (contributor.type === "volatility") return "Previous monthly spending varies, so a reserve is included.";
      if (contributor.type === "growth") return "Recent spending is higher than the historical average.";
      if (contributor.type === "request_signals") return "Recent urgent or non-routine purchase requests increase budget risk.";
      return contributor.label;
    }) ?? [];
  const plannedNeeds = riskAdjustment?.contributors.filter((contributor) => contributor.type === "upcoming_event") ?? [];

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
            prefix="RM "
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
          {riskAdjustment && (
            <div className={styles.recommendedBudget}>
              Recommended budget: {formatAmount(riskAdjustment.scenarios.recommended)}
            </div>
          )}
          <div className={styles.created}>Created: {new Date(prediction.createdAt).toLocaleDateString()}</div>
        </div>

        <div className={styles.analysis}>
          {riskAdjustment ? (
            <>
              <div className={styles.analysisHeading}>Why this budget?</div>
              <div className={styles.recommendationLead}>
                <div className={styles.recommendationLabel}>Recommended next-month budget</div>
                <div className={styles.recommendationAmount}>{formatAmount(riskAdjustment.scenarios.recommended)}</div>
                <div className={styles.recommendationCopy}>
                  This recommendation includes normal spending, a risk reserve, and known planned procurement needs.
                </div>
              </div>
              <div className={styles.explanationRows}>
                <div><span>Normal spending forecast</span><strong>{formatAmount(riskAdjustment.baseForecast)}</strong></div>
                <div><span>Risk reserve</span><strong>{formatAmount(riskAdjustment.contingencyReserve)}</strong></div>
                {riskAdjustment.expectedEventImpact > 0 && <div><span>Planned procurement needs</span><strong>{formatAmount(riskAdjustment.expectedEventImpact)}</strong></div>}
              </div>
              <div className={styles.reasonList}>
                {riskReasons.map((reason) => <div key={reason}>• {reason}</div>)}
                {plannedNeeds.map((need) => <div key={need.label}>• {need.label} is included at {formatAmount(need.amount)}.</div>)}
                <div>• Confidence is {prediction.confidence.replace("_", " ")} based on {comparison?.historicalPeriods ?? "available"} months of historical data.</div>
              </div>
            </>
          ) : (
            <div className={styles.noRiskSummary}>This forecast is based on the available purchasing history. Generate a new prediction to include risk-adjusted budgeting.</div>
          )}
          <div className={styles.detailsHeading}>Technical details</div>
          <Collapse ghost items={technicalDetailItems} />
        </div>
      </div>
    </Card>
  );
};
