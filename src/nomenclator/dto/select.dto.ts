import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SelectDto {
  @IsNumber()
  @ApiProperty({ description: 'id', example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del nomenclador.', example: 'Nom 1' })
  nombre: string;

  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }
}
