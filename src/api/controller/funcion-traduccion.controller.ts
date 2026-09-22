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
import { FuncionTraduccionEntity, UserEntity } from '../../persistence/entity';
import { FuncionTraduccionService } from '../../core/service';
import {
  BadRequestDto,
  BuscarDto,
  CreateFuncionTraduccionDto,
  FiltroGenericoDto,
  ListadoDto,
  ReadFuncionTraduccionDto,
  ResponseDto,
  UpdateFuncionTraduccionDto,
  UpdateMultipleFuncionTraduccionDto,
} from '../../shared/dto';
import { PaginationParamsDto, PaginationService } from '../../shared/pagination';
import { GenericController } from './generic.controller';

@ApiTags('Funcion Traducciones')
@Controller('funcion-traduccion')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
export class FuncionTraduccionController extends GenericController<FuncionTraduccionEntity> {
  private header!: string[];
  private key!: string[];

  constructor(
    protected funcionTraduccionService: FuncionTraduccionService,
    protected paginationService: PaginationService,
  ) {
    super(funcionTraduccionService, paginationService, 'funcion-traduccion');
    this.header = ['id', 'Funcion ID', 'Idioma ID', 'Nombre', 'Descripcion'];
    this.key = ['id', 'funcionId', 'idiomaId', 'nombre', 'descripcion'];
  }

  @Get('/')
  @ApiOperation({ summary: 'Obtener el listado de traducciones de funcion' })
  @ApiResponse({
    status: 200,
    description: 'Listado de traducciones de funcion',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    description: 'Traducciones de funcion no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  @Servicio('funcionTraduccion', 'findAll')
  async findAll(
    @PaginationParams() params: PaginationParamsDto,
  ): Promise<any> {
    const data = await super.findAll(params);
    return new ListadoDto(this.header, this.key, data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una traduccion de funcion' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la informacion de una traduccion de funcion',
    type: ReadFuncionTraduccionDto,
  })
  @ApiNotFoundResponse({ description: 'Traduccion de funcion no encontrada.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('funcionTraduccion', 'findById')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadFuncionTraduccionDto> {
    return await super.findById(id);
  }

  @Post('/elementos/multiples')
  @ApiOperation({ summary: 'Obtener multiples traducciones de funcion' })
  @ApiBody({
    description: 'Estructura para mostrar las multiples traducciones.',
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: 'Muestra la informacion de multiples traducciones',
    type: [ReadFuncionTraduccionDto],
  })
  @ApiNotFoundResponse({
    description: 'Traducciones de funcion no encontradas.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('funcionTraduccion', 'findByIds')
  async findByIds(
    @Body() ids: number[],
  ): Promise<ReadFuncionTraduccionDto[]> {
    return await super.findByIds(ids);
  }

  @Post('/')
  @ApiOperation({ summary: 'Crear una traduccion de funcion.' })
  @ApiBody({
    description: 'Estructura para crear la traduccion de funcion.',
    type: CreateFuncionTraduccionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Crea una traduccion de funcion.',
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
  @Servicio('funcionTraduccion', 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createDto: CreateFuncionTraduccionDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.create(user, createDto, ip);
  }

  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de traducciones de funcion.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de traducciones.',
    type: [CreateFuncionTraduccionDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un grupo de traducciones de funcion.',
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
  @Servicio('funcionTraduccion', 'createMultiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createDto: CreateFuncionTraduccionDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createDto, ip);
  }

  @Post('/importar/elementos')
  @ApiOperation({ summary: 'Importar un grupo de traducciones de funcion.' })
  @ApiBody({
    description: 'Estructura para importar el grupo de traducciones.',
    type: [CreateFuncionTraduccionDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Importa un grupo de traducciones de funcion.',
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
  @Servicio('funcionTraduccion', 'import')
  async import(
    @GetUser() user: UserEntity,
    @Body() createDto: CreateFuncionTraduccionDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto[]> {
    return await super.import(user, createDto, ip);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar una traduccion de funcion.' })
  @ApiBody({
    description: 'Estructura para modificar la traduccion de funcion.',
    type: UpdateFuncionTraduccionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'La traduccion de funcion se ha actualizado.',
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
  @Servicio('funcionTraduccion', 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateFuncionTraduccionDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateDto, ip);
  }

  @Patch('/elementos/multiples')
  @ApiOperation({
    summary: 'Actualizar un grupo de traducciones de funcion.',
  })
  @ApiBody({
    description:
      'Estructura para modificar el grupo de traducciones de funcion.',
    type: [UpdateMultipleFuncionTraduccionDto],
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
  @Servicio('funcionTraduccion', 'updateMultiple')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() updateDto: UpdateMultipleFuncionTraduccionDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.updateMultiple(user, updateDto, ip);
  }

  @Post('/filtrar')
  @ApiOperation({
    summary:
      'Filtrar el conjunto de traducciones de funcion por los parametros establecidos',
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
  @Servicio('funcionTraduccion', 'filter')
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
      'Buscar en el conjunto de traducciones de funcion por el parametro establecido',
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
  @Servicio('funcionTraduccion', 'search')
  async search(
    @PaginationParams() params: PaginationParamsDto,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(params, buscarDto);
    return new ListadoDto(this.header, this.key, data);
  }
}
