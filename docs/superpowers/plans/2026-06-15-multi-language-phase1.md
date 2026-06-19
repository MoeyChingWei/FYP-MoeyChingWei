# Multi-Language i18n Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish i18n framework, implement LanguageSelector component, and translate core interface (navigation, login, dashboard, settings).

**Architecture:** React frontend uses react-i18next for translations with JSON files per language. Backend adds preferredLanguage field to User model and provides GET/PUT API endpoints. localStorage caches language choice with database sync for logged-in users.

**Tech Stack:** react-i18next ^13.x, i18next ^23.x, Ant Design Dropdown, PostgreSQL + Prisma, Express API

---

## Phase 1 Scope

This plan implements Phase 1 from the design spec:
- i18n infrastructure setup
- LanguageSelector component in top navigation
- Translation files for 3 languages (en/zh/ms)
- Database schema update (User.preferredLanguage)
- Backend API (GET/PUT /api/users/me/language)
- Core interface translations (navigation, login, dashboard, settings)

---

## File Structure Overview

### Frontend Files

**New files to create:**
```
client/src/i18n/
├── index.ts                      # i18n initialization
├── config.ts                     # i18n configuration
└── locales/
    ├── en/
    │   ├── common.json
    │   ├── navigation.json
    │   ├── dashboard.json
    │   └── settings.json
    ├── zh/
    │   └── [same structure]
    └── ms/
        └── [same structure]

client/src/components/shared/
├── LanguageSelector.tsx
└── LanguageSelector.module.css

client/src/hooks/
└── useLanguage.ts

client/src/services/
└── languageService.ts
```

**Files to modify:**
```
client/src/FrontEnd/App.tsx       # Add I18nextProvider, integrate LanguageSelector
client/src/index.tsx              # Initialize i18n before rendering
client/src/FrontEnd/pages/Login.tsx           # Replace hard-coded text with t()
client/src/FrontEnd/pages/DashboardNew.tsx    # Replace hard-coded text with t()
client/src/FrontEnd/pages/settings/SettingsHome.tsx  # Replace hard-coded text with t()
```

### Backend Files

**New files to create:**
```
backend/src/routes/language.routes.ts
backend/src/controllers/language.controller.ts
backend/src/services/language.service.ts
```

**Files to modify:**
```
backend/prisma/schema.prisma      # Add User.preferredLanguage field
backend/src/server.ts             # Register language routes
```

---

## Task 1: Install Dependencies and Configure i18n

**Files:**
- Create: `client/src/i18n/config.ts`
- Create: `client/src/i18n/index.ts`
- Modify: `client/package.json`

- [ ] **Step 1: Install i18n dependencies**

```bash
cd client
npm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
```

Expected: Dependencies added to package.json

- [ ] **Step 2: Create i18n config file**

Create `client/src/i18n/config.ts`:

```typescript
export const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh', 'ms'],
  defaultNS: 'common',
  ns: ['common', 'navigation', 'dashboard', 'settings'],
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false, // Disable to avoid loading flicker
  },
};

export type SupportedLanguage = 'en' | 'zh' | 'ms';
```

- [ ] **Step 3: Create i18n initialization file**

Create `client/src/i18n/index.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nConfig } from './config';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';

import zhCommon from './locales/zh/common.json';
import zhNavigation from './locales/zh/navigation.json';
import zhDashboard from './locales/zh/dashboard.json';
import zhSettings from './locales/zh/settings.json';

import msCommon from './locales/ms/common.json';
import msNavigation from './locales/ms/navigation.json';
import msDashboard from './locales/ms/dashboard.json';
import msSettings from './locales/ms/settings.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    settings: enSettings,
  },
  zh: {
    common: zhCommon,
    navigation: zhNavigation,
    dashboard: zhDashboard,
    settings: zhSettings,
  },
  ms: {
    common: msCommon,
    navigation: msNavigation,
    dashboard: msDashboard,
    settings: msSettings,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    resources,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

- [ ] **Step 4: Verify build compiles**

Run: `cd client && npm run build`
Expected: Build succeeds (will fail until translation files are created in next task)

---

## Task 2: Create English Translation Files (Base Language)

**Files:**
- Create: `client/src/i18n/locales/en/common.json`
- Create: `client/src/i18n/locales/en/navigation.json`
- Create: `client/src/i18n/locales/en/dashboard.json`
- Create: `client/src/i18n/locales/en/settings.json`

- [ ] **Step 1: Create common.json with base translations**

Create `client/src/i18n/locales/en/common.json`:

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
    "amount": "Amount"
  },
  "messages": {
    "success": "Operation successful",
    "error": "Operation failed",
    "loading": "Loading...",
    "noData": "No data available",
    "confirmDelete": "Are you sure you want to delete?",
    "unsavedChanges": "You have unsaved changes. Continue?"
  },
  "languages": {
    "en": "English",
    "zh": "简体中文",
    "ms": "Bahasa Malaysia"
  }
}
```

