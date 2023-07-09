import { Injectable } from '@nestjs/common';
import { EndPointMapper } from './end-point.mapper';
import { MenuMapper } from './menu.mapper';
import {
  CreateFuncionDto,
  ReadEndPointDto,
  ReadFuncionDto,
  ReadMenuDto,
  UpdateFuncionDto,
} from '../../shared/dto';
import { FuncionEntity } from '../../persistence/entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FuncionMapper {
  constructor(
    protected endPointMapper: EndPointMapper,
    protected menuMapper: MenuMapper,
  ) {}

  dtoToEntity(createFuncionDto: CreateFuncionDto): FuncionEntity {
    return plainToInstance(FuncionEntity, createFuncionDto);
  }

  dtoToUpdateEntity(
    updateFuncionDto: UpdateFuncionDto,
    updateFuncionEntity: FuncionEntity,
  ): FuncionEntity {
    return plainToInstance(FuncionEntity, {
      ...updateFuncionEntity,
      ...updateFuncionDto,
    });
  }

  entityToDto(funcionEntity: FuncionEntity): ReadFuncionDto {
    const readFuncionDto: ReadFuncionDto = plainToInstance(
      ReadFuncionDto,
      funcionEntity,
    );

    readFuncionDto.dtoToString = funcionEntity.toString();

    const endPoints: ReadEndPointDto[] = [];
    for (const endPoint of funcionEntity.endPoints) {
      endPoints.push(this.endPointMapper.entityToDto(endPoint));
    }

    let menu: ReadMenuDto = null;
    if (funcionEntity.menu !== null) {
      menu = this.menuMapper.entityToDto(funcionEntity.menu);
    }
    readFuncionDto.endPoints = endPoints;
    readFuncionDto.menu = menu;

    return readFuncionDto;
  }
}
