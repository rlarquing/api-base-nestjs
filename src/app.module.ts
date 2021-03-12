import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@atlasjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AppConfig } from './app.keys';

@Module({
  imports: [ConfigModule.forRoot({}), DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static port: number | string;

  constructor(private configService: ConfigService) {
    AppModule.port = parseInt(this.configService.config[AppConfig.PORT]);
  }
}
