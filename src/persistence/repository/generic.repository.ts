import { NotFoundException } from '@nestjs/common';
import {
  Between,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { IRepository } from '../../shared/interface';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

export abstract class GenericRepository<ENTITY> implements IRepository<ENTITY> {
  protected constructor(
    protected repository: Repository<ENTITY>,
    protected relations?: string[],
  ) {}

  async findAll(
    query: PaginateQuery,
    sinPaginacion?: boolean,
  ): Promise<Paginated<ENTITY> | ENTITY[]> {
    if (sinPaginacion === true) {
      const options = {
        where: { activo: true },
        relations: this.relations,
      } as FindManyOptions;
      return await this.repository.find(options);
    } else {
      const where = {
        sortableColumns: ['id'],
        where: { activo: true },
        relations: this.relations,
      } as unknown as PaginateConfig<ENTITY>;
      return await paginate<ENTITY>(query, this.repository, where);
    }
  }

  async findById(id: number): Promise<ENTITY> {
    const options = {
      where: { id, activo: true },
      relations: this.relations,
    } as FindOneOptions;
    return await this.repository.findOne(options);
  }

  async findOne(id: number): Promise<ENTITY> {
    const options = {
      where: { id },
      relations: this.relations,
    } as FindOneOptions;
    return await this.repository.findOne(options);
  }

  async findByIds(ids: number[]): Promise<ENTITY[]> {
    const options = {
      where: { id: In(ids), activo: true },
      relations: this.relations,
    } as FindManyOptions;
    return await this.repository.find(options);
  }

  async createSelect(): Promise<any[]> {
    const options = {
      where: { activo: true },
      relations: this.relations,
    } as FindManyOptions;
    return await this.repository.find(options);
  }

  async create(newObj: ENTITY): Promise<ENTITY> {
    return await this.repository.save(newObj);
  }

  async update(updateObj: ENTITY): Promise<ENTITY> {
    return await this.repository.save(updateObj);
  }

  async delete(id: number): Promise<ENTITY> {
    const options = {
      where: { id, activo: true },
    } as FindOneOptions;
    const obj: any = await this.repository.findOne(options);
    if (!obj) {
      throw new NotFoundException('No existe');
    }
    obj.activo = false;
    return await this.repository.save(obj);
  }

  async remove(ids: number[]): Promise<DeleteResult> {
    return await this.repository.delete(ids);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async filter(
    query: PaginateQuery,
    claves: string[],
    valores: any[],
  ): Promise<Paginated<ENTITY>> {
    const wheres = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        wheres[claves[i]] = {
          date: Between(start.toISOString(), end.toISOString()),
        };
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const where = {
      sortableColumns: ['id'],
      where: wheres,
      relations: this.relations,
    } as unknown as PaginateConfig<ENTITY>;
    return await paginate<ENTITY>(query, this.repository, where);
  }

  async search(query: PaginateQuery, search: any): Promise<Paginated<ENTITY>> {
    if (!isEmpty(search)) {
      const options = { where: { activo: true } } as FindManyOptions;
      const result = await this.repository.find(options);
      const objs = new Map<string, string>();
      const keys = new Map<string, string>();
      if (result.length > 0) {
        Object.keys(result[0]).forEach((key) => {
          keys.set(key, key);
        });
        keys.delete('activo');
        keys.delete('createdAt');
        keys.delete('updatedAt');
      }
      keys.forEach((key) => {
        for (const item of result) {
          if (
            isString(item[key]) &&
            isString(search) &&
            item[key].toLowerCase().indexOf(search.toLowerCase()) !== -1
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} ILIKE '%${search}%'`);
            }
          } else if (
            isNumber(item[key]) &&
            isNumber(search) &&
            item[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} = :search`);
            }
          } else if (
            isDate(item[key]) &&
            isDate(search) &&
            item[key] === search
          ) {
            const datep = item[key];
            const start = new Date(datep.setHours(0, 0, 0, 0));
            const end = new Date(datep.setHours(23, 59, 59, 999));
            const date = {
              date: Between(start.toISOString(), end.toISOString()),
            };
            if (!objs.has(key)) {
              objs.set(key, `${key}=${date}`);
            }
          } else if (
            isBoolean(item[key]) &&
            isBoolean(search) &&
            item[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key}= :search`);
            }
          }
        }
      });
      const queryBuilder = this.repository.createQueryBuilder('q');
      if (this.relations) {
        for (const relation of this.relations) {
          queryBuilder.leftJoinAndSelect(`q.${relation}`, relation);
        }
      }
      if (objs.size === 0) {
        queryBuilder.where(`q.activo = true AND q.id=0`);
      } else {
        const where: string[] = [];
        objs.forEach((item) => {
          where.push(`q.${item}`);
        });
        queryBuilder.where(`q.activo = true AND ${where.join(' OR ')}`, {
          search: search,
        });
      }
      const where = {
        sortableColumns: ['id'],
      } as unknown as PaginateConfig<ENTITY>;
      return await paginate<ENTITY>(query, queryBuilder, where);
    }
  }

  async findBy(
    claves: string[],
    valores: any[],
    order?: any,
    take?: number,
  ): Promise<ENTITY[]> {
    const wheres = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        wheres[claves[i]] = {
          date: Between(start.toISOString(), end.toISOString()),
        };
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const options = {
      where: wheres,
      relations: this.relations,
      order: order,
      take: take,
    } as FindManyOptions;
    return await this.repository.find(options);
  }

  async findOneBy(
    claves: string[],
    valores: any[],
    order?: any,
  ): Promise<ENTITY> {
    const wheres = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        wheres[claves[i]] = {
          date: Between(start.toISOString(), end.toISOString()),
        };
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const options = {
      where: wheres,
      relations: this.relations,
      order: order,
    } as FindOneOptions;
    return await this.repository.findOne(options);
  }
}
