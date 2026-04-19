import { Injectable } from '@nestjs/common';
import { RolMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { FuncionEntity, RolEntity } from '../../persistence/entity';
import { FuncionRepository, RolRepository } from '../../persistence/repository';
import { ConfigService } from '@nestjs/config';
import { RolType } from '../../shared/enum';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class RolService extends GenericService<RolEntity> {
  constructor(
    protected configService: ConfigService,
    protected rolRepository: RolRepository,
    protected rolMapper: RolMapper,
    private funcionRepository: FuncionRepository,
    protected logHistoryService: LogHistoryService,
  ) {
    super(configService, rolRepository, rolMapper, logHistoryService, true);
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
  /**
   * Asigna todas las funciones existentes al rol Administrador
   * Se llama después de crear el menú de administración para asegurar
   * que todas las funciones estén creadas
   */
  async asignarFuncionesAdmin(): Promise<void> {
    const rolAdmin = await this.rolRepository.findByNombre(
      RolType.ADMINISTRADOR,
    );
    if (!rolAdmin) {
      throw new Error('El rol Administrador no existe');
    }

    const opcionesVacias: IPaginationOptions = { page: 1, limit: 1000 };

    rolAdmin.funcions = (await this.funcionRepository.findAll(
      opcionesVacias,
      true,
    )) as FuncionEntity[];
    await this.rolRepository.update(rolAdmin);
  }
}
