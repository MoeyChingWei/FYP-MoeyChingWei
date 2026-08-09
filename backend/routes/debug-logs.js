import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// In-memory log store
const logs = [];
const MAX_LOGS = 500;

// Performance tracking
const performanceMetrics = {
  apiCalls: new Map(), // endpoint -> { count, totalTime, errors, lastCalled }
  slowQueries: [], // { endpoint, duration, timestamp, method }
  systemStats: {
    startTime: Date.now(),
    requestCount: 0,
    errorCount: 0,
  },
};

const MAX_SLOW_QUERIES = 50;

// Log function that can be imported and used anywhere
export function addDebugLog(category, message, data = null) {
  const entry = {
    timestamp: new Date().toISOString(),
    category,
    message,
    data,
  };

  logs.unshift(entry);
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }

  // Also write to console for reference
  console.log(`[DEBUG-LOG] ${category}: ${message}`, data || "");
}

// Performance tracking middleware export
export function performanceMiddleware(req, res, next) {
  const startTime = Date.now();
  const endpoint = `${req.method} ${req.path}`;

  performanceMetrics.systemStats.requestCount++;

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    // Track API call metrics
    if (!performanceMetrics.apiCalls.has(endpoint)) {
      performanceMetrics.apiCalls.set(endpoint, {
        count: 0,
        totalTime: 0,
        errors: 0,
        lastCalled: new Date().toISOString(),
        avgTime: 0,
      });
    }

    const metrics = performanceMetrics.apiCalls.get(endpoint);
    metrics.count++;
    metrics.totalTime += duration;
    metrics.avgTime = Math.round(metrics.totalTime / metrics.count);
    metrics.lastCalled = new Date().toISOString();

    if (res.statusCode >= 400) {
      metrics.errors++;
      performanceMetrics.systemStats.errorCount++;
    }

    // Track slow queries (>500ms)
    if (duration > 500) {
      performanceMetrics.slowQueries.unshift({
        endpoint,
        method: req.method,
        duration,
        timestamp: new Date().toISOString(),
        statusCode: res.statusCode,
      });

      if (performanceMetrics.slowQueries.length > MAX_SLOW_QUERIES) {
        performanceMetrics.slowQueries.pop();
      }
    }

    return originalSend.call(this, data);
  };

  next();
}

