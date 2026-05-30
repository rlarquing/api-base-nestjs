import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../persistence/repository';
import { AppConfig } from '../../app.keys';
import { IJwtPayload } from '../../shared/interface';
import { UserEntity } from '../../persistence/entity';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    // TypeScript 6: Asegurar que secretOrKey no sea undefined
    const secret = configService.get<string>(AppConfig.SECRET) ?? 'default-secret-key';
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(req: Request, payload: IJwtPayload): Promise<UserEntity> {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }

    const data = req?.body;
    if (!data) {
      throw new BadRequestException('invalid auth-cookie');
    }
    if (!data?.refreshToken) {
      throw new BadRequestException('invalid refresh token');
    }
    const user = await this.userRepository.validateRefreshToken(
      payload.userName,
      data.refreshToken,
    );
    if (!user) {
      throw new BadRequestException('token expired');
    }

    return user;
  }
}
