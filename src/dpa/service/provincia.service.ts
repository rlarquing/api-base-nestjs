import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {ReadProvinciaDto} from "../dto";
import {ProvinciaRepository} from "../repository";
import {ProvinciaEntity} from "../entity";
import {ProvinciaMapper} from "../mapper";
import {GeoJsonDto} from "../../shared/dto";
import {GeoJsonMapper} from "../../shared/mapper";

@Injectable()
export class ProvinciaService {
    constructor(
        private provinciaRepository: ProvinciaRepository,
        private provinciaMapper: ProvinciaMapper,
        private geoJsonMapper: GeoJsonMapper,
    ) {
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<ReadProvinciaDto>> {
        const provincias: Pagination<ProvinciaEntity> = await this.provinciaRepository.findAll(options);
        const readProvinciaDto: ReadProvinciaDto[] = provincias.items.map((provincia: ProvinciaEntity) => this.provinciaMapper.entityToDto(provincia));
        return new Pagination(readProvinciaDto, provincias.meta, provincias.links);
    }

    async findById(id: number): Promise<ReadProvinciaDto> {
        if (!id) {
            throw new BadRequestException("El id no puede ser vacio");
        }
        const provincia: ProvinciaEntity = await this.provinciaRepository.findById(id);
        if (!provincia) {
            throw new NotFoundException('La provincia no se encuentra.');
        }
        return this.provinciaMapper.entityToDto(provincia);
    }

    async geoJson(): Promise<GeoJsonDto> {
        const provincias = await this.provinciaRepository.geoJson();
        return this.geoJsonMapper.entitiesToDto(provincias);
    }
}
