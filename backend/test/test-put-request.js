import "dotenv/config";

const testData = {
  rows: [{
    localId: "test-pr-002",
    prNumber: "PR-TEST-002",
    status: "SUBMITTED",
    requesterRole: "EMPLOYEE",
    createdByEmail: "chingweimoey@1utar.my"
  }]
};

console.log("📡 发送 PUT 请求到 /api/workflow/purchase-requests...\n");

fetch("http://localhost:4000/api/workflow/purchase-requests", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => {
    console.log("\n✅ 响应:", data);
    console.log("\n等待 3 秒查看 backend 日志...");
    setTimeout(() => process.exit(0), 3000);
  })
  .catch(err => {
    console.error("\n❌ 错误:", err.message);
    process.exit(1);
  });
