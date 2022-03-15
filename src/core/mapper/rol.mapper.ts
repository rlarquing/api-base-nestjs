import { Injectable } from '@nestjs/common';
import { FuncionMapper } from './funcion.mapper';
import {
  DimensionRepository,
  FuncionRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import { DimensionMapper } from './dimension.mapper';
import {
  DimensionEntity,
  FuncionEntity,
  RolEntity,
  UserEntity,
} from '../../persistence/entity';
import {
  CreateRolDto,
  ReadDimensionDto,
  ReadFuncionDto,
  ReadRolDto,
  UpdateRolDto,
} from '../../shared/dto';

@Injectable()
export class RolMapper {
  constructor(
    protected rolRepository: RolRepository,
    protected userRepository: UserRepository,
    protected dimensionRepository: DimensionRepository,
    protected dimensionMapper: DimensionMapper,
    protected funcionRepository: FuncionRepository,
    protected funcionMapper: FuncionMapper,
  ) {}
  async dtoToEntity(createRolDto: CreateRolDto): Promise<RolEntity> {
    const users: UserEntity[] = await this.userRepository.findByIds(
      createRolDto.users,
    );
    const dimension: DimensionEntity = await this.dimensionRepository.findById(
      createRolDto.dimension,
    );
    const funcions: FuncionEntity[] = await this.funcionRepository.findByIds(
      createRolDto.funcions,
    );
    return new RolEntity(
      createRolDto.nombre,
      createRolDto.descripcion,
      dimension,
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

    const dimension: DimensionEntity = await this.dimensionRepository.findById(
      updateRolDto.dimension,
    );
    if (updateRolDto.funcions !== undefined) {
      updateRolEntity.funcions = await this.funcionRepository.findByIds(
        updateRolDto.funcions,
      );
    }

    updateRolEntity.nombre = updateRolDto.nombre;
    updateRolEntity.descripcion = updateRolDto.descripcion;
    updateRolEntity.dimension = dimension;

    return updateRolEntity;
  }
  async entityToDto(rolEntity: RolEntity): Promise<ReadRolDto> {
    const rol: RolEntity = await this.rolRepository.findById(rolEntity.id);
    const readFuncionDto: ReadFuncionDto[] = [];
    const readDimensionDto: ReadDimensionDto =
      await this.dimensionMapper.entityToDto(rol.dimension);
    for (const funcion of rol.funcions) {
      readFuncionDto.push(await this.funcionMapper.entityToDto(funcion));
    }
    const dtoToString: string = rol.toString();
    return new ReadRolDto(
      dtoToString,
      rolEntity.id,
      rolEntity.nombre,
      rolEntity.descripcion,
      readDimensionDto,
      readFuncionDto,
    );
  }
}
