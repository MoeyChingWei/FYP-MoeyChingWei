import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();
const MAX_PAGE_SIZE = 100;
const SENSITIVE_COLUMN = /(password|token|secret|api[_-]?key|codehash|salt)/i;

function normalizePageSize(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 50;
  return Math.min(parsed, MAX_PAGE_SIZE);
}

function normalizeOffset(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

function quoteIdentifier(identifier) {
  return `"${identifier.replace(/"/g, '""')}"`;
}

function isSensitiveColumn(name) {
  return SENSITIVE_COLUMN.test(name);
}

function serializeValue(value) {
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Buffer.isBuffer(value)) return `[binary data: ${value.length} bytes]`;
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, serializeValue(entry)]),
    );
  }
  return value;
}

function serializeRecord(record) {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([column]) => !isSensitiveColumn(column))
      .map(([column, value]) => [column, serializeValue(value)]),
  );
}

async function getTables() {
  return prisma.$queryRaw`
    SELECT table_name AS "name", table_type AS "type"
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
}

async function ensureTableExists(tableName) {
  if (!/^[a-z_][a-z0-9_]*$/.test(tableName)) return false;
  const tables = await getTables();
  return tables.some((table) => table.name === tableName);
}

// GET /api/database/overview
router.get("/overview", async (_req, res) => {
  try {
    const [connection] = await prisma.$queryRaw`
      SELECT current_database() AS "databaseName", current_user AS "connectedUser", version() AS "version"
    `;
    const tables = await getTables();
    return res.json({
      success: true,
      database: { engine: "PostgreSQL", schema: "public", ...connection },
      tables,
      tableCount: tables.length,
    });
  } catch (error) {
    console.error("GET /api/database/overview error:", error);
    return res.status(500).json({ success: false, message: "Could not read database metadata" });
  }
});

// GET /api/database/tables/:tableName?limit=50&offset=0
router.get("/tables/:tableName", async (req, res) => {
  const { tableName } = req.params;
  const limit = normalizePageSize(req.query.limit);
  const offset = normalizeOffset(req.query.offset);

  try {
    if (!(await ensureTableExists(tableName))) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }
    const columns = await prisma.$queryRaw`
      SELECT column_name AS "name", data_type AS "dataType", udt_name AS "nativeType",
             is_nullable = 'YES' AS "nullable", column_default AS "defaultValue", ordinal_position AS "position"
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${tableName}
      ORDER BY ordinal_position
    `;
    const identifier = `${quoteIdentifier("public")}.${quoteIdentifier(tableName)}`;
    const [count] = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS "total" FROM ${identifier}`);
    const records = await prisma.$queryRawUnsafe(
      `SELECT * FROM ${identifier} LIMIT $1 OFFSET $2`, limit, offset,
    );
    const hiddenColumns = columns.filter((column) => isSensitiveColumn(column.name)).map((column) => column.name);
    return res.json({
      success: true,
      table: tableName,
      pagination: { limit, offset, total: Number(count.total), hasNextPage: offset + limit < Number(count.total) },
      columns: columns.filter((column) => !isSensitiveColumn(column.name)),
      hiddenColumns,
      records: records.map(serializeRecord),
    });
  } catch (error) {
    console.error(`GET /api/database/tables/${tableName} error:`, error);
    return res.status(500).json({ success: false, message: "Could not read table records" });
  }
});

