// Direct test of email notification system
const { sendSystemNotificationEmail } = require('./services/emailNotifications.js');

async function testEmail() {
  console.log("Testing email notification system...\n");
  
  const result = await sendSystemNotificationEmail({
    to: ['chingweimoey@gmail.com'],
    subject: '[TEST] Department Executive PR Approval Test',
    text: 'This is a test email to verify SMTP is working for Department Executive notifications.',
    html: '<h3>Test Notification</h3><p>This is a test email to verify SMTP is working for Department Executive notifications.</p>',
  });
  
  console.log("Email send result:", JSON.stringify(result, null, 2));
}

testEmail().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
