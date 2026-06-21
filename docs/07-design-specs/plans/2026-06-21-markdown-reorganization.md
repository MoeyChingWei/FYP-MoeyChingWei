# Markdown Files Reorganization - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize 101 markdown files into 8-category folder structure

**Architecture:** Create folders, move files in batches, create index, update references

**Tech Stack:** Git, Bash/PowerShell

## Global Constraints

- All file moves must preserve file content (no edits during move)
- Use git mv for all file moves to preserve history
- All folder names use format `NN-category-name/` (numbered 01-08)
- Maximum folder depth is 3 levels
- No files should be deleted, only moved
- Keep Diagram/README.md in original location
- All commits must have descriptive messages

---

### Task 1: Create Directory Structure

**Files:**
- Create: All 22 directories under docs/

**Interfaces:**
- Consumes: None (first task)
- Produces: Complete empty folder structure

**Steps:**

- [ ] Step 1: Create git backup commit
- [ ] Step 2: Create all 22 directories using mkdir -p
- [ ] Step 3: Verify directories created (count should be 22+)
- [ ] Step 4: Commit directory structure

---

### Task 2: Move Core and Setup Files

**Files:**
- Move 21 files to 01-core and 02-setup-guides

**Interfaces:**
- Consumes: Empty directories from Task 1
- Produces: Core docs and setup guides in place

**Steps:**

- [ ] Step 1: Move 6 core docs to docs/01-core/
- [ ] Step 2: Move backend setup files
- [ ] Step 3: Move frontend setup files  
- [ ] Step 4: Move general setup guides
- [ ] Step 5: Commit all moves

---

### Task 3: Move Feature Documentation

**Files:**
- Move 35 files to 03-features subdirectories

**Interfaces:**
- Consumes: Directories from Task 1
- Produces: All feature docs organized

**Steps:**

- [ ] Step 1: Move AI agents files (11 files)
- [ ] Step 2: Move chatbot files (7 files)
- [ ] Step 3: Move voice input files (5 files)
- [ ] Step 4: Move export files (3 files)
- [ ] Step 5: Move i18n files (5 files)
- [ ] Step 6: Move other feature files (3 files)
- [ ] Step 7: Commit all feature moves

---

### Task 4: Move Reports and Testing Files

**Files:**
- Move 27 files to implementation, testing, guides, specs, archive

**Interfaces:**
- Consumes: Directories from Task 1
- Produces: All remaining files organized

**Steps:**

- [ ] Step 1: Move implementation reports (10 files)
- [ ] Step 2: Move testing files (7 files)
- [ ] Step 3: Move guide files (3 files)
- [ ] Step 4: Move design specs (if not already in place)
- [ ] Step 5: Move archive files (10 files)
- [ ] Step 6: Commit all moves

---

### Task 5: Create Navigation Index and Update References

**Files:**
- Create: DOCS-INDEX.md
- Modify: README.md, docs/01-core/DOCUMENTATION.md, docs/01-core/CLAUDE.md

**Interfaces:**
- Consumes: All moved files from Tasks 2-4
- Produces: Navigation index and updated references

**Steps:**

- [ ] Step 1: Create DOCS-INDEX.md with complete navigation
- [ ] Step 2: Update README.md documentation links
- [ ] Step 3: Update DOCUMENTATION.md internal links
- [ ] Step 4: Update CLAUDE.md references
- [ ] Step 5: Verify file count (~101 files in docs/)
- [ ] Step 6: Commit navigation and reference updates

---

**Plan Status:** ✅ Ready for execution  
**Estimated Time:** 30-45 minutes  
**Risk Level:** Low (all moves with git, easy to rollback)
