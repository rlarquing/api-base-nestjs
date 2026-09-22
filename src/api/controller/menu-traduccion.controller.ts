import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard, RolGuard } from '../guard';
import { GetUser, IpAddress, Servicio, PaginationParams } from '../decorator';
import { MenuTraduccionEntity, UserEntity } from '../../persistence/entity';
import { MenuTraduccionService } from '../../core/service';
import {
  BadRequestDto,
  BuscarDto,
  CreateMenuTraduccionDto,
  FiltroGenericoDto,
  ListadoDto,
  ReadMenuTraduccionDto,
  ResponseDto,
  UpdateMenuTraduccionDto,
  UpdateMultipleMenuTraduccionDto,
} from '../../shared/dto';
import { PaginationParamsDto, PaginationService } from '../../shared/pagination';
import { GenericController } from './generic.controller';

@ApiTags('Menu Traducciones')
@Controller('menu-traduccion')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
export class MenuTraduccionController extends GenericController<MenuTraduccionEntity> {
  private header!: string[];
  private key!: string[];

  constructor(
    protected menuTraduccionService: MenuTraduccionService,
    protected paginationService: PaginationService,
  ) {
    super(menuTraduccionService, paginationService, 'menu-traduccion');
    this.header = ['id', 'Menu ID', 'Idioma ID', 'Label'];
    this.key = ['id', 'menuId', 'idiomaId', 'label'];
  }

  @Get('/')
  @ApiOperation({ summary: 'Obtener el listado de traducciones de menu' })
  @ApiResponse({
    status: 200,
    description: 'Listado de traducciones de menu',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    description: 'Traducciones de menu no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  @Servicio('menuTraduccion', 'findAll')
  async findAll(
    @PaginationParams() params: PaginationParamsDto,
  ): Promise<any> {
    const data = await super.findAll(params);
    return new ListadoDto(this.header, this.key, data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una traduccion de menu' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la informacion de una traduccion de menu',
    type: ReadMenuTraduccionDto,
  })
  @ApiNotFoundResponse({ description: 'Traduccion de menu no encontrada.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('menuTraduccion', 'findById')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadMenuTraduccionDto> {
    return await super.findById(id);
  }

  @Post('/elementos/multiples')
  @ApiOperation({ summary: 'Obtener multiples traducciones de menu' })
  @ApiBody({
    description: 'Estructura para mostrar las multiples traducciones.',
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: 'Muestra la informacion de multiples traducciones',
    type: [ReadMenuTraduccionDto],
  })
  @ApiNotFoundResponse({
    description: 'Traducciones de menu no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('menuTraduccion', 'findByIds')
  async findByIds(@Body() ids: number[]): Promise<ReadMenuTraduccionDto[]> {
    return await super.findByIds(ids);
  }

  @Post('/')
  @ApiOperation({ summary: 'Crear una traduccion de menu.' })
  @ApiBody({
    description: 'Estructura para crear la traduccion de menu.',
    type: CreateMenuTraduccionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Crea una traduccion de menu.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  @Servicio('menuTraduccion', 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createDto: CreateMenuTraduccionDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.create(user, createDto, ip);
  }

  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de traducciones de menu.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de traducciones.',
    type: [CreateMenuTraduccionDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un grupo de traducciones de menu.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  @Servicio('menuTraduccion', 'createMultiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createDto: CreateMenuTraduccionDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createDto, ip);
  }

  @Post('/importar/elementos')
  @ApiOperation({ summary: 'Importar un grupo de traducciones de menu.' })
  @ApiBody({
    description: 'Estructura para importar el grupo de traducciones.',
    type: [CreateMenuTraduccionDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Importa un grupo de traducciones de menu.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  @Servicio('menuTraduccion', 'import')
  async import(
    @GetUser() user: UserEntity,
    @Body() createDto: CreateMenuTraduccionDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto[]> {
    return await super.import(user, createDto, ip);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar una traduccion de menu.' })
  @ApiBody({
    description: 'Estructura para modificar la traduccion de menu.',
    type: UpdateMenuTraduccionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'La traduccion de menu se ha actualizado.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  @Servicio('menuTraduccion', 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMenuTraduccionDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateDto, ip);
  }

  @Patch('/elementos/multiples')
  @ApiOperation({ summary: 'Actualizar un grupo de traducciones de menu.' })
  @ApiBody({
    description:
      'Estructura para modificar el grupo de traducciones de menu.',
    type: [UpdateMultipleMenuTraduccionDto],
  })
  @ApiResponse({
    status: 201,
    description: 'El grupo de traducciones se han actualizado.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  @Servicio('menuTraduccion', 'updateMultiple')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() updateDto: UpdateMultipleMenuTraduccionDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.updateMultiple(user, updateDto, ip);
  }

  @Post('/filtrar')
  @ApiOperation({
    summary:
      'Filtrar el conjunto de traducciones de menu por los parametros establecidos',
  })
  @ApiResponse({
    status: 201,
    description: 'Filtra el conjunto por los parametros que se le puedan pasar',
    type: ListadoDto,
  })
  @ApiBody({
    description: 'Estructura para crear el filtrado.',
    type: FiltroGenericoDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  @Servicio('menuTraduccion', 'filter')
  async filter(
    @PaginationParams() params: PaginationParamsDto,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<any> {
    const data = await super.filter(params, filtroGenericoDto);
    return new ListadoDto(this.header, this.key, data);
  }

  @Post('/buscar')
  @ApiOperation({
    summary:
      'Buscar en el conjunto de traducciones de menu por el parametro establecido',
  })
  @ApiResponse({
    status: 201,
    description: 'Busca en el conjunto en el parametro establecido',
    type: ListadoDto,
  })
  @ApiBody({
    description: 'Estructura para crear la busqueda.',
    type: BuscarDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  @Servicio('menuTraduccion', 'search')
  async search(
    @PaginationParams() params: PaginationParamsDto,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(params, buscarDto);
    return new ListadoDto(this.header, this.key, data);
  }
}
