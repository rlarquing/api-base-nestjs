import { IsString, Matches, MaxLength, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEqualTo } from '../../api/decorator';

export class SelfChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Contraseña actual del usuario.',
    example: 'OldPassword123*',
  })
  currentPassword!: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 carácteres.',
  })
  @MaxLength(255, {
    message: 'La contraseña debe tener como máximo 255 carácteres.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña es muy débil.',
  })
  @ApiProperty({
    description: 'Nueva contraseña del usuario.',
    example: 'Qwerty1234*',
  })
  password!: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 carácteres.',
  })
  @MaxLength(255, {
    message: 'La contraseña debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({
    description: 'Confirmar nueva contraseña del usuario.',
    example: 'Qwerty1234*',
  })
  @IsEqualTo('password')
  confirmPassword!: string;
}
