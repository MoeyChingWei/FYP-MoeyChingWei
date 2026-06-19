# Frontend Documentation

This folder contains the React + TypeScript frontend for the ERP system.

## Folder Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── index.tsx        # Application entry point
│   ├── index.css        # Global styles
│   ├── theme/           # Ant Design theme configuration
│   └── FrontEnd/        # Main application code
│       ├── App.tsx                  # Root component with routing
│       ├── pages/                   # Page components
│       ├── modules/                 # Business logic modules
│       ├── components/              # Reusable UI components
│       └── shared/                  # Shared utilities
│           ├── api/                 # Backend API wrappers
│           ├── auth/                # Authentication state management
│           ├── constants/           # Shared constants
│           ├── types/               # TypeScript type definitions
│           └── components/          # Shared UI components
├── webpack.config.cjs   # Webpack configuration
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables (DO NOT COMMIT)
```

---

## How To Run

### Development Server

```bash
npm start
```

- Starts webpack dev server on `http://localhost:3000`
- Proxies `/api` and `/uploads` requests to `http://localhost:4000` (backend)
- Hot reload enabled
- Opens browser automatically

### Production Build

```bash
npm run build
```

- Outputs to `client/build/`
- Minified and optimized for production

---

## Pages

**Location:** `client/src/FrontEnd/pages/`

### Authentication & Profile

| File | Route | Description | Access |
|------|-------|-------------|--------|
| `Login.tsx` | `/login` | User login with email/password + reCAPTCHA | Public |
| `ForgetPassword.tsx` | `/forgot-password` | Request password reset code | Public |
| `ResetPassword.tsx` | `/reset-password` | Reset password with verification code | Public |
| `Profile.tsx` | `/profile` | View/edit user profile + avatar upload | Authenticated |
| `ProfileResetPassword.tsx` | `/profile/reset-password` | Change password (logged-in users) | Authenticated |

### Dashboard & Notifications

| File | Route | Description | Access |
|------|-------|-------------|--------|
| `Dashboard.tsx` | `/dashboard` | Role-based dashboard (shows different content per role) | Authenticated |
| `Notifications.tsx` | `/notifications` | View/manage in-app notifications | Authenticated |
| `TrackingItemManagement.tsx` | `/tracking` | Track workflow items (requests, orders, deliveries) | Authenticated |

### Purchasing Workflow

**Location:** `pages/purchasing/`

| File | Route | Description | Role |
|------|-------|-------------|------|
| `CreationSubmodule.tsx` | `/purchasing/request/create` | Create purchase request | Employee |
| `ApprovalSubmodule.tsx` | `/purchasing/request/approval` | Review pending requests | Executive |
| `ApprovalDetailSubmodule.tsx` | `/purchasing/request/approval/:id` | Approve/reject request detail | Executive |
| `PurchaseOrderCreation.tsx` | `/purchasing/order/create` | Create purchase order from approved request | Executive |
| `PurchaseOrderReview.tsx` | `/purchasing/order/review` | Review pending purchase orders | Manager |
| `PurchaseOrderApproval.tsx` | `/purchasing/order/approval` | Approve purchase orders | Manager |
| `PurchaseOrderApprovalDetail.tsx` | `/purchasing/order/approval/:id` | PO approval detail | Manager |
| `DeliverySubmodule.tsx` | `/purchasing/delivery` | View deliveries | Employee |
| `GoodsReceivedNoteSubmodule.tsx` | `/purchasing/grn` | Goods received notes list | Employee |
| `GoodsReceivedNoteDetailSubmodule.tsx` | `/purchasing/grn/:id` | GRN detail and discrepancy handling | Employee |

### Supplier Fulfillment

**Location:** `pages/supplierFulfillment/`

| File | Route | Description | Role |
|------|-------|-------------|------|
| `SupplierOrderAcknowledgement.tsx` | `/supplier/acknowledgement` | Acknowledge purchase orders | Supplier |
| `SupplierDelivery.tsx` | `/supplier/delivery` | Record deliveries | Supplier |

