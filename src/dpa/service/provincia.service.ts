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

@Injectable()
export class ProvinciaService {
  constructor(
    private provinciaRepository: ProvinciaRepository,
    private provinciaMapper: ProvinciaMapper,
  ) {}

  async getAll(options: IPaginationOptions): Promise<Pagination<ReadProvinciaDto>> {
    const provincias: Pagination<ProvinciaEntity> = await this.provinciaRepository.getAll(options);
    const readProvinciaDto: ReadProvinciaDto[] = provincias.items.map((provincia: ProvinciaEntity) => this.provinciaMapper.entityToDto(provincia));
    return new Pagination(readProvinciaDto, provincias.meta, provincias.links);
  }

  async get(id: number): Promise<ReadProvinciaDto> {
    if (!id) {
      throw new BadRequestException("El id no puede ser vacio");
    }
    const provincia: ProvinciaEntity = await this.provinciaRepository.get(id);
    if (!provincia) {
      throw new NotFoundException('La provincia no se encuentra.');
    }
    return this.provinciaMapper.entityToDto(provincia);
  }

async obtenerJson(): Promise<any>{
    return await this.provinciaRepository.obtenerJson();
}
}
