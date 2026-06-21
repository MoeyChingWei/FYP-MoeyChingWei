# Multi-Language i18n Phase 3 Design: Secondary Modules Translation

**Date:** 2026-06-17  
**Phase:** Phase 3 - Secondary Modules  
**Status:** Approved  
**Dependencies:** Phase 1 (i18n infrastructure) and Phase 2 (main business modules) completed

---

## Executive Summary

Phase 3 extends multi-language support to secondary user-facing modules: ChatBot, Profile, and Tracking Item. This phase will translate **5 files** using the same automated approach as Phase 2.

**Scope:**
- **ChatBot Module**: 2 files (ChatBotPage, ChatBotWidget) - UI only, not AI conversation
- **Profile Module**: 2 files (Profile, ProfileResetPassword)
- **Tracking Item Module**: 1 file (TrackingItemManagement)

**Languages:** English, Simplified Chinese (简体中文), Bahasa Malaysia

**Estimated Effort:** 1-1.5 hours (automated approach)

---

## Architecture Design

### Translation File Structure

```
client/src/i18n/locales/
├── en/
│   ├── common.json          (Phase 1)
│   ├── navigation.json      (Phase 1)
│   ├── dashboard.json       (Phase 1)
│   ├── settings.json        (Phase 1)
│   ├── purchasing.json      (Phase 2)
│   ├── supplier.json        (Phase 2)
│   ├── userAccess.json      (Phase 2)
│   ├── chatbot.json         (NEW - Phase 3)
│   ├── profile.json         (NEW - Phase 3)
│   └── tracking.json        (NEW - Phase 3)
├── zh/ (same structure)
└── ms/ (same structure)
```

### Namespace Strategy

Each module uses an independent namespace:
- **ChatBot pages**: `useTranslation('chatbot')` - UI elements only
- **Profile pages**: `useTranslation('profile')` - profile and password reset
- **Tracking page**: `useTranslation('tracking')` - item tracking
- **Cross-module shared text**: Continue using `common.json`

---

## Translation Key Structure

### ChatBot Module

```json
{
  "title": "AI Assistant",
  "widget": {
    "openChat": "Open Chat",
    "minimize": "Minimize",
    "close": "Close",
    "placeholder": "Type your message...",
    "send": "Send",
    "newChat": "New Chat",
    "clearHistory": "Clear History",
    "typing": "AI is typing..."
  },
  "page": {
    "title": "Chat Assistant",
    "subtitle": "Get help with your tasks",
    "welcomeMessage": "Hello! How can I help you today?",
    "emptyState": "No conversation yet. Start by asking a question.",
    "errorConnecting": "Unable to connect to chat service",
    "errorSending": "Failed to send message. Please try again."
  },
  "settings": {
    "title": "Chat Settings",
    "language": "Interface Language",
    "languageNote": "Note: AI responses remain in English",
    "clearHistory": "Clear Chat History",
    "confirmClear": "Are you sure you want to clear all chat history?"
  }
}
```

### Profile Module

```json
{
  "title": "My Profile",
  "subtitle": "Manage your account information",
  "form": {
    "name": "Full Name",
    "namePlaceholder": "Enter your name",
    "email": "Email Address",
    "emailPlaceholder": "your.email@company.com",
    "department": "Department",
    "departmentPlaceholder": "Select department",
    "role": "Role",
    "avatar": "Profile Picture",
    "changeAvatar": "Change Picture",
    "removeAvatar": "Remove Picture"
  },
  "password": {
    "title": "Reset Password",
    "subtitle": "Change your account password",
    "currentPassword": "Current Password",
    "currentPasswordPlaceholder": "Enter current password",
    "newPassword": "New Password",
    "newPasswordPlaceholder": "Enter new password",
    "confirmPassword": "Confirm New Password",
    "confirmPasswordPlaceholder": "Re-enter new password",
    "requirements": "Password must be at least 8 characters",
    "mustMatch": "Passwords must match"
  },
  "validation": {
    "nameRequired": "Name is required",
    "emailRequired": "Email is required",
    "emailInvalid": "Invalid email format",
    "currentPasswordRequired": "Current password is required",
    "newPasswordRequired": "New password is required",
    "passwordTooShort": "Password must be at least 8 characters",
    "passwordsMustMatch": "Passwords do not match"
  },
  "actions": {
    "save": "Save Changes",
    "cancel": "Cancel",
    "resetPassword": "Reset Password"
  },
  "messages": {
    "updateSuccess": "Profile updated successfully",
    "updateError": "Failed to update profile",
    "passwordChangeSuccess": "Password changed successfully",
    "passwordChangeError": "Failed to change password",
    "incorrectPassword": "Current password is incorrect"
  }
}
```

### Tracking Module

