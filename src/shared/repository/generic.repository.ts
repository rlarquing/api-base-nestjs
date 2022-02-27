import { NotFoundException } from '@nestjs/common';
import { Between, DeleteResult, ILike, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { IRepository } from '../interface';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';

export abstract class GenericRepository<ENTITY> implements IRepository<ENTITY> {
  protected constructor(
    protected repository: Repository<ENTITY>,
    protected relations?: string[],
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>> {
    return await paginate<ENTITY>(this.repository, options, {
      where: { activo: true },
      relations: this.relations,
    });
  }

  async findById(id: number): Promise<ENTITY> {
    return await this.repository.findOne(id, {
      where: { activo: true },
      relations: this.relations,
    });
  }

  async findOne(id: number): Promise<ENTITY> {
    return await this.repository.findOne(id, { relations: this.relations });
  }

  async findByIds(ids: any[]): Promise<ENTITY[]> {
    return await this.repository.findByIds(ids, {
      where: { activo: true },
      relations: this.relations,
    });
  }

  async findByName(username: string): Promise<ENTITY> {
    return await this.repository.findOne({
      where: { activo: true, username: username },
      relations: ['roles', 'permisos'],
    });
  }

  async createSelect(): Promise<any[]> {
    return await this.repository.find({
      where: { activo: true },
      relations: this.relations,
    });
  }

  async create(newObj: ENTITY): Promise<ENTITY> {
    return await this.repository.save(newObj);
  }

  async update(updateObj: ENTITY): Promise<ENTITY> {
    return await this.repository.save(updateObj);
  }

  async delete(id: number): Promise<ENTITY> {
    const obj: any = await this.repository.findOne(id, {
      where: { activo: true },
    });
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
    options: IPaginationOptions,
    claves: string[],
    valores: any[],
  ): Promise<Pagination<ENTITY>> {
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
    return await paginate<ENTITY>(this.repository, options, {
      where: wheres,
      relations: this.relations,
    });
  }

  async search(
    options: IPaginationOptions,
    search: any,
  ): Promise<Pagination<ENTITY>> {
    if (!isEmpty(search)) {
      const result = await this.repository.find({ where: { activo: true } });
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
      return await paginate<ENTITY>(queryBuilder, options);
    }
  }
}
