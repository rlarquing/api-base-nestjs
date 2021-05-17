import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interface/ijwt-payload.interface';
import { AuthCredentialsDto } from '../dto';
import { UserRepository } from '../repository';
import {RoleType} from "../enum/roletype.enum";
import {RoleEntity, UserEntity} from "../entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {username, password, email} = authCredentialsDto;
    const userEntity: UserEntity = new UserEntity(username, email);
    userEntity.salt = await bcrypt.genSalt();
    userEntity.password = await this.hashPassword(password, userEntity.salt);
    this.userRepository.signUp(userEntity);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string, roles: RoleType[] }> {
    const {username, password} = authCredentialsDto;
    const credential = await this.userRepository.validateUserPassword(
        username, password
    );

    if (!credential) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload: IJwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    const user: UserEntity = await this.userRepository.findByName(username);
    const roles = user.roles.map((rol:RoleEntity) => rol.nombre as RoleType);
    return { accessToken, roles };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
