import { Injectable } from '@nestjs/common';
import { TrazaEntity } from '../entity';
import { TrazaDto } from '../dto/traza.dto';

@Injectable()
export class TrazaMapper {
  entityToDto(trazaEntity: TrazaEntity): TrazaDto {
    return new TrazaDto(
      trazaEntity.id,
      trazaEntity.user.username,
      trazaEntity.date,
      trazaEntity.model,
      trazaEntity.data,
      trazaEntity.action,
      trazaEntity.record,
    );
  }
}
