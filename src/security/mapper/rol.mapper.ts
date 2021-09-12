import {Injectable} from '@nestjs/common';
import {CreateRolDto, ReadRolDto, UpdateRolDto} from '../dto'
import {RolEntity} from "../entity";

@Injectable()
export class RolMapper {
    dtoToEntity(createRolDto: CreateRolDto): RolEntity {
        return new RolEntity(
            createRolDto.nombre,
            createRolDto.descripcion
        );
    }

    dtoToUpdateEntity(updateRolDto: UpdateRolDto, updateRolEntity: RolEntity): RolEntity {
        updateRolEntity.nombre = updateRolDto.nombre;
        updateRolEntity.descripcion = updateRolDto.descripcion;
        return updateRolEntity;
    }

    entityToDto(roleEntity: RolEntity): ReadRolDto {
        return new ReadRolDto(
            roleEntity.id,
            roleEntity.nombre,
            roleEntity.descripcion
        );
    }
}