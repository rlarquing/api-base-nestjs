import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Roles, PaginationParams } from '../decorator';
import { RolGuard } from '../guard';
import { DeleteResult } from 'typeorm';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolType } from '../../shared/enum';
import { LogHistoryService } from '../../core/service';
import {
  EstadisticaTrazaDto,
  FiltroDto,
  ListadoDto,
  LogHistoryDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';
import { PaginationParamsDto, PaginationService } from '../../shared/pagination';

@ApiTags('Log-histories')
@Controller('log-history')
@Roles(RolType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RolGuard)
@ApiBearerAuth()
export class LogHistoryController {
  constructor(
    private logHistoryService: LogHistoryService,
    private paginationService: PaginationService,
  ) {}
  @Get('/')
  @ApiOperation({ summary: 'Obtener el listado de las trazas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de las trazas',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    description: 'Trazas no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async findAll(
    @PaginationParams() params: PaginationParamsDto,
  ): Promise<any> {
    const options = this.paginationService.buildOptions(
      params.page, params.limit, 'traza',
    );
    const data = await this.logHistoryService.findAll(options);
    const header: string[] = [
      'id',
      'Usuario',
      'Fecha',
      'Model',
      'Acción',
      'Registro',
    ];
    const key: string[] = ['id', 'user', 'date', 'model', 'action', 'record'];
    return new ListadoDto(header, key, data);
  }
  @Get('/estadisticas/resumen')
  @ApiOperation({
    summary: 'Resumen de trazas para el panel de administración',
  })
  @ApiResponse({
    status: 200,
    description:
      'Totales de trazas, desglose por acción y tabla, y serie de los últimos 7 días',
    type: EstadisticaTrazaDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async estadisticas(): Promise<EstadisticaTrazaDto> {
    return await this.logHistoryService.estadisticas();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una traza' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de una traza',
    type: LogHistoryDto,
  })
  @ApiNotFoundResponse({
   
    description: 'Traza no encontrada.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<LogHistoryDto> {
    return await this.logHistoryService.findById(id);
  }
  @ApiOperation({ summary: 'Eliminar una traza' })
  @ApiResponse({
    status: 200,
    description: 'Elimina de una traza',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.logHistoryService.delete(id);
  }
  @Post('/filtro/por')
  @ApiOperation({
    summary: 'Filtrar por un usuario y los parametros establecidos',
  })
  @ApiResponse({
    status: 201,
    description: 'Filtra por un usuario y parametros que se le puedan pasar',
  })
  @ApiBody({
    description: 'Estructura para crear el filtrado de la traza.',
    type: FiltroDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  async findByFiltrados(
    @GetUser() user: UserEntity,
    @Body() filtroDto: FiltroDto,
  ): Promise<any> {
    return await this.logHistoryService.findByFiltrados(user, filtroDto);
  }
}
