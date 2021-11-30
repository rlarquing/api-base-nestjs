import {Injectable} from "@nestjs/common";
import { ReadPermisoDto} from "../dto";
import {PermisoEntity} from "../entity";

@Injectable()
export class PermisoMapper {

    entityToDto(permisoEntity: PermisoEntity): ReadPermisoDto {
        const dtoToString: string = permisoEntity.toString();
        return new ReadPermisoDto(
            dtoToString,
            permisoEntity.id,
            permisoEntity.nombre,
            permisoEntity.servicio
        );
    }
}
