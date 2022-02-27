import { Injectable } from '@nestjs/common';
import { PermisoRepository } from '../repository';
import { CreatePermisoDto } from '../dto';
import { PermisoEntity } from '../entity';
import { DeleteResult } from 'typeorm';
import { SelectDto } from '../../nomenclator/dto';

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

  async update(servicio: string, nombre: string): Promise<void> {
    return await this.permisoRepository.update(servicio, nombre);
  }

  async remove(servicio: string): Promise<DeleteResult> {
    return await this.permisoRepository.remove(servicio);
  }
  async createSelect(): Promise<SelectDto[]> {
    const items: any[] = await this.permisoRepository.findAll();
    const selectDto: SelectDto[] = [];
    for (const item of items) {
      selectDto.push(new SelectDto(item.id, item.toString()));
    }
    return selectDto;
  }
}
