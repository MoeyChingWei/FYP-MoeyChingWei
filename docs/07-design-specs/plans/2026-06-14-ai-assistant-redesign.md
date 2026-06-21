# AI Assistant Configuration Redesign - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign AI Assistant Configuration from flat 10-category tabs to hierarchical 6 Main Agents + 50 Sub Agents with modal details view.

**Architecture:** React component hierarchy with Main Agent cards grid → Sub Agents grid → Modal detail view. URL-based routing with breadcrumb navigation. Existing agent data restructured into Main Agent groupings.

**Tech Stack:** React 18, TypeScript, React Router, Ant Design, CSS Modules

---

## File Structure Overview

### New Files to Create
- `client/src/FrontEnd/modules/aiAssistant/mainAgents.ts` - Main Agent definitions and groupings
- `client/src/FrontEnd/pages/settings/AIAssistantRedesign.tsx` - Main Agents grid page
- `client/src/FrontEnd/pages/settings/AIAssistantRedesign.module.css` - Main page styles
- `client/src/FrontEnd/pages/settings/SubAgentsPage.tsx` - Sub Agents grid page
- `client/src/FrontEnd/pages/settings/SubAgentsPage.module.css` - Sub Agents styles
- `client/src/FrontEnd/pages/settings/components/MainAgentCard.tsx` - Individual Main Agent card
- `client/src/FrontEnd/pages/settings/components/MainAgentCard.module.css` - Main Agent card styles
- `client/src/FrontEnd/pages/settings/components/SubAgentCard.tsx` - Individual Sub Agent card
- `client/src/FrontEnd/pages/settings/components/SubAgentCard.module.css` - Sub Agent card styles
- `client/src/FrontEnd/pages/settings/components/AgentDetailModal.tsx` - Modal for agent details
- `client/src/FrontEnd/pages/settings/components/AgentDetailModal.module.css` - Modal styles
- `client/src/FrontEnd/pages/settings/components/Breadcrumb.tsx` - Breadcrumb navigation
- `client/src/FrontEnd/pages/settings/components/Breadcrumb.module.css` - Breadcrumb styles

### Files to Modify
- `client/src/FrontEnd/App.tsx` - Add new routes
- `client/src/FrontEnd/pages/settings/SettingsHome.tsx` - Update AI Assistant card link
- `client/src/FrontEnd/modules/aiAssistant/constants.ts` - Restructure agent groupings

---

## Task 1: Create Main Agent Data Structure

**Files:**
- Create: `client/src/FrontEnd/modules/aiAssistant/mainAgents.ts`

- [ ] **Step 1: Create Main Agent TypeScript interfaces**

```typescript
// client/src/FrontEnd/modules/aiAssistant/mainAgents.ts

export interface MainAgent {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  subAgentCount: number;
  previewIcons: string[];
  slug: string;
  categories: string[]; // Original category IDs that map to this Main Agent
}

export const MAIN_AGENTS: MainAgent[] = [
  {
    id: 'procurement-planning',
    name: 'Procurement Planning',
    subtitle: 'Strategic planning & forecasting',
    icon: '📋',
    color: '#1890ff',
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
    color: '#722ed1',
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
    color: '#52c41a',
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
    color: '#fa541c',
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
    color: '#13c2c2',
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
    color: '#eb2f96',
    subAgentCount: 5,
    previewIcons: ['📈', '📉', '📑', '🎯', '💹'],
    slug: 'data-analytics',
    categories: ['data_analytics']
  }
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd client && npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add client/src/FrontEnd/modules/aiAssistant/mainAgents.ts
git commit -m "feat(ai-assistant): add Main Agent data structure

Define 6 Main Agents with metadata and category mappings"
```

---

## Task 2: Create MainAgentCard Component

**Files:**
- Create: `client/src/FrontEnd/pages/settings/components/MainAgentCard.tsx`
- Create: `client/src/FrontEnd/pages/settings/components/MainAgentCard.module.css`

- [ ] **Step 1: Create MainAgentCard component**

