import { forwardRef, Module } from '@nestjs/common';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '../app.keys';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisoEntity, RolEntity, TrazaEntity, UserEntity } from './entity';
import {
  AuthController,
  RolController,
  TrazaController,
  UserController,
} from './controller';
import {
  AuthService,
  PermisoService,
  RolService,
  TrazaService,
  UserService,
} from './service';
import { PermisoMapper, RolMapper, TrazaMapper, UserMapper } from './mapper';
import {
  PermisoRepository,
  RolRepository,
  TrazaRepository,
  UserRepository,
} from './repository';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { SharedModule } from '../shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get(AppConfig.SECRET),
          signOptions: {
            expiresIn: 3600,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RolEntity,
      TrazaEntity,
      PermisoEntity,
    ]),
    forwardRef(() => SharedModule),
  ],
  controllers: [UserController, RolController, AuthController, TrazaController],
  providers: [
    UserRepository,
    RolRepository,
    TrazaRepository,
    PermisoRepository,
    UserService,
    RolService,
    AuthService,
    PermisoService,
    UserMapper,
    RolMapper,
    JwtStrategy,
    RefreshStrategy,
    TrazaService,
    TrazaMapper,
    PermisoMapper,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    RefreshStrategy,
    TrazaService,
    RolRepository,
    RolMapper,
    UserService,
    UserMapper,
    JwtModule,
  ],
})
export class SecurityModule {}
