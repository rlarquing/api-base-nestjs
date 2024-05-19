import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GraficoDto {
  @ApiPropertyOptional({
    description: 'Nombre para el gráfico',
    example: 'empresa1',
  })
  label?: string;
  @ApiPropertyOptional({
    description: 'Subtitulo para el gráfico',
    example: 'empresa1',
  })
  subtitulo?: string;
  @ApiProperty({
    description: 'Las categorias a mostrar en el gráfico',
    example: [],
  })
  categories: string[];

  @ApiProperty({
    description: 'Los datos que tiene el gráfico',
    example: [{}],
  })
  series: any[];
}
