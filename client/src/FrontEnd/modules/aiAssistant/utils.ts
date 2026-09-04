import { AIAgent, AgentCategory, ConfigField } from './types';
import { MAIN_AGENTS } from './mainAgents';
import { MOCK_AGENTS } from './constants';

/**
 * Get all sub-agents that belong to a specific Main Agent
 */
export function getAgentsByMainAgent(mainAgentSlug: string): AIAgent[] {
  const mainAgent = MAIN_AGENTS.find(ma => ma.slug === mainAgentSlug);
  if (!mainAgent) return [];

  return MOCK_AGENTS.filter(agent =>
    mainAgent.categories.includes(agent.category)
  );
}

/**
 * Get a Main Agent by its slug
 */
export function getMainAgentBySlug(slug: string) {
  return MAIN_AGENTS.find(ma => ma.slug === slug);
}

/**
 * Group agents by their category
 */
export function groupAgentsByCategory(
  agents: AIAgent[]
): Record<string, AIAgent[]> {
  const grouped: Record<string, AIAgent[]> = {};

  agents.forEach(agent => {
    const category = agent.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(agent);
  });

  return grouped;
}

/**
 * Search agents by name, description, or tags
 */
export function searchAgents(agents: AIAgent[], query: string): AIAgent[] {
  if (!query.trim()) {
    return agents;
  }

  const lowerQuery = query.toLowerCase().trim();

  return agents.filter(agent => {
    // Search in name
    if (agent.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in description
    if ((agent.description ?? agent.fullDescription ?? '').toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in tags
    if (agent.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    return false;
  });
}

/**
 * Get color for a category (for UI styling)
 */
export function getCategoryColor(category: AgentCategory): string {
  const colorMap: Record<string, string> = {
    [AgentCategory.PROCUREMENT_PLANNING]: '#3b82f6',
    [AgentCategory.SUPPLIER_MANAGEMENT]: '#10b981',
    [AgentCategory.ORDER_EXECUTION]: '#8b5cf6',
    [AgentCategory.QUALITY_COMPLIANCE]: '#f59e0b',
    [AgentCategory.FINANCIAL]: '#ef4444',
    [AgentCategory.RISK_ANOMALY]: '#dc2626',
    [AgentCategory.DATA_ANALYTICS]: '#2563eb',
    [AgentCategory.COLLABORATION]: '#0891b2',
    [AgentCategory.OPTIMIZATION]: '#16a34a',
    [AgentCategory.USER_SUPPORT]: '#6b7280'
  };
  return colorMap[category] || '#6b7280';
}

/**
 * Validate a configuration value
 * Returns error message if invalid, null if valid
 */
export function validateConfigValue(
  value: any,
  field: ConfigField
): string | null {
  // Check required fields
  if (field.required && (value === undefined || value === null || value === '')) {
    return `${field.label} is required`;
  }

  // If not required and empty, it's valid
  if (!field.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  // Type-specific validation
  switch (field.type) {
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return `${field.label} must be a valid number`;
      }
      if (field.min !== undefined && value < field.min) {
        return `${field.label} must be at least ${field.min}`;
      }
      if (field.max !== undefined && value > field.max) {
        return `${field.label} must be at most ${field.max}`;
      }
      break;

    case 'text':
    case 'string':
      if (typeof value !== 'string') {
        return `${field.label} must be text`;
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        return `${field.label} must be true or false`;
      }
      break;

    case 'select':
      if (field.options && !field.options.some(opt => opt.value === value)) {
        return `${field.label} must be one of the available options`;
      }
      break;

    default:
      // Unknown type, skip validation
      break;
  }

  return null;
}
