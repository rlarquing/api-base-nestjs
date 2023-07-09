import { Injectable } from '@nestjs/common';
import { EndPointEntity } from '../../persistence/entity';
import { ReadEndPointDto } from '../../shared/dto';

@Injectable()
export class EndPointMapper {
  entityToDto(endPointEntity: EndPointEntity): ReadEndPointDto {
    const dtoToString: string = endPointEntity.toString();
    return new ReadEndPointDto(
      dtoToString,
      endPointEntity.id,
      endPointEntity.controller,
      endPointEntity.servicio,
      endPointEntity.ruta,
      endPointEntity.nombre,
      endPointEntity.metodo,
    );
  }
}
