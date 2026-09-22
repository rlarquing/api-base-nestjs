import { Injectable } from '@nestjs/common';
import { IdiomaMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { GenericService } from './generic.service';
import {
  FuncionEntity,
  FuncionTraduccionEntity,
  IdiomaEntity,
  MenuEntity,
  MenuTraduccionEntity,
  UserEntity,
} from '../../persistence/entity';
import {
  FuncionRepository,
  FuncionTraduccionRepository,
  IdiomaRepository,
  MenuRepository,
  MenuTraduccionRepository,
} from '../../persistence/repository';
import {
  CreateIdiomaDto,
  ResponseDto,
  UpdateIdiomaDto,
} from '../../shared/dto';
import { ConfigService } from '@nestjs/config';

/**
 * Traducciones base al ingles para los menus sembrados en el arranque.
 * Clave = label base en espanol. Los menus no listados conservan su label base.
 */
const TRADUCCIONES_MENU_EN: Record<string, string> = {
  Nomencladores: 'Nomenclators',
  'Tipo de operaciones': 'Operation types',
  'Tipo de cargas': 'Cargo types',
  'naturaleza carga': 'Cargo nature',
  'Unidades de medidas': 'Measurement units',
  'Tipo de navegaciones': 'Navigation types',
  'Roles comerciales': 'Commercial roles',
  Administración: 'Administration',
  Usuarios: 'Users',
  Roles: 'Roles',
  Trazas: 'Traces',
  Funciones: 'Functions',
  Menus: 'Menus',
  Buques: 'Vessels',
  Gestión: 'Management',
  Puertos: 'Ports',
  Muelles: 'Docks',
  Armadores: 'Shipowners',
  'Lines Ups': 'Line Ups',
  Productos: 'Products',
  Estados: 'Statuses',
  Ciudades: 'Cities',
  'Compañias portuarias': 'Port companies',
  Zonas: 'Zones',
  Terminales: 'Terminals',
  'Agentes navieros': 'Shipping agents',
  Fondeos: 'Anchorages',
  Reportes: 'Reports',
  'Line Up': 'Line Up',
  Notificaciones: 'Notifications',
  'Tipos de buques': 'Vessel types',
  Paises: 'Countries',
  'Estadisticas Line Up': 'Line Up statistics',
  'Agentes embarcadores': 'Shippers',
  'Funciones traducción': 'Function translations',
  'Menus traducción': 'Menu translations',
  Idiomas: 'Languages',
};

/**
 * Traducciones base al ingles para las funciones sembradas en el arranque.
 * Clave = nombre base en espanol. La descripcion en ingles se asume igual al nombre,
 * coincidiendo con la traduccion generada en la base de datos.
 */
const TRADUCCIONES_FUNCION_EN: Record<string, string> = {
  'Gestión del nomenclador tipo operacion':
    'Operation type nomenclature management',
  'Gestión del nomenclador tipo carga': 'Cargo type nomenclature management',
  'Gestión del nomenclador naturaleza carga':
    'Cargo nature nomenclature management',
  'Gestión del nomenclador unidad medida':
    'Measurement unit nomenclature management',
  'Gestión del nomenclador tipo navegacion':
    'Navigation type nomenclature management',
  'Gestión del nomenclador rol comercial':
    'Commercial role nomenclature management',
  'Gestión de usuarios': 'User management',
  'Gestión de roles': 'Role management',
  'Gestión de trazas': 'Trace management',
  'Gestión de funciones': 'Function management',
  'Gestión de menus': 'Menu management',
  'Gestión de puertos': 'Port management',
  'Gestión de muelles': 'Dock management',
  'Gestión de buques': 'Vessel management',
  'Gestión de armadores': 'Shipowner management',
  'Gestión de operaciones portuarias': 'Port operations management',
  'Gestión de productos': 'Product management',
  'Gestión de los estados': 'Status management',
  'Gestión de las ciudades': 'City management',
  'Gestión del nomenclador compannia portuaria':
    'Port company nomenclature management',
  'Gestión del nomenclador zona': 'Zone nomenclature management',
  'Gestión de las terminales': 'Terminal management',
  'Gestión del nomenclador agente naviero':
    'Shipping agent nomenclature management',
  'Gestión de los fondeos': 'Anchorage management',
  'Reporte Line UP': 'Line Up report',
  'Gestión de notificaciones': 'Notification management',
  'Gestión del nomenclador tipo buque':
    'Vessel type nomenclature management',
  'Gestión del nomenclador pais': 'Country nomenclature management',
  'Reporte Estadistica Line UP': 'Line Up statistics report',
  'Gestión del nomenclador agente embarcador':
    'Shipper nomenclature management',
};

@Injectable()
export class IdiomaService extends GenericService<IdiomaEntity> {
  constructor(
    protected configService: ConfigService,
    protected idiomaRepository: IdiomaRepository,
    protected idiomaMapper: IdiomaMapper,
    protected logHistoryService: LogHistoryService,
    private readonly menuRepository: MenuRepository,
    private readonly funcionRepository: FuncionRepository,
    private readonly menuTraduccionRepository: MenuTraduccionRepository,
    private readonly funcionTraduccionRepository: FuncionTraduccionRepository,
  ) {
    super(
      configService,
      idiomaRepository,
      idiomaMapper,
      logHistoryService,
      true,
    );
  }

  /**
   * Solo un idioma puede quedar marcado como idioma por defecto.
   * ponytail: el reset no comparte transaccion con el save; envolver ambos en un
   * QueryRunner si en algun momento hace falta atomicidad estricta.
   */
  override async create(
    user: UserEntity,
    createDto: CreateIdiomaDto,
    ip: string,
  ): Promise<ResponseDto> {
    const result = await super.create(user, createDto, ip);
    if (result.successStatus && createDto.defecto === true && result.id) {
      await this.idiomaRepository.desmarcarDefectoExcepto(result.id);
    }
    return result;
  }

  override async update(
    user: UserEntity,
    id: number,
    updateDto: UpdateIdiomaDto,
    ip: string,
  ): Promise<ResponseDto> {
    const result = await super.update(user, id, updateDto, ip);
    if (result.successStatus && updateDto.defecto === true) {
      await this.idiomaRepository.desmarcarDefectoExcepto(id);
    }
    return result;
  }

  /**
   * Siembra los idiomas base (es, en) si no existen y, para el idioma espanol,
   * crea las traducciones de menus y funciones activos que falten.
   * Idempotente: evita duplicados por la unicidad (menu_id, idioma_id).
   */
  async crearIdiomasIniciales(): Promise<void> {
    let espanol = await this.idiomaRepository.findOneBy(['codigo'], ['es']);
    let ingles = await this.idiomaRepository.findOneBy(['codigo'], ['en']);

    if (!espanol) {
      espanol = await this.idiomaRepository.create(
        new IdiomaEntity('es', 'Español', true),
      );
    } else {
      // El espanol marcado como defecto queda consistente con la regla de un solo defecto.
      await this.idiomaRepository.desmarcarDefectoExcepto(espanol.id);
    }
    if (!ingles) {
      ingles = await this.idiomaRepository.create(
        new IdiomaEntity('en', 'Inglés', false),
      );
    }

    await this.crearTraduccionesEspanol(espanol);
    await this.crearTraduccionesIngles(ingles);
  }

  /**
   * Copia los textos base de menus y funciones al idioma espanol como su propia
   * traduccion, solo para los registros que aun no tienen traduccion.
   * ponytail: no comparte transaccion con el resto del seed; envolver con un
   * QueryRunner si la atomicidad llega a importar.
   */
  private async crearTraduccionesEspanol(espanol: IdiomaEntity): Promise<void> {
    const menus: MenuEntity[] = await this.menuRepository.createSelect();
    for (const menu of menus) {
      const existe = await this.menuTraduccionRepository.findByMenuIdioma(
        menu.id,
        espanol.id,
      );
      if (!existe) {
        await this.menuTraduccionRepository.create(
          new MenuTraduccionEntity(
            { id: menu.id } as MenuEntity,
            { id: espanol.id } as IdiomaEntity,
            menu.label,
          ),
        );
      }
    }

    const funciones: FuncionEntity[] = await this.funcionRepository.createSelect();
    for (const funcion of funciones) {
      const existe = await this.funcionTraduccionRepository.findByFuncionIdioma(
        funcion.id,
        espanol.id,
      );
      if (!existe) {
        await this.funcionTraduccionRepository.create(
          new FuncionTraduccionEntity(
            { id: funcion.id } as FuncionEntity,
            { id: espanol.id } as IdiomaEntity,
            funcion.nombre,
            funcion.descripcion,
          ),
        );
      }
    }
  }

  /**
   * Siembra las traducciones al ingles de los menus y funciones basicos,
   * tomadas del mapa base-espanol -> ingles. Solo para los que no tengan
   * traduccion ya. Los menus/funciones que no esten en el mapa quedan solo en
   * su idioma base (es).
   */
  private async crearTraduccionesIngles(ingles: IdiomaEntity): Promise<void> {
    const menus: MenuEntity[] = await this.menuRepository.createSelect();
    for (const menu of menus) {
      const labelEn = TRADUCCIONES_MENU_EN[menu.label];
      if (!labelEn) {
        continue;
      }
      const existe = await this.menuTraduccionRepository.findByMenuIdioma(
        menu.id,
        ingles.id,
      );
      if (!existe) {
        await this.menuTraduccionRepository.create(
          new MenuTraduccionEntity(
            { id: menu.id } as MenuEntity,
            { id: ingles.id } as IdiomaEntity,
            labelEn,
          ),
        );
      }
    }

    const funciones: FuncionEntity[] = await this.funcionRepository.createSelect();
    for (const funcion of funciones) {
      const nombreEn = TRADUCCIONES_FUNCION_EN[funcion.nombre];
      if (!nombreEn) {
        continue;
      }
      const existe = await this.funcionTraduccionRepository.findByFuncionIdioma(
        funcion.id,
        ingles.id,
      );
      if (!existe) {
        await this.funcionTraduccionRepository.create(
          new FuncionTraduccionEntity(
            { id: funcion.id } as FuncionEntity,
            { id: ingles.id } as IdiomaEntity,
            nombreEn,
            nombreEn,
          ),
        );
      }
    }
  }
}
