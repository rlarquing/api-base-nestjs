import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@atlasjs/config';
import {ConfigService} from '@atlasjs/config';
import {ConnectionOptions} from 'typeorm';
import {Configuration} from './database.keys';
import {AppConfig} from '../app.keys';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        async useFactory(configService: ConfigService) {
            const ssl = configService.config[AppConfig.SSL].toLowerCase() === "true";
            const synchronize = configService.config[Configuration.DB_SYNC].toLowerCase() === "true";
            return {
                ssl: ssl,
                type: configService.config[AppConfig.TYPE],
                host: configService.config[Configuration.DB_HOST],
                database: configService.config[Configuration.DB_NAME],
                port: parseInt(configService.config[Configuration.DB_PORT]),
                username: configService.config[Configuration.DB_USER],
                password: configService.config[Configuration.DB_PASS],
                entities: [__dirname + '/../**/*.entity.{js,ts}'],
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                synchronize: synchronize
            } as ConnectionOptions;
        }
    })
];
