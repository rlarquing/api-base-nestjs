import {Injectable} from '@nestjs/common';
import {FuncionMapper, MenuMapper} from '../mapper';
import {EndPointEntity, FuncionEntity, MenuEntity, RolEntity,} from '../../persistence/entity';
import {EndPointRepository, FuncionRepository, MenuRepository, RolRepository,} from '../../persistence/repository';
import {GenericService} from './generic.service';
import {LogHistoryService} from './log-history.service';
import {CreateFuncionDto, CreateMenuDto, ReadMenuDto} from '../../shared/dto';
import {ConfigService} from '@nestjs/config';
import {TipoMenuTypeEnum} from '../../shared/enum';
import {formatearNombre} from '../../../lib';

@Injectable()
export class MenuService extends GenericService<MenuEntity> {
    constructor(
        protected configService: ConfigService,
        protected menuRepository: MenuRepository,
        protected endPointRepository: EndPointRepository,
        protected funcionRepository: FuncionRepository,
        protected rolRepository: RolRepository,
        protected menuMapper: MenuMapper,
        protected funcionMapper: FuncionMapper,
        protected trazaService: LogHistoryService,
    ) {
        super(configService, menuRepository, menuMapper, trazaService, true);
    }

    async findByTipo(tipo: string): Promise<ReadMenuDto[]> {
        const menus: MenuEntity[] = await this.menuRepository.findBy(
            ['tipo'],
            [tipo],
        );
        const readMenusDto: ReadMenuDto[] = [];
        for (const menu of menus) {
            readMenusDto.push(await this.menuMapper.entityToDto(menu));
        }
        return readMenusDto;
    }

    async crearMenuNomenclador(nomencladores: string[]): Promise<void> {
        const newMenu: CreateMenuDto = {
            label: 'Nomencladores',
            icon: '',
            to: '/administration/nomenclators',
            menu: null,
            tipo: TipoMenuTypeEnum.ADMINISTRACION,
        };
        const menu: MenuEntity = await this.menuMapper.dtoToEntity(newMenu);
        const existeMenu: MenuEntity[] = await this.menuRepository.findBy(
            ['label'],
            [menu.label],
        );
        let menuPadre: MenuEntity = null;
        if (existeMenu.length > 0) {
            menuPadre = existeMenu[0];
        } else {
            menuPadre = await this.menuRepository.create(menu);
        }
        const endPoints: EndPointEntity[] =
            await this.endPointRepository.findByController('nomenclador');
        for (const element of nomencladores) {
            const existe: boolean = await this.menuRepository.existeNomenclador(
                element,
            );
            if (!existe) {
                const createMenuDto: CreateMenuDto = {
                    label: formatearNombre(element, ' '),
                    icon: 'menu',
                    to: `/administration/nomenclators/${formatearNombre(element, '/')}`,
                    menu: menuPadre.id,
                    tipo: TipoMenuTypeEnum.ADMINISTRACION,
                };
                const nomMenu: MenuEntity = await this.menuMapper.dtoToEntity(createMenuDto);
                nomMenu.nomemclador = element;
                const newMenu: MenuEntity = await this.menuRepository.create(nomMenu);
                const createFuncionDto: CreateFuncionDto = {
                    nombre: `Gestión del nomenclador ${formatearNombre(element, ' ')}`,
                    descripcion: `Gestión del nomenclador ${formatearNombre(
                        element,
                        ' ',
                    )}`,
                    endPoints: endPoints.map((item: EndPointEntity) => item.id),
                    menu: newMenu.id,
                };
                const funcion: FuncionEntity = await this.funcionMapper.dtoToEntity(createFuncionDto);
                const newFuncion: FuncionEntity = await this.funcionRepository.create(
                    funcion,
                );
                const rol: RolEntity = await this.rolRepository.findById(1);
                rol.funcions.push(newFuncion);
                await this.rolRepository.update(rol);
            }
        }
    }

    async crearMenuAdministracion(): Promise<void> {
        const controllers: string[] = [
            'user',
            'rol',
            'traza',
            'funcion',
            'menu'
        ];
        const menuAdministracion: CreateMenuDto = {
            label: 'Administración',
            icon: 'settings',
            to: '/administration',
            menu: null,
            tipo: TipoMenuTypeEnum.ADMINISTRACION
        };
        const menu: MenuEntity = await this.menuMapper.dtoToEntity(menuAdministracion);
        const existe = await this.menuRepository.findOneBy(
            ['label'],
            ['Administración'],
        );
        if (!existe) {
            const administracion = await this.menuRepository.create(menu);
            const hijos: CreateMenuDto[] = [
                {
                    label: 'Usuarios',
                    icon: 'menu',
                    to: '/administration/users',
                    menu: administracion.id,
                    tipo: TipoMenuTypeEnum.ADMINISTRACION
                },
                {
                    label: 'Roles',
                    icon: 'menu',
                    to: '/administration/rols',
                    menu: administracion.id,
                    tipo: TipoMenuTypeEnum.ADMINISTRACION
                },
                {
                    label: 'Trazas',
                    icon: 'menu',
                    to: '/administration/trazas',
                    menu: administracion.id,
                    tipo: TipoMenuTypeEnum.ADMINISTRACION
                },
                {
                    label: 'Funciones',
                    icon: 'menu',
                    to: '/administration/functions',
                    menu: administracion.id,
                    tipo: TipoMenuTypeEnum.ADMINISTRACION
                },
                {
                    label: 'Menus',
                    icon: 'menu',
                    to: '/administration/menus',
                    menu: administracion.id,
                    tipo: TipoMenuTypeEnum.ADMINISTRACION
                }
            ];
            let pos: number = 0;
            for (const hijo of hijos) {
                const menu = await this.menuRepository.create( await this.menuMapper.dtoToEntity(hijo));
                const endPoints: EndPointEntity[] =
                    await this.endPointRepository.findByController(controllers[pos]);
                const createFuncionDto: CreateFuncionDto = {
                    nombre: `Gestión de ${menu.label}`,
                    descripcion: `Gestión de ${menu.label}`,
                    endPoints: [],
                    menu: menu.id,
                };
                const funcion: FuncionEntity = await this.funcionMapper.dtoToEntity(createFuncionDto);
                funcion.endPoints=endPoints;
                const newFuncion: FuncionEntity = await this.funcionRepository.create(
                    funcion,
                );
                const rol: RolEntity = await this.rolRepository.findById(1);
                rol.funcions.push(newFuncion);
                await this.rolRepository.update(rol);
                pos = pos + 1;
            }

        } else {
            const hijos = existe.menus;
            let pos: number = 0;
            for (const menu of hijos) {
                const funcion = await this.funcionRepository.findByMenu(menu);
               const endPoints = await this.endPointRepository.findByController(controllers[pos]);

                funcion.endPoints=endPoints;
                await this.funcionRepository.update(
                    funcion,
                );
               pos = pos + 1;
            }
        }
    }
}
