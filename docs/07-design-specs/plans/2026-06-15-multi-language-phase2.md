# Multi-Language Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate 29 pages across Purchasing, Supplier Fulfillment, and User Access modules to support English, Chinese, and Malay languages.

**Architecture:** Automated text extraction from all pages → Create 3 module-specific translation files (purchasing/supplier/userAccess) × 3 languages → Batch replace hardcoded text with t() calls → Validate and test.

**Tech Stack:** React, TypeScript, react-i18next, Ant Design

---

## File Structure

**New Translation Files:**
- `client/src/i18n/locales/en/purchasing.json` (create)
- `client/src/i18n/locales/en/supplier.json` (create)
- `client/src/i18n/locales/en/userAccess.json` (create)
- `client/src/i18n/locales/zh/purchasing.json` (create)
- `client/src/i18n/locales/zh/supplier.json` (create)
- `client/src/i18n/locales/zh/userAccess.json` (create)
- `client/src/i18n/locales/ms/purchasing.json` (create)
- `client/src/i18n/locales/ms/supplier.json` (create)
- `client/src/i18n/locales/ms/userAccess.json` (create)

**Modified Files:**
- `client/src/i18n/index.ts` - Register new namespaces
- All 29 page files (14 purchasing + 8 supplier + 7 userAccess)

---

## Task 1: Extract Text from Purchasing Module (14 pages)

**Goal:** Scan all Purchasing pages and extract hardcoded text into structured format.

**Files to read:**
- `client/src/FrontEnd/pages/purchasing/*.tsx` (14 files)

- [ ] **Step 1: Use Agent to scan Purchasing pages**

Dispatch agent to read and extract text from all 14 purchasing pages.

- [ ] **Step 2: Organize extracted text by functional area**

Structure: creation, review, approval, order, delivery, grn

- [ ] **Step 3: Generate translation key structure**

Create hierarchical keys following 4-level structure from design.

Expected output: Structured JSON with all English text and corresponding keys.

---

## Task 2: Extract Text from Supplier Module (8 pages)

**Goal:** Scan all Supplier Fulfillment pages and extract hardcoded text.

**Files to read:**
- `client/src/FrontEnd/pages/supplierFulfillment/*.tsx` (8 files)

- [ ] **Step 1: Use Agent to scan Supplier pages**

Dispatch agent to read and extract text from all 8 supplier pages.

- [ ] **Step 2: Organize extracted text**

Structure: fulfillment, acknowledgment, delivery, grn

- [ ] **Step 3: Generate translation key structure**

Expected output: Structured JSON with all English text and keys.

---

## Task 3: Extract Text from User Access Module (7 pages)

**Goal:** Scan all User Access pages and extract hardcoded text.

**Files to read:**
- `client/src/FrontEnd/pages/userAccess/*.tsx` (7 files)

- [ ] **Step 1: Use Agent to scan User Access pages**

Dispatch agent to read and extract text from all 7 user access pages.

- [ ] **Step 2: Organize extracted text**

Structure: management, users, rbac, roles

- [ ] **Step 3: Generate translation key structure**

Expected output: Structured JSON with all English text and keys.

## Task 4: Create English Translation Files

**Goal:** Create 3 English JSON files with extracted text.

**Files to create:**
- `client/src/i18n/locales/en/purchasing.json`
- `client/src/i18n/locales/en/supplier.json`
- `client/src/i18n/locales/en/userAccess.json`

- [ ] **Step 1: Create purchasing.json with extracted text**

Use the structured output from Task 1.

- [ ] **Step 2: Create supplier.json with extracted text**

Use the structured output from Task 2.

- [ ] **Step 3: Create userAccess.json with extracted text**

Use the structured output from Task 3.

- [ ] **Step 4: Verify JSON syntax**

Run: `cd client && npm run build`
Expected: Build succeeds with no JSON parse errors.

---

## Task 5: Generate Chinese Translations

**Goal:** Create Chinese translation files based on English source.

**Files to create:**
- `client/src/i18n/locales/zh/purchasing.json`
- `client/src/i18n/locales/zh/supplier.json`
- `client/src/i18n/locales/zh/userAccess.json`

- [ ] **Step 1: Generate purchasing.json Chinese translations**

Follow Phase 1 terminology (批准, 采购申请, etc.)

- [ ] **Step 2: Generate supplier.json Chinese translations**

- [ ] **Step 3: Generate userAccess.json Chinese translations**

- [ ] **Step 4: Verify JSON syntax**

Run: `cd client && npm run build`
Expected: Build succeeds.

## Task 6: Generate Malay Translations

**Goal:** Create Malay translation files based on English source.

**Files to create:**
- `client/src/i18n/locales/ms/purchasing.json`
- `client/src/i18n/locales/ms/supplier.json`
- `client/src/i18n/locales/ms/userAccess.json`

- [ ] **Step 1: Generate purchasing.json Malay translations**

- [ ] **Step 2: Generate supplier.json Malay translations**

- [ ] **Step 3: Generate userAccess.json Malay translations**

- [ ] **Step 4: Verify JSON syntax**

Run: `cd client && npm run build`
Expected: Build succeeds.

---

## Task 7: Register New Namespaces in i18n Config

