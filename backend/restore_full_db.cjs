const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./prisma/generated/prisma/client');
const pg = require('pg');
const fs = require('fs');

async function restoreFullDatabase() {
  const pool = new pg.Pool({ connectionString: 'postgresql://postgres:FYP123@localhost:5432/FYPData' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Step 1: Dropping all existing tables...');

    // Get all table names
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename != '_prisma_migrations'
    `;

    // Drop all tables
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS public.${table.tablename} CASCADE`);
      console.log(`  Dropped: ${table.tablename}`);
    }

    console.log('✅ All tables dropped\n');

    console.log('Step 2: Running Prisma migration to recreate schema...');
    await prisma.$disconnect();
    await pool.end();

    const { execSync } = require('child_process');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    console.log('✅ Schema recreated\n');

    console.log('Step 3: Restoring data from backup...');

    // Reconnect
    const newPool = new pg.Pool({ connectionString: 'postgresql://postgres:FYP123@localhost:5432/FYPData' });
    const client = await newPool.connect();

    // Read and execute backup SQL (skip schema creation parts)
    const backupSQL = fs.readFileSync('./temp_full_backup.sql', 'utf8');

    // Extract only COPY commands and data
    const copyBlocks = backupSQL.match(/COPY public\.\w+[^;]+;/gs);

    if (copyBlocks) {
      for (const block of copyBlocks) {
        try {
          await client.query(block);
          const tableName = block.match(/COPY public\.(\w+)/)[1];
          console.log(`  Restored data for: ${tableName}`);
        } catch (err) {
          console.error(`  Error restoring: ${err.message}`);
        }
      }
    }

    await client.release();
    await newPool.end();

    console.log('\n✅ Database fully restored from backup!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

restoreFullDatabase();
