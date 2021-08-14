import {NotFoundException} from "@nestjs/common";
import {DeleteResult, Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {IRepository} from "../interface";
import {status} from "../enum";

export abstract class GenericRepository<ENTITY> implements IRepository<ENTITY> {
    constructor(
        private repository: Repository<ENTITY>
    ) {
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>> {
        return await paginate<ENTITY>(this.repository, options, {where: {status: status.ACTIVE}});

    }

    async findById(id: number): Promise<ENTITY> {
        const obj: ENTITY = await this.repository.findOne(id, {
            where: {status: status.ACTIVE}
        });
        return obj;
    }

    async findOne(id: number): Promise<ENTITY> {
        return await this.repository.findOne(id);
    }

    async findByIds(ids: any[]): Promise<ENTITY[]> {
        return await this.repository.findByIds(ids, {
            where: {status: status.ACTIVE}
        });
    }

    async create(newObj: ENTITY): Promise<ENTITY> {
        return await this.repository.save(newObj);
    }

    async update(updateObj: ENTITY): Promise<ENTITY> {
        return await this.repository.save(updateObj);
    }

    async delete(id: number): Promise<ENTITY> {
        const obj: any = await this.repository.findOne(id, {where: {status: status.ACTIVE}});
        if (!obj) {
            throw new NotFoundException('No existe');
        }
        obj.status = status.INACTIVE;
        return await this.repository.save(obj);
    }

    async remove(ids: number[]): Promise<DeleteResult> {
        return await this.repository.delete(ids);
    }

    async count(): Promise<number> {
        return await this.repository.count();
    }
}
