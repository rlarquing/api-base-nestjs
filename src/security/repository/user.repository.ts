import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {RolEntity, UserEntity} from '../entity';
import {InjectRepository} from "@nestjs/typeorm";
import {MoreThanOrEqual, Repository} from "typeorm";
import {RolType} from '../enum/rol-type.enum';
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import * as moment from "moment";
import {ResponseDto} from "../../shared/dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(RolEntity)
        private rolRepository: Repository<RolEntity>
    ) {
    }


    async signUp(userEntity: UserEntity): Promise<UserEntity> {
        const rol: RolEntity = await this.rolRepository.findOne({
            where: {activo: true, nombre: RolType.USUARIO}
        });

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

    async findAll(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
        // Ejemplo funcional de como trabajar con queryBuilder
        // const queryBuilder = this.userRepository.createQueryBuilder('u');
        // queryBuilder.leftJoinAndSelect('u.roles', 'roles')
        // queryBuilder.where('u.status = :status', { activo: true });
        // return await paginate<UserEntity>(queryBuilder, options);
        return await paginate<UserEntity>(this.userRepository, options, {
            where: {activo: true},
            relations: ['roles']
        });


    }

    async findById(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne(id, {
            where: {activo: true},
            relations: ['roles']
        });
    }

    async findByIds(ids: number[]): Promise<UserEntity[]> {
        return await this.userRepository.findByIds(ids, {
            where: {activo: true},
            relations: ['roles']
        });
    }

    async create(userEntity: UserEntity): Promise<UserEntity> {
        return await this.userRepository.save(userEntity);
    }

    async update(updatedUser: UserEntity): Promise<ResponseDto> {
        let result = new ResponseDto();
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
        let result = new ResponseDto();
        const user = await this.userRepository.findOne(id, {where: {activo: true}});
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
        username: string, password: string
    ): Promise<string> {
        const user = await this.userRepository.findOne({username});
        if (user && (await user.validatePassword(password))) {
            return user.username;
        } else {
            return null;
        }
    }

    async findByName(username: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: {activo: true, username: username},
            relations: ['roles']
        });
        return user;
    }

    public async validateRefreshToken(username: string, refreshToken: string): Promise<UserEntity> {
        const currentDate = moment().format("YYYY/MM/DD");
        const user = await this.userRepository.findOne({
            where: {
                activo: true,
                username: username,
                refreshToken: refreshToken,
                refreshTokenExp: MoreThanOrEqual(currentDate)
            }
        });
        if (!user) {
            return null;
        }
        return user;
    }
}
