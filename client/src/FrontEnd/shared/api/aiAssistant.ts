/**
 * AI Assistant Configuration API Layer
 *
 * Current implementation uses localStorage for persistence.
 * TODO: Replace with actual backend API calls when available.
 *
 * Future integration points:
 * - POST /api/ai-agents/:agentId/config - Save configuration
 * - GET /api/ai-agents/:agentId/config - Get configuration
 * - DELETE /api/ai-agents/:agentId/config - Reset configuration
 * - GET /api/ai-agents - List all agents
 * - GET /api/ai-agents/:agentId - Get single agent
 */

import { AIAgent, AgentConfigResponse } from '../../modules/aiAssistant/types';
import { MOCK_AGENTS } from '../../modules/aiAssistant/constants';

/**
 * Simulates network delay for API calls
 */
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a localStorage key for agent configuration
 */
const getStorageKey = (agentId: string): string =>
  `ai-agent-config-${agentId}`;

/**
 * Retrieves all available AI agents
 *
 * @returns Promise resolving to array of all agents
 *
 * Future: Replace with GET /api/ai-agents
 */
export const getAllAgents = async (): Promise<AIAgent[]> => {
  await delay(300);

  // TODO: Replace with actual API call
  // const response = await fetch('/api/ai-agents');
  // return response.json();

  return MOCK_AGENTS;
};

/**
 * Retrieves a single AI agent by ID
 *
 * @param agentId - The unique identifier of the agent
 * @returns Promise resolving to the agent
 * @throws Error if agent not found
 *
 * Future: Replace with GET /api/ai-agents/:agentId
 */
export const getAgentById = async (agentId: string): Promise<AIAgent> => {
  await delay(200);

  // TODO: Replace with actual API call
  // const response = await fetch(`/api/ai-agents/${agentId}`);
  // if (!response.ok) throw new Error('Agent not found');
  // return response.json();

  const agent = MOCK_AGENTS.find(a => a.id === agentId);

  if (!agent) {
    throw new Error(`Agent with ID "${agentId}" not found`);
  }

  return agent;
};

/**
 * Saves agent configuration to storage
 *
 * @param agentId - The unique identifier of the agent
 * @param config - Configuration object with field values
 * @returns Promise resolving to success response
 *
 * Future: Replace with POST /api/ai-agents/:agentId/config
 */
export const saveAgentConfig = async (
  agentId: string,
  config: Record<string, any>
): Promise<AgentConfigResponse> => {
  await delay(500);

  // Verify agent exists
  const agent = await getAgentById(agentId);

  // TODO: Replace with actual API call
  // const response = await fetch(`/api/ai-agents/${agentId}/config`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(config)
  // });
  // return response.json();

  const storageKey = getStorageKey(agentId);

  try {
    localStorage.setItem(storageKey, JSON.stringify(config));

    return {
      success: true,
      message: `Configuration saved successfully for ${agent.name}`,
      agentId,
      config
    };
  } catch (error) {
    console.error('Failed to save configuration:', error);
    throw new Error('Failed to save configuration to localStorage');
  }
};

/**
 * Retrieves saved agent configuration from storage
 *
 * @param agentId - The unique identifier of the agent
 * @returns Promise resolving to configuration object (empty if none saved)
 *
 * Future: Replace with GET /api/ai-agents/:agentId/config
 */
export const getAgentConfig = async (
  agentId: string
): Promise<Record<string, any>> => {
  await delay(200);

  // Verify agent exists
  await getAgentById(agentId);

  // TODO: Replace with actual API call
  // const response = await fetch(`/api/ai-agents/${agentId}/config`);
  // if (response.status === 404) return {};
  // return response.json();

  const storageKey = getStorageKey(agentId);

  try {
    const savedConfig = localStorage.getItem(storageKey);

    if (!savedConfig) {
      return {};
    }

    return JSON.parse(savedConfig);
  } catch (error) {
    console.error('Failed to retrieve configuration:', error);
    return {};
  }
};

/**
 * Resets agent configuration by removing saved data
 *
 * @param agentId - The unique identifier of the agent
 * @returns Promise resolving to success response
 *
 * Future: Replace with DELETE /api/ai-agents/:agentId/config
 */
export const resetAgentConfig = async (
  agentId: string
): Promise<AgentConfigResponse> => {
  await delay(300);

  // Verify agent exists
  const agent = await getAgentById(agentId);

  // TODO: Replace with actual API call
  // const response = await fetch(`/api/ai-agents/${agentId}/config`, {
  //   method: 'DELETE'
  // });
  // return response.json();

  const storageKey = getStorageKey(agentId);

  try {
    localStorage.removeItem(storageKey);

    return {
      success: true,
      message: `Configuration reset successfully for ${agent.name}`,
      agentId,
      config: {}
    };
  } catch (error) {
    console.error('Failed to reset configuration:', error);
    throw new Error('Failed to reset configuration');
  }
};