- [ ] **Step 2: Create navigation.json**

Create `client/src/i18n/locales/en/navigation.json`:

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

- [ ] **Step 3: Create dashboard.json**

Create `client/src/i18n/locales/en/dashboard.json`:

```json
{
  "title": "Dashboard Overview",
  "welcome": "Welcome back, {{name}}!",
  "cards": {
    "pendingApprovals": "Pending Approvals",
    "purchaseRequests": "Purchase Requests",
    "purchaseOrders": "Purchase Orders",
    "monthlySpending": "Monthly Spending"
  },
  "charts": {
    "purchasingTrend": "Purchasing Trend",
    "spendingByCategory": "Spending by Category"
  },
  "quickActions": "Quick Actions",
  "recentActivity": "Recent Activity",
  "userGuide": "User Guide"
}
```

- [ ] **Step 4: Create settings.json**

Create `client/src/i18n/locales/en/settings.json`:

```json
{
  "title": "Settings",
  "sections": {
    "companyAddress": "Company Address",
    "feedback": "Feedback",
    "aiAssistant": "AI Assistant"
  },
  "description": "Manage your system preferences and configurations"
}
```

- [ ] **Step 5: Verify JSON syntax**

Run: `cd client && npm run build`
Expected: Build succeeds (translation files are valid JSON)

---

## Task 3: Generate Chinese and Malay Translations

**Files:**
- Create: `client/src/i18n/locales/zh/common.json`
- Create: `client/src/i18n/locales/zh/navigation.json`
- Create: `client/src/i18n/locales/zh/dashboard.json`
- Create: `client/src/i18n/locales/zh/settings.json`
- Create: `client/src/i18n/locales/ms/common.json`
- Create: `client/src/i18n/locales/ms/navigation.json`
- Create: `client/src/i18n/locales/ms/dashboard.json`
- Create: `client/src/i18n/locales/ms/settings.json`

- [ ] **Step 1: Create Chinese translation - common.json**

Create `client/src/i18n/locales/zh/common.json`:

```json
{
  "buttons": {
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑",
    "create": "创建",
    "submit": "提交",
    "back": "返回",
    "next": "下一步",
    "confirm": "确认",
    "close": "关闭",
    "yes": "是",
    "no": "否"
  },
  "labels": {
    "name": "名称",
    "email": "电子邮件",
    "phone": "电话",
    "address": "地址",
    "description": "描述",
    "status": "状态",
    "date": "日期",
    "amount": "金额"
  },
  "messages": {
    "success": "操作成功",
    "error": "操作失败",
    "loading": "加载中...",
    "noData": "暂无数据",
    "confirmDelete": "确定要删除吗？",
    "unsavedChanges": "您有未保存的更改。是否继续？"
  },
  "languages": {
    "en": "English",
    "zh": "简体中文",
    "ms": "Bahasa Malaysia"
  }
}
```

- [ ] **Step 2: Create Chinese translation - navigation.json**

Create `client/src/i18n/locales/zh/navigation.json`:

```json
{
  "sidebar": {
    "overview": "概览",
    "purchasing": "采购管理",
    "userAccess": "用户权限",
    "supplierOverview": "供应商概览",
    "trackingItem": "物品跟踪",
    "chatbot": "AI助手",
    "settings": "设置"
  },
  "breadcrumb": {
    "home": "首页",
    "back": "返回"
  }
}
```

- [ ] **Step 3: Create Chinese translation - dashboard.json**

Create `client/src/i18n/locales/zh/dashboard.json`:

```json
{
  "title": "仪表板概览",
  "welcome": "欢迎回来，{{name}}！",
  "cards": {
    "pendingApprovals": "待审批",
    "purchaseRequests": "采购申请",
    "purchaseOrders": "采购订单",
    "monthlySpending": "月度支出"
  },
  "charts": {
    "purchasingTrend": "采购趋势",
    "spendingByCategory": "分类支出"
  },
  "quickActions": "快捷操作",
  "recentActivity": "最近活动",
  "userGuide": "用户指南"
}
```

