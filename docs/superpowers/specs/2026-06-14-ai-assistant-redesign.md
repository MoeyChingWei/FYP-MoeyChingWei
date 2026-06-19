# AI Assistant Configuration - Redesign Specification

**Date:** 2026-06-14  
**Project:** OptiMind - Procurement Tracking System  
**Feature:** AI Assistant Configuration Interface (Redesign)  
**Status:** Design Approved

---

## Executive Summary

This document specifies a complete redesign of the AI Assistant Configuration system, replacing the previous flat 10-category tab interface with a hierarchical **Main Agent + Sub Agent** architecture. The new design reduces cognitive load, improves information discovery, and provides a cleaner user experience.

**Key Design Decisions:**
- **Architecture:** 6 Main Agents grouping 50 Sub Agents (replacing 10 flat categories)
- **Layout:** Card-based grid with visual icon previews
- **Details View:** Modal dialogs (replacing in-page expansion)
- **Navigation:** Breadcrumb trail with browser history integration
- **Search:** Removed (users navigate via hierarchy)
- **Status Indicators:** Removed (focus on capabilities, not state)
- **Language:** English only throughout interface

---

## Table of Contents

1. [Design Goals](#1-design-goals)
2. [Information Architecture](#2-information-architecture)
3. [Main Agent Cards](#3-main-agent-cards)
4. [Sub Agents Grid](#4-sub-agents-grid)
5. [Modal Detail View](#5-modal-detail-view)
6. [Responsive Design](#6-responsive-design)
7. [Interactive States](#7-interactive-states)
8. [Error & Empty States](#8-error--empty-states)
9. [Navigation Patterns](#9-navigation-patterns)
10. [Technical Implementation](#10-technical-implementation)

---

## 1. Design Goals

### 1.1 Problems with Current Design

The existing design (10 category tabs, 50 agents shown at once) has several issues:

- **Cognitive Overload:** Displaying 50 agents simultaneously overwhelms users
- **Flat Hierarchy:** No clear grouping or relationship between agents
- **Poor Scannability:** Users struggle to find relevant agents quickly
- **Status Confusion:** Active/Inactive indicators add complexity without clear value
- **Search Dependency:** Users rely on search to find agents instead of browsing

### 1.2 New Design Objectives

1. **Reduce Information Density:** Show 6 Main Agents initially, reveal Sub Agents on demand
2. **Clear Hierarchy:** Two-level structure (Main → Sub) with visual tree representation
3. **Improved Discovery:** Icon previews help users understand content before clicking
4. **Simplified Functionality:** Remove search and status, focus on capability showcase
5. **Better Navigation:** Breadcrumbs and browser history integration for easy backtracking

### 1.3 Success Metrics

- Users can identify relevant agent category within 5 seconds
- Navigation between levels feels intuitive (measured via user testing)
- Modal detail view provides complete information without page navigation
- Mobile experience is as functional as desktop

---

## 2. Information Architecture

### 2.1 Main Agent Categories (6 total)

The 50 Sub Agents are grouped into 6 Main Agent categories based on procurement workflow stages:

| Main Agent | Sub Agent Count | Categories Included | Color Theme |
|------------|----------------|---------------------|-------------|
| **Procurement Planning** | 5 | Procurement Planning | Blue (#1890ff) |
| **Supplier Management** | 5 | Supplier Management | Purple (#722ed1) |
| **Order & Collaboration** | 10 | Order Execution + Collaboration | Green (#52c41a) |
| **Quality & Risk** | 10 | Quality & Compliance + Risk & Anomaly | Orange (#fa541c) |
| **Financial & Optimization** | 15 | Financial + Optimization + User Support | Cyan (#13c2c2) |
| **Data Analytics** | 5 | Data Analytics | Pink (#eb2f96) |

**Rationale for Data Analytics separation:** While analytics applies to procurement planning, it also spans budget control, supplier evaluation, and post-order analysis. Keeping it separate emphasizes its cross-cutting nature.

### 2.2 Navigation Flow

```
Settings → AI Assistant Configuration
  ↓
Main Agents Grid (6 cards)
  ↓ (click Main Agent card)
Sub Agents Grid (5-15 cards depending on category)
  ↓ (click "View Details" on Sub Agent)
Modal Dialog (full agent information)
```

### 2.3 URL Structure

- Main page: `/settings/ai-assistant`
- Sub agents: `/settings/ai-assistant/:main-agent-slug`
- Modal open: `/settings/ai-assistant/:main-agent-slug?agent=:sub-agent-id`

Browser back button navigates up the hierarchy.

---

## 3. Main Agent Cards

### 3.1 Visual Design

Each Main Agent card displays:

1. **Large Icon** (56px) - Emoji representing the category
2. **Title** - Category name (e.g., "Procurement Planning")
3. **Subtitle** - Brief descriptor (e.g., "Strategic planning & forecasting")
4. **Badge** - Sub Agent count (e.g., "5 Sub Agents")
5. **Icon Preview Row** - 5 representative Sub Agent icons (32px each)
6. **Call-to-Action** - "Click to view details →" in category color

### 3.2 Layout Specifications

**Desktop (1024px+):** 3-column grid, 24px gap
**Tablet (768-1023px):** 2-column grid, 20px gap
**Mobile (<768px):** 1-column stack, 16px gap

**Card Dimensions:**
- Padding: 28px (desktop), 20px (mobile)
- Border radius: 16px
- Background: white
- Border: 2px solid transparent (default), category color (hover)
- Shadow: 0 2px 12px rgba(0,0,0,0.08) (default), 0 8px 24px category-alpha-15% (hover)

### 3.3 Interactive States

| State | Transform | Border | Shadow | Duration |
|-------|-----------|--------|--------|----------|
| Default | none | transparent | light | - |
| Hover | translateY(-4px) | category color | enhanced | 300ms ease |
| Active | scale(0.98) | darker category | reduced | 100ms ease |

### 3.4 Category Colors

Each Main Agent has a unique color for visual differentiation:
- Procurement Planning: Blue (#1890ff)
- Supplier Management: Purple (#722ed1)
- Order & Collaboration: Green (#52c41a)
- Quality & Risk: Orange (#fa541c)
- Financial & Optimization: Cyan (#13c2c2)
- Data Analytics: Pink (#eb2f96)

---

## 4. Sub Agents Grid

### 4.1 Display After Main Agent Click

When a Main Agent card is clicked:

1. Page URL updates to `/settings/ai-assistant/:main-agent-slug`
2. Breadcrumb shows: `Settings / AI Assistant / [Main Agent Name]`
3. Header displays Main Agent icon and name
4. Sub Agents appear in card grid below
5. Smooth slide-down animation (400ms ease-out)

### 4.2 Sub Agent Card Design

**Compact card showing:**
- Agent icon (48px emoji)
- Agent name (16px bold)
- Short description (13px, 2-line clamp)
- "View Details" button (primary color)

**Grid Layout:**
- Desktop: 2 columns
- Tablet: 2 columns
- Mobile: 1 column (full-width horizontal cards)

### 4.3 Mobile Optimization

On mobile (<768px), Sub Agent cards become horizontal:
- Icon on left (48px)
- Text content in middle (flexbox)
- "View" button on right (compact, 8px 16px padding)

---

## 5. Modal Detail View

### 5.1 Trigger

Clicking "View Details" on any Sub Agent opens a modal dialog.

### 5.2 Modal Structure

**Header Section:**
- Large agent icon (56px)
- Agent name (22px)
- Short description (14px gray)
- Close button (× top-right)

**Content Section (scrollable):**
- Full description paragraph
- Workflow visualization (with icons and steps)
- Use cases (bullet list or tag pills)

**Footer Section:**
- "Got it" button (primary, centered or right-aligned)

### 5.3 Modal Animations

**Enter:** Fade in + scale from 95% to 100% + slide up 20px (300ms ease-out)
**Exit:** Fade out + scale to 95% (200ms ease-in)
**Backdrop:** Fade in/out rgba(0,0,0,0.45) (200ms)

### 5.4 Modal Accessibility

- Trap focus inside modal
- ESC key closes modal
- Click outside backdrop closes modal
- Focus returns to trigger button on close
- ARIA labels: `role="dialog"`, `aria-modal="true"`

---

## 6. Responsive Design

### 6.1 Breakpoint Strategy

| Breakpoint | Layout | Adjustments |
|------------|--------|-------------|
| **1920px+** | 3-column grid | Full desktop, large cards, spacious padding |
| **1024-1919px** | 3-column grid | Standard desktop, normal card size |
| **768-1023px** | 2-column grid | Tablet landscape, reduced padding, smaller fonts |
| **320-767px** | 1-column stack | Mobile portrait, horizontal cards, compact spacing |

### 6.2 Mobile-Specific Patterns

**Main Agent Cards:**
- Stack vertically with full width
- Horizontal layout: icon left, content center, arrow right
- Icon preview row remains visible (smaller icons)

**Sub Agent Cards:**
- Horizontal layout: icon left, text middle, button right
- Reduced padding (16px vs 20px)
- Smaller fonts (14px title, 12px description)

**Modal Dialogs:**
- Full screen on mobile (<640px)
- Reduced padding (20px vs 32px)
- Sticky close button at top

### 6.3 Touch Optimization

- Minimum tap target size: 44x44px
- Increased spacing between interactive elements (12px minimum)
- No hover-dependent interactions
- Larger hit areas for close buttons and links

---

## 7. Interactive States

### 7.1 Card States

**Main Agent & Sub Agent Cards:**

| State | Visual Changes | Animation |
|-------|----------------|-----------|
| Default | White bg, subtle shadow | - |
| Hover | Lift 4px, category border, enhanced shadow | 300ms ease |
| Active | Scale 98%, darker border, reduced shadow | 100ms ease |
| Focus | 2px blue outline + 3px shadow ring | - |

### 7.2 Button States

| State | Background | Transform | Opacity |
|-------|------------|-----------|---------|
| Default | Primary color | - | 1.0 |
| Hover | Lighter shade | - | 1.0 |
| Active | Darker shade | scale(0.96) | 1.0 |
| Loading | Primary color | - | 0.6 |
| Disabled | Gray (#f5f5f5) | - | 1.0 |

### 7.3 Loading Indicators

**Three animation types:**
1. **Pulse:** Opacity 1.0 ↔ 0.6 (1.5s ease-in-out infinite)
2. **Spin:** Rotate 0deg → 360deg (1s linear infinite)
3. **Dot Bounce:** 3 dots bouncing with staggered delay (1.4s ease-in-out)

### 7.4 Performance Guidelines

All animations use CSS `transform` and `opacity` only (GPU-accelerated, 60fps). Never animate `width`, `height`, `top`, `left` as they trigger layout reflow.

---

## 8. Error & Empty States

### 8.1 Loading States

**Initial Page Load:**
- Large loading icon (64px, pulse animation)
- "Loading AI Agents" heading
- "Please wait..." subtext
- Centered on page

### 8.2 Empty States

**No Main Agents:**
- Icon: 📭 (72px)
- Title: "No AI Agents Available"
- Message: "There are currently no AI agents configured for your organization."
- Action: "Contact Support" button

**No Sub Agents:**
- Icon: 🤷 (72px)
- Title: "No Sub Agents Found"
- Message: "This category doesn't have any agents yet."
- Action: "← Back to Main Agents" button

### 8.3 Error States

**Network Error:**
- Background: Light red (#fff2f0)
- Icon: ⚠️ (72px)
- Title: "Failed to Load AI Agents" (red)
- Message: "Unable to connect to the server. Check your connection."
- Actions: "Retry" (primary red) + "Go Back" (secondary)

**Server Error:**
- Icon: 🚨 (72px)
- Title: "Something Went Wrong"
- Message: "An unexpected error occurred."
- Error details box: Error code + Request ID (monospace font)
- Action: "Refresh Page" button

### 8.4 Inline Notifications

Four notification types (dismissible with ×, auto-dismiss timing varies):

- **Success:** Green bg, ✅ icon, 5s auto-dismiss
- **Warning:** Yellow bg, ⚠️ icon, no auto-dismiss
- **Error:** Red bg, ❌ icon, no auto-dismiss
- **Info:** Blue bg, ℹ️ icon, 8s auto-dismiss

---

## 9. Navigation Patterns

### 9.1 Breadcrumb Navigation

**Desktop:**
- Back arrow button (← left-aligned)
- Breadcrumb trail: `Settings / AI Assistant / [Current Page]`
- Clickable segments (blue, hover effect)
- Current page segment is bold, non-clickable

**Mobile (<768px):**
- Back arrow button
- Condensed breadcrumb: Current page title only
- Parent path shown as small gray text above

### 9.2 Browser Integration

**URL updates:**
- Main page: `/settings/ai-assistant`
- Sub agents: `/settings/ai-assistant/procurement-planning`
- Modal: `/settings/ai-assistant/procurement-planning?agent=smart-procurement`

**Browser back button:**
- Works naturally with URL updates
- Closes modal → returns to Sub Agents → returns to Main Agents

### 9.3 Keyboard Navigation

| Key | Action | Context |
|-----|--------|---------|
| `Esc` | Close modal / Go back one level | Modal or Sub Agents |
| `Tab` | Navigate between cards/buttons | All views |
| `Enter` | Activate focused element | All views |
| `←` | Go back | Sub Agents view |
| `Alt + ←` | Browser back | All views |

### 9.4 Focus Management

- Clear 2px blue outline + 3px shadow ring
- Focus trapped in modal when open
- Focus returns to trigger on modal close
- Skip links for keyboard-only users

---

## 10. Technical Implementation

### 10.1 Component Structure

```
AIAssistantPage (main page)
├── Breadcrumb
├── PageHeader
└── MainAgentGrid
    └── MainAgentCard (6 instances)

SubAgentsPage (after Main Agent click)
├── Breadcrumb
├── CategoryHeader
└── SubAgentGrid
    └── SubAgentCard (5-15 instances)
        └── AgentModal (opens on "View Details")
```

### 10.2 Data Structure

**MainAgent interface:**
```typescript
interface MainAgent {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  subAgentCount: number;
  previewIcons: string[]; // 5 representative icons
  slug: string;
}
```

**SubAgent interface:**
```typescript
interface SubAgent {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  workflow: WorkflowStep[];
  useCases: string[];
  mainAgentId: string;
}
```

### 10.3 State Management

- Main Agents: Loaded on page mount
- Sub Agents: Loaded when Main Agent clicked (or from route param)
- Modal state: Controlled by URL query param `?agent=:id`
- Loading states: Track API calls with loading flags

### 10.4 Removed Features

From the original design, these are **removed:**
- Search bar (users navigate via hierarchy)
- Category tabs (replaced by Main Agent cards)
- Active/Inactive status indicators
- In-page card expansion
- Configuration forms (out of scope for this redesign)

---

## Appendix: Migration from Old Design

### Changes Summary

| Old Design | New Design | Reason |
|------------|------------|--------|
| 10 category tabs | 6 Main Agent cards | Reduce categories, improve grouping |
| 50 agents visible | 6 cards → click → Sub Agents | Progressive disclosure |
| In-page expansion | Modal dialog | Cleaner, focused reading |
| Search bar | Removed | Simplify, encourage browsing |
| Status indicators | Removed | Focus on capabilities |

### Implementation Priority

1. **Phase 1:** Main Agent cards + routing
2. **Phase 2:** Sub Agents grid + breadcrumbs
3. **Phase 3:** Modal detail view
4. **Phase 4:** Error states + loading indicators
5. **Phase 5:** Responsive design + mobile optimization
6. **Phase 6:** Animations + polish

---

**End of Specification**