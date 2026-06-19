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
): Record<AgentCategory, AIAgent[]> {
  const grouped: Record<AgentCategory, AIAgent[]> = {
    'Code Assistant': [],
    'Chat': [],
    'Research': [],
    'Creative': [],
    'Analysis': [],
    'Other': []
  };

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
    if (agent.description.toLowerCase().includes(lowerQuery)) {
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
  const colorMap: Record<AgentCategory, string> = {
    'Code Assistant': '#3b82f6', // blue
    'Chat': '#10b981', // green
    'Research': '#8b5cf6', // purple
    'Creative': '#f59e0b', // amber
    'Analysis': '#ef4444', // red
    'Other': '#6b7280' // gray
  };

  return colorMap[category] || colorMap['Other'];
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

    case 'string':
    case 'text':
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
