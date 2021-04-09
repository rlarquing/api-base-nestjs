import { Injectable } from '@nestjs/common';
import {CreateRoleDto, ReadRoleDto} from './../dto'
import {RoleEntity} from "../entity/role.entity";

@Injectable()
export class RoleMapper {
  dtoToEntity(createRoleDto: CreateRoleDto): RoleEntity {
    return new RoleEntity(
        createRoleDto.nombre,
        createRoleDto.descripcion
    );
  }

  entityToDto(roleEntity: RoleEntity): ReadRoleDto{
    return new ReadRoleDto(
        roleEntity.id,
        roleEntity.nombre,
        roleEntity.descripcion
    );
  }
}
