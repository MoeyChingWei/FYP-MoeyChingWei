import "dotenv/config";

import cors from "cors";
import express from "express";
import path from "path";
import { exec } from "child_process";

import authRoutes from "./routes/auth.js";
import adminUsersRoutes from "./routes/adminUsers.js";
import adminSupplierTypesRoutes from "./routes/adminSupplierTypes.js";
import purchasingLookupsRoutes from "./routes/purchasingLookups.js";
import supplierInventoryRoutes from "./routes/supplierInventory.js";
import workflowStorageRoutes from "./routes/workflowStorage.js";
import notificationsRoutes from "./routes/notifications.js";
import feedbackRoutes from "./routes/feedback.js";
import dashboardRoutes from "./routes/dashboard.js";
import chatbotRoutes from "./routes/chatbot.js";
import chatbotUploadRoutes from "./routes/chatbot-upload.js";
import sourcesRoutes from "./routes/sources.js";
import agentsRoutes from "./routes/agents.js";
import languageRoutes from "./routes/language.js";
import exportRoutes from "./routes/export.js";
import debugLogsRoutes from "./routes/debug-logs.js";
import { performanceMiddleware } from "./routes/debug-logs.js";
import auditRoutes from "./routes/audit.js";
import backupRoutes from "./routes/backup.js";
import databaseRoutes from "./routes/database.js";
import homeRoutes from "./routes/home.js";
import budgetRoutes from "./routes/budget.js";
import departmentBudgetRoutes from "./routes/department-budget.js";
import { auditMiddleware } from "./middleware/auditMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(performanceMiddleware);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/audit", auditRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/database", databaseRoutes);
app.use("/api/debug", debugLogsRoutes);

app.use(auditMiddleware);
app.use("/api", authRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/admin", adminSupplierTypesRoutes);
app.use("/api/purchasing", purchasingLookupsRoutes);
app.use("/api/purchasing", supplierInventoryRoutes);
app.use("/api/workflow", workflowStorageRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/chatbot", chatbotUploadRoutes);
app.use("/api/sources", sourcesRoutes);
app.use("/api/agents", agentsRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/export", exportRoutes);
console.log("🔵 Registering /api/budget routes");
app.use("/api/budget", budgetRoutes);
app.use("/api/department-budget", departmentBudgetRoutes);

app.use("/", homeRoutes);

app.listen(4000, () => {
  console.log("Server running on port 4000");
  console.log("Dashboard: http://localhost:4000");

  // Auto-open dashboard in browser
  const url = "http://localhost:4000";
  const platform = process.platform;

  const command =
    platform === "win32" ? `start ${url}` :
    platform === "darwin" ? `open ${url}` :
    `xdg-open ${url}`;

  exec(command, (error) => {
    if (error) {
      console.log("Could not auto-open browser. Please visit:", url);
    }
  });
});
