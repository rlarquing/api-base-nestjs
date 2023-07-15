import { DeleteResult } from 'typeorm';
import { BuscarDto, FiltroGenericoDto, ResponseDto, SelectDto } from '../dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

export interface IService {
  findAll(
    options: IPaginationOptions,
    sinPaginacion?: boolean,
  ): Promise<Pagination<any> | any[]>;

  findById(id: any): Promise<any>;

  createSelect(): Promise<SelectDto[]>;

  createSelectFilter(
      filtroGenericoDto: FiltroGenericoDto,
  ): Promise<SelectDto[]>;

  create(user: any, object: any): Promise<ResponseDto>;

  createMultiple(user: any, object: any[]): Promise<ResponseDto[]>;

  update(user: any, id: number, object: any): Promise<ResponseDto>;

  deleteMultiple(user: any, ids: number[]): Promise<ResponseDto>;

  removeMultiple(user: any, ids: number[]): Promise<DeleteResult>;

  count(): Promise<number>;

  filter(
    options: IPaginationOptions,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Pagination<any>>;

  search(
    options: IPaginationOptions,
    buscarDto: BuscarDto,
  ): Promise<Pagination<any>>;
}
