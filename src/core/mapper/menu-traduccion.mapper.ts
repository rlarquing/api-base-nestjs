import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuTraduccionEntity } from '../../persistence/entity';
import {
  CreateMenuTraduccionDto,
  ReadMenuTraduccionDto,
  UpdateMenuTraduccionDto,
} from '../../shared/dto';
import { MenuTraduccionRepository } from '../../persistence/repository';
import { traducir } from '../../shared/util/i18n.util';

@Injectable()
export class MenuTraduccionMapper {
  constructor(private menuTraduccionRepository: MenuTraduccionRepository) {}

  async dtoToEntity(
    createDto: CreateMenuTraduccionDto,
  ): Promise<MenuTraduccionEntity> {
    const menu = await this.menuTraduccionRepository.findMenuById(
      createDto.menuId,
    );
    if (!menu)
      throw new NotFoundException(
        traducir(
          'traduccion.MENU_NOT_FOUND',
          `Menu con id ${createDto.menuId} no encontrado`,
          { id: createDto.menuId },
        ),
      );
    const idioma = await this.menuTraduccionRepository.findIdiomaById(
      createDto.idiomaId,
    );
    if (!idioma)
      throw new NotFoundException(
        traducir(
          'traduccion.IDIOMA_NOT_FOUND',
          `Idioma con id ${createDto.idiomaId} no encontrado`,
          { id: createDto.idiomaId },
        ),
      );
    return new MenuTraduccionEntity(menu, idioma, createDto.label);
  }

  async dtoToUpdateEntity(
    updateDto: UpdateMenuTraduccionDto,
    updateEntity: MenuTraduccionEntity,
  ): Promise<MenuTraduccionEntity> {
    const menu = await this.menuTraduccionRepository.findMenuById(
      updateDto.menuId,
    );
    if (!menu)
      throw new NotFoundException(
        traducir(
          'traduccion.MENU_NOT_FOUND',
          `Menu con id ${updateDto.menuId} no encontrado`,
          { id: updateDto.menuId },
        ),
      );
    const idioma = await this.menuTraduccionRepository.findIdiomaById(
      updateDto.idiomaId,
    );
    if (!idioma)
      throw new NotFoundException(
        traducir(
          'traduccion.IDIOMA_NOT_FOUND',
          `Idioma con id ${updateDto.idiomaId} no encontrado`,
          { id: updateDto.idiomaId },
        ),
      );
    updateEntity.menu = menu;
    updateEntity.idioma = idioma;
    updateEntity.label = updateDto.label;
    return updateEntity;
  }

  entityToDto(entity: MenuTraduccionEntity): ReadMenuTraduccionDto {
    return new ReadMenuTraduccionDto(
      entity.toString(),
      entity.id,
      entity.menu?.id,
      entity.idioma?.id,
      entity.label,
    );
  }
}
