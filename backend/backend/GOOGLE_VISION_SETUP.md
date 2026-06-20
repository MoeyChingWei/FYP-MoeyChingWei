# Google Cloud Vision API 集成指南

## 步骤 1：创建 Google Cloud 账号

1. 访问 https://console.cloud.google.com
2. 使用 Google 账号登录（或创建新账号）
3. 接受服务条款

**注意：** 需要信用卡验证，但有每月 1000 次免费额度

---

## 步骤 2：创建项目并启用 Vision API

1. 在 Google Cloud Console 创建新项目
   - 项目名称：`optimind-chatbot`（或任意名称）

2. 启用 Cloud Vision API
   - 搜索 "Vision API"
   - 点击 "启用"

---

## 步骤 3：创建服务账号并下载密钥

1. 导航到 **IAM & Admin > Service Accounts**
2. 点击 **Create Service Account**
   - 名称：`vision-api-service`
   - 角色：选择 **Cloud Vision API User**
3. 创建后，点击服务账号
4. 进入 **Keys** 标签
5. 点击 **Add Key > Create new key**
6. 选择 **JSON** 格式
7. 下载密钥文件（例如：`vision-service-account.json`）

---

## 步骤 4：配置后端

### 4.1 安装依赖

```bash
cd backend
npm install @google-cloud/vision
```

### 4.2 放置密钥文件

将下载的 JSON 密钥文件放到后端目录：
```
backend/
  ├── vision-service-account.json  ← 放在这里
  ├── .env
  └── ...
```

**重要：** 将密钥文件添加到 `.gitignore`：
```bash
echo "vision-service-account.json" >> backend/.gitignore
```

### 4.3 配置环境变量

编辑 `backend/.env`：
```env
# Google Cloud Vision API
GOOGLE_APPLICATION_CREDENTIALS=./vision-service-account.json
VISION_PROVIDER=google

# 删除或注释掉 OpenAI 配置
# OPENAI_API_KEY=...
# VISION_MODEL=...
```

---

## 步骤 5：测试

### 5.1 重启后端

```bash
cd backend
npm run dev
```

### 5.2 测试图片分析

1. 打开前端 http://localhost:3000
2. 进入 AI Assistant
3. 上传一张图片
4. 发送消息
5. 查看 AI 回复和图片分析结果

---

## 验证配置

在后端控制台应该看到：
```
✅ Vision service initialized with provider: google
✅ Google Cloud Vision API ready
```

---

## 常见问题

### Q: 出现 "Permission denied" 错误
**A:** 确保服务账号有 "Cloud Vision API User" 角色

### Q: 出现 "Billing not enabled" 错误
**A:** 需要在 Google Cloud 启用账单功能（即使使用免费额度）

### Q: 找不到密钥文件
**A:** 检查 `GOOGLE_APPLICATION_CREDENTIALS` 路径是否正确

---

## 免费额度说明

- **每月免费：** 前 1000 次请求
- **计费方式：** 超过后按次收费
- **监控用量：** Google Cloud Console > Billing

---

**配置完成后告诉我，我会帮你测试！** 🚀
