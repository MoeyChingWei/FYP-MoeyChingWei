# Task 1: Database Schema and Migration

## Task Brief

**Files:**
- Create: `backend/prisma/migrations/YYYYMMDDHHMMSS_add_message_attachments/migration.sql`
- Modify: `backend/prisma/schema.prisma:217-218` (after ChatMessage model)

**Interfaces:**
- Consumes: Existing ChatMessage model (id field)
- Produces: MessageAttachment model with fields: id (String), messageId (Int), fileName (String), fileUrl (String), fileType (String), fileSize (Int), mimeType (String?), thumbnailUrl (String?), aiAnalysis (String?), uploadedAt (DateTime), metadata (Json?)

## Steps

- [ ] **Step 1: Add MessageAttachment model to schema**

Edit `backend/prisma/schema.prisma`, add after ChatMessage model:

```prisma
model MessageAttachment {
  id           String   @id @default(uuid())
  messageId    Int
  fileName     String
  fileUrl      String
  fileType     String
  fileSize     Int
  mimeType     String?
  thumbnailUrl String?
  aiAnalysis   String?  @db.Text
  uploadedAt   DateTime @default(now())
  metadata     Json?

  message ChatMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)

  @@index([messageId])
  @@index([uploadedAt])
  @@map("message_attachments")
}
```

- [ ] **Step 2: Add attachments relation to ChatMessage**

In `backend/prisma/schema.prisma`, modify ChatMessage model to add:

```prisma
attachments MessageAttachment[] // ADD THIS LINE
```

- [ ] **Step 3: Generate migration**

```bash
cd backend && npm run prisma:migrate -- --name add_message_attachments
```

- [ ] **Step 4: Apply migration**

```bash
cd backend && npm run prisma:migrate
```

- [ ] **Step 5: Regenerate Prisma client**

```bash
cd backend && npm run prisma:generate
```

- [ ] **Step 6: Verify schema in database**

```bash
cd backend && npm run prisma:studio
```

Verify `message_attachments` table exists with correct columns.

- [ ] **Step 7: Commit database changes**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations/
git commit -m "feat(db): add message_attachments table for per-message file uploads"
```

## Global Constraints

- React version: 18+
- Node.js version: 18+
- TypeScript: Use strict mode
- Database: PostgreSQL with Prisma ORM
- Follow existing code style (2-space indentation, semicolons)