```json
{
  "title": "Item Tracking",
  "subtitle": "Monitor inventory and item status",
  "table": {
    "itemCode": "Item Code",
    "itemName": "Item Name",
    "category": "Category",
    "quantity": "Quantity",
    "unit": "Unit",
    "location": "Location",
    "status": "Status",
    "lastUpdated": "Last Updated",
    "actions": "Actions"
  },
  "status": {
    "inStock": "In Stock",
    "lowStock": "Low Stock",
    "outOfStock": "Out of Stock",
    "reserved": "Reserved"
  },
  "filters": {
    "search": "Search items...",
    "category": "Filter by Category",
    "status": "Filter by Status",
    "location": "Filter by Location",
    "clearFilters": "Clear Filters"
  },
  "actions": {
    "addItem": "Add Item",
    "viewDetails": "View Details",
    "updateStock": "Update Stock",
    "exportData": "Export Data",
    "refresh": "Refresh"
  },
  "emptyState": "No items to display",
  "messages": {
    "updateSuccess": "Stock updated successfully",
    "updateError": "Failed to update stock",
    "deleteSuccess": "Item deleted successfully",
    "deleteError": "Failed to delete item"
  }
}
```

---

## ChatBot Special Handling

### UI Elements (Translate)

**What to translate:**
- Button labels (Send, Clear, New Chat)
- Input placeholders
- Window title
- Settings options
- Error messages
- Empty state messages
- Loading states

**Implementation:**
```tsx
import { useTranslation } from 'react-i18next';

function ChatBotWidget() {
  const { t } = useTranslation('chatbot');
  
  return (
    <>
      <Button>{t('widget.send')}</Button>
      <Input placeholder={t('widget.placeholder')} />
      <div>{t('widget.typing')}</div>
    </>
  );
}
```

### AI Conversation Content (Do NOT Translate)

**What NOT to translate:**
- AI response messages
- User messages
- System prompts
- Chat history content

**Implementation:**
```tsx
// AI messages - display directly, no translation
<Message>
  {aiResponse}  {/* Keep in English */}
</Message>

// User messages - display as entered
<Message>
  {userMessage}  {/* User's original language */}
</Message>
```

**Rationale:**
- AI model responds in English
- Mixed-language conversations would be confusing
- Consistent with notification system (Phase 1 design)
- Translation would add latency and potential errors

---

## Implementation Flow

### Step 1: Text Extraction (15 minutes)

**Files to scan:**
1. `client/src/FrontEnd/pages/ChatBotPage.tsx`
2. `client/src/FrontEnd/components/ChatBot/ChatBotWidget.tsx`
3. `client/src/FrontEnd/pages/Profile.tsx`
4. `client/src/FrontEnd/pages/ProfileResetPassword.tsx`
5. `client/src/FrontEnd/pages/TrackingItemManagement.tsx`

**Extract:**
- UI labels and buttons
- Form fields and placeholders
- Table headers
- Status labels
- Validation messages
- Success/error messages

**Do NOT extract:**
- AI conversation content in ChatBot
- Console logs
- API endpoints
- Mock data

---

### Step 2: Create Translation Files (20 minutes)

**Create 9 new JSON files:**

**English (3 files):**
- `client/src/i18n/locales/en/chatbot.json`
- `client/src/i18n/locales/en/profile.json`
- `client/src/i18n/locales/en/tracking.json`

**Chinese (3 files):**
- `client/src/i18n/locales/zh/chatbot.json`
- `client/src/i18n/locales/zh/profile.json`
- `client/src/i18n/locales/zh/tracking.json`

**Malay (3 files):**
- `client/src/i18n/locales/ms/chatbot.json`
- `client/src/i18n/locales/ms/profile.json`
- `client/src/i18n/locales/ms/tracking.json`

**Translation Guidelines:**
- Follow Phase 1-2 terminology
- AI Assistant → AI助手 / Pembantu AI
- Profile → 个人资料 / Profil
- Tracking → 追踪 / Penjejakan
- Password → 密码 / Kata Laluan

---

### Step 3: Update i18n Configuration (5 minutes)

**Modify:** `client/src/i18n/index.ts`

```typescript
// Add imports
import chatbotEn from './locales/en/chatbot.json';
import chatbotZh from './locales/zh/chatbot.json';
import chatbotMs from './locales/ms/chatbot.json';
import profileEn from './locales/en/profile.json';
import profileZh from './locales/zh/profile.json';
import profileMs from './locales/ms/profile.json';
import trackingEn from './locales/en/tracking.json';
import trackingZh from './locales/zh/tracking.json';
import trackingMs from './locales/ms/tracking.json';

// Update resources
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

---

### Step 4: Update Component Code (30 minutes)

**For each of 5 files:**

1. Add import: `import { useTranslation } from 'react-i18next';`
2. Add hook: `const { t } = useTranslation('namespace');`
3. Replace UI text with `t()` calls
4. **ChatBot special**: Only translate UI, not conversation content

**Example - ChatBotWidget.tsx:**
```tsx
import { useTranslation } from 'react-i18next';

