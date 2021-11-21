import { ConnectionOptions } from 'typeorm';
import { env } from './env';
import {Configuration} from './database.keys';
import {AppConfig} from '../app.keys';

const DB: ConnectionOptions = {
  ssl: env(AppConfig.SSL),
  type: env(AppConfig.TYPE,'postgres'),
  port: +env(Configuration.DB_PORT, 5432),
  host: env(Configuration.DB_HOST),
  username: env(Configuration.DB_USER, 'postgres'),
  password: env(Configuration.DB_PASS),
  database: env(Configuration.DB_NAME),
  migrations: ['src/database/migrations/*{.ts,.js}'],
  entities: ['src/**/**/*.entity.{ts,js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  synchronize: env(Configuration.DB_SYNC),
};

export = DB;
