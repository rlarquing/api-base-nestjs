import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import { AuthService } from './../service/auth.service';
import { AuthCredentialsDto } from './../dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({
    status: 201,
    description: 'Registro de los usuarios',
  })
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOperation({ summary: 'Logeo de usuarios' })
  @ApiResponse({
    status: 201,
    description: 'Login de los usuarios',
    type: String,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Mensaje de usuario o contraseña incorrecto',
  })
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
