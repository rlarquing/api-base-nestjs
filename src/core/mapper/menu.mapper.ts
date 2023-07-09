import { Injectable } from '@nestjs/common';
import {
  CreateMenuDto,
  ReadMenuDto,
  SelectDto,
  UpdateMenuDto,
} from '../../shared/dto';
import { MenuEntity } from '../../persistence/entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MenuMapper {
  dtoToEntity(createMenuDto: CreateMenuDto): MenuEntity {
    return plainToInstance(MenuEntity, createMenuDto);
  }

  dtoToUpdateEntity(
    updateMenuDto: UpdateMenuDto,
    updateMenuEntity: MenuEntity,
  ): MenuEntity {
    return plainToInstance(MenuEntity, {
      ...updateMenuEntity,
      ...updateMenuDto,
    });
  }

  entityToDto(menuEntity: MenuEntity): ReadMenuDto {
    const readMenuDto: ReadMenuDto = plainToInstance(ReadMenuDto, menuEntity);

    readMenuDto.dtoToString = menuEntity.toString();
    let menuPadre = '';
    let menuSelectDto: SelectDto;
    const menuDto: ReadMenuDto[] = [];
    if (menuEntity.menu === null) {
      for (const menuHijo of menuEntity.menus) {
        if (menuHijo.activo === true) {
          menuDto.push(this.entityToDto(menuHijo));
        }
      }
    } else {
      menuPadre = menuEntity.menu.toString();
      menuSelectDto = new SelectDto(
        menuEntity.menu.id,
        menuEntity.menu.toString(),
      );
    }
    readMenuDto.menuPadre = menuPadre;
    readMenuDto.menu = menuSelectDto;

    return readMenuDto;
  }
}
