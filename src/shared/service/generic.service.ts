import {IService} from "../interface";
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {DeleteResult} from "typeorm";
import {GenericRepository} from "../repository/generic.repository";
import {HISTORY_ACTION, UserEntity} from "../../security/entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";
import {TrazaService} from "../../security/service";

export abstract class GenericService<ENTITY> implements IService<ENTITY> {
    constructor(
        protected genericRepository: GenericRepository<ENTITY>,
        protected mapper: any,
        protected trazaService: TrazaService,
        protected traza?: boolean
    ) { }

    async findAll(options: IPaginationOptions): Promise<Pagination<ENTITY>> {
        const items: Pagination<ENTITY> = await this.genericRepository.findAll(options);
        const readRDto: any[] = items.items.map((item: any) => this.mapper.entityToDto(item));
        return new Pagination(readRDto, items.meta, items.links);
    }

    async findById(id: any): Promise<any> {
        if (!id) {
            throw new BadRequestException("El id no puede ser vacio");
        }
        const obj: ENTITY = await this.genericRepository.findById(id);
        if (!obj) {
            throw new NotFoundException('El obj no se encuentra.');
        }
        return this.mapper.entityToDto(obj);
    }

    async findByIds(ids: any[]): Promise<ENTITY[]> {
        const items = await this.genericRepository.findByIds(ids);
        return items.map((item: any) => this.mapper.entityToDto(item));
    }

    async create(user: UserEntity, createDto: any): Promise<void> {
        const newEntity = this.mapper.dtoToEntity(createDto);
        const objEntity: ENTITY = await this.genericRepository.create(newEntity);
        if (this.traza) {
            await this.trazaService.create(user, objEntity, HISTORY_ACTION.ADD);
        }
    }

    async update(user: UserEntity, id: number, updateDto: any): Promise<void> {
        const foundObj: ENTITY = await this.genericRepository.findById(id);
        if (!foundObj) {
            throw new NotFoundException('No existe');
        }
        const updateEntity = this.mapper.dtoToUpdateEntity(updateDto,foundObj);
        await this.genericRepository.update(updateEntity);
        if (this.traza) {
            await this.trazaService.create(user, updateEntity, HISTORY_ACTION.MOD);
        }
    }

    async deleteMultiple(user: UserEntity, ids: number[]): Promise<void> {
        for (let id of ids) {
            const objEntity: ENTITY = await this.genericRepository.findById(id);
            if (!objEntity) {
                throw new NotFoundException('No existe');
            }
            if (this.traza) {
                await this.trazaService.create(user, objEntity, HISTORY_ACTION.DEL);
            }
            await this.genericRepository.delete(id);
        }

    }

    async removeMultiple(user: UserEntity, ids: number[]): Promise<DeleteResult> {
        for (let id of ids) {
            const objEntity: ENTITY = await this.genericRepository.findOne(id);
            if (!objEntity) {
                throw new NotFoundException('No existe');
            }
            if (this.traza) {
                await this.trazaService.create(user, objEntity, HISTORY_ACTION.DEL);
            }
        }
            return await this.genericRepository.remove(ids);
    }

    async count(): Promise<number> {
        return await this.genericRepository.count();
    }
}