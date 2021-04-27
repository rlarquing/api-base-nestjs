import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import {MunicipioMapper} from "../mapper/municipio.mapper";
import {ReadMunicipioDto} from "../dto";
import {MunicipioEntity} from "../entity/municipio.entity";
import {MunicipioRepository} from "../repository/municipio.repository";

@Injectable()
export class MunicipioService {
  constructor(
    private municipioRepository: MunicipioRepository,
    private municipioMapper: MunicipioMapper,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<ReadMunicipioDto>> {
    const municipios: Pagination<MunicipioEntity> = await this.municipioRepository.getAll(options);
    const readMunicipioDto: ReadMunicipioDto[] = municipios.items.map((municipio: MunicipioEntity) => this.municipioMapper.entityToDto(municipio));
    return new Pagination(readMunicipioDto, municipios.meta, municipios.links);
  }

  async get(id: number): Promise<ReadMunicipioDto> {
    if (!id) {
      throw new BadRequestException("El id no puede ser vacio");
    }
    const municipio: MunicipioEntity = await this.municipioRepository.get(id);
    if (!municipio) {
      throw new NotFoundException('El municipio no se encuentra.');
    }
    return this.municipioMapper.entityToDto(municipio);
  }

  async getByProvincia(id: number): Promise<ReadMunicipioDto[]> {
    const municipio: MunicipioEntity[] = await this.municipioRepository.getByProvincia(id);
    return municipio.map((municipio: MunicipioEntity)=> this.municipioMapper.entityToDto(municipio));
  }
}
