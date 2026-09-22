import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import dayjs from 'dayjs';
import { LogHistoryEntity, UserEntity } from '../entity';
import { UserRepository } from './user.repository';
import { IPaginationOptions, paginate, Pagination } from '../../shared/pagination';
import { traducir } from '../../shared/util/i18n.util';
import { HISTORY_ACTION } from '../entity/log-history.entity';

@Injectable()
export class LogHistoryRepository {
  constructor(
    @InjectRepository(LogHistoryEntity)
    private logHistoryRepository: Repository<LogHistoryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<LogHistoryEntity>> {
    return await paginate<LogHistoryEntity>(this.logHistoryRepository, options);
  }

  /**
   * Agregados crudos de trazas para el panel de administración.
   *
   * Los conteos de los group-by llegan como texto desde Postgres y la serie por
   * día puede tener huecos: normalizarlos es responsabilidad del servicio.
   * El día se formatea en SQL para que no dependa de la zona horaria del proceso.
   */
  async estadisticas(
    diasSerie: number,
    topTablas: number,
  ): Promise<{
    total: number;
    usuariosDistintos7Dias: number;
    porAccion: Array<{ accion: HISTORY_ACTION; cantidad: string }>;
    porTabla: Array<{ esquema: string; tabla: string; cantidad: string }>;
    porDia: Array<{ fecha: string; cantidad: string }>;
  }> {
    const desde = dayjs()
      .subtract(diasSerie - 1, 'day')
      .startOf('day')
      .toDate();

    const [total, usuariosDistintos, porAccion, porTabla, porDia] =
      await Promise.all([
        this.logHistoryRepository.createQueryBuilder('t').getCount(),
        this.logHistoryRepository
          .createQueryBuilder('t')
          .select('COUNT(DISTINCT t."user")', 'cantidad')
          .where('t.date >= :desde', { desde })
          .getRawOne(),
        this.logHistoryRepository
          .createQueryBuilder('t')
          .select('t.action', 'accion')
          .addSelect('COUNT(t.id)', 'cantidad')
          .groupBy('t.action')
          .orderBy('COUNT(t.id)', 'DESC')
          .getRawMany(),
        this.logHistoryRepository
          .createQueryBuilder('t')
          .select('t.esquema', 'esquema')
          .addSelect('t.tabla', 'tabla')
          .addSelect('COUNT(t.id)', 'cantidad')
          .groupBy('t.esquema')
          .addGroupBy('t.tabla')
          .orderBy('COUNT(t.id)', 'DESC')
          .limit(topTablas)
          .getRawMany(),
        this.logHistoryRepository
          .createQueryBuilder('t')
          .select("TO_CHAR(t.date, 'YYYY-MM-DD')", 'fecha')
          .addSelect('COUNT(t.id)', 'cantidad')
          .where('t.date >= :desde', { desde })
          .groupBy("TO_CHAR(t.date, 'YYYY-MM-DD')")
          .orderBy("TO_CHAR(t.date, 'YYYY-MM-DD')", 'ASC')
          .getRawMany(),
      ]);

    return {
      total,
      usuariosDistintos7Dias: Number(usuariosDistintos?.cantidad ?? 0),
      porAccion,
      porTabla,
      porDia,
    };
  }

  async findById(id: number): Promise<LogHistoryEntity> {
    if (!id) {
      throw new BadRequestException(
        traducir('common.EMPTY_ID', 'El id no puede estar vacío.'),
      );
    }
    const options = { id } as FindOptionsWhere<LogHistoryEntity>;
    const traza: LogHistoryEntity | null = await this.logHistoryRepository.findOneBy(options);
    if (!traza) {
      throw new NotFoundException(
        traducir('common.NOT_FOUND', 'El elemento no se encuentra.'),
      );
    }
    return traza;
  }

  async create(trazaEntity: LogHistoryEntity): Promise<void> {
    await this.logHistoryRepository.save(trazaEntity);
  }

  async delete(id: number): Promise<DeleteResult> {
    const options = { id } as FindOptionsWhere<LogHistoryEntity>;
    const trazaExist = await this.logHistoryRepository.findOneBy(options);
    if (!trazaExist) {
      throw new NotFoundException(
        traducir('common.NOT_FOUND', 'El elemento no se encuentra.'),
      );
    }
    return await this.logHistoryRepository.delete(id);
  }

  async findByFiltrados(user: UserEntity, filtro: any): Promise<any> {
    const wheres: any = {};
    let datep;
    Object.assign(wheres, user);

    if (filtro.date) {
      datep = new Date(filtro.date);
      const start = new Date(datep.setHours(0, 0, 0, 0));
      const end = new Date(datep.setHours(23, 59, 59, 999));
      const date = { date: Between(start.toISOString(), end.toISOString()) };
      Object.assign(wheres, date);
    }
    if (filtro.model) {
      const model = { model: filtro.model };
      Object.assign(wheres, model);
    }
    if (filtro.data) {
      const data = { data: filtro.data };
      Object.assign(wheres, data);
    }
    if (filtro.record) {
      const record = { record: filtro.record };
      Object.assign(wheres, record);
    }
    if (filtro.action) {
      const action = { action: filtro.action };
      Object.assign(wheres, action);
    }

    const take = filtro.take || 10;
    const page = filtro.page || 1;
    const [result, total] = await this.logHistoryRepository.findAndCount({
      where: wheres,
      take: page * take,
      skip: (page - 1) * take,
    });
    return {
      data: result,
      count: total,
    };
  }
}
