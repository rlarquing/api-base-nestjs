import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationParamsDto {
  @ApiPropertyOptional({ description: 'Número de página', example: 1, default: 1 })
  page: number;

  @ApiPropertyOptional({ description: 'Elementos por página (máx. 100)', example: 10, default: 10 })
  limit: number;

  @ApiPropertyOptional({ description: 'Desactivar paginación', example: false, default: false })
  sinPaginacion: boolean;

  constructor(page = 1, limit = 10, sinPaginacion = false) {
    this.page = page;
    this.limit = Math.min(limit, 100);
    this.sinPaginacion = sinPaginacion;
  }
}
