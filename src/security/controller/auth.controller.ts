import {
    Body,
    Controller,
    Post,
    ValidationPipe,
    Res,
    Get,
    UseGuards,
} from '@nestjs/common';
import {AuthService} from '../service';
import {AuthCredentialsDto, RefreshTokenDto, SecretDataDto, UserDto} from '../dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {ResponseDto} from "../../shared/dto";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../decorator";
import {UserEntity} from "../entity";
import {RoleGuard} from "../guard/role.guard";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/signup')
    @ApiOperation({summary: 'Registrar usuario'})
    @ApiResponse({
        status: 201,
        description: 'Registro de los usuarios',
    })
    @ApiBody({
        description: 'Estructura para crear el usuario.',
        type: UserDto,
    })
    async signUp(
        @Body(ValidationPipe) userDto: UserDto,
    ): Promise<ResponseDto> {
        return await this.authService.signUp(userDto);
    }

    @Post('/signin')
    @ApiOperation({summary: 'Logeo de usuarios'})
    @ApiResponse({
        status: 201,
        description: 'Login de los usuarios',
        type: SecretDataDto,
    })
    @ApiBody({
        description: 'Estructura para el logeo del usuario.',
        type: AuthCredentialsDto,
    })
    @ApiUnauthorizedResponse({
        status: 401,
        description: 'Mensaje de usuario o contraseña incorrecto',
    })
    async signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<any> {
        return await this.authService.signIn(authCredentialsDto);
    }

    @Get('refresh-tokens')
    @ApiOperation({ summary: 'Obtener el token nuevo para los usuarios' })
    @ApiResponse({
        status: 200,
        description: 'Token nuevo para de los usuarios',
        type: SecretDataDto,
    })
    @ApiBody({
        description: 'Estructura para el envio del refresh token.',
        type: RefreshTokenDto,
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    @UseGuards(AuthGuard('refresh'))
    @ApiBearerAuth()
    async regenerateTokens(
        @GetUser() user: UserEntity,
    ): Promise<any> {
        return await this.authService.regenerateTokens(user);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Desloguear un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Deslogear un usuario',
        type: ResponseDto,
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    @UseGuards(AuthGuard('jwt'))
    async logout(@GetUser() user: UserEntity): Promise<ResponseDto> {
        return await this.authService.logout(user);
    }

}
