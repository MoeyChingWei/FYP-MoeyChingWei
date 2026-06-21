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

## Project Context

**OptiMind ERP System** - Full-stack enterprise resource planning portal

**Tech Stack:**
- Frontend: React 18 + TypeScript + Webpack + Ant Design
- Backend: Node.js + Express 5 + Prisma ORM
- Database: PostgreSQL 17 (`FYPData`)

**Default Credentials:**
- Email: `admin@fyp.local`
- Password: `339595`

---

## Essential Documentation

Before making any changes, consult these files:

1. **Complete System Docs:** `docs/01-core/DOCUMENTATION.md`
   - Architecture overview
   - API documentation
   - Database schema
   - Page routes and components

2. **Backend Development:** `docs/02-setup-guides/backend/README.md`
   - Exact file locations for backend features
   - API endpoint patterns
   - Service layer structure

3. **Frontend Development:** `docs/02-setup-guides/frontend/README.md`
   - Component organization
   - Page structure
   - State management patterns

**Do NOT search the entire codebase.** These README files contain exact file paths and patterns.

---

## Quick Commands

### Start Development Servers

```bash
# From project root
npm start        # Frontend (http://localhost:3000)
npm run backend  # Backend (http://localhost:4000)
```

### Backend Development

```bash
cd backend
npm run dev              # Auto-reload development mode
npm run admin:create     # Create super admin user
npm run prisma:generate  # Regenerate Prisma client (after schema changes)
npm run prisma:studio    # Visual database browser
npm run prisma:migrate   # Create and apply database migrations
```

### Frontend Development

```bash
cd client
npm start      # Development server
npm run build  # Production build
```

---

## Development Workflow

### Standard Process

1. **Locate files** using the appropriate README (backend or frontend)
2. **Make changes** following existing code patterns
3. **Test locally** with both servers running
4. **Run Prisma generate** if you modified `schema.prisma`
5. **Update docs** in `DOCUMENTATION.md` for significant changes

### Common Patterns

**Adding a new API endpoint:**
- Route: `backend/routes/{feature}.js`
- Controller: `backend/controllers/{feature}-controller.js`
- Service: `backend/services/{feature}-service.js`

**Adding a new page:**
- Component: `client/src/FrontEnd/pages/{FeatureName}Page.tsx`
- Route: Update `client/src/App.tsx`
- API: `client/src/FrontEnd/shared/api/{feature}.ts`

---

## Critical Rules

1. **Always run `npm run prisma:generate`** after any `schema.prisma` changes
2. **Never commit `.env` files** - they contain secrets
3. **Match existing code style** in the file you're editing
4. **Test both frontend and backend** before considering work complete
5. **Frontend dev server proxies** `/api` and `/uploads` to `http://localhost:4000`

---

For complete documentation, see **`docs/01-core/DOCUMENTATION.md`**
