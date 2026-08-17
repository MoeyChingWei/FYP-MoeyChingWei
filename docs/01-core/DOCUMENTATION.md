# 🚀 FYP ERP Portal - Complete Documentation

**Last Updated:** 2026-06-04

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Backend Documentation](#backend-documentation)
5. [Frontend Documentation](#frontend-documentation)
6. [Database Schema](#database-schema)
7. [Development Workflow](#development-workflow)
8. [Migration Guide](#migration-guide)
9. [Troubleshooting](#troubleshooting)
10. [Change Log](#change-log)

---

## Project Overview

Full-stack ERP portal with React frontend and Node.js/Express backend, using PostgreSQL with Prisma ORM.

**Stack:**
- Frontend: React 18 + TypeScript + Webpack + Ant Design
- Backend: Node.js + Express 5 + Prisma 7
- Database: PostgreSQL 17 (database name: `FYPData`)

**Features:**
- Purchasing workflow management
- Supplier fulfillment tracking
- User management & RBAC
- Notifications & feedback system
- Real-time activity tracking

---

## Quick Start

### Prerequisites
- Node.js 20 LTS
- PostgreSQL 17 (password: `339595`)
- Git (optional)

### Installation

```bash
# 1. Clone/extract project
cd C:\Users\mch\Desktop\FYP\FYP-MoeyChingWei

# 2. Install backend dependencies
cd backend
npm install
npm run prisma:generate

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Restore database (if needed)
createdb -U postgres -h localhost -p 5432 FYPData
psql -U postgres -h localhost -p 5432 -d FYPData -f ../FYPData_backup.sql
```

### Running the Application

**Terminal 1 - Backend (port 4000):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (port 3000):**
```bash
cd client
npm start
```

**Default Login:**
- Email: `admin@fyp.local`
- Password: `339595`
- Role: Super Admin

---

## Architecture

### Project Structure

```
FYP-MoeyChingWei/
├── backend/                 # Node.js + Express API
│   ├── config/             # Prisma client configuration
│   ├── constants/          # Shared constants (roles, etc.)
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── prisma/            # Database schema & migrations
│   ├── routes/            # API route definitions
│   ├── scripts/           # Utility scripts
│   ├── services/          # Business logic
│   ├── uploads/           # User-uploaded files
│   ├── server.js          # Entry point
│   └── .env              # Environment variables (DO NOT COMMIT)
│
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── FrontEnd/
│   │   │   ├── pages/     # Page components
│   │   │   ├── modules/   # Business logic
│   │   │   ├── components/# UI components
│   │   │   ├── shared/    # Utilities & API wrappers
│   │   │   └── App.tsx    # Main app with routing
│   │   ├── theme/         # Ant Design theme
│   │   └── index.tsx      # Entry point
│   └── webpack.config.cjs # Build configuration
│
├── FYPData_backup.sql     # Database backup
├── docs/                  # All project documentation
│   ├── 01-core/          # Core documentation (DOCUMENTATION.md, CLAUDE.md)
│   ├── 02-setup-guides/  # Setup and installation guides
│   ├── 03-features/      # Feature documentation
│   ├── 04-architecture/  # Architecture and design
│   ├── 05-development/   # Development workflow
│   ├── 06-testing/       # Testing documentation
│   ├── 07-deployment/    # Deployment guides
│   └── 08-legacy/        # Archived documentation
└── DOCS-INDEX.md         # Documentation navigation index

```

### Backend Architecture

**Entry Point:** `backend/server.js`
- All routes mounted under `/api` prefix
- Static uploads served from `/uploads`
- Port: 4000

**Key Routes:**
- `/api` → Authentication & profile
- `/api/admin` → User management
- `/api/purchasing` → Purchasing lookups
- `/api/workflow` → Workflow storage (requests, orders, etc.)
- `/api/notifications` → Notification management
- `/api/feedback` → Feedback system

**Services Layer:**
- `notifications.js` — Notification business logic
- `emailNotifications.js` — Email handling
- `resetCodeStore.js` — Password reset codes
- `recaptcha.js` — reCAPTCHA verification

**Database:** PostgreSQL with Prisma ORM
- Schema: `backend/prisma/schema.prisma`
- Generated client: `backend/prisma/generated/prisma/client`
- Always run `npm run prisma:generate` after schema changes

### Frontend Architecture

**Entry Point:** `client/src/index.tsx`
- Wraps app in Ant Design ConfigProvider
- Error boundary for crash handling

**Main App:** `client/src/FrontEnd/App.tsx`
- Central routing with React Router v6
- Sidebar navigation with role-based access
- Layout orchestration

**Directory Layout:**
- `pages/` — Page components (dashboard, notifications, settings)
  - `pages/purchasing/` — Purchasing workflow pages
  - `pages/supplierFulfillment/` — Supplier pages
  - `pages/userAccess/` — User management & RBAC
  - `pages/categorySelection/` — Lookup management
- `modules/` — Business logic
- `shared/api/` — API client wrappers (axios-based)
- `shared/auth/` — Frontend auth state
- `shared/components/` — Reusable UI components
- `components/` — Feature-specific components

**Webpack Config:** `client/webpack.config.cjs`
- Dev server on port 3000
- Proxies `/api` and `/uploads` to `http://localhost:4000`
- CSS modules for `*.module.css` files

---

## Backend Documentation

### API Routes Summary

All routes prefixed with `/api` (configured in `server.js`).

#### Authentication & Profile (`/api`)

**File:** `routes/auth.js` | **Controller:** `controllers/authController.js`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/api/login` | User login | `{ email, password, recaptchaToken? }` |
| POST | `/api/forgot-password` | Request password reset | `{ email }` |
| POST | `/api/reset-password` | Reset password | `{ email, code, newPassword }` |
| GET | `/api/profile` | Get user profile | Query: `?userId=<id>` |
| PATCH | `/api/profile` | Update profile | `{ userId, name?, department? }` |
| POST | `/api/profile/avatar` | Upload avatar | FormData: `avatar` + `userId` |

**Features:**
- Password hashing with bcrypt
- 6-digit verification code for password reset
- reCAPTCHA v2 verification
- Email notifications via SMTP
- Avatar upload to `uploads/avatars/`

#### Admin - User Management (`/api/admin`)

**File:** `routes/adminUsers.js`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/admin/users` | List all users | - |
| POST | `/api/admin/users` | Create new user | `{ name?, email, password, role?, department? }` |
| PUT | `/api/admin/users/:id` | Update user | `{ name?, email?, password?, role?, department? }` |
| PATCH | `/api/admin/users/:id/status` | Toggle active status | `{ isActive: boolean }` |
| PATCH | `/api/admin/users/:id/role` | Change user role | `{ role, actorEmail?, actorName? }` |
| GET | `/api/admin/role-change-audits` | Get role change history | Query: `?take=<number>` |

**Roles:** Employee, Manager, Executive, Super Admin, Supplier

#### Purchasing Lookups (`/api/purchasing`)

**File:** `routes/purchasingLookups.js`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/purchasing/lookups` | Get lookup values | Query: `?kind=ITEM_CATEGORY` or `UNIT_OF_MEASURE` |
| POST | `/api/purchasing/lookups` | Add new lookup | `{ kind, value }` |
| DELETE | `/api/purchasing/lookups/:id` | Delete lookup | - |

#### Workflow Storage (`/api/workflow`)

**File:** `routes/workflowStorage.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflow/:store` | Fetch all records from store |
| PUT | `/api/workflow/:store` | Replace all records in store |

**Supported stores:** `purchase-requests`, `purchase-orders`, `supplier-order-acks`, `deliveries`, `grns`

#### Notifications (`/api/notifications`)

**File:** `routes/notifications.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PATCH | `/api/notifications/:id/read` | Mark as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/history` | Delete all read notifications |
| DELETE | `/api/notifications/:id` | Delete single notification |

#### Feedback (`/api/feedback`)

**File:** `routes/feedback.js`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feedback` | Get all feedback (admin view) |
| POST | `/api/feedback` | Submit new feedback |

**Feedback types:** `ISSUE`, `IMPROVEMENT`, `COMMENT`

### Backend Environment Variables

**File:** `backend/.env` (never commit!)

```bash
# Database
DATABASE_URL=postgresql://postgres:339595@localhost:5432/FYPData

# SMTP (optional for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=OptiMind <your@gmail.com>
SYSTEM_NOTIFICATION_RECIPIENTS=admin@example.com

# Public URL for uploads
API_PUBLIC_BASE=http://localhost:4000

# reCAPTCHA
RECAPTCHA_SECRET=your_secret_key

# Super admin bootstrap
SUPER_ADMIN_EMAIL=admin@fyp.local
SUPER_ADMIN_PASSWORD=339595
SUPER_ADMIN_NAME=Super Admin
```

---

## Frontend Documentation

### Page Routes

#### Authentication & Profile

| File | Route | Description | Access |
|------|-------|-------------|--------|
| `Login.tsx` | `/login` | User login | Public |
| `ForgetPassword.tsx` | `/forgot-password` | Request password reset | Public |
| `ResetPassword.tsx` | `/reset-password` | Reset password | Public |
| `Profile.tsx` | `/profile` | View/edit profile | Authenticated |
| `ProfileResetPassword.tsx` | `/profile/reset-password` | Change password | Authenticated |

#### Dashboard & Core

| File | Route | Description |
|------|-------|-------------|
| `DashboardNew.tsx` | `/overview` | Role-based dashboard |
| `Notifications.tsx` | `/notifications` | View/manage notifications |
| `TrackingItemManagement.tsx` | `/tracking` | Track workflow items |

#### Purchasing Workflow

| File | Route | Role |
|------|-------|------|
| `CreationSubmodule.tsx` | `/purchasing/request/create` | Employee |
| `ApprovalSubmodule.tsx` | `/purchasing/request/approval` | Executive |
| `PurchaseOrderCreation.tsx` | `/purchasing/order/create` | Executive |
| `PurchaseOrderReview.tsx` | `/purchasing/order/review` | Manager |
| `GoodsReceivedNoteSubmodule.tsx` | `/purchasing/grn` | Employee |

#### Supplier Fulfillment

| File | Route | Role |
|------|-------|------|
| `SupplierOrderAcknowledgement.tsx` | `/supplier/acknowledgement` | Supplier |
| `SupplierDelivery.tsx` | `/supplier/delivery` | Supplier |

#### User Access Management

| File | Route | Role |
|------|-------|------|
| `UserManagement.tsx` | `/admin/users` | Super Admin |
| `RoleManagement.tsx` | `/admin/roles` | Super Admin |

#### Settings

| File | Route |
|------|-------|
| `SettingsHome.tsx` | `/settings` |
| `CompanyAddressSubmodule.tsx` | `/settings/company-address` |
| `FeedbackSubmodule.tsx` | `/settings/feedback` |

### Frontend API Wrappers

**Location:** `client/src/FrontEnd/shared/api/`

All API calls use axios and follow this pattern:
```typescript
const res = await axios.get/post/put/patch/delete(url, data);
if (!res.data?.success) {
  throw new Error(res.data?.message ?? "Operation failed");
}
return res.data;
```

**Key API files:**
- `notifications.ts` — Notification operations
- `feedback.ts` — Feedback submission
- `purchasingLookups.ts` — Lookup management
- `workflowStorage.ts` — Workflow CRUD

---

## Development Workflow

### 🚨 IMPORTANT: Always Read README Files First

Before making any changes:
- **Backend changes:** Read `docs/02-setup-guides/backend/README.md` first
- **Frontend changes:** Read `docs/02-setup-guides/frontend/README.md` first  
- **General overview:** Refer to `docs/01-core/CLAUDE.md`
- **Navigation:** See `DOCS-INDEX.md` in project root

The README files contain "How To Modify/Develop Features" sections with exact file locations.

### Adding a New Backend API Endpoint

1. **Create route file** (if new feature):
   - File: `backend/routes/yourFeature.js`
   - Define endpoints using Express router

2. **Mount route in server:**
   - File: `backend/server.js`
   - Import and mount: `app.use("/api/yourFeature", yourFeatureRoutes);`

3. **Add business logic** (if complex):
   - File: `backend/services/yourFeature.js`

4. **Update database schema** (if needed):
   - File: `backend/prisma/schema.prisma`
   - Run: `npm run prisma:migrate && npm run prisma:generate`

5. **Create frontend API wrapper:**
   - File: `client/src/FrontEnd/shared/api/yourFeature.ts`

### Adding a New Frontend Page

1. **Create page component:**
   - File: `client/src/FrontEnd/pages/YourPage.tsx`
   - Copy structure from existing page

2. **Add route:**
   - File: `client/src/FrontEnd/App.tsx`
   - Import and add route: `<Route path="/your-page" element={<YourPage />} />`

3. **Add navigation link** (if needed):
   - File: `client/src/FrontEnd/App.tsx` (sidebar section)

4. **Create API wrapper** (if needed):
   - File: `client/src/FrontEnd/shared/api/yourFeature.ts`

### Modifying Database Schema

1. **Update schema:**
   - File: `backend/prisma/schema.prisma`
   - Add/modify models

2. **Create migration:**
   ```bash
   cd backend
   npm run prisma:migrate
   # Enter migration name when prompted
   ```

3. **Regenerate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

4. **Update API routes and frontend** accordingly

### Common Commands

```bash
# Backend
npm run dev              # Start dev server with auto-reload
npm run admin:create     # Create super admin user
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate   # Create and apply migration

# Frontend
npm start               # Start dev server (port 3000)
npm run build          # Production build

# Database
pg_dump -U postgres -h localhost -p 5432 -d FYPData -F p -f FYPData_backup.sql
```

---

## Migration Guide

### Moving to a New Laptop

#### Prerequisites on New Laptop

1. **Node.js 20 LTS** — https://nodejs.org/
2. **PostgreSQL 17** — https://www.postgresql.org/download/windows/
   - Set postgres password to `339595`
   - Keep default port `5432`
   - Install command-line tools (psql, pg_dump, createdb)
3. **Git** (optional) — https://git-scm.com/

#### Migration Steps

```powershell
# 1. Verify PostgreSQL is running
# Win + R → services.msc → find postgresql-x64-17 → Status = Running

# 2. Create database
createdb -U postgres -h localhost -p 5432 FYPData

# 3. Restore from backup
psql -U postgres -h localhost -p 5432 -d FYPData -f .\FYPData_backup.sql

# 4. Verify tables exist
psql -U postgres -h localhost -p 5432 -d FYPData -c "\dt"

# 5. Install dependencies
cd backend
npm install
npm run prisma:generate

cd ..\client
npm install

# 6. Create super admin
cd ..\backend
npm run admin:create

# 7. Run the app (two terminals)
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
cd client
npm start
```

#### Common Migration Issues

| Symptom | Fix |
|---------|-----|
| Password authentication failed | Reset postgres password to `339595` or update `DATABASE_URL` in `.env` |
| Could not connect to server | Start postgresql-x64-17 service |
| psql not found | Use full path: `C:\Program Files\PostgreSQL\17\bin\psql.exe` |
| Prisma errors | Run `npm run prisma:generate` in backend folder |
| Port already in use | Close other process or change port |

---

## Troubleshooting

### Backend Issues

| Issue | Solution |
|-------|----------|
| Port 4000 already in use | Find and kill process: `netstat -ano \| findstr :4000` then `taskkill /PID <PID> /F` |
| Database connection failed | Check PostgreSQL service is running, verify DATABASE_URL in `.env` |
| Prisma client errors | Run `npm run prisma:generate` |
| SMTP errors | Check SMTP credentials in `.env` or disable email (codes print to console) |

### Frontend Issues

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Find and kill process: `netstat -ano \| findstr :3000` then `taskkill /PID <PID> /F` |
| API calls fail (404) | Ensure backend is running on port 4000 |
| Proxy not working | Check webpack.config.cjs proxy settings, restart dev server |
| Build out of memory | Increase Node memory: `set NODE_OPTIONS=--max_old_space_size=4096` |

### Database Issues

| Issue | Solution |
|-------|----------|
| Migration failed | Check Prisma logs, restore from backup if needed |
| Cannot connect | Verify PostgreSQL service running, check port 5432 |
| Permission denied | Ensure postgres user has correct permissions |

### Common Errors

**"Module not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**"Prisma schema not found"**
```bash
cd backend
npm run prisma:generate
```

**"Cannot read property of undefined" in frontend**
- Check browser console for specific error
- Verify API response structure
- Check if data is loading before rendering

---

## Change Log

### 2026-06-04 - Notification Navigation Fix
- **Fixed:** "View All" button in notification dropdown now navigates to `/notifications` instead of `/overview`
- **File Changed:** `client/src/FrontEnd/components/shared/NotificationBell.tsx` (line 79)

### Recent Features Implemented

#### Click-to-Open & Delete from Tracking
- **Feature:** Entire tracking row is clickable (opens detail modal)
- **Feature:** Delete items from tracking view (localStorage-based)
- **Files:** `client/src/FrontEnd/pages/TrackingItemManagement.tsx`

#### Stage Filtering on Tracking Page
- **Feature:** Filter tracking items by stage (6 stage icons with badges)
- **Feature:** Smooth animations and stagger effects
- **Feature:** "Clear Filter" button when filter is active

#### Read/Unread Tracking
- **Feature:** Visual indicators for unread items
- **Feature:** Mark as read on click
- **Files:** `client/src/FrontEnd/pages/TrackingItemManagement.tsx`

#### UI Improvements
- **Feature:** Enhanced stage button visuals
- **Feature:** Improved dashboard layout
- **Feature:** Better notification bell dropdown

---

## Database Schema

### Key Models

**User** — User accounts
- `id`, `email`, `password`, `name`, `role`, `department`, `avatarUrl`, `isActive`

**Notification** — In-app notifications
- `id`, `userId`, `title`, `message`, `type`, `channel`, `isRead`, `refType`, `refId`

**Feedback** — User feedback
- `id`, `userId`, `type`, `description`, `status`, `createdAt`

**RoleChangeAudit** — Role change audit trail
- `id`, `userId`, `oldRole`, `newRole`, `actorEmail`, `actorName`, `changedAt`

**PurchasingLookup** — Dropdown options
- `id`, `kind`, `value` (kinds: `ITEM_CATEGORY`, `UNIT_OF_MEASURE`)

**Workflow Records** — JSON payload storage
- `PurchaseRequestRecord`, `PurchaseOrderRecord`, `SupplierOrderAcknowledgementRecord`, 
  `SupplierDeliveryRecordStore`, `SupplierGrnRecordStore`
- Each has: `localId` (primary key), `payload` (JSON)

---

## Security Notes

- **Never commit `.env` files** — contain secrets
- Passwords hashed with bcrypt (10 rounds)
- Password reset codes salted and hashed
- reCAPTCHA prevents automated attacks
- Email uniqueness enforced at database level
- Role validation prevents privilege escalation
- User ownership checks on operations

---

## Quick Reference

### Default Credentials
- Email: `admin@fyp.local`
- Password: `339595`
- Role: Super Admin

### Ports
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`
- Database: `localhost:5432`

### Important Files
- `backend/.env` — Backend secrets (never commit)
- `client/.env` — Frontend environment (never commit)
- `backend/prisma/schema.prisma` — Database schema
- `FYPData_backup.sql` — Database backup
- `DOCS-INDEX.md` — Documentation navigation index
- `docs/01-core/CLAUDE.md` — Project instructions for Claude Code
- `docs/01-core/DOCUMENTATION.md` — This comprehensive documentation

---

## Support & Contact

For issues or questions:
1. Check this documentation
2. Check `docs/02-setup-guides/backend/README.md` or `docs/02-setup-guides/frontend/README.md` for specific details
3. Review browser console and terminal logs
4. Check database with Prisma Studio: `npm run prisma:studio`

---

**Last Updated:** 2026-06-04
**Version:** 1.0.0
**Status:** Active Development
