// Type definitions for AI Assistant Configuration System

/**
 * Categories for AI agents
 */
export enum AgentCategory {
  PROCUREMENT_PLANNING = 'procurement_planning',
  SUPPLIER_MANAGEMENT = 'supplier_management',
  ORDER_EXECUTION = 'order_execution',
  QUALITY_COMPLIANCE = 'quality_compliance',
  FINANCIAL = 'financial',
  RISK_ANOMALY = 'risk_anomaly',
  DATA_ANALYTICS = 'data_analytics',
  COLLABORATION = 'collaboration',
  OPTIMIZATION = 'optimization',
  USER_SUPPORT = 'user_support',
}

/**
 * Status of an AI agent
 */
export enum AgentStatus {
  READY = 'ready',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  icon: string;
  label: string;
  sublabel?: string;
  description: string;
}

/**
 * Configuration field types
 */
export type ConfigFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'switch'
  | 'slider'
  | 'dateRange';

/**
 * Configuration field definition
 */
export interface ConfigField {
  key: string;
  label: string;
  type: ConfigFieldType;
  defaultValue?: any;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  helpText?: string;
}

/**
 * AI Agent model
 */
export interface AIAgent {
  id: string;
  name: string;
  category: AgentCategory;
  status: AgentStatus;
  description: string;
  icon: string;
  workflow: WorkflowStep[];
  configFields: ConfigField[];
  currentConfig?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Category metadata for display
 */
export interface CategoryMetadata {
  label: string;
  icon: string;
  description: string;
}

/**
 * Request to save agent configuration
 */
export interface SaveConfigRequest {
  agentId: string;
  config: Record<string, any>;
}

/**
 * Response from agent configuration API
 */
export interface AgentConfigResponse {
  success: boolean;
  message?: string;
  agentId: string;
  config: Record<string, any>;
  data?: AIAgent;
}
