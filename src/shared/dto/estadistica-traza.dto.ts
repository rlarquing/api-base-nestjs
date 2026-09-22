import { ApiProperty } from '@nestjs/swagger';
import { HISTORY_ACTION } from '../../persistence/entity/log-history.entity';

export class TrazaPorAccionDto {
  @ApiProperty({
    description: 'Acción registrada en la traza',
    enum: HISTORY_ACTION,
    example: HISTORY_ACTION.ADD,
  })
  accion!: HISTORY_ACTION;

  @ApiProperty({ description: 'Cantidad de trazas con esa acción', example: 9000 })
  cantidad!: number;
}

export class TrazaPorTablaDto {
  @ApiProperty({ description: 'Esquema de la tabla', example: 'mod_operativo' })
  esquema!: string;

  @ApiProperty({ description: 'Tabla afectada', example: 'buque' })
  tabla!: string;

  @ApiProperty({ description: 'Cantidad de trazas sobre esa tabla', example: 900 })
  cantidad!: number;
}

export class TrazaPorDiaDto {
  @ApiProperty({ description: 'Día en formato YYYY-MM-DD', example: '2026-09-01' })
  fecha!: string;

  @ApiProperty({ description: 'Cantidad de trazas de ese día', example: 120 })
  cantidad!: number;
}

export class EstadisticaTrazaDto {
  @ApiProperty({ description: 'Total de trazas registradas', example: 15230 })
  total!: number;

  @ApiProperty({
    description: 'Distribución de trazas por acción',
    type: [TrazaPorAccionDto],
  })
  porAccion!: TrazaPorAccionDto[];

  @ApiProperty({
    description: 'Tablas con más trazas, de mayor a menor',
    type: [TrazaPorTablaDto],
  })
  porTabla!: TrazaPorTablaDto[];

  @ApiProperty({
    description:
      'Serie de los últimos 7 días, siempre con 7 entradas y ceros en los días sin trazas',
    type: [TrazaPorDiaDto],
  })
  ultimos7Dias!: TrazaPorDiaDto[];

  @ApiProperty({
    description: 'Usuarios distintos que generaron trazas en los últimos 7 días',
    example: 6,
  })
  usuariosDistintos7Dias!: number;
}
