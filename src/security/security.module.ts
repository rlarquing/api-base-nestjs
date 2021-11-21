import {Module} from '@nestjs/common';
import {JwtStrategy} from "./strategy/jwt.strategy";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@atlasjs/config";
import {AppConfig} from "../app.keys";
import {TypeOrmModule} from "@nestjs/typeorm";
import {EntidadEntity, GrupoEntity, PermisoEntity, RolEntity, TrazaEntity, UserEntity} from "./entity";
import {AuthController, RolController, TrazaController, UserController} from "./controller";
import {AuthService, RolService, TrazaService, UserService} from "./service";
import {RolMapper, TrazaMapper, UserMapper} from "./mapper";
import {RolRepository, TrazaRepository, UserRepository} from "./repository";
import {RefreshStrategy} from "./strategy/refresh.strategy";

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService) {
                return {
                    secret: configService.config[AppConfig.SECRET],
                    signOptions: {
                        expiresIn: 3600,
                    },
                };
            },
        }),
        TypeOrmModule.forFeature([UserEntity, RolEntity, TrazaEntity, EntidadEntity,PermisoEntity, GrupoEntity])
    ],
    controllers: [UserController, RolController, AuthController, TrazaController],
    providers: [UserService, RolService, AuthService, UserMapper, RolMapper, UserRepository, RolRepository, JwtStrategy, RefreshStrategy, TrazaService, TrazaRepository, TrazaMapper],
    exports: [JwtStrategy, PassportModule, RefreshStrategy, TrazaService, RolRepository, RolMapper, UserService, UserMapper],
})
export class SecurityModule {
}
