import { Injectable, NotFoundException } from '@nestjs/common';
import { FuncionTraduccionEntity } from '../../persistence/entity';
import {
  CreateFuncionTraduccionDto,
  ReadFuncionTraduccionDto,
  UpdateFuncionTraduccionDto,
} from '../../shared/dto';
import { FuncionTraduccionRepository } from '../../persistence/repository';
import { traducir } from '../../shared/util/i18n.util';

@Injectable()
export class FuncionTraduccionMapper {
  constructor(
    private funcionTraduccionRepository: FuncionTraduccionRepository,
  ) {}

  async dtoToEntity(
    createDto: CreateFuncionTraduccionDto,
  ): Promise<FuncionTraduccionEntity> {
    const funcion = await this.funcionTraduccionRepository.findFuncionById(
      createDto.funcionId,
    );
    if (!funcion)
      throw new NotFoundException(
        traducir(
          'traduccion.FUNCION_NOT_FOUND',
          `Funcion con id ${createDto.funcionId} no encontrada`,
          { id: createDto.funcionId },
        ),
      );
    const idioma = await this.funcionTraduccionRepository.findIdiomaById(
      createDto.idiomaId,
    );
    if (!idioma)
      throw new NotFoundException(
        traducir(
          'traduccion.IDIOMA_NOT_FOUND',
          `Idioma con id ${createDto.idiomaId} no encontrado`,
          { id: createDto.idiomaId },
        ),
      );
    return new FuncionTraduccionEntity(
      funcion,
      idioma,
      createDto.nombre,
      createDto.descripcion,
    );
  }

  async dtoToUpdateEntity(
    updateDto: UpdateFuncionTraduccionDto,
    updateEntity: FuncionTraduccionEntity,
  ): Promise<FuncionTraduccionEntity> {
    const funcion = await this.funcionTraduccionRepository.findFuncionById(
      updateDto.funcionId,
    );
    if (!funcion)
      throw new NotFoundException(
        traducir(
          'traduccion.FUNCION_NOT_FOUND',
          `Funcion con id ${updateDto.funcionId} no encontrada`,
          { id: updateDto.funcionId },
        ),
      );
    const idioma = await this.funcionTraduccionRepository.findIdiomaById(
      updateDto.idiomaId,
    );
    if (!idioma)
      throw new NotFoundException(
        traducir(
          'traduccion.IDIOMA_NOT_FOUND',
          `Idioma con id ${updateDto.idiomaId} no encontrado`,
          { id: updateDto.idiomaId },
        ),
      );
    updateEntity.funcion = funcion;
    updateEntity.idioma = idioma;
    updateEntity.nombre = updateDto.nombre;
    updateEntity.descripcion = updateDto.descripcion;
    return updateEntity;
  }

  entityToDto(entity: FuncionTraduccionEntity): ReadFuncionTraduccionDto {
    return new ReadFuncionTraduccionDto(
      entity.toString(),
      entity.id,
      entity.funcion?.id,
      entity.idioma?.id,
      entity.nombre,
      entity.descripcion,
    );
  }
}