function ChatBotWidget() {
  const { t } = useTranslation('chatbot');
  
  return (
    <div>
      <Button onClick={handleSend}>
        {t('widget.send')}
      </Button>
      <Input 
        placeholder={t('widget.placeholder')}
        value={userInput}
        onChange={handleInput}
      />
      {/* AI response - NO translation */}
      <Message>{aiResponse}</Message>
    </div>
  );
}
```

**Example - Profile.tsx:**
```tsx
import { useTranslation } from 'react-i18next';

function Profile() {
  const { t } = useTranslation('profile');
  
  return (
    <Form>
      <Form.Item label={t('form.name')}>
        <Input placeholder={t('form.namePlaceholder')} />
      </Form.Item>
      <Button type="primary">
        {t('actions.save')}
      </Button>
    </Form>
  );
}
```

---

### Step 5: Validation & Testing (15 minutes)

**Build Check:**
```bash
cd client && npm run build
```
Expected: Build succeeds with no errors

**Language Switching Test:**
1. Open ChatBot page, switch languages
   - Check: buttons, placeholders translate
   - Check: AI messages stay in English
2. Open Profile page, switch languages
   - Check: form labels translate
   - Check: validation messages translate
3. Open Tracking page, switch languages
   - Check: table headers translate
   - Check: status labels translate

**Functional Test:**
1. Submit profile form with errors → validation messages in selected language
2. Send chat message → UI in selected language, AI response in English
3. Update item stock → success message in selected language

---

## Module Breakdown

### ChatBot Module (2 files)

**Files:**
1. `ChatBotPage.tsx` - Full page chat interface
2. `ChatBotWidget.tsx` - Floating chat widget

**Key Features:**
- Chat window with message history
- Input field with send button
- Clear history action
- Settings panel
- AI typing indicator

**Translation Scope:**
- ✅ UI elements (buttons, labels, placeholders)
- ✅ Settings options
- ✅ Error messages
- ❌ AI conversation content (stays English)
- ❌ User messages (as entered)

---

### Profile Module (2 files)

**Files:**
1. `Profile.tsx` - User profile information
2. `ProfileResetPassword.tsx` - Password change form

**Key Features:**
- Profile information form (name, email, department, role)
- Avatar upload
- Password reset form with validation
- Save/cancel actions

**Translation Scope:**
- ✅ Form labels and placeholders
- ✅ Validation messages
- ✅ Success/error messages
- ✅ Button labels

---

### Tracking Item Module (1 file)

**Files:**
1. `TrackingItemManagement.tsx` - Item tracking dashboard

**Key Features:**
- Item list with filters
- Status indicators (In Stock, Low Stock, Out of Stock)
- Add/edit/delete actions
- Export functionality

**Translation Scope:**
- ✅ Table columns
- ✅ Filter labels
- ✅ Status labels
- ✅ Action buttons
- ✅ Success/error messages

---

## Quality Assurance

### Translation Quality Control

**Terminology Consistency:**
- AI Assistant → AI助手 (not 智能助手)
- Profile → 个人资料 (not 档案)
- Password → 密码 (not 口令)
- Tracking → 追踪 (not 跟踪)
- Item → 物品 (not 项目)

**ChatBot Context:**
- Widget: compact, short labels
- Page: full interface, more descriptive
- Settings: clear distinction between UI language and AI language

**Length Checks:**
- Widget buttons: max 8 characters (Chinese)
- Form labels: max 15 characters
- Messages: flexible, can wrap

---

## Expected Deliverables

**Phase 3 Complete Criteria:**
- ✅ 5 files fully translated (English/Chinese/Malay)
- ✅ 9 new translation JSON files created (3 modules × 3 languages)
- ✅ i18n configuration updated with new namespaces
- ✅ ChatBot UI translated, conversation content stays English
- ✅ Build succeeds with no errors
- ✅ Language switching works on all pages
- ✅ Documentation updated

**Acceptance Criteria:**
- User can switch language and see UI update immediately
- ChatBot UI elements translate, AI messages stay English
- Profile forms work in all 3 languages
- Tracking page displays correctly in all languages
- No regressions in Phase 1-2 translated pages

---

## Timeline Estimate

**Total: 1-1.5 hours**

- Text extraction: ~15 minutes
- Translation file creation: ~20 minutes
- i18n config update: ~5 minutes
- Code updates (5 files): ~30 minutes
- Validation & testing: ~15 minutes
- Documentation update: ~10 minutes

---

## Next Steps

After Phase 3 completion:
- **Phase 4**: Error messages and system notifications
- **Phase 5**: Dynamic content translation (DeepSeek API integration)

---

**Document Status:** Ready for implementation  
**Approved by:** User  
**Implementation Plan:** To be created via writing-plans skill
