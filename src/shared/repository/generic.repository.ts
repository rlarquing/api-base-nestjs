import {NotFoundException} from "@nestjs/common";
import {Between, DeleteResult, ILike, Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {IRepository} from "../interface";
import {isBoolean, isDate, isEmpty, isNumber, isString} from "class-validator";

export abstract class GenericRepository<ENTITY> implements IRepository<ENTITY> {
    constructor(
        private repository: Repository<ENTITY>,
        private relations?: string[]
    ) {
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>> {
        return await paginate<ENTITY>(this.repository, options, {where: {activo: true}, relations: this.relations});

    }

    async findById(id: number): Promise<ENTITY> {
        return await this.repository.findOne(id, {
            where: {activo: true}, relations: this.relations
        });
    }

    async findOne(id: number): Promise<ENTITY> {
        return await this.repository.findOne(id);
    }

    async findByIds(ids: any[]): Promise<ENTITY[]> {
        return await this.repository.findByIds(ids, {
            where: {activo: true}, relations: this.relations
        });
    }

    async create(newObj: ENTITY): Promise<ENTITY> {
        return await this.repository.save(newObj);
    }

    async update(updateObj: ENTITY): Promise<ENTITY> {
        return await this.repository.save(updateObj);
    }

    async delete(id: number): Promise<ENTITY> {
        const obj: any = await this.repository.findOne(id, {where: {activo: true}});
        if (!obj) {
            throw new NotFoundException('No existe');
        }
        obj.activo = false;
        return await this.repository.save(obj);
    }

    async remove(ids: number[]): Promise<DeleteResult> {
        return await this.repository.delete(ids);
    }

    async count(): Promise<number> {
        return await this.repository.count();
    }

    async filter(options: IPaginationOptions, claves: string[], valores: any[]): Promise<Pagination<ENTITY>> {
        const wheres = {activo: true};
        for (let i = 0; i < claves.length; i++) {
            if (isNumber(valores[i])) {
                wheres[claves[i]] = valores[i];
            } else if (isDate(valores[i])) {
                let datep = valores[i];
                const start = new Date(datep.setHours(0, 0, 0, 0))
                const end = new Date(datep.setHours(23, 59, 59, 999))
                const date = {date: Between(start.toISOString(), end.toISOString())}
                wheres[claves[i]] = date;
            } else if (isBoolean(valores[i])) {
                wheres[claves[i]] = valores[i];
            } else {
                wheres[claves[i]] = ILike(`%${valores[i]}%`);
            }

        }
        return await paginate<ENTITY>(this.repository, options, {where: wheres, relations: this.relations});
    }

    async search(options: IPaginationOptions, search: any): Promise<Pagination<ENTITY>> {
        let wheres = {activo: true};
        if (!isEmpty(search)) {
            const result = await this.repository.find({where: wheres});
            let objs: any[] = [];
            const keys: string[] = Object.keys(result[0]);
            for (const key of keys) {
                for (const item of result) {
                    if ((isString(item[key]) && isString(search)) && (item[key].toLowerCase().indexOf(search.toLowerCase()) >= 0)) {
                        objs.push({key: key, valor: ILike(`%${item[key]}%`)});
                    } else if ((isNumber(item[key]) && isNumber(search)) && (item[key] === search)) {
                        objs.push({key: key, valor: item[key]});
                    } else if ((isDate(item[key]) && isDate(search)) && (item[key] === search)) {
                        let datep = item[key];
                        const start = new Date(datep.setHours(0, 0, 0, 0))
                        const end = new Date(datep.setHours(23, 59, 59, 999))
                        const date = {date: Between(start.toISOString(), end.toISOString())}
                        objs.push({key: key, valor: date});
                    } else if ((isBoolean(item[key]) && isBoolean(search)) && (item[key] === search)) {
                        objs.push({key: key, valor: item[key]});
                    }
                }
            }
            objs.forEach((item) => {
                wheres[item.key] = item.valor;
            });
            if (Object.keys(wheres).length == 1) {
                wheres.activo = null;
            }
        }
        return await paginate<ENTITY>(this.repository, options, {where: wheres, relations: this.relations});

    }
}