### User Access Management

**Location:** `pages/userAccess/`

| File | Route | Description | Role |
|------|-------|-------------|------|
| `UserManagement.tsx` | `/admin/users` | Manage users (create, edit, activate/deactivate) | Super Admin |
| `RoleManagement.tsx` | `/admin/roles` | Change user roles + view audit log | Super Admin |
| `SupplierTypeManagement.tsx` | `/admin/supplier-types` | Assign categories to suppliers | Super Admin |

### Category Selection (Lookups)

**Location:** `pages/categorySelection/`

| File | Route | Description | Role |
|------|-------|-------------|------|
| `ItemCategoriesPage.tsx` | `/admin/item-categories` | Manage item categories | Super Admin |
| `UnitsOfMeasurementPage.tsx` | `/admin/units` | Manage units of measure | Super Admin |
| `CategorySelectionManagement.tsx` | `/admin/categories` | Combined lookup management | Super Admin |

### Settings & Feedback

| File | Route | Description | Access |
|------|-------|-------------|--------|
| `settings/SettingsPage.tsx` | `/settings` | User settings | Authenticated |
| `SmartApprovalManagement.tsx` | `/smart-approval` | Smart approval configuration | Manager/Executive |

---

## Modules (Business Logic)

**Location:** `client/src/FrontEnd/modules/`

### `modules/auth/`

- `hooks/useAuth.ts` — Authentication hook (login state, user info)
- `types.ts` — Auth-related TypeScript types

### `modules/purchasing/`

Purchase request and order workflow logic:

- `requestCreation/` — Purchase request creation logic
  - `storage.ts` — LocalStorage persistence for draft requests
  - `types.ts` — Request data types
  - `constants.ts` — Form field options
  - `index.ts` — Main logic export
- `requestApproval/` — Executive approval logic
- `requestReview/` — Request review logic
- `requestSubmission/` — Request submission logic
- `purchaseOrder/` — Purchase order creation/management
  - `storage.ts` — LocalStorage persistence for draft POs
  - `types.ts` — PO data types

### `modules/supplierFulfillment/`

Supplier-side workflow logic (acknowledgement, delivery, GRN)

### `modules/userAccess/`

- `authentication/` — Login/logout logic
- `rbac/` — Role-based access control utilities
- `userManagement/` — User CRUD operations

### `modules/settings/`

User settings and preferences

### `modules/smartApproval/`

Smart approval automation logic

---

## API Wrappers

**Location:** `client/src/FrontEnd/shared/api/`

All API calls use axios and follow the pattern:
```typescript
const res = await axios.get/post/put/patch/delete(url, data);
if (!res.data?.success) {
  throw new Error(res.data?.message ?? "Operation failed");
}
return res.data;
```

### `base.ts`

```typescript
export const API_ROOT = "/api";  // Proxied to http://localhost:4000 in dev
```

### `notifications.ts`

| Function | Backend Endpoint | Description |
|----------|------------------|-------------|
| `fetchNotifications(userId)` | `GET /api/notifications?userId=<id>` | Get user notifications |
| `markNotificationRead(id)` | `PATCH /api/notifications/:id/read` | Mark as read |
| `markAllNotificationsRead(userId)` | `PATCH /api/notifications/read-all` | Mark all as read |
| `deleteNotification(id, userId)` | `DELETE /api/notifications/:id` | Delete single notification |
| `deleteReadNotifications(userId)` | `DELETE /api/notifications/history` | Delete all read notifications |

### `feedback.ts`

| Function | Backend Endpoint | Description |
|----------|------------------|-------------|
| `fetchFeedbacks()` | `GET /api/feedback` | Get all feedback (admin view) |
| `submitFeedback(userId, type, description)` | `POST /api/feedback` | Submit new feedback |

### `purchasingLookups.ts`

