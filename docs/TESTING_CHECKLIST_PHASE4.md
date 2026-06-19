# Multi-Language Acceptance Testing - Quick Execution Guide

**Date:** 2026-06-17  
**Status:** Ready for Execution  
**Estimated Time:** 45-60 minutes

---

## 🚀 Quick Start

### Prerequisites

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend  
cd client
npm start
```

**Login:** `admin@fyp.local` / `339595`

---

## ✅ Essential Test Cases (20 minutes)

### Test 1: Language Switching (5 min)

**Steps:**
1. Login to application
2. Click language selector (top-right corner)
3. Switch: English → 简体中文 → Bahasa Malaysia → English
4. Navigate between pages while testing each language

**Pass Criteria:**
- [x] Language changes immediately (no reload)
- [x] All UI text updates
- [x] Language persists after page navigation
- [x] Sidebar menu translates
- [x] Page titles translate

**Result:** [ ] PASS / [ ] FAIL

**Issues:**
```
(Leave blank if passed)
```

---

### Test 2: Success Toast Messages (5 min)

**Steps:**
1. Switch to **Chinese (简体中文)**
2. Navigate to **Settings** → **Company Address**
3. Change any field
4. Click **Save**
5. Observe toast message

**Expected:** "保存成功" (green toast, top-right)

**Repeat for all languages:**
- [ ] English: "Saved successfully"
- [ ] Chinese: "保存成功"
- [ ] Malay: "Berjaya disimpan"

**Result:** [ ] PASS / [ ] FAIL

**Issues:**
```

```

---

### Test 3: Validation Error Messages (5 min)

**Steps:**
1. Switch to **Chinese (简体中文)**
2. Go to **User Access** → **Create User**
3. Click **Save** without filling anything
4. Observe validation errors

**Expected:**
- Red text below empty fields
- "此字段为必填项" (This field is required)

**Test each language:**
- [ ] English: "This field is required"
- [ ] Chinese: "此字段为必填项"
- [ ] Malay: "Medan ini diperlukan"

**Also test:**
- [ ] Invalid email: Error shows in correct language
- [ ] Password too short: Error shows in correct language

**Result:** [ ] PASS / [ ] FAIL

**Issues:**
```

```

---

### Test 4: Error Handling (5 min)

**Steps:**
1. Switch to **Chinese (简体中文)**
2. Open DevTools → Network tab
3. Set throttling to "Offline"
4. Try to navigate or save something
5. Observe error message

**Expected:** "操作失败" or "加载失败" (red toast)

**Test:**
- [ ] Generic error shows in Chinese
- [ ] Switch to Malay → error shows in Malay
- [ ] Turn network back on
- [ ] Backend-specific errors still show (not broken)

**Result:** [ ] PASS / [ ] FAIL

**Issues:**
```

