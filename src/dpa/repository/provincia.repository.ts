import {ProvinciaEntity} from "../entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";


@Injectable()
export class ProvinciaRepository {
    constructor(
        @InjectRepository(ProvinciaEntity)
        private provinciaRepository: Repository<ProvinciaEntity>,
    ) {}

    async getAll(options: IPaginationOptions): Promise<Pagination<ProvinciaEntity>> {
        return await paginate<ProvinciaEntity>(this.provinciaRepository, options);
    }

    async get(id: number): Promise<ProvinciaEntity> {
        return await this.provinciaRepository.findOne(id);
    }
}