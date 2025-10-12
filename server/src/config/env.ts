import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve project root from this file: ../../
const projectRoot = path.resolve(__dirname, '../..');

const nodeEnv = process.env.NODE_ENV ?? 'development';

// Load env file based on NODE_ENV
const envFile = `.env.${nodeEnv}`;
dotenv.config({ path: path.join(projectRoot, envFile) });

export type AppConfig = {
  env: 'development' | 'test' | 'production';
  port: number;
};

export const config: AppConfig = {
  env: (nodeEnv as AppConfig['env']) ?? 'development',
  port: Number(process.env.PORT ?? 3000),
};
