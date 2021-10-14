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

    async findAll(options: IPaginationOptions): Promise<Pagination<MunicipioEntity>> {
        return await paginate<MunicipioEntity>(this.municipioRepository, options);
    }

    async findById(id: number): Promise<MunicipioEntity> {
        return await this.municipioRepository.findOne(id);
    }

    async findByProvincia(id: number): Promise<MunicipioEntity[]> {
        return await this.municipioRepository.find({where: {provincia: id}});
    }

    async geoJson(): Promise<any> {
        return await this.municipioRepository
            .createQueryBuilder('m')
            .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
            .addSelect('ST_AsGeoJSON(m.geom)::json', 'geometry')
            .getRawMany();
    }

    async geoJsonById(id: number): Promise<any> {
        return await this.municipioRepository
            .createQueryBuilder('m')
            .select("json_build_object( 'id', id, 'nombre', nombre)", 'properties')
            .addSelect('ST_AsGeoJSON(m.geom)::json', 'geometry')
            .andWhere('m.id=:id',{id:id})
            .getRawOne();
    }
}