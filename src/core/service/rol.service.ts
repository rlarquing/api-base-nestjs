import { Injectable } from '@nestjs/common';
import { RolMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
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
    protected trazaService: LogHistoryService,
  ) {
    super(configService, rolRepository, rolMapper, trazaService, true);
  }
  async crearRolAdministrador(): Promise<void> {
    const rol: RolEntity = new RolEntity(
      'ADMINISTRADOR',
      'Tiene todos los permisos de la administración',
      [],
    );
    const existe = await this.rolRepository.findOneBy(
      ['nombre'],
      ['ADMINISTRADOR'],
    );
    if (!existe) {
      await this.rolRepository.create(rol);
    }
  }
}
