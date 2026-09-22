import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateIdiomaDto {
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({ description: 'Codigo del idioma', example: 'es' })
  codigo!: string;

  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({ description: 'Nombre del idioma', example: 'Espanol' })
  nombre!: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Indica si es el idioma por defecto',
    example: false,
  })
  defecto?: boolean;
}
