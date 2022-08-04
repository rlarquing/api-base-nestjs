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
import * as moment from 'moment';
import {
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
} from 'class-validator';
import { RolType } from '../../shared/enum';
import { ResponseDto } from '../../shared/dto';
import {
  PaginateQuery,
  paginate,
  Paginated,
  PaginateConfig,
} from 'nestjs-paginate';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity)
    private rolRepository: Repository<RolEntity>,
  ) {}

  async signUp(userEntity: UserEntity): Promise<UserEntity> {
    const wheres = {
      activo: true,
      nombre: RolType.USUARIO,
    } as FindOptionsWhere<RolEntity>;
    const rol: RolEntity = await this.rolRepository.findOneBy(wheres);

    if (!rol) {
      throw new NotFoundException('No existe el rol');
    }
    userEntity.roles = [rol];
    try {
      return await this.userRepository.save(userEntity);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'El nombre del usuario ya existe en el sistema.',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    // Ejemplo funcional de como trabajar con queryBuilder
    // const queryBuilder = this.userRepository.createQueryBuilder('u');
    // queryBuilder.leftJoinAndSelect('u.roles', 'roles')
    // queryBuilder.where('u.status = :status', { activo: true });
    // return await paginate<UserEntity>(queryBuilder, options);
    const where = {
      sortableColumns: ['id'],
      where: { activo: true },
      relations: ['roles', 'funcions'],
    } as PaginateConfig<UserEntity>;
    return await paginate<UserEntity>(query, this.userRepository, where);
  }

  async findById(id: number): Promise<UserEntity> {
    const options = {
      where: { id: id, activo: true },
      relations: ['roles', 'funcions'],
    } as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }

  async findByIds(ids: number[]): Promise<UserEntity[]> {
    const options = {
      where: { id: In(ids), activo: true },
      relations: {
        roles: true,
        funcions: true,
      },
    } as FindManyOptions<UserEntity>;
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
    } catch (error) {
      result.message = error.response;
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
    } catch (error) {
      result.message = error.response;
      result.successStatus = false;
    }
    return result;
  }

  async validateUserPassword(
    username: string,
    password: string,
  ): Promise<string> {
    const options = { username } as FindOptionsWhere<UserEntity>;
    const user = await this.userRepository.findOneBy(options);
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  async findByName(username: string): Promise<UserEntity> {
    const options = {
      where: { activo: true, username: username },
      relations: { roles: true, funcions: true },
    } as FindOneOptions<UserEntity>;
    return await this.userRepository.findOne(options);
  }

  public async validateRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<UserEntity> {
    const currentDate = moment().format('YYYY/MM/DD');
    const options = {
      activo: true,
      username: username,
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
    query: PaginateQuery,
    claves: string[],
    valores: any[],
  ): Promise<Paginated<UserEntity>> {
    const wheres = { activo: true } as FindOptionsWhere<UserEntity>;
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

    return await paginate<UserEntity>(query, this.userRepository, {
      sortableColumns: ['id'],
      where: wheres,
      relations: ['roles', 'funcions'],
    });
  }

  async search(
    query: PaginateQuery,
    search: any,
  ): Promise<Paginated<UserEntity>> {
    if (!isEmpty(search)) {
      const config: PaginateConfig<UserEntity> = {
        sortableColumns: ['id'],
      };
      const where = { activo: true } as FindManyOptions<UserEntity>;
      const result = await this.userRepository.find(where);
      const objs = new Map<string, string>();
      let keys: string[];
      if (result.length > 0) {
        keys = Object.keys(result[0]);
      }
      for (const key of keys) {
        for (const item of result) {
          if (
            isString(item[key]) &&
            isString(search) &&
            item[key].toLowerCase().indexOf(search.toLowerCase()) !== -1
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} ILIKE '%${search}%'`);
            }
          } else if (
            isNumber(item[key]) &&
            isNumber(search) &&
            item[key] === search
          ) {
            if (!objs.has(key)) {
              objs.set(key, `${key} = :search`);
            }
          } else if (
            isDate(item[key]) &&
            isDate(search) &&
            item[key] === search
          ) {
            const datep = item[key];
            const start = new Date(datep.setHours(0, 0, 0, 0));
            const end = new Date(datep.setHours(23, 59, 59, 999));
            const date = {
              date: Between(start.toISOString(), end.toISOString()),
            };
            if (!objs.has(key)) {
              objs.set(key, `${key}=${date}`);
            }
          } else if (
            isBoolean(item[key]) &&
            isBoolean(search) &&
            item[key] === search
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
      return await paginate<UserEntity>(query, queryBuilder, config);
    }
  }
}
