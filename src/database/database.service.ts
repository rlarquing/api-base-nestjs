import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../app.keys';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    async useFactory(configService: ConfigService) {
      return {
        ...configService.get(AppConfig.DATABASE),
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      };
    },
  }),
];
