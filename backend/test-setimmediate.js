console.log("1. 开始测试");

setImmediate(() => {
  console.log("3. setImmediate 回调执行");
  
  // 模拟异步操作
  setTimeout(() => {
    console.log("4. 异步操作完成");
  }, 100);
});

console.log("2. setImmediate 已排队");

setTimeout(() => {
  console.log("5. 主进程结束");
  process.exit(0);
}, 500);
