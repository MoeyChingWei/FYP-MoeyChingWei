import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

app.post("/test", (req, res) => {
  console.log("🔵 [REQUEST] 收到请求");
  
  // 立即返回响应
  res.json({ success: true, message: "响应已发送" });
  console.log("📤 [RESPONSE] 响应已发送给客户端");
  
  // 在 setImmediate 中执行异步操作
  setImmediate(() => {
    console.log("⏱️ [setImmediate] 回调开始执行");
    
    (async () => {
      console.log("🔄 [ASYNC] 异步函数开始");
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log("✅ [ASYNC] 异步操作完成 - 这条日志应该显示");
    })().catch(err => {
      console.error("❌ [ERROR] 异步操作出错:", err);
    });
  });
});

const server = app.listen(4001, () => {
  console.log("🚀 测试服务器运行在 http://localhost:4001");
  console.log("📡 请在另一个终端运行: curl -X POST http://localhost:4001/test -H \"Content-Type: application/json\" -d \"{}\"");
});

// 10秒后自动关闭
setTimeout(() => {
  console.log("\n⏰ 测试结束，关闭服务器");
  server.close();
  process.exit(0);
}, 10000);