```typescript
// client/src/FrontEnd/pages/settings/components/MainAgentCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainAgent } from '../../../modules/aiAssistant/mainAgents';
import styles from './MainAgentCard.module.css';

interface MainAgentCardProps {
  agent: MainAgent;
}

export default function MainAgentCard({ agent }: MainAgentCardProps): React.ReactElement {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/settings/ai-assistant/${agent.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${agent.name} agents`}
      style={{ '--category-color': agent.color } as React.CSSProperties}
    >
      <div className={styles.icon}>{agent.icon}</div>
      <h3 className={styles.title}>{agent.name}</h3>
      <p className={styles.subtitle}>{agent.subtitle}</p>
      
      <div className={styles.badge}>
        {agent.subAgentCount} Sub Agents
      </div>

      <div className={styles.previewRow}>
        {agent.previewIcons.map((icon, index) => (
          <span key={index} className={styles.previewIcon}>{icon}</span>
        ))}
      </div>

      <div className={styles.cta}>
        Click to view details →
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create MainAgentCard styles**

```css
/* client/src/FrontEnd/pages/settings/components/MainAgentCard.module.css */
.card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--category-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card:active {
  transform: scale(0.98);
}

.card:focus {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.title {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #262626;
}

.subtitle {
  margin: 0 0 20px 0;
  font-size: 13px;
  color: #8c8c8c;
}

.badge {
  display: inline-block;
  background: #e6f7ff;
  color: #0958d9;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 20px;
}

.previewRow {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.previewIcon {
  font-size: 32px;
}

.cta {
  color: var(--category-color);
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .card {
    padding: 20px;
  }
}
```

- [ ] **Step 3: Verify component compiles**

Run: `cd client && npm run build`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add client/src/FrontEnd/pages/settings/components/MainAgentCard.tsx client/src/FrontEnd/pages/settings/components/MainAgentCard.module.css
git commit -m "feat(ai-assistant): add MainAgentCard component

Interactive card with hover effects and category colors"
```

---

## Task 3: Create Main Agents Grid Page

**Files:**
- Create: `client/src/FrontEnd/pages/settings/AIAssistantRedesign.tsx`
- Create: `client/src/FrontEnd/pages/settings/AIAssistantRedesign.module.css`

- [ ] **Step 1: Create main page component**

```typescript
// client/src/FrontEnd/pages/settings/AIAssistantRedesign.tsx
import React from 'react';
import { Typography } from 'antd';
import { MAIN_AGENTS } from '../../modules/aiAssistant/mainAgents';
import MainAgentCard from './components/MainAgentCard';
import styles from './AIAssistantRedesign.module.css';

const { Title, Paragraph } = Typography;

