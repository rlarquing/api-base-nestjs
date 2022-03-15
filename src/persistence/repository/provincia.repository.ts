import { ProvinciaEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinciaRepository {
  constructor(
    @InjectRepository(ProvinciaEntity)
    private provinciaRepository: Repository<ProvinciaEntity>,
  ) {}

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ProvinciaEntity>> {
    return await paginate<ProvinciaEntity>(this.provinciaRepository, options);
  }

  async findById(id: number): Promise<ProvinciaEntity> {
    return await this.provinciaRepository.findOne(id);
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
}
