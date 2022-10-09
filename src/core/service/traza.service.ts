import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { TrazaMapper } from '../mapper';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { TrazaRepository } from '../../persistence/repository';
import { TrazaDto } from '../../shared/dto';
import { TrazaEntity, UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/traza.entity';

@Injectable()
export class TrazaService {
  constructor(
    private trazaRepository: TrazaRepository,
    private trazaMapper: TrazaMapper,
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<TrazaDto>> {
    const trazas: Pagination<TrazaEntity> = await this.trazaRepository.findAll(
      options,
    );
    const trazaDto: TrazaDto[] = trazas.items.map((traza: TrazaEntity) =>
      this.trazaMapper.entityToDto(traza),
    );
    return new Pagination(trazaDto, trazas.meta, trazas.links);
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
