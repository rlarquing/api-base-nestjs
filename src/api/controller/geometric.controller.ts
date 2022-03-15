import { Body, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GenericController } from './generic.controller';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GeometricService } from '../../core/service';
import { Servicio } from '../decorator';
import { PermissionGuard } from '../guard';
import { GeoJsonDto, TypeDto } from '../../shared/dto';

export abstract class GeometricController<
  ENTITY,
> extends GenericController<ENTITY> {
  protected constructor(
    protected service: GeometricService<ENTITY>,
    protected configService: ConfigService,
    protected ruta: string,
  ) {
    super(service, configService, ruta);
  }
  @Post('/obtener/json')
  @Servicio(undefined, 'geoJson')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  async geoJson(@Body() opciones?: TypeDto): Promise<GeoJsonDto> {
    return await this.service.geoJson(opciones);
  }
  @Post('/:id/obtener/json')
  @Servicio(undefined, 'geoJsonById')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  async geoJsonById(
    @Param('id', ParseIntPipe) id: number,
    @Body() opciones?: TypeDto,
  ): Promise<GeoJsonDto> {
    return await this.service.geoJsonById(id, opciones);
  }
}
