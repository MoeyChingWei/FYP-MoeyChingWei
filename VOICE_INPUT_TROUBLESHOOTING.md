# 语音输入故障排除指南

## 🔴 错误: "Operation failed"

### 可能的原因和解决方案

#### 1️⃣ 麦克风权限未授予
**症状**: 点击麦克风按钮后立即显示 "Operation failed"

**解决方案**:
1. 检查浏览器地址栏左侧的图标
2. 点击图标 → 网站设置
3. 找到"麦克风"权限
4. 将其设置为"允许"
5. 刷新页面重试

**Chrome步骤**:
```
地址栏左侧 🔒 → 网站设置 → 麦克风 → 允许
```

#### 2️⃣ 浏览器不支持Web Speech API
**症状**: 按钮显示为禁用状态（静音图标）

**解决方案**:
- ✅ 使用 Chrome (推荐)
- ✅ 使用 Edge
- ✅ 使用 Safari
- ❌ 避免使用 Firefox (不支持)

#### 3️⃣ HTTPS要求
**症状**: 在localhost以外的地方无法使用

**解决方案**:
- Web Speech API 需要 HTTPS 连接
- localhost 和 127.0.0.1 可以使用 HTTP
- 生产环境必须使用 HTTPS

#### 4️⃣ 麦克风硬件问题
**症状**: 权限已授予但仍然失败

**解决方案**:
1. 检查麦克风是否已连接
2. 在系统设置中测试麦克风
3. 确保没有其他应用占用麦克风

**Windows测试**:
```
设置 → 系统 → 声音 → 输入 → 测试麦克风
```

## 🐛 调试步骤

### 第1步: 打开浏览器开发者工具
1. 按 `F12` 或 `Ctrl+Shift+I`
2. 切换到 **Console** 标签

### 第2步: 查看控制台日志
点击麦克风按钮后，应该看到：
```
Starting voice input...
Speech recognition initialized with language: en-US
```

### 第3步: 检查错误信息
如果有错误，会显示：
```
Speech recognition error: [错误类型]
```

#### 常见错误类型:
- `not-allowed` → 麦克风权限被拒绝
- `no-speech` → 没有检测到语音
- `aborted` → 识别被中断
- `audio-capture` → 无法访问麦克风硬件
- `network` → 网络连接问题

### 第4步: 测试语音识别
1. 点击麦克风按钮（应该变红色并开始脉冲动画）
2. 清楚地说话（英文）
3. 等待识别完成
4. 查看文字是否出现在输入框中

### 第5步: 查看成功日志
成功时应该看到：
```
Voice transcript: [你说的话]
Voice recognized successfully!
Voice recorded successfully!
```

## 📋 快速检查清单

- [ ] 使用的是 Chrome 或 Edge 浏览器
- [ ] 麦克风权限已授予（检查地址栏图标）
- [ ] 麦克风硬件正常工作
- [ ] 网站使用 HTTPS 或 localhost
- [ ] 浏览器控制台没有错误信息
- [ ] 点击按钮后按钮变红色
- [ ] 说话后有语音识别结果

## 🔧 手动测试Web Speech API

在浏览器控制台运行以下代码测试：

```javascript
// 检查浏览器支持
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  console.log('✅ Browser supports Web Speech API');
  
  // 创建识别实例
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  
  recognition.onstart = () => console.log('🎤 Listening...');
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('📝 Transcript:', transcript);
  };
  recognition.onerror = (event) => console.error('❌ Error:', event.error);
  
  // 开始识别
  recognition.start();
  console.log('Started! Speak now...');
} else {
  console.error('❌ Browser does not support Web Speech API');
}
```

## 🌐 支持中文语音识别

如果你想使用中文语音识别，修改 `VoiceInput.tsx`:

```typescript
recognitionInstance.lang = 'zh-CN'; // 中文
// 或
recognitionInstance.lang = 'zh-TW'; // 繁体中文
```

## 📱 移动设备支持

### iOS Safari
- ✅ 支持但需要用户手势触发
- 需要 HTTPS

### Android Chrome
- ✅ 完全支持
- 需要麦克风权限

## 🔍 进阶调试

### 检查权限状态
```javascript
navigator.permissions.query({ name: 'microphone' }).then(result => {
  console.log('Microphone permission:', result.state);
  // 'granted', 'denied', or 'prompt'
});
```

### 检测麦克风设备
```javascript
navigator.mediaDevices.enumerateDevices().then(devices => {
  const mics = devices.filter(d => d.kind === 'audioinput');
  console.log('Microphones found:', mics.length);
  mics.forEach(mic => console.log('- ', mic.label || 'Unnamed'));
});
```

## 📞 获取帮助

如果以上步骤都无法解决问题，请提供：
1. 浏览器类型和版本
2. 操作系统
3. 控制台的完整错误信息
4. 麦克风权限状态截图

## 🔄 更新日志

### 最新更改 (2026-06-21)
- ✅ 添加了详细的错误消息
- ✅ 添加了控制台日志用于调试
- ✅ 改进了错误处理
- ✅ 添加了语言设置说明

---
更新时间: 2026-06-21
