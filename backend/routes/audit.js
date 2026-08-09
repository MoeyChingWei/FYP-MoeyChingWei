import express from "express";
import auditService from "../services/audit.js";

const router = express.Router();

/**
 * GET /api/audit/logs
 * Query audit logs with filters
 */
router.get("/logs", async (req, res) => {
  try {
    const {
      userId,
      entity,
      action,
      startDate,
      endDate,
      limit = 100,
      offset = 0,
    } = req.query;

    const result = await auditService.query({
      userId: userId ? parseInt(userId) : null,
      entity,
      action,
      startDate,
      endDate,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("❌ [AUDIT-API] Query error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to query audit logs",
    });
  }
});

/**
 * GET /api/audit/entity/:entity/:id
 * Get audit history for a specific entity
 */
router.get("/entity/:entity/:id", async (req, res) => {
  try {
    const { entity, id } = req.params;
    const { limit = 50 } = req.query;

    const logs = await auditService.getEntityHistory(
      entity,
      id,
      parseInt(limit)
    );

    res.json({
      success: true,
      entity,
      entityId: id,
      logs,
      total: logs.length,
    });
  } catch (error) {
    console.error("❌ [AUDIT-API] Entity history error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get entity history",
    });
  }
});

/**
 * GET /api/audit/user/:userId
 * Get user activity history
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const logs = await auditService.getUserActivity(
      parseInt(userId),
      parseInt(limit)
    );

    res.json({
      success: true,
      userId: parseInt(userId),
      logs,
      total: logs.length,
    });
  } catch (error) {
    console.error("❌ [AUDIT-API] User activity error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user activity",
    });
  }
});

/**
 * GET /api/audit/stats
 * Get audit statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await auditService.getStats(startDate, endDate);

    res.json({
      success: true,
      period: {
        startDate: startDate || "all time",
        endDate: endDate || "now",
      },
      stats,
    });
  } catch (error) {
    console.error("❌ [AUDIT-API] Stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get audit statistics",
    });
  }
});

/**
 * GET /api/audit/dashboard
 * HTML dashboard for audit logs
 */
router.get("/dashboard", async (req, res) => {
  try {
    const stats = await auditService.getStats();
    const recentLogs = await auditService.query({ limit: 20, offset: 0 });

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audit Trail Dashboard - OptiMind</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0F172A;
      color: #F8FAFC;
      padding: 24px;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #1E293B;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pulse-dot {
      width: 12px;
      height: 12px;
      background: #4FD1C5;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.9); }
    }
    .subtitle { font-size: 14px; color: #94A3B8; margin-top: 4px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.2s;
    }
    .stat-card:hover {
      border-color: #38BDF8;
      transform: translateY(-2px);
    }
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #38BDF8;
      margin: 8px 0;
    }
    .stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94A3B8;
      font-weight: 600;
    }
    .stat-desc { font-size: 13px; color: #64748B; margin-top: 4px; }
    .section {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .log-list { display: flex; flex-direction: column; gap: 12px; }
    .log-entry {
      background: #0F172A;
      border: 1px solid #334155;
      border-left: 3px solid #38BDF8;
      border-radius: 6px;
      padding: 16px;
      transition: all 0.2s;
    }
    .log-entry:hover {
      border-color: #38BDF8;
      transform: translateX(4px);
    }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .log-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .log-badge.create { background: rgba(79, 209, 197, 0.2); color: #4FD1C5; border: 1px solid rgba(79, 209, 197, 0.4); }
    .log-badge.update { background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); }
    .log-badge.delete { background: rgba(249, 115, 22, 0.2); color: #F97316; border: 1px solid rgba(249, 115, 22, 0.4); }
    .log-badge.login { background: rgba(167, 139, 250, 0.2); color: #A78BFA; border: 1px solid rgba(167, 139, 250, 0.4); }
    .log-time { font-size: 12px; color: #64748B; }
    .log-details {
      font-size: 13px;
      color: #94A3B8;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
    }
    .log-detail { display: flex; align-items: center; gap: 6px; }
    .btn {
      background: #38BDF8;
      color: #0F172A;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:hover { background: #22D3EE; transform: translateY(-1px); }
    .empty {
      text-align: center;
      padding: 40px;
      color: #64748B;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1><span class="pulse-dot"></span>Audit Trail Dashboard</h1>
        <div class="subtitle">系统操作审计 • 最后更新: ${new Date().toLocaleString("zh-CN")}</div>
      </div>
      <button class="btn" onclick="location.reload()">🔄 刷新</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Events</div>
        <div class="stat-value">${stats.total}</div>
        <div class="stat-desc">所有审计记录</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Failed Operations</div>
        <div class="stat-value">${stats.failed}</div>
        <div class="stat-desc">失败的操作</div>
      </div>

      ${stats.byAction.slice(0, 4).map(item => `
        <div class="stat-card">
          <div class="stat-label">${item.action}</div>
          <div class="stat-value">${item.count}</div>
          <div class="stat-desc">操作次数</div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">📋 Recent Activity (最近20条)</div>
      <div class="log-list">
        ${recentLogs.logs.length === 0 ? `
          <div class="empty">暂无审计记录</div>
        ` : recentLogs.logs.map(log => {
          const actionClass = log.action.toLowerCase();
          return `
          <div class="log-entry">
            <div class="log-header">
              <span class="log-badge ${actionClass}">${log.action}</span>
              <span class="log-time">${new Date(log.createdAt).toLocaleString("zh-CN")}</span>
            </div>
            <div class="log-details">
              <span class="log-detail">📦 <strong>${log.entity}</strong></span>
              ${log.entityId ? `<span class="log-detail">🆔 ${log.entityId}</span>` : ''}
              ${log.userName ? `<span class="log-detail">👤 ${log.userName}</span>` : ''}
              ${log.userEmail ? `<span class="log-detail">📧 ${log.userEmail}</span>` : ''}
              ${log.ipAddress ? `<span class="log-detail">🌐 ${log.ipAddress}</span>` : ''}
              ${log.status === 'FAILED' ? `<span class="log-detail" style="color: #F97316;">❌ Failed</span>` : ''}
            </div>
          </div>
        `;
        }).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title">📊 Statistics by Entity</div>
      <div class="log-list">
        ${stats.byEntity.map(item => `
          <div class="log-entry">
            <div class="log-header">
              <span class="log-badge">${item.entity}</span>
              <span class="stat-value" style="font-size: 24px;">${item.count}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
    `);
  } catch (error) {
    console.error("❌ [AUDIT-DASHBOARD]", error);
    res.status(500).send("Error loading audit dashboard");
  }
});

export default router;
