import { Injectable } from '@nestjs/common';
import { MenuMapper } from '../mapper';
import { MenuEntity } from '../../persistence/entity';
import { MenuRepository } from '../../persistence/repository';
import { GenericService } from './generic.service';
import { TrazaService } from './traza.service';
import { ReadMenuDto } from '../../shared/dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MenuService extends GenericService<MenuEntity> {
  constructor(
    protected configService: ConfigService,
    protected menuRepository: MenuRepository,
    protected menuMapper: MenuMapper,
    protected trazaService: TrazaService,
  ) {
    super(configService, menuRepository, menuMapper, trazaService, true);
  }
  async findByTipo(tipo: string): Promise<ReadMenuDto[]> {
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