- [ ] **Step 4: Create Chinese translation - settings.json**

Create `client/src/i18n/locales/zh/settings.json`:

```json
{
  "title": "设置",
  "sections": {
    "companyAddress": "公司地址",
    "feedback": "反馈",
    "aiAssistant": "AI助手"
  },
  "description": "管理您的系统偏好和配置"
}
```

- [ ] **Step 5: Create Malay translation - common.json**

Create `client/src/i18n/locales/ms/common.json`:

```json
{
  "buttons": {
    "save": "Simpan",
    "cancel": "Batal",
    "delete": "Padam",
    "edit": "Edit",
    "create": "Cipta",
    "submit": "Hantar",
    "back": "Kembali",
    "next": "Seterusnya",
    "confirm": "Sahkan",
    "close": "Tutup",
    "yes": "Ya",
    "no": "Tidak"
  },
  "labels": {
    "name": "Nama",
    "email": "E-mel",
    "phone": "Telefon",
    "address": "Alamat",
    "description": "Penerangan",
    "status": "Status",
    "date": "Tarikh",
    "amount": "Jumlah"
  },
  "messages": {
    "success": "Operasi berjaya",
    "error": "Operasi gagal",
    "loading": "Memuatkan...",
    "noData": "Tiada data tersedia",
    "confirmDelete": "Adakah anda pasti mahu memadamkan?",
    "unsavedChanges": "Anda mempunyai perubahan yang belum disimpan. Teruskan?"
  },
  "languages": {
    "en": "English",
    "zh": "简体中文",
    "ms": "Bahasa Malaysia"
  }
}
```

- [ ] **Step 6: Create Malay translation - navigation.json**

Create `client/src/i18n/locales/ms/navigation.json`:

```json
{
  "sidebar": {
    "overview": "Gambaran Keseluruhan",
    "purchasing": "Pembelian",
    "userAccess": "Akses Pengguna",
    "supplierOverview": "Gambaran Pembekal",
    "trackingItem": "Penjejakan Item",
    "chatbot": "Pembantu AI",
    "settings": "Tetapan"
  },
  "breadcrumb": {
    "home": "Laman Utama",
    "back": "Kembali"
  }
}
```

- [ ] **Step 7: Create Malay translation - dashboard.json**

Create `client/src/i18n/locales/ms/dashboard.json`:

```json
{
  "title": "Gambaran Keseluruhan Dashboard",
  "welcome": "Selamat kembali, {{name}}!",
  "cards": {
    "pendingApprovals": "Kelulusan Tertangguh",
    "purchaseRequests": "Permintaan Pembelian",
    "purchaseOrders": "Pesanan Pembelian",
    "monthlySpending": "Perbelanjaan Bulanan"
  },
  "charts": {
    "purchasingTrend": "Trend Pembelian",
    "spendingByCategory": "Perbelanjaan Mengikut Kategori"
  },
  "quickActions": "Tindakan Pantas",
  "recentActivity": "Aktiviti Terkini",
  "userGuide": "Panduan Pengguna"
}
```

- [ ] **Step 8: Create Malay translation - settings.json**

Create `client/src/i18n/locales/ms/settings.json`:

```json
{
  "title": "Tetapan",
  "sections": {
    "companyAddress": "Alamat Syarikat",
    "feedback": "Maklum Balas",
    "aiAssistant": "Pembantu AI"
  },
  "description": "Urus keutamaan dan konfigurasi sistem anda"
}
```

- [ ] **Step 9: Verify all translations build successfully**

Run: `cd client && npm run build`
Expected: Build succeeds with no errors

---

## Task 4: Create LanguageSelector Component

**Files:**
- Create: `client/src/FrontEnd/components/shared/LanguageSelector.tsx`
- Create: `client/src/FrontEnd/components/shared/LanguageSelector.module.css`

- [ ] **Step 1: Create LanguageSelector component**

Create `client/src/FrontEnd/components/shared/LanguageSelector.tsx`:

