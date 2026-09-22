import { NotFoundException } from '@nestjs/common';
import {
  Between,
  Brackets,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IRepository } from '../../shared/interface';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import { IPaginationOptions, paginate, Pagination } from '../../shared/pagination';
import { traducir } from '../../shared/util/i18n.util';

export abstract class GenericRepository<
  ENTITY extends ObjectLiteral,
> implements IRepository<ENTITY> {
  protected constructor(
    protected repository: Repository<ENTITY>,
    protected relations?: string[],
  ) {}

  /**
   * Aplica joins jerárquicos al queryBuilder manejando rutas anidadas (ej. 'muelle.terminal').
   * TypeORM QueryBuilder no resuelve relaciones anidadas desde la raíz,
   * por lo que cada nivel debe unirse secuencialmente usando el alias del padre.
   */
  protected applyRelationsToQueryBuilder(
    queryBuilder: SelectQueryBuilder<ENTITY>,
  ): void {
    if (!this.relations) return;
    const joined = new Set<string>();
    for (const relation of this.relations) {
      const parts = relation.split('.');
      let parentAlias = 'q';
      for (const part of parts) {
        const fullPath = `${parentAlias}.${part}`;
        if (!joined.has(fullPath)) {
          queryBuilder.leftJoinAndSelect(fullPath, part);
          joined.add(fullPath);
        }
        parentAlias = part;
      }
    }
  }

  /**
   * Obtiene el nombre del schema de la entidad desde metadata de TypeORM
   */
  getSchema(): string {
    return this.repository.metadata?.schema || 'public';
  }

  /**
   * Obtiene el nombre de la tabla de la entidad
   */
  getTabla(): string {
    return this.repository.metadata?.name || '';
  }

  async findAll(
    options: IPaginationOptions,
    sinPaginacion?: boolean,
  ): Promise<Pagination<ENTITY> | ENTITY[]> {
    const findOptions = {
      where: { activo: true },
      relations: this.relations,
    } as unknown as FindManyOptions<ENTITY>;
    if (sinPaginacion === true) {
      return await this.repository.find(findOptions);
    } else {
      return await paginate<ENTITY>(this.repository, options, findOptions);
    }
  }

  async findById(id: number): Promise<ENTITY> {
    const options = {
      where: { id, activo: true },
      relations: this.relations,
    } as unknown as FindOneOptions<ENTITY>;
    const result = await this.repository.findOne(options);
    if (!result) {
      throw new NotFoundException(
        traducir('common.NOT_FOUND_ID', `Entidad con id ${id} no encontrada`, {
          id,
        }),
      );
    }
    return result;
  }

  async findOne(id: number): Promise<ENTITY | null> {
    const options = {
      where: { id },
      relations: this.relations,
    } as unknown as FindOneOptions<ENTITY>;
    return await this.repository.findOne(options);
  }

  async findByIds(ids: number[]): Promise<ENTITY[]> {
    const options = {
      where: { id: In(ids), activo: true },
      relations: this.relations,
    } as unknown as FindManyOptions<ENTITY>;
    return await this.repository.find(options);
  }

  async createSelect(): Promise<ENTITY[]> {
    const options = {
      where: { activo: true },
      relations: this.relations,
    } as unknown as FindManyOptions<ENTITY>;
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
    } as unknown as FindOneOptions<ENTITY>;
    const obj: ENTITY | null = await this.repository.findOne(options);
    if (!obj) {
      throw new NotFoundException(
        traducir('common.NOT_FOUND', 'El elemento no se encuentra.'),
      );
    }
    (obj as any).activo = false;
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
    const wheres: any = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (this.relations && this.relations.includes(claves[i])) {
        wheres[claves[i]] = { id: valores[i] };
      } else {
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
    }
    const where = {
      where: wheres,
      relations: this.relations,
    } as unknown as FindManyOptions<ENTITY>;
    return await paginate<ENTITY>(this.repository, options, where);
  }

  async search(
    options: IPaginationOptions,
    search: any,
  ): Promise<Pagination<ENTITY>> {
    const queryBuilder = this.repository.createQueryBuilder('q');
    if (!isEmpty(search)) {
      const findOptions = {
        where: { activo: true },
      } as unknown as FindManyOptions<ENTITY>;
      const result = await this.repository.find(findOptions);
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
          const val = (item as any)[key];
          if (isString(val) && isString(search)) {
            if (val.toLowerCase().includes(search.toLowerCase())) {
              if (!objs.has(key)) {
                objs.set(key, `LOWER(q.${key}) ILIKE LOWER(:search)`);
              }
            }
          } else if (isNumber(val) && isString(search)) {
            if (String(val).includes(search)) {
              if (!objs.has(key)) {
                objs.set(key, `CAST(q.${key} AS TEXT) ILIKE :search`);
              }
            }
          } else if (isNumber(val) && isNumber(search) && val === search) {
            if (!objs.has(key)) {
              objs.set(key, `CAST(q.${key} AS TEXT) ILIKE :search`);
            }
          } else if (isBoolean(val) && isBoolean(search) && val === search) {
            if (!objs.has(key)) {
              objs.set(key, `CAST(q.${key} AS TEXT) ILIKE :search`);
            }
          }
        }
      });
      this.applyRelationsToQueryBuilder(queryBuilder);
      if (objs.size === 0) {
        queryBuilder.where('q.activo = :estado', { estado: true });
      } else {
        const where: string[] = [];
        objs.forEach((item) => {
          where.push(item);
        });
        queryBuilder.where('q.activo = :estado', { estado: true });
        queryBuilder.andWhere(
          new Brackets((qb) => {
            where.forEach((condition) => {
              qb.orWhere(condition, { search: `%${search}%` });
            });
          }),
        );
      }
    } else {
      // Sin termino de busqueda no hay condiciones dinamicas, por lo que se usa el
      // camino de FindManyOptions: carga las relaciones sin multiplicar filas en
      // las relaciones to-many, algo que el join del queryBuilder si haria.
      return (await this.findAll(options, false)) as Pagination<ENTITY>;
    }
    return await paginate<ENTITY>(queryBuilder, options);
  }

  async findBy(
    claves: string[],
    valores: any[],
    order?: any,
    take?: number,
  ): Promise<ENTITY[]> {
    const wheres: any = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (claves[i].includes('.')) {
        // Si la clave incluye un punto, asumimos que es una relación
        const [relation, property] = claves[i].split('.');
        wheres[relation] = { [property]: valores[i] };
      } else if (isNumber(valores[i])) {
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
    } as unknown as FindManyOptions<ENTITY>;
    return await this.repository.find(options);
  }

  async findOneBy(
    claves: string[],
    valores: any[],
    order?: any,
  ): Promise<ENTITY | null> {
    const wheres: any = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (claves[i].includes('.')) {
        // Si la clave incluye un punto, asumimos que es una relación
        const [relation, property] = claves[i].split('.');
        wheres[relation] = { [property]: valores[i] };
      } else if (isNumber(valores[i])) {
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
    } as unknown as FindOneOptions<ENTITY>;
    return await this.repository.findOne(options);
  }

  async createSelectFilter(
    claves: string[],
    valores: any[],
  ): Promise<ENTITY[]> {
    const wheres: any = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (this.relations && this.relations.includes(claves[i])) {
        wheres[claves[i]] = { id: valores[i] };
      } else {
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
    }
    const options = {
      where: wheres,
      relations: this.relations,
    } as unknown as FindManyOptions<ENTITY>;
    return await this.repository.find(options);
  }
}
