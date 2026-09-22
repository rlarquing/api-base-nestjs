import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MenuTraduccionMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import { MenuTraduccionEntity, UserEntity } from '../../persistence/entity';
import { MenuTraduccionRepository } from '../../persistence/repository';
import {
  CreateMenuTraduccionDto,
  ReadMenuDto,
  ResponseDto,
  UpdateMenuTraduccionDto,
} from '../../shared/dto';
import { ConfigService } from '@nestjs/config';
import { traducir } from '../../shared/util/i18n.util';

@Injectable()
export class MenuTraduccionService extends GenericService<MenuTraduccionEntity> {
  constructor(
    protected configService: ConfigService,
    protected menuTraduccionRepository: MenuTraduccionRepository,
    protected menuTraduccionMapper: MenuTraduccionMapper,
    protected logHistoryService: LogHistoryService,
  ) {
    super(
      configService,
      menuTraduccionRepository,
      menuTraduccionMapper,
      logHistoryService,
      true,
    );
  }

  /**
   * Reemplaza los labels del arbol de menus por su traduccion en el idioma indicado.
   * Un menu sin traduccion conserva su label base, por lo que el menu nunca queda vacio.
   * Muta los DTO recibidos: se construyen por peticion, no se comparten.
   */
  async traducirMenus(
    menus: ReadMenuDto[],
    codigo?: string,
  ): Promise<ReadMenuDto[]> {
    if (!codigo || menus.length === 0) {
      return menus;
    }
    const labels =
      await this.menuTraduccionRepository.findLabelsByIdioma(codigo);
    if (labels.size > 0) {
      this.aplicarLabels(menus, labels);
    }
    return menus;
  }

  private aplicarLabels(
    menus: ReadMenuDto[],
    labels: Map<number, string>,
  ): void {
    for (const menu of menus) {
      const label = labels.get(Number(menu.id));
      if (label) {
        menu.label = label;
        menu.dtoToString = label;
      }
      if (menu.padre) {
        const labelPadre = labels.get(Number(menu.padre.value));
        if (labelPadre) {
          menu.padre.label = labelPadre;
          menu.menuPadre = labelPadre;
        }
      }
      if (menu.menus && menu.menus.length > 0) {
        this.aplicarLabels(menu.menus, labels);
      }
    }
  }

  override async create(
    user: UserEntity,
    createDto: CreateMenuTraduccionDto,
    ip: string,
  ): Promise<ResponseDto> {
    await this.assertReferencias(createDto.menuId, createDto.idiomaId);
    await this.assertUnique(createDto.menuId, createDto.idiomaId);
    return await super.create(user, createDto, ip);
  }

  override async update(
    user: UserEntity,
    id: number,
    updateDto: UpdateMenuTraduccionDto,
    ip: string,
  ): Promise<ResponseDto> {
    // La inexistencia del elemento es 404 y tiene prioridad sobre el 409 de unicidad.
    await this.menuTraduccionRepository.findById(id);
    await this.assertUnique(updateDto.menuId, updateDto.idiomaId, id);
    return await super.update(user, id, updateDto, ip);
  }

  /**
   * GenericService.create resuelve el mapper dentro de su try/catch, por lo que un
   * NotFoundException de FK se degradaria a 201 con successStatus false. Se valida antes.
   * ponytail: duplica dos lookups por PK contra los del mapper; unificar solo si el
   * volumen de creacion lo justifica.
   */
  private async assertReferencias(
    menuId: number,
    idiomaId: number,
  ): Promise<void> {
    if (!(await this.menuTraduccionRepository.findMenuById(menuId))) {
      throw new NotFoundException(
        traducir(
          'traduccion.MENU_NOT_FOUND',
          `Menu con id ${menuId} no encontrado`,
          {
            id: menuId,
          },
        ),
      );
    }
    if (!(await this.menuTraduccionRepository.findIdiomaById(idiomaId))) {
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
    menuId: number,
    idiomaId: number,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.menuTraduccionRepository.findByMenuIdioma(
      menuId,
      idiomaId,
    );
    if (existing && Number(existing.id) !== Number(excludeId)) {
      throw new ConflictException(
        traducir(
          'traduccion.MENU_TRANSLATION_EXISTS',
          `Ya existe una traduccion para el menu ${menuId} en el idioma ${idiomaId}`,
          { menuId, idiomaId },
        ),
      );
    }
  }
}
