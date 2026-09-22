import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdiomaEntity, MenuEntity, MenuTraduccionEntity } from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class MenuTraduccionRepository
  extends GenericRepository<MenuTraduccionEntity>
  implements IRepository<MenuTraduccionEntity>
{
  constructor(
    @InjectRepository(MenuTraduccionEntity)
    private menuTraduccionRepository: Repository<MenuTraduccionEntity>,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(IdiomaEntity)
    private idiomaRepository: Repository<IdiomaEntity>,
  ) {
    super(menuTraduccionRepository, ['menu', 'idioma']);
  }

  async findMenuById(id: number): Promise<MenuEntity | null> {
    return this.menuRepository.findOne({ where: { id, activo: true } });
  }

  async findIdiomaById(id: number): Promise<IdiomaEntity | null> {
    return this.idiomaRepository.findOne({ where: { id, activo: true } });
  }

  /**
   * Devuelve menuId -> label para un codigo de idioma, en una sola consulta.
   * Los menus sin traduccion quedan fuera del mapa y conservan su label base.
   */
  async findLabelsByIdioma(codigo: string): Promise<Map<number, string>> {
    const traducciones = await this.menuTraduccionRepository.find({
      where: { activo: true, idioma: { codigo, activo: true } },
      relations: ['menu'],
    });
    return new Map(
      traducciones
        .filter((traduccion) => traduccion.menu)
        .map((traduccion) => [Number(traduccion.menu.id), traduccion.label]),
    );
  }

  async findByMenuIdioma(
    menuId: number,
    idiomaId: number,
  ): Promise<MenuTraduccionEntity | null> {
    return this.menuTraduccionRepository.findOne({
      where: { menu: { id: menuId }, idioma: { id: idiomaId }, activo: true },
    });
  }
}
