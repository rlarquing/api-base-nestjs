import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SecurityModule} from "../security/security.module";
import {SharedModule} from "../shared/shared.module";
import {DpaModule} from "../dpa/dpa.module";
import {GenericNomencladorRepository} from "./repository";
import {GenericNomencladorService} from "./service";
import {GenericNomencladorMapper} from "./mapper";
import {GenericNomencladorController} from "./controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([

        ]),
        forwardRef(() => SecurityModule),
        forwardRef(() => SharedModule),
        DpaModule
    ],
    controllers: [GenericNomencladorController],
    providers: [
        GenericNomencladorMapper,
        GenericNomencladorService,
        GenericNomencladorRepository,
    ],
    exports: [
        GenericNomencladorMapper,
        GenericNomencladorService,
        GenericNomencladorRepository]
})
export class NomenclatorModule {
}
