# Multi-Language Phase 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate user feedback messages (toast, validation, confirmations) to support English, Chinese, and Malay. Do NOT translate NotificationBell system notifications (audit requirement).

**Architecture:** Create 2 centralized translation files (messages.json, validation.json) → Register new namespaces → Scan all files using message.success/error/warning → Replace hardcoded strings with t() calls → Update form validation rules → Keep NotificationBell unchanged.

**Tech Stack:** React, TypeScript, react-i18next, Ant Design message API

---

## File Structure

**New Translation Files:**
- `client/src/i18n/locales/en/messages.json` (create)
- `client/src/i18n/locales/en/validation.json` (create)
- `client/src/i18n/locales/zh/messages.json` (create)
- `client/src/i18n/locales/zh/validation.json` (create)
- `client/src/i18n/locales/ms/messages.json` (create)
- `client/src/i18n/locales/ms/validation.json` (create)

**Modified Files:**
- `client/src/i18n/index.ts` - Register new namespaces
- Multiple files using `message.success/error/warning` - Replace with t() calls
- Form components with validation rules - Replace with t() calls

**DO NOT Modify:**
- `client/src/FrontEnd/components/shared/NotificationBell.tsx` - Keep English (audit)
- `client/src/FrontEnd/pages/Notifications.tsx` - Keep English (audit)

---

## Task 1: Create Translation Files

**Goal:** Create messages.json and validation.json for all 3 languages (6 files total).

**Files to create:** All 6 translation files listed above.

- [ ] **Step 1: Create English messages.json**

Create file with success/error/warning/info/confirm keys.

- [ ] **Step 2: Create English validation.json**

Create file with validation rule keys (required, email, minLength, etc.).

- [ ] **Step 3: Generate Chinese translations**

Create zh/messages.json and zh/validation.json.

- [ ] **Step 4: Generate Malay translations**

Create ms/messages.json and ms/validation.json.

- [ ] **Step 5: Verify JSON syntax**

Run: `cd client && npm run build`
Expected: Build succeeds with no JSON errors.

---

## Task 2: Register New Namespaces

**Goal:** Update i18n configuration to load new translation files.

**File to modify:** `client/src/i18n/index.ts`

- [ ] **Step 1: Add imports for new translation files**

```typescript
import messagesEn from './locales/en/messages.json';
import messagesZh from './locales/zh/messages.json';
import messagesMs from './locales/ms/messages.json';
import validationEn from './locales/en/validation.json';
import validationZh from './locales/zh/validation.json';
import validationMs from './locales/ms/validation.json';
```

- [ ] **Step 2: Update resources object**

Add to each language section:
```typescript
const resources = {
  en: {
    // ... existing
    messages: messagesEn,
    validation: validationEn,
  },
  zh: {
    // ... existing
    messages: messagesZh,
    validation: validationZh,
  },
  ms: {
    // ... existing
    messages: messagesMs,
    validation: validationMs,
  },
};
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: Build succeeds, new namespaces loaded.

---

## Task 3: Scan and Replace Toast Messages

**Goal:** Find all message.success/error/warning calls and replace with t() calls.

**Files to scan:** All files in `client/src/FrontEnd/` except NotificationBell and Notifications page.

- [ ] **Step 1: Scan for message API usage**

Find all files using:
- `message.success()`
- `message.error()`
- `message.warning()`
- `message.info()`

- [ ] **Step 2: Replace hardcoded strings with t() calls**

For each file:
1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('messages');`
3. Replace strings: `message.success('保存成功')` → `message.success(t('success.save'))`

**Example transformation:**
```tsx
// Before
message.success('操作成功');
message.error('操作失败');

// After
const { t } = useTranslation('messages');
message.success(t('success.save'));
message.error(t('error.save'));
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd client && npm run build`
Expected: No TypeScript errors.

---

## Task 4: Update Form Validation Rules

**Goal:** Replace hardcoded validation messages with t() calls.

**Files to scan:** All form components with validation rules.

