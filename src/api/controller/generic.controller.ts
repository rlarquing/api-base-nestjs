import {
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AppConfig } from '../../app.keys';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { IController } from '../../shared/interface';
import { GenericService } from '../../core/service';
import {
  BuscarDto,
  FiltroGenericoDto,
  ResponseDto,
  SelectDto,
} from '../../shared/dto';
import { GetUser, Servicio } from '../decorator';
import { PermissionGuard, RolGuard } from '../guard';
import { UserEntity } from '../../persistence/entity';

export abstract class GenericController<ENTITY> implements IController {
  protected constructor(
    protected service: GenericService<ENTITY>,
    protected configService: ConfigService,
    protected ruta: string,
  ) {}
  @Get('/')
  async findAll(
    page?: number,
    limit?: number,
    sinPaginacion?: boolean,
  ): Promise<Pagination<any> | any[]> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.service.findAll(
      {
        page,
        limit,
        route: url + '/api/' + this.ruta,
      },
      sinPaginacion,
    );
  }
  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.service.findById(id);
  }
  @Post('/elementos/multiples')
  async findByIds(@Body() ids: number[]): Promise<any[]> {
    return await this.service.findByIds(ids);
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
  @Post('/')
  async create(
    @GetUser() user: UserEntity,
    @Body() object: any,
  ): Promise<ResponseDto> {
    return await this.service.create(user, object);
  }
  @Post('/multiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() objects: any[],
  ): Promise<ResponseDto[]> {
    return await this.service.createMultiple(user, objects);
  }

  @Post('/importar/elementos')
  async import(
    @GetUser() user: UserEntity,
    @Body() objects: any[],
  ): Promise<ResponseDto[]> {
    return await this.service.import(user, objects);
  }

  @Patch('/:id')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() object: any,
  ): Promise<ResponseDto> {
    return await this.service.update(user, id, object);
  }
  @Patch('/elementos/multiples')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() objects: any[],
  ): Promise<ResponseDto> {
    let result = new ResponseDto();
    for (const item of objects) {
      result = await this.service.update(user, item.id, item);
    }
    return result;
  }
  @Delete('/:id')
  @ApiOperation({
    summary: 'Eliminar un elemento del conjunto utilizando borrado virtual.',
  })
  @ApiResponse({ status: 201, description: 'El elemento se ha eliminado.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(undefined, 'delete')
  @UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
  @ApiBearerAuth()
  async delete(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto> {
    return await this.service.deleteMultiple(user, [id]);
  }
  @Delete('/elementos/multiples')
  @ApiOperation({
    summary:
      'Eliminar un grupo de elementos del conjunto utilizando borrado virtual.',
  })
  @ApiBody({
    description: 'Estructura para eliminar el grupo de elementos del conjunto.',
    type: [Number],
  })
  @ApiResponse({ status: 201, description: 'El elemento se ha eliminado.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(undefined, 'deleteMultiple')
  @UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
  @ApiBearerAuth()
  async deleteMultiple(
    @GetUser() user: UserEntity,
    @Body() ids: number[],
  ): Promise<ResponseDto> {
    return await this.service.deleteMultiple(user, ids);
  }
  @Delete('/:id/delete/real')
  @ApiOperation({
    summary: 'Eliminar un elemento del conjunto utilizando borrado real.',
  })
  @ApiResponse({ status: 201, description: 'El elemento se ha eliminado.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(undefined, 'remove')
  @UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
  @ApiBearerAuth()
  async remove(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResult> {
    return await this.service.removeMultiple(user, [id]);
  }
  @Delete('/delete/real/elementos/multiples')
  @ApiOperation({
    summary:
      'Eliminar un grupo de elementos del conjunto utilizando borrado real.',
  })
  @ApiBody({
    description: 'Estructura para eliminar el grupo de elementos del conjunto.',
    type: [Number],
  })
  @ApiResponse({ status: 201, description: 'El elemento se ha eliminado.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(undefined, 'removeMultiple')
  @UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
  @ApiBearerAuth()
  async removeMultiple(
    @GetUser() user: UserEntity,
    @Body() ids: number[],
  ): Promise<DeleteResult> {
    return await this.service.removeMultiple(user, ids);
  }
  @ApiOperation({
    summary: 'Mostrar la cantidad de elementos que tiene el conjunto.',
  })
  @ApiResponse({
    status: 201,
    description: 'Muestra la cantidad de elementos del conjunto.',
    type: Number,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(undefined, 'count')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Get('/cantidad/elementos')
  async count(): Promise<number> {
    return await this.service.count();
  }
  @Post('/filtro/por')
  async filter(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<Pagination<any>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.service.filter(
      {
        page,
        limit,
        route: url + '/api/' + this.ruta + '/filtro/por',
      },
      filtroGenericoDto,
    );
  }
  @Post('/buscar')
  async search(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() buscarDto: BuscarDto,
  ): Promise<Pagination<any>> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    return await this.service.search(
      {
        page,
        limit,
        route: url + '/api/' + this.ruta + '/buscar',
      },
      buscarDto,
    );
  }
}
