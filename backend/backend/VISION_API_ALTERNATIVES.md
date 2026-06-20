# 使用 Google Cloud Vision API 替代方案

## 为什么需要图片分析？

当用户上传图片时，AI 可以：
- 识别图片内容（"这是一个登录页面"）
- 发现问题（"这里有个错误提示"）
- 回答问题（"图片显示了用户界面"）
- 提取文字（OCR）

就像你发给 Claude 图片，Claude 能看到并回答，聊天机器人也应该有这个能力。

---

## 选项 1：Google Cloud Vision API（推荐）

### 优点
- ✅ 每月 1000 次免费请求
- ✅ 功能强大（物体识别、OCR、场景理解）
- ✅ 官方支持，稳定可靠
- ✅ 容易集成

### 设置步骤

1. **创建 Google Cloud 账号**
   - 访问 https://cloud.google.com
   - 注册账号（需要信用卡验证，但有免费额度）

2. **启用 Vision API**
   - 进入 Google Cloud Console
   - 启用 "Cloud Vision API"
   - 创建服务账号
   - 下载 JSON 密钥文件

3. **配置环境变量**
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   VISION_PROVIDER=google
   ```

4. **安装依赖**
   ```bash
   cd backend
   npm install @google-cloud/vision
   ```

**代码修改：** 我可以帮你修改 `backend/services/vision-ai-service.js` 来支持 Google Vision API。

---

## 选项 2：Hugging Face（完全免费）

### 优点
- ✅ 完全免费
- ✅ 开源模型
- ✅ 不需要信用卡

### 缺点
- ⚠️ 速度较慢
- ⚠️ 准确度可能较低

### 设置步骤

1. **注册 Hugging Face**
   - 访问 https://huggingface.co
   - 免费注册账号
   - 获取 API token（免费）

2. **配置环境变量**
   ```env
   HUGGINGFACE_API_KEY=hf_your_token_here
   VISION_PROVIDER=huggingface
   ```

3. **安装依赖**
   ```bash
   cd backend
   npm install @huggingface/inference
   ```

**使用模型：** `Salesforce/blip-image-captioning-large`（图片描述）

---

## 选项 3：Azure Computer Vision（有免费额度）

### 优点
- ✅ 每月 5000 次免费请求
- ✅ 微软官方，稳定
- ✅ 功能全面

### 设置步骤

1. **创建 Azure 账号**
   - 访问 https://azure.microsoft.com
   - 注册免费账号

2. **创建 Computer Vision 资源**
   - 选择免费层 (F0)
   - 获取 API Key 和 Endpoint

3. **配置环境变量**
   ```env
   AZURE_VISION_KEY=your_key_here
   AZURE_VISION_ENDPOINT=https://your-endpoint.cognitiveservices.azure.com/
   VISION_PROVIDER=azure
   ```

---

## 我的建议：Google Cloud Vision

**理由：**
1. 每月 1000 次免费请求足够测试和小规模使用
2. 质量好，识别准确
3. 容易集成
4. 和现有代码结构兼容

**实施步骤：**
1. 注册 Google Cloud（10 分钟）
2. 我帮你修改代码支持 Google Vision（5 分钟）
3. 测试图片分析功能

---

## 你想选哪个？

如果你想要我现在就帮你实现，告诉我：

**选项 A：** Google Cloud Vision（最推荐）
**选项 B：** Hugging Face（完全免费）
**选项 C：** Azure Computer Vision
**选项 D：** 先跳过，以后再说

我可以立即帮你修改代码来支持你选择的服务！
