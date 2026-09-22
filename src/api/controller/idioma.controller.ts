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
import { IdiomaEntity, UserEntity } from '../../persistence/entity';
import { IdiomaService } from '../../core/service';
import {
  BadRequestDto,
  BuscarDto,
  CreateIdiomaDto,
  FiltroGenericoDto,
  ListadoDto,
  ReadIdiomaDto,
  ResponseDto,
  UpdateIdiomaDto,
  UpdateMultipleIdiomaDto,
} from '../../shared/dto';
import { PaginationParamsDto, PaginationService } from '../../shared/pagination';
import { GenericController } from './generic.controller';

@ApiTags('Idiomas')
@Controller('idioma')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
export class IdiomaController extends GenericController<IdiomaEntity> {
  private header!: string[];
  private key!: string[];

  constructor(
    protected idiomaService: IdiomaService,
    protected paginationService: PaginationService,
  ) {
    super(idiomaService, paginationService, 'idioma');
    this.header = ['id', 'Codigo', 'Nombre', 'Defecto'];
    this.key = ['id', 'codigo', 'nombre', 'defecto'];
  }

  @Get('/')
  @ApiOperation({ summary: 'Obtener el listado de idiomas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de idiomas',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({ description: 'Idiomas no encontrados.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  @Servicio('idioma', 'findAll')
  async findAll(
    @PaginationParams() params: PaginationParamsDto,
  ): Promise<any> {
    const data = await super.findAll(params);
    return new ListadoDto(this.header, this.key, data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un idioma' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la informacion de un idioma',
    type: ReadIdiomaDto,
  })
  @ApiNotFoundResponse({ description: 'Idioma no encontrado.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('idioma', 'findById')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadIdiomaDto> {
    return await super.findById(id);
  }

  @Post('/elementos/multiples')
  @ApiOperation({ summary: 'Obtener multiples idiomas' })
  @ApiBody({
    description: 'Estructura para mostrar los multiples idiomas.',
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: 'Muestra la informacion de multiples idiomas',
    type: [ReadIdiomaDto],
  })
  @ApiNotFoundResponse({ description: 'Idiomas no encontrados.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('idioma', 'findByIds')
  async findByIds(@Body() ids: number[]): Promise<ReadIdiomaDto[]> {
    return await super.findByIds(ids);
  }

  @Post('/')
  @ApiOperation({ summary: 'Crear un idioma.' })
  @ApiBody({
    description: 'Estructura para crear el idioma.',
    type: CreateIdiomaDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un idioma.',
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
  @Servicio('idioma', 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createIdiomaDto: CreateIdiomaDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.create(user, createIdiomaDto, ip);
  }

  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de idiomas.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de idiomas.',
    type: [CreateIdiomaDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un grupo de idiomas.',
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
  @Servicio('idioma', 'createMultiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createIdiomaDto: CreateIdiomaDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createIdiomaDto, ip);
  }

  @Post('/importar/elementos')
  @ApiOperation({ summary: 'Importar un grupo de idiomas.' })
  @ApiBody({
    description: 'Estructura para importar el grupo de idiomas.',
    type: [CreateIdiomaDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Importa un grupo de idiomas.',
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
  @Servicio('idioma', 'import')
  async import(
    @GetUser() user: UserEntity,
    @Body() createIdiomaDto: CreateIdiomaDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto[]> {
    return await super.import(user, createIdiomaDto, ip);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un idioma.' })
  @ApiBody({
    description: 'Estructura para modificar el idioma.',
    type: UpdateIdiomaDto,
  })
  @ApiResponse({
    status: 201,
    description: 'El idioma se ha actualizado.',
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
  @Servicio('idioma', 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIdiomaDto: UpdateIdiomaDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateIdiomaDto, ip);
  }

  @Patch('/elementos/multiples')
  @ApiOperation({ summary: 'Actualizar un grupo de idiomas.' })
  @ApiBody({
    description: 'Estructura para modificar el grupo de idiomas.',
    type: [UpdateMultipleIdiomaDto],
  })
  @ApiResponse({
    status: 201,
    description: 'El grupo de idiomas se han actualizado.',
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
  @Servicio('idioma', 'updateMultiple')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() updateMultipleIdiomaDto: UpdateMultipleIdiomaDto[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await super.updateMultiple(user, updateMultipleIdiomaDto, ip);
  }

  @Post('/filtrar')
  @ApiOperation({
    summary: 'Filtrar el conjunto de idiomas por los parametros establecidos',
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
  @Servicio('idioma', 'filter')
  async filter(
    @PaginationParams() params: PaginationParamsDto,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<any> {
    const data = await super.filter(params, filtroGenericoDto);
    return new ListadoDto(this.header, this.key, data);
  }

  @Post('/buscar')
  @ApiOperation({
    summary: 'Buscar en el conjunto de idiomas por el parametro establecido',
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
  @Servicio('idioma', 'search')
  async search(
    @PaginationParams() params: PaginationParamsDto,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(params, buscarDto);
    return new ListadoDto(this.header, this.key, data);
  }
}
