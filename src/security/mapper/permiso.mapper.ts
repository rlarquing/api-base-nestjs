import {Injectable} from "@nestjs/common";
import {ReadModeloDto, ReadPermisoDto} from "../dto";
import {PermisoEntity} from "../entity";
import {PermisoRepository} from "../repository";
import {ModeloMapper} from "./modelo.mapper";

@Injectable()
export class PermisoMapper {
    constructor(
        protected modeloMapper: ModeloMapper
    ) {
    }
    async entityToDto(permisoEntity: PermisoEntity): Promise<ReadPermisoDto> {
        const dtoToString: string = permisoEntity.toString();
        const readModeloDto: ReadModeloDto = this.modeloMapper.entityToDto(permisoEntity.modelo);
        return new ReadPermisoDto(
            dtoToString,
            permisoEntity.id,
            permisoEntity.nombre,
            permisoEntity.servicio,
            readModeloDto
        );
    }
}
