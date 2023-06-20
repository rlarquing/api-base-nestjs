import { Injectable } from '@nestjs/common';
import { MenuMapper } from '../mapper';
import {
  EndPointEntity,
  FuncionEntity,
  MenuEntity,
  RolEntity,
} from '../../persistence/entity';
import {
  EndPointRepository,
  FuncionRepository,
  MenuRepository,
  RolRepository,
} from '../../persistence/repository';
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
    protected endPointRepository: EndPointRepository,
    protected funcionRepository: FuncionRepository,
    protected rolRepository: RolRepository,
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
    const endPoints: EndPointEntity[] =
    await this.endPointRepository.findByController('nomenclador');
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
        const newMenu: MenuEntity = await this.menuRepository.create(nomMenu);
        const funcion: FuncionEntity = new FuncionEntity(
          `Gestión del nomenclador ${formatearNombre(element, ' ')}`,
          `Gestión del nomenclador ${formatearNombre(element, ' ')}`,
          endPoints,
          newMenu,
        );
        const newFuncion: FuncionEntity = await this.funcionRepository.create(
          funcion,
        );
        const rol: RolEntity = await this.rolRepository.findById(1);
        rol.funcions.push(newFuncion);
        await this.rolRepository.update(rol);
      }
    }
  }
}
