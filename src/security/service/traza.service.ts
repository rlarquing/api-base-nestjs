import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Between, DeleteResult} from 'typeorm';
import {TrazaRepository} from './../repository/traza.repository';
import {TrazaDto} from "../dto/traza.dto";
import {HISTORY_ACTION, TrazaEntity} from "../entity/traza.entity";
import {TrazaMapper} from "../mapper/traza.mapper";
import {UserEntity} from "../entity/user.entity";
import {promises} from "dns";
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class TrazaService {
    constructor(
        private trazaRepository: TrazaRepository,
        private trazaMapper: TrazaMapper,
    ) {
    }

    async getAll(): Promise<TrazaDto[]> {
        const trazas: TrazaEntity[] = await this.trazaRepository.getAll();
        return trazas.map((traza) => this.trazaMapper.entityToDto(traza));
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<TrazaEntity>>{
        return await this.trazaRepository.paginate(options);
    }

    async get(id: number): Promise<TrazaDto> {
        const traza: TrazaEntity = await this.trazaRepository.get(id);
        return this.trazaMapper.entityToDto(traza);
    }

    async create(user: UserEntity, entity: any, action: HISTORY_ACTION): Promise<void> {
        const traza: TrazaEntity = new TrazaEntity();
        traza.user = user;
        traza.model = entity.model;
        delete entity.model;
        traza.data = entity;
        traza.action = action;
        traza.record = entity.id;
       await this.trazaRepository.create(traza);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.trazaRepository.delete(id);
    }

    async getFiltrados(user:UserEntity, filtro: any): Promise<any> {
        return await this.trazaRepository.getFiltrados(user, filtro);
    }

}
