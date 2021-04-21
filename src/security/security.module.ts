import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserController} from "./controller/user.controller";
import {RoleController} from "./controller/role.controller";
import {AuthController} from "./controller/auth.controller";
import {UserEntity} from "./entity/user.entity";
import {RoleEntity} from "./entity/role.entity";
import {UserService} from "./service/user.service";
import {RoleService} from "./service/role.service";
import {AuthService} from "./service/auth.service";
import {UserMapper} from "./mapper/user.mapper";
import {RoleMapper} from "./mapper/role.mapper";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {PassportModule} from "@nestjs/passport";
import {UserRepository} from "./repository/user.repository";
import {RoleRepository} from "./repository/role.repository";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@atlasjs/config";
import {AppConfig} from "../app.keys";
import {TrazaController} from "./controller/traza.controller";
import {TrazaEntity} from "./entity/traza.entity";
import {TrazaService} from "./service/traza.service";
import {TrazaRepository} from "./repository/traza.repository";
import {TrazaMapper} from "./mapper/traza.mapper";

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
        TypeOrmModule.forFeature([UserEntity, RoleEntity, TrazaEntity])],
    controllers: [UserController, RoleController, AuthController, TrazaController],
    providers: [UserService, RoleService, AuthService, UserMapper, RoleMapper, UserRepository, RoleRepository, JwtStrategy, TrazaService, TrazaRepository, TrazaMapper],
    exports: [JwtStrategy, PassportModule],
})
export class SecurityModule {
}
