import 'dotenv/config';

const testDatabaseUrl = String(process.env.TEST_DATABASE_URL ?? '').trim();
if (!testDatabaseUrl) {
  throw new Error(
    'TEST_DATABASE_URL is required for backend tests. Configure a disposable PostgreSQL database; tests will not use DATABASE_URL implicitly.'
  );
}

let testDatabase;
let developmentDatabase;
try {
  testDatabase = new URL(testDatabaseUrl);
  developmentDatabase = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null;
} catch {
  throw new Error('TEST_DATABASE_URL must be a valid PostgreSQL connection string.');
}

const databaseIdentity = (databaseUrl) =>
  `${databaseUrl.protocol}//${databaseUrl.hostname}:${databaseUrl.port || '5432'}${databaseUrl.pathname}`.toLowerCase();

if (developmentDatabase && databaseIdentity(testDatabase) === databaseIdentity(developmentDatabase)) {
  throw new Error('TEST_DATABASE_URL must point to a database different from DATABASE_URL.');
}

process.env.DATABASE_URL = testDatabaseUrl;
process.env.NODE_ENV = 'test';
