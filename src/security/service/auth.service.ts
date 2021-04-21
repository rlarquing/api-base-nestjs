import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './../interface/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './../dto/auth-credentials.dto';
import { UserRepository } from './../repository/user.repository';

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
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload: JwtPayload = { username };
    console.log(payload);
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
