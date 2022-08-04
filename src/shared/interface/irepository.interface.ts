import { DeleteResult } from 'typeorm';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

export interface IRepository<ENTITY> {
  findAll(
    query: PaginateQuery,
    sinPaginacion?: boolean,
  ): Promise<Paginated<ENTITY> | ENTITY[]>;

  findById(id: any): Promise<ENTITY>;

  findByIds(ids: any[]): Promise<ENTITY[]>;

  createSelect(): Promise<any[]>;

  create(object: ENTITY): Promise<ENTITY>;

  update(object: ENTITY): Promise<ENTITY>;

  delete(id: number): Promise<ENTITY>;

  remove(id: number[]): Promise<DeleteResult>;

  count(): Promise<number>;

  filter(
    query: PaginateQuery,
    claves: string[],
    valores: any[],
  ): Promise<Paginated<ENTITY>>;

  search(query: PaginateQuery, search: any): Promise<Paginated<ENTITY>>;
}
