# Test Instructions: Department Executive Email Notification Issue

## System Status
✅ Backend server running on port 4000
✅ Frontend running on port 3000
✅ SMTP configuration verified and working
✅ Department Executive user has valid email: fypexecutive@gmail.com
✅ Debug logging enabled in `services/notifications.js`

## Test Steps

### Step 1: Log in as Employee User
1. Open browser: http://localhost:3000
2. Log in with Employee credentials
3. Navigate to Purchase Request creation page

### Step 2: Submit a Purchase Request
1. Fill out the PR form with at least one item
2. Click "Submit" button
3. Verify the PR status changes to "SUBMITTED"

### Step 3: Monitor Backend Console Output
**IMMEDIATELY after submitting the PR, check the backend console for these debug messages:**

Look for this pattern in `backend/server-output.log`:
```
📧 [EMAIL-DEBUG] sendRoleEventEmails called: {
  totalUsers: <number>,
  extractedEmails: [<emails>],
  emailCount: <number>,
  notificationTitle: "<notification title>"
}
```

### Step 4: Check Department Executive Notifications
1. Log out from Employee account
2. Log in as Department Executive (fypexecutive@gmail.com)
3. Check:
   - ✅ In-app notification (bell icon) - should show "New Purchase Request Pending Approval"
   - ❌ Email notification to fypexecutive@gmail.com - currently NOT working

## What the Debug Logs Will Tell Us

The debug output will reveal:

1. **If `sendRoleEventEmails()` is being called at all**
   - If NO debug output appears → the notification flow isn't triggering
   
2. **How many Department Executive users were found**
   - `totalUsers: 0` → user lookup is failing
   - `totalUsers: 1+` → user lookup is working
   
3. **What email addresses were extracted**
   - `extractedEmails: []` → email extraction logic is failing
   - `extractedEmails: ["fypexecutive@gmail.com"]` → extraction working correctly
   
4. **Whether the "No valid emails" warning appears**
   - If warning appears → explains why emails aren't sent
   - If no warning → the SMTP call should be executing

## Expected vs Actual Behavior

### Expected:
- In-app notification ✅ (working)
- Email to fypexecutive@gmail.com ✅ (should work but doesn't)

### Actual:
- In-app notification ✅ (working)
- Email to fypexecutive@gmail.com ❌ (not received)

## Commands to Check Logs

```bash
# View full backend log
cd /c/Users/mch/Desktop/FYP/FYP-MoeyChingWei/backend
cat server-output.log

# Watch logs in real-time
tail -f server-output.log

# Search for email debug messages
grep "EMAIL-DEBUG" server-output.log
```

## Next Steps After Test

Once you complete the test and capture the debug output, share:
1. The complete debug log output from when you submitted the PR
2. Whether the Department Executive received the in-app notification
3. Whether the Department Executive received the email

The debug logs will definitively show where the email notification flow is breaking.
