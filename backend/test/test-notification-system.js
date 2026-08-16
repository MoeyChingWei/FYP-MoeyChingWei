// 测试邮件通知系统是否正常工作
import "dotenv/config";
import { sendSystemNotificationEmail } from "./services/emailNotifications.js";

console.log("\n🧪 测试邮件通知系统...\n");

async function testEmailNotification() {
  try {
    const result = await sendSystemNotificationEmail({
      to: ["chingweimoey@1utar.my"],
      subject: "[测试] OptiMind 邮件通知系统测试",
      text: "这是一封测试邮件，用于验证邮件通知系统是否正常工作。",
      html: "<h3>测试邮件</h3><p>这是一封测试邮件，用于验证邮件通知系统是否正常工作。</p>",
    });

    if (result.sent) {
      console.log("✅ 邮件发送成功！");
      console.log("📧 详细信息:", {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      });
    } else {
      console.log("❌ 邮件发送失败");
      console.log("原因:", result.reason);
    }
  } catch (error) {
    console.error("❌ 测试过程中出错:", error);
  }
}

testEmailNotification();
