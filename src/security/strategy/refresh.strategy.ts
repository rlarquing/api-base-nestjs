import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {ExtractJwt, Strategy} from "passport-jwt";
import {AppConfig} from "../../app.keys";
import {ConfigService} from "@atlasjs/config";
import {UserRepository} from "../repository";
import {IJwtPayload} from "../interface/ijwt-payload.interface";
import * as moment from "moment";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private configService: ConfigService,
        private userRepository: UserRepository,
    ) {
        super({
            ignoreExpiration: true,
            passReqToCallback: true,
            secretOrKey: configService.config[AppConfig.SECRET],
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                let data = request?.cookies["auth-cookie"];
                if (!data) {
                    return null;
                }
                return data.accessToken
            }])
        })
    }

    async validate(req: Request, payload: IJwtPayload) {
        if (!payload) {
            throw new BadRequestException('invalid jwt token');
        }
        let data = req?.cookies["auth-cookie"];
        if (!data) {
            throw new BadRequestException('invalid auth-cookie');
        }
        if (!data?.refreshToken) {
            throw new BadRequestException('invalid refresh token');
        }
        let user = await this.userRepository.validateRefreshToken(payload.username, data.refreshToken);
        if (!user) {
            throw new BadRequestException('token expired');
        }

        return user;
    }
}