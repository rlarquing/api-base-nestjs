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
}
