import { DeleteResult } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

export interface IRepository<ENTITY> {
  findAll(
    options: IPaginationOptions,
    sinPaginacion?: boolean,
  ): Promise<Pagination<ENTITY> | ENTITY[]>;

  findById(id: any): Promise<ENTITY>;

  findByIds(ids: any[]): Promise<ENTITY[]>;

  createSelect(): Promise<any[]>;

  create(object: ENTITY): Promise<ENTITY>;

  update(object: ENTITY): Promise<ENTITY>;

  delete(id: number): Promise<ENTITY>;

  remove(id: number[]): Promise<DeleteResult>;

  count(): Promise<number>;

  filter(
    options: IPaginationOptions,
    claves: string[],
    valores: any[],
  ): Promise<Pagination<ENTITY>>;

  search(options: IPaginationOptions, search: any): Promise<Pagination<ENTITY>>;
}
