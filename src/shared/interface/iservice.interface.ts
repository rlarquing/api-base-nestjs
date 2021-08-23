import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {DeleteResult} from "typeorm";
import {ResponseDto} from "../dto";

export interface IService<ENTITY> {

    findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>>;

    findById(id: any): Promise<ENTITY>;

    findByIds(ids: any[]): Promise<ENTITY[]>;

    create(user: any, object: ENTITY): Promise<ResponseDto>;

    update(user: any, id:number, object: ENTITY): Promise<ResponseDto>;

    deleteMultiple(user: any, ids: number[]): Promise<ResponseDto>;

    removeMultiple(user: any, ids: number[]): Promise<DeleteResult>;

    count(): Promise<number>;
}