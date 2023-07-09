import { Injectable } from '@nestjs/common';
import {
  CreateNomencladorDto,
  ReadNomencladorDto,
  UpdateNomencladorDto,
} from '../../shared/dto';
import { GenericNomencladorEntity } from '../../persistence/entity';

@Injectable()
export class GenericNomencladorMapper {
  dtoToEntity(createNomencladorDto: CreateNomencladorDto): any {
    return new GenericNomencladorEntity(
      createNomencladorDto.nombre,
      createNomencladorDto.descripcion,
    );
  }

  dtoToUpdateEntity(
    updateNomencladorDto: UpdateNomencladorDto,
    updateEntity: any,
  ): any {
    updateEntity.nombre = updateNomencladorDto.nombre;
    updateEntity.descripcion = updateNomencladorDto.descripcion;
    return updateEntity;
  }

  entityToDto(nomencladorEntity: GenericNomencladorEntity): ReadNomencladorDto {
    return new ReadNomencladorDto(
      nomencladorEntity.id,
      nomencladorEntity.nombre,
      nomencladorEntity.descripcion,
      nomencladorEntity.toString(),
    );
  }
}
