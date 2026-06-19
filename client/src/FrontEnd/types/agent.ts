// Re-export types from the aiAssistant module for backward compatibility
export type {
  AIAgent,
  AgentCategory,
  AgentStatus,
  WorkflowStep,
  ConfigField,
  ConfigFieldType,
  AgentConfigResponse,
} from '../modules/aiAssistant/types';

// Additional type for AgentCard component
export interface AgentConfig {
  enabled: boolean;
  priority: number;
  timeout: number;
  maxRetries: number;
  [key: string]: any;
}
