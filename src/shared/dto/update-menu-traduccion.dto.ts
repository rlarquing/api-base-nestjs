import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateMenuTraduccionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID del menu', example: 1 })
  menuId!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID del idioma', example: 1 })
  idiomaId!: number;

  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({ description: 'Label traducido del menu', example: 'Inicio' })
  label!: string;
}