// GET /api/database/explorer
router.get("/explorer", (_req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Database Explorer - OptiMind</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#182230;font-family:Arial,sans-serif}main{max-width:1440px;margin:0 auto;padding:28px}header{display:flex;justify-content:space-between;align-items:end;gap:16px;margin-bottom:24px}h1{font-size:26px;margin:0 0 6px}h2{font-size:18px;margin:0}p{color:#5c6776;margin:0}a{color:#1769aa}.summary{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:12px;margin-bottom:20px}.metric,.panel{background:#fff;border:1px solid #d8e0ea;border-radius:6px}.metric{padding:16px}.label{color:#5c6776;font-size:12px;text-transform:uppercase}.value{font-size:18px;font-weight:700;margin-top:6px;overflow-wrap:anywhere}.panel{padding:18px;margin-bottom:16px}.toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:14px}select,button{border:1px solid #b9c7d8;border-radius:4px;background:#fff;color:#182230;font:inherit;padding:8px 10px}button{cursor:pointer;background:#1769aa;color:#fff;border-color:#1769aa}button:disabled{opacity:.45;cursor:default}.table-wrap{overflow:auto;border:1px solid #d8e0ea;margin-top:14px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid #e7edf4;padding:9px 10px;text-align:left;vertical-align:top;white-space:nowrap}th{background:#eef4f9;color:#30445b;position:sticky;top:0}.muted{color:#5c6776}.error{color:#b42318}.notice{font-size:13px;margin-top:10px}@media(max-width:760px){main{padding:16px}header{align-items:start;flex-direction:column}.summary{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style></head><body><main><header><div><h1>Database Explorer</h1><p>Read-only view of database type, table schemas, column data types, and records.</p></div><a href="/">Back to Control Center</a></header>
<section class="summary" id="summary"><div class="metric">Loading database metadata...</div></section><section class="panel"><h2>Table Records</h2><div class="toolbar"><label>Table <select id="tableSelect"></select></label><button id="previous">Previous</button><button id="next">Next</button><span id="pageInfo" class="muted"></span></div><div id="recordNotice" class="notice muted"></div><div class="table-wrap"><table id="records"></table></div></section><section class="panel"><h2>Column Types</h2><div class="table-wrap"><table id="columns"></table></div></section></main>
<script>
const pageSize=50;let offset=0,total=0;const text=v=>v==null?"":typeof v==="object"?JSON.stringify(v):String(v);const cell=v=>{const td=document.createElement("td");td.textContent=text(v);return td};const renderTable=(el,cols,rows)=>{el.replaceChildren();const head=document.createElement("tr");cols.forEach(c=>{const th=document.createElement("th");th.textContent=c;head.appendChild(th)});const thead=document.createElement("thead");thead.appendChild(head);el.appendChild(thead);const body=document.createElement("tbody");rows.forEach(row=>{const tr=document.createElement("tr");cols.forEach(c=>tr.appendChild(cell(row[c])));body.appendChild(tr)});el.appendChild(body)};
async function loadTable(){const table=document.getElementById("tableSelect").value;if(!table)return;const response=await fetch("/api/database/tables/"+encodeURIComponent(table)+"?limit="+pageSize+"&offset="+offset);const data=await response.json();if(!data.success)throw new Error(data.message||"Could not load table");total=data.pagination.total;renderTable(document.getElementById("records"),data.columns.map(c=>c.name),data.records);renderTable(document.getElementById("columns"),["position","name","dataType","nativeType","nullable","defaultValue"],data.columns);document.getElementById("recordNotice").textContent="Showing "+(total?offset+1:0)+"-"+Math.min(offset+pageSize,total)+" of "+total+" records."+(data.hiddenColumns.length?" Hidden sensitive columns: "+data.hiddenColumns.join(", ")+".":"");document.getElementById("previous").disabled=offset===0;document.getElementById("next").disabled=!data.pagination.hasNextPage;document.getElementById("pageInfo").textContent="Page "+(Math.floor(offset/pageSize)+1)}
function showError(error){const notice=document.getElementById("recordNotice");notice.className="notice error";notice.textContent=error.message}async function initialize(){try{const response=await fetch("/api/database/overview");const data=await response.json();if(!data.success)throw new Error(data.message||"Could not load database metadata");const summary=document.getElementById("summary");summary.replaceChildren();[["Engine",data.database.engine],["Database",data.database.databaseName],["Schema",data.database.schema],["Tables",data.tableCount]].forEach(([label,value])=>{const box=document.createElement("div");box.className="metric";const title=document.createElement("div");title.className="label";title.textContent=label;const val=document.createElement("div");val.className="value";val.textContent=value;box.append(title,val);summary.appendChild(box)});const select=document.getElementById("tableSelect");data.tables.forEach(table=>{const option=document.createElement("option");option.value=table.name;option.textContent=table.name+" ("+table.type+")";select.appendChild(option)});select.addEventListener("change",()=>{offset=0;loadTable().catch(showError)});document.getElementById("previous").addEventListener("click",()=>{offset=Math.max(0,offset-pageSize);loadTable().catch(showError)});document.getElementById("next").addEventListener("click",()=>{offset+=pageSize;loadTable().catch(showError)});await loadTable()}catch(error){showError(error)}}initialize();
</script></body></html>`);
});

export default router;
