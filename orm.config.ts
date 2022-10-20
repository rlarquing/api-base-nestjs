import { DataSource, DataSourceOptions } from 'typeorm';
import { Configuration } from './src/database/database.keys';
import { AppConfig } from './src/app.keys';
import { dataSource } from './config/config';

const config: DataSourceOptions = {
  ssl: dataSource()[AppConfig.SSL] === 'true',
  type: dataSource()[AppConfig.TYPE],
  port: +dataSource()[Configuration.DB_PORT],
  host: dataSource()[Configuration.DB_HOST],
  username: dataSource()[Configuration.DB_USER],
  password: dataSource()[Configuration.DB_PASS],
  database: dataSource()[Configuration.DB_NAME],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  entities: ['src/**/**/*.entity.{ts,js}'],
  synchronize: dataSource()[Configuration.DB_SYNC] === 'true',
  migrationsRun: dataSource()[Configuration.DB_MIGRATIONS_RUN],
};
export default new DataSource(config);
