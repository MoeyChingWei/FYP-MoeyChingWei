# i18n Usage Guide

## For Developers

### Adding Translations to New Components

1. Add translations to JSON files:
   - `client/src/i18n/locales/en/[namespace].json`
   - `client/src/i18n/locales/zh/[namespace].json`
   - `client/src/i18n/locales/ms/[namespace].json`

2. Use in component:
   ```typescript
   import { useTranslation } from 'react-i18next';
   
   function MyComponent() {
     const { t } = useTranslation('namespace');
     return <div>{t('key')}</div>;
   }
   ```

### Translation Key Naming Conventions

- Use camelCase: `welcomeMessage`, not `welcome_message`
- Organize by feature: `dashboard.cards.pendingApprovals`
- Keep keys descriptive: `errorInvalidEmail`, not `error1`

### Variable Interpolation

```typescript
// Translation file: "welcome": "Welcome, {{name}}!"
{t('welcome', { name: user.name })}
```

### Pluralization

```typescript
// Translation file:
// "itemCount": "{{count}} item"
// "itemCount_plural": "{{count}} items"
{t('itemCount', { count: items.length })}
```

## For Users

### Changing Language

1. Click globe icon (🌐) in top-right corner
2. Select your preferred language
3. Interface updates immediately
4. Language preference saves automatically

### Supported Languages

- 🇬🇧 English
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇲🇾 Bahasa Malaysia

### Notes

- Language preference syncs across devices after login
- Notification content remains in English (audit/compliance)
- ChatBot AI responses remain in English

---

## Phase 1 Completed Modules (April 2026)

### Core System Pages
- Login page
- Navigation sidebar
- Dashboard
- Settings page

**Namespace:** `useTranslation('common')`

---

## Phase 2 Completed Modules (June 2026)

### Purchasing Module
All 14 pages fully translated:
- Purchase Request creation, review, and approval
- Purchase Order creation, review, and approval
- Delivery management
- Goods Received Note (GRN) management

**Namespace:** `useTranslation('purchasing')`

### Supplier Fulfillment Module
All 8 pages fully translated:
- Supplier overview dashboard
- Order acknowledgement
- Delivery management
- GRN status tracking

**Namespace:** `useTranslation('supplier')`

### User Access Module
All 7 pages fully translated:
- User management (list, create, edit)
- Role-based access control (RBAC)
- Role management
- Supplier type configuration

**Namespace:** `useTranslation('userAccess')`

### Usage Example

```typescript
import { useTranslation } from 'react-i18next';

function PurchaseRequestList() {
  const { t } = useTranslation('purchasing');
  
  return (
    <div>
      <h1>{t('review.title')}</h1>
      <Button>{t('review.actions.approve')}</Button>
    </div>
  );
}
```

### Translation Coverage

**Total:** 29 pages across 3 major business modules  
**Languages:** English, Simplified Chinese (简体中文), Bahasa Malaysia  
**Translation files:** 9 JSON files (3 modules × 3 languages)

---

## Phase 3 Completed Modules (June 2026)

### ChatBot Module
2 pages fully translated:
- ChatBot main page (UI elements only)
- ChatBot widget component

**Namespace:** `useTranslation('chatbot')`

**Note:** AI conversation content and user messages are NOT translated - only UI elements like buttons, labels, and placeholders are translated.

### Profile Module
2 pages fully translated:
- User profile page
- Password reset page

**Namespace:** `useTranslation('profile')`

### Tracking Module
1 page fully translated:
- Tracking item management page

**Namespace:** `useTranslation('tracking')`

### Usage Examples

