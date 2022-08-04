import { BuscarDto, FiltroGenericoDto, ResponseDto, SelectDto } from '../dto';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

export interface IController {
  findAll(
    page?: number,
    limit?: number,
    sinPaginacion?: boolean,
    user?: any,
  ): Promise<Paginated<any> | any[]>;

  findById(id: any): Promise<any>;

  findByIds(ids: any[]): Promise<any[]>;

  createSelect(): Promise<SelectDto[]>;

  create(user: any, object: any): Promise<ResponseDto>;

  createMultiple(user: any, object: any[]): Promise<ResponseDto[]>;

  update(user: any, id: number, object: any): Promise<ResponseDto>;

  updateMultiple(user: any, object: any[]): Promise<ResponseDto>;

  filter(
    page?: number,
    limit?: number,
    filtroGenericoDto?: FiltroGenericoDto,
  ): Promise<Paginated<any>>;
  search(
    page?: number,
    limit?: number,
    buscarDto?: BuscarDto,
  ): Promise<Paginated<any>>;
}
