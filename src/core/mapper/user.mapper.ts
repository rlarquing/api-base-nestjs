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
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserMapper {
  constructor(
    protected rolMapper: RolMapper,
    protected funcionMapper: FuncionMapper,
  ) {}
  dtoToEntity(userDto: UserDto): UserEntity {
    return plainToInstance(UserEntity, userDto);
  }
  dtoToUpdateEntity(
    updateUserDto: UpdateUserDto,
    updateUserEntity: UserEntity,
  ): UserEntity {
    return plainToInstance(UserEntity, {
      ...updateUserEntity,
      ...updateUserDto,
    });
  }
  async entityToDto(userEntity: UserEntity): Promise<ReadUserDto> {
    const readUserDto: ReadUserDto = plainToInstance(ReadUserDto, userEntity);
    readUserDto.dtoToString = userEntity.toString();

    const readRolDto: ReadRolDto[] = [];
    for (const rol of userEntity.roles) {
      readRolDto.push(await this.rolMapper.entityToDto(rol));
    }
    const readFuncionDto: ReadFuncionDto[] = [];
    for (const funcion of userEntity.funcions) {
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcion));
    }
    readUserDto.roles = readRolDto;
    readUserDto.funcions = readFuncionDto;

    return readUserDto;
  }
}
