# Backend API Documentation

This folder contains the Node.js/Express backend API for the ERP system.

## Folder Structure

```
backend/
├── config/           # Configuration files (Prisma client setup)
├── constants/        # Shared constants (roles, etc.)
├── controllers/      # Request handlers (business logic)
├── middleware/       # Express middleware (file upload, auth, etc.)
├── prisma/          # Prisma ORM files
│   ├── schema.prisma           # Database schema definition
│   ├── migrations/             # Database migration history
│   └── generated/prisma/client # Generated Prisma client
├── routes/          # API route definitions
├── scripts/         # Utility scripts (admin creation, etc.)
├── services/        # Business logic services
├── uploads/         # User-uploaded files (avatars, etc.)
├── server.js        # Application entry point
└── .env             # Environment variables (DO NOT COMMIT)
```

## API Routes

All routes are prefixed with `/api` (configured in `server.js`).

### Authentication & Profile (`/api`)

**File:** `routes/auth.js`  
**Controller:** `controllers/authController.js`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/login` | User login with email/password | `{ email, password, recaptchaToken? }` | `{ success, user, message }` |
| POST | `/api/forgot-password` | Request password reset code | `{ email }` | `{ success, message }` |
| POST | `/api/reset-password` | Reset password with code | `{ email, code, newPassword }` | `{ success, message }` |
| GET | `/api/profile` | Get user profile | Query: `?userId=<id>` | `{ success, user }` |
| PATCH | `/api/profile` | Update user profile | `{ userId, name?, department? }` | `{ success, user }` |
| POST | `/api/profile/avatar` | Upload profile avatar | FormData: `avatar` (file) + `userId` | `{ success, avatarUrl }` |

**Features:**
- Password hashing with bcrypt
- 6-digit verification code for password reset (stored with salt + hash)
- reCAPTCHA v2 verification (optional, configured via `.env`)
- Email notifications via SMTP (or terminal output in dev mode)
- Avatar upload to `uploads/avatars/` with unique filenames

---

### Admin - User Management (`/api/admin`)

**File:** `routes/adminUsers.js`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/admin/users` | List all users | - | `{ success, users[] }` |
| POST | `/api/admin/users` | Create new user | `{ name?, email, password, role?, department? }` | `{ success, user }` |
| PUT | `/api/admin/users/:id` | Update user | `{ name?, email?, password?, role?, department? }` | `{ success, user }` |
| PATCH | `/api/admin/users/:id/status` | Toggle user active status | `{ isActive: boolean }` | `{ success, user }` |
| PATCH | `/api/admin/users/:id/role` | Change user role (with audit) | `{ role, actorEmail?, actorName? }` | `{ success, user, changed }` |
| GET | `/api/admin/role-change-audits` | Get role change history | Query: `?take=<number>` (default 50, max 200) | `{ success, audits[] }` |

**Features:**
- Password validation (min 6 characters)
- Email uniqueness enforcement
- Role validation against `constants/roles.js` (Employee, Manager, Executive, Super Admin, Supplier)
- Role change audit trail in `role_change_audits` table
- User activation/deactivation

---

### Purchasing Lookups (`/api/purchasing`)

**File:** `routes/purchasingLookups.js`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/purchasing/lookups` | Get lookup values | Query: `?kind=ITEM_CATEGORY` or `UNIT_OF_MEASURE` | `{ success, items[] }` |
| POST | `/api/purchasing/lookups` | Add new lookup value | `{ kind, value }` | `{ success, item }` |
| DELETE | `/api/purchasing/lookups/:id` | Delete lookup value | - | `{ success }` |

**Features:**
- User-extensible dropdown options for purchasing forms
- Two kinds: `ITEM_CATEGORY` (product categories) and `UNIT_OF_MEASURE` (units like "kg", "pcs")
- Unique constraint on `(kind, value)` pair
- Value normalization (1-200 characters, whitespace collapsed)

---

### Workflow Storage (`/api/workflow`)

**File:** `routes/workflowStorage.js`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/workflow/:store` | Fetch all records from store | - | `{ success, rows[] }` |
| PUT | `/api/workflow/:store` | Replace all records in store | `{ rows: [{ localId, ...payload }] }` | `{ success, count }` |

**Supported stores:**
- `purchase-requests` → `PurchaseRequestRecord` table
- `purchase-orders` → `PurchaseOrderRecord` table
- `supplier-order-acks` → `SupplierOrderAcknowledgementRecord` table
- `deliveries` → `SupplierDeliveryRecordStore` table
- `grns` → `SupplierGrnRecordStore` table

**Features:**
- JSON payload storage (entire workflow state stored as JSON in `payload` column)
- `localId` as primary key (client-generated UUID)
- Atomic replace: deletes removed records, upserts incoming records
- Triggers notification processing after successful update (via `services/notifications.js`)

---

### Notifications (`/api/notifications`)

