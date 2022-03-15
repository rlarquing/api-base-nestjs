import { ApiProperty } from '@nestjs/swagger';

export class FiltroDto {
  @ApiProperty({ description: 'Fecha.', example: '2021/05/16' })
  date?: string;

  @ApiProperty({ description: 'Modelo.', example: 'UserEntity' })
  model?: string;

  @ApiProperty({ description: 'Datos.', example: '' })
  data?: string;

  @ApiProperty({ description: 'Record.', example: 25 })
  record?: string;

  @ApiProperty({ description: 'Accion.', example: 'Modificar' })
  action?: string;
}
