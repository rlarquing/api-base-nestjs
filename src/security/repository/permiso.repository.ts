import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PermisoEntity} from "../entity";

@Injectable()
export class PermisoRepository {
    constructor(
        @InjectRepository(PermisoEntity)
        private permisoRepository: Repository<PermisoEntity>
    ) {
    }

    async findAll(): Promise<PermisoEntity[]> {
        return await this.permisoRepository.find({
            relations: ['modelo']
        });
    }

    async findById(id: number): Promise<PermisoEntity> {
        return await this.permisoRepository.findOne(id, {
            relations: ['modelo']
        });
    }

    async findByIds(ids: number[]): Promise<PermisoEntity[]> {
        return await this.permisoRepository.findByIds(ids, {
            relations: ['modelo']
        });
    }

    async create(permisoEntity:PermisoEntity): Promise<void>{
        await this.permisoRepository.save(permisoEntity);
    }
}