```typescript
import React from 'react';
import { Dropdown, Menu } from 'antd';
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '../../i18n/config';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector(): React.ReactElement {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = i18n.language as SupportedLanguage;

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    
    // If user is logged in, sync to backend
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await fetch('/api/users/me/language', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ language: lang }),
        });
      } catch (error) {
        // Silent failure - user still sees language change
        console.error('Failed to sync language preference:', error);
      }
    }
  };

  const menu = (
    <Menu
      selectedKeys={[currentLanguage]}
      onClick={({ key }) => handleLanguageChange(key as SupportedLanguage)}
    >
      <Menu.Item key="en" icon={currentLanguage === 'en' ? <CheckOutlined /> : null}>
        🇬🇧 {t('languages.en')}
      </Menu.Item>
      <Menu.Item key="zh" icon={currentLanguage === 'zh' ? <CheckOutlined /> : null}>
        🇨🇳 {t('languages.zh')}
      </Menu.Item>
      <Menu.Item key="ms" icon={currentLanguage === 'ms' ? <CheckOutlined /> : null}>
        🇲🇾 {t('languages.ms')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
      <button className={styles.languageButton} aria-label="Select language">
        <GlobalOutlined className={styles.icon} />
      </button>
    </Dropdown>
  );
}
```

- [ ] **Step 2: Create LanguageSelector styles**

Create `client/src/FrontEnd/components/shared/LanguageSelector.module.css`:

```css
.languageButton {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.languageButton:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.languageButton:focus {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}

.icon {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
}
```

- [ ] **Step 3: Verify component compiles**

Run: `cd client && npm run build`
Expected: Build succeeds

---

## Task 5: Integrate i18n into App

**Files:**
- Modify: `client/src/index.tsx`
- Modify: `client/src/FrontEnd/App.tsx`

- [ ] **Step 1: Initialize i18n in index.tsx**

Modify `client/src/index.tsx` to import i18n before rendering:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './FrontEnd/App';
import './i18n'; // Initialize i18n before rendering

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 2: Add LanguageSelector to App.tsx navigation**

Find the line in `client/src/FrontEnd/App.tsx` where NotificationBell is rendered (around line 385):

```typescript
// BEFORE:
<NotificationBell />

// AFTER:
<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
  <NotificationBell />
  <LanguageSelector />
</div>
```

Add import at top of file:

```typescript
import LanguageSelector from './components/shared/LanguageSelector';
```

- [ ] **Step 3: Test language switching in browser**

Run: `cd client && npm start`
1. Navigate to `http://localhost:3000`
2. Click globe icon in top right
3. Select different languages
4. Verify dropdown shows checkmark on current language

Expected: Language selector appears and dropdown works

- [ ] **Step 4: Commit**

```bash
git add client/src/i18n client/src/FrontEnd/components/shared/LanguageSelector.* client/src/index.tsx client/src/FrontEnd/App.tsx
git commit -m "feat(i18n): add language selector and i18n infrastructure

- Install react-i18next dependencies
- Create translation files for en/zh/ms
- Implement LanguageSelector component
- Integrate into top navigation bar"
```

---

## Task 6: Update Database Schema

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: Add Language enum to schema**

Add to `backend/prisma/schema.prisma` after existing enums:

```prisma
enum Language {
  en  // English
  zh  // 简体中文 (Simplified Chinese)
  ms  // Bahasa Malaysia
}
```

- [ ] **Step 2: Add preferredLanguage field to User model**

Find the User model in `backend/prisma/schema.prisma` and add the field:

```prisma
model User {
  id                 Int       @id @default(autoincrement())
  email              String    @unique
  name               String
  // ... existing fields ...
  
  // NEW FIELD
  preferredLanguage  Language  @default(en)
  
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

- [ ] **Step 3: Generate Prisma client**

Run: `cd backend && npm run prisma:generate`
Expected: Prisma client regenerated with new Language enum and preferredLanguage field

- [ ] **Step 4: Create migration**

Run: `cd backend && npx prisma migrate dev --name add_user_language_preference`
Expected: Migration created and applied to database

- [ ] **Step 5: Verify migration in database**

Run: `cd backend && npm run prisma:studio`
1. Open User table
2. Verify preferredLanguage column exists with default value 'en'

Expected: Column exists with enum type

- [ ] **Step 6: Commit**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations
git commit -m "feat(db): add user language preference field

- Add Language enum (en, zh, ms)
- Add preferredLanguage field to User model
- Create and apply database migration"
```

---

## Task 7: Create Backend Language Service

**Files:**
- Create: `backend/src/services/language.service.ts`

- [ ] **Step 1: Create language service**

Create `backend/src/services/language.service.ts`:

