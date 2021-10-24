import {Pagination} from "nestjs-typeorm-paginate";
import {BuscarDto, FiltroGenericoDto, ResponseDto} from "../dto";
import {SelectDto} from "../../nomenclator/dto";

export interface IController {

    findAll(page?: number, limit?:number): Promise<Pagination<any>>;

    findById(id: any): Promise<any>;

    findByIds(ids: any[]): Promise<any[]>;

    createSelect(): Promise<SelectDto[]>;

    create(user: any, object: any): Promise<ResponseDto>;

    createMultiple(user: any, object: any[]): Promise<ResponseDto>;

    update(user: any, id:number, object: any): Promise<ResponseDto>;

    updateMultiple(user: any, object: any[]): Promise<ResponseDto>;

    filter(page?: number, limit?: number, filtroGenericoDto?: FiltroGenericoDto): Promise<Pagination<any>>;

    search(page?: number, limit?: number, buscarDto?: BuscarDto): Promise<Pagination<any>>;
}