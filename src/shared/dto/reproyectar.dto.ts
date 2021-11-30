import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
export class ReproyectarDto {
  @IsNumber({}, { message: 'La proyección de origen tiene que ser un número' })
  @IsNotEmpty({ message: 'La proyección de origen no puede estar vacia' })
  @ApiProperty({ description: 'Proyeccion de origen', example: 4326 })
  origen: number;

  @IsNumber({}, { message: 'La proyección de destino tiene que ser un número' })
  @IsNotEmpty({ message: 'La proyección de destino no puede estar vacia' })
  @ApiProperty({ description: 'Proyeccion de destino', example: 3796 })
  destino: number;
}
