# AI Assistant Configuration System - Design Specification

**Date:** 2026-06-13  
**Project:** OptiMind - Procurement Tracking System  
**Feature:** AI Agent Configuration Interface  
**Status:** Design Approved

---

## Executive Summary

This document specifies the design for a comprehensive AI Assistant Configuration system within the OptiMind Settings module. The system will provide a user-friendly interface to discover, understand, and configure 50 specialized AI agents across 10 functional categories related to procurement management.

**Key Design Decisions:**
- **Layout:** Tabbed interface with 10 category tabs, each containing 5 agents
- **Card Style:** Compact horizontal cards with expandable details
- **Interaction:** Click to expand in-place, showing workflow visualization and configuration options
- **Configuration:** Mixed approach with general settings + agent-specific options
- **Workflow Display:** Visual flowcharts with icons and connecting lines
- **Implementation:** Frontend-first with API layer prepared for future backend integration
- **Responsive:** Full responsive design supporting desktop, tablet, and mobile

---

## Table of Contents

1. [User Requirements](#1-user-requirements)
2. [System Architecture](#2-system-architecture)
3. [UI/UX Design](#3-uiux-design)
4. [Data Models](#4-data-models)
5. [Component Structure](#5-component-structure)
6. [Agent Definitions](#6-agent-definitions)
7. [Interaction Details](#7-interaction-details)
8. [API Integration](#8-api-integration)
9. [Responsive Design](#9-responsive-design)
10. [Performance & Accessibility](#10-performance--accessibility)
11. [Error Handling](#11-error-handling)
12. [Future Considerations](#12-future-considerations)

---

## 1. User Requirements

### 1.1 Goals

**Primary Users:**
- **End Users (Employees, Managers):** Discover AI capabilities and configure agents for their workflow
- **Developers/Admins:** Understand agent functionality and manage configurations

**User Needs:**
1. **Discoverability:** Easily browse and search 50 AI agents
2. **Understanding:** Quickly grasp what each agent does and how it works
3. **Configuration:** Simple interface to customize agent behavior
4. **Clarity:** Clear visual representation of agent workflows
5. **Accessibility:** Works well on all devices and screen sizes

### 1.2 User Stories

- As a procurement manager, I want to see all AI agents organized by category so I can find relevant automation tools
- As an employee, I want to understand how an AI agent works before enabling it
- As a developer, I want to configure agent parameters to match our business processes
- As a mobile user, I want to review AI agent capabilities on my tablet
- As a system admin, I want to save agent configurations for future use

### 1.3 Success Criteria

- Users can find a specific agent within 10 seconds using search or categories
- Users understand an agent's purpose within 5 seconds of viewing its card
- Configuration changes can be saved in under 30 seconds
- System works smoothly on desktop (1024px+), tablet (768-1023px), and mobile (<768px)
- All interactions are keyboard-accessible and screen-reader friendly

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Settings Home                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │Category │  │ Company │  │Feedback │  │   AI    ││
│  │Selection│  │ Address │  │         │  │Assistant││
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘│
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│          AI Assistant Configuration Page             │
│                                                      │
│  Search Bar                                          │
│  ┌───────────────────────────────────────────────┐ │
│  │ 🔍 Search agents...                            │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  Category Tabs                                       │
│  [📋 Procurement] [🏢 Supplier] [📦 Order] ...      │
│                                                      │
│  Agent Cards (5 per category)                        │
│  ┌───────────────────────────────────────────────┐ │
│  │ 🤖 Smart Procurement Agent        [Details ▼]│ │
│  │ Analyze historical data and recommend...      │ │
│  │ 📊 → 🔍 → 💡 → ✅                            │ │
│  │ Status: ⚪ Ready                              │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  [Expanded Card - Configuration Interface]           │
└─────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
<AIAssistantSubmodule>
  ├─ <PageHeader>
  │   ├─ Title: "AI Assistant Configuration"
  │   └─ <SearchBar />
  │
  ├─ <Tabs>
  │   ├─ Tab: Procurement Planning
  │   ├─ Tab: Supplier Management
  │   ├─ Tab: Order Execution
  │   ├─ Tab: Quality & Compliance
  │   ├─ Tab: Financial
  │   ├─ Tab: Risk & Anomaly
  │   ├─ Tab: Data Analytics
  │   ├─ Tab: Collaboration
  │   ├─ Tab: Optimization
  │   └─ Tab: User Support
  │
  └─ <AgentList>
      └─ <AgentCard> (5 per tab)
          ├─ <AgentCardCompact>
          │   ├─ Icon
          │   ├─ Name & Description
          │   ├─ <SimplifiedWorkflow>
          │   ├─ Status Indicator
          │   └─ "View Details" Button
          │
          └─ <AgentCardExpanded> (conditional)
              ├─ <AgentWorkflow>
              │   ├─ Visual Flow Diagram
              │   └─ Step Descriptions
              │
              └─ <AgentConfigForm>
                  ├─ General Settings Section
                  ├─ Agent-Specific Settings Section
                  └─ Save/Reset Buttons
```

### 2.3 Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/settings` | `SettingsHome` | Settings landing page with AI Assistant card |
| `/settings/ai-assistant` | `AIAssistantSubmodule` | AI Agent configuration interface |
| `/settings/ai-assistant?tab=procurement_planning` | `AIAssistantSubmodule` | Direct link to specific category tab |
| `/settings/ai-assistant?agent=smart-procurement-agent` | `AIAssistantSubmodule` | Direct link with specific agent expanded |

### 2.4 State Management

**Local Component State:**
- Current active tab
- Search query
- Expanded agent ID
- Form values for configuration

**Persistent State (localStorage):**
- Agent configurations per user
- Last viewed tab
- User preferences

**Future Backend State:**
- Agent configurations stored in database
- Agent runtime status
- Usage analytics

---

## 3. UI/UX Design

### 3.1 Settings Home Page Update

**Add new card to existing grid:**

```tsx
<Card
  hoverable
  className={styles.tile}
  onClick={() => navigate("/settings/ai-assistant")}
  aria-label="Open AI Assistant configuration"
>
  <Flex vertical align="center" gap={14}>
    <div className={styles.iconWrap}>
      <RobotOutlined className={styles.tileIcon} />
    </div>
    <Text strong className={styles.tileTitle}>
      AI Assistant
    </Text>
    <Flex align="center" gap={6}>
      <Text type="secondary">Manage</Text>
      <RightOutlined className={styles.tileChevron} />
    </Flex>
  </Flex>
</Card>
```

**Visual Style:**
- Theme color: `#f59e0b` (amber/gold - consistent with chatbot icon)
- Icon: `RobotOutlined` from Ant Design Icons
- Follows existing Settings card pattern
- Position: 4th card in the grid

---

## 3.2 AI Assistant Configuration Page Layout

### 3.2.1 Page Header

```
┌─────────────────────────────────────────────────────┐
│ ← Settings                                           │
│                                                      │
│ AI Assistant Configuration                          │
│                                                      │
│ Discover and configure AI agents to automate        │
│ your procurement workflow                            │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Breadcrumb: Settings > AI Assistant
- Title: H4, left-aligned
- Subtitle: Brief description of the feature
- Max width: 980px (consistent with Settings)

### 3.2.2 Search Bar

```
┌─────────────────────────────────────────────────────┐
│ 🔍  Search agents by name, description, or function...│
│     [Clear ✕]                                        │
└─────────────────────────────────────────────────────┘
```

**Specifications:**
- Component: Ant Design `<Input />` with `size="large"`
- Prefix icon: `<SearchOutlined />`
- Allow clear: Yes
- Placeholder: "Search agents by name, description, or function..."
- Full width on mobile, max 600px on desktop
- Real-time filtering as user types

**Search Behavior:**
- Searches: agent name, short description, full description, tags
- Case-insensitive
- Shows all matching agents across all categories
- Auto-switches to "All Results" view when search is active
- Returns to last active tab when search is cleared

### 3.2.3 Category Tabs

```
┌────────────────────────────────────────────────────────────┐
│ 📋 Procurement (5) │ 🏢 Supplier (5) │ 📦 Order (5) │ ... │
└────────────────────────────────────────────────────────────┘
```

**Tab Configuration:**

| Icon | Label | Agent Count | Category Key |
|------|-------|-------------|--------------|
| 📋 | Procurement Planning | 5 | `procurement_planning` |
| 🏢 | Supplier Management | 5 | `supplier_management` |
| 📦 | Order Execution | 5 | `order_execution` |
| 🎯 | Quality & Compliance | 5 | `quality_compliance` |
| 💰 | Financial | 5 | `financial` |
| ⚠️ | Risk & Anomaly | 5 | `risk_anomaly` |
| 📊 | Data Analytics | 5 | `data_analytics` |
| 💬 | Collaboration | 5 | `collaboration` |
| 🚀 | Optimization | 5 | `optimization` |
| 🆘 | User Support | 5 | `user_support` |

**Responsive Behavior:**
- **Desktop (1024px+):** All tabs visible in horizontal row, scrollable if needed
- **Tablet (768-1023px):** Tabs scroll horizontally
- **Mobile (<768px):** Tabs replaced with dropdown Select component

**Tab Styling:**
- Active tab: Bold text, bottom border with accent color
- Hover: Background color transition
- Badge: Show agent count in parentheses

---

## 3.3 Agent Card Design

### 3.3.1 Compact View (Default State)

```
┌─────────────────────────────────────────────────────────┐
│  🤖              Smart Procurement Agent                 │
│  [Icon]          [Name - Bold, 18px]                     │
│  64x64px                                                 │
│                  Analyze historical data and recommend   │
│                  optimal purchasing timing and quantity  │
│                  [Description - 2 lines, gray text]      │
│                                                          │
│                  📊 Monitor → 🔍 Analyze → 💡 Generate  │
│                  [Simplified workflow icons]             │
│                                                          │
│                  Status: ⚪ Ready    [View Details →]    │
│                  [Status indicator]  [Action button]     │
└─────────────────────────────────────────────────────────┘
```

**Layout Specifications:**
- **Container:** Ant Design Card with custom styling
- **Height:** 140-160px (fixed)
- **Grid Layout:**
  - Column 1: Icon (80px fixed width)
  - Column 2: Content (flexible)
  - Column 3: Action button (auto width)
- **Gap:** 20px between columns
- **Padding:** 20px all sides
- **Border:** 1px solid rgba(100, 116, 139, 0.12)
- **Border radius:** 12px
- **Hover effect:** Slight shadow, border color intensifies

**Content Breakdown:**

1. **Icon Area (Left)**
   - Size: 64x64px
   - Background: Light gradient matching category color
   - Border radius: 12px
   - Display emoji or Ant Design icon

2. **Main Content (Center)**
   - **Name:** Font size 18px, font weight 600, color rgba(0,0,0,0.88)
   - **Description:** Font size 14px, color rgba(0,0,0,0.65), line clamp 2 lines
   - **Workflow:** Icon size 20px, arrow size 12px, horizontal layout with gaps

3. **Status & Action (Right)**
   - **Status Indicator:** Dot + text, font size 13px
   - **Button:** "View Details" with right arrow, secondary style

**Status Colors:**
- Ready: Gray (#6b7280)
- Active: Green (#10b981)
- Inactive: Dark gray (#374151)
- Error: Red (#ef4444)

### 3.3.2 Expanded View

When user clicks "View Details", the card expands vertically to show full details and configuration.

```
┌─────────────────────────────────────────────────────────┐
│  🤖              Smart Procurement Agent          [Hide▲]│
│                                                          │
│  Analyze historical data and recommend optimal          │
│  purchasing timing and quantity based on inventory      │
│  levels, price trends, and seasonal demand.             │
│  [Full description - 3-4 lines]                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │           How It Works                          │   │
│  │                                                 │   │
│  │  Step 1         Step 2        Step 3      Step 4│   │
│  │  📊             🔍            🧮           💡    │   │
│  │  Monitor    →   Analyze   →  Calculate  → Recommend│
│  │  Inventory      Patterns      Demand      Actions │
│  │  Levels                       Trends              │   │
│  │                                                 │   │
│  │  1. Continuously monitor inventory levels       │   │
│  │  2. Analyze historical purchasing patterns      │   │
│  │  3. Consider seasonal demand and lead times     │   │
│  │  4. Generate smart purchasing recommendations   │   │
│  └────────────────────────────────────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │           Configuration                         │   │
│  │                                                 │   │
│  │  General Settings                               │   │
│  │  ├─ Notification Method: [✓Email ✓System ▾]   │   │
│  │  ├─ Check Frequency: [Daily ▾]                 │   │
│  │  ├─ Priority Level: [Medium ▾]                 │   │
│  │  └─ Enable Agent: [Toggle Switch ON]           │   │
│  │                                                 │   │
│  │  Agent-Specific Settings                        │   │
│  │  ├─ Min Inventory Threshold: [100] units       │   │
│  │  ├─ Lead Time Buffer: [7] days                 │   │
│  │  ├─ Consider Seasonal Trends: [Switch ON]      │   │
│  │  └─ Price Volatility Alert: [15%] slider       │   │
│  │                                                 │   │
│  │        [Reset to Defaults]  [Save Configuration]│   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Layout Specifications:**
- **Expanded Height:** 500-650px (dynamic based on content)
- **Animation:** Smooth height transition 300ms ease-in-out
- **Sections:** Clearly divided with borders and headings

**Section 1: Full Description**
- Font size: 15px
- Color: rgba(0,0,0,0.75)
- Max 4 lines

**Section 2: How It Works**
- Background: Light gray (#f9fafb)
- Padding: 24px
- Border radius: 8px
- **Visual Workflow:**
  - Icons: 48x48px
  - Arrows: 24px wide
  - Labels: Under each icon, 14px, centered
  - Sub-labels: 12px, gray, under main label
- **Text Steps:** Numbered list below visual, 14px

**Section 3: Configuration**
- Background: White
- Padding: 24px
- Two subsections with divider

**Configuration Form Fields:**
- Label: 14px, medium weight
- Input/Select: Ant Design components, size="large"
- Help text: 12px, gray, italic, below field
- Spacing: 16px between fields

**Action Buttons:**
- Position: Right-aligned at bottom
- "Reset to Defaults": Secondary button
- "Save Configuration": Primary button
- Gap: 12px between buttons

---

## 3.4 Visual Design System

### 3.4.1 Colors

**Category Theme Colors:**

| Category | Color | Hex | Usage |
|----------|-------|-----|-------|
| Procurement Planning | Blue | `#3b82f6` | Tab highlight, icon background |
| Supplier Management | Purple | `#8b5cf6` | Tab highlight, icon background |
| Order Execution | Green | `#10b981` | Tab highlight, icon background |
| Quality & Compliance | Indigo | `#6366f1` | Tab highlight, icon background |
| Financial | Emerald | `#059669` | Tab highlight, icon background |
| Risk & Anomaly | Red | `#ef4444` | Tab highlight, icon background |
| Data Analytics | Sky | `#0ea5e9` | Tab highlight, icon background |
| Collaboration | Pink | `#ec4899` | Tab highlight, icon background |
| Optimization | Amber | `#f59e0b` | Tab highlight, icon background |
| User Support | Slate | `#64748b` | Tab highlight, icon background |

**Base Colors:**
- Background: `#f3f6ff` (matches app content background)
- Card background: `#ffffff`
- Border: `rgba(100, 116, 139, 0.12)`
- Text primary: `rgba(0, 0, 0, 0.88)`
- Text secondary: `rgba(0, 0, 0, 0.65)`
- Text tertiary: `rgba(0, 0, 0, 0.45)`

### 3.4.2 Typography

- **Page Title:** 24px, weight 600
- **Agent Name:** 18px, weight 600
- **Section Heading:** 16px, weight 600
- **Body Text:** 14px, weight 400
- **Help Text:** 12px, weight 400, italic
- **Font Family:** Inherited from Ant Design theme

### 3.4.3 Spacing

- **Section gaps:** 24px
- **Card gaps:** 20px
- **Form field gaps:** 16px
- **Inline gaps:** 8px
- **Container padding:** 24px

### 3.4.4 Shadows

- **Card hover:** `0 4px 12px rgba(0, 0, 0, 0.08)`
- **Card expanded:** `0 6px 16px rgba(0, 0, 0, 0.12)`
- **Button hover:** `0 2px 8px rgba(0, 0, 0, 0.1)`

---

## 4. Data Models

### 4.1 TypeScript Interfaces

```typescript
// Agent Category Enum
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

// Agent Status Enum
export enum AgentStatus {
  READY = 'ready',       // Configured and ready to use
  ACTIVE = 'active',     // Currently running
  INACTIVE = 'inactive', // Not configured yet
  ERROR = 'error',       // Error state
}

// Workflow Step
export interface WorkflowStep {
  icon: string;           // Emoji or icon name
  label: string;          // Main step label
  sublabel?: string;      // Optional secondary label
  description: string;    // Full description for expanded view
}

// Configuration Field Type
export type ConfigFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'switch'
  | 'slider'
  | 'dateRange';

// Configuration Field
export interface ConfigField {
  key: string;                    // Unique identifier
  label: string;                  // Display label
  type: ConfigFieldType;          // Field type
  defaultValue: any;              // Default value
  options?: Array<{               // For select/multiSelect
    label: string;
    value: any;
  }>;
  min?: number;                   // For number/slider
  max?: number;                   // For number/slider
  step?: number;                  // For number/slider
  placeholder?: string;           // Input placeholder
  helpText?: string;              // Help text below field
  required?: boolean;             // Is field required
  disabled?: boolean;             // Is field disabled
  validation?: (value: any) => string | null; // Custom validation
}

// AI Agent Model
export interface AIAgent {
  // Identity
  id: string;                     // Unique identifier (kebab-case)
  name: string;                   // Display name
  category: AgentCategory;        // Category classification
  icon: string;                   // Emoji or icon name
  
  // Description
  shortDescription: string;       // 2-line summary for compact view
  fullDescription: string;        // Full description for expanded view
  
  // Workflow
  workflow: WorkflowStep[];       // Visual workflow steps
  
  // Status
  status: AgentStatus;            // Current status
  
  // Configuration
  generalConfig: ConfigField[];   // General settings (common to all agents)
  specificConfig: ConfigField[];  // Agent-specific settings
  currentConfig: Record<string, any>; // Current config values
  
  // Metadata
  tags?: string[];                // Tags for search
  version?: string;               // Version number
  lastUpdated?: string;           // ISO date string
  documentation?: string;         // Link to docs
}

// Category Metadata
export interface CategoryMetadata {
  key: AgentCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

// Agent Config Save Request
export interface SaveConfigRequest {
  agentId: string;
  config: Record<string, any>;
  userId?: string;  // For backend tracking
}

// Agent Config Response
export interface AgentConfigResponse {
  success: boolean;
  message?: string;
  config?: Record<string, any>;
}
```

### 4.2 General Configuration Fields

All agents share these common configuration fields:

```typescript
export const GENERAL_CONFIG_FIELDS: ConfigField[] = [
  {
    key: 'notificationMethod',
    label: 'Notification Method',
    type: 'multiSelect',
    defaultValue: ['email'],
    options: [
      { label: 'Email', value: 'email' },
      { label: 'System Notification', value: 'system' },
      { label: 'SMS', value: 'sms' },
    ],
    helpText: 'How you want to receive notifications from this agent',
  },
  {
    key: 'frequency',
    label: 'Check Frequency',
    type: 'select',
    defaultValue: 'daily',
    options: [
      { label: 'Real-time', value: 'realtime' },
      { label: 'Hourly', value: 'hourly' },
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' },
    ],
    helpText: 'How often the agent checks for conditions',
  },
  {
    key: 'priority',
    label: 'Priority Level',
    type: 'select',
    defaultValue: 'medium',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' },
    ],
    helpText: 'Priority level for agent notifications and actions',
  },
  {
    key: 'enabled',
    label: 'Enable Agent',
    type: 'switch',
    defaultValue: true,
    helpText: 'Turn this agent on or off',
  },
];
```

### 4.3 Category Metadata

```typescript
export const CATEGORY_METADATA: CategoryMetadata[] = [
  {
    key: AgentCategory.PROCUREMENT_PLANNING,
    label: 'Procurement Planning',
    icon: '📋',
    color: '#3b82f6',
    description: 'Agents that help plan and optimize procurement activities',
  },
  {
    key: AgentCategory.SUPPLIER_MANAGEMENT,
    label: 'Supplier Management',
    icon: '🏢',
    color: '#8b5cf6',
    description: 'Agents for evaluating and managing supplier relationships',
  },
  {
    key: AgentCategory.ORDER_EXECUTION,
    label: 'Order Execution',
    icon: '📦',
    color: '#10b981',
    description: 'Agents that handle order placement and tracking',
  },
  {
    key: AgentCategory.QUALITY_COMPLIANCE,
    label: 'Quality & Compliance',
    icon: '🎯',
    color: '#6366f1',
    description: 'Agents ensuring quality standards and regulatory compliance',
  },
  {
    key: AgentCategory.FINANCIAL,
    label: 'Financial',
    icon: '💰',
    color: '#059669',
    description: 'Agents managing financial aspects of procurement',
  },
  // ... (other categories)
];
```

---

## 5. Component Structure

### 5.1 File Structure

```
client/src/FrontEnd/
├── pages/settings/
│   ├── SettingsHome.tsx                    [Update: Add AI Assistant card]
│   ├── AIAssistantSubmodule.tsx            [New: Main configuration page]
│   ├── AIAssistantSubmodule.module.css     [New: Page styles]
│   └── components/
│       ├── AgentCard.tsx                   [New: Agent card component]
│       ├── AgentCard.module.css
│       ├── AgentWorkflow.tsx               [New: Workflow visualization]
│       ├── AgentWorkflow.module.css
│       ├── AgentConfigForm.tsx             [New: Configuration form]
│       └── AgentConfigForm.module.css
│
├── modules/aiAssistant/
│   ├── index.ts                            [New: Module exports]
│   ├── types.ts                            [New: TypeScript types]
│   ├── constants.ts                        [New: Agent data & constants]
│   └── utils.ts                            [New: Utility functions]
│
└── shared/api/
    └── aiAssistant.ts                      [New: API layer]
```

### 5.2 Component Responsibilities

**AIAssistantSubmodule (Container)**
- Manages overall page state (active tab, search query, expanded agent)
- Loads all agent data
- Handles search filtering
- Renders page header, search bar, tabs, and agent list

**AgentCard (Presentation)**
- Renders single agent in compact or expanded view
- Handles expand/collapse interaction
- Passes data to child components (workflow, config form)

**AgentWorkflow (Presentation)**
- Displays visual workflow diagram
- Renders step descriptions
- Responsive layout for mobile

**AgentConfigForm (Form)**
- Renders configuration form fields
- Handles form validation
- Manages save/reset actions
- Communicates with API layer

---

## 6. Agent Definitions

### 6.1 Complete Agent List

#### Category 1: Procurement Planning (5 agents)

1. **Smart Procurement Agent** - Analyze historical data and recommend optimal purchasing timing
2. **Demand Forecasting Agent** - Predict future demand based on trends and patterns
3. **Budget Optimization Agent** - Allocate budget efficiently across departments
4. **Seasonal Planning Agent** - Plan purchases based on seasonal trends
5. **Inventory Rebalancing Agent** - Optimize stock distribution across locations

#### Category 2: Supplier Management (5 agents)

6. **Supplier Analysis Agent** - Evaluate supplier performance metrics
7. **Supplier Discovery Agent** - Find and recommend new suppliers
8. **Contract Negotiation Assistant** - Support contract terms analysis
9. **Supplier Risk Assessment Agent** - Monitor supplier financial health and risks
10. **Multi-Supplier Comparison Agent** - Compare quotes and terms from multiple suppliers

#### Category 3: Order Execution (5 agents)

11. **Order Tracking Agent** - Monitor order status and delivery progress
12. **Delivery Time Prediction Agent** - Predict accurate delivery times
13. **Auto Order Placement Agent** - Automatically place orders based on triggers
14. **Order Consolidation Agent** - Combine orders to reduce costs
15. **Rush Order Handler Agent** - Prioritize and expedite urgent orders

#### Category 4: Quality & Compliance (5 agents)

16. **Quality Inspection Agent** - Track quality metrics and issues
17. **Compliance Monitoring Agent** - Ensure regulatory compliance
18. **Document Verification Agent** - Validate purchase documents
19. **Audit Trail Agent** - Maintain comprehensive audit logs
20. **Regulatory Alert Agent** - Notify about regulation changes

#### Category 5: Financial (5 agents)

21. **Invoice Matching Agent** - Automatically match invoices to orders
22. **Payment Optimization Agent** - Optimize payment timing for cash flow
23. **Cost Analysis Agent** - Analyze spending patterns and trends
24. **Currency Exchange Agent** - Monitor exchange rates and suggest timing
25. **Budget Alert Agent** - Warn about budget overruns

#### Category 6: Risk & Anomaly (5 agents)

26. **Anomaly Detection Agent** - Detect unusual patterns in orders/pricing
27. **Supply Chain Risk Agent** - Identify supply chain vulnerabilities
28. **Fraud Detection Agent** - Detect potential fraudulent activities
29. **Price Spike Alert Agent** - Alert on abnormal price increases
30. **Shortage Prediction Agent** - Predict potential stock shortages

#### Category 7: Data Analytics (5 agents)

31. **Trend Analysis Agent** - Identify purchasing and market trends
32. **Performance Dashboard Agent** - Generate performance metrics
33. **Report Generation Agent** - Create automated reports
34. **KPI Monitoring Agent** - Track key performance indicators
35. **Competitor Pricing Agent** - Monitor competitor pricing data

#### Category 8: Collaboration (5 agents)

36. **Chatbot Agent** - Answer procurement-related questions
37. **Email Assistant Agent** - Manage and categorize emails
38. **Meeting Scheduler Agent** - Schedule meetings with suppliers
39. **Notification Manager Agent** - Smart notification routing
40. **Multi-language Translation Agent** - Translate documents and communications

#### Category 9: Optimization (5 agents)

41. **Route Optimization Agent** - Optimize delivery routes
42. **Warehouse Location Agent** - Suggest optimal warehouse locations
43. **Product Recommendation Agent** - Recommend alternative products
44. **Bulk Purchase Agent** - Identify bulk purchase opportunities
45. **Carbon Footprint Agent** - Track and reduce carbon emissions

#### Category 10: User Support (5 agents)

46. **Onboarding Assistant Agent** - Guide new users through the system
47. **FAQ Agent** - Answer frequently asked questions
48. **Training Recommendation Agent** - Suggest relevant training
49. **Workflow Suggestion Agent** - Recommend workflow improvements
50. **System Health Monitor Agent** - Monitor system performance

### 6.2 Example: Complete Agent Definition

**Smart Procurement Agent (Detailed Specification)**

```typescript
{
  id: 'smart-procurement-agent',
  name: 'Smart Procurement Agent',
  category: AgentCategory.PROCUREMENT_PLANNING,
  icon: '🛒',
  shortDescription: 'Analyze historical data and recommend optimal purchasing timing and quantity based on inventory levels, price trends, and seasonal demand.',
  fullDescription: 'The Smart Procurement Agent continuously monitors your inventory levels, analyzes historical purchasing patterns, and considers factors like seasonal demand, lead times, and price trends to generate intelligent purchasing recommendations. It helps prevent stockouts while optimizing inventory costs.',
  workflow: [
    {
      icon: '📊',
      label: 'Monitor',
      sublabel: 'Inventory Levels',
      description: 'Continuously monitor inventory levels across all items in real-time',
    },
    {
      icon: '🔍',
      label: 'Analyze',
      sublabel: 'Purchase Patterns',
      description: 'Analyze historical purchasing patterns, consumption rates, and trends',
    },
    {
      icon: '🧮',
      label: 'Calculate',
      sublabel: 'Demand Trends',
      description: 'Consider seasonal demand, lead times, price trends, and external factors',
    },
    {
      icon: '💡',
      label: 'Recommend',
      sublabel: 'Actions',
      description: 'Generate smart purchasing recommendations with timing and quantity',
    },
  ],
  status: AgentStatus.READY,
  generalConfig: GENERAL_CONFIG_FIELDS,
  specificConfig: [
    {
      key: 'minInventoryThreshold',
      label: 'Minimum Inventory Threshold',
      type: 'number',
      defaultValue: 100,
      min: 0,
      placeholder: 'Enter minimum units',
      helpText: 'Trigger recommendations when inventory falls below this level',
      required: true,
    },
    {
      key: 'leadTimeBuffer',
      label: 'Lead Time Buffer (days)',
      type: 'number',
      defaultValue: 7,
      min: 0,
      max: 90,
      step: 1,
      helpText: 'Extra days to add to supplier lead time for safety stock',
    },
    {
      key: 'considerSeasonalTrends',
      label: 'Consider Seasonal Trends',
      type: 'switch',
      defaultValue: true,
      helpText: 'Factor in seasonal demand patterns when making recommendations',
    },
    {
      key: 'priceVolatilityThreshold',
      label: 'Price Volatility Alert Threshold (%)',
      type: 'slider',
      defaultValue: 15,
      min: 5,
      max: 50,
      step: 5,
      helpText: 'Alert when price changes exceed this percentage',
    },
  ],
  currentConfig: {},
  tags: ['inventory', 'procurement', 'automation', 'prediction', 'optimization'],
  version: '1.0.0',
  lastUpdated: '2026-06-13',
}
```

---

## 7. Interaction Details

### 7.1 Search Functionality

**Behavior:**
- Real-time filtering as user types
- Debounced by 300ms to avoid excessive renders
- Searches across: name, shortDescription, fullDescription, tags
- Case-insensitive matching
- Highlights matching text (optional enhancement)

**Implementation:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);

const filteredAgents = useMemo(() => {
  if (!debouncedQuery) return agentsByCategory[activeTab];
  
  const query = debouncedQuery.toLowerCase();
  return allAgents.filter(agent =>
    agent.name.toLowerCase().includes(query) ||
    agent.shortDescription.toLowerCase().includes(query) ||
    agent.fullDescription.toLowerCase().includes(query) ||
    agent.tags?.some(tag => tag.toLowerCase().includes(query))
  );
}, [debouncedQuery, activeTab, allAgents]);
```

### 7.2 Tab Navigation

**Behavior:**
- Click tab to switch categories
- URL updates with query param: `?tab=procurement_planning`
- Preserves search state when switching tabs
- On mobile, tabs become a Select dropdown

**Keyboard Navigation:**
- Arrow Left/Right: Navigate between tabs
- Tab key: Focus on next interactive element
- Enter: Activate focused tab

### 7.3 Card Expand/Collapse

**Behavior:**
- Click anywhere on card OR "View Details" button to expand
- Only one card expanded at a time (accordion behavior)
- Expanding a new card collapses the previously expanded one
- Smooth height animation (300ms ease-in-out)
- Auto-scroll to card top if it goes off-screen
- URL updates with query param: `?agent=smart-procurement-agent`

**Keyboard Support:**
- Tab: Navigate to card
- Enter/Space: Expand/collapse card
- Escape: Collapse expanded card

### 7.4 Configuration Form

**Behavior:**
- Form fields update in real-time
- Changes are local until "Save" is clicked
- "Reset to Defaults" restores default values
- Validation runs on blur and before save
- Success message on successful save
- Error handling for failed saves

**Validation:**
- Required fields: Cannot be empty
- Number fields: Min/max validation
- Custom validation functions per field
- Display validation errors below fields

---

## 8. API Integration

### 8.1 API Module Structure

```typescript
// client/src/FrontEnd/shared/api/aiAssistant.ts

import { apiRequest } from './base';
import type { AIAgent, SaveConfigRequest, AgentConfigResponse } from '@/modules/aiAssistant/types';
import { MOCK_AGENTS } from '@/modules/aiAssistant/constants';

/**
 * Get all AI agents
 * Current: Returns mock data
 * Future: GET /api/ai-assistant/agents
 */
export async function getAllAgents(): Promise<AIAgent[]> {
  // Mock implementation
  return Promise.resolve(MOCK_AGENTS);
  
  // Future backend integration:
  // return apiRequest<AIAgent[]>({
  //   method: 'GET',
  //   url: '/api/ai-assistant/agents',
  // });
}

/**
 * Get single agent by ID
 * Current: Returns mock data
 * Future: GET /api/ai-assistant/agents/:id
 */
export async function getAgentById(agentId: string): Promise<AIAgent> {
  const agent = MOCK_AGENTS.find(a => a.id === agentId);
  if (!agent) throw new Error(`Agent not found: ${agentId}`);
  return Promise.resolve(agent);
  
  // Future backend integration:
  // return apiRequest<AIAgent>({
  //   method: 'GET',
  //   url: `/api/ai-assistant/agents/${agentId}`,
  // });
}

/**
 * Save agent configuration
 * Current: Saves to localStorage
 * Future: PUT /api/ai-assistant/agents/:id/config
 */
export async function saveAgentConfig(
  agentId: string,
  config: Record<string, any>
): Promise<AgentConfigResponse> {
  // Mock implementation - save to localStorage
  const key = `ai-agent-config-${agentId}`;
  localStorage.setItem(key, JSON.stringify(config));
  
  return Promise.resolve({
    success: true,
    message: 'Configuration saved successfully',
    config,
  });
  
  // Future backend integration:
  // return apiRequest<AgentConfigResponse>({
  //   method: 'PUT',
  //   url: `/api/ai-assistant/agents/${agentId}/config`,
  //   data: { config },
  // });
}

/**
 * Get agent configuration
 * Current: Reads from localStorage
 * Future: GET /api/ai-assistant/agents/:id/config
 */
export async function getAgentConfig(
  agentId: string
): Promise<Record<string, any>> {
  // Mock implementation - read from localStorage
  const key = `ai-agent-config-${agentId}`;
  const stored = localStorage.getItem(key);
  const config = stored ? JSON.parse(stored) : {};
  
  return Promise.resolve(config);
  
  // Future backend integration:
  // return apiRequest<Record<string, any>>({
  //   method: 'GET',
  //   url: `/api/ai-assistant/agents/${agentId}/config`,
  // });
}
```

### 8.2 Future Backend API Specification

**Base URL:** `/api/ai-assistant`

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/agents` | GET | Get all agents | - | `AIAgent[]` |
| `/agents/:id` | GET | Get single agent | - | `AIAgent` |
| `/agents/:id/config` | GET | Get agent config | - | `Record<string, any>` |
| `/agents/:id/config` | PUT | Save agent config | `{config: {...}}` | `{success, message, config}` |
| `/agents/:id/status` | GET | Get agent status | - | `{status: AgentStatus}` |
| `/agents/:id/reset` | POST | Reset to defaults | - | `{success, message, config}` |

---

## 9. Responsive Design

### 9.1 Breakpoints

```css
/* Desktop: 1024px and above */
@media (min-width: 1024px) {
  .agentCard {
    grid-template-columns: 80px 1fr auto;
  }
  
  .tabs {
    display: flex;
  }
  
  .mobileTabSelect {
    display: none;
  }
}

/* Tablet: 768px - 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .agentCard {
    grid-template-columns: 64px 1fr;
  }
  
  .agentCard button {
    grid-column: 1 / -1;
    justify-self: end;
  }
}

/* Mobile: Below 768px */
@media (max-width: 767px) {
  .wrap {
    padding: 16px;
  }
  
  .agentCard {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 16px;
  }
  
  .agentIcon {
    justify-self: center;
  }
  
  .tabs {
    display: none;
  }
  
  .mobileTabSelect {
    display: block;
    margin-bottom: 20px;
  }
  
  .workflowStep {
    flex-direction: column;
  }
  
  .configForm {
    grid-template-columns: 1fr;
  }
}
```

### 9.2 Mobile Optimizations

**Changes for Mobile:**
1. Tabs → Dropdown Select
2. Agent cards stack vertically
3. Workflow icons arrange in 2x2 grid instead of horizontal
4. Configuration form fields full width
5. Buttons stack vertically
6. Reduce padding and font sizes
7. Collapse button text to icons only

---

## 10. Performance & Accessibility

### 10.1 Performance Optimizations

**Code Splitting:**
```typescript
// Lazy load the AI Assistant page
const AIAssistantSubmodule = lazy(() => import('./pages/settings/AIAssistantSubmodule'));
```

**Memoization:**
```typescript
// Memoize filtered agents
const filteredAgents = useMemo(() => {
  // ... filtering logic
}, [searchQuery, activeTab, allAgents]);

// Memoize event handlers
const handleExpand = useCallback((agentId: string) => {
  setExpandedAgent(prev => prev === agentId ? null : agentId);
}, []);
```

**Virtual Scrolling (Future Enhancement):**
- If agent list grows beyond 50, implement virtual scrolling
- Use `react-window` or `react-virtualized`

### 10.2 Accessibility (WCAG AA Compliance)

**Keyboard Navigation:**
- All interactive elements are keyboard accessible
- Logical tab order
- Focus indicators visible
- Escape key to close expanded cards

**Screen Reader Support:**
```tsx
<div
  role="button"
  tabIndex={0}
  aria-expanded={isExpanded}
  aria-label={`${agent.name}. ${agent.shortDescription}. ${isExpanded ? 'Press Enter to collapse' : 'Press Enter to expand'}`}
>
  {/* Card content */}
</div>
```

**Color Contrast:**
- All text meets WCAG AA contrast ratio (4.5:1 for normal text)
- Status indicators use icons + text, not just color
- Focus indicators have sufficient contrast

**Alternative Text:**
- Icons have aria-labels
- Images have alt text
- Form fields have labels

**Semantic HTML:**
- Proper heading hierarchy (H1 → H2 → H3)
- Form elements properly labeled
- Landmark roles (main, navigation, search)

---

## 11. Error Handling

### 11.1 Loading States

```tsx
if (loading) {
  return (
    <Flex align="center" justify="center" style={{ minHeight: '400px' }}>
      <Spin size="large" />
      <span>Loading AI Agents...</span>
    </Flex>
  );
}
```

### 11.2 Error States

```tsx
if (error) {
  return (
    <Result
      status="error"
      title="Failed to Load AI Agents"
      subTitle="Unable to load agent data. Please check your connection and try again."
      extra={
        <Button type="primary" onClick={handleRetry}>
          Retry
        </Button>
      }
    />
  );
}
```

### 11.3 Form Validation Errors

```tsx
// Display field-level errors
{error && (
  <div className={styles.fieldError}>
    <ExclamationCircleOutlined /> {error}
  </div>
)}
```

### 11.4 Save Failures

```tsx
try {
  await saveAgentConfig(agentId, formValues);
  message.success('Configuration saved successfully!');
} catch (error) {
  message.error('Failed to save configuration. Please try again.');
  console.error('Save error:', error);
}
```

---

## 12. Future Considerations

### 12.1 Phase 2 Enhancements

1. **Agent Status Dashboard**
   - Real-time status updates
   - Activity logs
   - Performance metrics

2. **Advanced Search**
   - Filter by category, status, tags
   - Sort by name, last updated, popularity
   - Saved search queries

3. **Agent Templates**
   - Pre-configured agent sets for different roles
   - One-click activation of common scenarios
   - Export/import configurations

4. **Agent Marketplace**
   - Browse additional agents
   - Install new capabilities
   - Community-contributed agents

5. **Analytics Dashboard**
   - Agent usage statistics
   - Time saved metrics
   - ROI calculations

### 12.2 Backend Integration Requirements

When backend is ready:

1. **Database Schema**
   - `ai_agents` table (agent definitions)
   - `agent_configs` table (user configurations)
   - `agent_logs` table (activity tracking)
   - `agent_status` table (runtime status)

2. **Authentication**
   - User-specific configurations
   - Role-based access control
   - API authentication

3. **Real-time Updates**
   - WebSocket for live status updates
   - Push notifications
   - Event streaming

4. **Data Migration**
   - Import localStorage configs to database
   - Batch configuration updates
   - Version migration scripts

---

## Conclusion

This design provides a comprehensive, user-friendly interface for managing 50 AI agents across 10 categories in the OptiMind procurement system. The compact card layout with expandable details balances information density with clarity, while the visual workflow diagrams make each agent's functionality immediately understandable.

The frontend-first approach with API abstraction allows for immediate development while preparing for future backend integration. Responsive design ensures the system works across all devices, and accessibility features make it inclusive for all users.

**Next Steps:**
1. Review and approve this design specification
2. Create implementation plan
3. Begin frontend development
4. Iterate based on user feedback
5. Plan backend integration timeline

---

**Design Approved By:** [User Name]  
**Date:** 2026-06-13  
**Implementation Owner:** [Developer Name]  
**Target Completion:** [Date]
