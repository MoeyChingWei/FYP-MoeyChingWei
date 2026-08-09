import "dotenv/config";
import { sendSystemNotificationEmail } from "./services/emailNotifications.js";

async function test() {
  const result = await sendSystemNotificationEmail({
    to: ["chingweimoey@1utar.my"],
    subject: "测试 sent 标志",
    text: "测试邮件",
    html: "<p>测试邮件</p>",
  });
  
  console.log("\n返回结果:");
  console.log("result?.sent =", result?.sent);
  console.log("result?.accepted =", result?.accepted);
  console.log("result?.rejected =", result?.rejected);
  console.log("\n完整 result 对象:");
  console.log(JSON.stringify(result, null, 2));
  
  if (!result?.sent) {
    console.log("\n❌ 条件 if (!result?.sent) 为 TRUE - 进入警告分支");
  } else {
    console.log("\n✅ 条件 if (!result?.sent) 为 FALSE - 进入成功日志分支");
  }
}

test();
