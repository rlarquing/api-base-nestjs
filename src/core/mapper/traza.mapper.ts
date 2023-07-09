import { Injectable } from '@nestjs/common';
import { TrazaEntity } from '../../persistence/entity';
import { TrazaDto } from '../../shared/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TrazaMapper {
  entityToDto(trazaEntity: TrazaEntity): TrazaDto {
    const trazaDto: TrazaDto = plainToInstance(TrazaDto, trazaEntity);
    trazaDto.user = trazaEntity.user.toString();
    return trazaDto;
  }
}
