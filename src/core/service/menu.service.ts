import { Injectable } from '@nestjs/common';
import { MenuMapper } from '../mapper';
import { MenuEntity } from '../../persistence/entity';
import {
  MenuRepository,
} from '../../persistence/repository';
import { GenericService } from './generic.service';
import { TrazaService } from './traza.service';
import { ReadMenuDto } from '../../shared/dto';

@Injectable()
export class MenuService extends GenericService<MenuEntity> {
  constructor(
    protected menuRepository: MenuRepository,
    protected menuMapper: MenuMapper,
    protected trazaService: TrazaService,
  ) {
    super(menuRepository, menuMapper, trazaService, true);
  }
  async findByTipo(
    tipo: string,
  ): Promise<ReadMenuDto[]> {
    const menus: MenuEntity[] = await this.menuRepository.findBy(
      ['tipo'],
      [tipo],
    );
    const readMenusDto: ReadMenuDto[] = [];
    for (const menu of menus) {
      readMenusDto.push(await this.menuMapper.entityToDto(menu));
    }
    return readMenusDto;
  }
}
