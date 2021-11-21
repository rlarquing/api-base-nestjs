import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ModeloEntity} from "../entity";

@Injectable()
export class ModeloRepository {
    constructor(
        @InjectRepository(ModeloEntity)
        private modeloRepository: Repository<ModeloEntity>
    ) {
    }

    async findAll(): Promise<ModeloEntity[]> {
        return await this.modeloRepository.find();
    }

    async findById(id: number): Promise<ModeloEntity> {
        return await this.modeloRepository.findOne(id);
    }
}