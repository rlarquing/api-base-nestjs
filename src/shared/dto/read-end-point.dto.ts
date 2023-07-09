import { ApiProperty } from '@nestjs/swagger';

export class ReadEndPointDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;

  @ApiProperty({ description: 'id del permiso.', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Controlador del enpoint.',
    example: 'Crear objeto',
  })
  controller: string;

  @ApiProperty({
    description: 'Servicio al que tiene el endpoint',
    example: 'newObjeto',
  })
  servicio: string;

  @ApiProperty({
    description: 'Ruta del servicio',
    example: 'newObjeto',
  })
  ruta: string;

  @ApiProperty({
    description: 'Nombre del end point.',
    example: 'Crear objeto',
  })
  nombre: string;

  @ApiProperty({
    description: 'Método del end point.',
    example: 'Crear objeto',
  })
  metodo: string;
}
