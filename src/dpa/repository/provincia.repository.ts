import {ProvinciaEntity} from "../entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {Repository} from "typeorm";
import {IRepository} from "../../shared/interface";


@Injectable()
export class ProvinciaRepository {
    constructor(
        @InjectRepository(ProvinciaEntity)
        private provinciaRepository: Repository<ProvinciaEntity>,
    ) {}

    async findAll(options: IPaginationOptions): Promise<Pagination<ProvinciaEntity>> {
        return await paginate<ProvinciaEntity>(this.provinciaRepository, options);
    }

    async findById(id: number): Promise<ProvinciaEntity> {
        return await this.provinciaRepository.findOne(id);
    }

    async geoJson(): Promise<any> {
        const json= await this.provinciaRepository.createQueryBuilder('p').
           select("json_build_object( 'id', id, 'nombre', nombre)", "properties").
           addSelect("ST_AsGeoJSON(p.geom)::json", "geometry")
            .getRawMany();
        return json ;
    }
}