```typescript
import { PrismaClient, Language } from '@prisma/client';

const prisma = new PrismaClient();

export class LanguageService {
  /**
   * Get user's preferred language
   */
  async getUserLanguage(userId: number): Promise<Language> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferredLanguage: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.preferredLanguage;
  }

  /**
   * Update user's preferred language
   */
  async updateUserLanguage(userId: number, language: Language): Promise<Language> {
    const validLanguages: Language[] = ['en', 'zh', 'ms'];
    
    if (!validLanguages.includes(language)) {
      throw new Error(`Invalid language: ${language}. Must be one of: ${validLanguages.join(', ')}`);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferredLanguage: language },
      select: { preferredLanguage: true },
    });

    return user.preferredLanguage;
  }
}

export const languageService = new LanguageService();
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd backend && npm run build`
Expected: Build succeeds

---

## Task 8: Create Backend Language Controller

**Files:**
- Create: `backend/src/controllers/language.controller.ts`

- [ ] **Step 1: Create language controller**

Create `backend/src/controllers/language.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { languageService } from '../services/language.service';
import { Language } from '@prisma/client';

export class LanguageController {
  /**
   * GET /api/users/me/language
   * Get current user's language preference
   */
  async getUserLanguage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const language = await languageService.getUserLanguage(userId);
      
      res.status(200).json({ language });
    } catch (error) {
      console.error('Error getting user language:', error);
      
      if (error instanceof Error && error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * PUT /api/users/me/language
   * Update current user's language preference
   */
  async updateUserLanguage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { language } = req.body;
      
      if (!language) {
        res.status(400).json({ error: 'Language is required' });
        return;
      }

      const updatedLanguage = await languageService.updateUserLanguage(userId, language as Language);
      
      res.status(200).json({ 
        success: true, 
        language: updatedLanguage 
      });
    } catch (error) {
      console.error('Error updating user language:', error);
      
      if (error instanceof Error && error.message.startsWith('Invalid language')) {
        res.status(400).json({ error: error.message });
        return;
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const languageController = new LanguageController();
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd backend && npm run build`
Expected: Build succeeds

---

## Task 9: Create Backend Language Routes

**Files:**
- Create: `backend/src/routes/language.routes.ts`
- Modify: `backend/src/server.ts`

- [ ] **Step 1: Create language routes**

Create `backend/src/routes/language.routes.ts`:

```typescript
import { Router } from 'express';
import { languageController } from '../controllers/language.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All language routes require authentication
router.use(authenticateToken);

// GET /api/users/me/language
router.get('/users/me/language', (req, res) => {
  languageController.getUserLanguage(req, res);
});

// PUT /api/users/me/language
router.put('/users/me/language', (req, res) => {
  languageController.updateUserLanguage(req, res);
});

export default router;
```

- [ ] **Step 2: Register routes in server.ts**

Modify `backend/src/server.ts` to add language routes. Find where other routes are registered and add:

```typescript
// Add import at top
import languageRoutes from './routes/language.routes';

// Register routes (add with other route registrations)
app.use('/api', languageRoutes);
```

- [ ] **Step 3: Test API endpoints with curl**

Start backend: `cd backend && npm run dev`

Test GET endpoint:
```bash
curl -X GET http://localhost:4000/api/users/me/language \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: `{"language":"en"}`

Test PUT endpoint:
```bash
curl -X PUT http://localhost:4000/api/users/me/language \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"language":"zh"}'
```

Expected: `{"success":true,"language":"zh"}`

- [ ] **Step 4: Commit**

```bash
git add backend/src/services/language.service.ts backend/src/controllers/language.controller.ts backend/src/routes/language.routes.ts backend/src/server.ts
git commit -m "feat(api): add language preference endpoints

- Create LanguageService for database operations
- Create LanguageController for request handling
- Add GET/PUT /api/users/me/language routes
- Integrate with existing auth middleware"
```

---

## Task 10: Translate Login Page

**Files:**
- Modify: `client/src/FrontEnd/pages/Login.tsx`

- [ ] **Step 1: Add useTranslation hook to Login component**

At the top of the Login component function, add:

```typescript
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const { t } = useTranslation('common');
  // ... rest of component