// Get system resource stats
function getSystemStats() {
  const uptime = Math.floor((Date.now() - performanceMetrics.systemStats.startTime) / 1000);
  const memUsage = process.memoryUsage();

  return {
    uptime: {
      seconds: uptime,
      formatted: formatUptime(uptime),
    },
    memory: {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    },
    requests: {
      total: performanceMetrics.systemStats.requestCount,
      errors: performanceMetrics.systemStats.errorCount,
      errorRate: performanceMetrics.systemStats.requestCount > 0
        ? ((performanceMetrics.systemStats.errorCount / performanceMetrics.systemStats.requestCount) * 100).toFixed(2)
        : 0,
    },
    nodejs: {
      version: process.version,
      pid: process.pid,
    },
  };
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

// GET /api/debug/logs - Returns all logs as JSON
router.get("/logs", (req, res) => {
  const category = req.query.category;
  const filtered = category
    ? logs.filter((log) => log.category === category)
    : logs;

  res.json({
    success: true,
    count: filtered.length,
    logs: filtered,
  });
});

// GET /api/debug/performance - Returns performance metrics as JSON
router.get("/performance", (req, res) => {
  const apiMetrics = Array.from(performanceMetrics.apiCalls.entries())
    .map(([endpoint, metrics]) => ({
      endpoint,
      ...metrics,
    }))
    .sort((a, b) => b.count - a.count);

  const slowestEndpoints = apiMetrics
    .sort((a, b) => b.avgTime - a.avgTime)
    .slice(0, 10);

  res.json({
    success: true,
    system: getSystemStats(),
    api: {
      totalEndpoints: apiMetrics.length,
      metrics: apiMetrics,
      slowest: slowestEndpoints,
    },
    slowQueries: performanceMetrics.slowQueries,
  });
});

// GET /api/debug/dashboard - Full monitoring dashboard (no auth required)
router.get("/dashboard", (req, res) => {
  // Skip any authentication - this is a monitoring endpoint
  const categories = [...new Set(logs.map((log) => log.category))];
  const categoryCounts = {};
  categories.forEach((cat) => {
    categoryCounts[cat] = logs.filter((log) => log.category === cat).length;
  });

  const emailSuccessCount = logs.filter((log) => log.category === "EMAIL-SUCCESS").length;
  const emailErrorCount = logs.filter((log) => log.category === "EMAIL-ERROR").length;
  const emailCount = logs.filter((log) => log.category === "EMAIL").length;
  const workflowCount = logs.filter((log) => log.category === "WORKFLOW").length;
  const workflowErrorCount = logs.filter((log) => log.category === "WORKFLOW-ERROR").length;

  const recentLogs = logs.slice(0, 30);
  const last5Minutes = logs.filter((log) => {
    const logTime = new Date(log.timestamp).getTime();
    const now = Date.now();
    return now - logTime < 5 * 60 * 1000;
  });

  // Get performance metrics
  const systemStats = getSystemStats();
  const apiMetrics = Array.from(performanceMetrics.apiCalls.entries())
    .map(([endpoint, metrics]) => ({
      endpoint,
      ...metrics,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const slowestEndpoints = Array.from(performanceMetrics.apiCalls.entries())
    .map(([endpoint, metrics]) => ({
      endpoint,
      ...metrics,
    }))
    .sort((a, b) => b.avgTime - a.avgTime)
    .slice(0, 5);

  const recentSlowQueries = performanceMetrics.slowQueries.slice(0, 10);

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OptiMind Backend Monitor - Real-time Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    body {
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #0B0E14 0%, #1E293B 100%);
      background-size: 200% 200%;
      animation: gradient 15s ease infinite;
      color: #F8FAFC;
      line-height: 1.6;
      min-height: 100vh;
    }

    .container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 24px;
    }

    .header {
      margin-bottom: 32px;
      animation: fadeInUp 0.6s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-left h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #38BDF8 0%, #22D3EE 50%, #4FD1C5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header .subtitle {
      font-size: 14px;
      color: #94A3B8;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pulse-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #4FD1C5;
      animation: pulse 2s infinite;
      box-shadow: 0 0 10px #4FD1C5;
    }

    .refresh-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 8px;
      font-size: 13px;
      color: #38BDF8;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
      animation: fadeInUp 0.8s ease;
    }
    .stat-card {
      background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      border-color: #38BDF8;
    }

    .stat-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #38BDF8, #22D3EE);
    }

    .stat-card.success::before {
      background: linear-gradient(90deg, #4FD1C5, #38BDF8);
    }

    .stat-card.error::before {
      background: linear-gradient(90deg, #F97316, #F59E0B);
    }

    .stat-card.workflow::before {
      background: linear-gradient(90deg, #A78BFA, #C4B5FD);
    }

    .stat-card.activity::before {
      background: linear-gradient(90deg, #F59E0B, #C9A24B);
    }

    .stat-icon {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 48px;
      opacity: 0.1;
    }
    .stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748B;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-value {
      font-size: 48px;
      font-weight: 700;
      color: #F8FAFC;
      line-height: 1;
      margin-bottom: 8px;
      font-variant-numeric: tabular-nums;
    }

    .stat-desc {
      font-size: 13px;
      color: #94A3B8;
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      margin-top: 8px;
    }

    .stat-trend.up {
      background: rgba(79, 209, 197, 0.1);
      color: #4FD1C5;
    }

    .stat-trend.down {
      background: rgba(249, 115, 22, 0.1);
      color: #F97316;
    }
    .section {
      margin-bottom: 32px;
      animation: fadeInUp 1s ease;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #334155;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #F8FAFC;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-title::before {
      content: "";
      width: 4px;
      height: 24px;
      background: linear-gradient(180deg, #38BDF8, #22D3EE);
      border-radius: 2px;
    }
    .controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 10px 18px;
      border-radius: 8px;
      border: 1px solid #334155;
      background: #1E293B;
      color: #F8FAFC;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn:hover {
      background: #334155;
      border-color: #38BDF8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
    }

    .btn.primary {
      background: linear-gradient(135deg, #38BDF8, #22D3EE);
      color: #0F172A;
      border-color: transparent;
      font-weight: 600;
    }

    .btn.primary:hover {
      background: linear-gradient(135deg, #22D3EE, #4FD1C5);
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
    }
    .log-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .log-entry {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 18px;
      transition: all 0.3s;
      animation: slideInRight 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .log-entry::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #38BDF8, #22D3EE);
    }

    .log-entry.email-success::before {
      background: linear-gradient(180deg, #4FD1C5, #38BDF8);
    }

    .log-entry.email-error::before {
      background: linear-gradient(180deg, #F97316, #F59E0B);
    }

    .log-entry.workflow::before {
      background: linear-gradient(180deg, #A78BFA, #C4B5FD);
    }

    .log-entry.workflow-error::before {
      background: linear-gradient(180deg, #F59E0B, #F97316);
    }

    .log-entry:hover {
      border-color: #38BDF8;
      transform: translateX(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .log-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .log-category.email {
      background: rgba(56, 189, 248, 0.2);
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.4);
    }

    .log-category.email-success {
      background: rgba(79, 209, 197, 0.2);
      color: #4FD1C5;
      border: 1px solid rgba(79, 209, 197, 0.4);
    }

    .log-category.email-error {
      background: rgba(249, 115, 22, 0.2);
      color: #F97316;
      border: 1px solid rgba(249, 115, 22, 0.4);
    }

    .log-category.workflow {
      background: rgba(167, 139, 250, 0.2);
      color: #A78BFA;
      border: 1px solid rgba(167, 139, 250, 0.4);
    }

    .log-category.workflow-error {
      background: rgba(245, 158, 11, 0.2);
      color: #F59E0B;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }
    .log-time {
      font-size: 12px;
      color: #64748B;
      font-family: "SF Mono", Monaco, monospace;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .log-message {
      font-size: 14px;
      color: #E2E8F0;
      margin-bottom: 10px;
      line-height: 1.5;
    }

    .log-data {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 14px;
      font-family: "SF Mono", Monaco, monospace;
      font-size: 12px;
      color: #94A3B8;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 300px;
      overflow-y: auto;
    }

    .log-data::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .log-data::-webkit-scrollbar-track {
      background: #1E293B;
      border-radius: 4px;
    }

    .log-data::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }

    .log-data::-webkit-scrollbar-thumb:hover {
      background: #475569;
    }
    .empty {
      text-align: center;
      padding: 64px 24px;
      color: #64748B;
      font-size: 15px;
      background: #1E293B;
      border: 2px dashed #334155;
      border-radius: 12px;
    }

    .empty::before {
      content: "📊";
      display: block;
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .controls {
        width: 100%;
      }

      .btn {
        flex: 1;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <h1><span class="pulse-dot"></span>OptiMind Backend Monitor</h1>
        <div class="subtitle">
          <span>Real-time monitoring of system logs and email notifications</span>
          <span>•</span>
          <span>Last updated: ${new Date().toLocaleString("en-US")}</span>
        </div>
      </div>
      <button class="btn" onclick="location.reload()" style="margin: 0;">
        🔄 Manual Refresh
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-icon">📊</span>
        <div class="stat-label">
          <span>Total Logs</span>
        </div>
        <div class="stat-value">${logs.length}</div>
        <div class="stat-desc">All log entries</div>
        <div class="stat-trend up">↑ ${last5Minutes.length} in last 5 min</div>
      </div>

      <div class="stat-card success">
        <span class="stat-icon">✅</span>
        <div class="stat-label">
          <span>Email Success</span>
        </div>
        <div class="stat-value">${emailSuccessCount}</div>
        <div class="stat-desc">Emails sent successfully</div>
        ${emailSuccessCount > 0 ? `<div class="stat-trend up">↑ Active</div>` : ''}
      </div>

      <div class="stat-card error">
        <span class="stat-icon">❌</span>
        <div class="stat-label">
          <span>Email Errors</span>
        </div>
        <div class="stat-value">${emailErrorCount}</div>
        <div class="stat-desc">Emails failed to send</div>
        ${emailErrorCount > 0 ? `<div class="stat-trend down">⚠ Requires attention</div>` : ''}
      </div>

      <div class="stat-card workflow">
        <span class="stat-icon">⚙️</span>
        <div class="stat-label">
          <span>Workflow Events</span>
        </div>
        <div class="stat-value">${workflowCount}</div>
        <div class="stat-desc">Workflow processing</div>
        ${workflowErrorCount > 0 ? `<div class="stat-trend down">⚠ ${workflowErrorCount} errors</div>` : ''}
      </div>

      <div class="stat-card activity">
        <span class="stat-icon">📧</span>
        <div class="stat-label">
          <span>Email Activity</span>
        </div>
        <div class="stat-value">${emailCount}</div>
        <div class="stat-desc">Email-related events</div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">⚡ System Performance</div>
        <div class="controls">
          <a href="/api/debug/performance" class="btn">📊 JSON API</a>
        </div>
      </div>

      <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
        <div class="stat-card">
          <span class="stat-icon">⏱️</span>
          <div class="stat-label"><span>Uptime</span></div>
          <div class="stat-value" style="font-size: 20px;">${systemStats.uptime.formatted}</div>
          <div class="stat-desc">${systemStats.uptime.seconds}s</div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">💾</span>
          <div class="stat-label"><span>Heap Used</span></div>
          <div class="stat-value">${systemStats.memory.heapUsed} MB</div>
          <div class="stat-desc">/ ${systemStats.memory.heapTotal} MB total</div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">📈</span>
          <div class="stat-label"><span>Total Requests</span></div>
          <div class="stat-value">${systemStats.requests.total}</div>
          <div class="stat-desc">since startup</div>
        </div>

        <div class="stat-card ${systemStats.requests.errorRate > 5 ? 'error' : 'success'}">
          <span class="stat-icon">${systemStats.requests.errorRate > 5 ? '⚠️' : '✅'}</span>
          <div class="stat-label"><span>Error Rate</span></div>
          <div class="stat-value">${systemStats.requests.errorRate}%</div>
          <div class="stat-desc">${systemStats.requests.errors} errors</div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">🔧</span>
          <div class="stat-label"><span>Node.js</span></div>
          <div class="stat-value" style="font-size: 18px;">${systemStats.nodejs.version}</div>
          <div class="stat-desc">PID: ${systemStats.nodejs.pid}</div>
        </div>

        <div class="stat-card">
          <span class="stat-icon">🌐</span>
          <div class="stat-label"><span>API Endpoints</span></div>
          <div class="stat-value">${apiMetrics.length}</div>
          <div class="stat-desc">Tracked</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">🔥 Top API Endpoints (Most Called)</div>
      </div>
      <div class="log-list">
        ${apiMetrics.length === 0 ? `
          <div class="empty">No API call data yet, tracking starts automatically once the system is used</div>
        ` : apiMetrics.map((metric, index) => `
          <div class="log-entry" style="border-left-color: ${metric.errors > 0 ? '#F97316' : '#4FD1C5'};">
            <div class="log-header">
              <span class="log-category" style="background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4);">
                #${index + 1} ${metric.endpoint}
              </span>
              <span class="log-time">${metric.lastCalled}</span>
            </div>
            <div style="display: flex; gap: 24px; margin-top: 8px; font-size: 13px; color: #94A3B8;">
              <span>📊 <strong>${metric.count}</strong> calls</span>
              <span>⏱️ <strong>${metric.avgTime}ms</strong> avg</span>
              <span>⏳ <strong>${metric.totalTime}ms</strong> total</span>
              ${metric.errors > 0 ? `<span style="color: #F97316;">❌ <strong>${metric.errors}</strong> errors</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">🐌 Slowest Endpoints (Avg Response Time)</div>
      </div>
      <div class="log-list">
        ${slowestEndpoints.length === 0 ? `
          <div class="empty">No performance data yet</div>
        ` : slowestEndpoints.map((metric, index) => `
          <div class="log-entry" style="border-left-color: ${metric.avgTime > 1000 ? '#F97316' : metric.avgTime > 500 ? '#F59E0B' : '#4FD1C5'};">
            <div class="log-header">
              <span class="log-category" style="background: rgba(249, 115, 22, 0.2); color: #F97316; border: 1px solid rgba(249, 115, 22, 0.4);">
                #${index + 1} ${metric.endpoint}
              </span>
              <span class="log-time">${metric.lastCalled}</span>
            </div>
            <div style="display: flex; gap: 24px; margin-top: 8px; font-size: 13px; color: #94A3B8;">
              <span style="color: ${metric.avgTime > 1000 ? '#F97316' : '#F59E0B'};">⏱️ <strong>${metric.avgTime}ms</strong> avg</span>
              <span>📊 <strong>${metric.count}</strong> calls</span>
              <span>⏳ <strong>${metric.totalTime}ms</strong> total</span>
              ${metric.errors > 0 ? `<span style="color: #F97316;">❌ <strong>${metric.errors}</strong> errors</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">🚨 Recent Slow Queries (>500ms)</div>
      </div>
      <div class="log-list">
        ${recentSlowQueries.length === 0 ? `
          <div class="empty">✅ No slow queries, all requests are fast!</div>
        ` : recentSlowQueries.map((query) => `
          <div class="log-entry" style="border-left-color: ${query.duration > 2000 ? '#F97316' : '#F59E0B'};">
            <div class="log-header">
              <span class="log-category" style="background: rgba(249, 115, 22, 0.2); color: #F97316; border: 1px solid rgba(249, 115, 22, 0.4);">
                ${query.method} ${query.endpoint}
              </span>
              <span class="log-time">${query.timestamp}</span>
            </div>
            <div style="display: flex; gap: 24px; margin-top: 8px; font-size: 13px; color: #94A3B8;">
              <span style="color: ${query.duration > 2000 ? '#F97316' : '#F59E0B'}; font-weight: 600;">
                ⚠️ <strong>${query.duration}ms</strong> response time
              </span>
              <span>Status: <strong>${query.statusCode}</strong></span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">Recent Activity (Last 20)</div>
        <div class="controls">
          <a href="/api/debug/logs/html" class="btn">📋 Full Logs</a>
          <a href="/api/debug/logs/html?category=EMAIL-SUCCESS" class="btn">✅ Email Success</a>
          <a href="/api/debug/logs/html?category=EMAIL-ERROR" class="btn">❌ Email Failures</a>
          <button class="btn primary" onclick="location.reload()">🔄 Refresh</button>
        </div>
      </div>

      <div class="log-list">
        ${recentLogs.length === 0 ? `
          <div class="empty">No log entries yet, trigger some actions and check back</div>
        ` : recentLogs.map((log) => {
          const categoryClass = log.category.toLowerCase().replace(/_/g, "-");
          return `
          <div class="log-entry ${categoryClass}">
            <div class="log-header">
              <span class="log-category ${categoryClass}">${log.category}</span>
              <span class="log-time">${log.timestamp}</span>
            </div>
            <div class="log-message">${log.message}</div>
            ${log.data ? `
              <div class="log-data">${typeof log.data === "object" ? JSON.stringify(log.data, null, 2) : log.data}</div>
            ` : ""}
          </div>
        `;
        }).join("")}
      </div>
    </div>
  </div>

  <script>
    // Manual refresh only - auto-refresh disabled
  </script>
</body>
</html>
  `.trim();

  res.send(html);
});

// GET /api/debug/logs/html - Returns logs as HTML page
router.get("/logs/html", (req, res) => {
  const category = req.query.category || "all";
  const filtered = category === "all"
    ? logs
    : logs.filter((log) => log.category === category);

  const categories = [...new Set(logs.map((log) => log.category))];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OptiMind Debug Logs</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0F172A;
      color: #F8FAFC;
      padding: 24px;
      line-height: 1.6;
    }
    .header {
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #334155;
    }
    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #38BDF8;
    }
    .meta {
      font-size: 14px;
      color: #94A3B8;
    }
    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid #334155;
      background: #1E293B;
      color: #F8FAFC;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
    }
    .btn:hover { background: #334155; }
    .btn.active {
      background: #38BDF8;
      color: #0F172A;
      border-color: #38BDF8;
    }
    .log-entry {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      gap: 16px;
    }
    .log-category {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background: #334155;
      color: #38BDF8;
    }
    .log-time {
      font-size: 12px;
      color: #64748B;
      font-family: "SF Mono", Monaco, monospace;
    }
    .log-message {
      font-size: 14px;
      margin-bottom: 8px;
      color: #E2E8F0;
    }
    .log-data {
      background: #0F172A;
      border: 1px solid #334155;
      border-radius: 4px;
      padding: 12px;
      font-family: "SF Mono", Monaco, monospace;
      font-size: 12px;
      color: #94A3B8;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .empty {
      text-align: center;
      padding: 48px;
      color: #64748B;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>OptiMind Debug Logs</h1>
    <div class="meta">
      Showing ${filtered.length} of ${logs.length} logs
      ${category !== "all" ? `(filtered by: ${category})` : ""}
    </div>
  </div>

  <div class="controls">
    <a href="/api/debug/dashboard" class="btn">🏠 Dashboard</a>
    <a href="/api/debug/logs/html" class="btn ${category === "all" ? "active" : ""}">All</a>
    ${categories.map((cat) => `
      <a href="/api/debug/logs/html?category=${encodeURIComponent(cat)}"
         class="btn ${category === cat ? "active" : ""}">${cat}</a>
    `).join("")}
    <button class="btn" onclick="location.reload()">🔄 Refresh</button>
  </div>

  ${filtered.length === 0 ? `
    <div class="empty">No logs found</div>
  ` : filtered.map((log) => `
    <div class="log-entry">
      <div class="log-header">
        <span class="log-category">${log.category}</span>
        <span class="log-time">${log.timestamp}</span>
      </div>
      <div class="log-message">${log.message}</div>
      ${log.data ? `
        <div class="log-data">${typeof log.data === "object" ? JSON.stringify(log.data, null, 2) : log.data}</div>
      ` : ""}
    </div>
  `).join("")}

  <script>
    // Manual refresh only - auto-refresh disabled
  </script>
</body>
</html>
  `.trim();

  res.send(html);
});

// GET /api/debug/logs/clear - Clear all logs
router.get("/logs/clear", (req, res) => {
  const count = logs.length;
  logs.length = 0;
  res.json({ success: true, message: `Cleared ${count} logs` });
});

export default router;
