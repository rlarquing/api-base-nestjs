import {forwardRef, Module} from '@nestjs/common';
import {JwtStrategy} from "./strategy/jwt.strategy";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@atlasjs/config";
import {AppConfig} from "../app.keys";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ModeloEntity, GrupoEntity, PermisoEntity, RolEntity, TrazaEntity, UserEntity} from "./entity";
import {AuthController, GrupoController, RolController, TrazaController, UserController} from "./controller";
import {AuthService, GrupoService, RolService, TrazaService, UserService} from "./service";
import {GrupoMapper, ModeloMapper, PermisoMapper, RolMapper, TrazaMapper, UserMapper} from "./mapper";
import {
    GrupoRepository,
    ModeloRepository,
    PermisoRepository,
    RolRepository,
    TrazaRepository,
    UserRepository
} from "./repository";
import {RefreshStrategy} from "./strategy/refresh.strategy";
import {SharedModule} from "../shared/shared.module";

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
                        expiresIn: 3600
                    }
                };
            }
        }),
        TypeOrmModule.forFeature([UserEntity, RolEntity, TrazaEntity, ModeloEntity, PermisoEntity, GrupoEntity ]),
        forwardRef(() => SharedModule)
    ],
    controllers: [UserController, RolController, AuthController, TrazaController, GrupoController],
    providers: [
        UserRepository,
        RolRepository,
        TrazaRepository,
        ModeloRepository,
        PermisoRepository,
        GrupoRepository,
        UserService,
        RolService,
        AuthService,
        UserMapper,
        RolMapper,
        GrupoService,
        JwtStrategy,
        RefreshStrategy,
        TrazaService,
        TrazaMapper,
        ModeloMapper,
        PermisoMapper,
        GrupoMapper
    ],
    exports: [
        JwtStrategy,
        PassportModule,
        RefreshStrategy,
        TrazaService,
        RolRepository,
        RolMapper,
        UserService,
        UserMapper]
})
export class SecurityModule {
}
