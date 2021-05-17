import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {UserEntity, RoleEntity, HISTORY_ACTION} from '../entity';
import {UserRepository, RoleRepository} from '../repository';
import {ReadUserDto, UpdateUserDto, UserDto} from '../dto';
import {UserMapper, RoleMapper} from "../mapper";
import {TrazaService} from "./traza.service";
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import * as bcrypt from 'bcrypt';

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
        const users: Pagination<UserEntity> = await this.userRepository.findAll(options);
        const readUserDto: ReadUserDto[] = users.items.map((user: UserEntity) =>
            this.userMapper.entityToDto(user,
                user.roles.map((rol: RoleEntity) =>
                    this.roleMapper.entityToDto(rol))));
        return new Pagination(readUserDto, users.meta, users.links);
    }

    async get(id: number): Promise<ReadUserDto> {
        if (!id) {
            throw new BadRequestException('El id no puede ser vacio');
        }
        const user: UserEntity = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('El usuario no se encuentra.');
        }
        return this.userMapper.entityToDto(user, user.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async create(user: UserEntity, userDto: UserDto): Promise<ReadUserDto> {
        const newUser = this.userMapper.dtoToEntity(userDto);
        const {password, roles} = userDto;
        newUser.salt = await bcrypt.genSalt();
        newUser.password = await this.hashPassword(password, newUser.salt);
        const roleEntities = await this.roleRepository.findByIds(roles);
        newUser.roles = roleEntities;

        const userEntity: UserEntity = await this.userRepository.create(newUser);
        delete userEntity.salt;
        delete userEntity.password;
        await this.trazaService.create(user, userEntity, HISTORY_ACTION.ADD);
        return this.userMapper.entityToDto(userEntity, userEntity.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async update(user: UserEntity, id: number, updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
        let foundUser: UserEntity = await this.userRepository.findById(id);
        if (!foundUser) {
            throw new NotFoundException('No existe el user');
        }
        foundUser = this.userMapper.dtoToUpdateEntity(updateUserDto, foundUser);
        const {roles} = updateUserDto;
        const roleEntities = await this.roleRepository.findByIds(roles);
        foundUser.roles = roleEntities;
        await this.userRepository.update(foundUser);
        delete foundUser.salt;
        delete foundUser.password;
        await this.trazaService.create(user, foundUser, HISTORY_ACTION.MOD);
        return this.userMapper.entityToDto(foundUser, foundUser.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async delete(user: UserEntity, id: number): Promise<void> {
        const userEntity: UserEntity = await this.userRepository.findById(id);
        delete userEntity.salt;
        delete userEntity.password;
        await this.trazaService.create(user, userEntity, HISTORY_ACTION.DEL);
        return await this.userRepository.delete(id);
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}
