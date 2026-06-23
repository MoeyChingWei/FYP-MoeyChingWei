# Frontend Export Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build reusable ExportButton and PrintButton React components for exporting data in PDF/Excel/CSV/JSON formats and integrate them into all module list pages.

**Architecture:** Two standalone components (ExportButton, PrintButton) that call the backend export API, handle loading/error states, and trigger file downloads. Components use Ant Design UI, TypeScript, and react-i18next for internationalization.

**Tech Stack:** React, TypeScript, Ant Design 6.3.1, axios, react-i18next

## Global Constraints

- Ant Design 6.3.1 (Dropdown, Button, Menu, message components)
- TypeScript with strict type checking
- axios for HTTP requests (responseType: 'blob', timeout: 60000ms)
- react-i18next for i18n (EN, ZH, MS)
- CSS Modules for component styling
- Backend API: POST /api/export/:dataType with format and filters in body
- File naming: {dataType}-{timestamp}.{extension}
- Error handling for 403, 404, 500, timeout
- Commit messages follow conventional commits format

---

## File Structure

### Components to Create
- `client/src/FrontEnd/components/shared/ExportButton.tsx` - Export dropdown component
- `client/src/FrontEnd/components/shared/ExportButton.module.css` - Export button styles
- `client/src/FrontEnd/components/shared/PrintButton.tsx` - Print button component
- `client/src/FrontEnd/components/shared/PrintButton.module.css` - Print button styles
- `client/src/FrontEnd/components/shared/types/export.ts` - Shared TypeScript types

### i18n Files to Modify
- `client/src/i18n/locales/en/common.json` - Add export translations
- `client/src/i18n/locales/zh/common.json` - Add export translations
- `client/src/i18n/locales/ms/common.json` - Add export translations

### Pages to Modify (later tasks)
- `client/src/FrontEnd/pages/purchasing/PurchaseOrderReview.tsx` - Add export/print buttons
- (Other list pages as discovered)

---

### Task 1: Add i18n Translations

**Files:**
- Modify: `client/src/i18n/locales/en/common.json`
- Modify: `client/src/i18n/locales/zh/common.json`
- Modify: `client/src/i18n/locales/ms/common.json`

**Interfaces:**
- Consumes: Existing common.json structure
- Produces: Translation keys under "export" namespace for use in components

- [ ] **Step 1: Add English translations**

```json
// Add to client/src/i18n/locales/en/common.json (merge with existing)
{
  "export": {
    "button": "Export",
    "print": "Print",
    "formats": {
      "pdf": "Export as PDF",
      "excel": "Export as Excel (.xlsx)",
      "csv": "Export as CSV",
      "json": "Export as JSON"
    },
    "success": "Export completed successfully!",
    "error": {
      "generic": "Export failed. Please try again.",
      "timeout": "Export is taking longer than expected. Please try again.",
      "permission": "You don't have permission to export this data.",
      "noData": "No data available to export.",
      "network": "Network error. Please check your connection."
    }
  }
}
```

- [ ] **Step 2: Add Chinese translations**

```json
// Add to client/src/i18n/locales/zh/common.json (merge with existing)
{
  "export": {
    "button": "导出",
    "print": "打印",
    "formats": {
      "pdf": "导出为 PDF",
      "excel": "导出为 Excel (.xlsx)",
      "csv": "导出为 CSV",
      "json": "导出为 JSON"
    },
    "success": "导出成功！",
    "error": {
      "generic": "导出失败，请重试。",
      "timeout": "导出时间过长，请重试。",
      "permission": "您没有权限导出此数据。",
      "noData": "没有可导出的数据。",
      "network": "网络错误，请检查您的连接。"
    }
  }
}
```

- [ ] **Step 3: Add Malay translations**

```json
// Add to client/src/i18n/locales/ms/common.json (merge with existing)
{
  "export": {
    "button": "Eksport",
    "print": "Cetak",
    "formats": {
      "pdf": "Eksport sebagai PDF",
      "excel": "Eksport sebagai Excel (.xlsx)",
      "csv": "Eksport sebagai CSV",
      "json": "Eksport sebagai JSON"
    },
    "success": "Eksport berjaya!",
    "error": {
      "generic": "Eksport gagal. Sila cuba lagi.",
      "timeout": "Eksport mengambil masa terlalu lama. Sila cuba lagi.",
      "permission": "Anda tidak mempunyai kebenaran untuk eksport data ini.",
      "noData": "Tiada data untuk dieksport.",
      "network": "Ralat rangkaian. Sila semak sambungan anda."
    }
  }
}
```

