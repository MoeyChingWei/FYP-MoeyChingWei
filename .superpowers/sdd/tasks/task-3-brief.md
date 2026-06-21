# Task 3: Move Feature Documentation

**Goal:** Move 35 feature-related files to docs/03-features/ subdirectories

**Files to Move:**

## AI Agents Main (6 files) → docs/03-features/ai-agents/
- docs/MULTI_AGENT_SYSTEM.md
- docs/MULTI_AGENT_IMPLEMENTATION_SUMMARY.md
- docs/MULTI_AGENT_FRONTEND_GUIDE.md
- docs/COMPLETE_MULTI_AGENT_SUMMARY.md
- docs/ANALYTICS_AGENT_GUIDE.md
- backend/API_REFACTORING_COMPLETE.md

## AI Agents Subfolder (5 files) → docs/03-features/ai-agents/agents/
- backend/agents/AGENT_OPTIMIZATION_REPORT.md
- backend/agents/OPTIMIZATION_SUMMARY.md
- backend/agents/CHECK_AGENTS.md
- backend/agents/FINAL_CHECK_REPORT.md
- backend/agents/AGENT_IMPROVEMENTS.md

## ChatBot Main (3 files) → docs/03-features/chatbot/
- backend/AUTO_TITLE_GENERATION.md
- backend/CHATGPT_STYLE_COMPLETE.md
- client/src/FrontEnd/components/ChatBot/ATTACHMENT_PREVIEW_GUIDE.md

## ChatBot Image Features (4 files) → docs/03-features/chatbot/image-features/
- backend/IMAGE_ANALYSIS_FIX.md
- backend/IMAGE_SEND_FIX_COMPLETE.md
- backend/PASTE_FIX_COMPLETE.md
- backend/PASTE_IMAGE_GUIDE.md

## Voice Input (5 files) → docs/03-features/voice-input/
- VOICE_INPUT_INTEGRATION.md
- VOICE_INPUT_IMPROVEMENTS.md
- VOICE_SPEED_OPTIMIZATION.md
- VOICE_OPTIMIZATION_GUIDE.md
- VOICE_INPUT_TROUBLESHOOTING.md

## Export (3 files) → docs/03-features/export/
- EXPORT_PURCHASE_REQUESTS_FEATURE.md
- EXPORT_FEATURE_IMPLEMENTATION_SUMMARY.md
- EXPORT_FEATURE_UI_GUIDE.md

## i18n (5 files) → docs/03-features/i18n/
- docs/i18n-usage-guide.md
- docs/multi-language-acceptance-testing.md
- docs/multi-language-acceptance-report.md
- docs/phase4-status.md
- docs/phase4-implementation-summary.md

## Other Features (3 files) → docs/03-features/other/
- docs/SOURCES_IMPLEMENTATION.md
- docs/SOURCES_REDESIGN.md
- docs/CSS_SPECIFICITY_FIX.md

**Total:** 34 files to move

**Steps:**
1. Use `git mv` for all moves
2. Move files by feature category
3. Verify all files moved
4. Commit with message: "docs: move feature documentation to categorized structure"

**Global Constraints:**
- Use `git mv` only
- Do not edit file contents
- Verify source files no longer exist after move
