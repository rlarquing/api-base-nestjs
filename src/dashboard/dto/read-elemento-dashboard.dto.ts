import { ApiProperty } from '@nestjs/swagger';

export class ReadElementoDashboardDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;
  @ApiProperty({ description: 'id de la entidad.', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nombre del elemento',
    example: 'grafico',
  })
  nombre: string;

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

  constructor(
    dtoToString: string,
    id: number,
    nombre: string,
    tipo: string,
    capa: object,
    consulta: object,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.capa = capa;
    this.consulta = consulta;
  }
}
