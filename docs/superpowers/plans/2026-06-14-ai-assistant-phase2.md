# AI Assistant Configuration Phase 2 - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Sub Agents page with breadcrumb navigation, sub-agent cards grid, and modal detail view with animations.

**Architecture:** React components for Sub Agents page showing filtered agents by Main Agent category, with modal dialog for agent details. URL-based routing with query params for modal state.

**Tech Stack:** React 18, TypeScript, React Router, Ant Design, CSS Modules, React Portals (for modal)

---

## Context from Phase 1

**Completed:**
- Main Agent data structure with 6 categories
- MainAgentCard component with routing to `/settings/ai-assistant/:slug`
- Utility functions: `getAgentsByMainAgent()`, `getMainAgentBySlug()`
- Main Agents grid page fully functional

**Phase 2 builds on:**
- Routes to `/settings/ai-assistant/:slug` (Sub Agents page)
- Routes with query param `?agent=:id` (opens modal)
- Uses existing `MOCK_AGENTS` data from constants.ts
- Filters agents using Phase 1 utility functions

---

## File Structure Overview

### New Files to Create
- `client/src/FrontEnd/pages/settings/SubAgentsPage.tsx` - Sub Agents listing page
- `client/src/FrontEnd/pages/settings/SubAgentsPage.module.css` - Sub Agents page styles
- `client/src/FrontEnd/pages/settings/components/SubAgentCard.tsx` - Individual Sub Agent card
- `client/src/FrontEnd/pages/settings/components/SubAgentCard.module.css` - Sub Agent card styles
- `client/src/FrontEnd/pages/settings/components/AgentDetailModal.tsx` - Modal for agent details
- `client/src/FrontEnd/pages/settings/components/AgentDetailModal.module.css` - Modal styles
- `client/src/FrontEnd/pages/settings/components/Breadcrumb.tsx` - Breadcrumb navigation component
- `client/src/FrontEnd/pages/settings/components/Breadcrumb.module.css` - Breadcrumb styles

### Files to Modify
- `client/src/FrontEnd/App.tsx` - Add Sub Agents page route

---

## Task 1: Create Breadcrumb Component

**Files:**
- Create: `client/src/FrontEnd/pages/settings/components/Breadcrumb.tsx`
- Create: `client/src/FrontEnd/pages/settings/components/Breadcrumb.module.css`

- [ ] **Step 1: Create Breadcrumb component**

```typescript
// client/src/FrontEnd/pages/settings/components/Breadcrumb.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps): React.ReactElement {
  const navigate = useNavigate();

  const handleClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, path?: string) => {
    if ((e.key === 'Enter' || e.key === ' ') && path) {
      e.preventDefault();
      handleClick(path);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.breadcrumb}>
      <button
        className={styles.backButton}
        onClick={handleBack}
        aria-label="Go back"
      >
        ←
      </button>
      
      <div className={styles.trail}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className={styles.separator}>/</span>}
            {item.path ? (
              <span
                className={styles.link}
                onClick={() => handleClick(item.path)}
                onKeyDown={(e) => handleKeyDown(e, item.path)}
                role="button"
                tabIndex={0}
              >
                {item.label}
              </span>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Breadcrumb styles**

```css
/* client/src/FrontEnd/pages/settings/components/Breadcrumb.module.css */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.backButton {
  background: none;
  border: none;
  font-size: 22px;
  color: #8c8c8c;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.backButton:hover {
  background: #f0f0f0;
  color: #262626;
}

.backButton:focus {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

.trail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.separator {
  color: #d9d9d9;
}

.link {
  color: #1890ff;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px 8px;
  border-radius: 4px;
}

.link:hover {
  color: #40a9ff;
  background: #e6f7ff;
}

.link:focus {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

.current {
  font-weight: 600;
  color: #262626;
  padding: 4px 8px;
}

/* Mobile */
@media (max-width: 767px) {
  .breadcrumb {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .trail {
    font-size: 12px;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add client/src/FrontEnd/pages/settings/components/Breadcrumb.tsx client/src/FrontEnd/pages/settings/components/Breadcrumb.module.css
git commit -m "feat(ai-assistant): add Breadcrumb navigation component

Supports keyboard navigation and back button"
```

---

## Task 2: Create SubAgentCard Component

**Files:**
- Create: `client/src/FrontEnd/pages/settings/components/SubAgentCard.tsx`
- Create: `client/src/FrontEnd/pages/settings/components/SubAgentCard.module.css`

- [ ] **Step 1: Create SubAgentCard component**

Create component that displays sub-agent with icon, name, description, and "View Details" button. On button click, updates URL with `?agent={agentId}` query param.

- [ ] **Step 2: Create SubAgentCard styles**

Responsive card: desktop 2-column grid, mobile horizontal layout.

- [ ] **Step 3: Verify and commit**

---

## Task 3: Create AgentDetailModal Component

**Files:**
- Create: `client/src/FrontEnd/pages/settings/components/AgentDetailModal.tsx`
- Create: `client/src/FrontEnd/pages/settings/components/AgentDetailModal.module.css`

- [ ] **Step 1: Create modal component with animations**

Modal with backdrop, header (icon + name + close), scrollable content (description + workflow + use cases), footer button. Fade-in animation (300ms), ESC to close, focus trap.

- [ ] **Step 2: Create modal styles with animations**

Backdrop fade, modal scale + slide animation, responsive (full-screen on mobile <640px).

- [ ] **Step 3: Verify and commit**

---

## Task 4: Create Sub Agents Page

**Files:**
- Create: `client/src/FrontEnd/pages/settings/SubAgentsPage.tsx`
- Create: `client/src/FrontEnd/pages/settings/SubAgentsPage.module.css`

- [ ] **Step 1: Create Sub Agents page**

Use `useParams()` to get slug, `getMainAgentBySlug()` and `getAgentsByMainAgent()` to fetch data. Render Breadcrumb, header with Main Agent icon/name, grid of SubAgentCards. Handle `?agent=` query param to open AgentDetailModal.

- [ ] **Step 2: Create page styles**

Responsive grid, loading/error states.

- [ ] **Step 3: Verify and commit**

---

## Task 5: Update Routing

**Files:**
- Modify: `client/src/FrontEnd/App.tsx`

- [ ] **Step 1: Add lazy import and route**

```typescript
const SubAgentsPage = lazy(() => import('./pages/settings/SubAgentsPage'));
```

Add route:
```typescript
<Route path="/settings/ai-assistant/:slug" element={<SubAgentsPage />} />
```

- [ ] **Step 2: Test navigation**

Click Main Agent card → see Sub Agents page → click View Details → see modal

- [ ] **Step 3: Commit**

---

## Summary

Phase 2 adds:
1. ✅ Breadcrumb navigation
2. ✅ SubAgentCard component
3. ✅ AgentDetailModal with animations
4. ✅ SubAgentsPage with routing
5. ✅ Full navigation flow

**End of Phase 2 Plan**