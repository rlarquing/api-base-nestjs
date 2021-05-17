import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import { AuthService } from '../service';
import {AuthCredentialsDto, UserDto} from '../dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({
    status: 201,
    description: 'Registro de los usuarios',
  })
  @ApiBody({
    description: 'Estructura para crear el usuario.',
    type: AuthCredentialsDto,
  })
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Logeo de usuarios' })
  @ApiResponse({
    status: 201,
    description: 'Login de los usuarios',
    type: String,
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
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDto);
  }
}
