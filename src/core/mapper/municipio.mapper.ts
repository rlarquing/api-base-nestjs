import { Injectable } from '@nestjs/common';
import { MunicipioEntity } from '../../persistence/entity';
import { ReadMunicipioDto, ReadProvinciaDto } from '../../shared/dto';
import { MunicipioRepository } from '../../persistence/repository';
import { ProvinciaMapper } from './provincia.mapper';

@Injectable()
export class MunicipioMapper {
  constructor(
    protected municipioRepository: MunicipioRepository,
    protected provinciaMapper: ProvinciaMapper,
  ) {}
  async entityToDto(
    municipioEntity: MunicipioEntity,
  ): Promise<ReadMunicipioDto> {
    const municipio: MunicipioEntity = await this.municipioRepository.findById(
      municipioEntity.id,
    );
    const readProvinciaDto: ReadProvinciaDto = this.provinciaMapper.entityToDto(
      municipio.provincia,
    );
    const dtoToString: string = municipioEntity.toString();
    return new ReadMunicipioDto(
      dtoToString,
      municipioEntity.id,
      municipioEntity.nombre,
      municipioEntity.codigo,
      readProvinciaDto,
    );
  }
}
