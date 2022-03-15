import { Injectable } from '@nestjs/common';
import { MunicipioEntity } from '../../persistence/entity';
import { ReadMunicipioDto } from '../../shared/dto';

@Injectable()
export class MunicipioMapper {
  entityToDto(municipioEntity: MunicipioEntity): ReadMunicipioDto {
    const dtoToString: string = municipioEntity.toString();
    return new ReadMunicipioDto(
      municipioEntity.id,
      municipioEntity.nombre,
      dtoToString,
    );
  }
}