**File:** `routes/notifications.js`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/notifications` | Get user notifications | Query: `?userId=<id>` | `{ success, notifications[] }` |
| PATCH | `/api/notifications/:id/read` | Mark notification as read | - | `{ success, notification }` |
| PATCH | `/api/notifications/read-all` | Mark all user notifications as read | `{ userId }` | `{ success, count }` |
| DELETE | `/api/notifications/history` | Delete all read notifications | `{ userId }` | `{ success, count }` |
| DELETE | `/api/notifications/:id` | Delete single notification | `{ userId }` | `{ success }` |

**Features:**
- User-scoped notifications (filtered by `userId`)
- Supports types: `INFO`, `WARNING`, `ERROR`
- Supports channels: `IN_APP`, `EMAIL`
- Optional reference to external entities via `refType` and `refId`
- Returns up to 200 most recent notifications (ordered by `createdAt DESC`)

---

### Feedback (`/api/feedback`)

**File:** `routes/feedback.js`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/feedback` | Get all feedback (admin view) | - | `{ success, feedbacks[] }` |
| POST | `/api/feedback` | Submit new feedback | `{ userId, type, description }` | `{ success, feedback }` |

**Feedback types:**
- `ISSUE` — bug reports
- `IMPROVEMENT` — feature requests
- `COMMENT` — general comments

**Features:**
- Minimum 5 characters for description
- Automatically notifies admins (Super Admin, Executive, Manager roles) via `services/notifications.js`
- Includes user info in response (name, email, role)
- Returns up to 300 most recent feedback entries

---

## Services

**Location:** `backend/services/`

| File | Purpose |
|------|---------|
| `notifications.js` | Core notification logic: create in-app notifications, process workflow state changes, notify admins |
| `emailNotifications.js` | Send email notifications via SMTP (uses nodemailer) |
| `sendResetEmail.js` | Send password reset email with 6-digit code |
| `resetCodeStore.js` | Manage password reset codes (generate, verify, cleanup expired) |
| `recaptcha.js` | Verify Google reCAPTCHA v2 tokens |

**Key functions:**
- `notifyAdminsForFeedback()` — creates in-app notifications for all admin users when feedback is submitted
- `processWorkflowNotifications()` — compares previous and current workflow state, generates notifications for status changes (e.g., request approved, order delivered)

---

## Controllers

**Location:** `backend/controllers/`

| File | Purpose |
|------|---------|
| `authController.js` | Handles login, password reset, profile management, avatar upload |

---

## Middleware

**Location:** `backend/middleware/`

| File | Purpose |
|------|---------|
| `uploadAvatar.js` | Multer configuration for avatar uploads (max 5MB, PNG/JPG/JPEG only, saved to `uploads/avatars/`) |

---

## Scripts

**Location:** `backend/scripts/`

| File | Purpose |
|------|---------|
| `createSuperAdmin.js` | Bootstrap super admin user from `.env` variables (idempotent) |
| `listTables.js` | Database inspection utility (lists all tables) |

**Usage:**
```bash
npm run admin:create
```

---

## Database Schema

**Location:** `backend/prisma/schema.prisma`

**Key models:**
- `User` — user accounts (email, password, role, department, avatar)
- `Notification` — in-app notifications
- `Feedback` — user feedback submissions
- `RoleChangeAudit` — audit trail for role changes
- `PasswordResetCode` — password reset verification codes
- `PurchasingLookup` — user-extensible dropdown options
- `PurchaseRequestRecord`, `PurchaseOrderRecord`, etc. — workflow state storage (JSON payloads)

**After schema changes:**
```bash
npm run prisma:migrate      # Create and apply migration
npm run prisma:generate     # Regenerate Prisma client
```

---

## Environment Variables

**File:** `backend/.env` (copy from `.env.example`)

```bash
# Database connection
DATABASE_URL=postgresql://postgres:339595@localhost:5432/FYPData

# SMTP (optional for local dev; prints codes to terminal if not set)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=OptiMind <your@gmail.com>
SYSTEM_NOTIFICATION_RECIPIENTS=admin1@example.com,admin2@example.com

# Public base URL for uploads (default: http://localhost:4000)
API_PUBLIC_BASE=http://localhost:4000

# Google reCAPTCHA v2 secret
RECAPTCHA_SECRET=your_secret_key

# Super admin bootstrap (for npm run admin:create)
SUPER_ADMIN_EMAIL=admin@fyp.local
SUPER_ADMIN_PASSWORD=339595
SUPER_ADMIN_NAME=Super Admin
```

---

## How To Modify/Develop Features

**Always start here to find which files to modify - don't search the entire codebase!**

### Adding a New API Endpoint

**Example: Add a new endpoint `/api/reports/sales`**

1. **Create route file** (if new feature area):
   - File: `backend/routes/reports.js`
   - Copy structure from existing route file (e.g., `routes/feedback.js`)
   - Define your endpoints:
     ```javascript
     router.get("/sales", async (req, res) => { /* logic */ });
     ```

2. **Mount route in server**:
   - File: `backend/server.js`
   - Add import: `import reportsRoutes from "./routes/reports.js";`
   - Add mount: `app.use("/api/reports", reportsRoutes);`

