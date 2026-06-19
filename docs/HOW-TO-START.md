# 🚀 OptiMind ERP 启动指南

## 快速启动

### 方式1: 使用启动脚本（推荐）⭐

**双击运行**：
```
START.bat    (Windows命令提示符版本)
```

或

```
START.ps1    (PowerShell版本)
```

脚本会自动：
1. ✅ 检查Node.js
2. ✅ 检查并启动PostgreSQL
3. ✅ 启动后端服务器（端口4000）
4. ✅ 启动前端服务器（端口3000）
5. ✅ 自动打开浏览器

---

### 方式2: 手动启动

**步骤1: 启动后端**
```bash
cd backend
npm run dev
```
等待显示: `Server running on port 4000`

**步骤2: 启动前端**（新终端）
```bash
cd client
npm start
```
等待显示: `Compiled successfully!`

**步骤3: 访问系统**
```
http://localhost:3000
```

---

## ⚠️ 常见问题

### Q1: 重启电脑后ChatBot显示500错误？

**原因**: 后端服务器没有运行

**解决**: 运行 `START.bat` 或手动启动后端
```bash
cd backend
npm run dev
```

### Q2: 端口被占用？

**查看占用进程**:
```powershell
netstat -ano | findstr :4000
netstat -ano | findstr :3000
```

**停止进程**:
```powershell
Stop-Process -Id [PID] -Force
```

### Q3: PostgreSQL没有运行？

**启动服务**:
```powershell
Start-Service postgresql-x64-18
```

**设置自动启动**:
```powershell
Set-Service postgresql-x64-18 -StartupType Automatic
```

### Q4: npm run dev 报错？

**重新安装依赖**:
```bash
cd backend
npm install

cd ../client
npm install
```

---

## 📋 启动检查清单

每次重启电脑后，确保：

- [ ] PostgreSQL服务正在运行
- [ ] 后端服务器已启动（端口4000）
- [ ] 前端开发服务器已启动（端口3000）
- [ ] 浏览器能访问 http://localhost:3000

---

## 🛠️ 故障排查

### 检查后端状态
```bash
# 测试后端API
curl http://localhost:4000/api/chatbot/new-session -X POST -H "Content-Type: application/json" -d "{\"userId\":1}"
```

### 查看后端日志
查看终端输出，寻找错误信息

### 查看前端日志
打开浏览器 F12 → Console 标签

---

## 💡 开发模式 vs 生产模式

### 开发模式（当前）
- 使用 `npm run dev` 和 `npm start`
- 每次重启都需要手动启动
- 热重载，修改代码自动刷新

### 生产模式（部署时）
- 使用 PM2 或 Windows服务
- 开机自动启动
- 后台运行

---

## 🎯 为什么重启后会500错误？

```
重启电脑
    ↓
所有进程都停止
    ↓
PostgreSQL: ✅ 自动启动（已设置）
后端服务器: ❌ 没有启动
前端服务器: ❌ 没有启动
    ↓
前端尝试调用后端API
    ↓
后端无响应 → 500错误
```

**解决方案**: 
- 每次开机后运行 `START.bat`
- 或按照"生产部署"方式设置自动启动

---

## 📞 需要帮助？

遇到问题时：
1. 检查上面的常见问题
2. 查看终端错误信息
3. 查看浏览器Console
4. 查看 PROJECT-LOG.md 的FAQ部分

---

**创建日期**: 2026-06-10  
**用途**: 解决重启后500错误问题
