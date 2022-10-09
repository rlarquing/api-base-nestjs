import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ProvinciaService } from '../../core/service';
import { GeoJsonDto, ReadProvinciaDto } from '../../shared/dto';
import { AppConfig } from '../../app.keys';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Provincias')
@Controller('provincia')
export class ProvinciaController {
  constructor(
    private provinciaService: ProvinciaService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado de las provincias' })
  @ApiResponse({
    status: 200,
    description: 'Listado de las provincias',
    type: ReadProvinciaDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Provincias no encontradas.',
  })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<ReadProvinciaDto>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.provinciaService.findAll({
      page,
      limit,
      route: url + '/provincia',
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una provincia' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de una provincia',
    type: ReadProvinciaDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'provincia no encontrada.',
  })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadProvinciaDto> {
    return await this.provinciaService.findById(id);
  }

  @Get('/obtener/json')
  @ApiOperation({ summary: 'Obtener el geojson de las provincias' })
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de las provincias',
    type: GeoJsonDto,
  })
  async geoJson(): Promise<GeoJsonDto> {
    return await this.provinciaService.geoJson();
  }

  @Get('/:id/obtener/json')
  @ApiOperation({ summary: 'Obtener el geojson de una provincia' })
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de una provincia',
    type: GeoJsonDto,
  })
  async geoJsonById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GeoJsonDto> {
    return await this.provinciaService.geoJsonById(id);
  }

  @Get('/obtener/centroide/json')
  @ApiOperation({ summary: 'Obtener el centoide de una provincia' })
  @ApiResponse({
    status: 200,
    description: 'Muestra el centroide de una provincia',
    type: GeoJsonDto,
  })
  async centroide(): Promise<GeoJsonDto> {
    return await this.provinciaService.centroide();
  }
}
