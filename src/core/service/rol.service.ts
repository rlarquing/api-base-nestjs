import { Injectable } from '@nestjs/common';
import { RolMapper } from '../mapper';
import { TrazaService } from './traza.service';
import { GenericService } from './generic.service';
import { RolEntity } from '../../persistence/entity';
import { RolRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolService extends GenericService<RolEntity> {
  constructor(
    protected configService: ConfigService,
    protected rolRepository: RolRepository,
    protected rolMapper: RolMapper,
    protected trazaService: TrazaService,
  ) {
    super(configService, rolRepository, rolMapper, trazaService, true);
  }
}
