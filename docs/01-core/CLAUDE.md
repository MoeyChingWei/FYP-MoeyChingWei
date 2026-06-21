# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

---

## 💎 Coding Best Practices (Karpathy Guidelines)

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

## ⚠️ CRITICAL: Read Before Any Development

### Understand First, Code Second

Before writing ANY code:

1. **If user provides screenshots** → Analyze carefully:
   - Where is the feature located? (UI position, chat interface, sidebar, etc.)
   - What is the context? (existing functionality, user flow)
   - Is this an AI feature (chatbot understands command) or UI feature (button/interface)?

2. **If you're uncertain** → ASK:
   - "Is this an AI feature (chatbot command) or UI feature (button)?"
   - "Which file should I modify?"
   - "Can you clarify the exact location?"

3. **Never assume or guess:**
   - ❌ Don't see "export" and automatically create a button
   - ❌ Don't add UI when user wants AI functionality
   - ❌ Don't modify random files without confirming location

### Example of What NOT to Do

**User request:** "Add export purchase request in chatbot"
- ❌ WRONG: Create an "Export Purchase Requests" button in sidebar
- ✅ RIGHT: Ask "Do you want the chatbot to understand 'export purchase request' command?"

**Key distinction:**
- **AI Feature** = Chatbot understands and executes command
- **UI Feature** = Visual button/interface element

---

## 📚 Documentation Structure

All documentation is organized in `docs/` with 8 categories:

```
docs/
├── 01-core/              # Essential system docs
├── 02-setup-guides/      # Installation & configuration
├── 03-features/          # Feature-specific docs
├── 04-implementation/    # Completion reports
├── 05-testing/          # Test plans & results
├── 06-guides/           # User guides
├── 07-design-specs/     # Design & plans
└── 08-archive/          # Historical docs
```

---

## 🎯 Before Starting Development

### Step 1: Identify Feature Type

**Backend API Development** → Read:
- `docs/02-setup-guides/backend/README.md`
- `docs/01-core/DOCUMENTATION.md` (API Reference section)

**Frontend UI Development** → Read:
- `docs/02-setup-guides/frontend/README.md`
- `docs/01-core/DOCUMENTATION.md` (Page Routes section)

**Chatbot AI Feature** → Read:
- `docs/03-features/chatbot/` (all files)
- `docs/01-core/DOCUMENTATION.md` (Chatbot section)
- `backend/agents/chatbot/chatbot-agent.js`

**Database Schema** → Read:
- `docs/01-core/DOCUMENTATION.md` (Database Schema section)
- `backend/prisma/schema.prisma`

**Voice/Export/i18n Features** → Read:
- `docs/03-features/{feature-name}/`

### Step 2: Read Relevant Documentation

**Do NOT skip this step.** Read the specific files to understand:
- Existing patterns and code structure
- Technology stack and versions
- File locations and naming conventions
- Related features and dependencies

### Step 3: Confirm Understanding

If anything is unclear after reading docs:
- Ask specific questions
- Confirm file locations
- Verify technical approach

---

## ✅ After Development Completion

### Mandatory: Update Documentation

**Every development task requires documentation updates.**

#### 1. Update PROJECT-LOG.md

Location: `docs/01-core/PROJECT-LOG.md`

Format:
```markdown
---
## [YYYY-MM-DD] - [Feature Name]

**Requirement:** [What user asked for]

**Implementation:** [What you built]

**Modified Files:**
- `path/to/file.js` - Added export functionality
- `path/to/component.tsx` - Updated UI for export button
- `path/to/schema.prisma` - Added ExportLog model

**Technical Details:**
- Used Prisma ORM for database access
- Implemented async/await pattern
- Added error handling with try-catch

**Important Notes:**
- Requires npm run prisma:generate after schema changes
- Export format is CSV by default
- File size limit is 10MB

**Related Documentation:**
- Updated: docs/03-features/export/EXPORT_FEATURE_GUIDE.md
- Created: docs/04-implementation/completion-reports/2026-06-21-export-completion.md
---
```

#### 2. Update Feature Documentation (if applicable)

If you added/modified a major feature:
- Update `docs/01-core/DOCUMENTATION.md` (appropriate section)
- Update feature-specific docs in `docs/03-features/{feature-name}/`

#### 3. Create Completion Report (for major features)

**Location:** `docs/04-implementation/completion-reports/`

**Naming:** `YYYY-MM-DD-{FEATURE-NAME}-COMPLETION-REPORT.md`

**Example:** `2026-06-21-CHATBOT-EXPORT-COMPLETION-REPORT.md`

---

## 📁 File Creation Rules

### Where to Put New MD Files

**❌ NEVER create MD files in:**
- Project root directory
- Random locations
- Outside the docs/ folder

**✅ ALWAYS put MD files in correct category:**

**Feature Documentation** → `docs/03-features/{feature-name}/`
- Chatbot: `docs/03-features/chatbot/`
- AI Agents: `docs/03-features/ai-agents/`
- Voice: `docs/03-features/voice-input/`
- Export: `docs/03-features/export/`
- i18n: `docs/03-features/i18n/`

**Completion Reports** → `docs/04-implementation/completion-reports/`

**Test Documentation** → `docs/05-testing/`
- Test plans: `docs/05-testing/test-plans/`
- Test results: `docs/05-testing/test-results/`
- Checklists: `docs/05-testing/checklists/`

**Design Specs** → `docs/07-design-specs/`
- Specs: `docs/07-design-specs/specs/`
- Plans: `docs/07-design-specs/plans/`

### Naming Conventions

**Feature docs:** `{FEATURE_NAME}_{DESCRIPTION}.md`
- Example: `CHATBOT_EXPORT_GUIDE.md`

**Completion reports:** `YYYY-MM-DD-{FEATURE}-COMPLETION-REPORT.md`
- Example: `2026-06-21-EXPORT-COMPLETION-REPORT.md`

**Test docs:** `{FEATURE}_TEST_{TYPE}.md`
- Example: `CHATBOT_TEST_PLAN.md`

---

## 🛠️ Technology Stack

**Frontend:**
- React 18 (Functional Components only, no Class Components)
- TypeScript
- Ant Design UI library
- Context API for state (NOT Redux)
- Fetch API (NOT Axios)

**Backend:**
- Node.js + Express 5
- Async/await pattern (NOT callbacks)
- Prisma ORM (NOT raw SQL)
- PostgreSQL 17

**Database:**
- Name: `FYPData`
- ORM: Prisma
- Always run `npm run prisma:generate` after schema changes

---

## 🚨 Critical Rules

1. **Ask when uncertain** - Don't assume, don't guess
2. **Read docs first** - Before touching any code
3. **Update PROJECT-LOG.md** - After EVERY development
4. **Put files in correct folders** - Follow the categorization
5. **Match existing patterns** - Don't introduce new libraries/patterns
6. **Test thoroughly** - Both frontend and backend
7. **Run prisma:generate** - After any schema.prisma changes

---

## 📖 Additional Resources

- **Complete Guide:** `docs/01-core/DEVELOPMENT-GUIDE.md`
- **Project Overview:** `docs/01-core/DOCUMENTATION.md`
- **Quick Start:** `docs/02-setup-guides/`

---

**Remember: When in doubt, ASK. It's better to ask than to build the wrong thing.**
