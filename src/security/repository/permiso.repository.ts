import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PermisoEntity, UserEntity} from "../entity";

@Injectable()
export class PermisoRepository {
    constructor(
        @InjectRepository(PermisoEntity)
        private permisoRepository: Repository<PermisoEntity>
    ) {
    }

    async findAll(): Promise<PermisoEntity[]> {
        return await this.permisoRepository.find({
            relations: ['modelo','users','roles','grupos']
        });
    }

    async findById(id: number): Promise<PermisoEntity> {
        return await this.permisoRepository.findOne(id, {
            relations: ['modelo','users','roles','grupos']
        });
    }

    async findByIds(ids: number[]): Promise<PermisoEntity[]> {
        return await this.permisoRepository.findByIds(ids, {
            relations: ['modelo','users','roles','grupos']
        });
    }
}