```typescript
// ChatBot page - only UI elements
import { useTranslation } from 'react-i18next';

function ChatBotPage() {
  const { t } = useTranslation('chatbot');
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <Button>{t('buttons.send')}</Button>
      <Input placeholder={t('page.typePlaceholder')} />
    </div>
  );
}

// Profile page
function Profile() {
  const { t } = useTranslation('profile');
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <Button>{t('buttons.resetPassword')}</Button>
    </div>
  );
}

// Tracking page
function TrackingItemManagement() {
  const { t } = useTranslation('tracking');
  
  return (
    <div>
      <h1>{t('page.title')}</h1>
      <Empty description={t('sections.noInProgress')} />
    </div>
  );
}
```

### Phase 3 Translation Coverage

**Total:** 5 pages  
**Languages:** English, Simplified Chinese (简体中文), Bahasa Malaysia  
**Translation files:** 9 JSON files (3 namespaces × 3 languages)

### Cumulative Translation Coverage (All Phases)

**Total Pages:** 38 pages (4 core + 29 business modules + 5 additional)  
**Languages:** 3 (English, Simplified Chinese, Bahasa Malaysia)  
**Total Translation Files:** 30 JSON files (10 namespaces × 3 languages)

**Namespaces:**
- `common` - Core system pages (login, navigation, dashboard, settings)
- `navigation` - Sidebar and menu items
- `dashboard` - Dashboard widgets and cards
- `settings` - Settings page
- `purchasing` - Purchasing module (14 pages)
- `supplier` - Supplier fulfillment module (8 pages)
- `userAccess` - User access management module (7 pages)
- `chatbot` - ChatBot module (2 pages)
- `profile` - Profile module (2 pages)
- `tracking` - Tracking module (1 page)

---

## Phase 4 Completed: User Feedback Messages (June 2026)

### Overview

Phase 4 adds translation support for user feedback messages across the entire application:
- Toast notifications (success, error, warning, info)
- Form validation error messages
- Modal confirmation dialogs

**New Namespaces:**
- `messages` - Toast notifications and feedback messages
- `validation` - Form validation error messages

### Translated Message Types

#### 1. Toast Messages (`messages` namespace)

```typescript
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

function MyComponent() {
  const { t } = useTranslation('messages');
  
  // Success messages
  message.success(t('success.save'));
  message.success(t('success.update'));
  message.success(t('success.create'));
  message.success(t('success.delete'));
  message.success(t('success.upload'));
  
  // Error messages
  message.error(t('error.save'));
  message.error(t('error.networkError'));
  message.error(t('error.notSignedIn'));
  
  // Warning messages
  message.warning(t('warning.unsavedChanges'));
  message.warning(t('warning.draftNotFound'));
  
  // Info messages
  message.info(t('info.processing'));
  message.info(t('info.totalCalculated', { currency: 'MYR', total: '100.00' }));
}
```

#### 2. Form Validation (`validation` namespace)

```typescript
import { useTranslation } from 'react-i18next';
import { Form, Input } from 'antd';

function MyForm() {
  const { t } = useTranslation('validation');
  
  return (
    <Form>
      {/* Required field */}
      <Form.Item
        name="name"
        rules={[{ required: true, message: t('name.required') }]}
      >
        <Input />
      </Form.Item>
      
      {/* Email validation */}
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('email.required') },
          { type: 'email', message: t('email.invalid') }
        ]}
      >
        <Input />
      </Form.Item>
      
      {/* Password with min length */}
      <Form.Item
        name="password"
        rules={[
          { required: true, message: t('password.required') },
          { min: 6, message: t('password.minLength', { min: 6 }) }
        ]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  );
}
```

#### 3. Modal Confirmations

```typescript
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';

function MyComponent() {
  const { t } = useTranslation('messages');
  
  const handleDelete = () => {
    Modal.confirm({
      title: t('confirm.delete'),
      content: 'Are you sure?', // Can add more specific content
      okText: t('confirm.yes'),
      cancelText: t('confirm.no'),
      okType: 'danger',
      onOk: () => {
        // Delete logic
        message.success(t('success.delete'));
      }
    });
  };
}
```

### Available Translation Keys

#### Messages Namespace (`messages`)

