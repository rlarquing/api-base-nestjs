import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MunicipioEntity, ProvinciaEntity} from "./entity";
import {MunicipioController, ProvinciaController} from "./controller";
import {MunicipioService, ProvinciaService} from "./service";
import {MunicipioRepository, ProvinciaRepository} from "./repository";
import {MunicipioMapper, ProvinciaMapper} from "./mapper";
import {SecurityModule} from "../security/security.module";
import {SharedModule} from "../shared/shared.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProvinciaEntity, MunicipioEntity]),
        SecurityModule,
        SharedModule
    ],
    controllers: [ProvinciaController, MunicipioController],
    providers: [ProvinciaService, MunicipioService, ProvinciaRepository, MunicipioRepository, ProvinciaMapper, MunicipioMapper],
})
export class DpaModule {
}
