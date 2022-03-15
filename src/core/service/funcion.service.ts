import { Injectable } from '@nestjs/common';
import { FuncionMapper } from '../mapper';
import { TrazaService } from './traza.service';
import { GenericService } from './generic.service';
import { FuncionEntity } from '../../persistence/entity';
import { FuncionRepository } from '../../persistence/repository';

@Injectable()
export class FuncionService extends GenericService<FuncionEntity> {
  constructor(
    protected funcionRepository: FuncionRepository,
    protected funcionMapper: FuncionMapper,
    protected trazaService: TrazaService,
  ) {
    super(funcionRepository, funcionMapper, trazaService, true);
  }
}
