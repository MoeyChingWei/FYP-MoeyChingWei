# Decision-Making Guidelines for Skill Usage

## Overview
When working on this project, I should proactively analyze the task and choose the most appropriate skill/agent based on the context and requirements.

## Available Skills & When to Use Them

### 🎨 **Creative & Design Skills**

#### 1. **brainstorming** (superpowers)
**Use BEFORE any creative work:**
- Creating new features
- Building components
- Adding functionality
- Modifying behavior
- Designing UI/UX

**Example scenarios:**
- "Add a dashboard widget"
- "Implement real-time notifications"
- "Create a new reporting page"

**Always use this FIRST before implementation!**

#### 2. **frontend-design**
**Use when:**
- Building web components/pages
- Creating production-grade UI
- Need polished, distinctive design
- Avoiding generic AI aesthetics

**Example scenarios:**
- "Design a modern dashboard"
- "Create a beautiful notification panel"
- "Build a file upload component"

---

### 📋 **Planning & Development Skills**

#### 3. **writing-plans** (superpowers)
**Use when:**
- Have specs/requirements for multi-step tasks
- BEFORE touching code
- Complex feature implementation
- Need structured approach

**Example scenarios:**
- "Plan the real-time notification system"
- "Design the bulk actions architecture"
- "Plan database schema changes"

#### 4. **executing-plans** (superpowers)
**Use when:**
- Have a written implementation plan
- Need separate session with review checkpoints
- Large feature implementation

#### 5. **using-git-worktrees** (superpowers)
**Use when:**
- Starting feature work needing isolation
- Before executing implementation plans
- Working on multiple features in parallel

---

### 🔧 **Development & Implementation Skills**

#### 6. **test-driven-development** (superpowers)
**Use when:**
- Implementing ANY feature or bugfix
- BEFORE writing implementation code
- Want reliable, tested code

**Example scenarios:**
- "Add bulk approve feature"
- "Implement advanced filtering"
- "Fix notification bug"

#### 7. **subagent-driven-development** (superpowers)
**Use when:**
- Executing plans with independent tasks
- Work in current session
- Parallel development needs

#### 8. **dispatching-parallel-agents** (superpowers)
**Use when:**
- 2+ independent tasks
- No shared state or sequential dependencies
- Can work in parallel

**Example scenarios:**
- "Add dark mode AND keyboard shortcuts"
- "Implement filters AND export features"

---

### 🐛 **Debugging & Testing Skills**

#### 9. **systematic-debugging** (superpowers)
**Use when:**
- Encountering ANY bug
- Test failures
- Unexpected behavior
- BEFORE proposing fixes

**Example scenarios:**
- "The stage filter isn't working"
- "Items not marking as read"
- "API endpoint returns 500"

#### 10. **verify**
**Use when:**
- Need to verify PR works
- Confirm fix actually works
- Test change manually
- Validate before pushing

**Example scenarios:**
- "Verify the read/unread feature works"
- "Test the stage filtering in real app"
- "Check if notifications work"

#### 11. **run**
**Use when:**
- Need to see changes working in real app
- Launch and drive the app
- Screenshot the app
- Confirm changes work (not just tests)

---

### 👀 **Review & Quality Skills**

#### 12. **requesting-code-review** (superpowers)
**Use when:**
- Completing tasks
- Implementing major features
- BEFORE merging
- Want to verify work meets requirements

#### 13. **receiving-code-review** (superpowers)
**Use when:**
- Received code review feedback
- BEFORE implementing suggestions
- Feedback seems unclear/questionable
- Need technical verification

#### 14. **code-review**
**Use when:**
- Review current diff
- Check for bugs
- Find reuse/simplification opportunities
- Can use --comment or --fix flags

#### 15. **security-review**
**Use when:**
- Complete security review needed
- Before merging security-sensitive changes
- Implementing auth/permissions
- Handling sensitive data

#### 16. **simplify**
**Use when:**
- Review changed code for reuse
- Find simplification opportunities
- Improve efficiency
- Quality-focused cleanup

---

### ✅ **Completion & Integration Skills**

#### 17. **verification-before-completion** (superpowers)
**Use when:**
- About to claim work is complete
- Before committing
- Before creating PRs
- MUST run verification commands first

**Always use before saying "done"!**

#### 18. **finishing-a-development-branch** (superpowers)
**Use when:**
- Implementation complete
- All tests pass
- Need to decide merge/PR/cleanup strategy
- Ready to integrate work

---

### 🔍 **Research & Analysis Skills**

#### 19. **deep-research**
**Use when:**
- Need multi-source research report
- Fact-checking required
- User wants comprehensive analysis
- Research web sources

**Example scenarios:**
- "Research best practices for real-time systems"
- "Compare WebSocket vs Server-Sent Events"
- "Find industry standards for ERP workflows"

**Note:** Ask clarifying questions if request is vague

---

### 🛠️ **Configuration & Setup Skills**

#### 20. **update-config**
**Use when:**
- Configure settings.json
- Set up automated behaviors/hooks
- Manage permissions
- Set environment variables
- Troubleshoot hooks

