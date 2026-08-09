import express from "express";
import backupService from "../services/backup.js";

const router = express.Router();

/**
 * POST /api/backup/database
 * Trigger manual database backup
 */
router.post("/database", async (req, res) => {
  try {
    const result = await backupService.backupDatabase();

    if (result.success) {
      res.json({
        success: true,
        message: "Database backup completed",
        ...result,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("❌ [BACKUP-API] Database backup error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to backup database",
    });
  }
});

/**
 * POST /api/backup/files
 * Trigger manual files backup
 */
router.post("/files", async (req, res) => {
  try {
    const result = await backupService.backupFiles();

    if (result.success) {
      res.json({
        success: true,
        message: "Files backup completed",
        ...result,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("❌ [BACKUP-API] Files backup error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to backup files",
    });
  }
});

/**
 * POST /api/backup/full
 * Trigger full backup (database + files)
 */
router.post("/full", async (req, res) => {
  try {
    const result = await backupService.fullBackup();

    res.json({
      success: result.success,
      message: result.success ? "Full backup completed" : "Backup completed with errors",
      ...result,
    });
  } catch (error) {
    console.error("❌ [BACKUP-API] Full backup error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform full backup",
    });
  }
});

/**
 * GET /api/backup/history
 * Get backup history
 */
router.get("/history", async (req, res) => {
  try {
    const { limit = 20, type } = req.query;

    const history = await backupService.getHistory(
      parseInt(limit),
      type || null
    );

    // Convert BigInt to string for JSON serialization
    const serializedHistory = history.map(backup => ({
      ...backup,
      fileSize: backup.fileSize ? backup.fileSize.toString() : null,
    }));

    res.json({
      success: true,
      backups: serializedHistory,
      total: serializedHistory.length,
    });
  } catch (error) {
    console.error("❌ [BACKUP-API] History error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get backup history",
    });
  }
});

/**
 * POST /api/backup/cleanup
 * Clean old backups (keep last N)
 */
router.post("/cleanup", async (req, res) => {
  try {
    const { keepLast = 10 } = req.body;

    const result = await backupService.cleanOldBackups(parseInt(keepLast));

    res.json({
      success: true,
      message: `Deleted ${result.deleted} old backups`,
      deleted: result.deleted,
    });
  } catch (error) {
    console.error("❌ [BACKUP-API] Cleanup error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clean old backups",
    });
  }
});

/**
 * GET /api/backup/dashboard
 * HTML dashboard for backup management
 */
router.get("/dashboard", async (req, res) => {
  try {
    const history = await backupService.getHistory(50);
    const dbBackups = history.filter(b => b.backupType === "DATABASE");
    const fileBackups = history.filter(b => b.backupType === "FILES");

    const totalSize = history.reduce((sum, b) => sum + Number(b.fileSize || 0), 0);
    const successCount = history.filter(b => b.status === "SUCCESS").length;
    const failedCount = history.filter(b => b.status === "FAILED").length;

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backup Management - OptiMind</title>
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
    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      background: #38BDF8;
      color: #0F172A;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }
    .btn:hover { background: #22D3EE; transform: translateY(-1px); }
    .btn.secondary {
      background: #1E293B;
      color: #F8FAFC;
      border: 1px solid #334155;
    }
    .btn.secondary:hover { background: #334155; }
    .btn.danger {
      background: #F97316;
      color: #F8FAFC;
    }
    .btn.danger:hover { background: #EA580C; }
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
    .backup-list { display: flex; flex-direction: column; gap: 12px; }
    .backup-entry {
      background: #0F172A;
      border: 1px solid #334155;
      border-left: 3px solid #38BDF8;
      border-radius: 6px;
      padding: 16px;
      transition: all 0.2s;
    }
    .backup-entry:hover {
      border-color: #38BDF8;
      transform: translateX(4px);
    }
    .backup-entry.failed { border-left-color: #F97316; }
    .backup-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .backup-badge {
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
    .backup-badge.database { background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); }
    .backup-badge.files { background: rgba(167, 139, 250, 0.2); color: #A78BFA; border: 1px solid rgba(167, 139, 250, 0.4); }
    .backup-badge.success { background: rgba(79, 209, 197, 0.2); color: #4FD1C5; border: 1px solid rgba(79, 209, 197, 0.4); }
    .backup-badge.failed { background: rgba(249, 115, 22, 0.2); color: #F97316; border: 1px solid rgba(249, 115, 22, 0.4); }
    .backup-time { font-size: 12px; color: #64748B; }
    .backup-details {
      font-size: 13px;
      color: #94A3B8;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
    }
    .backup-detail { display: flex; align-items: center; gap: 6px; }
    .empty {
      text-align: center;
      padding: 40px;
      color: #64748B;
      font-style: italic;
    }
    .error-msg {
      color: #F97316;
      font-size: 13px;
      margin-top: 8px;
      padding: 8px 12px;
      background: rgba(249, 115, 22, 0.1);
      border-radius: 4px;
      border-left: 2px solid #F97316;
    }
    #status {
      position: fixed;
      top: 24px;
      right: 24px;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      display: none;
      z-index: 1000;
    }
    #status.show { display: block; }
    #status.success { background: #4FD1C5; color: #0F172A; }
    #status.error { background: #F97316; color: #F8FAFC; }
  </style>
</head>
<body>
  <div id="status"></div>
  <div class="container">
    <div class="header">
      <div>
        <h1><span class="pulse-dot"></span>Backup Management</h1>
        <div class="subtitle">数据备份管理 • 最后更新: ${new Date().toLocaleString("zh-CN")}</div>
      </div>
      <div class="actions">
        <button class="btn" onclick="triggerBackup('database')">🗄️ Backup Database</button>
        <button class="btn" onclick="triggerBackup('files')">📁 Backup Files</button>
        <button class="btn" onclick="triggerBackup('full')">🚀 Full Backup</button>
        <button class="btn secondary" onclick="location.reload()">🔄 刷新</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Backups</div>
        <div class="stat-value">${history.length}</div>
        <div class="stat-desc">所有备份记录</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Success Rate</div>
        <div class="stat-value">${history.length ? Math.round(successCount / history.length * 100) : 0}%</div>
        <div class="stat-desc">${successCount} 成功 / ${failedCount} 失败</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total Size</div>
        <div class="stat-value">${formatBytes(totalSize)}</div>
        <div class="stat-desc">备份文件总大小</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Database Backups</div>
        <div class="stat-value">${dbBackups.length}</div>
        <div class="stat-desc">数据库备份</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">File Backups</div>
        <div class="stat-value">${fileBackups.length}</div>
        <div class="stat-desc">文件备份</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Last Backup</div>
        <div class="stat-value">${history.length ? new Date(history[0].startedAt).toLocaleString("zh-CN", {month: "numeric", day: "numeric"}) : "-"}</div>
        <div class="stat-desc">${history.length ? new Date(history[0].startedAt).toLocaleTimeString("zh-CN") : "无备份"}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📦 Recent Backups</div>
      <div class="backup-list">
        ${history.length === 0 ? `
          <div class="empty">暂无备份记录</div>
        ` : history.map(backup => {
          const isFailed = backup.status === "FAILED";
          const duration = backup.completedAt
            ? Math.round((new Date(backup.completedAt) - new Date(backup.startedAt)) / 1000)
            : null;
          return `
          <div class="backup-entry ${isFailed ? 'failed' : ''}">
            <div class="backup-header">
              <div style="display: flex; gap: 8px; align-items: center;">
                <span class="backup-badge ${backup.backupType.toLowerCase()}">${backup.backupType}</span>
                <span class="backup-badge ${backup.status.toLowerCase()}">${backup.status}</span>
              </div>
              <span class="backup-time">${new Date(backup.startedAt).toLocaleString("zh-CN")}</span>
            </div>
            <div class="backup-details">
              <span class="backup-detail">📄 ${backup.fileName}</span>
              ${backup.fileSize ? `<span class="backup-detail">💾 ${formatBytes(Number(backup.fileSize))}</span>` : ''}
              ${duration !== null ? `<span class="backup-detail">⏱️ ${duration}s</span>` : ''}
              ${backup.metadata?.rowCounts ? `<span class="backup-detail">📊 ${Object.values(backup.metadata.rowCounts).reduce((a, b) => a + b, 0)} rows</span>` : ''}
              ${backup.metadata?.fileCount ? `<span class="backup-detail">📁 ${backup.metadata.fileCount} files</span>` : ''}
            </div>
            ${isFailed ? `<div class="error-msg">❌ ${backup.errorMsg || 'Unknown error'}</div>` : ''}
          </div>
        `;
        }).join('')}
      </div>
    </div>
  </div>

  <script>
    function formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function showStatus(message, type) {
      const status = document.getElementById('status');
      status.textContent = message;
      status.className = 'show ' + type;
      setTimeout(() => {
        status.classList.remove('show');
      }, 5000);
    }

    async function triggerBackup(type) {
      showStatus('🔄 Starting backup...', 'success');

      try {
        const response = await fetch('/api/backup/' + type, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.success) {
          showStatus('✅ Backup completed!', 'success');
          setTimeout(() => location.reload(), 2000);
        } else {
          showStatus('❌ Backup failed: ' + result.error, 'error');
        }
      } catch (error) {
        showStatus('❌ Backup failed: ' + error.message, 'error');
      }
    }
  </script>
</body>
</html>
    `);
  } catch (error) {
    console.error("❌ [BACKUP-DASHBOARD]", error);
    res.status(500).send("Error loading backup dashboard");
  }
});

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export default router;
