import { Injectable } from '@nestjs/common';
import { FuncionMapper } from './funcion.mapper';
import {
  FuncionRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import { FuncionEntity, RolEntity, UserEntity } from '../../persistence/entity';
import {
  CreateRolDto,
  ReadFuncionDto,
  ReadRolDto,
  UpdateRolDto,
} from '../../shared/dto';

@Injectable()
export class RolMapper {
  constructor(
    protected rolRepository: RolRepository,
    protected userRepository: UserRepository,
    protected funcionRepository: FuncionRepository,
    protected funcionMapper: FuncionMapper,
  ) {}
  async dtoToEntity(createRolDto: CreateRolDto): Promise<RolEntity> {
    let users: UserEntity[] = [];
    if (createRolDto.users != undefined) {
      users = await this.userRepository.findByIds(createRolDto.users);
    }
    let funcions: FuncionEntity[] = [];
    if (createRolDto.funcions != undefined) {
      funcions = await this.funcionRepository.findByIds(createRolDto.funcions);
    }
    return new RolEntity(
      createRolDto.nombre,
      createRolDto.descripcion,
      funcions,
      users,
    );
  }
  async dtoToUpdateEntity(
    updateRolDto: UpdateRolDto,
    updateRolEntity: RolEntity,
  ): Promise<RolEntity> {
    if (updateRolDto.users != undefined) {
      const users: UserEntity[] = await this.userRepository.findByIds(
        updateRolDto.users,
      );
      if (users) {
        updateRolEntity.users = users;
      }
    }
    if (updateRolDto.funcions !== undefined) {
      updateRolEntity.funcions = await this.funcionRepository.findByIds(
        updateRolDto.funcions,
      );
    }

    updateRolEntity.nombre = updateRolDto.nombre;
    updateRolEntity.descripcion = updateRolDto.descripcion;

    return updateRolEntity;
  }
  async entityToDto(rolEntity: RolEntity): Promise<ReadRolDto> {
    const rol: RolEntity = await this.rolRepository.findById(rolEntity.id);
    const readFuncionDto: ReadFuncionDto[] = [];
    for (const funcion of rol.funcions) {
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcion));
    }
    const dtoToString: string = rol.toString();
    return new ReadRolDto(
      dtoToString,
      rolEntity.id,
      rolEntity.nombre,
      rolEntity.descripcion,
      readFuncionDto,
    );
  }
}