```

---

## 🔍 Detailed Test Cases (25 minutes)

### Test 5: Form Workflow - Create User (7 min)

**Language:** Chinese (简体中文)

1. Navigate to **User Access** → **Create User**
2. Verify all labels are in Chinese:
   - [ ] "用户名" (Username)
   - [ ] "电子邮件" (Email)
   - [ ] "密码" (Password)
   - [ ] "角色" (Role)
   - [ ] "部门" (Department)

3. Fill form incorrectly:
   - [ ] Empty email → "此字段为必填项"
   - [ ] Invalid email format → "请输入有效的电子邮件地址"
   - [ ] Password < 6 chars → "密码至少需要 6 个字符"

4. Fill form correctly and save
   - [ ] Success toast: "保存成功"

**Result:** [ ] PASS / [ ] FAIL

---

### Test 6: Purchasing Workflow (10 min)

**Language:** Malay (Bahasa Malaysia)

1. Go to **Purchasing** → **Create Purchase Request**
2. Verify UI in Malay:
   - [ ] Form labels translated
   - [ ] Table headers translated
   - [ ] Buttons translated ("Simpan", "Batal")

3. Try to submit empty form:
   - [ ] Validation errors in Malay

4. Fill form and submit:
   - [ ] Success message in Malay: "Berjaya disimpan"

5. Navigate to **Review** page:
   - [ ] Table content displays correctly
   - [ ] Status labels in Malay

**Result:** [ ] PASS / [ ] FAIL

---

### Test 7: Mid-Form Language Switch (5 min)

**Steps:**
1. Start in **English**
2. Go to **User Access** → **Create User**
3. Fill in:
   - Username: "testuser"
   - Email: "test@example.com"
   - Password: "password123"
4. **Don't submit yet**
5. Switch language to **Chinese**
6. Verify:
   - [ ] Form data preserved (still filled)
   - [ ] Labels now in Chinese
   - [ ] No data loss
7. Submit form with validation error (clear email)
8. Verify:
   - [ ] Error message in Chinese

**Result:** [ ] PASS / [ ] FAIL

---

### Test 8: Dashboard & Notifications (3 min)

**Language:** Chinese

1. Go to **Dashboard** (Overview)
2. Verify:
   - [ ] Statistics cards in Chinese
   - [ ] Notification panel translated
   - [ ] "标记为已读" (Mark as read) button
   - [ ] "删除所有" (Delete all) button

3. Click notification:
   - [ ] Navigation works correctly
   - [ ] No errors in console

**Result:** [ ] PASS / [ ] FAIL

---

## 🔧 Edge Cases (15 minutes)

### Test 9: ChatBot UI (Not Conversation)

**Language:** Chinese

1. Open **ChatBot** page
2. Verify:
   - [ ] "发送" button (Send)
   - [ ] Input placeholder in Chinese
   - [ ] Message area labeled correctly

3. **Type a message and send**
4. **IMPORTANT:** Verify AI response stays in **English**
   - [ ] AI conversation does NOT translate (correct behavior)
   - [ ] Only UI buttons/labels translate

**Result:** [ ] PASS / [ ] FAIL

**Note:** This is expected behavior per audit requirements.

---

### Test 10: Modal Confirmations (5 min)

**Language:** Chinese

1. Go to **User Access** → **User List**
2. Try to delete a user
3. Verify delete confirmation modal:
   - [ ] Title in Chinese
   - [ ] "确定" button (Confirm)
   - [ ] "取消" button (Cancel)

4. Switch to **Malay** and repeat:
   - [ ] Modal in Malay

**Result:** [ ] PASS / [ ] FAIL

---

### Test 11: Page Reload Persistence (3 min)

**Steps:**
1. Switch to **Chinese**
2. Reload page (F5 or Ctrl+R)
3. Verify:
   - [ ] Language stays Chinese after reload
   - [ ] LocalStorage persists language choice

4. Open in new tab:
   - [ ] New tab also in Chinese

**Result:** [ ] PASS / [ ] FAIL

---

### Test 12: All 38 Pages Spot Check (7 min)

**Language:** Chinese

Quickly navigate and verify translation works on:

**Core Pages:**
- [ ] Dashboard / Overview
- [ ] Settings

**Purchasing Module:**
- [ ] Create PR
- [ ] Review PR
- [ ] Approval PR
- [ ] Create PO
- [ ] Review PO

**Supplier Module:**
- [ ] Order Acknowledgement
- [ ] Delivery
- [ ] GRN Status

**User Access:**
- [ ] User List
- [ ] Create User
- [ ] Roles & Permissions

**Others:**
- [ ] Profile
- [ ] Tracking Item
- [ ] ChatBot

**Result:** [ ] PASS / [ ] FAIL

---

## 📊 Test Summary

### Overall Results

| Category | Tests | Pass | Fail | Skip |
|----------|-------|------|------|------|
| Essential (1-4) | 4 | | | |
| Detailed (5-8) | 4 | | | |
| Edge Cases (9-12) | 4 | | | |
| **Total** | **12** | | | |

### Pass Rate

**Calculation:** (Pass / Total) × 100% = ____%

**Status:**
- [ ] ✅ PASS (100% or all critical tests pass)
- [ ] ⚠️ PASS WITH ISSUES (>90%, minor issues only)
- [ ] ❌ FAIL (<90% or critical issues found)

---

## 🐛 Issues Log

### Critical Issues (Blockers)

| # | Issue | Page | Language | Reproduction Steps |
|---|-------|------|----------|-------------------|
| 1 | | | | |

### High Priority Issues

| # | Issue | Page | Language | Reproduction Steps |
|---|-------|------|----------|-------------------|
| 1 | | | | |

### Medium Priority Issues

| # | Issue | Page | Language | Reproduction Steps |
|---|-------|------|----------|-------------------|
| 1 | | | | |

### Low Priority (Cosmetic)

| # | Issue | Page | Language | Reproduction Steps |
|---|-------|------|----------|-------------------|
| 1 | | | | |

---

## ✅ Sign-Off

### Tester Information

**Name:** _________________  
**Date:** _________________  
**Time Spent:** _________ minutes

### Test Environment

- [ ] Backend running: localhost:4000
- [ ] Frontend running: localhost:3000
- [ ] Browser: _________________
- [ ] Browser version: _________________

### Final Decision

- [ ] ✅ **APPROVED** - All tests pass, production-ready
- [ ] ⚠️ **APPROVED WITH NOTES** - Minor issues, can deploy
- [ ] ❌ **REJECTED** - Critical issues found, needs fixes

### Comments

```
(Additional notes, observations, recommendations)
```

---

## 📝 Next Steps

### If APPROVED ✅

1. Mark Phase 4 as "User Testing Complete"
2. Update `docs/multi-language-acceptance-testing.md`
3. Consider feature production-ready
4. Optionally: Plan for Phase 5 enhancements

### If REJECTED ❌

1. Review issues log with development team
2. Prioritize fixes
3. Re-test after fixes applied
4. Schedule follow-up testing session

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-17  
**Related Documents:**
- `docs/PHASE4_COMPLETION_REPORT.md`
- `docs/phase4-status.md`
- `docs/i18n-usage-guide.md`
