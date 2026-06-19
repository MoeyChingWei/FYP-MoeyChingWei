/**
 * Agent Configuration API
 *
 * This module provides API functions for managing AI agent configurations.
 * Re-exports from the shared API layer for backward compatibility.
 */

import type { AgentConfig } from '../FrontEnd/types/agent';
import {
  getAgentConfig as getConfig,
  saveAgentConfig as saveConfig,
  resetAgentConfig,
  getAllAgents,
  getAgentById,
} from '../FrontEnd/shared/api/aiAssistant';

/**
 * Get agent configuration
 * @param agentId - The agent ID
 * @returns Promise resolving to agent configuration
 */
export const getAgentConfig = async (agentId: string): Promise<AgentConfig> => {
  const config = await getConfig(agentId);

  // Provide defaults if config is empty
  return {
    enabled: config.enabled ?? true,
    priority: config.priority ?? 50,
    timeout: config.timeout ?? 30000,
    maxRetries: config.maxRetries ?? 3,
    ...config,
  };
};

/**
 * Save agent configuration
 * @param agentId - The agent ID
 * @param config - The configuration to save
 * @returns Promise resolving to success response
 */
export const saveAgentConfig = async (
  agentId: string,
  config: AgentConfig
): Promise<void> => {
  await saveConfig(agentId, config);
};

// Re-export other functions
export { resetAgentConfig, getAllAgents, getAgentById };
