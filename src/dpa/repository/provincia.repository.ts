import {ProvinciaEntity} from "../entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {Repository} from "typeorm";


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

    async obtenerJson(): Promise<any> {
        const json= await this.provinciaRepository.createQueryBuilder('p').
           select("json_build_object( 'id', id, 'nombre', nombre)", "properties").
           addSelect("ST_AsGeoJSON(p.geom)::json", "geometry")
            .getRawMany(); ;

        return json ;
    }
}