import { Module } from '@nestjs/common';
import { AppConfig } from './app.keys';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../config/config';
import { LoggerProvider } from './core/logger/logger.provider';
import {module} from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
      ...module
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
