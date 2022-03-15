import { Injectable } from '@nestjs/common';
import { MenuMapper } from '../mapper';
import { MenuEntity } from '../../persistence/entity';
import { MenuRepository } from '../../persistence/repository';
import { GenericService } from './generic.service';
import { TrazaService } from './traza.service';

@Injectable()
export class MenuService extends GenericService<MenuEntity> {
  constructor(
    protected menuRepository: MenuRepository,
    protected menuMapper: MenuMapper,
    protected trazaService: TrazaService,
  ) {
    super(menuRepository, menuMapper, trazaService, true);
  }
}
