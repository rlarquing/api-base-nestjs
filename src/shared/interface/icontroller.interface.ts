import {Pagination} from "nestjs-typeorm-paginate";
import {ResponseDto} from "../dto";

export interface IController {

    findAll(page?: number, limit?:number): Promise<Pagination<any>>;

    findById(id: any): Promise<any>;

    findByIds(ids: any[]): Promise<any[]>;

    create(user: any, object: any): Promise<ResponseDto>;

    createMultiple(user: any, object: any[]): Promise<ResponseDto>;

    update(user: any, id:number, object: any): Promise<ResponseDto>;

    updateMultiple(user: any, object: any[]): Promise<ResponseDto>;
}