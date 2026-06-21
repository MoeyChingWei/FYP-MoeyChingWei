# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ IMPORTANT: Complete Documentation Available

**All comprehensive documentation has been consolidated into `DOCUMENTATION.md`**

For detailed information about:
- Project overview and architecture
- Backend API documentation
- Frontend page routes and components
- Development workflows
- Database schema
- Migration guide
- Troubleshooting

**Please read `DOCUMENTATION.md` first.**

---

## Quick Reference for Development

### Before Making Changes

1. **Backend changes:** Read `docs/02-setup-guides/backend/README.md` for exact file locations
2. **Frontend changes:** Read `docs/02-setup-guides/frontend/README.md` for exact file locations
3. **General information:** Read `docs/01-core/DOCUMENTATION.md`

**Do NOT search through the entire codebase.** The README files tell you exactly which files to modify.

---

## Project Overview

Full-stack ERP portal with React frontend and Node.js/Express backend, using PostgreSQL with Prisma ORM.

**Stack:**
- Frontend: React 18 + TypeScript + Webpack + Ant Design
- Backend: Node.js + Express 5 + Prisma 7
- Database: PostgreSQL 17 (database name: `FYPData`)

---

## Quick Start

### From Project Root

```bash
# Start frontend (port 3000)
npm start

# Start backend (port 4000)
npm run backend
```

### Backend Commands

```bash
cd backend
npm run dev              # Development with auto-reload
npm run admin:create     # Create super admin user
npm run prisma:generate  # Generate Prisma client after schema changes
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:migrate   # Create and apply migrations
```

### Frontend Commands

```bash
cd client
npm start      # Development server (port 3000)
npm run build  # Production build
```

---

## Development Workflow

### When Adding/Modifying Features

1. **Read the appropriate README first:**
   - Backend API → `docs/02-setup-guides/backend/README.md` → "How To Modify/Develop Features" section
   - Frontend UI → `docs/02-setup-guides/frontend/README.md` → "How To Modify/Develop Features" section

2. **Follow the README instructions** to locate exact files

3. **Make your changes**

4. **Test your changes**

5. **Update documentation** if needed (in `docs/01-core/DOCUMENTATION.md`)

---

## Important Notes

- Always run `npm run prisma:generate` after schema changes
- Frontend proxies `/api` and `/uploads` to `http://localhost:4000` in dev mode
- Default login: `admin@fyp.local` / `339595`
- Never commit `.env` files

---

For complete documentation, see **`docs/01-core/DOCUMENTATION.md`**
