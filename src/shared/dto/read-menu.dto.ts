import { ApiProperty } from '@nestjs/swagger';
import { ReadDimensionDto } from './read-dimension.dto';

export class ReadMenuDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;

  @ApiProperty({ description: 'id del permiso.', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo label',
    example: 'Aquí una muestra para ese atributo',
  })
  label: string;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo icon',
    example: 'Aquí una muestra para ese atributo',
  })
  icon: string;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo to',
    example: 'Aquí una muestra para ese atributo',
  })
  to: string;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo dimension',
    example: 'Aquí una muestra para ese atributo',
  })
  dimension: ReadDimensionDto;

  @ApiProperty({
    description: 'Aquí escriba una descripción para el atributo menu',
    example: 'Aquí una muestra para ese atributo',
  })
  menus: ReadMenuDto[];
  constructor(
    dtoToString: string,
    id: number,
    label: string,
    icon: string,
    to: string,
    dimension: ReadDimensionDto,
    menus: ReadMenuDto[],
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.label = label;
    this.icon = icon;
    this.to = to;
    this.dimension = dimension;
    this.menus = menus;
  }
}
