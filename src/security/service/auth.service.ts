import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {IJwtPayload} from '../interface/ijwt-payload.interface';
import {AuthCredentialsDto, SecretDataDto, UserDto} from '../dto';
import {RolRepository, UserRepository} from '../repository';
import {RolType} from "../enum/rol-type.enum";
import {PermisoEntity, RolEntity, UserEntity} from "../entity";
import { genSalt, hash } from 'bcryptjs';
import {ResponseDto} from "../../shared/dto";
import * as randomToken from 'rand-token';
import * as moment from 'moment';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private rolRepository: RolRepository,
        private jwtService: JwtService
    ) {
    }
    async signUp(userDto: UserDto): Promise<ResponseDto> {
        let result = new ResponseDto();
        const {username, password, email} = userDto;
        const userEntity: UserEntity = new UserEntity(username, email);
        userEntity.salt = await genSalt();
        userEntity.password = await this.hashPassword(password, userEntity.salt);
        await this.userRepository.signUp(userEntity);
        try {
            await this.userRepository.signUp(userEntity);
            result.successStatus = true;
            result.message = 'success';
        } catch (error) {
            result.message = error.response;
            result.successStatus = false;
            return result;
        }
        return result;
    }
    async signIn(
        authCredentialsDto: AuthCredentialsDto
    ): Promise<SecretDataDto> {
        const {username, password} = authCredentialsDto;
        const credential = await this.userRepository.validateUserPassword(
            username, password
        );
        if (!credential) {
            throw new UnauthorizedException('Credenciales inválidas.');
        }
        const user: UserEntity = await this.userRepository.findByName(username);
        const permisosIndiv: PermisoEntity[] = user.permisos;
        let permisos: PermisoEntity[] = [];
        let item: RolEntity;
        for (const rol of user.roles) {
            item = await this.rolRepository.findById(rol.id);
            item.permisos.forEach((permiso) =>
                permisos.push(permiso)
            );
        }
        permisos = permisos.concat(permisosIndiv);
        let listaPermiso: string[] = permisos.map((permiso) => permiso.servicio);
        const roles = user.roles.map((rol: RolEntity) => rol.nombre as RolType);
        const payload: IJwtPayload = {username, permisos: listaPermiso,roles};
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = await this.getRefreshToken(user.id);
        return {
            accessToken,
            refreshToken
        };
    }
    private async hashPassword(password: string, salt: string): Promise<string> {
        return hash(password, salt);
    }
    public async getRefreshToken(id: number): Promise<string> {
        const userEntity: UserEntity = await this.userRepository.findById(id);
        userEntity.refreshToken = randomToken.generate(16);
        userEntity.refreshTokenExp = moment().add(1, 'days').format('YYYY/MM/DD');
        await this.userRepository.update(userEntity);
        return userEntity.refreshToken;
    }
    async regenerateTokens(user: UserEntity): Promise<SecretDataDto> {
        const username = user.username;
        const permisosIndiv: PermisoEntity[] = user.permisos;
        let permisos: PermisoEntity[] = [];
        let item: RolEntity;
        for (const rol of user.roles) {
            item = await this.rolRepository.findById(rol.id);
            item.permisos.forEach((permiso) =>
                permisos.push(permiso)
            );
        }
        permisos = permisos.concat(permisosIndiv);
        let listaPermiso: string[] = permisos.map((permiso) => permiso.servicio);
        const roles = user.roles.map((rol: RolEntity) => rol.nombre as RolType);
        const payload: IJwtPayload = {username, permisos: listaPermiso,roles};
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = await this.getRefreshToken(user.id);
        return {
            accessToken,
            refreshToken
        };
    }
    async logout(user: UserEntity): Promise<ResponseDto> {
        user.refreshToken = null;
        user.refreshTokenExp = null;
        await this.userRepository.update(user);
        let result = new ResponseDto();
        result.successStatus = true;
        result.message = 'success';
        return result;
    }
}
