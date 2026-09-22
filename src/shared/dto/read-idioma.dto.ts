import { ApiProperty } from '@nestjs/swagger';

export class ReadIdiomaDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;

  @ApiProperty({ description: 'id de la entidad', example: 1 })
  id: number;

  @ApiProperty({ description: 'Codigo del idioma', example: 'es' })
  codigo: string;

  @ApiProperty({ description: 'Nombre del idioma', example: 'Espanol' })
  nombre: string;

  @ApiProperty({ description: 'Es idioma por defecto', example: false })
  defecto: boolean;

  constructor(
    dtoToString: string,
    id: number,
    codigo: string,
    nombre: string,
    defecto: boolean,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.codigo = codigo;
    this.nombre = nombre;
    this.defecto = defecto;
  }
}
