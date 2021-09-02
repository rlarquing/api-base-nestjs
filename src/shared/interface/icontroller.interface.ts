import {Pagination} from "nestjs-typeorm-paginate";
import {ResponseDto} from "../dto";

export interface IController<ENTITY> {

    findAll(page?: number, limit?:number): Promise<Pagination<any>>;

    findById(id: any): Promise<any>;

    findByIds(ids: any[]): Promise<any[]>;

    create(user: any, object: ENTITY): Promise<ResponseDto>;

    createMultiple(user: any, object: ENTITY[]): Promise<ResponseDto>;

    update(user: any, id:number, object: ENTITY): Promise<ResponseDto>;

    updateMultiple(user: any, object: ENTITY[]): Promise<ResponseDto>;
}