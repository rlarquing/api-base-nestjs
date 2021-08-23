import {Injectable} from '@nestjs/common';
import {CreateRoleDto, ReadRoleDto, UpdateRoleDto} from '../dto'
import {RoleEntity} from "../entity";

@Injectable()
export class RoleMapper {
    dtoToEntity(createRoleDto: CreateRoleDto): RoleEntity {
        return new RoleEntity(
            createRoleDto.nombre,
            createRoleDto.descripcion
        );
    }

    dtoToUpdateEntity(updateRoleDto: UpdateRoleDto, updateRoleEntity: RoleEntity): RoleEntity {
        updateRoleEntity.nombre = updateRoleDto.nombre;
        updateRoleEntity.descripcion = updateRoleDto.descripcion;
        return updateRoleEntity;
    }

    entityToDto(roleEntity: RoleEntity): ReadRoleDto {
        return new ReadRoleDto(
            roleEntity.id,
            roleEntity.nombre,
            roleEntity.descripcion
        );
    }
}
