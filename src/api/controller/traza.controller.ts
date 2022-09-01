import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorator';
import { Roles } from '../decorator';
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
import { ConfigService } from '@nestjs/config';
import { RolType } from '../../shared/enum';
import { TrazaService } from '../../core/service';
import { FiltroDto, ListadoDto, TrazaDto } from '../../shared/dto';
import { AppConfig } from '../../app.keys';
import { UserEntity } from '../../persistence/entity';

@ApiTags('Trazas')
@Controller('traza')
@Roles(RolType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RolGuard)
@ApiBearerAuth()
export class TrazaController {
  constructor(
    private trazaService: TrazaService,
    private configService: ConfigService,
  ) {}
  @Get('/')
  @ApiOperation({ summary: 'Obtener el listado de las trazas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de las trazas',
    type: TrazaDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Trazas no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  @ApiQuery({ required: false, name: 'page', example: 1 })
  @ApiQuery({ required: false, name: 'limit', example: 10 })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    const data = await this.trazaService.findAll({
      page,
      limit,
      path: url + '/api/' + '/trazas',
    });
    const header: string[] = [
      'id',
      'Usuario',
      'Fecha',
      'Model',
      'Acción',
      'Registro'

    ];
    const key: string[] = [
      'id',
      'user',
      'date',
      'model',
      'action',
      'record'
    ];
    return new ListadoDto(header, key, data);
  }
  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una traza' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de una traza',
    type: TrazaDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Traza no encontrada.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servicor.' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<TrazaDto> {
    return await this.trazaService.findById(id);
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
    return await this.trazaService.delete(id);
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
    return await this.trazaService.findByFiltrados(user, filtroDto);
  }
}
