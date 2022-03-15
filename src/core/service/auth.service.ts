import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import {
  FuncionRepository,
  RolRepository,
  UserRepository,
} from '../../persistence/repository';
import {
  AuthCredentialsDto,
  ResponseDto,
  SecretDataDto,
  UserDto,
} from '../../shared/dto';
import { FuncionEntity, RolEntity, UserEntity } from '../../persistence/entity';
import { eliminarDuplicado } from '../../../lib';
import { IJwtPayload } from '../../shared/interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private rolRepository: RolRepository,
    private funcionRepository: FuncionRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(userDto: UserDto): Promise<ResponseDto> {
    const result = new ResponseDto();
    const { username, password, email } = userDto;
    const userEntity: UserEntity = new UserEntity(username, email);
    userEntity.salt = await genSalt();
    userEntity.password = await this.hashPassword(password, userEntity.salt);
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
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<SecretDataDto> {
    const { username, password } = authCredentialsDto;
    const credential = await this.userRepository.validateUserPassword(
      username,
      password,
    );
    if (!credential) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const user: UserEntity = await this.userRepository.findByName(username);
    const funcionsIndiv: FuncionEntity[] = user.funcions;
    let funcions: FuncionEntity[] = [];
    let item: RolEntity;
    for (const rol of user.roles) {
      item = await this.rolRepository.findById(rol.id);
      item.funcions.forEach((funcion) => funcions.push(funcion));
    }
    funcions = funcions.concat(funcionsIndiv);
    let endPoints: string[] = [];
    let fun: FuncionEntity;
    for (const funcion of funcions) {
      fun = await this.funcionRepository.findById(funcion.id);
      for (const endPoint of fun.endPoints) {
        endPoints.push(endPoint.controller + '.' + endPoint.servicio);
      }
    }
    endPoints = eliminarDuplicado(endPoints);
    // const listaFuncions: string[] = funcions.map((funcion) => funcion.nombre);
    // const roles = user.roles.map((rol: RolEntity) => rol.nombre as RolType);
    const payload: IJwtPayload = { username, endPoints };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.getRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
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
    const userEntity: UserEntity = await this.userRepository.findById(user.id);
    const funcionsIndiv: FuncionEntity[] = userEntity.funcions;
    let funcions: FuncionEntity[] = [];
    let item: RolEntity;
    for (const rol of user.roles) {
      item = await this.rolRepository.findById(rol.id);
      item.funcions.forEach((funcion) => funcions.push(funcion));
    }
    funcions = funcions.concat(funcionsIndiv);
    let endPoints: string[] = [];
    for (const funcion of funcions) {
      for (const endPoint of funcion.endPoints) {
        endPoints.push(endPoint.controller + '.' + endPoint.servicio);
      }
    }
    endPoints = eliminarDuplicado(endPoints);
    // const listaFuncions: string[] = funcions.map((funcion) => funcion.nombre);
    // const roles = user.roles.map((rol: RolEntity) => rol.nombre as RolType);
    const payload: IJwtPayload = { username, endPoints };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.getRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
    };
  }
  async logout(user: UserEntity): Promise<ResponseDto> {
    user.refreshToken = null;
    user.refreshTokenExp = null;
    await this.userRepository.update(user);
    const result = new ResponseDto();
    result.successStatus = true;
    result.message = 'success';
    return result;
  }
}
