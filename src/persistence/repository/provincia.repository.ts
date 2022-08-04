import { ProvinciaEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class ProvinciaRepository {
  constructor(
    @InjectRepository(ProvinciaEntity)
    private provinciaRepository: Repository<ProvinciaEntity>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<ProvinciaEntity>> {
    const where = {
      sortableColumns: ['id'],
    } as PaginateConfig<ProvinciaEntity>;
    return await paginate<ProvinciaEntity>(
      query,
      this.provinciaRepository,
      where,
    );
  }

  async findById(id: number): Promise<ProvinciaEntity> {
    const options = { id } as FindOptionsWhere<ProvinciaEntity>;
    return await this.provinciaRepository.findOneBy(options);
  }

  async findByNombreCorto(nombreCorto: string): Promise<ProvinciaEntity> {
    const options = {
      nombreCorto: nombreCorto,
    } as FindOptionsWhere<ProvinciaEntity>;
    return await this.provinciaRepository.findOneBy(options);
  }

  async geoJson(): Promise<any> {
    return await this.provinciaRepository
      .createQueryBuilder('p')
      .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
      .addSelect('ST_AsGeoJSON(p.geom)::json', 'geometry')
      .getRawMany();
  }

  async geoJsonById(id: number): Promise<any> {
    return await this.provinciaRepository
      .createQueryBuilder('p')
      .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
      .addSelect('ST_AsGeoJSON(p.geom)::json', 'geometry')
      .andWhere('p.id=:id', { id: id })
      .getRawOne();
  }
  async centroide(nombreCorto: string): Promise<any> {
    return await this.provinciaRepository
      .createQueryBuilder('p')
      .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
      .addSelect('ST_AsGeoJSON(p.centroide)::json', 'geometry')
      .andWhere('p.nombreCorto=:nombreCorto', { nombreCorto: nombreCorto })
      .getRawOne();
  }
}
