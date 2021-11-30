import { SharedModule } from './shared/shared.module';
import { DpaModule } from './dpa/dpa.module';
import { SecurityModule } from './security/security.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppConfig } from './app.keys';
import {NomenclatorModule} from "./nomenclator/nomenclator.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {config} from "../config/config";
import {LoggerProvider} from "./shared/logger/logger.provider";

@Module({
  imports: [
    SharedModule,
    DpaModule,
    SecurityModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    DatabaseModule,
    NomenclatorModule
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
    AppModule.cors = this.configService.get(AppConfig.CORS);
    AppModule.logger = this.configService.get(AppConfig.LOGGER);
    AppModule.loggerProvider = new LoggerProvider(configService)
  }
}
