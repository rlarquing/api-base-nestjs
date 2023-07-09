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
import {MenuRepository} from "../../persistence/repository";

@Injectable()
export class FuncionMapper {
  constructor(
    protected endPointMapper: EndPointMapper,
    protected menuMapper: MenuMapper,
    protected menuRepository: MenuRepository,
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

  async entityToDto(funcionEntity: FuncionEntity): Promise<ReadFuncionDto> {
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
      const funcionMenu = await this.menuRepository.findById(funcionEntity.menu.id)
      menu = this.menuMapper.entityToDto(funcionMenu);
    }
    readFuncionDto.endPoints = endPoints;
    readFuncionDto.menu = menu;

    return readFuncionDto;
  }
}
