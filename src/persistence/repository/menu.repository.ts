import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MenuEntity } from '../entity';
import { GenericRepository } from './index';
import { IRepository } from '../../shared/interface';

@Injectable()
export class MenuRepository
  extends GenericRepository<MenuEntity>
  implements IRepository<MenuEntity>
{
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
  ) {
    super(menuRepository, ['menu', 'menus']);
  }
  async existeNomenclador(nomenclador: string): Promise<boolean> {
    const wheres = {
      activo: true,
      nomemclador: nomenclador,
    } as FindOptionsWhere<MenuEntity>;
    const menu: MenuEntity = await this.menuRepository.findOneBy(wheres);
    return menu !== undefined && menu !== null;
  }
}
