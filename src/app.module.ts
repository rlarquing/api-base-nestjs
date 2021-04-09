import { SecurityModule } from './security/security.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@atlasjs/config';
import { DatabaseModule } from './database/database.module';
import { AppConfig } from './app.keys';

@Module({
  imports: [
        SecurityModule, ConfigModule.forRoot({}), DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;

  constructor(private configService: ConfigService) {
    AppModule.port = parseInt(this.configService.config[AppConfig.PORT]);
  }
}
