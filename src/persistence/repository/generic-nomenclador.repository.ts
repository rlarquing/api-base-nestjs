import { Between, DeleteResult, FindManyOptions, ILike, FindOneOptions, } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
export class GenericNomencladorRepository {
  constructor() {}
  async findById(name: string, id: number): Promise<any> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const options = {
      where: { id, activo: true },
    } as FindOneOptions;
    const obj = await repo.findOne(options);
    if (!obj)
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name} y id ${id}`,
      );
    return obj;
  }
  async get(name: string): Promise<any[]> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const options = {
      where: { activo: true },
    } as FindManyOptions;
    const obj = await repo.find(options);
    if (!obj)
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    return obj;
  }
  async findAll(
    name: string,
    options: IPaginationOptions,
  ): Promise<Pagination<any>> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const findOptions = { where: { activo: true } } as FindManyOptions;
    return await paginate<any>(repo, options, findOptions);
  }
  async findOne(name: string, id: number): Promise<any> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const obj = await repo.findOne(id);
    if (!obj)
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name} y id ${id}`,
      );
    return obj;
  }
  async findByIds(name: string, ids: any[]): Promise<any[]> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const options = {
      where: { activo: true },
    } as FindManyOptions;
    return await repo.findByIds(ids, options);
  }
  async create(name: string, newObj: any): Promise<any> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    return await repo.save(newObj);
  }
  async createSelect(name: string): Promise<any[]> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const options = {
      where: { activo: true },
    } as FindManyOptions;
    return await repo.find(options);
  }
  async update(name: string, updateObj: any): Promise<any> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    return await repo.save(updateObj);
  }
  async delete(name: string, id: number): Promise<any> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const obj: any = await this.findById(name, id);
    if (!obj) {
      throw new NotFoundException('No existe');
    }
    obj.activo = false;
    return await repo.save(obj);
  }
  async remove(name: string, ids: number[]): Promise<DeleteResult> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    return await repo.delete(ids);
  }
  async count(name: string): Promise<number> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    return await repo.count();
  }
  async filter(
    name: string,
    options: IPaginationOptions,
    claves: string[],
    valores: any[],
  ): Promise<Pagination<any>> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const wheres = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        const date = { date: Between(start.toISOString(), end.toISOString()) };
        wheres[claves[i]] = date;
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const where = { where: wheres } as FindManyOptions;
    return await paginate<any>(repo, options, where);
  }
  async search(
    name: string,
    options: IPaginationOptions,
    search: any,
  ): Promise<Pagination<any>> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const wheres = { activo: true };
    if (!isEmpty(search)) {
      const result = await repo.find({ where: wheres });
      const objs: any[] = [];
      const keys: string[] = Object.keys(result[0]);
      for (const key of keys) {
        for (const item of result) {
          if (
            isString(item[key]) &&
            isString(search) &&
            item[key].toLowerCase().indexOf(search.toLowerCase()) >= 0
          ) {
            objs.push({ key: key, valor: ILike(`%${item[key]}%`) });
          } else if (
            isNumber(item[key]) &&
            isNumber(search) &&
            item[key] === search
          ) {
            objs.push({ key: key, valor: item[key] });
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
            objs.push({ key: key, valor: date });
          } else if (
            isBoolean(item[key]) &&
            isBoolean(search) &&
            item[key] === search
          ) {
            objs.push({ key: key, valor: item[key] });
          }
        }
      }
      objs.forEach((item) => {
        wheres[item.key] = item.valor;
      });
      if (Object.keys(wheres).length == 1) {
        wheres.activo = null;
      }
    }
    const where = { where: wheres } as FindManyOptions;
    return await paginate<any>(repo, options, where);
  }
  async findBy(name: string, claves: string[], valores: any[]): Promise<any[]> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
    const wheres = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        const date = { date: Between(start.toISOString(), end.toISOString()) };
        wheres[claves[i]] = date;
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const options = {
      where: wheres,
    } as FindManyOptions;
    return await repo.find(options);
  }

  async findOneBy(
    name: string,
    claves: string[],
    valores: any[],
    order?: any,
  ): Promise<any> {
    if (!this[`${name}Repository`])
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    const repo = this[`${name}Repository`];
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
      order: order,
    } as FindOneOptions;
    return await repo.findOne(options);
  }
}
