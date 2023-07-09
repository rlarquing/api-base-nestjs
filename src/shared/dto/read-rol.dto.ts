import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReadEndPointDto } from './read-end-point.dto';
import { ReadFuncionDto } from './read-funcion.dto';
import {ReadUserDto} from "./read-user.dto";
import {SelectDto} from "./select.dto";

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

  @ApiProperty({ description: 'Usuarios que usan este rol.', type: [ReadUserDto] })
  users: SelectDto[];

  @ApiProperty({ description: 'Funciones del rol.', type: [ReadEndPointDto] })
  funcions: ReadFuncionDto[];
}
