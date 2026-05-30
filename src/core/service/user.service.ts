import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserMapper } from '../mapper';
import { LogHistoryService } from './log-history.service';
import { genSalt, hash } from 'bcryptjs';
import {
  FuncionRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import {
  BuscarDto,
  ChangePasswordDto,
  CreateUserDto,
  FiltroGenericoDto,
  LogHistoryDto,
  ReadUserDto,
  ResponseDto,
  SelectDto,
  UpdateUserDto,
} from '../../shared/dto';
import { FuncionEntity, RolEntity, UserEntity } from '../../persistence/entity';
import { eliminarDuplicado, removeFromArr } from '../../../lib';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { RolType } from '../../shared/enum';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app.keys';

@Injectable()
export class UserService {
  private readonly isProductionEnv: boolean;
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private rolRepository: RolRepository,
    private funcionRepository: FuncionRepository,
    private logHistoryService: LogHistoryService,
    private userMapper: UserMapper,
  ) {
    this.isProductionEnv =
      this.configService.get(AppConfig.NODE_ENV) === 'production';
  }

  /**
   * Crea el usuario administrador por defecto si no existe
   * Se llama al iniciar la aplicación en modo desarrollo
   */
  async crearUsuarioAdmin(): Promise<void> {
    const usuarioAdmin = 'admin';

    // Verificar si ya existe el usuario admin
    const existeAdmin = await this.userRepository.existe(usuarioAdmin);
    if (existeAdmin) {
      return;
    }

    // Obtener el rol ADMINISTRADOR
    const rolAdmin = await this.rolRepository.findByNombre(
      RolType.ADMINISTRADOR,
    );
    if (!rolAdmin) {
      throw new Error('El rol ADMINISTRADOR no existe');
    }

    // Obtener todas las funciones del rol admin
    const funciones: FuncionEntity[] = rolAdmin.funcions || [];

    // Crear el usuario admin
    const adminUser = new UserEntity(
      usuarioAdmin,
      'admin@sistema.cu',
      funciones,
    );
    adminUser.salt = await genSalt();
    adminUser.password = await UserService.hashPassword(
      'Admin1234*',
      adminUser.salt,
    );
    adminUser.roles = [rolAdmin];

    await this.userRepository.create(adminUser);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<ReadUserDto>> {
    const users: Pagination<UserEntity> =
      await this.userRepository.findAll(options);
    const readUserDto: ReadUserDto[] = [];
    for (const user of users.items) {
      readUserDto.push(await this.userMapper.entityToDto(user));
    }
    return new Pagination(readUserDto, users.meta, users.links);
  }

  async findById(id: number): Promise<ReadUserDto> {
    if (!id) {
      throw new BadRequestException('El id no puede ser vacio');
    }
    const user: UserEntity | null = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('El usuario no se encuentra.');
    }
    return await this.userMapper.entityToDto(user);
  }

  async findByName(userName: string): Promise<ReadUserDto> {
    if (!userName) {
      throw new BadRequestException('El userName no puede ser vacio');
    }
    const user: UserEntity | null =
      await this.userRepository.findByName(userName);
    if (!user) {
      throw new NotFoundException('El usuario no se encuentra.');
    }
    return await this.userMapper.entityToDto(user);
  }

  async create(
    user: UserEntity,
    createUserDto: CreateUserDto,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      const newUser = await this.userMapper.dtoToEntity(createUserDto);
      const { password, roles } = createUserDto;
      let { funcions } = createUserDto;
      newUser.salt = await genSalt();
      newUser.password = await UserService.hashPassword(
        password,
        newUser.salt ?? '',
      );
      newUser.roles = await this.rolRepository.findByIds(roles);
      if (funcions !== undefined) {
        let funcionsGrupo: FuncionEntity[] = [];
        newUser.roles.forEach((rol: RolEntity) => {
          if (rol.funcions) {
            funcionsGrupo.concat(rol.funcions);
          }
        });
        funcionsGrupo = eliminarDuplicado(funcionsGrupo);
        funcionsGrupo.forEach((funcion: FuncionEntity) => {
          if (funcions && funcions.includes(funcion.id)) {
            funcions = removeFromArr(funcions, funcion.id);
          }
        });
        newUser.funcions = await this.funcionRepository.findByIds(funcions);
      }
      let userEntity: UserEntity | undefined = undefined;
      const existe: UserEntity | null = await this.userRepository.existe(
        newUser.userName,
      );
      if (!existe) {
        userEntity = await this.userRepository.create(newUser);
      } else {
        newUser.id = existe.id;
        newUser.activo = true;
        await this.userRepository.update(newUser);
        userEntity = newUser;
      }

      // Para el log, creamos una copia sin datos sensibles
      const logUser = { ...userEntity } as Partial<UserEntity>;
      delete logUser.salt;
      delete logUser.password;
      const esquema: string = this.userRepository.getSchema();
      const tabla: string = this.userRepository.getTabla();
      if (this.isProductionEnv) {
        const logHistoryDto: LogHistoryDto = new LogHistoryDto(
          null,
          user.userName,
          new Date(),
          tabla,
          esquema,
          HISTORY_ACTION.ADD,
          logUser,
          null,
          userEntity.id,
          ip,
        );
        await this.logHistoryService.create(logHistoryDto);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async update(
    user: UserEntity,
    id: number,
    updateUserDto: UpdateUserDto,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    let foundUser: UserEntity | null = await this.userRepository.findById(id);
    if (!foundUser) {
      throw new NotFoundException('No existe el user');
    }
    try {
      const updateUser: UserEntity = this.userMapper.dtoToUpdateEntity(
        updateUserDto,
        foundUser,
      );
      const { roles } = updateUserDto;
      let { funcions } = updateUserDto;
      updateUser.roles = await this.rolRepository.findByIds(roles);
      if (funcions !== undefined) {
        let funcionsGrupo: FuncionEntity[] = [];
        updateUser.roles.forEach((rol: RolEntity) => {
          if (rol.funcions) {
            funcionsGrupo.concat(rol.funcions);
          }
        });
        funcionsGrupo = eliminarDuplicado(funcionsGrupo);
        funcionsGrupo.forEach((funcion: FuncionEntity) => {
          if (funcions && funcions.includes(funcion.id)) {
            funcions = removeFromArr(funcions, funcion.id);
          }
        });
        updateUser.funcions = await this.funcionRepository.findByIds(funcions);
      }
      await this.userRepository.update(updateUser);

      // Para el log, creamos una copia sin datos sensibles
      const logUser = { ...updateUser } as Partial<UserEntity>;
      delete logUser.salt;
      delete logUser.password;
      const logFoundUser = { ...foundUser } as Partial<UserEntity>;
      delete logUser.salt;
      delete logUser.password;
      const esquema: string = this.userRepository.getSchema();
      const tabla: string = this.userRepository.getTabla();
      if (this.isProductionEnv) {
        const logHistoryDto: LogHistoryDto = new LogHistoryDto(
          null,
          user.userName,
          new Date(),
          tabla,
          esquema,
          HISTORY_ACTION.MOD,
          logUser,
          logFoundUser,
          updateUser.id,
          ip,
        );
        await this.logHistoryService.create(logHistoryDto);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async delete(
    user: UserEntity,
    id: number,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    if (user.id === id) {
      result.message = 'Usuario autenticado no se puede eliminar.';
      result.successStatus = false;
      return result;
    }
    const userEntity: UserEntity | null =
      await this.userRepository.findById(id);
    let deleteEntity: UserEntity = (await this.userRepository.findById(
      id,
    )) as UserEntity;
    deleteEntity.activo = false;
    if (userEntity) {
      // Para el log, creamos una copia sin datos sensibles
      const logUser = { ...userEntity } as Partial<UserEntity>;
      delete logUser.salt;
      delete logUser.password;
      const logDeleteEntity = { ...deleteEntity } as Partial<UserEntity>;
      delete logDeleteEntity.salt;
      delete logDeleteEntity.password;
      if (this.isProductionEnv) {
        const esquema = this.userRepository.getSchema();
        const tabla: string = this.userRepository.getTabla();
        const logHistoryDto: LogHistoryDto = new LogHistoryDto(
          null,
          user.userName,
          new Date(),
          tabla,
          esquema,
          HISTORY_ACTION.DEL,
          logDeleteEntity,
          logUser,
          userEntity.id,
          ip,
        );
        await this.logHistoryService.create(logHistoryDto);
      }
    }
    return await this.userRepository.delete(id);
  }

  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return hash(password, salt);
  }

  async deleteMultiple(
    user: UserEntity,
    ids: number[],
    ip: string,
  ): Promise<ResponseDto> {
    let result = new ResponseDto();
    try {
      for (const id of ids) {
        result = await this.delete(user, id, ip);
      }
    } catch (error: unknown) {
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).detail ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async filter(
    options: IPaginationOptions,
    filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Pagination<ReadUserDto>> {
    const items: Pagination<UserEntity> = await this.userRepository.filter(
      options,
      filtroGenericoDto.clave,
      filtroGenericoDto.valor,
    );
    const readDto: any[] = [];
    for (const item of items.items) {
      readDto.push(await this.userMapper.entityToDto(item));
    }
    return new Pagination(readDto, items.meta, items.links);
  }

  async search(
    options: IPaginationOptions,
    buscarDto: BuscarDto,
  ): Promise<Pagination<ReadUserDto>> {
    const items: Pagination<UserEntity> = await this.userRepository.search(
      options,
      buscarDto.search,
    );
    const readDto: any[] = [];
    for (const item of items.items) {
      const user = await this.userRepository.findById(item.id);
      if (user) {
        readDto.push(await this.userMapper.entityToDto(user));
      }
    }
    return new Pagination(readDto, items.meta, items.links);
  }

  async changePassword(
    user: UserEntity,
    id: number,
    changePasswordDto: ChangePasswordDto,
    ip: string,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const updateUser: UserEntity = (await this.userRepository.findById(
      id,
    )) as UserEntity;
    const foundUser: UserEntity | null = await this.userRepository.findById(id);
    if (!foundUser) {
      throw new NotFoundException('No existe el user');
    }
    try {
      const { password } = changePasswordDto;
      updateUser.password = await UserService.hashPassword(
        password,
        updateUser.salt ?? '',
      );
      await this.userRepository.update(updateUser);

      // Para el log, creamos una copia sin datos sensibles
      const logUser = { ...foundUser } as Partial<UserEntity>;
      delete logUser.salt;
      delete logUser.password;
      const logUpdateUser = { ...updateUser } as Partial<UserEntity>;
      delete logUpdateUser.salt;
      delete logUpdateUser.password;
      const esquema: string = this.userRepository.getSchema();
      const tabla: string = this.userRepository.getTabla();
      if (this.isProductionEnv) {
        const logHistoryDto: LogHistoryDto = new LogHistoryDto(
          null,
          user.userName,
          new Date(),
          tabla,
          esquema,
          HISTORY_ACTION.MOD,
          logUpdateUser,
          logUser,
          foundUser.id,
          ip,
        );
        await this.logHistoryService.create(logHistoryDto);
      }
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      // TypeScript 6: manejar error de tipo unknown
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
      return result;
    }
    return result;
  }

  async createSelect(): Promise<SelectDto[]> {
    const items: any[] = await this.userRepository.createSelect();
    const selectDto: SelectDto[] = [];
    for (const item of items) {
      selectDto.push(new SelectDto(item.id, item.toString()));
    }
    return selectDto;
  }
}
