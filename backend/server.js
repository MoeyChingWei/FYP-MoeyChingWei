import "dotenv/config";

import cors from "cors";
import express from "express";
import path from "path";

import authRoutes from "./routes/auth.js";
import adminUsersRoutes from "./routes/adminUsers.js";
import adminSupplierTypesRoutes from "./routes/adminSupplierTypes.js";
import purchasingLookupsRoutes from "./routes/purchasingLookups.js";
import workflowStorageRoutes from "./routes/workflowStorage.js";
import notificationsRoutes from "./routes/notifications.js";
import feedbackRoutes from "./routes/feedback.js";
import dashboardRoutes from "./routes/dashboard.js";
import chatbotRoutes from "./routes/chatbot.js";
import chatbotUploadRoutes from "./routes/chatbot-upload.js";
import sourcesRoutes from "./routes/sources.js";
import agentsRoutes from "./routes/agents.js";
import languageRoutes from "./routes/language.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", authRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/admin", adminSupplierTypesRoutes);
app.use("/api/purchasing", purchasingLookupsRoutes);
app.use("/api/workflow", workflowStorageRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/chatbot", chatbotUploadRoutes);
app.use("/api/sources", sourcesRoutes);
app.use("/api/agents", agentsRoutes);
app.use("/api", languageRoutes);

app.get("/", (req, res) => {
  res.send("OptiMind Backend Running");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