3. **Add business logic** (if complex):
   - File: `backend/services/reports.js`
   - Export functions called by route handlers

4. **Update database schema** (if needed):
   - File: `backend/prisma/schema.prisma`
   - Add new model or modify existing
   - Run: `npm run prisma:migrate` then `npm run prisma:generate`

### Modifying an Existing API Endpoint

**Example: Change `/api/notifications` to return more fields**

1. **Find the route file**:
   - Check the API Routes section above to find which file handles the endpoint
   - For `/api/notifications`: File is `backend/routes/notifications.js`

2. **Modify the route handler**:
   - Update the Prisma query to select additional fields
   - Modify response format if needed

3. **Update frontend** (if response format changed):
   - See frontend README for API wrapper location

### Adding a New Database Table

**Example: Add a `comments` table**

1. **Update schema**:
   - File: `backend/prisma/schema.prisma`
   - Add new model:
     ```prisma
     model Comment {
       id        Int      @id @default(autoincrement())
       content   String
       userId    Int
       createdAt DateTime @default(now())
       user      User     @relation(fields: [userId], references: [id])
       @@map("comments")
     }
     ```

2. **Create migration**:
   ```bash
   cd backend
   npm run prisma:migrate
   # Enter migration name when prompted
   ```

3. **Regenerate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

4. **Create API routes** (follow "Adding a New API Endpoint" above)

### Modifying Authentication Logic

**Files to modify:**
- `backend/controllers/authController.js` - Login, password reset, profile logic
- `backend/routes/auth.js` - Auth route definitions
- `backend/services/resetCodeStore.js` - Password reset code management
- `backend/services/sendResetEmail.js` - Email sending logic

### Modifying Notification Logic

**Files to modify:**
- `backend/routes/notifications.js` - Notification CRUD endpoints
- `backend/services/notifications.js` - Core notification logic (create, process workflow changes)
- `backend/services/emailNotifications.js` - Email notification sending

**To add a new notification trigger:**
1. Find where the event happens (e.g., in `routes/workflowStorage.js`)
2. Call `processWorkflowNotifications()` or create notification directly via Prisma
3. Update `services/notifications.js` if new notification type needed

### Modifying User Management

**Files to modify:**
- `backend/routes/adminUsers.js` - User CRUD, role changes, status toggle
- `backend/constants/roles.js` - Role definitions

**To add a new user role:**
1. Add role to `backend/constants/roles.js`
2. Update `isValidRole()` function
3. Update frontend role checks (see frontend README)

### Modifying Workflow Storage

**Files to modify:**
- `backend/routes/workflowStorage.js` - Workflow CRUD endpoints
- `backend/services/notifications.js` - Workflow notification processing

**To add a new workflow store:**
1. Add new model to `backend/prisma/schema.prisma` (follow pattern of `PurchaseRequestRecord`)
2. Run migration: `npm run prisma:migrate && npm run prisma:generate`
3. Add to `STORES` object in `backend/routes/workflowStorage.js`
4. Update notification logic in `backend/services/notifications.js` if needed

### Adding Email Notifications

**Files to modify:**
- `backend/services/emailNotifications.js` - Add new email template function
- `backend/services/sendResetEmail.js` - For password reset emails specifically

**To add a new email type:**
1. Create function in `emailNotifications.js`:
   ```javascript
   export async function sendNewEmailType(to, data) {
     const subject = "...";
     const html = `<html>...</html>`;
     return sendEmail(to, subject, html);
   }
   ```
2. Call from route handler or service

### Modifying File Upload

**Files to modify:**
- `backend/middleware/uploadAvatar.js` - Multer configuration (file size, types, destination)

**To change upload limits or allowed file types:**
- Edit `uploadAvatar.js` directly

### Adding a Maintenance Script

**Files to modify:**
- Create new file in `backend/scripts/`
- Add npm script to `backend/package.json`

**Example:**
1. Create `backend/scripts/cleanupOldNotifications.js`
2. Add to `package.json`:
   ```json
   "scripts": {
     "cleanup:notifications": "node scripts/cleanupOldNotifications.js"
   }
   ```

---

## Common Tasks

### Start development server
```bash
npm run dev
```

### Create super admin
```bash
npm run admin:create
```

### Open Prisma Studio (database GUI)
```bash
npm run prisma:studio
```

### Create database backup
```bash
pg_dump -U postgres -h localhost -p 5432 -d FYPData -F p -f ../FYPData_backup.sql
```

---

## Error Handling

All routes follow a consistent error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` — Bad request (validation error)
- `401` — Unauthorized (authentication failed)
- `404` — Not found
- `409` — Conflict (duplicate email, etc.)
- `500` — Server error

---

## Security Notes

- **Never commit `.env`** — contains database credentials, SMTP passwords, API keys
- Passwords are hashed with bcrypt (10 rounds)
- Password reset codes are salted and hashed before storage
- reCAPTCHA verification prevents automated attacks
- Email uniqueness enforced at database level
- Role validation prevents privilege escalation
- User ownership checks on notification/feedback deletion
