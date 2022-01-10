import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../app.keys';
import { UserRepository } from '../repository';
import { IJwtPayload } from '../interface/ijwt-payload.interface';
import { UserEntity } from '../entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: configService.get(AppConfig.SECRET),
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
      payload.username,
      data.refreshToken,
    );
    if (!user) {
      throw new BadRequestException('token expired');
    }

    return user;
  }
}
