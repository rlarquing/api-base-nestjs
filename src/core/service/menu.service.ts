import { Injectable } from '@nestjs/common';
import { MenuMapper } from '../mapper';
import { MenuEntity } from '../../persistence/entity';
import { MenuRepository } from '../../persistence/repository';
import { GenericService } from './generic.service';
import { TrazaService } from './traza.service';
import { ReadMenuDto } from '../../shared/dto';
import { ConfigService } from '@nestjs/config';
import { TipoMenuTypeEnum } from '../../shared/enum';
import { formatearNombre } from '../../../lib';

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
  async crearMenuNomenclador(nomencladores: string[]): Promise<void> {
    const menu: MenuEntity = new MenuEntity(
      'Nomencladores',
      '',
      '/administration/nomenclators',
      null,
      null,
      TipoMenuTypeEnum.ADMINISTRACION,
    );
    const existeMenu: MenuEntity[] = await this.menuRepository.findBy(
      ['label'],
      [menu.label],
    );
    let menuPadre: MenuEntity = null;
    if (existeMenu.length > 0) {
      menuPadre = existeMenu[0];
    } else {
      menuPadre = await this.menuRepository.create(menu);
    }
    for (const element of nomencladores) {
      const existe: boolean = await this.menuRepository.existeNomenclador(
        element,
      );
      if (!existe) {
        const nomMenu: MenuEntity = new MenuEntity(
          formatearNombre(element, ' '),
          'menu',
          `/administration/nomenclators/${formatearNombre(element, '/')}`,
          menuPadre,
          TipoMenuTypeEnum.ADMINISTRACION,
          element,
        );
        await this.menuRepository.create(nomMenu);
      }
    }
  }
}
