import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './../interface/jwt-payload.interface';
import { UserEntity } from './../entity/user.entity';
import { UserRepository } from './../repository/user.repository';
import { ConfigService } from '@atlasjs/config';
import { AppConfig } from '../../app.keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.config[AppConfig.SECRET],
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { username } = payload;
    const user = await this.userRepository.findByName(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
