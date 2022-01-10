import { ApiProperty } from '@nestjs/swagger';

export class FiltroGenericoDto {
  @ApiProperty({ description: 'clave.', example: ['nombre', 'edad'] })
  clave: string[];

  @ApiProperty({ description: 'valor.', example: ['Luis', 46] })
  valor: any[];
}
