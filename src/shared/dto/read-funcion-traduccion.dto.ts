import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReadFuncionTraduccionDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;

  @ApiProperty({ description: 'id de la entidad', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID de la funcion', example: 1 })
  funcionId: number;

  @ApiProperty({ description: 'ID del idioma', example: 1 })
  idiomaId: number;

  @ApiProperty({ description: 'Nombre traducido', example: 'Guardar' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripcion traducida', example: 'Guardar los cambios' })
  descripcion?: string;

  constructor(
    dtoToString: string,
    id: number,
    funcionId: number,
    idiomaId: number,
    nombre: string,
    descripcion?: string,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.funcionId = funcionId;
    this.idiomaId = idiomaId;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}
