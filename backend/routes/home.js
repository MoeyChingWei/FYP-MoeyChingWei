import express from "express";

const router = express.Router();

// GET / - Centralized navigation hub for all backend dashboards & tools
router.get("/", (req, res) => {
  const host = req.get("host");
  const base = `${req.protocol}://${host}`;

  const sections = [
    {
      title: "📊 Monitoring",
      items: [
        {
          name: "Backend Monitor Dashboard",
          desc: "Real-time monitoring of email delivery, workflow events, and system performance",
          url: "/api/debug/dashboard",
          type: "page",
        },
        {
          name: "Debug Logs (HTML)",
          desc: "View the full in-memory log history",
          url: "/api/debug/logs/html",
          type: "page",
        },
        {
          name: "Performance Metrics (JSON)",
          desc: "API call counts, response times, and slow queries",
          url: "/api/debug/performance",
          type: "json",
        },
      ],
    },
    {
      title: "🗄️ Backup",
      items: [
        {
          name: "Backup Dashboard",
          desc: "Trigger database/file backups and view backup history",
          url: "/api/backup/dashboard",
          type: "page",
        },
        {
          name: "Backup History (JSON)",
          desc: "All backup records (stored in the database)",
          url: "/api/backup/history",
          type: "json",
        },
      ],
    },
    {
      title: "Database",
      items: [
        {
          name: "Database Explorer",
          desc: "View database type, table schemas, column data types, and paginated records",
          url: "/api/database/explorer",
          type: "page",
        },
        {
          name: "Database Overview (JSON)",
          desc: "PostgreSQL connection details and available table types",
          url: "/api/database/overview",
          type: "json",
        },
      ],
    },
    {
      title: "🔍 Audit Trail",
      items: [
        {
          name: "Audit Trail Dashboard",
          desc: "View user activity records (create/update/delete/login)",
          url: "/api/audit/dashboard",
          type: "page",
        },
        {
          name: "Audit Logs (JSON)",
          desc: "Filterable by user, entity, and date range",
          url: "/api/audit/logs",
          type: "json",
        },
        {
          name: "Audit Stats (JSON)",
          desc: "Audit statistics summary",
          url: "/api/audit/stats",
          type: "json",
        },
      ],
    },
  ];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OptiMind Backend Control Center</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
      color: #1a1a2e;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    .header {
      text-align: center;
      color: #fff;
      margin-bottom: 40px;
    }
    .header h1 { font-size: 2.2rem; margin-bottom: 8px; }
    .subtitle { font-size: 1rem; opacity: 0.9; margin-bottom: 12px; }
    .base-url {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-family: monospace;
    }
    .section { margin-bottom: 32px; }
    .section-title {
      color: #fff;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 14px;
      padding-left: 4px;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 18px 20px;
      text-decoration: none;
      color: #1a1a2e;
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      display: block;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.18);
    }
    .card-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 1.02rem;
      margin-bottom: 6px;
    }
    .badge {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 10px;
      color: #fff;
    }
    .badge.page { background: #14b8a6; }
    .badge.json { background: #8b5cf6; }
    .card-desc {
      font-size: 0.87rem;
      color: #555;
      margin-bottom: 10px;
      line-height: 1.4;
    }
    .card-url {
      font-size: 0.78rem;
      font-family: monospace;
      color: #667eea;
    }
    footer {
      text-align: center;
      color: rgba(255,255,255,0.75);
      font-size: 0.82rem;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧭 OptiMind Backend Control Center</h1>
      <div class="subtitle">Unified navigation for all backend monitoring, backup, and audit tools</div>
      <div class="base-url">${base}</div>
    </div>

    ${sections.map((section) => `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div class="card-grid">
          ${section.items.map((item) => `
            <a class="card" href="${item.url}">
              <div class="card-name">
                <span>${item.name}</span>
                <span class="badge ${item.type}">${item.type}</span>
              </div>
              <div class="card-desc">${item.desc}</div>
              <div class="card-url">${item.url}</div>
            </a>
          `).join("")}
        </div>
      </div>
    `).join("")}

    <footer>Last loaded: ${new Date().toLocaleString("en-US")}</footer>
  </div>
</body>
</html>
  `.trim();

  res.send(html);
});

export default router;
