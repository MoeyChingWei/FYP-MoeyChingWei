# Multi-Language Support (i18n) Design Specification

**Project:** OptiMind Procurement System  
**Feature:** Multi-language Support with English, 简体中文, and Bahasa Malaysia  
**Date:** 2026-06-15  
**Status:** Approved

---

## Executive Summary

Implement comprehensive internationalization (i18n) for the OptiMind procurement system, allowing users to switch between English, Simplified Chinese (简体中文), and Bahasa Malaysia. The system will use react-i18next for frontend translations, integrate DeepSeek API for translation assistance, and store user language preferences in the database for cross-device synchronization.

**Key Requirements:**
- System UI translates to all three languages
- Notification system remains English-only (audit/compliance requirements)
- User language preference persists across devices
- Dynamic content translation available on-demand
- 5-phase rollout for manageable implementation

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Translation Scope](#translation-scope)
3. [Technical Stack](#technical-stack)
4. [File Structure](#file-structure)
5. [Core Components](#core-components)
6. [API Design](#api-design)
7. [Database Schema](#database-schema)
8. [Implementation Phases](#implementation-phases)
9. [Risk Mitigation](#risk-mitigation)
10. [Success Metrics](#success-metrics)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │LanguageSelector│ → │i18n Context  │ ← │ Components   │  │
│  │  (Dropdown)   │    │  Provider    │    │(useTranslation)│
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                              │                                │
│  ┌──────────────────────────┴────────────────────────────┐  │
│  │            Translation Files (JSON)                    │  │
│  │  ├─ en.json (English - Default)                       │  │
│  │  ├─ zh.json (简体中文)                                │  │
│  │  └─ ms.json (Bahasa Malaysia)                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                                │
│                              ↓                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          localStorage + API Sync                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      Backend API (Express)                    │
├─────────────────────────────────────────────────────────────┤
│  • GET  /api/users/me/language                              │
│  • PUT  /api/users/me/language                              │
│  • POST /api/translate  (DeepSeek integration)              │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│  User.preferredLanguage: enum('en', 'zh', 'ms')             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**User Changes Language:**
1. User clicks language selector dropdown
2. Frontend immediately switches UI language (localStorage)
3. If logged in, async API call saves to database
4. Dynamic content fetches translations on-demand

**User Logs In:**
1. Backend returns user's language preference
2. If exists, override localStorage
3. Load corresponding translation files
4. Render UI in user's preferred language

---

## Translation Scope

### ✅ Translated Components (System UI)

**1. Navigation and Layout**
- Sidebar menu items (Overview, Purchasing, Settings, etc.)
- Breadcrumb navigation
- Page titles and subtitles

**2. Forms and Inputs**
- Form field labels (Name, Email, Description)
- Placeholder text
- Button labels (Submit, Cancel, Save, Delete)
- Dropdown option labels

**3. Data Display**
- Table column headers (Date, Amount, Status)
- Card titles and descriptions
- Chart labels and legends

**4. System Messages**
- Success messages ("Saved successfully")
- Error messages ("Failed to load data")
- Confirmation dialogs ("Are you sure?")
- Empty state messages ("No data available")

**5. Help Text**
- Tooltips
- Instruction text
- User guide content

---

### ❌ Non-Translated Components (English Only)

**1. Notification System**
- All notifications in NotificationBell component
- System notifications
- Approval notifications
- Status update notifications

**Rationale:**
- Audit and compliance requirements (unified log language)
- Team collaboration standardization (cross-language communication)
- Legal and record traceability

**2. Logs and Audit Records**
- System logs
- Operation history
- Audit trails

**3. Technical Information**
- API error codes
- Debug information
- Developer tools

---

### 🔄 Dynamic Translation (On-Demand)

**User-Generated Content (via DeepSeek API)**
- Purchase request descriptions
- Supplier notes
- Item descriptions
- Custom field content

**Rules:**
- Translate only on user request (provide "Translate" button)
- Never auto-translate to avoid misunderstandings
- Display "Translation" label, retain original text viewing option
- Cache translations to reduce API calls

---

## Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend i18n Framework | react-i18next | ^13.x |
| i18n Core Library | i18next | ^23.x |
| Backend Translation Service | Node.js + DeepSeek API | - |
| Database | PostgreSQL + Prisma | Existing |
| Translation File Format | JSON | - |

**Why react-i18next?**
- Most mature React i18n solution
- Supports nested keys, interpolation, pluralization
- Excellent developer tools and debugging
- Lazy loading for performance
- Strong TypeScript support
- Active community and extensive documentation

---

## File Structure

### Frontend Structure

```
client/src/
├── i18n/
│   ├── index.ts                    # i18n initialization
│   ├── config.ts                   # i18n configuration
│   ├── locales/                    # Translation files
│   │   ├── en/
│   │   │   ├── common.json         # Common text (buttons, labels)
│   │   │   ├── navigation.json     # Navigation menus
│   │   │   ├── dashboard.json      # Dashboard page
│   │   │   ├── purchasing.json     # Purchasing module
│   │   │   ├── settings.json       # Settings page
│   │   │   ├── userAccess.json     # User Access module
│   │   │   ├── supplier.json       # Supplier module
│   │   │   ├── chatbot.json        # ChatBot module (UI only)
│   │   │   ├── errors.json         # Error messages
│   │   │   └── validation.json     # Form validation messages
│   │   ├── zh/                     # Simplified Chinese
│   │   │   └── [same structure]
│   │   └── ms/                     # Bahasa Malaysia
│   │       └── [same structure]
│   └── types.ts                    # TypeScript type definitions
│
├── components/
│   └── shared/
│       ├── LanguageSelector.tsx    # Language switcher component
│       ├── LanguageSelector.module.css
│       ├── TranslateButton.tsx     # Dynamic content translation button
│       └── TranslateButton.module.css
│
├── hooks/
│   └── useLanguage.ts              # Custom hook for language operations
│
└── services/
    └── languageService.ts          # API calls for language preferences
```

### Backend Structure

```
backend/
├── prisma/
│   └── schema.prisma               # Add User.preferredLanguage field
│
├── src/
│   ├── routes/
│   │   └── language.routes.ts      # Language preference API routes
│   ├── controllers/
│   │   └── language.controller.ts  # Language preference controller
│   ├── services/
│   │   ├── translation.service.ts  # DeepSeek translation service
│   │   └── language.service.ts     # Language preference business logic
│   └── middleware/
│       └── language.middleware.ts  # Language detection (optional)
│
└── scripts/
    └── generate-translations.ts    # DeepSeek batch translation script
```

---

## Core Components

### 1. LanguageSelector Component

**Location:** Top navigation bar, right side next to NotificationBell

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  OptiMind                    Breadcrumb    🔔  🌐  👤   │
└─────────────────────────────────────────────────────────┘
                                              ↑
                                        Language Selector
```

**Interaction:**
- Click globe icon 🌐 → Shows dropdown menu
- Three options:
  - 🇬🇧 English
  - 🇨🇳 简体中文
  - 🇲🇾 Bahasa Malaysia
- Currently selected language shows checkmark ✓
- Click language option → Immediately switches interface

**Component Interface:**
```typescript
interface LanguageSelectorProps {
  // No props needed - uses i18n context
}

// Usage
<LanguageSelector />
```

**Implementation Details:**
- Uses Ant Design Dropdown component
- Icon from `@ant-design/icons` (GlobalOutlined)
- Triggers i18n.changeLanguage() on selection
- Saves to localStorage immediately
- Syncs to backend if user is logged in

---

### 2. i18n Context Provider

**Purpose:** Manages global language state and provides language switching methods

**Interface:**
```typescript
interface I18nContextValue {
  currentLanguage: 'en' | 'zh' | 'ms';
  changeLanguage: (lang: 'en' | 'zh' | 'ms') => Promise<void>;
  isChangingLanguage: boolean;
}
```

**Workflow:**
```
User selects language
    ↓
changeLanguage('zh')
    ↓
1. Update i18next language
2. Save to localStorage
3. If logged in → Call API to save to database
4. Re-render interface
```

---

### 3. useTranslation Hook Usage

**Basic Usage:**
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <Button>{t('common.buttons.save')}</Button>
    </div>
  );
}
```

**With Variable Interpolation:**
```typescript
// Translation file: "welcome": "Welcome back, {{name}}!"
<p>{t('dashboard.welcome', { name: user.name })}</p>
```

**Pluralization:**
```typescript
// Translation file:
// "itemCount": "{{count}} item"
// "itemCount_plural": "{{count}} items"
<p>{t('common.itemCount', { count: items.length })}</p>
```

**Namespace Usage:**
```typescript
const { t } = useTranslation('purchasing');
// Accesses translations from purchasing.json
<h1>{t('createRequest')}</h1>
```

---

### 4. Language Persistence Logic

**Initialization Flow (App Startup):**
```
1. Check localStorage for language setting
   ├─ Exists → Use localStorage language
   └─ No setting → Use browser language (navigator.language)
        ├─ zh* → 'zh'
        ├─ ms* → 'ms'
        └─ Other → 'en' (default)

2. After user logs in
   ├─ Fetch user language preference from API
   ├─ If database has setting → Override localStorage
   └─ If database has no setting → Use localStorage, sync to database
```

**Language Switch Flow:**
```
User selects new language
    ↓
1. Immediately update UI (i18next.changeLanguage)
2. Save to localStorage
3. If logged in
   ├─ Async call PUT /api/users/me/language
   └─ Silent failure (doesn't block UI)
```

---

### 5. TranslateButton Component (Phase 5)

**Purpose:** Provides on-demand translation for dynamic content

**UI Example:**
```
┌─────────────────────────────────────────┐
│ Purchase Request #1234                  │
│ Description: Office supplies for Q2     │
│ [Translate to 简体中文]                  │
└─────────────────────────────────────────┘
        ↓ After clicking
┌─────────────────────────────────────────┐
│ Purchase Request #1234                  │
│ Original: Office supplies for Q2        │
│ 译文: 第二季度办公用品                   │
│ [Show Original]                         │
└─────────────────────────────────────────┘
```

**Component Interface:**
```typescript
interface TranslateButtonProps {
  originalText: string;
  targetLanguage: 'en' | 'zh' | 'ms';
  sourceLanguage?: string; // Auto-detect if not provided
  onTranslate?: (translatedText: string) => void;
}
```

---

## API Design

### Backend API Endpoints

#### 1. Get User Language Preference

```
GET /api/users/me/language
```

**Authorization:** Bearer token (logged-in user)

**Response:**
```json
{
  "language": "zh"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: User not found

---

#### 2. Update User Language Preference

```
PUT /api/users/me/language
```

**Authorization:** Bearer token

**Request Body:**
```json
{
  "language": "zh"
}
```

**Validation:**
- `language` must be one of: "en", "zh", "ms"

**Response:**
```json
{
  "success": true,
  "language": "zh"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid language code
- 401: Unauthorized

---

#### 3. Translate Dynamic Content (Phase 5)

```
POST /api/translate
```

**Authorization:** Bearer token

**Request Body:**
```json
{
  "text": "Office supplies for Q2",
  "targetLanguage": "zh",
  "sourceLanguage": "en"  // Optional, auto-detect if not provided
}
```

**Response:**
```json
{
  "translatedText": "第二季度办公用品",
  "detectedSourceLanguage": "en"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Unauthorized
- 429: Rate limit exceeded
- 500: Translation service error

**Rate Limiting:**
- 100 requests per user per hour
- Implement caching to reduce repeated translations

---

## Database Schema

### User Table Migration

**Add new field to User model:**

```prisma
model User {
  id                 Int      @id @default(autoincrement())
  email              String   @unique
  name               String
  // ... existing fields ...
  
  // NEW FIELD
  preferredLanguage  Language @default(en)
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

enum Language {
  en  // English
  zh  // 简体中文
  ms  // Bahasa Malaysia
}
```

**Migration Steps:**
1. Create Prisma migration: `npx prisma migrate dev --name add_user_language_preference`
2. Migration adds column with default value 'en'
3. No data backfill needed (all existing users default to English)
4. Run migration in production with zero downtime

---

## Implementation Phases

### Phase 1: Infrastructure Setup (2-3 days)

**Goal:** Establish i18n framework and translate core interface

**Tasks:**
1. Install dependencies
   ```bash
   npm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
   ```
2. Configure i18n system (client/src/i18n/)
3. Create translation file structure
4. Implement LanguageSelector component
5. Integrate into App.tsx navigation bar
6. Database schema update (add preferredLanguage field)
7. Backend API implementation (GET/PUT /api/users/me/language)
8. localStorage persistence logic

**Translation Scope:**
- ✅ Navigation menu (Overview, Purchasing, Settings)
- ✅ Common buttons (Save, Cancel, Delete, Edit, Create)
- ✅ Login page
- ✅ Dashboard page titles and cards
- ✅ Settings page basic interface

**Acceptance Criteria:**
- User can switch between three languages
- Interface updates immediately after language change
- Language preference saves to database
- Language preference syncs across devices after login

**Deliverables:**
- Working LanguageSelector component
- Complete i18n infrastructure
- Backend API endpoints functional
- Database migration applied

---

### Phase 2: Main Feature Modules (3-4 days)

**Goal:** Translate core business modules

**Translation Scope:**

**Purchasing Module:**
- Create purchase request form
- Approval workflow interface
- Purchase order list and details
- Review and approval pages
- Delivery and GRN pages

**Supplier Module:**
- Supplier fulfillment home
- Order acknowledgment interface
- Delivery management
- GRN status pages

**User Access Module:**
- User management interface
- Role and permission configuration
- User list and creation forms

**Tasks:**
1. Extract all text to translation files (common.json, purchasing.json, etc.)
2. Use DeepSeek API to generate Chinese and Malay translations
3. Review and adjust translation accuracy
4. Replace hard-coded text with t() function calls
5. Test all modules in three languages
6. Fix layout issues caused by longer text in some languages

**Deliverables:**
- Complete translation files for main modules
- All hard-coded text replaced with t() calls
- Tested and working in all three languages

---

### Phase 3: Secondary Modules and Auxiliary Features (2 days)

**Goal:** Complete secondary module translations

**Translation Scope:**
- ✅ ChatBot module (UI elements only, not conversation content)
- ✅ Tracking Item module
- ✅ Profile page
- ✅ User Guide modal

**Important Note:**
- ChatBot AI conversation content remains English (like notification system)
- Only translate ChatBot UI elements (buttons, labels, placeholders)

**Tasks:**
1. Extract text from secondary modules
2. Generate translations via DeepSeek
3. Replace hard-coded text
4. Test and verify

**Deliverables:**
- Fully translated secondary modules
- ChatBot UI translated (excluding AI responses)

---

### Phase 4: Error Messages and System Prompts (1-2 days)

**Goal:** Translate all system messages

**Translation Scope:**
- ✅ Form validation errors ("Email is required")
- ✅ API error messages ("Network error", "Server error")
- ✅ Success messages ("Saved successfully")
- ✅ Confirmation dialogs ("Are you sure?", "Unsaved changes")
- ✅ Empty state messages ("No data available")
- ✅ Loading state text ("Loading...", "Please wait")

**Tasks:**
1. Collect all error and prompt text
2. Organize into errors.json and validation.json
3. Generate translations
4. Replace hard-coded messages in code
5. Test various error scenarios

**Deliverables:**
- Complete error and validation translation files
- All system messages translatable

---

### Phase 5: Dynamic Content Translation (2-3 days)

**Goal:** Implement on-demand translation for user-generated content via DeepSeek API

**Features:**

**1. Purchase Request Description Translation**
- Add "Translate to [language]" button
- Call DeepSeek API for translation
- Display original and translated text
- Allow toggling between original and translation

**2. Supplier Notes Translation**
- Add translate button in detail views
- Cache translations to reduce API calls
- Show "Translated by AI" label

**Tasks:**
1. Backend: Integrate DeepSeek API
2. Backend: Create translation endpoint (POST /api/translate)
3. Frontend: Create TranslateButton component
4. Add translate buttons to key locations
5. Implement translation result caching
6. Handle API rate limits and errors

**Deliverables:**
- Working DeepSeek integration
- TranslateButton component
- Translation caching mechanism
- Rate limiting and error handling

---

## Translation File Examples

### common.json Structure

```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "submit": "Submit",
    "back": "Back",
    "next": "Next",
    "confirm": "Confirm",
    "close": "Close",
    "yes": "Yes",
    "no": "No"
  },
  "labels": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "address": "Address",
    "description": "Description",
    "status": "Status",
    "date": "Date",
    "amount": "Amount",
    "quantity": "Quantity",
    "price": "Price",
    "total": "Total"
  },
  "messages": {
    "success": "Operation successful",
    "error": "Operation failed",
    "loading": "Loading...",
    "noData": "No data available",
    "confirmDelete": "Are you sure you want to delete this item?",
    "unsavedChanges": "You have unsaved changes. Do you want to continue?",
    "networkError": "Network error. Please check your connection.",
    "unauthorized": "You are not authorized to perform this action."
  },
  "languages": {
    "en": "English",
    "zh": "简体中文",
    "ms": "Bahasa Malaysia"
  },
  "time": {
    "today": "Today",
    "yesterday": "Yesterday",
    "week": "Week",
    "month": "Month",
    "year": "Year"
  }
}
```

### navigation.json Structure

```json
{
  "sidebar": {
    "overview": "Overview",
    "purchasing": "Purchasing",
    "userAccess": "User Access",
    "supplierOverview": "Supplier Overview",
    "trackingItem": "Tracking Item",
    "chatbot": "AI Assistant",
    "settings": "Settings"
  },
  "breadcrumb": {
    "home": "Home",
    "back": "Back"
  }
}
```

### Naming Conventions

**Translation Key Naming Rules:**
- Use `camelCase` format
- Organize by functionality/page namespace
- Clear structure for easy lookup

**Examples:**
```typescript
// ✅ Good naming
t('dashboard.welcomeMessage')
t('purchasing.createRequest')
t('common.buttons.save')
t('errors.network.timeout')

// ❌ Bad naming
t('msg1')
t('button')
t('error')
```

---

## Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| Translation quality inaccurate | Medium | 1. DeepSeek generates initial draft<br>2. Manual review for critical modules<br>3. Collect user feedback for iterative improvement |
| Bundle size increase | Low | 1. Use i18next lazy loading<br>2. Load translation files on-demand<br>3. Compress JSON in production build |
| Performance impact | Low | 1. Cache translation files<br>2. localStorage persistence<br>3. Avoid unnecessary re-renders |
| DeepSeek API rate limiting | Medium | 1. Implement request queue<br>2. Add retry mechanism<br>3. Cache translation results |
| Database migration issues | Low | 1. Use Prisma migrations<br>2. Add default values<br>3. Ensure backward compatibility |
| Text length variations (Chinese/Malay longer than English) | Medium | 1. Design with flexible layouts<br>2. Test UI with all languages<br>3. Use text truncation where needed |
| Missing translations during development | Low | 1. Fallback to English for missing keys<br>2. Development mode shows missing translation warnings<br>3. Translation coverage script |

---

## Success Metrics

### Phase 1 Completion Criteria:
- ✅ Users can switch languages
- ✅ Core interface (navigation, Dashboard, Settings) translated
- ✅ Language preference syncs across devices
- ✅ Zero console errors related to i18n

### Full Implementation Completion Criteria:
- ✅ 90%+ of system UI supports three languages
- ✅ Notification system remains English (by design)
- ✅ Users can translate dynamic content on-demand
- ✅ Language switching has no noticeable delay (<100ms)
- ✅ Translation quality meets usability standards
- ✅ No layout breakage in any language
- ✅ All form validations work in all languages

### Performance Targets:
- Initial load time increase <200ms
- Language switch time <100ms
- Bundle size increase <150KB (gzipped)
- Translation API response time <1s (P95)

---

## Maintenance and Future Expansion

### Daily Maintenance:
- Add translations when developing new features
- Periodically review translation quality
- Collect user feedback for optimization
- Update translations based on user suggestions

### Future Expansion Possibilities:
- Support additional languages (Thai, Indonesian, Vietnamese)
- Translation management backend (non-developers can edit translations)
- A/B testing different translation approaches
- Automatic translation quality scoring
- User-submitted translation improvements

---

## Appendix

### A. Supported Language Codes

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| zh | Simplified Chinese | 简体中文 |
| ms | Malay | Bahasa Malaysia |

### B. i18next Configuration Reference

```typescript
// client/src/i18n/config.ts
export const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh', 'ms'],
  defaultNS: 'common',
  ns: [
    'common',
    'navigation',
    'dashboard',
    'purchasing',
    'settings',
    'userAccess',
    'supplier',
    'chatbot',
    'errors',
    'validation'
  ],
  interpolation: {
    escapeValue: false // React already escapes
  },
  react: {
    useSuspense: true
  }
};
```

### C. Translation File Template

```json
{
  "section": {
    "subsection": {
      "key": "Translation text",
      "keyWithVariable": "Text with {{variable}}",
      "keyPlural": "{{count}} item",
      "keyPlural_plural": "{{count}} items"
    }
  }
}
```

---

**End of Design Specification**

**Next Steps:** Proceed to implementation plan creation using superpowers:writing-plans skill.
