# Audit Logging System - Implementation Summary

## Overview
Implemented a comprehensive audit logging system that tracks all critical operations in the application for compliance, security monitoring, and debugging purposes.

## Components Implemented

### 1. Database Schema
- **AuditLog Table**: Stores all audit entries with fields for action, entity, user info, changes, metadata, and status
- **BackupHistory Table**: Tracks database and file backup operations

### 2. Services

#### Audit Service (`backend/services/audit.js`)
- `log()`: Core method to create audit entries
- `query()`: Filter and search audit logs
- `getEntityHistory()`: Retrieve audit trail for specific entities
- `getUserActivity()`: Get activity history for specific users
- `getStats()`: Aggregate statistics on audit logs

#### Backup Service (`backend/services/backup.js`)
- `backupDatabase()`: PostgreSQL database backup using pg_dump
- `backupFiles()`: Zip backup of uploaded files
- `fullBackup()`: Combined database + files backup
- `cleanOldBackups()`: Retention management (keep last N backups)
- `getHistory()`: Retrieve backup history

### 3. Middleware

#### Audit Middleware (`backend/middleware/auditMiddleware.js`)
- Intercepts all HTTP responses to automatically log operations
- Response interception pattern using `res.json` and `res.send` wrappers
- Extracts user info, IP address, and user agent from requests

## Fixed Issues

### Issue 1: Express Path Behavior in Nested Routers
**Problem**: The middleware was checking for paths like `/api/login` and `/api/admin/users`, but Express's `req.path` strips the router mount prefix.

**Root Cause**: 
- Server mounts routers at `/api`
- Within that context, `req.path` is relative (e.g., `/login` not `/api/login`)
- For nested routers like `/api/admin`, the path is further stripped (e.g., `/users` not `/admin/users`)

**Solution**: Removed all `/api` prefixes from path checks throughout the middleware:
- `/api/login` → `/login`
- `/api/admin/users` → `/users`
- `/api/workflow/purchase-requests` → `/workflow/purchase-requests`
- `/api/export` → `/export`

### Issue 2: User Management Auditing
**Problem**: User creation, updates, and status changes were not being audited.

**Root Cause**: Path check was looking for `/admin/users` but Express nested routers show only `/users`.

**Solution**: Changed path check from `path.includes("/admin/users")` to `path.includes("/users")`.

### Issue 3: Backup History API BigInt Serialization
**Problem**: `/api/backup/history` endpoint was failing with "Failed to get backup history" error.

**Root Cause**: 
- Prisma's `BackupHistory.fileSize` field is stored as `BigInt` in the database
- JavaScript's `JSON.stringify()` cannot serialize BigInt values by default
- When Express calls `res.json()`, it internally uses `JSON.stringify()`, causing the endpoint to throw

**Solution**: 
- Modified `backend/routes/backup.js` to convert BigInt to String before serialization:
```javascript
const serializedHistory = history.map(backup => ({
  ...backup,
  fileSize: backup.fileSize ? backup.fileSize.toString() : null,
}));
```

### Issue 4: Prisma PostgreSQL Connection Error
**Problem**: When testing backup service directly with Node, got "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string" error.

**Root Cause**: 
- `@prisma/adapter-pg` requires a `pg.Pool` instance, not a connection string object
- Original code passed `{ connectionString: ... }` directly to `PrismaPg`

**Solution**: 
- Modified `backend/config/prisma.js` to create a proper `pg.Pool` instance:
```javascript
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
```

## Verified Functionality

### ✅ Authentication Operations
- **Login attempts** (both successful and failed)
  - Captures failed login email for security monitoring
  - Proper status tracking (SUCCESS/FAILED)

### ✅ User Management
- **User Creation**: Captures email and role in changes
- **User Updates**: Tracks field changes (name, department, etc.)
- **Status Changes**: Logs account activation/deactivation

### ✅ Backup System
- **Database Backup**: PostgreSQL pg_dump with row counts
- **Files Backup**: Zip archive of uploads directory
- **Full Backup**: Parallel database + files backup
- **Backup History**: Retrieval with BigInt serialization fixed
- **Backup Records**: Status tracking (IN_PROGRESS, SUCCESS, FAILED)

### ✅ Workflow Operations (Ready)
- Purchase Requests
- Purchase Orders
- Supplier Order Acknowledgements
- Deliveries
- GRNs (Goods Received Notes)

### ✅ File Operations (Ready)
- Document uploads
- Source document management

### ✅ Export Operations (Ready)
- Data exports with type and format metadata

## API Endpoints

### Audit Logs
- `GET /api/audit/logs` - Query audit logs with filters
  - Query params: `userId`, `entity`, `action`, `startDate`, `endDate`, `limit`, `offset`
- `GET /api/audit/stats` - Aggregate statistics
  - Query params: `startDate`, `endDate`

### Backups
- `POST /api/backup/database` - Trigger database backup
- `POST /api/backup/files` - Trigger files backup
- `POST /api/backup/full` - Trigger full backup
- `GET /api/backup/history` - Retrieve backup history
- `DELETE /api/backup/cleanup` - Clean old backups (keep last N)

## Sample Audit Log Entry

```json
{
  "id": 21,
  "action": "LOGIN",
  "entity": "Auth",
  "entityId": null,
  "userId": null,
  "userEmail": null,
  "userName": null,
  "ipAddress": "::1",
  "userAgent": "curl/8.19.0",
  "changes": null,
  "metadata": {
    "success": false,
    "failedEmail": "wronguser@test.com"
  },
  "status": "FAILED",
  "errorMsg": null,
  "createdAt": "2026-08-09T05:29:19.137Z"
}
```

## Best Practices Implemented

1. **Automatic Logging**: Middleware-based approach ensures no operation is missed
2. **Fail-Safe**: Audit logging failures don't break main operations
3. **Rich Context**: Captures IP, user agent, changes, and custom metadata
4. **Query Flexibility**: Support for filtering by user, entity, action, and date range
5. **Performance**: Non-blocking audit writes using `.catch()` pattern

## Configuration

### Environment Variables Required
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Backup Location
- Database backups: `backups/database/`
- File backups: `backups/files/`

### Backup Retention
- Default: Keep last 10 backups
- Configurable via `cleanOldBackups(keepLast)` parameter

## Monitoring

The system is production-ready with:
- Comprehensive error handling
- Console logging for backup operations
- Status tracking (IN_PROGRESS, SUCCESS, FAILED)
- File size and row count metadata

## Next Steps (Optional Enhancements)

1. **Scheduled Backups**: Add cron jobs for automated daily/weekly backups
2. **Alert System**: Notify admins of failed backups or suspicious audit patterns
3. **Audit Log Archival**: Move old logs to cold storage after retention period
4. **Advanced Analytics**: Dashboard for audit log visualization and anomaly detection
5. **Compliance Reports**: Generate audit reports for regulatory requirements
