import { Injectable } from '@nestjs/common';
import { ProvinciaEntity } from '../../persistence/entity';
import { ReadProvinciaDto } from '../../shared/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProvinciaMapper {
  entityToDto(provinciaEntity: ProvinciaEntity): ReadProvinciaDto {
    const readProvinciaDto: ReadProvinciaDto = plainToInstance(
      ReadProvinciaDto,
      provinciaEntity,
    );
    readProvinciaDto.dtoToString = provinciaEntity.toString();
    return readProvinciaDto;
  }
}
