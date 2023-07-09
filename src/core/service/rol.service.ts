import { Injectable } from '@nestjs/common';
import { RolMapper } from '../mapper';
import { TrazaService } from './traza.service';
import { GenericService } from './generic.service';
import { RolEntity } from '../../persistence/entity';
import { RolRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';
import { CreateRolDto } from '../../shared/dto';

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
  async crearRolAdministrador(): Promise<void> {
    const newRol: CreateRolDto = {
      nombre: 'ADMINISTRADOR',
      descripcion: 'Tiene todos los permisos de la administración',
    };
    const rol: RolEntity = this.rolMapper.dtoToEntity(newRol);
    const existe = await this.rolRepository.findOneBy(
      ['nombre'],
      ['ADMINISTRADOR'],
    );
    if (!existe) {
      await this.rolRepository.create(rol);
    }
  }
}
