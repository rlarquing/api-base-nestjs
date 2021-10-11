import { SharedModule } from './shared/shared.module';
import { DpaModule } from './dpa/dpa.module';
import { SecurityModule } from './security/security.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@atlasjs/config';
import { DatabaseModule } from './database/database.module';
import { AppConfig } from './app.keys';
import {NomenclatorModule} from "./nomenclator/nomenclator.module";

@Module({
  imports: [
    SharedModule,
    DpaModule,
    SecurityModule,
    ConfigModule.forRoot({}),
    DatabaseModule,
    NomenclatorModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;

  constructor(private configService: ConfigService) {
    AppModule.port = parseInt(this.configService.config[AppConfig.PORT]);
  }
}
