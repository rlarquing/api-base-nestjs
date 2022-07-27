import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { GeoJsonMapper, MunicipioMapper } from '../mapper';
import {
  GenericNomencladorRepository,
  MunicipioRepository,
  ProvinciaRepository,
} from '../../persistence/repository';
import { GeoJsonDto, ReadMunicipioDto, SelectDto } from '../../shared/dto';
import { MunicipioEntity, ProvinciaEntity } from '../../persistence/entity';
import { NomencladorTypeEnum } from '../../shared/enum';
import { AppConfig } from '../../app.keys';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MunicipioService {
  constructor(
    private configService: ConfigService,
    private municipioRepository: MunicipioRepository,
    private provinciaRepository: ProvinciaRepository,
    private genericNomencladorRepository: GenericNomencladorRepository,
    private municipioMapper: MunicipioMapper,
    private geoJsonMapper: GeoJsonMapper,
  ) {}

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<ReadMunicipioDto>> {
    const municipios: Pagination<MunicipioEntity> =
      await this.municipioRepository.findAll(options);
    const readMunicipioDto: ReadMunicipioDto[] = [];
    for (const municipio of municipios.items) {
      readMunicipioDto.push(await this.municipioMapper.entityToDto(municipio));
    }
    return new Pagination(readMunicipioDto, municipios.meta, municipios.links);
  }

  async findById(id: number): Promise<ReadMunicipioDto> {
    if (!id) {
      throw new BadRequestException('El id no puede ser vacio');
    }
    const municipio: MunicipioEntity = await this.municipioRepository.findById(
      id,
    );
    if (!municipio) {
      throw new NotFoundException('El municipio no se encuentra.');
    }
    return this.municipioMapper.entityToDto(municipio);
  }

  async findByProvincia(provincia: number): Promise<ReadMunicipioDto[]> {
    const municipios: MunicipioEntity[] =
      await this.municipioRepository.findByProvincia(provincia);
    const readMunicipioDto: ReadMunicipioDto[] = [];
    for (const municipio of municipios) {
      readMunicipioDto.push(await this.municipioMapper.entityToDto(municipio));
    }
    return readMunicipioDto;
  }

  async geoJson(): Promise<GeoJsonDto> {
    const municipios = await this.municipioRepository.geoJson();
    return this.geoJsonMapper.entitiesToDto(municipios);
  }

  async geoJsonByProvincia(): Promise<GeoJsonDto> {
    const nombreCorto: string = this.configService.get(AppConfig.PROVINCIA);
    const provincia: ProvinciaEntity =
      await this.provinciaRepository.findByNombreCorto(nombreCorto);
    const municipios = await this.municipioRepository.geoJsonByProvincia(
      provincia,
    );
    return this.geoJsonMapper.entitiesToDto(municipios);
  }

  async geoJsonById(id: number): Promise<GeoJsonDto> {
    const municipio = await this.municipioRepository.geoJsonById(id);
    return this.geoJsonMapper.entityToDto(municipio);
  }
  async createSelect(): Promise<SelectDto[]> {
    const nombreCorto: string = this.configService.get(AppConfig.PROVINCIA);
    const selectDto: SelectDto[] = [];
    const provincia: ProvinciaEntity =
      await this.provinciaRepository.findByNombreCorto(nombreCorto);
    const municipios: MunicipioEntity[] =
      await this.municipioRepository.findByProvincia(provincia);
    for (const municipio of municipios) {
      selectDto.push(new SelectDto(municipio.id, municipio.toString()));
    }
    return selectDto;
  }
}
