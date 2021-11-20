import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {RolType} from "../../security/enum/rol-type.enum";
import {RolGuard} from "../../security/guard/rol.guard";
import {MunicipioService} from "../service";
import {ReadMunicipioDto} from "../dto";
import {Pagination} from "nestjs-typeorm-paginate";
import {ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AppConfig} from "../../app.keys";
import {ConfigService} from "@atlasjs/config";
import {Roles} from "../../security/decorator";
import {GeoJsonDto} from "../../shared/dto";

@ApiTags('Municipios')
@Controller('municipio')
@Roles(
    RolType.ADMINISTRADOR,
    RolType.USUARIO,
)
@UseGuards(AuthGuard(), RolGuard)
export class MunicipioController {
  constructor(
      private municipioService: MunicipioService,
      private configService: ConfigService
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
  async findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
  ): Promise<Pagination<ReadMunicipioDto>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.config[AppConfig.URL];
    const port= this.configService.config[AppConfig.PORT];
    return await this.municipioService.findAll({
      page,
      limit,
      route: url+':'+port+'/municipios',
    });
  }

  @Get(':id')
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
  async findByProvincia(@Param('id', ParseIntPipe) id: number,
  ): Promise<ReadMunicipioDto[]> {
    return await this.municipioService.findByProvincia(id);
  }

  @Get('obtener/json')
  @ApiOperation({summary: 'Obtener el geojson de los municipios'})
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de los municipios',
    type: GeoJsonDto,
  })
  async geoJson(): Promise<GeoJsonDto>{
    return await this.municipioService.geoJson();
  }

  @Get(':id/obtener/json')
  @ApiOperation({summary: 'Obtener el geojson de un municipio'})
  @ApiResponse({
    status: 200,
    description: 'Muestra el geojson de un municipio',
    type: GeoJsonDto,
  })
  async geoJsonById(@Param('id', ParseIntPipe) id: number,): Promise<GeoJsonDto>{
    return await this.municipioService.geoJsonById(id);
  }
}
