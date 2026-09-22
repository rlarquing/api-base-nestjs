import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FuncionTraduccionMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { FuncionTraduccionEntity, UserEntity } from '../../persistence/entity';
import { FuncionTraduccionRepository } from '../../persistence/repository';
import {
  CreateFuncionTraduccionDto,
  ReadFuncionDto,
  ResponseDto,
  UpdateFuncionTraduccionDto,
} from '../../shared/dto';
import { ConfigService } from '@nestjs/config';
import { traducir } from '../../shared/util/i18n.util';

@Injectable()
export class FuncionTraduccionService extends GenericService<FuncionTraduccionEntity> {
  constructor(
    protected configService: ConfigService,
    protected funcionTraduccionRepository: FuncionTraduccionRepository,
    protected funcionTraduccionMapper: FuncionTraduccionMapper,
    protected logHistoryService: LogHistoryService,
  ) {
    super(
      configService,
      funcionTraduccionRepository,
      funcionTraduccionMapper,
      logHistoryService,
      true,
    );
  }

  /**
   * Reemplaza nombre y descripcion de las funciones por su traduccion en el idioma
   * indicado. Una funcion sin traduccion conserva sus textos base.
   * Muta los DTO recibidos: se construyen por peticion, no se comparten.
   */
  async traducirFunciones(
    funciones: ReadFuncionDto[],
    codigo?: string,
  ): Promise<ReadFuncionDto[]> {
    if (!codigo || funciones.length === 0) {
      return funciones;
    }
    const textos =
      await this.funcionTraduccionRepository.findTextosByIdioma(codigo);
    if (textos.size === 0) {
      return funciones;
    }
    for (const funcion of funciones) {
      const texto = textos.get(Number(funcion.id));
      if (!texto) {
        continue;
      }
      funcion.nombre = texto.nombre;
      funcion.dtoToString = texto.nombre;
      if (texto.descripcion !== undefined && texto.descripcion !== null) {
        funcion.descripcion = texto.descripcion;
      }
    }
    return funciones;
  }

  override async create(
    user: UserEntity,
    createDto: CreateFuncionTraduccionDto,
    ip: string,
  ): Promise<ResponseDto> {
    await this.assertReferencias(createDto.funcionId, createDto.idiomaId);
    await this.assertUnique(createDto.funcionId, createDto.idiomaId);
    return await super.create(user, createDto, ip);
  }

  override async update(
    user: UserEntity,
    id: number,
    updateDto: UpdateFuncionTraduccionDto,
    ip: string,
  ): Promise<ResponseDto> {
    // La inexistencia del elemento es 404 y tiene prioridad sobre el 409 de unicidad.
    await this.funcionTraduccionRepository.findById(id);
    await this.assertUnique(updateDto.funcionId, updateDto.idiomaId, id);
    return await super.update(user, id, updateDto, ip);
  }

  /**
   * GenericService.create resuelve el mapper dentro de su try/catch, por lo que un
   * NotFoundException de FK se degradaria a 201 con successStatus false. Se valida antes.
   * ponytail: duplica dos lookups por PK contra los del mapper; unificar solo si el
   * volumen de creacion lo justifica.
   */
  private async assertReferencias(
    funcionId: number,
    idiomaId: number,
  ): Promise<void> {
    if (!(await this.funcionTraduccionRepository.findFuncionById(funcionId))) {
      throw new NotFoundException(
        traducir(
          'traduccion.FUNCION_NOT_FOUND',
          `Funcion con id ${funcionId} no encontrada`,
          { id: funcionId },
        ),
      );
    }
    if (!(await this.funcionTraduccionRepository.findIdiomaById(idiomaId))) {
      throw new NotFoundException(
        traducir(
          'traduccion.IDIOMA_NOT_FOUND',
          `Idioma con id ${idiomaId} no encontrado`,
          { id: idiomaId },
        ),
      );
    }
  }

  private async assertUnique(
    funcionId: number,
    idiomaId: number,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.funcionTraduccionRepository.findByFuncionIdioma(
      funcionId,
      idiomaId,
    );
    if (existing && Number(existing.id) !== Number(excludeId)) {
      throw new ConflictException(
        traducir(
          'traduccion.FUNCION_TRANSLATION_EXISTS',
          `Ya existe una traduccion para la funcion ${funcionId} en el idioma ${idiomaId}`,
          { funcionId, idiomaId },
        ),
      );
    }
  }
}
