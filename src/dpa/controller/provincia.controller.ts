import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProvinciaService } from '../service';
import { ReadProvinciaDto } from '../dto';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AppConfig } from '../../app.keys';
import { GeoJsonDto } from '../../shared/dto';
import { ConfigService } from '@nestjs/config';

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
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<ReadProvinciaDto>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    const port = this.configService.get(AppConfig.PORT);
    return await this.provinciaService.findAll({
      page,
      limit,
      route: url + ':' + port + '/provincia',
    });
  }

  @Get(':id')
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

  @Get('obtener/json')
  @ApiOperation({ summary: 'Obtener el geojson de las provincias' })
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de las provincias',
    type: GeoJsonDto,
  })
  async geoJson(): Promise<GeoJsonDto> {
    return await this.provinciaService.geoJson();
  }

  @Get(':id/obtener/json')
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
}
