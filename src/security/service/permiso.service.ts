import { Injectable } from '@nestjs/common';
import { PermisoRepository } from '../repository';
import { CreatePermisoDto } from '../dto';
import { PermisoEntity } from '../entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class PermisoService {
  constructor(private permisoRepository: PermisoRepository) {}
  async create(createPermisoDto: CreatePermisoDto): Promise<void> {
    const { nombre, servicio } = createPermisoDto;
    const permisoEntity: PermisoEntity = new PermisoEntity(nombre, servicio);
    await this.permisoRepository.create(permisoEntity);
  }
  async findAll(): Promise<string[]> {
    const resultado: string[] = [];
    const permisos: PermisoEntity[] = await this.permisoRepository.findAll();
    for (const permiso of permisos) {
      resultado.push(permiso.servicio);
    }
    return resultado;
  }
  async remove(servicio: string): Promise<DeleteResult> {
    return await this.permisoRepository.remove(servicio);
  }
}
