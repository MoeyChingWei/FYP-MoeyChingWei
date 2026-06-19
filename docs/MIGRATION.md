# Laptop Migration Guide / 换电脑说明

> **For the AI assistant on the new laptop:** the user is migrating this project from an old Windows laptop to a new one. Everything below is the full context and the exact steps that still need to be done on the new laptop. Please read this file fully before suggesting commands.

> **给新 laptop 的 AI：** 用户正在把这个项目从旧 Windows laptop 搬到新的。下面是完整的背景和新 laptop 这边还需要做的步骤，请先全部读完再给指令。

---

## 1. Project Overview / 项目背景

- **Stack:** Node.js + React (client) + Express/Prisma (backend) + PostgreSQL
- **Backend:** `backend/` — uses Prisma ORM, connects to PostgreSQL `FYPData`
- **Frontend:** `client/` — React app (webpack dev server on port 3000, proxies `/api` to `http://localhost:4000`)
- **Database:** PostgreSQL `FYPData` on `localhost:5432`, user `postgres`, password `339595`

The backend `.env` (`backend/.env`) contains:
- `DATABASE_URL=postgresql://postgres:339595@localhost:5432/FYPData`
- SMTP credentials, reCAPTCHA secret, super admin bootstrap creds
- **DO NOT** commit `.env` to git or post it publicly — it has secrets.

---

## 2. What Was Already Done on the Old Laptop / 旧 laptop 已经做了什么

The user ran `migrate-export.ps1` on the old laptop, which:

1. Ran `pg_dump` and saved `FYPData_backup.sql` (≈0.14 MB) at the project root.
2. Copied the project (excluding `node_modules`, `dist`, `build`, `.next`, `.turbo`, `coverage`, `*.log`).
3. Verified `backend/.env`, `client/.env`, `backend/prisma/schema.prisma`, and the SQL backup were present.
4. Compressed everything into a zip (≈4.33 MB) named like `FYP-MoeyChingWei-export-YYYYMMDD-HHMMSS.zip`.

The user copied that zip to this new laptop and extracted it. So this folder should already contain:

- All source code (`backend/`, `client/`, etc.)
- `backend/.env` and `client/.env`
- `FYPData_backup.sql` at the project root
- `migrate-export.ps1` (the script that was used)
- `MIGRATION.md` (this file)

**No `node_modules` yet — those need to be installed fresh on this laptop.**

---

## 3. New Laptop Setup Checklist / 新 laptop 要做的步骤

### Step A — Install prerequisites / 装环境

Install (if not already installed):

1. **Node.js 20 LTS** — https://nodejs.org/
   Verify: `node -v` should print `v20.x.x`
2. **PostgreSQL 17** — https://www.postgresql.org/download/windows/
   - During install, set the `postgres` superuser password to **`339595`** (matches `backend/.env` exactly, so nothing needs to change).
   - Keep the default port **`5432`**.
   - Install the **command-line tools** (psql, pg_dump, pg_restore, createdb) — they come with the standard installer.
3. **Git** (optional, only if the user wants to keep using version control) — https://git-scm.com/

After installing PostgreSQL, make sure its `bin` folder is on PATH, or use the full path
`C:\Program Files\PostgreSQL\17\bin\` when running psql / createdb.

### Step B — Verify PostgreSQL is running / 确认服务在跑

`Win + R` → `services.msc` → find `postgresql-x64-17` → Status = `Running`.

### Step C — Restore the database / 还原数据库

Open PowerShell at the project root (the folder that has `FYPData_backup.sql`):

```powershell
cd <project-root>

# Create empty database
createdb -U postgres -h localhost -p 5432 FYPData

# Restore from backup (will prompt for password 339595)
psql -U postgres -h localhost -p 5432 -d FYPData -f .\FYPData_backup.sql
```

If `createdb` / `psql` are not found, prefix with the full path, e.g.:
```powershell
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres -h localhost -p 5432 FYPData
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -p 5432 -d FYPData -f .\FYPData_backup.sql
```

Quick sanity check that data restored:
```powershell
psql -U postgres -h localhost -p 5432 -d FYPData -c "\dt"
```
You should see tables like `users`, `notifications`, `feedbacks`, `purchase_request_records`, etc.

### Step D — Install dependencies / 装依赖

```powershell
cd backend
npm install
npm run prisma:generate

cd ..\client
npm install
```

> If `npm install` is slow or fails on Windows due to long paths, run PowerShell as admin once and execute:
> `git config --system core.longpaths true`
> (only relevant if Git is installed and used).

### Step E — Run the app / 跑起来

Open **two** PowerShell terminals.

**Terminal 1 — backend:**
```powershell
cd <project-root>\backend
npm run dev
```
Backend should listen on `http://localhost:4000`.

**Terminal 2 — frontend:**
```powershell
cd <project-root>\client
npm start
```
Frontend should open at `http://localhost:3000`.

Login credentials (super admin from `.env`):
- Email: `admin@fyp.local`
- Password: `339595`

---

## 4. Common Issues / 常见问题

| Symptom | Likely cause | Fix |
|---|---|---|
| `psql: error: connection ... password authentication failed for user "postgres"` | PostgreSQL was installed with a different password than `339595`. | Either reset the postgres password to `339595`, or update `DATABASE_URL` in `backend/.env` to match the new password. |
| `createdb: error: connection ... could not connect to server` | PostgreSQL service not running, or wrong port. | Start the `postgresql-x64-17` service, confirm port is 5432. |
| `pg_dump`/`psql` not found | PostgreSQL `bin` not on PATH. | Use full path `C:\Program Files\PostgreSQL\17\bin\<tool>.exe`. |
| Prisma errors about missing client | Forgot `npm run prisma:generate` in `backend/`. | `cd backend && npm run prisma:generate`. |
| `EADDRINUSE` port 4000 / 3000 | Something else using the port. | Close the other process or change the port in config. |
| Frontend can’t reach backend (`/api` 404 / proxy errors) | Backend not running on `:4000`, or started after frontend without restart. | Start backend first, then frontend. |

---

## 5. Useful Commands / 常用命令参考

From project root:

```powershell
# Re-generate Prisma client after schema changes
cd backend; npm run prisma:generate

# Re-create the super admin (idempotent)
cd backend; npm run admin:create

# Make a fresh DB backup later (e.g. before more changes)
pg_dump -U postgres -h localhost -p 5432 -d FYPData -F p -f .\FYPData_backup.sql
```

---

## 6. Reference: secrets in `backend/.env` / 密码参考

These were copied from the old laptop. Same values must work on the new laptop:

- `DATABASE_URL` → `postgresql://postgres:339595@localhost:5432/FYPData`
- Postgres `postgres` user password → `339595`
- Super admin login → `admin@fyp.local` / `339595`

If the user picks a different Postgres password during install on the new laptop,
just update the password portion of `DATABASE_URL` in `backend/.env`.

---

**End of migration guide.** When everything in Section 3 is done and both `npm run dev` and `npm start` are running cleanly, the migration is complete.
