// 测试 setImmediate 中的 console.log 是否会被输出

console.log("1️⃣ 同步日志 - 脚本开始");

setTimeout(() => {
  console.log("2️⃣ setTimeout 中的日志");
}, 100);

setImmediate(() => {
  console.log("3️⃣ setImmediate 中的日志");
  
  // 模拟异步函数调用
  (async () => {
    console.log("4️⃣ setImmediate 内部的异步函数日志");
    
    // 模拟更深层的调用
    await Promise.resolve();
    console.log("5️⃣ Promise 完成后的日志");
  })();
});

process.nextTick(() => {
  console.log("6️⃣ process.nextTick 中的日志");
});

console.log("7️⃣ 同步日志 - 脚本结束前");

setTimeout(() => {
  console.log("8️⃣ 最后的清理日志");
  process.exit(0);
}, 500);
