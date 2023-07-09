import { Injectable } from '@nestjs/common';
import { MunicipioEntity } from '../../persistence/entity';
import { ReadMunicipioDto, ReadProvinciaDto } from '../../shared/dto';
import { ProvinciaMapper } from './provincia.mapper';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MunicipioMapper {
  constructor(protected provinciaMapper: ProvinciaMapper) {}
  entityToDto(municipioEntity: MunicipioEntity): ReadMunicipioDto {
    const readMunicipioDto: ReadMunicipioDto = plainToInstance(
      ReadMunicipioDto,
      municipioEntity,
    );
    readMunicipioDto.dtoToString = municipioEntity.toString();
    const readProvinciaDto: ReadProvinciaDto = this.provinciaMapper.entityToDto(
      municipioEntity.provincia,
    );
    readMunicipioDto.provincia = readProvinciaDto;
    return readMunicipioDto;
  }
}
