import React from "react";
import { Card, Tag, Statistic, Space, Tooltip } from "antd";
import { RobotOutlined, ThunderboltOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { BudgetPrediction } from "../../shared/api/departmentBudget";

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
    if (prediction.confidence === "high") return "green";
    if (prediction.confidence === "medium") return "orange";
    return "red";
  };

  const getTriggerIcon = () => {
    return prediction.triggerType === "automatic" ? <ClockCircleOutlined /> : <ThunderboltOutlined />;
  };

  return (
    <Card
      hoverable={!!onSelect}
      onClick={() => onSelect?.(prediction)}
      loading={loading}
      style={{ height: "100%" }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>
              {prediction.department?.name || `Dept ${prediction.departmentId}`}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {formatPeriod(prediction.targetYear, prediction.targetMonth)}
            </div>
          </div>
          <RobotOutlined style={{ fontSize: 24, color: "#1890ff" }} />
        </div>

        <Statistic
          title="Predicted Budget"
          value={prediction.predictedAmount}
          precision={2}
          prefix="$"
          valueStyle={{ fontSize: 20 }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tooltip title="Prediction Confidence">
            <Tag color={getConfidenceColor()}>
              {prediction.confidence.toUpperCase()}
            </Tag>
          </Tooltip>
          <Tooltip title="Trigger Type">
            <Tag icon={getTriggerIcon()}>
              {prediction.triggerType}
            </Tag>
          </Tooltip>
        </div>

        {prediction.metadata?.algorithm && (
          <div style={{ fontSize: 11, color: "#8c8c8c" }}>
            Algorithm: {prediction.metadata.algorithm}
            {prediction.metadata.basedOnMonths && ` (${prediction.metadata.basedOnMonths}M history)`}
          </div>
        )}

        <div style={{ fontSize: 11, color: "#8c8c8c" }}>
          Created: {new Date(prediction.createdAt).toLocaleDateString()}
        </div>
      </Space>
    </Card>
  );
};
