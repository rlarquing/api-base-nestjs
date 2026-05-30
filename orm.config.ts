import { DataSource } from 'typeorm';
import { Configuration } from './src/database/database.keys';
import { AppConfig } from './src/app.keys';
import { dataSource } from './config/config';

// Obtener el tipo de base de datos desde la configuración
const dbType = dataSource()[AppConfig.TYPE];
const migrationsRun = dataSource()[Configuration.DB_MIGRATIONS_RUN] === 'true';

// Crear la configuración con el tipo correcto
const config: any = {
  ssl: dataSource()[AppConfig.SSL] === 'true',
  type: dbType,
  port: +dataSource()[Configuration.DB_PORT],
  host: dataSource()[Configuration.DB_HOST],
  username: dataSource()[Configuration.DB_USER],
  password: dataSource()[Configuration.DB_PASS],
  database: dataSource()[Configuration.DB_NAME],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  entities: ['src/**/**/*.entity.{ts,js}'],
  synchronize: dataSource()[Configuration.DB_SYNC] === 'true',
  migrationsRun,
};

export default new DataSource(config);
