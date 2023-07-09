import { Injectable } from '@nestjs/common';
import { EndPointEntity } from '../../persistence/entity';
import { ReadEndPointDto } from '../../shared/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EndPointMapper {
  entityToDto(endPointEntity: EndPointEntity): ReadEndPointDto {
    const readEndPointDto: ReadEndPointDto = plainToInstance(
      ReadEndPointDto,
      endPointEntity,
    );
    readEndPointDto.dtoToString = endPointEntity.toString();
    return readEndPointDto;
  }
}
