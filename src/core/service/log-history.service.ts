import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import dayjs from 'dayjs';
import { LogHistoryMapper } from '../mapper';
import { IPaginationOptions, Pagination } from '../../shared/pagination';
import { LogHistoryRepository } from '../../persistence/repository';
import { EstadisticaTrazaDto, LogHistoryDto } from '../../shared/dto';
import { LogHistoryEntity, UserEntity } from '../../persistence/entity';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';

/** Días que abarca la serie temporal de trazas del panel de administración. */
const DIAS_SERIE_TRAZAS = 7;

/** Cuántas tablas devuelve el ranking de tablas más tocadas. */
const TOP_TABLAS_TRAZAS = 10;

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

  /**
   * Resumen de trazas para el panel de administración.
   *
   * Convierte los conteos que Postgres entrega como texto y rellena la serie
   * temporal: el repositorio solo devuelve los días que tienen trazas, y un
   * gráfico con huecos miente sobre la actividad real.
   */
  async estadisticas(): Promise<EstadisticaTrazaDto> {
    const agregados = await this.logHistoryRepository.estadisticas(
      DIAS_SERIE_TRAZAS,
      TOP_TABLAS_TRAZAS,
    );

    const cantidadPorDia = new Map<string, number>(
      agregados.porDia.map((dia) => [dia.fecha, Number(dia.cantidad)]),
    );

    const ultimos7Dias = Array.from(
      { length: DIAS_SERIE_TRAZAS },
      (_, indice) => {
        const fecha = dayjs()
          .subtract(DIAS_SERIE_TRAZAS - 1 - indice, 'day')
          .format('YYYY-MM-DD');
        return { fecha, cantidad: cantidadPorDia.get(fecha) ?? 0 };
      },
    );

    return {
      total: agregados.total,
      porAccion: agregados.porAccion.map((item) => ({
        accion: item.accion,
        cantidad: Number(item.cantidad),
      })),
      porTabla: agregados.porTabla.map((item) => ({
        esquema: item.esquema,
        tabla: item.tabla,
        cantidad: Number(item.cantidad),
      })),
      ultimos7Dias,
      usuariosDistintos7Dias: agregados.usuariosDistintos7Dias,
    };
  }

  async create(logHistoryDto: LogHistoryDto): Promise<void> {
    const traza: LogHistoryEntity = new LogHistoryEntity();
    traza.user = logHistoryDto.user;
    traza.tabla = logHistoryDto.tabla;
    traza.esquema = logHistoryDto.esquema;
    traza.valorNuevo = logHistoryDto.valorNuevo;
    traza.valorAnterior = logHistoryDto.valorAnterior ?? null;
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
