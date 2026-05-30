import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, IpAddress } from '../decorator';
import { AuthService } from '../../core/service';
import {
  AuthCredentialsDto,
  RefreshTokenDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  ResponseDto,
  SecretDataDto,
  SelfChangePasswordDto,
  UserDto,
  ReadUserDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';

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
    type: UserDto,
  })
  @ApiExcludeEndpoint()
  async signUp(
    @Body(ValidationPipe) userDto: UserDto,
  ): Promise<ResponseDto> {
    return await this.authService.signUp(userDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Logeo de usuarios' })
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
    description: 'Mensaje de usuario o contraseña incorrecto',
  })
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<SecretDataDto> {
    return await this.authService.signIn(authCredentialsDto);
  }

  @Post('/refresh-tokens')
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
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UseGuards(AuthGuard('refresh'))
  @ApiBearerAuth()
  async regenerateTokens(
    @GetUser() user: UserEntity,
    @IpAddress() ip: string,
  ): Promise<SecretDataDto> {
    return await this.authService.regenerateTokens(user, ip);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Desloguear un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Deslogear un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @GetUser() user: UserEntity,
  ): Promise<ResponseDto> {
    return await this.authService.logout(user);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Solicitar código de recuperación de contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Código de recuperación enviado al email del usuario',
    type: ResponseDto,
  })
  @ApiBody({
    description: 'Email del usuario para enviar el código de recuperación.',
    type: RequestResetPasswordDto,
  })
  async forgotPassword(
    @Body(ValidationPipe) requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<ResponseDto> {
    return await this.authService.requestPasswordReset(requestResetPasswordDto);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña con código de recuperación' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida correctamente',
    type: ResponseDto,
  })
  @ApiBody({
    description: 'Código de recuperación y nueva contraseña.',
    type: ResetPasswordDto,
  })
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseDto> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario autenticado',
    type: ReadUserDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async getProfile(
    @GetUser() user: UserEntity,
  ): Promise<ReadUserDto> {
    return await this.authService.getProfile(user);
  }

  @Patch('/change-password')
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada correctamente',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion o contraseña actual incorrecta.' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiBody({
    description: 'Contraseña actual y nueva contraseña.',
    type: SelfChangePasswordDto,
  })
  async changeOwnPassword(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) selfChangePasswordDto: SelfChangePasswordDto,
  ): Promise<ResponseDto> {
    return await this.authService.changeOwnPassword(user, selfChangePasswordDto);
  }
}
