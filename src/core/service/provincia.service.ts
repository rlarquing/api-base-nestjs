import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GeoJsonMapper, ProvinciaMapper } from '../mapper';
import { ProvinciaRepository } from '../../persistence/repository';
import { GeoJsonDto, ReadProvinciaDto } from '../../shared/dto';
import { ProvinciaEntity } from '../../persistence/entity';
import { AppConfig } from '../../app.keys';
import { ConfigService } from '@nestjs/config';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { Column, SortBy } from 'nestjs-paginate/lib/helper';

@Injectable()
export class ProvinciaService {
  constructor(
    private configService: ConfigService,
    private provinciaRepository: ProvinciaRepository,
    private provinciaMapper: ProvinciaMapper,
    private geoJsonMapper: GeoJsonMapper,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<ReadProvinciaDto>> {
    const provincias: Paginated<ProvinciaEntity> =
      await this.provinciaRepository.findAll(query);
    const readProvinciaDto: ReadProvinciaDto[] = provincias.data.map(
      (provincia: ProvinciaEntity) =>
        this.provinciaMapper.entityToDto(provincia),
    );
    return {
      data: readProvinciaDto,
      meta: {
        itemsPerPage: provincias.meta.itemsPerPage,
        totalItems: provincias.meta.totalItems,
        currentPage: provincias.meta.currentPage,
        totalPages: provincias.meta.totalPages,
        sortBy: provincias.meta.sortBy as SortBy<ReadProvinciaDto>,
        searchBy: provincias.meta.searchBy as Column<ReadProvinciaDto>[],
        search: provincias.meta.search,
        filter: provincias.meta.filter,
      },
      links: provincias.links,
    };
  }

  async findById(id: number): Promise<ReadProvinciaDto> {
    if (!id) {
      throw new BadRequestException('El id no puede ser vacio');
    }
    const provincia: ProvinciaEntity = await this.provinciaRepository.findById(
      id,
    );
    if (!provincia) {
      throw new NotFoundException('La provincia no se encuentra.');
    }
    return this.provinciaMapper.entityToDto(provincia);
  }

  async geoJson(): Promise<GeoJsonDto> {
    const provincias = await this.provinciaRepository.geoJson();
    return this.geoJsonMapper.entitiesToDto(provincias);
  }

  async geoJsonById(id: number): Promise<GeoJsonDto> {
    const provincia = await this.provinciaRepository.geoJsonById(id);
    return this.geoJsonMapper.entityToDto(provincia);
  }

  async centroide(): Promise<GeoJsonDto> {
    const nombreCorto: string = this.configService.get(AppConfig.PROVINCIA);
    const provincia = await this.provinciaRepository.centroide(nombreCorto);
    return this.geoJsonMapper.entityToDto(provincia);
  }
}
