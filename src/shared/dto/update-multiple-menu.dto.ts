import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMultipleMenuDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'id de la $name', example: 1 })
  id: number;

  @IsNotEmpty()
  @IsString({ message: 'El atributo label debe ser un texto' })
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo label',
    example: 'Aquí una muestra para ese atributo',
  })
  label: string;

  @IsNotEmpty()
  @IsString({ message: 'El atributo icon debe ser un texto' })
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo icon',
    example: 'Aquí una muestra para ese atributo',
  })
  icon: string;
  @IsNotEmpty()
  @IsString({ message: 'El atributo to debe ser un texto' })
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo to',
    example: 'Aquí una muestra para ese atributo',
  })
  to: string;

  @IsNumber({}, { message: 'El atributo menu debe ser un número' })
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo menu',
    example: 'Aquí una muestra para ese atributo',
  })
  menu: number;
}