```

- [ ] **Step 2: Add login translations to common.json**

Add to `client/src/i18n/locales/en/common.json`:

```json
{
  "login": {
    "title": "Sign In",
    "emailLabel": "Email Address",
    "emailPlaceholder": "Enter your email",
    "passwordLabel": "Password",
    "passwordPlaceholder": "Enter your password",
    "submitButton": "Sign In",
    "forgotPassword": "Forgot Password?",
    "rememberMe": "Remember me",
    "errorInvalidCredentials": "Invalid email or password",
    "errorNetworkError": "Network error. Please try again."
  }
}
```

Add to `client/src/i18n/locales/zh/common.json`:

```json
{
  "login": {
    "title": "登录",
    "emailLabel": "电子邮件地址",
    "emailPlaceholder": "请输入您的邮箱",
    "passwordLabel": "密码",
    "passwordPlaceholder": "请输入您的密码",
    "submitButton": "登录",
    "forgotPassword": "忘记密码？",
    "rememberMe": "记住我",
    "errorInvalidCredentials": "邮箱或密码错误",
    "errorNetworkError": "网络错误。请重试。"
  }
}
```

Add to `client/src/i18n/locales/ms/common.json`:

```json
{
  "login": {
    "title": "Log Masuk",
    "emailLabel": "Alamat E-mel",
    "emailPlaceholder": "Masukkan e-mel anda",
    "passwordLabel": "Kata Laluan",
    "passwordPlaceholder": "Masukkan kata laluan anda",
    "submitButton": "Log Masuk",
    "forgotPassword": "Lupa Kata Laluan?",
    "rememberMe": "Ingat saya",
    "errorInvalidCredentials": "E-mel atau kata laluan tidak sah",
    "errorNetworkError": "Ralat rangkaian. Sila cuba lagi."
  }
}
```

- [ ] **Step 3: Replace hard-coded text in Login.tsx**

Replace text in the Login component:

```typescript
// BEFORE:
<h1>Sign In</h1>
<Form.Item label="Email Address">
<Input placeholder="Enter your email" />
</Form.Item>
<Button type="primary">Sign In</Button>

