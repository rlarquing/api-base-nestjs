import { Body, Get, Post } from '@nestjs/common';
import { GetUser } from '../decorator';
import { UserEntity } from '../../persistence/entity';
import {FiltroGenericoDto, ResponseDto, SelectDto} from '../../shared/dto';
import { GenericService } from '../../core/service';
import { ConfigService } from '@nestjs/config';
import {ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse} from "@nestjs/swagger";

export abstract class GenericImportacionController<ENTITY> {
  protected constructor(
    protected service: GenericService<ENTITY>,
    protected configService: ConfigService,
    protected ruta: string,
  ) {}
  @Post('/importar/elementos')
  async import(
    @GetUser() user: UserEntity,
    @Body() objects: any[],
  ): Promise<ResponseDto[]> {
    return await this.service.import(user, objects);
  }
  @Get('/crear/select')
  @ApiOperation({
    summary: 'Obtener los elementos del conjunto para crear un select',
  })
  @ApiResponse({
    status: 200,
    description:
        'Muestra la información de los elementos del conjunto para crear un select',
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
    return await this.service.createSelect();
  }
  @Post('/crear/select/dependiente')
  @ApiOperation({
    summary: 'Obtener los elementos del conjunto para crear un select dependiente',
  })
  @ApiResponse({
    status: 200,
    description:
        'Muestra la información de los elementos del conjunto para crear un select dependiente',
    type: [SelectDto],
  })
  @ApiBody({
    description: 'Estructura para crear el filtrado que brinda información para el select.',
    type: FiltroGenericoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createSelectFilter( @Body() filtroGenericoDto: FiltroGenericoDto): Promise<SelectDto[]> {
    return await this.service.createSelectFilter(filtroGenericoDto);
  }
}
