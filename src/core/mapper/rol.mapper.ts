import { Injectable } from '@nestjs/common';
import { FuncionMapper } from './funcion.mapper';
import {
  FuncionRepository,
} from '../../persistence/repository';
import {
  RolEntity,
} from '../../persistence/entity';
import {
  CreateRolDto,
  ReadFuncionDto,
  ReadRolDto,
  SelectDto,
  UpdateRolDto,
} from '../../shared/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RolMapper {
  constructor(
      protected funcionMapper: FuncionMapper,
      protected funcionRepository: FuncionRepository
              ) {}
  dtoToEntity(createRolDto: CreateRolDto): RolEntity {
    return plainToInstance(RolEntity, createRolDto);
  }
  dtoToUpdateEntity(
    updateRolDto: UpdateRolDto,
    updateRolEntity: RolEntity,
  ): RolEntity {
    return plainToInstance(RolEntity, {
      ...updateRolEntity,
      ...updateRolDto,
    });
  }
  async entityToDto(rolEntity: RolEntity): Promise<ReadRolDto> {
    const readRolDto: ReadRolDto = plainToInstance(ReadRolDto, rolEntity);
    readRolDto.dtoToString = rolEntity.toString();
    const selectUserDto: SelectDto[] = [];

    for (const user of rolEntity.users) {
      selectUserDto.push({label: user.username, value: user.id});
    }
    const readFuncionDto: ReadFuncionDto[] = [];
    for (const funcion of rolEntity.funcions) {
      const funcionRol = await this.funcionRepository.findById(funcion.id);
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcionRol));
    }
    readRolDto.users = selectUserDto;
    readRolDto.funcions = readFuncionDto;
    return readRolDto;
  }
}
