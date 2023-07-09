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
import {FuncionRepository, RolRepository} from "../../persistence/repository";

@Injectable()
export class UserMapper {
  constructor(
    protected rolMapper: RolMapper,
    protected funcionMapper: FuncionMapper,
    protected rolRepository: RolRepository,
    protected funcionRepository: FuncionRepository,
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
      const rolUser=await this.rolRepository.findById(rol.id);
      readRolDto.push(await this.rolMapper.entityToDto(rolUser));
    }
    const readFuncionDto: ReadFuncionDto[] = [];
    for (const funcion of userEntity.funcions) {
      const funcionUser=await this.funcionRepository.findById(funcion.id);
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcionUser));
    }
    readUserDto.roles = readRolDto;
    readUserDto.funcions = readFuncionDto;

    return readUserDto;
  }
}
