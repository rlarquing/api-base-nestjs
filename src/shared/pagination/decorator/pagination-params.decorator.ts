import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationParamsDto } from '../dto/pagination-params.dto';

/**
 * Decorador de parámetros que extrae page, limit y sinPaginacion
 * de los query params de la request.
 *
 * Uso:
 * ```typescript
 * @Get('/')
 * async findAll(@PaginationParams() params: PaginationParamsDto) {
 *   // params.page, params.limit, params.sinPaginacion
 * }
 * ```
 */
export const PaginationParams = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PaginationParamsDto => {
    const req = ctx.switchToHttp().getRequest();
    const query = req.query;

    const page = parseInt(query.page, 10) || 1;
    const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
    const sinPaginacion = query.sinPaginacion === 'true';

    return new PaginationParamsDto(page, limit, sinPaginacion);
  },
);
