import "dotenv/config";
import { processWorkflowNotifications } from "./services/notifications.js";

console.log("🧪 测试 processWorkflowNotifications 调用...\n");

// 模拟一个新的采购请求被创建
const previousRows = [];
const nextRows = [{
  localId: "test-pr-001",
  payload: {
    localId: "test-pr-001",
    prNumber: "PR-TEST-001",
    status: "SUBMITTED",
    requesterRole: "EMPLOYEE",
    createdByEmail: "chingweimoey@1utar.my"
  }
}];

processWorkflowNotifications("purchase-requests", previousRows, nextRows)
  .then(() => {
    console.log("\n✅ processWorkflowNotifications 完成");
    setTimeout(() => process.exit(0), 2000);
  })
  .catch((err) => {
    console.error("\n❌ 错误:", err);
    process.exit(1);
  });
