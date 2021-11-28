import { ConnectionOptions } from 'typeorm';
import {Configuration} from './src/database/database.keys';
import {AppConfig} from './src/app.keys';
import {env} from 'config/config';

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
