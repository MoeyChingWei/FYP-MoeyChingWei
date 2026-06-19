# Sources Feature Implementation Summary

## ✅ 完成的功能

### 1. 数据库 Schema
- ✅ 添加 `Source` 表：存储上传文件的元数据
- ✅ 添加 `SourceChunk` 表：存储文本分块（用于 RAG）
- ✅ 关联 `User` 和 `ChatSession`
- ✅ 数据库迁移完成（使用 `prisma db push`）

### 2. Backend API (`/api/sources`)
- ✅ `POST /upload` - 上传文件并自动分块
- ✅ `GET /` - 获取用户的 sources 列表
- ✅ `DELETE /:id` - 删除 source 和物理文件
- ✅ 支持的文件类型：PDF, CSV, Excel, TXT, Word
- ✅ 文件大小限制：10MB
- ✅ 自动文本解析和分块（1000字符/块）

### 3. Frontend UI
- ✅ Sources Tab 在 ChatBotPage
- ✅ 文件上传按钮（拖拽支持）
- ✅ Sources 列表展示（文件名、大小、日期）
- ✅ 删除 source 功能
- ✅ 加载状态和错误处理
- ✅ TypeScript 类型定义

### 4. 文件存储
- ✅ 上传目录：`backend/uploads/sources/`
- ✅ 唯一文件名生成：`timestamp-uuid.ext`
- ✅ 自动清理：删除 source 时同时删除物理文件

---

## 🎯 使用场景

用户可以：
1. 上传供应商报价单（PDF/Excel）
2. 上传产品目录（CSV）
3. 上传合同文档（Word/PDF）
4. AI 基于上传的文档回答问题（Phase 2 实现）

---

## 📂 文件清单

### Backend
- `backend/prisma/schema.prisma` - 数据库 schema（新增 Source、SourceChunk）
- `backend/routes/sources.js` - Sources API 路由
- `backend/server.js` - 注册 sources 路由
- `backend/uploads/sources/` - 上传文件存储目录

### Frontend
- `client/src/FrontEnd/shared/api/sources.ts` - API 封装
- `client/src/FrontEnd/pages/ChatBotPage.tsx` - UI 集成

---

## 🚀 如何测试

### 1. 启动 Backend
```bash
cd backend
npm run dev
```

### 2. 启动 Frontend
```bash
cd client
npm start
```

### 3. 测试步骤
1. 打开 http://localhost:3000
2. 登录系统
3. 进入 AI Assistant 页面
4. 点击 "Sources" Tab
5. 点击 "Upload Document" 按钮
6. 选择文件（PDF/CSV/Excel/TXT/Word）
7. 查看上传成功的文件列表
8. 点击删除按钮测试删除功能

---

## 🔧 Phase 2: RAG 集成（待实现）

### 当前状态
- ✅ 文件已上传
- ✅ 文本已分块并存储在数据库
- ⏳ AI 对话时检索相关文档内容
- ⏳ 将检索结果注入到 DeepSeek API 提示词

### 实现方案
修改 `backend/agents/chatbot/chatbot-agent.js`：

```javascript
async chat({ userId, message, sessionId }) {
  // ... 现有代码 ...

  // 新增：检索用户上传的 sources
  const relevantChunks = await this.searchRelevantSources(userId, message);

  // 构建增强的系统提示词
  const systemPrompt = this.buildSystemPrompt(user) + `

## Uploaded Documents Context

${relevantChunks.map(chunk => chunk.content).join('\n\n')}

When answering, reference these documents if relevant.
`;

  // ... 调用 DeepSeek API ...
}

async searchRelevantSources(userId, query) {
  // 简单版本：返回所有用户的 chunks
  const sources = await prisma.source.findMany({
    where: { userId },
    include: { chunks: true }
  });

  const allChunks = sources.flatMap(s => s.chunks);
  
  // TODO: 添加向量搜索（使用 embedding）来找到最相关的 chunks
  return allChunks.slice(0, 5); // 暂时返回前5个
}
```

### 进阶：向量搜索（可选）
1. 使用 OpenAI Embeddings API 或本地模型生成向量
2. 存储 embeddings 到 PostgreSQL（pgvector 扩展）
3. 基于语义相似度检索最相关的 chunks

---

## 📊 数据库表结构

### `sources` 表
```sql
CREATE TABLE "sources" (
  "id" TEXT PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "sessionId" TEXT,
  "fileName" TEXT NOT NULL,
  "filePath" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "uploadedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("sessionId") REFERENCES "chat_sessions"("id") ON DELETE CASCADE
);
```

### `source_chunks` 表
```sql
CREATE TABLE "source_chunks" (
  "id" TEXT PRIMARY KEY,
  "sourceId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "chunkIndex" INTEGER NOT NULL,
  FOREIGN KEY ("sourceId") REFERENCES "sources"("id") ON DELETE CASCADE
);
```

---

## ⚠️ 注意事项

1. **文件大小限制**：当前限制 10MB，可根据需求调整
2. **存储空间**：定期清理无用文件
3. **安全性**：
   - 文件类型白名单验证
   - 用户所有权验证（删除时）
   - 文件名唯一化防止覆盖
4. **性能**：
   - 大文件解析可能耗时（考虑异步处理）
   - Chunk 数量较多时需要优化检索

---

## 🎉 完成状态

✅ **MVP 功能已完成**
- 用户可以上传文档
- 查看已上传的文档列表
- 删除不需要的文档
- 文档内容已自动分块存储

⏳ **Phase 2（可选）**
- AI 对话时基于上传的文档回答问题
- 向量搜索优化相关性

---

需要实现 Phase 2 的 RAG 集成吗？还是先测试一下现有功能？
