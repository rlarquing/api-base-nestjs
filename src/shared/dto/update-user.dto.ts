import {
  IsEmail,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'Email del usuario.',
    example: 'juan@camaguey.geocuba.cu',
  })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'El nombre debe de tener al menos 4 carácteres',
  })
  @MaxLength(255, {
    message: 'El nombre debe de tener como máximo 255 carácteres',
  })
  @ApiProperty({ description: 'Nombre del usuario.', example: 'juan' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Roles del usuario.', example: [1, 2] })
  roles: number[];

  @IsOptional()
  @ApiProperty({ description: 'Funciones del usuario.', example: [1, 2] })
  funcions?: number[];
}
