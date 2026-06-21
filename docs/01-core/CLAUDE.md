# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Coding Best Practices (Karpathy Guidelines)

**Plugin:** `andrej-karpathy-skills` installed and active

Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

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
