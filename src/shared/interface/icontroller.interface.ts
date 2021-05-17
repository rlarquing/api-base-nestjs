import {Pagination} from "nestjs-typeorm-paginate";
import {UpdateResult} from "typeorm/query-builder/result/UpdateResult";

export interface IController<ENTITY> {

    findAll(page?: number, limit?:number): Promise<Pagination<any>>;

    findById(id: any): Promise<any>;

    findByIds(ids: any[]): Promise<any[]>;

    create(user: any, object: ENTITY): Promise<void>;

    createMultiple(user: any, object: ENTITY[]): Promise<void>;

    update(user: any, id:number, object: ENTITY): Promise<void>;

    updateMultiple(user: any, object: ENTITY[]): Promise<void>;
}