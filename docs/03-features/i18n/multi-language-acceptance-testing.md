# Multi-Language i18n Acceptance Testing Plan

**Date:** 2026-06-17  
**Scope:** Phases 1-4 Complete Testing  
**Languages:** English (EN), Simplified Chinese (ZH), Bahasa Malaysia (MS)

---

## Test Summary

**Total Coverage:**
- 38 pages across 10 modules
- 12 namespaces
- 36 translation files
- 3 languages
- 1000+ translation keys

---

## Test Categories

### 1. Build Validation Tests
### 2. Phase 1: Core Pages Tests
### 3. Phase 2: Business Modules Tests
### 4. Phase 3: Secondary Modules Tests
### 5. Phase 4: Feedback Messages Tests
### 6. Cross-Module Integration Tests
### 7. Edge Case Tests

---

## 1. Build Validation Tests

**Test 1.1: Frontend Build**
- [ ] Run: `cd client && npm run build`
- [ ] Expected: Build succeeds with no errors
- [ ] Status: 

**Test 1.2: TypeScript Compilation**
- [ ] Check for TypeScript errors in build output
- [ ] Expected: No TS errors
- [ ] Status: 

**Test 1.3: Translation Files Loaded**
- [ ] Verify all 36 JSON files are imported in i18n/index.ts
- [ ] Expected: All namespaces registered
- [ ] Status: 

---

## 2. Phase 1: Core Pages Tests

**Test 2.1: Login Page**
- [ ] Open login page
- [ ] Switch language to Chinese
- [ ] Verify: Email label shows "电子邮件"
- [ ] Verify: Password label shows "密码"
- [ ] Verify: Login button shows "登录"
- [ ] Switch to Malay
- [ ] Verify: Login button shows "Log Masuk"
- [ ] Status: 

**Test 2.2: Dashboard**
- [ ] Login and open dashboard
- [ ] Switch to Chinese
- [ ] Verify: Welcome message in Chinese
- [ ] Verify: Statistics cards in Chinese
- [ ] Switch to Malay
- [ ] Verify: All text updates
- [ ] Status: 

**Test 2.3: Navigation Sidebar**
- [ ] Switch to Chinese
- [ ] Verify: "采购管理" (Purchasing Management)
- [ ] Verify: "供应商概览" (Supplier Overview)
- [ ] Verify: "用户权限" (User Access)
- [ ] Switch to Malay
- [ ] Verify: All menu items translate
- [ ] Status: 

**Test 2.4: Settings Page**
- [ ] Open Settings
- [ ] Switch to Chinese
- [ ] Verify: "公司地址" (Company Address)
- [ ] Verify: "AI助手" (AI Assistant)
- [ ] Verify: "反馈" (Feedback)
- [ ] Status: 

---

## 3. Phase 2: Business Modules Tests

**Test 3.1: Purchasing - Create PR**
- [ ] Open Purchasing → Create PR
- [ ] Switch to Chinese
- [ ] Verify: Form labels in Chinese
- [ ] Verify: Table headers in Chinese
- [ ] Submit empty form
- [ ] Verify: Validation errors in Chinese
- [ ] Switch to Malay
- [ ] Verify: All text updates
- [ ] Status: 

**Test 3.2: Purchasing - Approval Workflow**
- [ ] Open Approval page
- [ ] Switch to Chinese
- [ ] Verify: Status labels "待审批/已批准/已拒绝"
- [ ] Verify: Action buttons "批准/拒绝"
- [ ] Switch language mid-page
- [ ] Verify: Page updates without reload
- [ ] Status: 

**Test 3.3: Supplier - Order Acknowledgement**
- [ ] Open Supplier → Order Acknowledgement
- [ ] Switch to Chinese
- [ ] Verify: Table columns translate
- [ ] Verify: Status indicators translate
- [ ] Status: 

**Test 3.4: User Access - Create User**
- [ ] Open User Access → Create User
- [ ] Switch to Chinese
- [ ] Verify: Form fields in Chinese
- [ ] Try to submit with invalid email
- [ ] Verify: Validation error in Chinese
- [ ] Status: 

---

## 4. Phase 3: Secondary Modules Tests

**Test 4.1: ChatBot UI (NOT conversation)**
- [ ] Open ChatBot page
- [ ] Switch to Chinese
- [ ] Verify: "发送" button (Send)
- [ ] Verify: Input placeholder in Chinese
- [ ] Type message and send
- [ ] Verify: AI response stays in English (important!)
- [ ] Verify: UI buttons translate but chat content doesn't
- [ ] Status: 

**Test 4.2: Profile Page**
- [ ] Open Profile
- [ ] Switch to Chinese
- [ ] Verify: "个人资料" (Profile)
- [ ] Verify: Form labels in Chinese
- [ ] Status: 

**Test 4.3: Password Reset**
- [ ] Open Password Reset
- [ ] Switch to Chinese
- [ ] Submit with mismatched passwords
- [ ] Verify: Error message in Chinese
- [ ] Status: 

**Test 4.4: Tracking Item**
- [ ] Open Tracking Item page
- [ ] Switch to Chinese
- [ ] Verify: Table headers translate
- [ ] Verify: Status labels translate
- [ ] Status: 

