import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..');
const dbDir = path.join(backendDir, '.db_data');

const PORT = parseInt(process.env.DB_PORT || '5432', 10);
const USER = process.env.DB_USER || 'postgres';
const PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DBNAME = process.env.DB_NAME || 'support_desk';

async function main() {
  console.log(`[Database] Initializing PostgreSQL cluster at ${dbDir}...`);
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
    await pg.initialise();
    console.log('[Database] Cluster initialized.');
  } catch (err) {
    console.log('[Database] Cluster already initialized or resuming:', err.message);
  }

  try {
    console.log(`[Database] Starting PostgreSQL server on port ${PORT}...`);
    await pg.start();
    console.log(`[Database] PostgreSQL server running on port ${PORT}!`);

    try {
      await pg.createDatabase(DBNAME);
      console.log(`[Database] Database "${DBNAME}" created.`);
    } catch (dbErr) {
      console.log(`[Database] Database "${DBNAME}" check:`, dbErr.message || 'Already exists');
    }

    const databaseUrl = `postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DBNAME}?schema=public`;
    const envPath = path.join(backendDir, '.env');

    let currentEnv = '';
    if (fs.existsSync(envPath)) {
      currentEnv = fs.readFileSync(envPath, 'utf-8');
    }

    if (!currentEnv.includes('DATABASE_URL=')) {
      currentEnv += `\nDATABASE_URL="${databaseUrl}"\n`;
    } else {
      currentEnv = currentEnv.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${databaseUrl}"`);
    }

    if (!currentEnv.includes('PORT=')) {
      currentEnv += `PORT=5000\n`;
    }

    fs.writeFileSync(envPath, currentEnv.trim() + '\n', 'utf-8');
    console.log(`[Database] DATABASE_URL configured in backend/.env: ${databaseUrl}`);

    console.log('[Database] PostgreSQL is running in persistent mode. Keeping process alive.');
    
    // Keep alive indefinitely
    setInterval(() => {}, 1000 * 60 * 60);

    const shutdown = async () => {
      console.log('\n[Database] Shutting down PostgreSQL...');
      try {
        await pg.stop();
      } catch (e) {}
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (startErr) {
    console.error('[Database] Error starting PostgreSQL:', startErr);
    process.exit(1);
  }
}

main();
