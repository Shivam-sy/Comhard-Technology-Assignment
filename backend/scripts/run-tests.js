import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');
const dbDir = path.join(backendDir, '.test_db_data');

const PORT = 5432;
const USER = 'postgres';
const PASSWORD = 'postgres';
const DBNAME = 'support_desk';

async function run() {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const pg = new EmbeddedPostgres({
    databaseDir: dbDir,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
  });

  try {
    try {
      await pg.initialise();
    } catch (e) {}

    await pg.start();
    console.log('[Test Harness] PostgreSQL started on port 5432.');

    try {
      await pg.createDatabase(DBNAME);
    } catch (e) {}

    // Push Prisma schema to ensure all tables exist
    console.log('[Test Harness] Synchronizing Prisma schema...');
    execSync('npx prisma db push --schema=prisma/schema.prisma --skip-generate', {
      cwd: backendDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: `postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DBNAME}?schema=public`,
      },
    });

    console.log('[Test Harness] Running backend test suite...');
    execSync('node --test tests/api.test.js', {
      cwd: backendDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: `postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DBNAME}?schema=public`,
      },
    });

    console.log('[Test Harness] All tests passed successfully!');
  } catch (err) {
    console.error('[Test Harness] Test failure or error:', err.message);
    process.exitCode = 1;
  } finally {
    try {
      await pg.stop();
      console.log('[Test Harness] PostgreSQL stopped.');
    } catch (e) {}
  }
}

run();