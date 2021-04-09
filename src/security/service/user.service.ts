import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from './../entity/user.entity';
import {UserRepository} from './../repository/user.repository';
import {RoleRepository} from './../repository/role.repository';
import {CreateRoleDto, ReadRoleDto, ReadUserDto, UpdateUserDto, UserDto} from './../dto';
import {plainToClass} from 'class-transformer';
import {UserMapper} from "../mapper/user.mapper";
import {RoleMapper} from "../mapper/role.mapper";
import {RoleEntity} from "../entity/role.entity";

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private userMapper: UserMapper,
        private roleMapper: RoleMapper,
    ) {
    }

    async getAll(): Promise<ReadUserDto[]> {
        const users: UserEntity[] = await this.userRepository.getAll();
        return users.map((user: UserEntity) =>
            this.userMapper.entityToDto(user,
                user.roles.map((rol: RoleEntity) =>
                    this.roleMapper.entityToDto(rol))));
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

    async create(userDto: UserDto): Promise<ReadUserDto>{
        const savedUser: UserEntity = await this.userRepository.create(userDto);
        return this.userMapper.entityToDto(savedUser, savedUser.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
        const updatedUser: UserEntity = await this.userRepository.update(id, updateUserDto);
        return this.userMapper.entityToDto(updatedUser, updatedUser.roles.map((rol: RoleEntity) =>
            this.roleMapper.entityToDto(rol)));
    }

    async delete(id: number): Promise<void> {
        return await this.userRepository.delete(id);
    }

}
