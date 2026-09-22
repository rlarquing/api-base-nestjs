import { Injectable } from '@nestjs/common';
import { IdiomaEntity } from '../../persistence/entity';
import {
  CreateIdiomaDto,
  ReadIdiomaDto,
  UpdateIdiomaDto,
} from '../../shared/dto';

@Injectable()
export class IdiomaMapper {
  dtoToEntity(createIdiomaDto: CreateIdiomaDto): IdiomaEntity {
    return new IdiomaEntity(
      createIdiomaDto.codigo,
      createIdiomaDto.nombre,
      createIdiomaDto.defecto,
    );
  }

  dtoToUpdateEntity(
    updateIdiomaDto: UpdateIdiomaDto,
    updateIdiomaEntity: IdiomaEntity,
  ): IdiomaEntity {
    updateIdiomaEntity.codigo = updateIdiomaDto.codigo;
    updateIdiomaEntity.nombre = updateIdiomaDto.nombre;
    if (updateIdiomaDto.defecto !== undefined) {
      updateIdiomaEntity.defecto = updateIdiomaDto.defecto;
    }
    return updateIdiomaEntity;
  }

  entityToDto(idiomaEntity: IdiomaEntity): ReadIdiomaDto {
    return new ReadIdiomaDto(
      idiomaEntity.toString(),
      idiomaEntity.id,
      idiomaEntity.codigo,
      idiomaEntity.nombre,
      idiomaEntity.defecto,
    );
  }
}
