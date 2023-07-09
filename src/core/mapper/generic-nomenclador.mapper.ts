import { Injectable } from '@nestjs/common';
import {
  CreateNomencladorDto,
  ReadNomencladorDto,
  UpdateNomencladorDto,
} from '../../shared/dto';
import { GenericNomencladorEntity } from '../../persistence/entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GenericNomencladorMapper {
  dtoToEntity(
    createNomencladorDto: CreateNomencladorDto,
  ): GenericNomencladorEntity {
    return plainToInstance(GenericNomencladorEntity, createNomencladorDto);
  }

  dtoToUpdateEntity(
    updateNomencladorDto: UpdateNomencladorDto,
    updateEntity: GenericNomencladorEntity,
  ): any {
    return plainToInstance(GenericNomencladorEntity, {
      ...updateEntity,
      ...updateNomencladorDto,
    });
  }

  entityToDto(nomencladorEntity: GenericNomencladorEntity): ReadNomencladorDto {
    const readNomencladorDto: ReadNomencladorDto = plainToInstance(
      ReadNomencladorDto,
      nomencladorEntity,
    );
    readNomencladorDto.dtoToString = nomencladorEntity.toString();
    return readNomencladorDto
  }
}
