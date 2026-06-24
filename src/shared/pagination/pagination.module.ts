import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaginationService } from './pagination.service';

/**
 * Módulo global de paginación.
 *
 * Provee:
 * - PaginationService: construcción centralizada de IPaginationOptions
 * - PaginationParams decorator: extracción de parámetros de query
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