---

## 5. Phase 4: Feedback Messages Tests

**Test 5.1: Toast Success Messages**
- [ ] Trigger save operation (any module)
- [ ] Switch to Chinese before saving
- [ ] Verify: Success toast shows "保存成功"
- [ ] Switch to Malay
- [ ] Trigger save again
- [ ] Verify: Toast shows "Berjaya disimpan"
- [ ] Status: 

**Test 5.2: Toast Error Messages**
- [ ] Trigger error (e.g., network disconnect)
- [ ] Switch to Chinese
- [ ] Verify: Error toast in Chinese
- [ ] Status: 

**Test 5.3: Form Validation**
- [ ] Open any form (CreateUser, CreatePR)
- [ ] Switch to Chinese
- [ ] Submit empty required field
- [ ] Verify: "此字段为必填项"
- [ ] Enter invalid email
- [ ] Verify: Email validation error in Chinese
- [ ] Status: 

**Test 5.4: Modal Confirmations**
- [ ] Try to delete an item
- [ ] Switch to Chinese
- [ ] Verify: Confirmation dialog in Chinese
- [ ] Verify: "确定" and "取消" buttons
- [ ] Status: 

**Test 5.5: NotificationBell (Should NOT translate)**
- [ ] Open NotificationBell
- [ ] Switch to Chinese
- [ ] Verify: Notifications still in English
- [ ] **Important:** This is correct per audit requirements
- [ ] Status: 

---

## 6. Cross-Module Integration Tests

**Test 6.1: Complete Workflow - PR to PO**
- [ ] Switch to Chinese at start
- [ ] Create Purchase Request
- [ ] Verify: All steps in Chinese
- [ ] Review PR
- [ ] Approve PR
- [ ] Create PO
- [ ] Verify: Entire workflow in Chinese
- [ ] Status: 

**Test 6.2: Language Switching Mid-Workflow**
- [ ] Start creating PR in English
- [ ] Fill half the form
- [ ] Switch to Chinese
- [ ] Verify: Filled data preserved
- [ ] Verify: UI updates immediately
- [ ] Complete form
- [ ] Status: 

**Test 6.3: Multi-Tab Language Sync**
- [ ] Open app in two tabs
- [ ] Switch language in Tab 1
- [ ] Verify: Tab 2 updates (if supported)
- [ ] Status: 

---

## 7. Edge Case Tests

**Test 7.1: Long Text Wrapping**
- [ ] Switch to Chinese (shorter text)
- [ ] Verify: No layout breaks
- [ ] Switch to Malay (potentially longer)
- [ ] Verify: Text wraps properly
- [ ] Status: 

**Test 7.2: Missing Translation Fallback**
- [ ] Temporarily rename a translation key
- [ ] Verify: Falls back to English or shows key
- [ ] Status: 

**Test 7.3: Variable Interpolation**
- [ ] Find validation with dynamic values (e.g., "Minimum 8 characters")
- [ ] Switch to Chinese
- [ ] Verify: "至少需要 8 个字符"
- [ ] Verify: Number correctly inserted
- [ ] Status: 

**Test 7.4: Plural Forms**
- [ ] Test "Delete {{count}} items"
- [ ] Verify: 1 item vs 5 items
- [ ] Switch languages
- [ ] Verify: Plural forms correct
- [ ] Status: 

**Test 7.5: Page Reload Persistence**
- [ ] Switch to Chinese
- [ ] Reload page
- [ ] Verify: Language persists (localStorage)
- [ ] Status: 

---

## Test Execution Checklist

**Pre-Testing:**
- [ ] Ensure latest build is deployed
- [ ] Clear browser cache
- [ ] Test in clean browser session

**During Testing:**
- [ ] Document any bugs found
- [ ] Take screenshots of issues
- [ ] Note which language/page combination fails

**Post-Testing:**
- [ ] Compile bug report
- [ ] Prioritize critical vs minor issues
- [ ] Create fix tasks

---

## Success Criteria

**Must Pass:**
- [ ] All Phase 1-4 pages translate correctly
- [ ] No TypeScript/build errors
- [ ] Language switching works on all pages
- [ ] Form validation messages translate
- [ ] Toast messages translate
- [ ] NotificationBell stays in English (audit requirement)

**Should Pass:**
- [ ] No layout breaks from long translations
- [ ] Language persists across page reloads
- [ ] Variable interpolation works correctly

**Nice to Have:**
- [ ] Multi-tab language sync
- [ ] Smooth transitions
- [ ] No visual flicker on language switch

---

## Bug Severity Classification

**Critical (Must Fix):**
- App crashes or breaks
- Data loss
- Security issues
- Entire page/module not translating

**High (Should Fix):**
- Layout breaks
- Missing translations on major features
- Validation errors not translating

**Medium (Could Fix):**
- Minor UI glitches
- Inconsistent terminology
- Spacing issues

**Low (Nice to Fix):**
- Cosmetic issues
- Minor wording improvements
- Edge case scenarios

---

## Final Sign-Off

**Tested By:** _________________  
**Date:** _________________  
**Overall Status:** [ ] PASS / [ ] FAIL / [ ] PASS WITH ISSUES  

**Notes:**

---

**End of Testing Plan**
