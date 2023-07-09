import { ApiProperty } from '@nestjs/swagger';
import { SelectDto } from './select.dto';

export class ReadMenuDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;

  @ApiProperty({ description: 'id del permiso.', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nombre del menu',
    example: 'Listado de los indicadores',
  })
  label: string;

  @ApiProperty({
    description: 'Icono del menu',
    example: 'Book',
  })
  icon: string;

  @ApiProperty({
    description: 'Dirección hacia donde va el menu',
    example: '/home',
  })
  to: string;

  @ApiProperty({
    description: 'Menu padre que tiene',
    example: 'Administración',
  })
  menuPadre: string;

  @ApiProperty({
    description: 'Objeto para cargar el select',
    example: SelectDto,
  })
  menu: SelectDto;

  @ApiProperty({
    description: 'Menu hijos que tiene',
    example: [ReadMenuDto],
  })
  menus: ReadMenuDto[];

  @ApiProperty({
    description: 'Tipo de menu',
    example: 'reporte',
  })
  tipo: string;
}
