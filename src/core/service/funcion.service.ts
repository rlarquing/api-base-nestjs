import { Injectable } from '@nestjs/common';
import { FuncionMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { FuncionEntity } from '../../persistence/entity';
import { FuncionRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FuncionService extends GenericService<FuncionEntity> {
  constructor(
    protected configService: ConfigService,
    protected funcionRepository: FuncionRepository,
    protected funcionMapper: FuncionMapper,
    protected trazaService: LogHistoryService,
  ) {
    super(configService, funcionRepository, funcionMapper, trazaService, true);
  }
}
