import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ReadNomencladorDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @IsNumber()
  @ApiProperty({ description: 'id', example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del nomenclador.', example: 'Nom 1' })
  nombre: string;

  @IsString()
  @ApiProperty({
    description: 'Descripción del nomenclador.',
    example: 'Descripción del nom',
  })
  descripcion: string;
}
