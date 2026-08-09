// Direct test of email notification system
import 'dotenv/config';
import { sendSystemNotificationEmail } from './services/emailNotifications.js';

async function testEmail() {
  console.log("Testing email notification system...\n");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? '***configured***' : 'NOT SET');
  console.log("");

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
