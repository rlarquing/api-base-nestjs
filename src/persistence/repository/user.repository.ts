import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RolEntity, UserEntity } from '../entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  In,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import dayjs from 'dayjs';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import { RolType } from '../../shared/enum';
import { ResponseDto } from '../../shared/dto';
import { IPaginationOptions, paginate, Pagination } from '../../shared/pagination';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity)
    private rolRepository: Repository<RolEntity>,
  ) {}

  /**
   * Obtiene el nombre del schema de la entidad desde metadata de TypeORM
   */
  getSchema(): string {
    return this.userRepository.metadata?.schema || 'public';
  }

  /**
   * Obtiene el nombre de la tabla de la entidad
   */
  getTabla(): string {
    return this.userRepository.metadata?.name || '';
  }

  async signUp(userEntity: UserEntity): Promise<UserEntity> {
    const wheres = {
      activo: true,
      nombre: RolType.USUARIO,
    } as FindOptionsWhere<RolEntity>;
    const rol: RolEntity | null = await this.rolRepository.findOneBy(wheres);

    if (!rol) {
      throw new NotFoundException('No existe el rol');
    }
    userEntity.roles = [rol];
    try {
      return await this.userRepository.save(userEntity);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException(
          'El nombre del usuario ya existe en el sistema.',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    // Ejemplo funcional de como trabajar con queryBuilder
    // const queryBuilder = this.userRepository.createQueryBuilder('u');
    // queryBuilder.leftJoinAndSelect('u.roles', 'roles')
    // queryBuilder.where('u.status = :status', { activo: true });
    // return await paginate<UserEntity>(queryBuilder, options);
    const where = {
      where: { activo: true },
      relations: ['roles', 'funcions'],
    } as unknown as FindManyOptions<UserEntity>;
    return await paginate<UserEntity>(this.userRepository, options, where);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const options = {
      where: { id: id, activo: true },
      relations: ['roles', 'funcions'],
    } as unknown as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }

  async findByIds(ids: number[]): Promise<UserEntity[]> {
    const options = {
      where: { id: In(ids), activo: true },
      relations: {
        roles: true,
        funcions: true,
      },
    } as unknown as FindManyOptions<UserEntity>;
    return await this.userRepository.find(options);
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(userEntity);
  }

  async update(updatedUser: UserEntity): Promise<ResponseDto> {
    const result = new ResponseDto();
    try {
      await this.userRepository.save(updatedUser);
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
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

  async delete(id: number): Promise<ResponseDto> {
    const result = new ResponseDto();
    const options = { id, activo: true } as FindOptionsWhere<UserEntity>;
    const user = await this.userRepository.findOneBy(options);
    if (!user) {
      throw new NotFoundException('No existe el usuario');
    }
    user.activo = false;
    try {
      await this.userRepository.save(user);
      result.successStatus = true;
      result.message = 'success';
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.message = (error as any).response ?? error.message;
      } else {
        result.message = String(error);
      }
      result.successStatus = false;
    }
    return result;
  }

  async validateUserPassword(
    userName: string,
    password: string,
  ): Promise<string | null> {
    const options = { userName } as FindOptionsWhere<UserEntity>;
    const user = await this.userRepository.findOneBy(options);
    if (user && (await user.validatePassword(password))) {
      return user.userName;
    } else {
      return null;
    }
  }

  async findByName(userName: string): Promise<UserEntity | null> {
    const options = {
      where: { activo: true, userName: userName },
      relations: { roles: true, funcions: true },
    } as unknown as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }

  public async validateRefreshToken(
    userName: string,
    refreshToken: string,
  ): Promise<UserEntity | null> {
    const currentDate = dayjs().format('YYYY/MM/DD');
    const options = {
      activo: true,
      userName: userName,
      refreshToken: refreshToken,
      refreshTokenExp: MoreThanOrEqual(currentDate),
    } as FindOptionsWhere<UserEntity>;
    const user = await this.userRepository.findOneBy(options);
    if (!user) {
      return null;
    }
    return user;
  }

  async filter(
    options: IPaginationOptions,
    claves: string[],
    valores: any[],
  ): Promise<Pagination<UserEntity>> {
    const wheres: any = { activo: true };
    for (let i = 0; i < claves.length; i++) {
      if (isNumber(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else if (isDate(valores[i])) {
        const datep = valores[i];
        const start = new Date(datep.setHours(0, 0, 0, 0));
        const end = new Date(datep.setHours(23, 59, 59, 999));
        const date = { date: Between(start.toISOString(), end.toISOString()) };
        wheres[claves[i]] = date;
      } else if (isBoolean(valores[i])) {
        wheres[claves[i]] = valores[i];
      } else {
        wheres[claves[i]] = ILike(`%${valores[i]}%`);
      }
    }
    const where = {
      where: wheres,
      relations: ['roles', 'funcions'],
    } as unknown as FindManyOptions<UserEntity>;
    return await paginate<UserEntity>(this.userRepository, options, where);
  }

  async search(
    options: IPaginationOptions,
    search: any,
  ): Promise<Pagination<UserEntity>> {
    if (!isEmpty(search)) {
      const where = { activo: true } as unknown as FindManyOptions<UserEntity>;
      const result = await this.userRepository.find(where);
      const objs = new Map<string, string>();
      let keys: string[] = [];
      if (result.length > 0) {
        keys = Object.keys(result[0]);
      }
      for (const key of keys) {
        for (const item of result as any[]) {
          if (
            isString((item as any)[key]) &&
            isString(search) &&
            (item as any)[key].toLowerCase().indexOf(search.toLowerCase()) !==
              -1
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} ILIKE '%${search}%'`);
            }
          } else if (
            isNumber((item as any)[key]) &&
            isNumber(search) &&
            (item as any)[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} = :search`);
            }
          } else if (
            isDate((item as any)[key]) &&
            isDate(search) &&
            (item as any)[key] === search
          ) {
            const datep = (item as any)[key];
            const start = new Date(datep.setHours(0, 0, 0, 0));
            const end = new Date(datep.setHours(23, 59, 59, 999));
            const date = {
              date: Between(start.toISOString(), end.toISOString()),
            };
            if (!objs.has(key)) {
              objs.set(key, `${key}=${date}`);
            }
          } else if (
            isBoolean((item as any)[key]) &&
            isBoolean(search) &&
            (item as any)[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key}= :search`);
            }
          }
        }
      }
      const queryBuilder = this.userRepository.createQueryBuilder('u');
      queryBuilder.leftJoinAndSelect('u.roles', 'roles');
      if (objs.size === 0) {
        queryBuilder.where(`u.activo = true AND u.id=0`);
      } else {
        const where: string[] = [];
        objs.forEach((item) => {
          where.push(`u.${item}`);
        });
        queryBuilder.where(`u.activo = true AND ${where.join(' OR ')}`, {
          search: search,
        });
      }
      return await paginate<UserEntity>(queryBuilder, options);
    }
    // Retornar paginación vacía si no hay búsqueda
    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder.where('u.activo = true');
    return await paginate<UserEntity>(queryBuilder, options);
  }

  async createSelect(): Promise<UserEntity[]> {
    const options = {
      where: { activo: true },
      relations: ['roles', 'funcions'],
    } as unknown as FindManyOptions<UserEntity>;
    return await this.userRepository.find(options);
  }

  async existe(userName: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { userName: userName },
    } as unknown as FindOneOptions<UserEntity>);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const options = {
      where: { activo: true, email: email },
      relations: ['roles', 'funcions'],
    } as unknown as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }

  async findByResetCode(code: number): Promise<UserEntity | null> {
    const currentDate = dayjs().format('YYYY/MM/DD');
    const options = {
      where: {
        activo: true,
        resetPasswordCode: code,
        resetPasswordCodeExp: MoreThanOrEqual(currentDate),
      },
      relations: ['roles', 'funcions'],
    } as unknown as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }
}
