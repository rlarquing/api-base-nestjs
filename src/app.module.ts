import { Module } from '@nestjs/common';
import { AppConfig } from './app.keys';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../config/config';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { PersistenceModule } from './persistence/persistence.module';
import { LoggerProvider } from './core/logger/logger.provider';
import { ApiModule } from './api/api.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DatabaseModule,
    PersistenceModule,
    CoreModule,
    ApiModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;
  static cors: boolean;
  static logger: boolean;
  static loggerProvider: LoggerProvider;

  constructor(private configService: ConfigService) {
    AppModule.port = parseInt(this.configService.get(AppConfig.PORT));
    AppModule.cors = this.configService.get(AppConfig.CORS) === 'true';
    AppModule.logger = this.configService.get(AppConfig.LOGGER) === 'true';
    AppModule.loggerProvider = new LoggerProvider(configService);
  }
}
