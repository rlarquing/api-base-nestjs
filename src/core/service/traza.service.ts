import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { TrazaMapper } from '../mapper';
import { TrazaRepository } from '../../persistence/repository';
import { TrazaDto } from '../../shared/dto';
import { TrazaEntity, UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/traza.entity';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { Column, SortBy } from 'nestjs-paginate/lib/helper';

@Injectable()
export class TrazaService {
  constructor(
    private trazaRepository: TrazaRepository,
    private trazaMapper: TrazaMapper,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<TrazaDto>> {
    const trazas: Paginated<TrazaEntity> = await this.trazaRepository.findAll(
      query,
    );
    const trazaDto: TrazaDto[] = trazas.data.map((traza: TrazaEntity) =>
      this.trazaMapper.entityToDto(traza),
    );
    return {
      data: trazaDto,
      meta: {
        itemsPerPage: trazas.meta.itemsPerPage,
        totalItems: trazas.meta.totalItems,
        currentPage: trazas.meta.currentPage,
        totalPages: trazas.meta.totalPages,
        sortBy: trazas.meta.sortBy as SortBy<TrazaDto>,
        searchBy: trazas.meta.searchBy as Column<TrazaDto>[],
        search: trazas.meta.search,
        filter: trazas.meta.filter,
      },
      links: trazas.links,
    };
  }

  async findById(id: number): Promise<TrazaDto> {
    const traza: TrazaEntity = await this.trazaRepository.findById(id);
    return this.trazaMapper.entityToDto(traza);
  }

  async create(
    user: UserEntity,
    entity: any,
    action: HISTORY_ACTION,
  ): Promise<void> {
    const traza: TrazaEntity = new TrazaEntity();
    traza.user = user;
    traza.model = entity.constructor.name;
    traza.data = entity;
    traza.action = action;
    traza.record = entity.id;
    await this.trazaRepository.create(traza);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.trazaRepository.delete(id);
  }

  async findByFiltrados(user: UserEntity, filtro: any): Promise<any> {
    return await this.trazaRepository.findByFiltrados(user, filtro);
  }
}
