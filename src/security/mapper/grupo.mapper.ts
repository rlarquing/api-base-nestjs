import {Injectable} from '@nestjs/common';
import {CreateGrupoDto, ReadGrupoDto, UpdateGrupoDto} from '../dto'
import {GrupoEntity} from "../entity";

@Injectable()
export class GrupoMapper {
    dtoToEntity(createGrupoDto: CreateGrupoDto): GrupoEntity {
        return new GrupoEntity(
            createGrupoDto.nombre,
            createGrupoDto.descripcion
        );
    }

    dtoToUpdateEntity(updateGrupoDto: UpdateGrupoDto, updateGrupoEntity: GrupoEntity): GrupoEntity {
        updateGrupoEntity.nombre = updateGrupoDto.nombre;
        updateGrupoEntity.descripcion = updateGrupoDto.descripcion;
        return updateGrupoEntity;
    }

    entityToDto(grupoEntity: GrupoEntity): ReadGrupoDto {
        const dtoToString: string = grupoEntity.toString();
        return new ReadGrupoDto(
            grupoEntity.id,
            grupoEntity.nombre,
            grupoEntity.descripcion,
            dtoToString
        );
    }
}
