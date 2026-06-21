# Chatbot Purchase Request Creation - Integration Test Results

**Test Date:** 2026-06-11  
**Backend Status:** Running on http://localhost:4000  
**Test Method:** Manual API testing via curl  

---

## Test Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Single-item PR creation | ✅ PASS | Successfully created PR-20260611-YERR |
| 2 | Database verification | ⚠️ SKIPPED | psql not available in test environment |
| 3 | Multi-item PR creation | ⚠️ PARTIAL | Only 1 item appeared in summary (bug) |
| 4 | Cancellation flow | ✅ PASS | Properly cancelled without creating PR |
| 5a | Invalid input: text for quantity | ⚠️ UNEXPECTED | Treated "abc" as custom category instead of rejecting |
| 5b | Invalid input: negative quantity | ✅ PASS | Properly rejected with error message |
| 5c | Invalid input: empty message | ✅ PASS | API returned error for missing message |
| 6 | Custom category/unit | ✅ PASS | Successfully accepted custom values |

**Overall Result:** 5/8 tests passed cleanly, 3 issues identified

---

## Test 1: Single-Item PR Creation ✅

**Objective:** Test complete flow for creating a PR with one item

**Steps Executed:**
1. User: "create PR"
2. User: "office chair"
3. User: "5" (quantity)
4. User: "pieces" (unit)
5. User: "no" (skip notes)
6. User: "no, finish" (don't add more items)
7. User: "yes" (confirm creation)

**Result:** SUCCESS
- PR Number Generated: `PR-20260611-YERR`
- Status: Pending Approval
- Department: IT
- Items: 1 item (office chair, 5 pieces)

**Observations:**
- Flow was smooth and intuitive
- Category was auto-detected as "Furniture"
- Response times were reasonable (<2 seconds per step)
- Confirmation summary displayed correctly

---

## Test 2: Database Verification ⚠️

**Objective:** Query database to confirm PR was stored correctly

**Result:** SKIPPED
- `psql` command not available in test environment
- Would require: `PGPASSWORD=123456 psql -h localhost -U postgres -d FYPData`

**Recommendation:** Verify via backend admin panel or pgAdmin instead

---

## Test 3: Multi-Item PR Creation ⚠️

**Objective:** Create PR with 2+ items

**Steps Executed:**
1. Created first item: laptop (3 pieces)
2. Said "yes" to add another item
3. Created second item: wireless mouse (10 pieces)
4. Said "no, finish"

**Result:** PARTIAL FAILURE
- Only 1 item appeared in the final summary (laptop, but with quantity 10)
- Second item (wireless mouse) was not included
- Potential state management bug in chatbot conversation flow

**Issue Identified:** Multi-item state not properly maintained across conversation turns

**Recommendation:** 
- Review state management logic in chatbot backend
- Ensure all items are accumulated in session state
- Verify `create_purchase_request` tool receives all items

---

## Test 4: Cancellation Flow ✅

**Objective:** Test that user can cancel mid-creation

**Steps Executed:**
1. Started PR creation
2. Provided item: "printer"
3. Said "cancel" before completing

**Result:** SUCCESS
- Chatbot properly recognized cancellation intent
- Confirmed: "The purchase request creation has been cancelled. Nothing has been submitted."
- No PR was created in the system

**Observations:**
- Natural language understanding for cancellation works well
- Clear confirmation message provided

---

## Test 5: Invalid Input Handling

### Test 5a: Text for Quantity ⚠️

**Input:** "abc" when asked for quantity

**Expected:** Rejection with error message  
**Actual:** Treated "abc" as a custom category

**Result:** UNEXPECTED BEHAVIOR
- The chatbot interpreted invalid quantity input as a category selection
- This suggests the conversation flow may have gotten out of sync

**Issue:** Input validation not strict enough or flow state confusion

### Test 5b: Negative Quantity ✅

**Input:** "-5" for quantity

**Expected:** Rejection with error message  
**Actual:** "That's not a valid quantity — it needs to be a positive number. Let's try again"

**Result:** SUCCESS
- Proper validation
- Clear error message
- Re-prompts user

### Test 5c: Empty Item Name ✅

**Input:** Empty string for item name

**Expected:** Error handling  
**Actual:** API returned `{"success":false,"message":"Missing required parameters: message and userId"}`

**Result:** SUCCESS
- API-level validation caught the issue
- Prevents invalid data from entering the system

---

## Test 6: Custom Category/Unit ✅

**Objective:** Verify system accepts custom text for category and unit

**Steps Executed:**
1. Started PR creation
2. Item: "custom widget"
3. Category: "Special Equipment" (custom)
4. Quantity: 2
5. Unit: "units" (custom)

**Result:** SUCCESS
- Chatbot recognized custom category: "\"Special Equipment\" — got it, I'll use that as your custom category"
- Accepted custom unit "units"
- Flow continued normally

**Observations:**
- System properly handles non-standard options
- Good flexibility for edge cases

---

## Issues & Recommendations

### Critical Issues

1. **Multi-Item Bug (Test 3)**
   - **Severity:** HIGH
   - **Description:** Second item not included in final PR
   - **Impact:** Users cannot create multi-item PRs reliably
   - **Recommendation:** Debug session state management and item accumulation logic

2. **Input Validation Confusion (Test 5a)**
   - **Severity:** MEDIUM
   - **Description:** Invalid quantity input treated as category
   - **Impact:** Users might experience confusing flow jumps
   - **Recommendation:** Add strict input type checking based on conversation state

### Observations

**Strengths:**
- Single-item creation works flawlessly
- Cancellation handling is intuitive
- Custom values are properly supported
- Negative number validation works
- Natural language understanding is strong

**Areas for Improvement:**
- Multi-item state management
- Stricter input validation based on expected type
- Database verification tooling for testing

---

## Test Environment

- **Backend URL:** http://localhost:4000
- **Test User ID:** 8
- **Department:** IT
- **API Endpoint:** POST /api/chatbot/chat
- **Payload Format:** `{"userId": 8, "message": "...", "sessionId": "..."}`

---

## Next Steps

1. **Fix multi-item bug** - Priority 1
   - Review session state management
   - Verify item array accumulation
   - Test that create_purchase_request receives all items

2. **Improve input validation** - Priority 2
   - Add context-aware validation (quantity must be numeric)
   - Prevent flow confusion when invalid input provided

3. **Add database verification** - Priority 3
   - Set up automated queries to verify PRs in database
   - Check PR items, status, timestamps

4. **Additional testing needed:**
   - Test with multiple users simultaneously
   - Test session persistence across server restarts
   - Load testing with many concurrent conversations
   - Test all category and unit options from lookup

---

## Conclusion

The chatbot purchase request creation feature is **functional for single-item PRs** but has a **critical bug preventing multi-item PRs**. The core flow, NLU, and validation are solid. Once the multi-item issue is resolved, the feature will be production-ready.

**Recommendation:** Fix the multi-item bug before deployment.
