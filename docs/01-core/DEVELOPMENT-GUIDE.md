# Development Guide

**Complete guide for developing OptiMind ERP System**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Quick Start](#quick-start)
4. [Development Workflow](#development-workflow)
5. [File Structure](#file-structure)
6. [Code Patterns](#code-patterns)
7. [Documentation Updates](#documentation-updates)
8. [Testing Guidelines](#testing-guidelines)

---

## Project Overview

**OptiMind ERP System** - Full-stack enterprise resource planning portal

**Key Features:**
- Purchase request management
- AI-powered chatbot assistant
- Multi-language support (i18n)
- Voice input capabilities
- Data export functionality
- Department-based tracking

**Architecture:**
- Frontend: React 18 SPA (Single Page Application)
- Backend: RESTful API with Express 5
- Database: PostgreSQL 17 with Prisma ORM
- AI: Claude API integration for chatbot

**Default Credentials:**
- Email: `admin@fyp.local`
- Password: `339595`

---

## Technology Stack

### Frontend

**Core:**
- React 18.2 (Functional Components only)
- TypeScript 4.9
- Webpack 5

**UI Library:**
- Ant Design 5.x (antd)
- Custom CSS for specific styling

**State Management:**
- React Context API
- ❌ NOT Redux

**HTTP Client:**
- Fetch API
- ❌ NOT Axios

**Routing:**
- React Router v6

### Backend

**Core:**
- Node.js 18+
- Express 5
- Prisma ORM 7

**Database:**
- PostgreSQL 17
- Database name: `FYPData`

**API Integration:**
- Claude API (Anthropic)
- Google Vision API

**Patterns:**
- Async/await (NOT callbacks)
- RESTful API design
- MVC-like structure (routes → controllers → services)

### Development Tools

**Package Managers:**
- npm (primary)

**Database Tools:**
- Prisma Studio (visual editor)
- Prisma Migrate (schema migrations)

---

## Quick Start

### Initial Setup

```bash
# Clone repository
cd C:/Users/mch/Desktop/FYP/FYP-MoeyChingWei

# Install dependencies
npm install
cd client && npm install
cd ../backend && npm install
cd ..

# Setup database
cd backend
npx prisma generate
npx prisma migrate dev
npm run admin:create  # Create super admin user

# Setup environment variables
cp .env.example .env  # Edit with your values
```

### Daily Development

```bash
# Terminal 1: Start frontend
npm start
# Access: http://localhost:3000

# Terminal 2: Start backend
npm run backend
# Access: http://localhost:4000
```

### Common Commands

**Frontend:**
```bash
cd client
npm start           # Development server
npm run build       # Production build
npm test            # Run tests
```

**Backend:**
```bash
cd backend
npm run dev         # Development with auto-reload
npm start           # Production mode
npm run admin:create    # Create admin user
npm run prisma:generate # Generate Prisma client
npm run prisma:studio   # Open Prisma Studio
npm run prisma:migrate  # Run migrations
```

---

## Development Workflow

### Standard Process

```
1. Read commit message/task description
   ↓
2. Identify feature type (API/UI/Database/AI)
   ↓
3. Read relevant documentation:
   - docs/02-setup-guides/backend/README.md (for backend)
   - docs/02-setup-guides/frontend/README.md (for frontend)
   - docs/03-features/{feature}/ (for specific features)
   ↓
4. Locate exact files to modify (use README file mappings)
   ↓
5. Make changes following existing patterns
   ↓
6. Test locally (both frontend and backend)
   ↓
7. Run prisma:generate if schema changed
   ↓
8. Update documentation:
   - docs/01-core/PROJECT-LOG.md (always)
   - docs/01-core/DOCUMENTATION.md (if major feature)
   - docs/03-features/{feature}/ (if feature-specific)
   ↓
9. Create completion report in docs/04-implementation/completion-reports/
```

### Feature Type Identification

**Backend API Development:**
- Adding/modifying REST endpoints
- Business logic changes
- Database queries

**Frontend UI Development:**
- Adding/modifying pages
- Component updates
- UI/UX changes

**Chatbot AI Feature:**
- Chatbot command understanding
- AI response generation
- Agent functionality

**Database Schema:**
- Adding/modifying tables
- Changing relationships
- Data migrations

---

## File Structure

### Backend Structure

```
backend/
├── routes/              # API route definitions
│   ├── auth.js         # Authentication routes
│   ├── purchase-requests.js
│   └── chatbot.js
├── controllers/         # Request handlers
│   ├── auth-controller.js
│   └── purchase-request-controller.js
├── services/           # Business logic
│   ├── auth-service.js
│   └── purchase-request-service.js
├── agents/             # AI agents
│   └── chatbot/
│       └── chatbot-agent.js
├── middleware/         # Express middleware
│   ├── auth-middleware.js
│   └── error-handler.js
├── prisma/            # Database
│   └── schema.prisma
└── utils/             # Utilities
```

### Frontend Structure

```
client/src/
├── FrontEnd/
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── PurchaseRequestPage.tsx
│   │   └── ChatBotPage.tsx
│   ├── components/         # Reusable components
│   │   ├── ChatBot/
│   │   ├── PurchaseRequest/
│   │   └── shared/
│   └── shared/
│       ├── api/           # API client functions
│       │   ├── auth.ts
│       │   └── purchase-requests.ts
│       └── context/       # React Context
├── App.tsx               # Main app component
└── index.tsx            # Entry point
```

### Documentation Structure

```
docs/
├── 01-core/              # Essential docs
│   ├── CLAUDE.md
│   ├── DOCUMENTATION.md
│   ├── PROJECT-LOG.md
│   └── DEVELOPMENT-GUIDE.md (this file)
├── 02-setup-guides/      # Setup instructions
│   ├── backend/
│   ├── frontend/
│   └── guides/
├── 03-features/          # Feature-specific docs
│   ├── chatbot/
│   ├── export/
│   └── voice-input/
├── 04-implementation/    # Reports
│   └── completion-reports/
├── 05-testing/          # Tests
├── 06-guides/           # User guides
├── 07-design-specs/     # Designs
└── 08-archive/          # Old docs
```

---

## Code Patterns

### Backend Patterns

#### API Endpoint Structure

```javascript
// routes/feature.js
const express = require('express');
const router = express.Router();
const featureController = require('../controllers/feature-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', authMiddleware, featureController.getAll);
router.post('/', authMiddleware, featureController.create);

module.exports = router;
```

#### Controller Pattern

```javascript
// controllers/feature-controller.js
const featureService = require('../services/feature-service');

exports.getAll = async (req, res) => {
  try {
    const items = await featureService.getAll(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### Service Pattern

```javascript
// services/feature-service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (userId) => {
  return await prisma.feature.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};
```

### Frontend Patterns

#### Page Component

```typescript
// pages/FeaturePage.tsx
import React, { useEffect, useState } from 'react';
import { getFeatures } from '../shared/api/feature';

const FeaturePage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await getFeatures();
      setData(result);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default FeaturePage;
```

#### API Client

```typescript
// shared/api/feature.ts
const API_BASE = '/api';

export const getFeatures = async () => {
  const response = await fetch(`${API_BASE}/features`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch features');
  }
  
  return response.json();
};
```

### Database Patterns

#### Prisma Schema

```prisma
model Feature {
  id        Int      @id @default(autoincrement())
  name      String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**After schema changes:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## Documentation Updates

### Always Update After Development

#### 1. PROJECT-LOG.md (Required)

Location: `docs/01-core/PROJECT-LOG.md`

```markdown
---
## [2026-06-21] - Chatbot Export Feature

**Requirement:** User wants chatbot to understand "export purchase request" command

**Implementation:** 
- Added export command recognition in chatbot agent
- Implemented CSV generation service
- Added file download endpoint

**Modified Files:**
- `backend/agents/chatbot/chatbot-agent.js` - Added export command handler
- `backend/services/export-service.js` - Created CSV generation logic
- `backend/routes/chatbot.js` - Added /api/chatbot/export endpoint
- `client/src/FrontEnd/shared/api/chatbot.ts` - Added exportPurchaseRequests()

**Technical Details:**
- Uses Prisma to query purchase requests
- Generates CSV with headers: ID, Item, Quantity, Status, Date
- Returns file as blob for download
- File size limit: 10MB

**Important Notes:**
- Export only includes user's own purchase requests
- CSV format is compatible with Excel
- Requires authentication token

**Related Documentation:**
- Created: docs/03-features/export/CHATBOT_EXPORT_GUIDE.md
- Updated: docs/01-core/DOCUMENTATION.md (Chatbot Features section)
---
```

#### 2. Feature Documentation (If applicable)

Create/update in `docs/03-features/{feature-name}/`

#### 3. Completion Report (For major features)

Create in `docs/04-implementation/completion-reports/`

Naming: `YYYY-MM-DD-{FEATURE}-COMPLETION-REPORT.md`

---

## Testing Guidelines

### Backend Testing

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Testing

```bash
cd client
npm test                   # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Manual Testing Checklist

Before considering work complete:

- [ ] Frontend server runs without errors
- [ ] Backend server runs without errors
- [ ] Feature works as expected in browser
- [ ] API endpoints return correct data
- [ ] Error handling works properly
- [ ] Authentication/authorization enforced
- [ ] Database changes applied (if any)
- [ ] Prisma client regenerated (if schema changed)
- [ ] No console errors in browser
- [ ] Mobile responsive (if UI change)

---

## Common Issues & Solutions

### Prisma Issues

**Problem:** "Prisma client is not generated"
```bash
cd backend
npm run prisma:generate
```

**Problem:** "Database is out of sync"
```bash
cd backend
npm run prisma:migrate
```

### Frontend Issues

**Problem:** "Module not found"
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

**Problem:** "Port 3000 already in use"
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill
```

### Backend Issues

**Problem:** "Port 4000 already in use"
```bash
# Kill process on port 4000
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:4000 | xargs kill
```

---

## Best Practices

### Code Quality

1. **Follow existing patterns** - Don't introduce new patterns
2. **Use TypeScript types** - Define interfaces for data
3. **Handle errors properly** - Try-catch blocks, error messages
4. **Comment complex logic** - Explain why, not what
5. **Keep functions small** - Single responsibility principle

### Git Workflow

1. **Commit often** - Small, logical commits
2. **Write clear commit messages** - What and why
3. **Don't commit .env files** - Contains secrets
4. **Don't commit node_modules** - Already in .gitignore

### Documentation

1. **Update PROJECT-LOG.md always** - After every development
2. **Keep docs in correct folders** - Follow categorization
3. **Use clear naming** - Descriptive file names
4. **Include code examples** - When explaining features

---

## Quick Reference

### File Location Shortcuts

**Need to add API endpoint?**
→ `backend/routes/{feature}.js`
→ `backend/controllers/{feature}-controller.js`
→ `backend/services/{feature}-service.js`

**Need to add page?**
→ `client/src/FrontEnd/pages/{Feature}Page.tsx`
→ `client/src/App.tsx` (add route)
→ `client/src/FrontEnd/shared/api/{feature}.ts`

**Need to modify chatbot?**
→ `backend/agents/chatbot/chatbot-agent.js`
→ `docs/03-features/chatbot/` (read first)

**Need to add database table?**
→ `backend/prisma/schema.prisma`
→ Run `npm run prisma:generate`
→ Run `npm run prisma:migrate`

---

## Need Help?

**Read documentation:**
- Complete system: `docs/01-core/DOCUMENTATION.md`
- Backend guide: `docs/02-setup-guides/backend/README.md`
- Frontend guide: `docs/02-setup-guides/frontend/README.md`
- Feature-specific: `docs/03-features/{feature}/`

**When uncertain:**
- Don't guess - ASK
- Don't assume - CONFIRM
- Don't skip docs - READ FIRST

---

**Last Updated:** 2026-06-21
