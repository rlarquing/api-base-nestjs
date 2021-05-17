import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {DeleteResult} from "typeorm";

export interface IRepository<ENTITY> {

    findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>>;
    
    findById(id: any): Promise<ENTITY>;
    
    findByIds(ids: any[]): Promise<ENTITY[]>;

    create(object: ENTITY): Promise<ENTITY>;

    update(object: ENTITY): Promise<void>;

    delete(id: number): Promise<void>;

    remove(id: number[]): Promise<DeleteResult>;

    count(): Promise<number>;
}