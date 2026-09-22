import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FuncionEntity,
  FuncionTraduccionEntity,
  IdiomaEntity,
} from '../entity';
import { IRepository } from '../../shared/interface';
import { GenericRepository } from './generic.repository';

@Injectable()
export class FuncionTraduccionRepository
  extends GenericRepository<FuncionTraduccionEntity>
  implements IRepository<FuncionTraduccionEntity>
{
  constructor(
    @InjectRepository(FuncionTraduccionEntity)
    private funcionTraduccionRepository: Repository<FuncionTraduccionEntity>,
    @InjectRepository(FuncionEntity)
    private funcionRepository: Repository<FuncionEntity>,
    @InjectRepository(IdiomaEntity)
    private idiomaRepository: Repository<IdiomaEntity>,
  ) {
    super(funcionTraduccionRepository, ['funcion', 'idioma']);
  }

  async findFuncionById(id: number): Promise<FuncionEntity | null> {
    return this.funcionRepository.findOne({ where: { id, activo: true } });
  }

  async findIdiomaById(id: number): Promise<IdiomaEntity | null> {
    return this.idiomaRepository.findOne({ where: { id, activo: true } });
  }

  /**
   * Devuelve funcionId -> textos traducidos para un codigo de idioma, en una sola consulta.
   * Las funciones sin traduccion quedan fuera del mapa y conservan sus textos base.
   */
  async findTextosByIdioma(
    codigo: string,
  ): Promise<Map<number, { nombre: string; descripcion?: string }>> {
    const traducciones = await this.funcionTraduccionRepository.find({
      where: { activo: true, idioma: { codigo, activo: true } },
      relations: ['funcion'],
    });
    return new Map(
      traducciones
        .filter((traduccion) => traduccion.funcion)
        .map((traduccion) => [
          Number(traduccion.funcion.id),
          { nombre: traduccion.nombre, descripcion: traduccion.descripcion },
        ]),
    );
  }

  async findByFuncionIdioma(
    funcionId: number,
    idiomaId: number,
  ): Promise<FuncionTraduccionEntity | null> {
    return this.funcionTraduccionRepository.findOne({
      where: {
        funcion: { id: funcionId },
        idioma: { id: idiomaId },
        activo: true,
      },
    });
  }
}
