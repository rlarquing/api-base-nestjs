import {
  Between,
  DeleteResult,
  FindManyOptions,
  ILike,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import { IPaginationOptions, paginate, Pagination } from '../../shared/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import {
  RolComercialEntity,
  TipoCargaEntity,
  TipoNavegacionEntity,
  TipoOperacionEntity,
  UnidadMedidaEntity,
} from '../entity';
import { NomencladorTypeEnum } from "../../shared/enum";

// Tipo para repositorios dinámicos
type RepositoryMap = Record<string, Repository<any>>;

export class GenericNomencladorRepository {
  // Definir los repositorios disponibles
  protected repositories: RepositoryMap = {};

  constructor(
    @InjectRepository(TipoOperacionEntity)
    protected tipoOperacionRepository: Repository<TipoOperacionEntity>,
    @InjectRepository(TipoCargaEntity)
    protected tipoCargaRepository: Repository<TipoCargaEntity>,
    @InjectRepository(UnidadMedidaEntity)
    protected unidadMedidaRepository: Repository<UnidadMedidaEntity>,
    @InjectRepository(TipoNavegacionEntity)
    protected tipoNavegacionRepository: Repository<TipoNavegacionEntity>,
    @InjectRepository(RolComercialEntity)
    protected rolComercialRepository: Repository<RolComercialEntity>,
  ) {
    // Registro automático basado en el enum
    this.registerRepository(
      NomencladorTypeEnum.TIPOOPERACION,
      tipoOperacionRepository,
    );
    this.registerRepository(NomencladorTypeEnum.TIPOCARGA, tipoCargaRepository);
    this.registerRepository(
      NomencladorTypeEnum.UNIDADMEDIDA,
      unidadMedidaRepository,
    );
    this.registerRepository(
      NomencladorTypeEnum.TIPONAVEGACION,
      tipoNavegacionRepository,
    );
    this.registerRepository(
      NomencladorTypeEnum.ROLCOMERCIAL,
      rolComercialRepository,
    );
  }
  /**
   * Obtiene el nombre del schema de la entidad desde metadata de TypeORM
   */
  getSchema(name: string): string {
    const repo = this.getRepository(name);
    return repo.metadata?.schema || 'public';
  }

  /**
   * Obtiene el nombre de la tabla de la entidad
   */
  getTabla(name: string): string {
    const repo = this.getRepository(name);
    return repo.metadata?.name || '';
  }

  // Método para registrar repositorios
  protected registerRepository(name: string, repository: Repository<any>) {
    this.repositories[name] = repository;
  }

  private getRepository(name: string): Repository<any> {
    const repo = this.repositories[name];
    if (!repo) {
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name}`,
      );
    }
    return repo;
  }

  async findById(name: string, id: number): Promise<any> {
    const repo = this.getRepository(name);
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
    const repo = this.getRepository(name);
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
    const repo = this.getRepository(name);
    const findOptions = { where: { activo: true } } as FindManyOptions;
    return await paginate<any>(repo, options, findOptions);
  }

  async findOne(name: string, id: number): Promise<any> {
    const repo = this.getRepository(name);
    const obj = await repo.findOne({ where: { id } });
    if (!obj)
      throw new NotFoundException(
        `No existe un nomenclador con nombre ${name} y id ${id}`,
      );
    return obj;
  }

  async findByIds(name: string, ids: any[]): Promise<any[]> {
    const repo = this.getRepository(name);
    // findByIds en TypeORM moderno solo acepta un array de IDs
    return await repo.findByIds(ids);
  }

  async create(name: string, newObj: any): Promise<any> {
    const repo = this.getRepository(name);
    return await repo.save(newObj);
  }

  async createSelect(name: string): Promise<any[]> {
    const repo = this.getRepository(name);
    const options = {
      where: { activo: true },
    } as FindManyOptions;
    return await repo.find(options);
  }

  async update(name: string, updateObj: any): Promise<any> {
    const repo = this.getRepository(name);
    return await repo.save(updateObj);
  }

  async delete(name: string, id: number): Promise<any> {
    const repo = this.getRepository(name);
    const obj: any = await this.findById(name, id);
    if (!obj) {
      throw new NotFoundException('No existe');
    }
    obj.activo = false;
    return await repo.save(obj);
  }

  async remove(name: string, ids: number[]): Promise<DeleteResult> {
    const repo = this.getRepository(name);
    return await repo.delete(ids);
  }

  async count(name: string): Promise<number> {
    const repo = this.getRepository(name);
    return await repo.count();
  }

  async filter(
    name: string,
    options: IPaginationOptions,
    claves: string[],
    valores: any[],
  ): Promise<Pagination<any>> {
    const repo = this.getRepository(name);
    const wheres: any = { activo: true };
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
    const repo = this.getRepository(name);
    const wheres: any = { activo: true };
    if (!isEmpty(search)) {
      const result = await repo.find({ where: wheres });
      const objs: any[] = [];
      if (result.length > 0) {
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
    const repo = this.getRepository(name);
    const wheres: any = { activo: true };
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
    const repo = this.getRepository(name);
    const wheres: any = { activo: true };
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
