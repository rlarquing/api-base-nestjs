import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from './../interface/ijwt-payload.interface';
import { UserEntity } from './../entity/user.entity';
import { UserRepository } from './../repository/user.repository';
import { ConfigService } from '@atlasjs/config';
import { AppConfig } from '../../app.keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.config[AppConfig.SECRET],
    });
  }

  async validate(payload: IJwtPayload): Promise<UserEntity> {
    const { username } = payload;
    const user = await this.userRepository.findByName(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
