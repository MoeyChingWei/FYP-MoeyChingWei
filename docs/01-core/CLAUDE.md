# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ IMPORTANT: Complete Documentation Available

**All comprehensive documentation has been consolidated into `DOCUMENTATION.md`**

For detailed information about:
- Project overview and architecture
- Backend API documentation
- Frontend page routes and components
- Development workflows
- Database schema
- Migration guide
- Troubleshooting

**Please read `DOCUMENTATION.md` first.**

---

## Quick Reference for Development

### Before Making Changes

1. **Backend changes:** Read `docs/02-setup-guides/backend/README.md` for exact file locations
2. **Frontend changes:** Read `docs/02-setup-guides/frontend/README.md` for exact file locations
3. **General information:** Read `docs/01-core/DOCUMENTATION.md`

**Do NOT search through the entire codebase.** The README files tell you exactly which files to modify.

---

## Project Overview

Full-stack ERP portal with React frontend and Node.js/Express backend, using PostgreSQL with Prisma ORM.

**Stack:**
- Frontend: React 18 + TypeScript + Webpack + Ant Design
- Backend: Node.js + Express 5 + Prisma 7
- Database: PostgreSQL 17 (database name: `FYPData`)

---

## Quick Start

### From Project Root

```bash
# Start frontend (port 3000)
npm start

# Start backend (port 4000)
npm run backend
```

### Backend Commands

```bash
cd backend
npm run dev              # Development with auto-reload
npm run admin:create     # Create super admin user
npm run prisma:generate  # Generate Prisma client after schema changes
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:migrate   # Create and apply migrations
```

### Frontend Commands

```bash
cd client
npm start      # Development server (port 3000)
npm run build  # Production build
```

---

## Development Workflow

### When Adding/Modifying Features

1. **Read the appropriate README first:**
   - Backend API → `docs/02-setup-guides/backend/README.md` → "How To Modify/Develop Features" section
   - Frontend UI → `docs/02-setup-guides/frontend/README.md` → "How To Modify/Develop Features" section

2. **Follow the README instructions** to locate exact files

3. **Make your changes**

4. **Test your changes**

5. **Update documentation** if needed (in `docs/01-core/DOCUMENTATION.md`)

---

## Important Notes

- Always run `npm run prisma:generate` after schema changes
- Frontend proxies `/api` and `/uploads` to `http://localhost:4000` in dev mode
- Default login: `admin@fyp.local` / `339595`
- Never commit `.env` files

---

## Coding Best Practices (Karpathy Guidelines)

**Plugin:** `andrej-karpathy-skills` installed and active

这些是减少常见AI编码错误的行为准则。在编写、审查或重构代码时使用。

### 1. Think Before Coding（先思考再编码）

**不要假设。不要隐藏困惑。表面化权衡。**

实施之前：
- 明确陈述你的假设。如果不确定，就问。
- 如果存在多种解释，呈现它们 - 不要默默选择。
- 如果存在更简单的方法，说出来。在需要时提出反对意见。
- 如果有什么不清楚，停下来。说明困惑的地方。提问。

### 2. Simplicity First（简单优先）

**解决问题的最少代码。没有推测性的东西。**

- 不要超出要求的功能。
- 单次使用的代码不要抽象。
- 不要添加未被要求的"灵活性"或"可配置性"。
- 不要为不可能的场景添加错误处理。
- 如果你写了200行但可以是50行，重写它。

问自己："资深工程师会说这太复杂吗？" 如果是，简化它。

### 3. Surgical Changes（外科手术式修改）

**只触碰必须的部分。只清理你自己的混乱。**

编辑现有代码时：
- 不要"改进"相邻的代码、注释或格式。
- 不要重构没坏的东西。
- 匹配现有风格，即使你会用不同方式。
- 如果注意到不相关的死代码，提及它 - 不要删除它。

当你的更改创建孤儿时：
- 删除你的更改使其未使用的导入/变量/函数。
- 不要删除预先存在的死代码，除非被要求。

测试：每个更改的行都应该直接追溯到用户的请求。

### 4. Goal-Driven Execution（目标驱动执行）

**定义成功标准。循环直到验证。**

将任务转换为可验证的目标：
- "添加验证" → "为无效输入编写测试，然后使其通过"
- "修复bug" → "编写重现它的测试，然后使其通过"
- "重构X" → "确保测试在之前和之后都通过"

对于多步骤任务，陈述简要计划：
```
1. [步骤] → 验证: [检查]
2. [步骤] → 验证: [检查]
3. [步骤] → 验证: [检查]
```

强成功标准让你能够独立循环。弱标准（"让它工作"）需要持续澄清。

---

**这些准则有效的标志：** diff中不必要的更改更少，因过度复杂导致的重写更少，澄清性问题出现在实施之前而不是错误之后。

---

For complete documentation, see **`docs/01-core/DOCUMENTATION.md`**