| Function | Backend Endpoint | Description |
|----------|------------------|-------------|
| `fetchLookups(kind)` | `GET /api/purchasing/lookups?kind=<kind>` | Get lookup values |
| `createLookup(kind, value)` | `POST /api/purchasing/lookups` | Add new lookup value |
| `deleteLookup(id)` | `DELETE /api/purchasing/lookups/:id` | Delete lookup value |

**Lookup kinds:**
- `ITEM_CATEGORY` — Product categories
- `UNIT_OF_MEASURE` — Units (kg, pcs, etc.)

### `supplierTypes.ts`

| Function | Backend Endpoint | Description |
|----------|------------------|-------------|
| `fetchSupplierTypes()` | `GET /api/admin/supplier-types` | Get supplier type assignments |
| `updateSupplierTypes(userId, categories)` | `PUT /api/admin/supplier-types/:userId` | Assign categories to supplier |

### `workflowStorage.ts`

| Function | Backend Endpoint | Description |
|----------|------------------|-------------|
| `fetchWorkflowRows(store)` | `GET /api/workflow/:store` | Fetch all records from store |
| `saveWorkflowRows(store, rows)` | `PUT /api/workflow/:store` | Replace all records in store |

**Supported stores:**
- `purchase-requests`
- `purchase-orders`
- `supplier-order-acks`
- `deliveries`
- `grns`

---

## Shared Components

**Location:** `client/src/FrontEnd/shared/components/`

Reusable UI components used across multiple pages (e.g., loading spinners, modals, form fields)

**Location:** `client/src/FrontEnd/components/`

Feature-specific components:
- `components/purchasing/CreatableLookupSelect.tsx` — Dropdown with "add new" option for lookups

---

## Authentication Flow

1. User enters email/password on `/login`
2. Frontend calls `POST /api/login` with credentials + reCAPTCHA token
3. Backend validates credentials, returns user object
4. Frontend stores user in `localStorage` (key: `user`)
5. `useAuth()` hook reads from `localStorage` and provides user state
6. Protected routes check `useAuth()` and redirect to `/login` if not authenticated
7. Role-based access control checks user role before rendering admin pages

**Logout:**
- Clear `localStorage.removeItem('user')`
- Redirect to `/login`

---

## Routing

**File:** `client/src/FrontEnd/App.tsx`

Uses `react-router-dom` v6:
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    {/* ... */}
  </Routes>