// AFTER:
<h1>{t('login.title')}</h1>
<Form.Item label={t('login.emailLabel')}>
<Input placeholder={t('login.emailPlaceholder')} />
</Form.Item>
<Button type="primary">{t('login.submitButton')}</Button>
```

Apply this pattern to all text in the Login component.

- [ ] **Step 4: Test login page in all languages**

Run: `npm start`
1. Visit login page
2. Switch language using selector
3. Verify all text updates correctly

Expected: Login page text changes to selected language

- [ ] **Step 5: Commit**

```bash
git add client/src/FrontEnd/pages/Login.tsx client/src/i18n/locales/*/common.json
git commit -m "feat(i18n): translate login page

- Add login translations for en/zh/ms
- Replace hard-coded text with t() calls
- Test login page in all three languages"
```

---

## Task 11: Translate Navigation Sidebar

**Files:**
- Modify: `client/src/FrontEnd/App.tsx`

- [ ] **Step 1: Add useTranslation to App component**

In `client/src/FrontEnd/App.tsx`, add to MainLayout function:

```typescript
function MainLayout(): React.ReactElement {
  const { t } = useTranslation('navigation');
  // ... rest of component
```

- [ ] **Step 2: Replace sidebar menu text**

Find the sidebar Menu component and update menu items:

```typescript
// BEFORE:
<Menu.Item key="overview" icon={<DashboardOutlined />}>
  Overview
</Menu.Item>

// AFTER:
<Menu.Item key="overview" icon={<DashboardOutlined />}>
  {t('sidebar.overview')}
</Menu.Item>
```

Apply to all menu items:
- `t('sidebar.overview')`
- `t('sidebar.purchasing')`
- `t('sidebar.userAccess')`
- `t('sidebar.supplierOverview')`
- `t('sidebar.trackingItem')`
- `t('sidebar.chatbot')`
- `t('sidebar.settings')`

- [ ] **Step 3: Test sidebar in all languages**

Run: `npm start`
1. Login and navigate to main app
2. Switch languages
3. Verify sidebar menu updates

Expected: Sidebar text changes correctly

- [ ] **Step 4: Commit**

```bash
git add client/src/FrontEnd/App.tsx
git commit -m "feat(i18n): translate navigation sidebar

- Replace sidebar menu text with t() calls
- Use navigation namespace for sidebar translations"
```

---

## Task 12: Translate Dashboard Page

**Files:**
- Modify: `client/src/FrontEnd/pages/DashboardNew.tsx`

- [ ] **Step 1: Add useTranslation to Dashboard component**

```typescript
import { useTranslation } from 'react-i18next';

function DashboardNew() {
  const { t } = useTranslation('dashboard');
  // ... rest of component
```

- [ ] **Step 2: Replace dashboard title and welcome message**

```typescript
// BEFORE:
<Typography.Title level={2}>Dashboard Overview</Typography.Title>
<p>Welcome back, {userName}!</p>

// AFTER:
<Typography.Title level={2}>{t('title')}</Typography.Title>
<p>{t('welcome', { name: userName })}</p>
```

- [ ] **Step 3: Replace card titles**

```typescript
// BEFORE:
<StatCard title="Pending Approvals" value={0} />
<StatCard title="Purchase Requests" value={29} />

// AFTER:
<StatCard title={t('cards.pendingApprovals')} value={0} />
<StatCard title={t('cards.purchaseRequests')} value={29} />
<StatCard title={t('cards.purchaseOrders')} value={14} />
<StatCard title={t('cards.monthlySpending')} value={spending} />
```

- [ ] **Step 4: Replace chart titles**

```typescript
// BEFORE:
<h3>Purchasing Trend</h3>
<h3>Spending by Category</h3>

// AFTER:
<h3>{t('charts.purchasingTrend')}</h3>
<h3>{t('charts.spendingByCategory')}</h3>
```

- [ ] **Step 5: Replace section titles**

```typescript
// BEFORE:
<h3>Quick Actions</h3>
<h3>Recent Activity</h3>

// AFTER:
<h3>{t('quickActions')}</h3>
<h3>{t('recentActivity')}</h3>
```

- [ ] **Step 6: Test dashboard in all languages**

Run: `npm start`
1. Login and view dashboard
2. Switch languages
3. Verify all text updates, including interpolated welcome message

Expected: Dashboard fully translated

- [ ] **Step 7: Commit**

```bash
git add client/src/FrontEnd/pages/DashboardNew.tsx
git commit -m "feat(i18n): translate dashboard page

- Replace all dashboard text with t() calls
- Use variable interpolation for welcome message
- Test in all three languages"
```

---

## Task 13: Translate Settings Page

**Files:**
- Modify: `client/src/FrontEnd/pages/settings/SettingsHome.tsx`

- [ ] **Step 1: Add useTranslation to Settings component**

```typescript
import { useTranslation } from 'react-i18next';

function SettingsHome() {
  const { t } = useTranslation('settings');
  // ... rest of component
```

- [ ] **Step 2: Replace settings title and description**

```typescript
// BEFORE:
<Typography.Title level={2}>Settings</Typography.Title>
<p>Manage your system preferences and configurations</p>

// AFTER:
<Typography.Title level={2}>{t('title')}</Typography.Title>
<p>{t('description')}</p>
```

- [ ] **Step 3: Replace settings section titles**

```typescript
// BEFORE:
<Card title="Company Address">
<Card title="Feedback">
<Card title="AI Assistant">

// AFTER:
<Card title={t('sections.companyAddress')}>
<Card title={t('sections.feedback')}>
<Card title={t('sections.aiAssistant')}>
```

- [ ] **Step 4: Test settings page in all languages**

Run: `npm start`
1. Navigate to Settings
2. Switch languages
3. Verify all section titles update

Expected: Settings page fully translated

- [ ] **Step 5: Commit**

```bash
git add client/src/FrontEnd/pages/settings/SettingsHome.tsx
git commit -m "feat(i18n): translate settings page

- Replace settings text with t() calls
- Translate section titles for all cards"
```

---

## Task 14: Implement Language Sync on Login

**Files:**
- Create: `client/src/FrontEnd/services/languageService.ts`
- Modify: `client/src/FrontEnd/pages/Login.tsx` (or auth service)

- [ ] **Step 1: Create language service**

Create `client/src/FrontEnd/services/languageService.ts`:

```typescript
import type { SupportedLanguage } from '../i18n/config';

export class LanguageService {
  private static API_BASE = '/api';

  /**
   * Fetch user's language preference from backend
   */
  static async getUserLanguage(token: string): Promise<SupportedLanguage> {
    const response = await fetch(`${this.API_BASE}/users/me/language`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch language preference');
    }

    const data = await response.json();
    return data.language;
  }

  /**
   * Update user's language preference on backend
   */
  static async updateUserLanguage(token: string, language: SupportedLanguage): Promise<void> {
    const response = await fetch(`${this.API_BASE}/users/me/language`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      throw new Error('Failed to update language preference');
    }
  }
}
```

- [ ] **Step 2: Sync language on successful login**

In the login success handler (after user logs in), add:

```typescript
// After successful login and getting auth token
const token = response.token; // or however you get the token
localStorage.setItem('authToken', token);

