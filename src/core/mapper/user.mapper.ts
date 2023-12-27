import { Injectable } from '@nestjs/common';
import { RolMapper } from './rol.mapper';
import { FuncionMapper } from './funcion.mapper';
import {
  ReadFuncionDto,
  ReadRolDto,
  ReadUserDto,
  UpdateUserDto,
  UserDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';

@Injectable()
export class UserMapper {
  constructor(
    protected rolMapper: RolMapper,
    protected funcionMapper: FuncionMapper,
  ) {}
  dtoToEntity(userDto: UserDto): UserEntity {
    return new UserEntity(userDto.userName, userDto.email);
  }
  dtoToUpdateEntity(
    updateUserDto: UpdateUserDto,
    updateUserEntity: UserEntity,
  ): UserEntity {
    updateUserEntity.userName = updateUserDto.userName;
    updateUserEntity.email = updateUserDto.email;
    return updateUserEntity;
  }
  async entityToDto(userEntity: UserEntity): Promise<ReadUserDto> {
    const readRolDto: ReadRolDto[] = [];
    for (const rol of userEntity.roles) {
      readRolDto.push(await this.rolMapper.entityToDto(rol));
    }
    const readFuncionDto: ReadFuncionDto[] = [];
    for (const funcion of userEntity.funcions) {
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcion));
    }
    const dtoToString: string = userEntity.toString();
    return new ReadUserDto(
      dtoToString,
      userEntity.id,
      userEntity.userName,
      userEntity.email,
      readRolDto,
      readFuncionDto,
    );
  }
}