</BrowserRouter>
```

**Protected routes** require authentication and redirect to `/login` if user is not logged in.

**Role-based routes** check user role and show 403 error if unauthorized.

---

## State Management

- **Authentication:** `localStorage` + `useAuth()` hook
- **Workflow drafts:** `localStorage` (keys: `purchaseRequestDraft`, `purchaseOrderDraft`)
- **Notifications:** Fetched on demand, no global state
- **Form state:** React `useState` + Ant Design form controllers

---

## Styling

- **UI Framework:** Ant Design 6.x
- **Theme:** Custom theme in `src/theme/antdShadcnTheme.ts`
- **CSS Modules:** `*.module.css` files (scoped styles)
- **Global styles:** `src/index.css`

---

## Environment Variables

**File:** `client/.env`

Variables prefixed with `REACT_APP_` are injected at build time:

```bash
REACT_APP_RECAPTCHA_SITE_KEY=your_site_key
REACT_APP_API_BASE=http://localhost:4000  # Optional, defaults to proxy
```

Access in code:
```typescript
const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
```

---

## How To Modify/Develop Features

**Always start here to find which files to modify - don't search the entire codebase!**

### Adding a New Page

**Example: Add a new "Reports" page**

1. **Create page component**:
   - File: `client/src/FrontEnd/pages/Reports.tsx`
   - Copy structure from existing page (e.g., `Dashboard.tsx`)
   - Add your UI components

2. **Add route**:
   - File: `client/src/FrontEnd/App.tsx`
   - Import: `import Reports from './pages/Reports';`
   - Add route: `<Route path="/reports" element={<Reports />} />`

3. **Add navigation link** (if needed):
   - File: `client/src/FrontEnd/App.tsx` (sidebar section)
   - Add menu item to sidebar

4. **Create API wrapper** (if page needs backend data):
   - File: `client/src/FrontEnd/shared/api/reports.ts`
   - Follow pattern from existing API files

### Modifying an Existing Page

**Example: Change the Dashboard page**

1. **Find the page file**:
   - Check the "Pages" section above to find the file
   - For Dashboard: File is `client/src/FrontEnd/pages/Dashboard.tsx`

2. **Modify the component**:
   - Edit JSX, add/remove components
   - Update state management if needed

3. **Update API calls** (if data structure changed):
   - Find API wrapper in `client/src/FrontEnd/shared/api/`
   - Update function signatures and types

### Adding a New API Call

**Example: Add a function to fetch sales reports**

1. **Create or update API wrapper file**:
   - File: `client/src/FrontEnd/shared/api/reports.ts` (create if new)
   - Add function:
     ```typescript
     export async function fetchSalesReport(startDate: string, endDate: string) {
       const res = await axios.get(`${API_ROOT}/reports/sales`, {
         params: { startDate, endDate }
       });
       if (!res.data?.success) {
         throw new Error(res.data?.message ?? "Failed to fetch report");
       }
       return res.data.report;
     }
     ```

2. **Use in page component**:
   ```typescript
   import { fetchSalesReport } from '../shared/api/reports';
   
   const report = await fetchSalesReport('2024-01-01', '2024-12-31');
   ```

### Modifying an Existing API Call

**Example: Change notification API to include more fields**

1. **Find the API wrapper**:
   - Check "API Wrappers" section above
   - For notifications: File is `client/src/FrontEnd/shared/api/notifications.ts`

2. **Update the function**:
   - Modify request parameters or response handling
   - Update TypeScript types if response structure changed

3. **Update all pages using this API**:
   - Search for function name in codebase
   - Update calling code if signature changed

### Adding a New Module (Business Logic)

**Example: Add a "Reports" module**

1. **Create module folder**:
   - Folder: `client/src/FrontEnd/modules/reports/`

2. **Create module files**:
   - `types.ts` - TypeScript types
   - `index.ts` - Main logic export
   - `storage.ts` - LocalStorage persistence (if needed)
   - `constants.ts` - Module-specific constants (if needed)

3. **Export from index.ts**:
   ```typescript
   export * from './types';
   export { generateReport } from './reportGenerator';
   ```

4. **Use in pages**:
   ```typescript
   import { generateReport } from '../modules/reports';
   ```

### Modifying Authentication

**Files to modify:**
- `client/src/FrontEnd/modules/auth/hooks/useAuth.ts` - Auth hook (login state)
- `client/src/FrontEnd/pages/Login.tsx` - Login page UI
- `client/src/FrontEnd/pages/ForgetPassword.tsx` - Password reset request
- `client/src/FrontEnd/pages/ResetPassword.tsx` - Password reset with code

**To change login logic:**
1. Modify `Login.tsx` for UI changes
2. Update `useAuth.ts` for state management changes
3. Update backend API if needed (see backend README)

### Modifying Notifications

**Files to modify:**
- `client/src/FrontEnd/pages/Notifications.tsx` - Notifications page UI
- `client/src/FrontEnd/shared/api/notifications.ts` - API calls

**To add a new notification action:**
1. Add function to `shared/api/notifications.ts`
2. Add button/handler in `pages/Notifications.tsx`

### Modifying Purchasing Workflow

**Files to modify based on workflow stage:**

| Stage | Page File | Module File |
|-------|-----------|-------------|
| Create Request | `pages/purchasing/CreationSubmodule.tsx` | `modules/purchasing/requestCreation/` |
| Approve Request | `pages/purchasing/ApprovalSubmodule.tsx` | `modules/purchasing/requestApproval/` |
| Create PO | `pages/purchasing/PurchaseOrderCreation.tsx` | `modules/purchasing/purchaseOrder/` |
| Approve PO | `pages/purchasing/PurchaseOrderApproval.tsx` | `modules/purchasing/purchaseOrder/` |
| Delivery | `pages/purchasing/DeliverySubmodule.tsx` | `modules/purchasing/` |
| GRN | `pages/purchasing/GoodsReceivedNoteSubmodule.tsx` | `modules/purchasing/` |

**To modify a workflow stage:**
1. Find the page file from table above
2. Check if module exists in `modules/purchasing/`
3. Modify page UI and/or module logic
4. Update workflow storage API if data structure changed

### Modifying Supplier Fulfillment

**Files to modify:**
- `pages/supplierFulfillment/SupplierOrderAcknowledgement.tsx` - Acknowledge orders
- `pages/supplierFulfillment/SupplierDelivery.tsx` - Record deliveries
- `modules/supplierFulfillment/` - Business logic

### Modifying User Management (Admin)

**Files to modify:**
- `pages/userAccess/UserManagement.tsx` - User CRUD
- `pages/userAccess/RoleManagement.tsx` - Role changes + audit log
- `pages/userAccess/SupplierTypeManagement.tsx` - Supplier categories

**To add a new user field:**
1. Update backend schema (see backend README)
2. Update `UserManagement.tsx` form
3. Update API call in `shared/api/` (if new API file needed)

### Modifying Lookup Management

**Files to modify:**
- `pages/categorySelection/ItemCategoriesPage.tsx` - Item categories
- `pages/categorySelection/UnitsOfMeasurementPage.tsx` - Units of measure
- `shared/api/purchasingLookups.ts` - API calls

**To add a new lookup type:**
1. Add to backend `KINDS` constant (see backend README)
2. Create new page in `pages/categorySelection/`
3. Add route in `App.tsx`

### Adding a Reusable Component

**Example: Add a new "StatusBadge" component**

1. **Create component file**:
   - File: `client/src/FrontEnd/shared/components/StatusBadge.tsx`
   - Or: `client/src/FrontEnd/components/StatusBadge.tsx` (if feature-specific)

2. **Export component**:
   ```typescript
   export function StatusBadge({ status }: { status: string }) {
     return <span className={`badge-${status}`}>{status}</span>;
   }
   ```

3. **Use in pages**:
   ```typescript
   import { StatusBadge } from '../shared/components/StatusBadge';
   ```

### Modifying Styles

**Global styles:**
- File: `client/src/index.css`

**Component-specific styles (CSS Modules):**
- Create: `ComponentName.module.css` next to component file
- Import: `import styles from './ComponentName.module.css';`
- Use: `<div className={styles.myClass}>...</div>`

**Theme customization:**
- File: `client/src/theme/antdShadcnTheme.ts`
- Modify Ant Design theme variables

### Adding Environment Variables

**Example: Add a new API key**

1. **Add to `.env` file**:
   ```bash
   REACT_APP_NEW_API_KEY=your_key_here
   ```

2. **Use in code**:
   ```typescript
   const apiKey = process.env.REACT_APP_NEW_API_KEY;
   ```

3. **Restart dev server** (required for env changes)

### Modifying Routing

**Files to modify:**
- `client/src/FrontEnd/App.tsx` - All routes defined here

**To add a protected route:**
```typescript
<Route 
  path="/new-page" 
  element={<ProtectedRoute><NewPage /></ProtectedRoute>} 