- [ ] **Step 1: Find forms with validation rules**

Search for `rules={[` in all `.tsx` files.

- [ ] **Step 2: Replace validation messages**

For each form:
1. Add: `const { t } = useTranslation('validation');`
2. Update rules:

```tsx
// Before
rules={[
  { required: true, message: '此字段为必填项' },
  { type: 'email', message: '请输入有效的电子邮件' }
]}

// After
const { t } = useTranslation('validation');
rules={[
  { required: true, message: t('required') },
  { type: 'email', message: t('email') }
]}
```

- [ ] **Step 3: Handle variable interpolation**

For dynamic validation:
```tsx
rules={[
  { min: 8, message: t('minLength', { min: 8 }) }
]}
```

- [ ] **Step 4: Verify build**

Run: `cd client && npm run build`
Expected: No errors.

---

## Task 5: Update Modal Confirmations

**Goal:** Replace Modal.confirm hardcoded text with t() calls.

**Files to scan:** Files using `Modal.confirm()`

- [ ] **Step 1: Find Modal.confirm usage**

Search for `Modal.confirm` in all `.tsx` files.

- [ ] **Step 2: Replace confirmation text**

```tsx
// Before
Modal.confirm({
  title: '确认删除',
  content: '确定要删除此项吗？',
  onOk: handleDelete,
});

// After
const { t } = useTranslation('messages');
Modal.confirm({
  title: t('confirm.delete'),
  onOk: handleDelete,
});
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: No errors.

---

## Task 6: Validation and Testing

**Goal:** Verify all translations work correctly.

- [ ] **Step 1: Build frontend**

Run: `cd client && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Test toast messages**

1. Trigger save operation
2. Switch languages (EN/ZH/MS)
3. Verify success message translates

Expected: Toast messages display in selected language.

- [ ] **Step 3: Test form validation**

1. Submit empty form in each language
2. Verify validation errors translate

Expected: Validation messages display in selected language.

- [ ] **Step 4: Test Modal confirmations**

1. Open delete confirmation dialog
2. Switch languages
3. Verify dialog text translates

Expected: Confirmation text displays in selected language.

- [ ] **Step 5: Verify NotificationBell unchanged**

1. Open NotificationBell component
2. Check notifications are still in English

Expected: System notifications remain in English (audit requirement).

---

## Task 7: Update Documentation

**Goal:** Document Phase 4 completion.

**File to modify:** `docs/i18n-usage-guide.md`

- [ ] **Step 1: Add Phase 4 section**

Add after Phase 3 content:

```markdown
## Phase 4 Completed (June 2026)

### User Feedback Messages
Toast notifications, form validation, and confirmations translated:
- Success/error/warning messages
- Form validation rules
- Modal confirmation dialogs

**Namespaces:** 
- `useTranslation('messages')` - Toast and confirmations
- `useTranslation('validation')` - Form validation

**Not Translated (Audit Requirement):**
- NotificationBell system notifications (remain in English)
- Backend API error messages

### Usage Examples

```typescript
// Toast messages
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('messages');
message.success(t('success.save'));
message.error(t('error.save'));

// Form validation
const { t } = useTranslation('validation');
rules={[
  { required: true, message: t('required') },
  { min: 8, message: t('minLength', { min: 8 }) }
]}
```
```

- [ ] **Step 2: Update coverage summary**

```markdown
### Total Translation Coverage

**Phases 1-4:** 38 pages + feedback messages
**Languages:** English, Simplified Chinese, Bahasa Malaysia
**Translation files:** 12 namespaces × 3 languages = 36 files
```

---

## Acceptance Criteria

✅ 6 new translation JSON files created (messages + validation × 3 languages)
✅ i18n configuration updated
✅ All message.success/error/warning calls use translations
✅ Form validation rules use translations
✅ Modal confirmations use translations
✅ NotificationBell unchanged (stays English - audit requirement)
✅ Build succeeds with no errors
✅ Documentation updated

---

**End of Implementation Plan**
