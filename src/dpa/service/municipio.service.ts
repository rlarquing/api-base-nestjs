import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {MunicipioMapper} from "../mapper";
import {ReadMunicipioDto} from "../dto";
import {MunicipioEntity} from "../entity";
import {MunicipioRepository} from "../repository";
import {GeoJsonDto} from "../../shared/dto";
import {GeoJsonMapper} from "../../shared/mapper";

@Injectable()
export class MunicipioService {
  constructor(
    private municipioRepository: MunicipioRepository,
    private municipioMapper: MunicipioMapper,
    private geoJsonMapper: GeoJsonMapper,
  ) {}

  async findAll(options: IPaginationOptions): Promise<Pagination<ReadMunicipioDto>> {
    const municipios: Pagination<MunicipioEntity> = await this.municipioRepository.findAll(options);
    const readMunicipioDto: ReadMunicipioDto[] = municipios.items.map((municipio: MunicipioEntity) => this.municipioMapper.entityToDto(municipio));
    return new Pagination(readMunicipioDto, municipios.meta, municipios.links);
  }

  async findById(id: number): Promise<ReadMunicipioDto> {
    if (!id) {
      throw new BadRequestException("El id no puede ser vacio");
    }
    const municipio: MunicipioEntity = await this.municipioRepository.findById(id);
    if (!municipio) {
      throw new NotFoundException('El municipio no se encuentra.');
    }
    return this.municipioMapper.entityToDto(municipio);
  }

  async findByProvincia(id: number): Promise<ReadMunicipioDto[]> {
    const municipio: MunicipioEntity[] = await this.municipioRepository.findByProvincia(id);
    return municipio.map((municipio: MunicipioEntity)=> this.municipioMapper.entityToDto(municipio));
  }

  async geoJson(): Promise<GeoJsonDto> {
    const municipios = await this.municipioRepository.geoJson();
    return this.geoJsonMapper.entitiesToDto(municipios);
  }

  async geoJsonById(id: number): Promise<GeoJsonDto> {
    const municipio = await this.municipioRepository.geoJsonById(id);
    return this.geoJsonMapper.entityToDto(municipio);
  }
}