**Example scenarios:**
- "Allow npm commands globally"
- "Set up pre-commit hooks"
- "Add permission for PostgreSQL"

#### 21. **keybindings-help**
**Use when:**
- Customize keyboard shortcuts
- Rebind keys
- Add chord bindings
- Modify keybindings.json

---

### 🔁 **Recurring Tasks**

#### 22. **loop**
**Use when:**
- Set up recurring task
- Poll for status
- Run something repeatedly on interval
- User wants automated checks

**Example scenarios:**
- "Check deployment every 5 minutes"
- "Monitor error logs continuously"

**Don't use for one-off tasks!**

---

### 🤖 **API Development**

#### 23. **claude-api**
**Use when:**
- Building Claude API apps
- Using Anthropic SDK
- Need prompt caching
- Migrating between Claude versions

---

### 🚀 **General-Purpose & Exploration**

#### 24. **General-Purpose Agent**
**Use when:**
- Searching for code patterns
- Exploring unfamiliar codebase
- Multi-step research
- Not confident about file locations

#### 25. **Explore Agent**
**Use when:**
- Broad fan-out searches
- Looking across multiple directories
- Only need conclusions (not full dumps)
- Finding naming conventions

---

## 🎯 Decision-Making Process

### Step 1: Is this creative/new feature work?
→ **YES:** Use `brainstorming` first, then `frontend-design` if UI-focused

### Step 2: Is this complex multi-step work?
→ **YES:** Use `writing-plans` first, then `executing-plans` or `subagent-driven-development`

### Step 3: Is this bug fixing?
→ **YES:** Use `systematic-debugging` first, then `test-driven-development`

### Step 4: Is this implementing a feature?
→ **YES:** Use `test-driven-development`, then implement

### Step 5: Am I about to say "done"?
→ **YES:** Use `verification-before-completion` FIRST, then `requesting-code-review`

### Step 6: Need to see it working?
→ **YES:** Use `run` or `verify`

### Step 7: Ready to merge?
→ **YES:** Use `finishing-a-development-branch`

---

## 📋 Common Workflow Patterns

### Pattern 1: New Feature (Complex)
1. ✅ `brainstorming` - Explore requirements
2. ✅ `writing-plans` - Create implementation plan
3. ✅ `using-git-worktrees` - Isolate work
4. ✅ `test-driven-development` - Write tests first
5. ✅ Implement the feature
6. ✅ `run` or `verify` - See it working
7. ✅ `verification-before-completion` - Run all checks
8. ✅ `requesting-code-review` - Get review
9. ✅ `finishing-a-development-branch` - Merge/PR

### Pattern 2: Simple Feature (UI Component)
1. ✅ `brainstorming` - Explore design
2. ✅ `frontend-design` - Create component
3. ✅ `run` - See it working
4. ✅ `verification-before-completion` - Verify
5. ✅ Commit

### Pattern 3: Bug Fix
1. ✅ `systematic-debugging` - Find root cause
2. ✅ `test-driven-development` - Write failing test
3. ✅ Fix the bug
4. ✅ `verify` - Confirm fix works
5. ✅ `verification-before-completion` - Run checks
6. ✅ Commit

### Pattern 4: Parallel Work
1. ✅ `brainstorming` - Plan both features
2. ✅ `dispatching-parallel-agents` - Work in parallel
3. ✅ `verification-before-completion` - Verify both
4. ✅ Merge

---

## ⚠️ Critical Rules

### ALWAYS Use These Skills:
1. **`brainstorming`** - Before ANY creative/feature work
2. **`verification-before-completion`** - Before claiming "done"
3. **`test-driven-development`** - Before implementing features
4. **`systematic-debugging`** - Before fixing bugs

### NEVER Skip:
- ❌ Don't skip `brainstorming` for "simple" features
- ❌ Don't skip `verification-before-completion` before committing
- ❌ Don't claim "done" without running verification
- ❌ Don't implement features without tests

---

## 🎓 Project-Specific Patterns

### For This ERP Project:

**Adding a new feature to tracking page:**
1. `brainstorming` - Explore requirements
2. Read `client/README.md`
3. `test-driven-development` if complex
4. Implement
5. `run` - See it working
6. `verification-before-completion`

**Fixing a bug:**
1. `systematic-debugging` - Find cause
2. `test-driven-development` - Write test
3. Fix
4. `verify` - Confirm
5. `verification-before-completion`

**Major feature (e.g., real-time notifications):**
1. `brainstorming` - Explore design
2. `writing-plans` - Create plan
3. `using-git-worktrees` - Isolate work
4. `subagent-driven-development` - Execute plan
5. `security-review` - If security-sensitive
6. `verification-before-completion`
7. `requesting-code-review`
8. `finishing-a-development-branch`

---

## 💡 Quick Reference

**Before starting:** `brainstorming` or `writing-plans`
**While implementing:** `test-driven-development`
**When stuck:** `systematic-debugging`
**Before finishing:** `verification-before-completion`
**After finishing:** `requesting-code-review`
**To see it work:** `run` or `verify`
**To merge:** `finishing-a-development-branch`

---

This framework ensures high-quality, tested, and verified code for every change! 🚀
