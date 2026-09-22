import { BuscarDto, FiltroGenericoDto, ResponseDto, SelectDto } from '../dto';
import { Pagination } from '../pagination/types';
import { PaginationParamsDto } from '../pagination';
import { Request } from 'express';

export interface IController {
  findAll(params: PaginationParamsDto): Promise<Pagination<any> | any[]>;

  findById(id: any): Promise<any>;

  findByIds(ids: any[]): Promise<any[]>;

  createSelect(): Promise<SelectDto[]>;

  createSelectFilter(
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<SelectDto[]>;

  create(user: any, object: any, ip: string): Promise<ResponseDto>;

  createMultiple(user: any, object: any[], ip: string): Promise<ResponseDto[]>;

  update(user: any, id: number, object: any, ip: string): Promise<ResponseDto>;

  updateMultiple(user: any, object: any[], ip: string): Promise<ResponseDto>;

  filter(
    params: PaginationParamsDto,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Pagination<any>>;

  search(
    params: PaginationParamsDto,
    buscarDto: BuscarDto,
  ): Promise<Pagination<any>>;
}
