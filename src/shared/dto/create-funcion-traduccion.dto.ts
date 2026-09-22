import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateFuncionTraduccionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID de la funcion', example: 1 })
  funcionId!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID del idioma', example: 1 })
  idiomaId!: number;

  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({ description: 'Nombre traducido de la funcion', example: 'Guardar' })
  nombre!: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiPropertyOptional({
    description: 'Descripcion traducida de la funcion',
    example: 'Guardar los cambios realizados',
  })
  descripcion?: string;
}
