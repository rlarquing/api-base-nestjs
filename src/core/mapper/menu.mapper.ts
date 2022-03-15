import { Injectable } from '@nestjs/common';
import {
  DimensionRepository,
  MenuRepository,
} from '../../persistence/repository';
import { DimensionMapper } from './dimension.mapper';
import { DimensionEntity, MenuEntity } from '../../persistence/entity';
import {
  CreateMenuDto,
  ReadDimensionDto,
  ReadMenuDto,
  UpdateMenuDto,
} from '../../shared/dto';

@Injectable()
export class MenuMapper {
  constructor(
    protected menuRepository: MenuRepository,
    protected dimensionRepository: DimensionRepository,
    protected dimensionMapper: DimensionMapper,
  ) {}

  async dtoToEntity(createMenuDto: CreateMenuDto): Promise<MenuEntity> {
    const dimension: DimensionEntity = await this.dimensionRepository.findById(
      createMenuDto.dimension,
    );
    const menu: MenuEntity = await this.menuRepository.findById(
      createMenuDto.menu,
    );
    return new MenuEntity(
      createMenuDto.label,
      createMenuDto.icon,
      createMenuDto.to,
      dimension,
      menu,
    );
  }

  async dtoToUpdateEntity(
    updateMenuDto: UpdateMenuDto,
    updateMenuEntity: MenuEntity,
  ): Promise<MenuEntity> {
    const dimension: DimensionEntity = await this.dimensionRepository.findById(
      updateMenuDto.dimension,
    );
    const menu: MenuEntity = await this.menuRepository.findById(
      updateMenuDto.menu,
    );
    updateMenuEntity.label = updateMenuDto.label;
    updateMenuEntity.icon = updateMenuDto.icon;
    updateMenuEntity.to = updateMenuDto.to;
    updateMenuEntity.dimension = dimension;
    updateMenuEntity.menu = menu;
    return updateMenuEntity;
  }

  async entityToDto(menuEntity: MenuEntity): Promise<ReadMenuDto> {
    const menu: MenuEntity = await this.menuRepository.findById(menuEntity.id);
    const dimension: ReadDimensionDto = await this.dimensionMapper.entityToDto(
      menu.dimension,
    );
    const menuDto: ReadMenuDto[] = [];
    if (menu.menu !== null) {
      for (const menuHijo of menu.menus) {
        menuDto.push(await this.entityToDto(menuHijo));
      }
    }

    const dtoToString: string = menuEntity.toString();
    return new ReadMenuDto(
      dtoToString,
      menuEntity.id,
      menuEntity.label,
      menuEntity.icon,
      menuEntity.to,
      dimension,
      menuDto,
    );
  }
}
