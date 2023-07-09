import { ApiProperty } from '@nestjs/swagger';
import { ReadEndPointDto } from './read-end-point.dto';
import { ReadMenuDto } from './read-menu.dto';
import { IsOptional } from 'class-validator';

export class ReadFuncionDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;

  @ApiProperty({ description: 'id del permiso.', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo nombre',
    example: 'Aquí una muestra para ese atributo',
  })
  nombre: string;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo descripcion',
    example: 'Aquí una muestra para ese atributo',
  })
  descripcion: string;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo endPoint',
    example: 'Aquí una muestra para ese atributo',
  })
  endPoints: ReadEndPointDto[];

  @IsOptional()
  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo rols',
    example: 'Aquí una muestra para ese atributo',
  })
  menu?: ReadMenuDto;
  constructor(
    dtoToString: string,
    id: number,
    nombre: string,
    descripcion: string,
    endPoints: ReadEndPointDto[],
    menu?: ReadMenuDto,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.endPoints = endPoints;
    this.menu = menu;
  }
}
