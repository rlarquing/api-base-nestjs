import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {DeleteResult} from "typeorm";

export interface IRepository<ENTITY> {

    findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>>;
    
    findById(id: any): Promise<ENTITY>;
    
    findByIds(ids: any[]): Promise<ENTITY[]>;

    create(object: ENTITY): Promise<ENTITY>;

    update(object: ENTITY): Promise<ENTITY>;

    delete(id: number): Promise<ENTITY>;

    remove(id: number[]): Promise<DeleteResult>;

    count(): Promise<number>;

    filter(options: IPaginationOptions, claves: string[], valores: any[]): Promise<Pagination<ENTITY>>;

    search(options: IPaginationOptions, search: any): Promise<Pagination<ENTITY>>;
}