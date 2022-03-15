import { Injectable } from '@nestjs/common';
import { RolMapper } from '../mapper';
import { TrazaService } from './traza.service';
import { GenericService } from './generic.service';
import { RolEntity } from '../../persistence/entity';
import { RolRepository } from '../../persistence/repository';

@Injectable()
export class RolService extends GenericService<RolEntity> {
  constructor(
    protected rolRepository: RolRepository,
    protected rolMapper: RolMapper,
    protected trazaService: TrazaService,
  ) {
    super(rolRepository, rolMapper, trazaService, true);
  }
}
