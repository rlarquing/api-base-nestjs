import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {PermisoEntity} from "../entity";

@Injectable()
export class PermisoRepository {
    constructor(
        @InjectRepository(PermisoEntity)
        private permisoRepository: Repository<PermisoEntity>
    ) {
    }

    async findAll(): Promise<PermisoEntity[]> {
        return await this.permisoRepository.find();
    }

    async findById(id: number): Promise<PermisoEntity> {
        return await this.permisoRepository.findOne(id);
    }

    async findByServicio(servicio:string): Promise<PermisoEntity> {
        return await this.permisoRepository.findOne({servicio:servicio});
    }

    async findByIds(ids: number[]): Promise<PermisoEntity[]> {
        return await this.permisoRepository.findByIds(ids);
    }

    async create(permisoEntity:PermisoEntity): Promise<void>{
        await this.permisoRepository.save(permisoEntity);
    }

    async remove(servicio:string): Promise<DeleteResult> {
        const permiso: PermisoEntity = await this.findByServicio(servicio);
        return await this.permisoRepository.delete(permiso.id);
    }
}