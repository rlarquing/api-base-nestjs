import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { LogHistoryEntity, UserEntity } from '../entity';
import { UserRepository } from './user.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

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

  async findById(id: number): Promise<LogHistoryEntity> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }
    const options = { id } as FindOptionsWhere<LogHistoryEntity>;
    const traza: LogHistoryEntity = await this.logHistoryRepository.findOneBy(options);
    if (!traza) {
      throw new NotFoundException('this trazas does not found');
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
      throw new NotFoundException('trazas does not exist');
    }
    return await this.logHistoryRepository.delete(id);
  }

  async findByFiltrados(user: UserEntity, filtro: any): Promise<any> {
    const wheres = {};
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
      relations: ['user'],
      take: page * take,
      skip: (page - 1) * take,
    });
    return {
      data: result,
      count: total,
    };
  }
}
