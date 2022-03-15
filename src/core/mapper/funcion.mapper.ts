import { Injectable } from '@nestjs/common';
import { EndPointMapper } from './end-point.mapper';
import {
  EndPointRepository,
  FuncionRepository,
  MenuRepository,
} from '../../persistence/repository';
import { MenuMapper } from './menu.mapper';
import {
  CreateFuncionDto,
  ReadEndPointDto,
  ReadFuncionDto,
  ReadMenuDto,
  UpdateFuncionDto,
} from '../../shared/dto';
import {
  EndPointEntity,
  FuncionEntity,
  MenuEntity,
} from '../../persistence/entity';

@Injectable()
export class FuncionMapper {
  constructor(
    protected funcionRepository: FuncionRepository,
    protected endPointRepository: EndPointRepository,
    protected endPointMapper: EndPointMapper,
    protected menuRepository: MenuRepository,
    protected menuMapper: MenuMapper,
  ) {}

  async dtoToEntity(
    createFuncionDto: CreateFuncionDto,
  ): Promise<FuncionEntity> {
    const menu: MenuEntity = await this.menuRepository.findById(
      createFuncionDto.menu,
    );
    const endPoints: EndPointEntity[] = await this.endPointRepository.findByIds(
      createFuncionDto.endPoints,
    );
    return new FuncionEntity(
      createFuncionDto.nombre,
      createFuncionDto.descripcion,
      endPoints,
      menu,
    );
  }

  async dtoToUpdateEntity(
    updateFuncionDto: UpdateFuncionDto,
    updateFuncionEntity: FuncionEntity,
  ): Promise<FuncionEntity> {
    const endPoints: EndPointEntity[] = await this.endPointRepository.findByIds(
      updateFuncionDto.endPoints,
    );
    const menu: MenuEntity = await this.menuRepository.findById(
      updateFuncionDto.menu,
    );
    updateFuncionEntity.nombre = updateFuncionDto.nombre;
    updateFuncionEntity.descripcion = updateFuncionDto.descripcion;
    updateFuncionEntity.endPoints = endPoints;
    updateFuncionEntity.menu = menu;
    return updateFuncionEntity;
  }

  async entityToDto(funcionEntity: FuncionEntity): Promise<ReadFuncionDto> {
    const funcion: FuncionEntity = await this.funcionRepository.findById(
      funcionEntity.id,
    );
    const endPoints: ReadEndPointDto[] = [];
    for (const endPoint of funcion.endPoints) {
      endPoints.push(await this.endPointMapper.entityToDto(endPoint));
    }
    let menu: ReadMenuDto;
    if (funcion.menu !== null) {
      menu = await this.menuMapper.entityToDto(funcion.menu);
    }
    const dtoToString: string = funcionEntity.toString();
    return new ReadFuncionDto(
      dtoToString,
      funcionEntity.id,
      funcionEntity.nombre,
      funcionEntity.descripcion,
      endPoints,
      menu,
    );
  }
}
