# Google Vision API 设置指南

## 问题诊断

**当前状态：**
- ✅ 服务账号 JSON 文件存在
- ✅ 配置正确指向 JSON 文件
- ❌ Vision API 未在正确的项目中启用

**错误原因：**
- 服务账号属于项目：`myfypproject-83c6e`
- 但 Vision API 可能在另一个项目中启用了：`1090859330441`

## 解决步骤

### 1. 确认当前项目

访问：https://console.cloud.google.com/

在顶部导航栏，确认选中的项目是：**myfypproject-83c6e**

### 2. 在正确项目中启用 Vision API

**方法 A - 直接链接（推荐）：**

访问这个链接（已自动选择正确的项目）：
```
https://console.cloud.google.com/apis/library/vision.googleapis.com?project=myfypproject-83c6e
```

点击 **"ENABLE"** 或 **"启用"** 按钮。

**方法 B - 手动导航：**

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 在顶部项目选择器中，选择 **myfypproject-83c6e**
3. 左侧菜单 → **APIs & Services** → **Library**
4. 搜索 **"Cloud Vision API"**
5. 点击进入
6. 点击 **"Enable"** / **"启用"**

### 3. 验证 API 已启用

启用后，访问：
```
https://console.cloud.google.com/apis/dashboard?project=myfypproject-83c6e
```

你应该在"已启用的 API"列表中看到 **Cloud Vision API**。

### 4. 等待生效

- API 启用后需要 **2-10 分钟**传播到 Google 系统
- 在此期间可能仍会看到错误

### 5. 重启后端测试

```bash
# 停止后端
Ctrl + C

# 重启后端
npm start
```

### 6. 测试图片上传

- 刷新前端页面
- 创建新对话
- 上传图片
- 观察后端日志

**成功的日志应该显示：**
```
🔍 Analyzing 1 image(s) before AI response
✅ Image analysis complete for: image.png
```

## 可能的其他问题

### 问题：服务账号没有权限

如果启用 API 后仍然失败，可能需要给服务账号添加权限：

1. 访问：https://console.cloud.google.com/iam-admin/iam?project=myfypproject-83c6e
2. 找到服务账号：`fyp-imagevision-api@myfypproject-83c6e.iam.gserviceaccount.com`
3. 点击编辑（铅笔图标）
4. 添加角色：**Cloud Vision API User** 或 **Editor**
5. 保存

### 问题：文件路径错误

如果 API 正常但仍然无法读取图片，可能是文件路径问题。

检查后端日志是否显示类似：
```
❌ Error: File not found: ./uploads/xxx.png
```

如果是这个问题，需要修改 `vision-ai-service.js` 中的路径处理。

## 费用说明

Google Vision API 免费额度：
- 前 1,000 次请求/月：免费
- 超出后：约 $1.50 / 1,000 次请求

对于测试和小型项目，免费额度通常足够。

## 支持

如果以上步骤都完成了但仍然无法工作，请提供：
1. 后端完整的错误日志
2. Google Cloud Console 的 API Dashboard 截图
3. 确认 Vision API 在正确项目中已启用
