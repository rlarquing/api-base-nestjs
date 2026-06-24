import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../types';

/**
 * Meta-información de la paginación
 */
export class PaginationMetaDto {
  @ApiProperty({ description: 'Total de elementos' })
  totalItems!: number;

  @ApiProperty({ description: 'Elementos en esta página' })
  itemCount!: number;

  @ApiProperty({ description: 'Elementos por página' })
  itemsPerPage!: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ description: 'Página actual' })
  currentPage!: number;
}

/**
 * Links de navegación de la paginación
 */
export class PaginationLinksDto {
  @ApiProperty({ description: 'Primera página' })
  first!: string;

  @ApiProperty({ description: 'Página anterior' })
  previous!: string;

  @ApiProperty({ description: 'Página siguiente' })
  next!: string;

  @ApiProperty({ description: 'Última página' })
  last!: string;
}

/**
 * Respuesta paginada genérica.
 * 
 * Para Swagger, usar @ApiExtraModels + getSchemaPath en cada controlador.
 * Ejemplo:
 * @ApiExtraModels(PaginatedDto)
 * @ApiResponse({ schema: { allOf: [{ $ref: getSchemaPath(PaginatedDto) }] } })
 */
export class PaginatedDto<T = any> {
  items: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  @ApiProperty({ type: PaginationLinksDto })
  links!: PaginationLinksDto;

  constructor(items: T[], pagination: Pagination<any>) {
    this.items = items;
    this.meta = pagination.meta;
    this.links = pagination.links;
  }
}
