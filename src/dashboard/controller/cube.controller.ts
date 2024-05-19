import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ListadoDto } from '../../shared/dto';
import { AppConfig } from '../../app.keys';
import {CubeService} from "../service";

@ApiTags('Cubes')
@Controller('cube')
export class CubeController {
  constructor(
    private cubeService: CubeService,
    private configService: ConfigService,
  ) {}
  @Get('/:id')
  @ApiOperation({ summary: 'Obtener el listado de las cubes' })
  @ApiResponse({
    status: 200,
    description: 'Listado de las cubes',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Cubes no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async findAll(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ListadoDto> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.cubeService.findPaginado(id, {
      page,
      limit,
      route: url + '/api/cube/' + id,
    });
  }

  @Get('/:id/search/:criterio')
  @ApiOperation({
    summary: 'Obtener el listado de los cubos por un criterio de búsqueda',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de los cubos',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Cubes no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async search(
    @Param('id', ParseIntPipe) id: number,
    @Param('criterio') criterio: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ListadoDto> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    if (criterio === '') {
      return await this.findAll(id, page, limit);
    }
    return await this.cubeService.search(
      id,
      {
        page,
        limit,
        route: url + '/api/cube/' + id + '/search/' + criterio,
      },
      criterio,
    );
  }
}
