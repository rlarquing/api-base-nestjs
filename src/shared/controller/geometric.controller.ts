import { Body, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@atlasjs/config';
import { GeometricService } from '../service';
import { GeoJsonDto, ReproyectarDto, TypeDto } from '../dto';
import { GenericController } from './generic.controller';

export abstract class GeometricController<
  ENTITY
> extends GenericController<ENTITY> {
  protected constructor(
    protected service: GeometricService<ENTITY>,
    protected configService: ConfigService,
    protected ruta: string,
  ) {
    super(service, configService, ruta);
  }

  @Post('obtener/json')
  async geoJson(@Body() opciones?: TypeDto): Promise<GeoJsonDto> {
    return await this.service.geoJson(opciones);
  }

  @Post(':id/obtener/json')
  async geoJsonById(
    @Param('id', ParseIntPipe) id: number,
    @Body() opciones?: TypeDto,
  ): Promise<GeoJsonDto> {
    return await this.service.geoJsonById(
      id,
      opciones
    );
  }
}
