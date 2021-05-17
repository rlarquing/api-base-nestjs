import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interface/ijwt-payload.interface';
import { AuthCredentialsDto } from '../dto';
import { UserRepository } from '../repository';
import {RoleType} from "../enum/roletype.enum";
import {RoleEntity, UserEntity} from "../entity";

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string, roles: RoleType[] }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload: IJwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    const user: UserEntity = await this.userRepository.findByName(username);
    const roles = user.roles.map((rol:RoleEntity) => rol.nombre as RoleType);
    return { accessToken, roles };
  }
}
