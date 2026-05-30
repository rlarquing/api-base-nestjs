import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { LogHistoryMapper } from '../mapper';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { LogHistoryRepository } from '../../persistence/repository';
import { LogHistoryDto } from '../../shared/dto';
import { LogHistoryEntity, UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';

@Injectable()
export class LogHistoryService {
  constructor(
    private logHistoryRepository: LogHistoryRepository,
    private logHistoryMapper: LogHistoryMapper,
  ) {}

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<LogHistoryDto>> {
    const trazas: Pagination<LogHistoryEntity> =
      await this.logHistoryRepository.findAll(options);
    const trazaDto: LogHistoryDto[] = trazas.items.map(
      (traza: LogHistoryEntity) => this.logHistoryMapper.entityToDto(traza),
    );
    return new Pagination(trazaDto, trazas.meta, trazas.links);
  }

  async findById(id: number): Promise<LogHistoryDto> {
    const traza: LogHistoryEntity =
      await this.logHistoryRepository.findById(id);
    return this.logHistoryMapper.entityToDto(traza);
  }

  async create(logHistoryDto: LogHistoryDto): Promise<void> {
    const traza: LogHistoryEntity = new LogHistoryEntity();
    traza.user = logHistoryDto.user;
    traza.tabla = logHistoryDto.tabla;
    traza.valorNuevo = logHistoryDto.valorNuevo;
    traza.valorAnterior = logHistoryDto.valorAnterior ?? null;
    traza.valorNuevo = logHistoryDto.valorNuevo;
    traza.valorAnterior = logHistoryDto.valorAnterior;
    traza.registroId = logHistoryDto.registroId;
    traza.direccionIp = logHistoryDto.direccionIp;
    traza.action = logHistoryDto.action;
    await this.logHistoryRepository.create(traza);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.logHistoryRepository.delete(id);
  }

  async findByFiltrados(user: UserEntity, filtro: any): Promise<any> {
    return await this.logHistoryRepository.findByFiltrados(user, filtro);
  }
}