**Goal:** Update i18n configuration to load new translation files.

**File to modify:**
- `client/src/i18n/index.ts`

- [ ] **Step 1: Add imports for new translation files**

```typescript
import purchasingEn from './locales/en/purchasing.json';
import purchasingZh from './locales/zh/purchasing.json';
import purchasingMs from './locales/ms/purchasing.json';
import supplierEn from './locales/en/supplier.json';
import supplierZh from './locales/zh/supplier.json';
import supplierMs from './locales/ms/supplier.json';
import userAccessEn from './locales/en/userAccess.json';
import userAccessZh from './locales/zh/userAccess.json';
import userAccessMs from './locales/ms/userAccess.json';
```

- [ ] **Step 2: Update resources object**

```typescript
const resources = {
  en: {
    common: commonEn,
    navigation: navigationEn,
    dashboard: dashboardEn,
    settings: settingsEn,
    purchasing: purchasingEn,
    supplier: supplierEn,
    userAccess: userAccessEn,
  },
  zh: {
    common: commonZh,
    navigation: navigationZh,
    dashboard: dashboardZh,
    settings: settingsZh,
    purchasing: purchasingZh,
    supplier: supplierZh,
    userAccess: userAccessZh,
  },
  ms: {
    common: commonMs,
    navigation: navigationMs,
    dashboard: dashboardMs,
    settings: settingsMs,
    purchasing: purchasingMs,
    supplier: supplierMs,
    userAccess: userAccessMs,
  },
};
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: Build succeeds, new namespaces loaded.

## Task 8: Update Purchasing Module Pages (14 pages)

**Goal:** Replace hardcoded text with t() calls in all Purchasing pages.

**Files to modify:**
- `client/src/FrontEnd/pages/purchasing/*.tsx` (14 files)

- [ ] **Step 1: Batch update all 14 Purchasing pages**

For each page:
1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('purchasing');`
3. Replace hardcoded text with t() calls based on Task 1 extraction map
4. Handle special cases: tables, forms, validation messages

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd client && npm run build`
Expected: No TypeScript errors.

---

## Task 9: Update Supplier Module Pages (8 pages)

**Goal:** Replace hardcoded text with t() calls in all Supplier pages.

**Files to modify:**
- `client/src/FrontEnd/pages/supplierFulfillment/*.tsx` (8 files)

- [ ] **Step 1: Batch update all 8 Supplier pages**

For each page:
1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('supplier');`
3. Replace hardcoded text with t() calls based on Task 2 extraction map

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd client && npm run build`
Expected: No TypeScript errors.

---

## Task 10: Update User Access Module Pages (7 pages)

**Goal:** Replace hardcoded text with t() calls in all User Access pages.

**Files to modify:**
- `client/src/FrontEnd/pages/userAccess/*.tsx` (7 files)

- [ ] **Step 1: Batch update all 7 User Access pages**

For each page:
1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('userAccess');`
3. Replace hardcoded text with t() calls based on Task 3 extraction map

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd client && npm run build`
Expected: No TypeScript errors.

## Task 11: Validation and Testing

**Goal:** Verify all translations work correctly and no text is missing.

- [ ] **Step 1: Build frontend**

Run: `cd client && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Start development server**

Run: `cd client && npm start`
Expected: Server starts on port 3000.

- [ ] **Step 3: Test language switching on all modules**

1. Navigate to Purchasing pages, switch between EN/ZH/MS
2. Navigate to Supplier pages, switch between EN/ZH/MS
3. Navigate to User Access pages, switch between EN/ZH/MS

Expected: All text updates immediately, no English remains.

- [ ] **Step 4: Test form validation messages**

1. Submit empty form in Purchasing creation page
2. Verify validation messages show in selected language

Expected: Validation messages translated correctly.

- [ ] **Step 5: Test table columns and status labels**

1. View tables in all modules
2. Verify column headers are translated
3. Check status labels (Pending/Approved/Rejected)

Expected: All table content translated.

---

## Task 12: Final Review and Documentation

**Goal:** Complete Phase 2 and update documentation.

- [ ] **Step 1: Review translation completeness**

Check for any remaining hardcoded English text in the 29 pages.

- [ ] **Step 2: Update i18n usage guide**

File: `docs/i18n-usage-guide.md`

Add Phase 2 section:
```markdown
## Phase 2 Completed Modules

- **Purchasing Module**: All 14 pages translated
- **Supplier Module**: All 8 pages translated  
- **User Access Module**: All 7 pages translated

Use namespaces:
- `useTranslation('purchasing')`
- `useTranslation('supplier')`
- `useTranslation('userAccess')`
```

- [ ] **Step 3: Final acceptance test**

Complete user workflow:
1. Create purchase request in Chinese
2. Approve in Malay
3. Create PO in English
4. Verify all steps work correctly

Expected: Full workflow succeeds in all languages.

---

## Acceptance Criteria

✅ All 29 pages fully translated (English/Chinese/Malay)
✅ 9 new translation JSON files created and loaded
✅ No hardcoded text remains in translated modules
✅ Build succeeds with no errors
✅ Language switching works on all pages
✅ Forms and validation messages translated
✅ Table columns and status labels translated
✅ Documentation updated

---

**End of Implementation Plan**

