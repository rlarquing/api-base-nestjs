import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Between, DeleteResult} from 'typeorm';
import {TrazaRepository} from './../repository/traza.repository';
import {TrazaDto} from "../dto/traza.dto";
import {TrazaEntity} from "../entity/traza.entity";
import {TrazaMapper} from "../mapper/traza.mapper";
import {UserEntity} from "../entity/user.entity";

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

    async get(id: number): Promise<TrazaDto> {
        const traza: TrazaEntity = await this.trazaRepository.get(id);
        return this.trazaMapper.entityToDto(traza);
    }

    async create(traza: TrazaEntity): Promise<TrazaEntity> {
        const saveTraza: TrazaEntity = await this.trazaRepository.create(traza);
        return saveTraza;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.trazaRepository.delete(id);
    }

    async getFiltrados(user:UserEntity, filtro: any): Promise<any> {
        return await this.trazaRepository.getFiltrados(filtro);
    }

}
