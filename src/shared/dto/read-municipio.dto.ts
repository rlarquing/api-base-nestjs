import { ApiProperty } from '@nestjs/swagger';
import { ReadProvinciaDto } from './read-provincia.dto';

export class ReadMunicipioDto {
  dtoToString: string;

  @ApiProperty({ description: 'id del municipio.', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre del municipio.', example: 'Minas' })
  nombre: string;

  @ApiProperty({ description: 'Código del municipio.', example: '3004' })
  codigo: number;

  @ApiProperty({
    description: 'Provincia a que pertenece',
    example: ReadProvinciaDto,
  })
  provincia: ReadProvinciaDto;

  constructor(
    dtoToString: string,
    id: number,
    nombre: string,
    codigo: number,
    provincia: ReadProvinciaDto,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.nombre = nombre;
    this.codigo = codigo;
    this.provincia = provincia;
  }
}
