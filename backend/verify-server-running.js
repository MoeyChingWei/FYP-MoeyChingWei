// 快速检查服务器是否运行
fetch("http://localhost:4000/")
  .then(res => res.text())
  .then(text => {
    console.log("✅ 服务器正在运行:", text);
    console.log("\n现在你可以:");
    console.log("1. 在前端提交一个新的 Purchase Request");
    console.log("2. 观察 backend 终端是否显示 'Notification email sent:' 日志");
    console.log("\n或者运行: node test-put-request.js 来模拟前端请求");
  })
  .catch(err => {
    console.log("❌ 服务器未运行 - 请先启动: npm run dev");
  });