/>
```

**To add a role-based route:**
```typescript
<Route 
  path="/admin/new-page" 
  element={
    <ProtectedRoute requiredRole="Super Admin">
      <NewPage />
    </ProtectedRoute>
  } 
/>
```

### Debugging Issues

**UI not updating:**
1. Check browser console for errors
2. Check React DevTools for component state
3. Verify API calls in Network tab

**API call failing:**
1. Check Network tab in DevTools
2. Verify backend is running on port 4000
3. Check backend terminal for errors
4. Verify API wrapper function in `shared/api/`

**Routing not working:**
1. Check `App.tsx` for route definition
2. Verify path matches exactly
3. Check if route requires authentication

**Styling not applied:**
1. For CSS modules: verify import and className usage
2. For global styles: check `index.css`
3. For Ant Design: check theme configuration

---

## Common Tasks

### Add a new page

1. Create page component in `src/FrontEnd/pages/`
2. Add route in `src/FrontEnd/App.tsx`
3. Add navigation link in sidebar (if needed)

### Add a new API endpoint

1. Add function to appropriate file in `src/FrontEnd/shared/api/`
2. Use in page or module

### Add a new module

1. Create folder in `src/FrontEnd/modules/`
2. Add `types.ts`, `index.ts`, and logic files
3. Export from `index.ts`

### Debug API calls

1. Open browser DevTools → Network tab
2. Filter by `XHR` or `Fetch`
3. Check request/response for `/api/*` calls
4. Backend logs appear in terminal running `npm run backend`

---

## Webpack Configuration

**File:** `webpack.config.cjs`

**Key features:**
- Entry: `src/index.tsx`
- Output: `build/` (production) or in-memory (dev)
- Dev server: port 3000, proxies `/api` and `/uploads` to `http://localhost:4000`
- Babel loader: TypeScript + React + ES6+
- CSS loader: CSS modules for `*.module.css`, regular CSS for others
- Asset loader: Images (PNG, JPG, SVG, etc.)
- Environment variables: `REACT_APP_*` injected via `webpack.DefinePlugin`

**Dev server proxy:**
```javascript
proxy: [
  {
    context: ['/api', '/uploads'],
    target: 'http://localhost:4000',
  },
]
```

This means:
- `http://localhost:3000/api/login` → `http://localhost:4000/api/login`
- `http://localhost:3000/uploads/avatars/xyz.png` → `http://localhost:4000/uploads/avatars/xyz.png`

---

## TypeScript

**Config:** `tsconfig.json` (if present) or inferred from Babel preset

**Type definitions:**
- `src/FrontEnd/shared/types/` — Shared types
- `src/FrontEnd/modules/*/types.ts` — Module-specific types
- `src/FrontEnd/shared/api/*.ts` — API response types

---

## Testing

**Framework:** Jest + React Testing Library (configured in `package.json`)

**Run tests:**
```bash
npm test
```

**Test files:** `*.test.tsx` or `*.test.ts`

---

## Error Handling

**Runtime errors:** Caught by `AppErrorBoundary` in `src/index.tsx`
- Displays error message in UI
- Logs full stack trace to browser console

**API errors:** Handled in API wrapper functions
- Throw `Error` with message from backend response
- Caught by calling component and displayed via Ant Design `message.error()`

---

## Security Notes

- **Never commit `.env`** — may contain API keys
- **reCAPTCHA:** Protects login form from bots
- **Authentication:** User object stored in `localStorage` (not secure for sensitive data, but acceptable for this use case)
- **Role-based access:** Frontend checks user role before rendering admin pages (backend also validates)
- **XSS protection:** React escapes all rendered content by default
- **CSRF protection:** Not implemented (consider adding CSRF tokens for production)

---

## Troubleshooting

### Port 3000 already in use

```bash
# Find and kill process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Proxy not working (API calls fail)

1. Ensure backend is running on port 4000
2. Check `webpack.config.cjs` proxy configuration
3. Restart webpack dev server

### Build fails with "out of memory"

```bash
# Increase Node.js memory limit
set NODE_OPTIONS=--max_old_space_size=4096
npm run build
```

### TypeScript errors

```bash
# Regenerate type definitions
npm install
```

---

## Quick Reference

### Start development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### Default login credentials

- Email: `admin@fyp.local`
- Password: `339595`
- Role: Super Admin

### Common routes

- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard`
- Notifications: `http://localhost:3000/notifications`
- User management: `http://localhost:3000/admin/users`
