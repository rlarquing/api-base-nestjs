import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../app.keys';
import { IPaginationOptions } from './types';

/**
 * Servicio centralizado para construir opciones de paginación.
 *
 * Elimina la repetición de obtener la URL base del ConfigService
 * en cada controlador y unifica el límite máximo de elementos.
 */
@Injectable()
export class PaginationService {
  constructor(private configService: ConfigService) {}

  /**
   * Construye las opciones de paginación con la ruta completa.
   *
   * @param page - Número de página (default: 1)
   * @param limit - Elementos por página (default: 10, máx: 100)
   * @param baseRoute - Ruta base para los links de paginación (ej: 'user', 'rol')
   * @param sinPaginacion - Si es true, no se necesita route
   */
  buildOptions(
    page: number,
    limit: number,
    baseRoute: string,
    sinPaginacion = false,
  ): IPaginationOptions {
    const safeLimit = Math.min(limit || 10, 100);
    const options: IPaginationOptions = {
      page: page || 1,
      limit: safeLimit,
    };

    if (!sinPaginacion) {
      const url = this.configService.get<string>(AppConfig.URL) ?? '';
      options.route = `${url}/api/${baseRoute}`;
    }

    return options;
  }
}