// Sync language preference
try {
  const userLanguage = await LanguageService.getUserLanguage(token);
  await i18n.changeLanguage(userLanguage);
  localStorage.setItem('i18nextLng', userLanguage);
} catch (error) {
  console.error('Failed to sync language on login:', error);
  // Continue with default language
}
```

- [ ] **Step 3: Test language sync**

1. Login with default English
2. Change language to Chinese
3. Logout
4. Login again
5. Verify language is Chinese (synced from database)

Expected: Language persists after logout/login

- [ ] **Step 4: Commit**

```bash
git add client/src/FrontEnd/services/languageService.ts client/src/FrontEnd/pages/Login.tsx
git commit -m "feat(i18n): sync language preference on login

- Create LanguageService for API calls
- Fetch user language on login
- Override localStorage with database preference
- Handle sync errors gracefully"
```

---

## Task 15: Final Testing and Documentation

**Files:**
- Create: `docs/i18n-usage-guide.md`

- [ ] **Step 1: Test complete user flow**

Full test scenario:
1. Start fresh (clear localStorage)
2. Visit app - should default to browser language or English
3. Change to Chinese using selector
4. Verify all translated pages (Login, Dashboard, Settings) show Chinese
5. Login as user
6. Logout
7. Clear browser data
8. Login again
9. Verify language is Chinese (from database)
10. Change to Malay
11. Verify all pages update to Malay
12. Refresh page
13. Verify language persists (localStorage)

Expected: All scenarios work correctly

- [ ] **Step 2: Test across browsers**

Test in:
- Chrome
- Firefox
- Safari (if available)
- Edge

Expected: Works consistently across browsers

- [ ] **Step 3: Create usage documentation**

Create `docs/i18n-usage-guide.md`:

```markdown
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
```

- [ ] **Step 4: Update main README**

Add to project README.md:

```markdown
## Internationalization (i18n)

This project supports three languages:
- English (default)
- Simplified Chinese (简体中文)
- Bahasa Malaysia

Users can switch languages using the globe icon in the top navigation bar.

For developer documentation, see [i18n Usage Guide](docs/i18n-usage-guide.md).
```

- [ ] **Step 5: Final commit**

```bash
git add docs/i18n-usage-guide.md README.md
git commit -m "docs(i18n): add usage guide and update README

- Create comprehensive i18n usage guide
- Document translation conventions
- Add user instructions
- Update main README with i18n info"
```

---

## Phase 1 Completion Checklist

Before marking Phase 1 complete, verify:

- [ ] ✅ Users can switch between en/zh/ms languages
- [ ] ✅ Language selector appears in top navigation
- [ ] ✅ All core pages translated (Login, Dashboard, Settings, Navigation)
- [ ] ✅ Language preference saves to localStorage
- [ ] ✅ Language preference syncs to database for logged-in users
- [ ] ✅ Language persists after logout/login
- [ ] ✅ Backend API endpoints (GET/PUT) work correctly
- [ ] ✅ Database migration applied successfully
- [ ] ✅ No console errors related to i18n
- [ ] ✅ All tests pass (if applicable)
- [ ] ✅ Documentation complete

---

## Next Steps (Phase 2)

After Phase 1 completion, proceed to Phase 2:
- Translate Purchasing module
- Translate Supplier module
- Translate User Access module

See design doc for Phase 2 details: `docs/superpowers/specs/2026-06-15-multi-language-i18n-design.md`

---

## Troubleshooting

### Issue: Translations not updating

**Solution:** 
1. Clear browser cache and localStorage
2. Hard refresh (Ctrl+Shift+R)
3. Restart dev server

### Issue: Build fails with "Cannot find module"

**Solution:**
1. Verify all translation JSON files exist
2. Check import paths in i18n/index.ts
3. Run `npm install` to ensure dependencies installed

### Issue: Language doesn't persist after login

**Solution:**
1. Check backend API is running
2. Verify auth token is valid
3. Check network tab for API call errors
4. Ensure database migration applied

---

**End of Phase 1 Implementation Plan**
