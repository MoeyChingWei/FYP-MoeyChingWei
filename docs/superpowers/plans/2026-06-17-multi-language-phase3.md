# Multi-Language Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate ChatBot, Profile, and Tracking Item modules to support English, Chinese, and Malay languages (5 files total).

**Architecture:** Extract text from 5 files → Create 3 module-specific translation files (chatbot/profile/tracking) × 3 languages → Update i18n config → Replace hardcoded text with t() calls → Validate and test. Special handling: ChatBot UI translates, conversation content stays English.

**Tech Stack:** React, TypeScript, react-i18next, Ant Design

---

## File Structure

**New Translation Files:**
- `client/src/i18n/locales/en/chatbot.json` (create)
- `client/src/i18n/locales/en/profile.json` (create)
- `client/src/i18n/locales/en/tracking.json` (create)
- `client/src/i18n/locales/zh/chatbot.json` (create)
- `client/src/i18n/locales/zh/profile.json` (create)
- `client/src/i18n/locales/zh/tracking.json` (create)
- `client/src/i18n/locales/ms/chatbot.json` (create)
- `client/src/i18n/locales/ms/profile.json` (create)
- `client/src/i18n/locales/ms/tracking.json` (create)

**Modified Files:**
- `client/src/i18n/index.ts` - Register new namespaces
- `client/src/FrontEnd/pages/ChatBotPage.tsx` - Add translations
- `client/src/FrontEnd/components/ChatBot/ChatBotWidget.tsx` - Add translations
- `client/src/FrontEnd/pages/Profile.tsx` - Add translations
- `client/src/FrontEnd/pages/ProfileResetPassword.tsx` - Add translations
- `client/src/FrontEnd/pages/TrackingItemManagement.tsx` - Add translations

---

## Task 1: Extract Text and Create All Translation Files

**Goal:** Extract text from 5 files and create 9 translation JSON files (3 modules × 3 languages).

**Files to create:** All 9 translation files listed above.

- [ ] **Step 1: Extract text from 5 source files**

Scan these files and extract UI text:
- ChatBotPage.tsx
- ChatBotWidget.tsx (UI only, not AI conversation)
- Profile.tsx
- ProfileResetPassword.tsx
- TrackingItemManagement.tsx

- [ ] **Step 2: Create English translation files**

Create chatbot.json, profile.json, tracking.json in `client/src/i18n/locales/en/`

- [ ] **Step 3: Generate Chinese translations**

Create corresponding zh/ files following Phase 1-2 terminology.

- [ ] **Step 4: Generate Malay translations**

Create corresponding ms/ files.

- [ ] **Step 5: Verify JSON syntax**

Run: `cd client && npm run build`
Expected: Build succeeds with no JSON errors.

---

## Task 2: Register New Namespaces

**Goal:** Update i18n configuration to load new translation files.

**File to modify:** `client/src/i18n/index.ts`

- [ ] **Step 1: Add imports for new translation files**

```typescript
import chatbotEn from './locales/en/chatbot.json';
import chatbotZh from './locales/zh/chatbot.json';
import chatbotMs from './locales/ms/chatbot.json';
import profileEn from './locales/en/profile.json';
import profileZh from './locales/zh/profile.json';
import profileMs from './locales/ms/profile.json';
import trackingEn from './locales/en/tracking.json';
import trackingZh from './locales/zh/tracking.json';
import trackingMs from './locales/ms/tracking.json';
```

- [ ] **Step 2: Update resources object**

Add to each language section:
```typescript
const resources = {
  en: {
    // ... existing
    chatbot: chatbotEn,
    profile: profileEn,
    tracking: trackingEn,
  },
  zh: {
    // ... existing
    chatbot: chatbotZh,
    profile: profileZh,
    tracking: trackingZh,
  },
  ms: {
    // ... existing
    chatbot: chatbotMs,
    profile: profileMs,
    tracking: trackingMs,
  },
};
```

- [ ] **Step 3: Verify build**

Run: `cd client && npm run build`
Expected: Build succeeds, new namespaces loaded.

---

## Task 3: Update ChatBot Files (2 files)

**Goal:** Add translations to ChatBot UI elements only (not AI conversation).

**Files to modify:**
- `client/src/FrontEnd/pages/ChatBotPage.tsx`
- `client/src/FrontEnd/components/ChatBot/ChatBotWidget.tsx`

- [ ] **Step 1: Update both ChatBot files**

For each file:
1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('chatbot');`
3. Replace UI text with t() calls
4. **Important:** Keep AI conversation content in English (no t() calls)

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd client && npm run build`
Expected: No TypeScript errors.

---

## Task 4: Update Profile Files (2 files)

**Goal:** Add translations to Profile pages.

**Files to modify:**
- `client/src/FrontEnd/pages/Profile.tsx`
- `client/src/FrontEnd/pages/ProfileResetPassword.tsx`

- [ ] **Step 1: Update both Profile files**

For each file:
1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('profile');`
3. Replace hardcoded text with t() calls
4. Handle form validation messages

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd client && npm run build`
Expected: No TypeScript errors.

---

## Task 5: Update Tracking File (1 file)

**Goal:** Add translations to Tracking Item page.

**File to modify:**
- `client/src/FrontEnd/pages/TrackingItemManagement.tsx`

- [ ] **Step 1: Update Tracking page**

1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('tracking');`
3. Replace hardcoded text with t() calls
4. Handle table columns and status labels

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd client && npm run build`
Expected: No TypeScript errors.

---

## Task 6: Validation and Testing

**Goal:** Verify all translations work correctly.

- [ ] **Step 1: Build frontend**

Run: `cd client && npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Test ChatBot language switching**

1. Open ChatBot page
2. Switch between EN/ZH/MS
3. Verify: UI elements translate, AI responses stay English

Expected: UI translates, conversation content stays English.

- [ ] **Step 3: Test Profile language switching**

1. Open Profile page
2. Submit form with errors in each language
3. Verify validation messages translate

Expected: All form elements and messages translated.

- [ ] **Step 4: Test Tracking language switching**

1. Open Tracking page
2. Switch languages
3. Verify table headers and status labels translate

Expected: All UI elements translated.

---

## Task 7: Update Documentation

**Goal:** Document Phase 3 completion.

**File to modify:** `docs/i18n-usage-guide.md`

- [ ] **Step 1: Add Phase 3 section**

Add after Phase 2 content:

```markdown
## Phase 3 Completed Modules (June 2026)

### ChatBot Module
2 files translated (UI elements only):
- Chat interface with message history
- Floating chat widget
- **Note:** AI conversation content remains in English

**Namespace:** `useTranslation('chatbot')`

### Profile Module
2 files translated:
- User profile information
- Password reset form

**Namespace:** `useTranslation('profile')`

### Tracking Item Module
1 file translated:
- Item tracking dashboard with filters

**Namespace:** `useTranslation('tracking')`
```

- [ ] **Step 2: Update coverage summary**

Update total count:
```markdown
### Total Translation Coverage

**Phases 1-3:** 38+ pages fully translated
**Languages:** English, Simplified Chinese (简体中文), Bahasa Malaysia
**Translation files:** 12 JSON files per language (36 total)
```

---

## Acceptance Criteria

✅ 5 files fully translated (English/Chinese/Malay)
✅ 9 new translation JSON files created
✅ i18n configuration updated with 3 new namespaces
✅ ChatBot UI translates, AI conversation stays English
✅ Build succeeds with no errors
✅ Language switching works on all Phase 3 pages
✅ Documentation updated

---

**End of Implementation Plan**
