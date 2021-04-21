import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import { AuthService } from './../service/auth.service';
import { AuthCredentialsDto } from './../dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {UserEntity} from "../entity/user.entity";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({
    status: 201,
    description: 'Registro de los usuarios',
    type: UserEntity,
  })
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
