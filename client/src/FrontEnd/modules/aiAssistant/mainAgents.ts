// client/src/FrontEnd/modules/aiAssistant/mainAgents.ts

// Color constants for Main Agent cards
const COLORS = {
  BLUE: '#1890ff',
  PURPLE: '#722ed1',
  GREEN: '#52c41a',
  ORANGE: '#fa541c',
  CYAN: '#13c2c2',
  PINK: '#eb2f96'
} as const;

/**
 * Represents a Main Agent category in the AI Assistant interface.
 * Main Agents group related sub-agents by functional domain.
 */
export interface MainAgent {
  /** Unique identifier for data operations */
  id: string;
  /** Display name of the Main Agent */
  name: string;
  /** Brief description shown below the name */
  subtitle: string;
  /** Emoji icon for visual identification (emojis used consistently across project UI) */
  icon: string;
  /** Theme color for the card background */
  color: string;
  /** Number of sub-agents in this category (from design specification) */
  subAgentCount: number;
  /** Preview icons representing key sub-agents */
  previewIcons: string[];
  /** URL-friendly identifier for routing (kept separate from id per React Router convention) */
  slug: string;
  /** Original category IDs that map to this Main Agent */
  categories: string[];
}

export const MAIN_AGENTS: MainAgent[] = [
  {
    id: 'procurement-planning',
    name: 'Procurement Planning',
    subtitle: 'Strategic planning & forecasting',
    icon: '📋',
    color: COLORS.BLUE,
    subAgentCount: 5,
    previewIcons: ['📊', '📈', '💰', '📅', '🔄'],
    slug: 'procurement-planning',
    categories: ['procurement_planning']
  },
  {
    id: 'supplier-management',
    name: 'Supplier Management',
    subtitle: 'Vendor evaluation & relationships',
    icon: '🏢',
    color: COLORS.PURPLE,
    subAgentCount: 5,
    previewIcons: ['🔍', '🤝', '📝', '⚠️', '⚖️'],
    slug: 'supplier-management',
    categories: ['supplier_management']
  },
  {
    id: 'order-collaboration',
    name: 'Order & Collaboration',
    subtitle: 'Execution & team communication',
    icon: '📦',
    color: COLORS.GREEN,
    subAgentCount: 10,
    previewIcons: ['📍', '⏱️', '🤖', '💬', '🌐'],
    slug: 'order-collaboration',
    categories: ['order_execution', 'collaboration']
  },
  {
    id: 'quality-risk',
    name: 'Quality & Risk',
    subtitle: 'Compliance & anomaly detection',
    icon: '🎯',
    color: COLORS.ORANGE,
    subAgentCount: 10,
    previewIcons: ['✅', '📋', '🔐', '🚨', '🛡️'],
    slug: 'quality-risk',
    categories: ['quality_compliance', 'risk_anomaly']
  },
  {
    id: 'financial-optimization',
    name: 'Financial & Optimization',
    subtitle: 'Cost control & process improvement',
    icon: '💰',
    color: COLORS.CYAN,
    subAgentCount: 15,
    previewIcons: ['💵', '📊', '🚀', '🌱', '📍'],
    slug: 'financial-optimization',
    categories: ['financial', 'optimization', 'user_support']
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    subtitle: 'Insights & performance tracking',
    icon: '📊',
    color: COLORS.PINK,
    subAgentCount: 5,
    previewIcons: ['📈', '📉', '📑', '🎯', '💹'],
    slug: 'data-analytics',
    categories: ['data_analytics']
  }
];
