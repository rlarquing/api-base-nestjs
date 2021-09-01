import {Module} from '@nestjs/common';
import {JwtStrategy} from "./strategy/jwt.strategy";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@atlasjs/config";
import {AppConfig} from "../app.keys";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoleEntity, TrazaEntity, UserEntity} from "./entity";
import {AuthController, RoleController, TrazaController, UserController} from "./controller";
import {AuthService, RoleService, TrazaService, UserService} from "./service";
import {RoleMapper, TrazaMapper, UserMapper} from "./mapper";
import {RoleRepository, TrazaRepository, UserRepository} from "./repository";
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
                        expiresIn: 100,
                    },
                };
            },
        }),
        TypeOrmModule.forFeature([UserEntity, RoleEntity, TrazaEntity])
    ],
    controllers: [UserController, RoleController, AuthController, TrazaController],
    providers: [UserService, RoleService, AuthService, UserMapper, RoleMapper, UserRepository, RoleRepository, JwtStrategy, RefreshStrategy, TrazaService, TrazaRepository, TrazaMapper],
    exports: [JwtStrategy, PassportModule, RefreshStrategy],
})
export class SecurityModule {
}
