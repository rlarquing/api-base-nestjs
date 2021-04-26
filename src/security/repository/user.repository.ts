import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import { AuthCredentialsDto } from './../dto/auth-credentials.dto';
import { UserEntity } from './../entity/user.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {UserMapper} from "../mapper/user.mapper";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import {RoleEntity} from "../entity/role.entity";
import { RoleType } from './../enum/roletype.enum'
import {UpdateRoleDto, UpdateUserDto, UserDto} from "../dto";

@Injectable()
export class UserRepository {
    constructor(

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,

        private userMapper: UserMapper,
    ) {}


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password, email } = authCredentialsDto;

        const user = new UserEntity(username,email);

        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        const rol: RoleEntity = await this.roleRepository.findOne({
            where: {status: 'ACTIVE', nombre: RoleType.USUARIO }
        });

        if (!rol) {
            throw new NotFoundException('No existe el rol');
        }
        user.roles=[rol];
        try {
            await user.save();
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

    async getAll(): Promise<UserEntity[]> {
        const users: UserEntity[] = await this.userRepository.find({
            where: {status: 'ACTIVE'},
        });
        return users;
    }

    async get(id: number): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: {status: 'ACTIVE'}
        });
        return user;
    }

    async create(userDto: UserDto): Promise<UserEntity> {
        const newUser = this.userMapper.dtoToEntity(userDto);
        const { password, roles } = userDto;
        newUser.salt = await bcrypt.genSalt();
        newUser.password = await this.hashPassword(password, newUser.salt);
        const roleEntities = await this.roleRepository.findByIds(roles);
        newUser.roles=roleEntities;
        return await this.userRepository.save(newUser);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const foundUser: UserEntity = await this.userRepository.findOne(id);
        if (!foundUser) {
            throw new NotFoundException('No existe el user');
        }
        const { email, username, roles } = updateUserDto;
        const roleEntities = await this.roleRepository.findByIds(roles);
        foundUser.email = email;
        foundUser.username = username;
        foundUser.roles=roleEntities;
        const updatedUser: UserEntity = await this.userRepository.save(foundUser);
        return updatedUser;
    }

    async delete(id: number): Promise<void> {
        const user = await this.userRepository.findOne(id, {where: {status: 'ACTIVE'}});
        if (!user) {
            throw new NotFoundException('No existe el usuario');
        }
        user.status = 'INACTIVE';
        await this.roleRepository.save(user);
    }

    async validateUserPassword(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ username });

        if (user && (await user.validatePassword(password))) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async findByName(username: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: {status: 'ACTIVE', username: username}
        });
        return user;
    }
}
