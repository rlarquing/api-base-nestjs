import { Injectable } from '@nestjs/common';
import { CreateRolDto, ReadPermisoDto, ReadRolDto, UpdateRolDto } from '../dto';
import { PermisoEntity, RolEntity, UserEntity } from '../entity';
import {
  PermisoRepository,
  RolRepository,
  UserRepository,
} from '../repository';
import { PermisoMapper } from './permiso.mapper';
import { DimensionEntity } from '../../nomenclator/entity';
import { DimensionMapper } from '../../nomenclator/mapper';
import { DimensionRepository } from '../../nomenclator/repository';
import { ReadDimensionDto } from '../../nomenclator/dto';

@Injectable()
export class RolMapper {
  constructor(
    protected rolRepository: RolRepository,
    protected userRepository: UserRepository,
    protected dimensionRepository: DimensionRepository,
    protected dimensionMapper: DimensionMapper,
    protected permisoRepository: PermisoRepository,
    protected permisoMapper: PermisoMapper,
  ) {}
  async dtoToEntity(createRolDto: CreateRolDto): Promise<RolEntity> {
    const users: UserEntity[] = await this.userRepository.findByIds(
      createRolDto.users,
    );
    const dimension: DimensionEntity = await this.dimensionRepository.findById(
      createRolDto.dimension,
    );
    const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(
      createRolDto.permisos,
    );
    return new RolEntity(
      createRolDto.nombre,
      createRolDto.descripcion,
      dimension,
      users,
      permisos,
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
    if (updateRolDto.permisos !== undefined) {
      const permisos: PermisoEntity[] = await this.permisoRepository.findByIds(
        updateRolDto.permisos,
      );
      updateRolEntity.permisos = permisos;
    }

    updateRolEntity.nombre = updateRolDto.nombre;
    updateRolEntity.descripcion = updateRolDto.descripcion;
    updateRolEntity.dimension = dimension;

    return updateRolEntity;
  }
  async entityToDto(rolEntity: RolEntity): Promise<ReadRolDto> {
    const rol: RolEntity = await this.rolRepository.findById(rolEntity.id);
    const readPermisoDto: ReadPermisoDto[] = [];
    const readDimensionDto: ReadDimensionDto =
      await this.dimensionMapper.entityToDto(rol.dimension);
    for (const permiso of rol.permisos) {
      readPermisoDto.push(await this.permisoMapper.entityToDto(permiso));
    }
    const dtoToString: string = rol.toString();
    return new ReadRolDto(
      dtoToString,
      rolEntity.id,
      rolEntity.nombre,
      rolEntity.descripcion,
      readDimensionDto,
      readPermisoDto,
    );
  }
}
