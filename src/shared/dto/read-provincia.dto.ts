import { ApiProperty } from '@nestjs/swagger';

export class ReadProvinciaDto {
  dtoToString: string;

  @ApiProperty({ description: 'id de la provincia.', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre de la provincia.', example: 'Camaguey' })
  nombre: string;

  @ApiProperty({ description: 'Código de la provincia.', example: '30' })
  codigo: string;

  @ApiProperty({ description: 'Nombre corto de la provincia.', example: 'CM' })
  nombreCorto: string;
}