**Success:**
- `success.save`, `success.update`, `success.create`, `success.delete`
- `success.upload`, `success.submit`, `success.approve`, `success.reject`
- `success.avatarUpdated`, `success.passwordReset`, `success.emailSent`

**Error:**
- `error.save`, `error.update`, `error.create`, `error.delete`
- `error.upload`, `error.networkError`, `error.serverError`
- `error.notSignedIn`, `error.invalidInput`, `error.operationFailed`

**Warning:**
- `warning.unsavedChanges`, `warning.noSelection`
- `warning.draftNotFound`, `warning.emptyField`

**Info:**
- `info.processing`, `info.loading`, `info.noChanges`
- `info.totalCalculated` (with variables: `{currency}`, `{total}`)

**Confirm:**
- `confirm.delete`, `confirm.approve`, `confirm.reject`, `confirm.submit`
- `confirm.title`, `confirm.yes`, `confirm.no`

#### Validation Namespace (`validation`)

**Basic:**
- `required` - Generic required field
- `requiredField` - Field-specific (with variable: `{field}`)

**Email:**
- `email.required`, `email.invalid`, `email.format`

**Password:**
- `password.required`, `password.minLength` (variable: `{min}`)
- `password.match`, `password.weak`, `password.confirmRequired`

**String:**
- `string.minLength` (variable: `{min}`)
- `string.maxLength` (variable: `{max}`)
- `string.pattern`, `string.empty`

**Number:**
- `number.required`, `number.min`, `number.max`
- `number.positive`, `number.integer`

**Others:**
- `name.required`, `role.required`, `department.required`
- `date.required`, `date.invalid`, `file.required`
- `select.required`, `phone.required`, `url.invalid`

### Best Practices

1. **Multiple Translation Hooks:**
   ```typescript
   // Use multiple hooks when needed
   const { t } = useTranslation('purchasing'); // Page-specific
   const { t: tMsg } = useTranslation('messages'); // Toast messages
   const { t: tVal } = useTranslation('validation'); // Form validation
   ```

2. **Consistent Naming:**
   - Use semantic keys: `success.save` not `savedSuccessfully`
   - Keep keys short and descriptive

3. **Variable Interpolation:**
   ```typescript
   // Pass variables as second parameter
   t('info.totalCalculated', { currency: 'MYR', total: '100.00' })
   t('validation.password.minLength', { min: 6 })
   ```

4. **Fallback for Backend Errors:**
   ```typescript
   // Keep backend error messages if available
   message.error(res.data?.message ?? tMsg('error.operationFailed'));
   ```

### What's NOT Translated (Compliance)

Per Phase 1 design, the following remain in English for audit and compliance:
- **NotificationBell** system notifications
- **Backend API** error messages (but can be shown with client-side fallback)
- **System audit logs**
- **Database records**

### Phase 4 Translation Coverage

**Updated Files:** 41+ component files  
**New Namespaces:** 2 (`messages`, `validation`)  
**New Translation Files:** 6 JSON files (2 namespaces × 3 languages)

### Cumulative Translation Coverage (All Phases)

**Total Pages:** 38 pages  
**Total Namespaces:** 12  
**Total Translation Files:** 36 JSON files (12 namespaces × 3 languages)  
**Languages:** 3 (English, Simplified Chinese, Bahasa Malaysia)

**Complete Namespace List:**
- `common` - Core system pages
- `navigation` - Sidebar and menu items
- `dashboard` - Dashboard widgets
- `settings` - Settings page
- `purchasing` - Purchasing module (14 pages)
- `supplier` - Supplier fulfillment module (8 pages)
- `userAccess` - User access management (7 pages)
- `chatbot` - ChatBot module (2 pages)
- `profile` - Profile module (2 pages)
- `tracking` - Tracking module (1 page)
- **`messages`** - Toast notifications (Phase 4)
- **`validation`** - Form validation errors (Phase 4)

