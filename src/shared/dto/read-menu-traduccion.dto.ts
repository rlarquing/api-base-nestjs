import { ApiProperty } from '@nestjs/swagger';

export class ReadMenuTraduccionDto {
  @ApiProperty({ description: 'Nombre del objeto', example: 'Objeto 1' })
  dtoToString: string;

  @ApiProperty({ description: 'id de la entidad', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID del menu', example: 1 })
  menuId: number;

  @ApiProperty({ description: 'ID del idioma', example: 1 })
  idiomaId: number;

  @ApiProperty({ description: 'Label traducido', example: 'Inicio' })
  label: string;

  constructor(
    dtoToString: string,
    id: number,
    menuId: number,
    idiomaId: number,
    label: string,
  ) {
    this.dtoToString = dtoToString;
    this.id = id;
    this.menuId = menuId;
    this.idiomaId = idiomaId;
    this.label = label;
  }
}
