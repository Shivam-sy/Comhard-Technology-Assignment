import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend or workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/support_desk?schema=public',
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default env;
