import {BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import {HISTORY_ACTION, RolEntity, UserEntity} from '../entity';
import {RolRepository, UserRepository} from '../repository';
import {ReadUserDto, UpdateUserDto, UserDto} from '../dto';
import {RolMapper, UserMapper} from "../mapper";
import {TrazaService} from "./traza.service";
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import * as bcrypt from 'bcrypt';
import {ResponseDto} from "../../shared/dto";

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private rolRepository: RolRepository,
        private trazaService: TrazaService,
        private userMapper: UserMapper,
        private roleMapper: RolMapper,
    ) {
    }

    async findAll(options: IPaginationOptions): Promise<Pagination<ReadUserDto>> {
        const users: Pagination<UserEntity> = await this.userRepository.findAll(options);
        let readUserDto: ReadUserDto[]=[];
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

    async create(user: UserEntity, userDto: UserDto): Promise<ResponseDto> {
        let result = new ResponseDto();
        try {
            const newUser = this.userMapper.dtoToEntity(userDto);
            const {password, roles} = userDto;
            newUser.salt = await bcrypt.genSalt();
            newUser.password = await UserService.hashPassword(password, newUser.salt);
            newUser.roles = await this.rolRepository.findByIds(roles);

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

    async update(user: UserEntity, id: number, updateUserDto: UpdateUserDto): Promise<ResponseDto> {
        let result = new ResponseDto();

        let foundUser: UserEntity = await this.userRepository.findById(id);
        if (!foundUser) {
            throw new NotFoundException('No existe el user');
        }
        try {
            foundUser = this.userMapper.dtoToUpdateEntity(updateUserDto, foundUser);
            const {roles} = updateUserDto;
            foundUser.roles = await this.rolRepository.findByIds(roles);

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
        let result = new ResponseDto();
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

    private static async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}
