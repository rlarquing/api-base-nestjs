import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MunicipioEntity, ProvinciaEntity} from "./entity";
import {MunicipioController, ProvinciaController} from "./controller";
import {MunicipioService, ProvinciaService} from "./service";
import {MunicipioRepository, ProvinciaRepository} from "./repository";
import {MunicipioMapper, ProvinciaMapper} from "./mapper";
import {SecurityModule} from "../security/security.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProvinciaEntity, MunicipioEntity]),
        SecurityModule
    ],
    controllers: [ProvinciaController, MunicipioController],
    providers: [ProvinciaService, MunicipioService, ProvinciaRepository, MunicipioRepository, ProvinciaMapper, MunicipioMapper],
})
export class DpaModule {
}
