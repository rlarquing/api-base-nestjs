import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateElementoDashboardDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El nombre debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El nombre debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({
    description: 'Nombre del elemento',
    example: 'grafico',
  })
  nombre: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'El tipo debe de tener al menos 4 carácteres.',
  })
  @MaxLength(255, {
    message: 'El tipo debe tener como máximo 255 carácteres.',
  })
  @ApiProperty({
    description: 'Tipo de elemento.',
    example: 'linea',
  })
  tipo: string;

  @ApiProperty({
    description: 'Objeto para guardar las propiedades de la capa del elemento',
    example: {},
  })
  capa: object;

  @ApiProperty({
    description: 'Objeto para guardar la consulta del elemento',
    example: {},
  })
  consulta: object;
}
