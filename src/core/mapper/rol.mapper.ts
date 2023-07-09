import { Injectable } from '@nestjs/common';
import { FuncionMapper } from './funcion.mapper';
import {
  FuncionRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import {
  FuncionEntity,
  GenericNomencladorEntity,
  RolEntity,
  UserEntity,
} from '../../persistence/entity';
import {
  CreateRolDto,
  ReadFuncionDto,
  ReadNomencladorDto,
  ReadRolDto,
  SelectDto,
  UpdateRolDto,
} from '../../shared/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RolMapper {
  constructor(protected funcionMapper: FuncionMapper) {}
  dtoToEntity(createRolDto: CreateRolDto): RolEntity {
    return plainToInstance(RolEntity, createRolDto);
    // let users: UserEntity[] = [];
    // if (createRolDto.users != undefined) {
    //   users = await this.userRepository.findByIds(createRolDto.users);
    // }
    // let funcions: FuncionEntity[] = [];
    // if (createRolDto.funcions != undefined) {
    //   funcions = await this.funcionRepository.findByIds(createRolDto.funcions);
    // }
    // return new RolEntity(
    //   createRolDto.nombre,
    //   createRolDto.descripcion,
    //   funcions,
    //   users,
    // );
  }
  dtoToUpdateEntity(
    updateRolDto: UpdateRolDto,
    updateRolEntity: RolEntity,
  ): RolEntity {
    return plainToInstance(RolEntity, {
      ...updateRolEntity,
      ...updateRolDto,
    });
    // if (updateRolDto.users != undefined) {
    //   const users: UserEntity[] = await this.userRepository.findByIds(
    //     updateRolDto.users,
    //   );
    //   if (users) {
    //     updateRolEntity.users = users;
    //   }
    // }
    // if (updateRolDto.funcions !== undefined) {
    //   updateRolEntity.funcions = await this.funcionRepository.findByIds(
    //     updateRolDto.funcions,
    //   );
    // }
    //
    // updateRolEntity.nombre = updateRolDto.nombre;
    // updateRolEntity.descripcion = updateRolDto.descripcion;
    // return updateRolEntity;
  }
  entityToDto(rolEntity: RolEntity): ReadRolDto {
    const readRolDto: ReadRolDto = plainToInstance(ReadRolDto, rolEntity);
    readRolDto.dtoToString = rolEntity.toString();
    const selectUserDto: SelectDto[] = [];
    for (const user of rolEntity.users) {
      selectUserDto.push({ label: user.username, value: user.id });
    }
    const readFuncionDto: ReadFuncionDto[] = [];
    for (const funcion of rolEntity.funcions) {
      readFuncionDto.push(this.funcionMapper.entityToDto(funcion));
    }
    readRolDto.users = selectUserDto;
    readRolDto.funcions = readFuncionDto;
    return readRolDto;
    //   const rol: RolEntity = await this.rolRepository.findById(rolEntity.id);
    //   const selectUserDto: SelectDto[] = [];
    //   for (const user of rol.users) {
    //     selectUserDto.push({ label: user.username, value: user.id });
    //   }
    //   const readFuncionDto: ReadFuncionDto[] = [];
    //   for (const funcion of rol.funcions) {
    //     readFuncionDto.push(await this.funcionMapper.entityToDto(funcion));
    //   }
    //   const dtoToString: string = rol.toString();
    //   return new ReadRolDto(
    //     dtoToString,
    //     rolEntity.id,
    //     rolEntity.nombre,
    //     rolEntity.descripcion,
    //     selectUserDto,
    //     readFuncionDto,
    //   );
  }
}
