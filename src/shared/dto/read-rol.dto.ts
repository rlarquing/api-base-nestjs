import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadEndPointDto } from './read-end-point.dto';
import { ReadFuncionDto } from './read-funcion.dto';
import { ReadDimensionDto } from './read-dimension.dto';

export class ReadRolDto {
  @IsString({ message: 'El dtoToString debe de ser un string' })
  dtoToString: string;

  @ApiProperty({ description: 'id del rol.', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nombre del rol.', example: 'Administrador' })
  nombre: string;

  @ApiProperty({
    description: 'Descripción del rol.',
    example: 'Tiene endPoint total del api',
  })
  descripcion: string;

  @ApiProperty({ description: 'dimension', type: ReadDimensionDto })
  dimension: ReadDimensionDto;

  @ApiProperty({ description: 'Funciones del rol.', type: [ReadEndPointDto] })
  funcions: ReadFuncionDto[];

  constructor(
    dtoToString: string,
    id: number,
    nombre: string,
    descripcion: string,
    dimension: ReadDimensionDto,
    funcions: ReadFuncionDto[],
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.dimension = dimension;
    this.funcions = funcions;
  }
}
