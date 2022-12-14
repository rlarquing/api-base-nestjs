import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MunicipioService } from '../../core/service';
import { GeoJsonDto, ReadMunicipioDto, SelectDto } from '../../shared/dto';
import { AppConfig } from '../../app.keys';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('Municipios')
@Controller('municipio')
export class MunicipioController {
  constructor(
    private municipioService: MunicipioService,
    private configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado de los municipios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de los municipios',
    type: ReadMunicipioDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Municipios no encontrados.',
  })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<ReadMunicipioDto>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.municipioService.findAll({
      page,
      limit,
      route: url + '/municipios',
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un municipio' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un municipio',
    type: ReadMunicipioDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Municipio no encontrado.',
  })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadMunicipioDto> {
    return await this.municipioService.findById(id);
  }

  @ApiOperation({ summary: 'Listado de los municipios de una provincia' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de los municipios de una provincia',
    type: ReadMunicipioDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Municipios no encontrados.',
  })
  @Get('/provincia/:id')
  async findByProvincia(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadMunicipioDto[]> {
    return await this.municipioService.findByProvincia(id);
  }

  @Get('/obtener/json')
  @ApiOperation({ summary: 'Obtener el geojson de los municipios' })
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de los municipios',
    type: GeoJsonDto,
  })
  async geoJson(): Promise<GeoJsonDto> {
    return await this.municipioService.geoJson();
  }

  @Get('/provincia/obtener/json')
  @ApiOperation({
    summary: 'Obtener el geojson de los municipios de una provincia',
  })
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de los municipios de una provincia',
    type: GeoJsonDto,
  })
  async geoJsonByProvincia(): Promise<GeoJsonDto> {
    return await this.municipioService.geoJsonByProvincia();
  }

  @Get('/:id/obtener/json')
  @ApiOperation({ summary: 'Obtener el geojson de un municipio' })
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de un municipio',
    type: GeoJsonDto,
  })
  async geoJsonById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GeoJsonDto> {
    return await this.municipioService.geoJsonById(id);
  }

  @Get('/create/select')
  @ApiOperation({
    summary: 'Listar municipios por su provincia para crear un select.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listado de los municipios por su provincia para crear un select.',
    type: [SelectDto],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createSelect(): Promise<SelectDto[]> {
    return await this.municipioService.createSelect();
  }
}
