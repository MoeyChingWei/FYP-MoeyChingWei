import "dotenv/config";
import pg from "pg";

const { Client } = pg;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const r = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name;",
  );
  console.log(r.rows.map((x) => x.table_name).join("\n") || "(no tables)");
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

