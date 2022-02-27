import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  HISTORY_ACTION,
  PermisoEntity,
  RolEntity,
  UserEntity,
} from '../entity';
import {
  PermisoRepository,
  RolRepository,
  UserRepository,
} from '../repository';
import {
  ChangePasswordDto,
  CreateUserDto,
  ReadUserDto,
  UpdateUserDto,
} from '../dto';
import { UserMapper } from '../mapper';
import { TrazaService } from './traza.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { genSalt, hash } from 'bcryptjs';
import { BuscarDto, FiltroGenericoDto, ResponseDto } from '../../shared/dto';
import { eliminarDuplicado, removeFromArr } from '../../../lib/util';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private rolRepository: RolRepository,
    private permisoRepository: PermisoRepository,
    private trazaService: TrazaService,
    private userMapper: UserMapper,
  ) {}
  async findAll(options: IPaginationOptions): Promise<Pagination<ReadUserDto>> {
    const users: Pagination<UserEntity> = await this.userRepository.findAll(
      options,
    );
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
    const user: UserEntity = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('El usuario no se encuentra.');
    }
    return await this.userMapper.entityToDto(user);
  }
  async findByName(username: string): Promise<ReadUserDto> {
    if (!username) {
      throw new BadRequestException('El username no puede ser vacio');
    }
    const user: UserEntity = await this.userRepository.findByName(username);
    if (!user) {
      throw new NotFoundException('El usuario no se encuentra.');
    }
    return await this.userMapper.entityToDto(user);
  }
  async create(
    user: UserEntity,
    createUserDto: CreateUserDto,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      const newUser = this.userMapper.dtoToEntity(createUserDto);
      const { password, roles } = createUserDto;
      let { permisos } = createUserDto;
      newUser.salt = await genSalt();
      newUser.password = await UserService.hashPassword(password, newUser.salt);
      newUser.roles = await this.rolRepository.findByIds(roles);
      if (permisos !== undefined) {
        let permisosGrupo: PermisoEntity[] = [];
        newUser.roles.forEach((rol: RolEntity) => {
          permisosGrupo.concat(rol.permisos);
        });
        permisosGrupo = eliminarDuplicado(permisosGrupo);
        permisosGrupo.forEach((permiso: PermisoEntity) =>
          permisos.includes(permiso.id)
            ? (permisos = removeFromArr(permisos, permiso.id))
            : false,
        );
        newUser.permisos = await this.permisoRepository.findByIds(permisos);
      }
      const userEntity: UserEntity = await this.userRepository.create(newUser);
      delete userEntity.salt;
      delete userEntity.password;
      await this.trazaService.create(user, userEntity, HISTORY_ACTION.ADD);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }
  async update(
    user: UserEntity,
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    let foundUser: UserEntity = await this.userRepository.findById(id);
    if (!foundUser) {
      throw new NotFoundException('No existe el user');
    }
    try {
      foundUser = this.userMapper.dtoToUpdateEntity(updateUserDto, foundUser);
      const { roles } = updateUserDto;
      let { permisos } = updateUserDto;
      foundUser.roles = await this.rolRepository.findByIds(roles);
      if (permisos !== undefined) {
        let permisosGrupo: PermisoEntity[] = [];
        foundUser.roles.forEach((rol: RolEntity) => {
          permisosGrupo.concat(rol.permisos);
        });
        permisosGrupo = eliminarDuplicado(permisosGrupo);
        permisosGrupo.forEach((permiso: PermisoEntity) =>
          permisos.includes(permiso.id)
            ? (permisos = removeFromArr(permisos, permiso.id))
            : false,
        );
        foundUser.permisos = await this.permisoRepository.findByIds(permisos);
      }
      await this.userRepository.update(foundUser);
      delete foundUser.salt;
      delete foundUser.password;
      await this.trazaService.create(user, foundUser, HISTORY_ACTION.MOD);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }
  async delete(user: UserEntity, id: number): Promise<ResponseDto> {
    const result = new ResponseDto();
    if (user.id === id) {
      result.message = 'Usuario autenticado no se puede eliminar.';
      result.successStatus = false;
      return result;
    }
    const userEntity: UserEntity = await this.userRepository.findById(id);
    delete userEntity.salt;
    delete userEntity.password;
    await this.trazaService.create(user, userEntity, HISTORY_ACTION.DEL);
    return await this.userRepository.delete(id);
  }
  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return hash(password, salt);
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
      readDto.push(await this.userMapper.entityToDto(item));
    }
    return new Pagination(readDto, items.meta, items.links);
  }

  async changePassword(
    user: UserEntity,
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto> {
    const result = new ResponseDto();
    const foundUser: UserEntity = await this.userRepository.findById(id);
    if (!foundUser) {
      throw new NotFoundException('No existe el user');
    }
    try {
      const { password } = changePasswordDto;
      foundUser.password = await UserService.hashPassword(
        password,
        foundUser.salt,
      );
      await this.userRepository.update(foundUser);
      delete foundUser.salt;
      delete foundUser.password;
      await this.trazaService.create(user, foundUser, HISTORY_ACTION.MOD);
      result.successStatus = true;
      result.message = 'success';
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
      return result;
    }
    return result;
  }
}
