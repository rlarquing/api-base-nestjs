import { Injectable } from '@nestjs/common';
import { LogHistoryEntity } from '../../persistence/entity';
import { LogHistoryDto } from '../../shared/dto';

@Injectable()
export class LogHistoryMapper {
  entityToDto(logHistoryEntity: LogHistoryEntity): LogHistoryDto {
    return new LogHistoryDto(
      logHistoryEntity.id,
      logHistoryEntity.user,
      logHistoryEntity.date,
      logHistoryEntity.tabla,
      logHistoryEntity.esquema,
      logHistoryEntity.action,
      logHistoryEntity.valorNuevo,
      logHistoryEntity.valorAnterior,
      logHistoryEntity.registroId,
      logHistoryEntity.direccionIp,
    );
  }
}
