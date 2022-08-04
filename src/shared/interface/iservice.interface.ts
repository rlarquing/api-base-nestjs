import { DeleteResult } from 'typeorm';
import { BuscarDto, FiltroGenericoDto, ResponseDto, SelectDto } from '../dto';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

export interface IService {
  findAll(
    query: PaginateQuery,
    sinPaginacion?: boolean,
  ): Promise<Paginated<any> | any[]>;

  findById(id: any): Promise<any>;

  createSelect(): Promise<SelectDto[]>;

  create(user: any, object: any): Promise<ResponseDto>;

  createMultiple(user: any, object: any[]): Promise<ResponseDto[]>;

  update(user: any, id: number, object: any): Promise<ResponseDto>;

  deleteMultiple(user: any, ids: number[]): Promise<ResponseDto>;

  removeMultiple(user: any, ids: number[]): Promise<DeleteResult>;

  count(): Promise<number>;

  filter(
    query: PaginateQuery,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Paginated<any>>;

  search(query: PaginateQuery, buscarDto: BuscarDto): Promise<Paginated<any>>;
}
