import { Injectable } from '@nestjs/common';
import { TrazaEntity } from '../../persistence/entity';
import { TrazaDto } from '../../shared/dto';

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
