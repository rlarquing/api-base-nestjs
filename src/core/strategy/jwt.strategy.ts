import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../persistence/repository';
import { AppConfig } from '../../app.keys';
import { IJwtPayload } from '../../shared/interface';
import { UserEntity } from '../../persistence/entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    // TypeScript 6: Asegurar que secretOrKey no sea undefined
    const secret = configService.get<string>(AppConfig.SECRET) ?? 'default-secret-key';
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: IJwtPayload): Promise<UserEntity> {
    const { userName } = payload;
    const user = await this.userRepository.findByName(userName);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
