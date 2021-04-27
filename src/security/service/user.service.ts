import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {UserEntity} from './../entity/user.entity';
import {UserRepository} from './../repository/user.repository';
import {RoleRepository} from './../repository/role.repository';
import {ReadUserDto, UpdateUserDto, UserDto} from './../dto';
import {UserMapper} from "../mapper/user.mapper";
import {RoleMapper} from "../mapper/role.mapper";
import {RoleEntity} from "../entity/role.entity";
import {HISTORY_ACTION, TrazaEntity} from "../entity/traza.entity";
import {TrazaService} from "./traza.service";
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private trazaService: TrazaService,
        private userMapper: UserMapper,
        private roleMapper: RoleMapper,
    ) {
    }

    async getAll(options: IPaginationOptions): Promise<Pagination<ReadUserDto>> {
        const users: Pagination<UserEntity> = await this.userRepository.getAll(options);
        const readUserDto: ReadUserDto[] = users.items.map((user: UserEntity) =>
            this.userMapper.entityToDto(user,
                user.roles.map((rol: RoleEntity) =>
                    this.roleMapper.entityToDto(rol))));
        return new Pagination(readUserDto, users.meta, users.links);
    }

    async get(id: number): Promise<ReadUserDto> {
        if (!id) {
            throw new BadRequestException('id must be sent');
        }
        const user: UserEntity = await this.userRepository.get(id);
        if (!user) {
            throw new NotFoundException();
        }
        return this.userMapper.entityToDto(user, user.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async create(user: UserEntity, userDto: UserDto): Promise<ReadUserDto> {
        const userEntity: UserEntity = await this.userRepository.create(userDto);
        delete userEntity.salt;
        delete userEntity.password;
        await this.trazaService.create(user, userEntity, HISTORY_ACTION.ADD);
        return this.userMapper.entityToDto(userEntity, userEntity.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async update(user: UserEntity, id: number, updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
        const userEntity: UserEntity = await this.userRepository.update(id, updateUserDto);
        delete userEntity.salt;
        delete userEntity.password;
        await this.trazaService.create(user, userEntity, HISTORY_ACTION.MOD);
        return this.userMapper.entityToDto(userEntity, userEntity.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async delete(user: UserEntity, id: number): Promise<void> {
        const userEntity: UserEntity = await this.userRepository.get(id);
        delete userEntity.salt;
        delete userEntity.password;
        await this.trazaService.create(user, userEntity, HISTORY_ACTION.DEL);
        return await this.userRepository.delete(id);
    }

}
