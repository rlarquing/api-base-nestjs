import * as fs from 'fs';
import { normalize } from 'path';
import { AppConfig } from '../src/app.keys';
import { Configuration } from '../src/database/database.keys';

const defined = (v: unknown): boolean => typeof v !== 'undefined' && v !== '';

export const env = <T extends string | number | boolean>(
  name: string,
  defaultValue?: T,
): T => {
  const envFilePath = normalize(`${process.cwd()}/.env`);
  const existsPath = fs.existsSync(envFilePath);
  if (!existsPath) {
    console.log('.env file does not exist');
    process.exit(0);
  }
  let v: string | undefined = process.env[name];
  if (!defined(defaultValue) && !defined(v)) {
    console.error(`Missing environment variable: "${name}"`);
    process.exit(0);
  }

  if (v === 'true') {
    return true as T;
  }
  if (v === 'false') {
    return false as T;
  }

  if (defaultValue !== undefined) {
    return (v ?? String(defaultValue)) as T;
  }

  return v as T;
};

export const config = () => ({
  port: Number(env(AppConfig.PORT, 3000)),
  cors: env(AppConfig.CORS, true),
  logger: env(AppConfig.LOGGER, true),
  database: {
    ssl: env(AppConfig.SSL, false),
    type: env(AppConfig.TYPE, 'postgres'),
    host: env(Configuration.DB_HOST, 'localhost'),
    port: Number(env(Configuration.DB_PORT, 5432)),
    username: env(Configuration.DB_USER, 'postgres'),
    password: env(Configuration.DB_PASS, 'postgres'),
    database: env(Configuration.DB_NAME),
    synchronize: env(Configuration.DB_SYNC, false),
    migrationsRun: env(Configuration.DB_MIGRATIONS_RUN, true),
  },
  loggerLevels: String(env(AppConfig.LOGGER_LEVELS, ''))
    .split(',')
    .filter(Boolean),
});

const enviroment = (): Record<string, string> => {
  const envFilePath = normalize(`${process.cwd()}/.env`);
  const fileContent = fs.readFileSync(envFilePath, 'utf8');
  const lines = fileContent.split('\r\n').filter((item) => item !== '');
  const result: Record<string, string> = {};
  for (const item of lines) {
    const [key, value] = item.split('=');
    if (key) {
      result[key] = value ?? '';
    }
  }
  return result;
};

export const dataSource = (): Record<string, string> => enviroment();
