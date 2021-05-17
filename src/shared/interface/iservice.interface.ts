import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {DeleteResult} from "typeorm";

export interface IService<ENTITY> {

    findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>>;

    findById(id: any): Promise<ENTITY>;

    findByIds(ids: any[]): Promise<ENTITY[]>;

    create(user: any, object: ENTITY): Promise<void>;

    update(user: any, id:number, object: ENTITY): Promise<void>;

    deleteMultiple(user: any, ids: number[]): Promise<void>;

    removeMultiple(user: any, ids: number[]): Promise<DeleteResult>;

    count(): Promise<number>;
}