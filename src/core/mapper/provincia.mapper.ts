import { Injectable } from '@nestjs/common';
import { ProvinciaEntity } from '../../persistence/entity';
import { ReadProvinciaDto } from '../../shared/dto';

@Injectable()
export class ProvinciaMapper {
  entityToDto(provinciaEntity: ProvinciaEntity): ReadProvinciaDto {
    const dtoToString: string = provinciaEntity.toString();
    return new ReadProvinciaDto(
      dtoToString,
      provinciaEntity.id,
      provinciaEntity.nombre,
      provinciaEntity.codigo,
      provinciaEntity.nombreCorto,
    );
  }
}
