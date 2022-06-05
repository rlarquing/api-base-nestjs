import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadEndPointDto } from './read-end-point.dto';
import { ReadFuncionDto } from './read-funcion.dto';

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

  @ApiProperty({ description: 'Funciones del rol.', type: [ReadEndPointDto] })
  funcions: ReadFuncionDto[];

  constructor(
    dtoToString: string,
    id: number,
    nombre: string,
    descripcion: string,
    funcions: ReadFuncionDto[],
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.funcions = funcions;
  }
}
