import { MunicipioEntity, ProvinciaEntity } from '../entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class MunicipioRepository {
  constructor(
    @InjectRepository(MunicipioEntity)
    private municipioRepository: Repository<MunicipioEntity>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<MunicipioEntity>> {
    const where = {
      sortableColumns: ['id'],
    } as PaginateConfig<MunicipioEntity>;
    return await paginate<MunicipioEntity>(
      query,
      this.municipioRepository,
      where,
    );
  }

  async findById(id: number): Promise<MunicipioEntity> {
    const options = {
      where: { id },
      relations: { provincia: true },
    } as FindOneOptions<MunicipioEntity>;
    return await this.municipioRepository.findOne(options);
  }

  async findByIds(ids: number[]): Promise<MunicipioEntity[]> {
    const options = {
      where: { id: In(ids) },
      relations: {
        provincia: true,
      },
    } as FindManyOptions<MunicipioEntity>;
    return await this.municipioRepository.find(options);
  }

  async findByProvincia(
    provincia: ProvinciaEntity | number,
  ): Promise<MunicipioEntity[]> {
    const options = {
      where: { provincia },
    } as FindManyOptions<MunicipioEntity>;
    return await this.municipioRepository.find(options);
  }

  async geoJson(): Promise<any> {
    return await this.municipioRepository
      .createQueryBuilder('m')
      .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
      .addSelect('ST_AsGeoJSON(m.geom)::json', 'geometry')
      .getRawMany();
  }

  async geoJsonById(id: number): Promise<any> {
    return await this.municipioRepository
      .createQueryBuilder('m')
      .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
      .addSelect('ST_AsGeoJSON(m.geom)::json', 'geometry')
      .andWhere('m.id=:id', { id: id })
      .getRawOne();
  }

  async geoJsonByProvincia(provincia: ProvinciaEntity): Promise<any> {
    return await this.municipioRepository
      .createQueryBuilder('m')
      .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
      .addSelect('ST_AsGeoJSON(m.geom)::json', 'geometry')
      .andWhere('m.provincia=:provincia', { provincia: provincia.id })
      .getRawMany();
  }
}