- [ ] **Step 4: Commit translations**

```bash
git add client/src/i18n/locales/*/common.json
git commit -m "feat(i18n): add export/print translations for EN/ZH/MS

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Create Shared TypeScript Types

**Files:**
- Create: `client/src/FrontEnd/components/shared/types/export.ts`

**Interfaces:**
- Consumes: None
- Produces: 
  - `DataType` type alias
  - `ExportFormat` type alias
  - `ExportButtonProps` interface
  - `PrintButtonProps` interface

- [ ] **Step 1: Create types directory**

```bash
mkdir -p client/src/FrontEnd/components/shared/types
```

- [ ] **Step 2: Create export types file**

```typescript
// client/src/FrontEnd/components/shared/types/export.ts
export type DataType = 'purchase-requests' | 'purchase-orders' | 'invoices' | 'suppliers';

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

export interface ExportButtonProps {
  dataType: DataType;
  filters?: Record<string, any>;
  disabled?: boolean;
  onSuccess?: (format: ExportFormat, fileName: string) => void;
  onError?: (error: Error) => void;
}

export interface PrintButtonProps {
  dataType: DataType;
  filters?: Record<string, any>;
  disabled?: boolean;
  onError?: (error: Error) => void;
}
```

- [ ] **Step 3: Commit types**

```bash
git add client/src/FrontEnd/components/shared/types/export.ts
git commit -m "feat(types): add export component TypeScript types

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Create ExportButton Component

**Files:**
- Create: `client/src/FrontEnd/components/shared/ExportButton.tsx`
- Create: `client/src/FrontEnd/components/shared/ExportButton.module.css`

**Interfaces:**
- Consumes: 
  - Types from `./types/export.ts` (ExportButtonProps, DataType, ExportFormat)
  - i18n keys from `common:export.*`
  - Backend API POST /api/export/:dataType
- Produces: Reusable ExportButton React component

- [ ] **Step 1: Create ExportButton component**

```tsx
// client/src/FrontEnd/components/shared/ExportButton.tsx
import React, { useState } from 'react';
import { Button, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { DownloadOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { getSessionUser } from '../../shared/auth/session';
import type { ExportButtonProps, ExportFormat } from './types/export';
import styles from './ExportButton.module.css';

const ExportButton: React.FC<ExportButtonProps> = ({
  dataType,
  filters = {},
  disabled = false,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: ExportFormat): Promise<void> => {
    setLoading(true);

    try {
      const sessionUser = getSessionUser();
      
      if (!sessionUser) {
        throw new Error('User not logged in');
      }

      const response = await axios.post(
        `/api/export/${dataType}`,
        {
          userId: sessionUser.id,
          userRole: sessionUser.role,
          format,
          filters,
        },
        {
          responseType: 'blob',
          timeout: 60000,
        }
      );

      // Generate filename
      const timestamp = Date.now();
      const extension = format === 'excel' ? 'xlsx' : format;
      const fileName = `${dataType}-${timestamp}.${extension}`;

      // Create blob and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(t('export.success'));
      onSuccess?.(format, fileName);
    } catch (error) {
      console.error('Export error:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          message.error(t('export.error.timeout'));
        } else if (error.response?.status === 403) {
          message.error(t('export.error.permission'));
        } else if (error.response?.status === 404) {
          message.error(t('export.error.noData'));
        } else if (error.message === 'Network Error') {
          message.error(t('export.error.network'));
        } else {
          message.error(t('export.error.generic'));
        }
      } else {
        message.error(t('export.error.generic'));
      }

      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'pdf',
      label: (
        <div className={styles.menuItem}>
          <span className={styles.icon}>📄</span>
          {t('export.formats.pdf')}
        </div>
      ),
      onClick: () => handleExport('pdf'),
    },
    {
      key: 'excel',
      label: (
        <div className={styles.menuItem}>
          <span className={styles.icon}>📊</span>
          {t('export.formats.excel')}
        </div>
      ),
      onClick: () => handleExport('excel'),
    },
    {
      key: 'csv',
      label: (
        <div className={styles.menuItem}>
          <span className={styles.icon}>📋</span>
          {t('export.formats.csv')}
        </div>
      ),
      onClick: () => handleExport('csv'),
    },
    {
      key: 'json',
      label: (
        <div className={styles.menuItem}>
          <span className={styles.icon}>💾</span>
          {t('export.formats.json')}
        </div>
      ),
      onClick: () => handleExport('json'),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} disabled={disabled || loading}>
      <Button
        icon={<DownloadOutlined />}
        loading={loading}
        disabled={disabled}
        className={styles.exportButton}
      >
        {t('export.button')} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default ExportButton;
```

