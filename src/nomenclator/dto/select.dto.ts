import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SelectDto {
  @IsNumber()
  @ApiProperty({ description: 'id', example: 1 })
  value: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del nomenclador.', example: 'Nom 1' })
  label : string;

  constructor(id: number, nombre: string) {
    this.value = id;
    this.label = nombre;
  }
}
