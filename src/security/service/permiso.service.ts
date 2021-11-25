import {Injectable} from "@nestjs/common";
import {PermisoRepository} from "../repository";
import {CreatePermisoDto} from "../dto";
import {PermisoEntity} from "../entity";

@Injectable()
export class PermisoService {
    constructor(
        private permisoRepository: PermisoRepository
    ) {
    }
    async create(createPermisoDto: CreatePermisoDto): Promise<void> {
        const {nombre, servicio} = createPermisoDto;
        const permisoEntity: PermisoEntity = new PermisoEntity(nombre, servicio);
        await this.permisoRepository.create(permisoEntity);
    }
}