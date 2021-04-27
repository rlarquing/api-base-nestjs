import {MunicipioEntity} from "../entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class MunicipioRepository {
    constructor(
        @InjectRepository(MunicipioEntity)
        private municipioRepository: Repository<MunicipioEntity>,
    ) {
    }

    async getAll(options: IPaginationOptions): Promise<Pagination<MunicipioEntity>> {
        return await paginate<MunicipioEntity>(this.municipioRepository, options);
    }

    async get(id: number): Promise<MunicipioEntity> {
        return await this.municipioRepository.findOne(id);
    }

    async getByProvincia(id: number): Promise<MunicipioEntity[]> {
        return await this.municipioRepository.find({where: {provincia: id}});
    }
}