- [ ] **Step 2: Create ExportButton styles**

```css
/* client/src/FrontEnd/components/shared/ExportButton.module.css */
.exportButton {
  /* Inherit Ant Design default button styles */
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.icon {
  font-size: 16px;
  line-height: 1;
}
```

- [ ] **Step 3: Commit ExportButton**

```bash
git add client/src/FrontEnd/components/shared/ExportButton.tsx client/src/FrontEnd/components/shared/ExportButton.module.css
git commit -m "feat(components): add ExportButton with format dropdown

- Dropdown with PDF/Excel/CSV/JSON options
- API integration with backend export endpoint
- Loading states and error handling
- i18n support for all messages

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Create PrintButton Component

**Files:**
- Create: `client/src/FrontEnd/components/shared/PrintButton.tsx`
- Create: `client/src/FrontEnd/components/shared/PrintButton.module.css`

**Interfaces:**
- Consumes:
  - Types from `./types/export.ts` (PrintButtonProps)
  - i18n keys from `common:export.*`
  - Backend API POST /api/export/:dataType
- Produces: Reusable PrintButton React component

- [ ] **Step 1: Create PrintButton component**

```tsx
// client/src/FrontEnd/components/shared/PrintButton.tsx
import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { getSessionUser } from '../../shared/auth/session';
import type { PrintButtonProps } from './types/export';
import styles from './PrintButton.module.css';

const PrintButton: React.FC<PrintButtonProps> = ({
  dataType,
  filters = {},
  disabled = false,
  onError,
}) => {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);

  const handlePrint = async (): Promise<void> => {
    setLoading(true);

    try {
      const sessionUser = getSessionUser();
      
      if (!sessionUser) {
        throw new Error('User not logged in');
      }

      const response = await axios.post(
        `/api/export/${dataType}`,
        {
          userId: sessionUser.id,
          userRole: sessionUser.role,
          format: 'pdf',
          filters,
        },
        {
          responseType: 'blob',
          timeout: 60000,
        }
      );

      // Create blob URL and open in new window
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new window and trigger print
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        message.error('Pop-up blocked. Please allow pop-ups to print.');
      }

      // Clean up after a delay to allow print dialog to open
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      console.error('Print error:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          message.error(t('export.error.timeout'));
        } else if (error.response?.status === 403) {
          message.error(t('export.error.permission'));
        } else if (error.response?.status === 404) {
          message.error(t('export.error.noData'));
        } else if (error.message === 'Network Error') {
          message.error(t('export.error.network'));
        } else {
          message.error(t('export.error.generic'));
        }
      } else {
        message.error(t('export.error.generic'));
      }

      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      icon={<PrinterOutlined />}
      loading={loading}
      disabled={disabled}
      onClick={handlePrint}
      className={styles.printButton}
    >
      {t('export.print')}
    </Button>
  );
};

export default PrintButton;
```

- [ ] **Step 2: Create PrintButton styles**

```css
/* client/src/FrontEnd/components/shared/PrintButton.module.css */
.printButton {
  /* Inherit Ant Design default button styles */
}
```

- [ ] **Step 3: Commit PrintButton**

```bash
git add client/src/FrontEnd/components/shared/PrintButton.tsx client/src/FrontEnd/components/shared/PrintButton.module.css
git commit -m "feat(components): add PrintButton for PDF printing

- Generates PDF and opens in new window
- Automatically triggers print dialog
- Error handling for common scenarios
- i18n support

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Integrate into Purchase Order Review Page

**Files:**
- Modify: `client/src/FrontEnd/pages/purchasing/PurchaseOrderReview.tsx`

