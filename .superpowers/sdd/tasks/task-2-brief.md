# Task 2: Move Core and Setup Files

**Goal:** Move 21 files to 01-core and 02-setup-guides directories

**Files to Move:**

## Core Documentation (6 files) → docs/01-core/
- docs/DOCUMENTATION.md
- docs/PROJECT-LOG.md
- docs/QUICK_REFERENCE.md
- docs/CLAUDE.md
- docs/README-DOCS.md
- docs/MIGRATION.md

## Setup Guides - Backend (3 files) → docs/02-setup-guides/backend/
- backend/README.md
- backend/QUICK_START.md
- backend/CHECKLIST.md

## Setup Guides - Vision API (5 files) → docs/02-setup-guides/backend/vision-api/
- backend/VISION_API_SETUP_GUIDE.md
- backend/VISION_INTEGRATION_GUIDE.md
- backend/backend/GOOGLE_VISION_READY.md
- backend/backend/GOOGLE_VISION_SETUP.md
- backend/backend/VISION_API_ALTERNATIVES.md

## Setup Guides - Frontend (2 files) → docs/02-setup-guides/frontend/
- client/README.md
- backend/FRONTEND_REFRESH_GUIDE.md

## Setup Guides - General (3 files) → docs/02-setup-guides/guides/
- docs/HOW-TO-START.md
- docs/QUICK_START_GUIDE.md
- docs/START_HERE_TESTING.md

**Total:** 21 files to move

**Steps:**
1. Use `git mv` for all file moves to preserve history
2. Move files in groups (core, backend, vision-api, frontend, guides)
3. Verify all 21 files moved successfully
4. Commit with descriptive message

**Global Constraints:**
- Use `git mv` only (preserves file history)
- Do not edit file contents
- Verify source files no longer exist after move
