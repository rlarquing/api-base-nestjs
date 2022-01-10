import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entity';
import {
  ReadPermisoDto,
  ReadRolDto,
  ReadUserDto,
  UpdateUserDto,
  UserDto,
} from '../dto';
import { PermisoMapper } from './permiso.mapper';
import { RolMapper } from './rol.mapper';

@Injectable()
export class UserMapper {
  constructor(
    protected rolMapper: RolMapper,
    protected permisoMapper: PermisoMapper,
  ) {}
  dtoToEntity(userDto: UserDto): UserEntity {
    return new UserEntity(userDto.username, userDto.email);
  }

  dtoToUpdateEntity(
    updateUserDto: UpdateUserDto,
    updateUserEntity: UserEntity,
  ): UserEntity {
    updateUserEntity.username = updateUserDto.username;
    updateUserEntity.email = updateUserDto.email;
    return updateUserEntity;
  }

  async entityToDto(userEntity: UserEntity): Promise<ReadUserDto> {
    const readRolDto: ReadRolDto[] = [];
    for (const rol of userEntity.roles) {
      readRolDto.push(await this.rolMapper.entityToDto(rol));
    }
    const readPermisoDto: ReadPermisoDto[] = [];
    for (const permiso of userEntity.permisos) {
      readPermisoDto.push(await this.permisoMapper.entityToDto(permiso));
    }

    const dtoToString: string = userEntity.toString();
    return new ReadUserDto(
      dtoToString,
      userEntity.id,
      userEntity.username,
      userEntity.email,
      readRolDto,
      readPermisoDto,
    );
  }
}