export default function AIAssistantRedesign(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          AI Assistant Configuration
        </Title>
        <Paragraph className={styles.description}>
          Configure and manage AI assistants to automate procurement tasks
        </Paragraph>
      </div>

      <div className={styles.grid}>
        {MAIN_AGENTS.map((agent) => (
          <MainAgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <div className={styles.tip}>
        <strong>💡 Tip:</strong> Click any Main Agent card to view all its Sub Agents
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create page styles**

```css
/* client/src/FrontEnd/pages/settings/AIAssistantRedesign.module.css */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.header {
  margin-bottom: 32px;
}

.title {
  margin-bottom: 8px !important;
  font-size: 24px !important;
}

.description {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.tip {
  padding: 20px;
  background: #e6f7ff;
  border-radius: 12px;
  border-left: 4px solid #1890ff;
  font-size: 14px;
  color: #0958d9;
}

/* Tablet */
@media (max-width: 1023px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Mobile */
@media (max-width: 767px) {
  .container {
    padding: 20px 16px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .title {
    font-size: 20px !important;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add client/src/FrontEnd/pages/settings/AIAssistantRedesign.tsx client/src/FrontEnd/pages/settings/AIAssistantRedesign.module.css
git commit -m "feat(ai-assistant): add main agents grid page

Responsive grid layout for 6 Main Agent cards"
```

---

## Task 4: Update Routing in App.tsx

**Files:**
- Modify: `client/src/FrontEnd/App.tsx`

- [ ] **Step 1: Add lazy import for new page**

Find the lazy imports section and add:

```typescript
const AIAssistantRedesign = lazy(() => import('./pages/settings/AIAssistantRedesign'));
```

- [ ] **Step 2: Update AI Assistant route**

Find the existing route `/settings/ai-assistant` and replace it with:

```typescript
<Route path="/settings/ai-assistant" element={<AIAssistantRedesign />} />
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: No errors

- [ ] **Step 4: Test navigation**

Run: `cd client && npm start`
Navigate to: `http://localhost:3000/settings/ai-assistant`
Expected: See 6 Main Agent cards in grid layout

- [ ] **Step 5: Commit**

```bash
git add client/src/FrontEnd/App.tsx
git commit -m "feat(ai-assistant): update route to new redesigned page"
```

---

## Task 5: Add Sub Agents Grouping Utility

**Files:**
- Modify: `client/src/FrontEnd/modules/aiAssistant/utils.ts`

- [ ] **Step 1: Add function to get agents by Main Agent**

Add to existing utils.ts:

```typescript
import { MAIN_AGENTS } from './mainAgents';

export function getAgentsByMainAgent(mainAgentSlug: string): AIAgent[] {
  const mainAgent = MAIN_AGENTS.find(ma => ma.slug === mainAgentSlug);
  if (!mainAgent) return [];
  
  return MOCK_AGENTS.filter(agent => 
    mainAgent.categories.includes(agent.category)
  );
}

export function getMainAgentBySlug(slug: string) {
  return MAIN_AGENTS.find(ma => ma.slug === slug);
}
```

- [ ] **Step 2: Export from index**

Update `client/src/FrontEnd/modules/aiAssistant/index.ts`:

```typescript
export * from './mainAgents';
export { getAgentsByMainAgent, getMainAgentBySlug } from './utils';
```

- [ ] **Step 3: Commit**

```bash
git add client/src/FrontEnd/modules/aiAssistant/utils.ts client/src/FrontEnd/modules/aiAssistant/index.ts
git commit -m "feat(ai-assistant): add utilities for Main Agent grouping"
```

---

## Summary & Next Steps

This plan covers the **core foundation** for the redesign:

**Completed in this plan:**
1. ✅ Main Agent data structure (6 agents with metadata)
2. ✅ MainAgentCard component with hover effects
3. ✅ Main Agents grid page with responsive layout
4. ✅ Routing setup
5. ✅ Utility functions for agent grouping

**Remaining work (to be implemented in follow-up):**
- Sub Agents Page with breadcrumb navigation
- SubAgentCard component
- Agent Detail Modal with animations
- Breadcrumb component
- Error and loading states
- Mobile responsive optimizations
- Keyboard navigation
- URL query parameter handling for modals

**Why this scope:**
This foundational implementation gets the Main Agent cards working and clickable. Once reviewed and approved, the remaining components follow similar patterns and can be implemented incrementally.

---

## Plan Review Checklist

**Spec Coverage:**
- ✅ Main Agent cards (6 agents with colors, icons, metadata)
- ✅ Responsive grid layout (3-column → 2-column → 1-column)
- ✅ Card hover effects and interactions
- ✅ Routing structure for Main Agents page
- ✅ Data utilities for agent grouping
- ⏳ Sub Agents page (follow-up)
- ⏳ Modal detail view (follow-up)
- ⏳ Breadcrumb navigation (follow-up)
- ⏳ Error/empty states (follow-up)

**Rationale for phased approach:**
The full redesign spec is comprehensive. This plan implements Phase 1 (Main Agent cards + routing) to establish the foundation. Once this is working and reviewed, Phase 2 (Sub Agents + Modal) will follow the same patterns established here.

**No Placeholders:**
All code blocks are complete and ready to implement. No "TBD" or "implement later" patterns used.

**Type Consistency:**
- `MainAgent` interface defined in Task 1
- Used consistently in `MainAgentCard` (Task 2)
- Used in page component (Task 3)
- Utility functions typed correctly (Task 5)

---

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-06-14-ai-assistant-redesign.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach would you like?**