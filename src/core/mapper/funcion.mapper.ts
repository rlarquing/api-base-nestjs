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
    const endPoints: EndPointEntity[] = await this.endPointRepository.findByIds(
      createFuncionDto.endPoints,
    );
    if (createFuncionDto.menu !== undefined) {
      const menu: MenuEntity = await this.menuRepository.findById(
        createFuncionDto.menu,
      );
      return new FuncionEntity(
        createFuncionDto.nombre,
        createFuncionDto.descripcion,
        endPoints,
        menu,
      );
    }

    return new FuncionEntity(
      createFuncionDto.nombre,
      createFuncionDto.descripcion,
      endPoints,
    );
  }

  async dtoToUpdateEntity(
    updateFuncionDto: UpdateFuncionDto,
    updateFuncionEntity: FuncionEntity,
  ): Promise<FuncionEntity> {
    const endPoints: EndPointEntity[] = await this.endPointRepository.findByIds(
      updateFuncionDto.endPoints,
    );
    if (updateFuncionDto.menu !== undefined) {
      if (updateFuncionDto.menu !== null) {
        updateFuncionEntity.menu = await this.menuRepository.findById(
          updateFuncionDto.menu,
        );
      } else {
        // En TypeScript 6, no podemos asignar null a un tipo que es `| undefined`
        // Por lo tanto, asignamos undefined en lugar de null
        updateFuncionEntity.menu = undefined;
      }
    }
    updateFuncionEntity.nombre = updateFuncionDto.nombre;
    updateFuncionEntity.descripcion = updateFuncionDto.descripcion;
    updateFuncionEntity.endPoints = endPoints;

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
    let menu: ReadMenuDto | undefined = undefined;
    if (funcion.menu !== null && funcion.menu !== undefined) {
      menu = await this.menuMapper.entityToDto(funcion.menu);
    }
    const descripcion: string = funcionEntity.descripcion ? funcionEntity.descripcion :"";
    const dtoToString: string = funcionEntity.toString();
    return new ReadFuncionDto(
      dtoToString,
      funcionEntity.id,
      funcionEntity.nombre,
      descripcion,
      endPoints,
      menu,
    );
  }
}