**Interfaces:**
- Consumes: ExportButton and PrintButton components
- Produces: Purchase Order list page with export/print functionality

- [ ] **Step 1: Add imports to PurchaseOrderReview.tsx**

Add these imports at the top of the file:
```typescript
import ExportButton from '../../components/shared/ExportButton';
import PrintButton from '../../components/shared/PrintButton';
```

- [ ] **Step 2: Add export/print buttons to the page header**

Find the page header section (likely around the Title component) and add:
```tsx
<Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
  <Title level={3}>{t('purchaseOrder.review.title')}</Title>
  
  <Flex gap={8}>
    <ExportButton
      dataType="purchase-orders"
      filters={{
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        department: canViewAllOrders ? undefined : sessionUser?.department,
      }}
    />
    
    <PrintButton
      dataType="purchase-orders"
      filters={{
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        department: canViewAllOrders ? undefined : sessionUser?.department,
      }}
    />
  </Flex>
</Flex>
```

- [ ] **Step 3: Test manually**

Run: `npm run dev` (in client directory)
Expected: Buttons appear in page header, dropdown works, export/print functional

- [ ] **Step 4: Commit integration**

```bash
git add client/src/FrontEnd/pages/purchasing/PurchaseOrderReview.tsx
git commit -m "feat(purchasing): add export/print buttons to PO review page

- Export button with format dropdown
- Print button for PDF printing
- Respects current filters and permissions

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Document Integration Pattern

**Files:**
- Create: `docs/07-design-specs/guides/export-button-integration.md`

**Interfaces:**
- Consumes: None (documentation)
- Produces: Integration guide for other pages

- [ ] **Step 1: Create integration guide**

```markdown
# Export Button Integration Guide

## Overview

This guide shows how to add ExportButton and PrintButton components to list pages.

## Components

- **ExportButton**: Dropdown with PDF/Excel/CSV/JSON export options
- **PrintButton**: Direct PDF printing

## Basic Usage

```tsx
import ExportButton from '@/components/shared/ExportButton';
import PrintButton from '@/components/shared/PrintButton';

// In your list page component:
<Flex gap={8}>
  <ExportButton
    dataType="purchase-requests"
    filters={{
      status: currentStatus,
      department: userDepartment,
    }}
  />
  
  <PrintButton
    dataType="purchase-requests"
    filters={{
      status: currentStatus,
    }}
  />
</Flex>
```

## Data Types

- `purchase-requests`
- `purchase-orders`
- `invoices`
- `suppliers`

## Filters

Pass current page filters to ensure exported data matches what user sees:

```tsx
filters={{
  status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
  department: canViewAll ? undefined : user?.department,
  dateFrom: startDate?.format('YYYY-MM-DD'),
  dateTo: endDate?.format('YYYY-MM-DD'),
}}
```

## Permissions

Components automatically use session user credentials. Backend enforces department-level permissions.

## Error Handling

Components handle errors automatically with user-friendly messages. Optionally add callbacks:

```tsx
<ExportButton
  dataType="invoices"
  onSuccess={(format, fileName) => {
    console.log(`Exported as ${format}: ${fileName}`);
  }}
  onError={(error) => {
    console.error('Export failed:', error);
  }}
/>
```

## Placement

**Recommended:** Top-right corner of list page, next to search/filter controls.

## Styling

Components use Ant Design default button styling. Customize via className prop if needed.
```

- [ ] **Step 2: Commit documentation**

```bash
git add docs/07-design-specs/guides/export-button-integration.md
git commit -m "docs: add export button integration guide

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Task 1: i18n translations (EN/ZH/MS)
- ✅ Task 2: TypeScript types
- ✅ Task 3: ExportButton component (dropdown, API, error handling)
- ✅ Task 4: PrintButton component (PDF generation, print dialog)
- ✅ Task 5: Integration example (PurchaseOrderReview)
- ✅ Task 6: Integration documentation

**Placeholder Scan:** No TBD, TODO, or placeholder code present.

**Type Consistency:** All types match across tasks (DataType, ExportFormat, Props interfaces).

---

**Plan complete and saved to `docs/07-design-specs/plans/2026-06-23-frontend-export-components.md`.**

Now I'll execute this plan using subagent-driven-development.
