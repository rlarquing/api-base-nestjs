import { Injectable } from '@nestjs/common';
import {CreateElementoDashboardDto, ReadElementoDashboardDto, UpdateElementoDashboardDto} from "../dto";
import {ElementoDashboardEntity} from "../entity/elemento-dashboard.entity";

@Injectable()
export class ElementoDashboardMapper {
  async dtoToEntity(
    createElementoDashboardDto: CreateElementoDashboardDto,
  ): Promise<ElementoDashboardEntity> {
    const consulta: any = createElementoDashboardDto.consulta;
    consulta.total = true;
    return new ElementoDashboardEntity(
      createElementoDashboardDto.nombre,
      createElementoDashboardDto.tipo,
      createElementoDashboardDto.capa,
      consulta,
    );
  }

  async dtoToUpdateEntity(
    updateElementoDashboardDto: UpdateElementoDashboardDto,
    updateElementoDashboardEntity: ElementoDashboardEntity,
  ): Promise<ElementoDashboardEntity> {
    updateElementoDashboardEntity.nombre = updateElementoDashboardDto.nombre;
    updateElementoDashboardEntity.tipo = updateElementoDashboardDto.tipo;
    updateElementoDashboardEntity.capa = updateElementoDashboardDto.capa;
    updateElementoDashboardEntity.consulta =
      updateElementoDashboardDto.consulta;

    return updateElementoDashboardEntity;
  }

  async entityToDto(
    elementoDashboardEntity: ElementoDashboardEntity,
  ): Promise<ReadElementoDashboardDto> {
    const dtoToString: string = elementoDashboardEntity.toString();
    return new ReadElementoDashboardDto(
      dtoToString,
      elementoDashboardEntity.id,
      elementoDashboardEntity.nombre,
      elementoDashboardEntity.tipo,
      elementoDashboardEntity.capa,
      elementoDashboardEntity.consulta,
    );
  }
}
