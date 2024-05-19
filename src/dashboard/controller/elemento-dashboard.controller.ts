import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestDto,
  BuscarDto,
  FiltroGenericoDto,
  ListadoDto,
  ResponseDto,
} from '../../shared/dto';
import {PermissionGuard, RolGuard} from "../../api/guard";
import {GenericController} from "../../api/controller";
import {ElementoDashboardEntity} from "../entity/elemento-dashboard.entity";
import {ElementoDashboardService} from "../service";
import {GetUser, Servicio} from "../../api/decorator";
import {
  CreateElementoDashboardDto,
  ReadElementoDashboardDto,
  UpdateElementoDashboardDto,
  UpdateMultipleElementoDashboardDto
} from "../dto";
import {UserEntity} from "../../persistence/entity";

@ApiTags('ElementoDashboards')
@Controller('elemento-dashboard')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
export class ElementoDashboardController extends GenericController<ElementoDashboardEntity> {
  constructor(
    protected elementoDashboardService: ElementoDashboardService,
    protected configService: ConfigService,
  ) {
    super(elementoDashboardService, configService, 'elemento-dashboard');
  }

  @Get('/')
  @ApiOperation({ summary: 'Obtener el listado de elementos del conjunto' })
  @ApiResponse({
    status: 200,
    description: 'Listado de elementos del conjunto',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elementos del conjunto no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiParam({ required: false, name: 'page', example: '1' })
  @ApiParam({ required: false, name: 'limit', example: '10' })
  @Servicio('elementoDashboard', 'findAll')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    const data = await super.findAll(page, limit);
    const header: string[] = ['id', 'Nombre', 'Tipo', 'Capa', 'Consulta'];
    const key: string[] = ['id', 'nombre', 'tipo', 'capa', 'consulta'];
    return new ListadoDto(header, key, data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un elemento del conjunto' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un elemento del conjunto',
    type: ReadElementoDashboardDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('elementoDashboard', 'findById')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadElementoDashboardDto> {
    return await super.findById(id);
  }

  @Post('/elementos/multiples')
  @ApiOperation({ summary: 'Obtener multiples elementos del conjunto' })
  @ApiBody({
    description:
      'Estructura para mostrar los multiples elementos del conjunto.',
    type: [Number],
  })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de multiples elementos del conjunto',
    type: [ReadElementoDashboardDto],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elementos del conjunto no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('elementoDashboard', 'findByIds')
  async findByIds(@Body() ids: number[]): Promise<ReadElementoDashboardDto[]> {
    return await super.findByIds(ids);
  }

  @Post('/')
  @ApiOperation({ summary: 'Crear un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el elemento del conjunto.',
    type: CreateElementoDashboardDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un elemento del conjunto.',
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
  @Servicio('elementoDashboard', 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createElementoDashboardDto: CreateElementoDashboardDto,
  ): Promise<ResponseDto> {
    return await super.create(user, createElementoDashboardDto);
  }

  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateElementoDashboardDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un grupo de elementos del conjunto.',
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
  @Servicio('elementoDashboard', 'createMultiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createElementoDashboardDto: CreateElementoDashboardDto[],
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createElementoDashboardDto);
  }

  @Post('/importar/elementos')
  @ApiOperation({ summary: 'Importar un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateElementoDashboardDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un grupo de elementos del conjunto.',
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
  @Servicio('elementoDashboard', 'importar')
  async importar(
    @GetUser() user: UserEntity,
    @Body() createElementoDashboardDto: CreateElementoDashboardDto[],
  ): Promise<ResponseDto[]> {
    return await super.import(user, createElementoDashboardDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para modificar el elemento del conjunto.',
    type: UpdateElementoDashboardDto,
  })
  @ApiResponse({
    status: 201,
    description: 'El elemento se ha actualizado.',
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
  @Servicio('elementoDashboard', 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateElementoDashboardDto: UpdateElementoDashboardDto,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateElementoDashboardDto);
  }

  @Patch('/elementos/multiples')
  @ApiOperation({ summary: 'Actualizar un grupo de elementos del conjunto.' })
  @ApiBody({
    description:
      'Estructura para modificar el grupo de elementos del conjunto.',
    type: [UpdateMultipleElementoDashboardDto],
  })
  @ApiResponse({
    status: 201,
    description: 'El grupo de elementos se han actualizado.',
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
  @Servicio('elementoDashboard', 'updateMultiple')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body()
    updateMultipleElementoDashboardeDto: UpdateMultipleElementoDashboardDto[],
  ): Promise<ResponseDto> {
    return await super.updateMultiple(
      user,
      updateMultipleElementoDashboardeDto,
    );
  }

  @Post('filtrar')
  @ApiOperation({
    summary: 'Filtrar el conjunto por los parametros establecidos',
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
  @Servicio('elementoDashboard', 'filter')
  async filter(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<any> {
    const data = await super.filter(page, limit, filtroGenericoDto);
    const header: string[] = ['id', 'Nombre', 'Tipo', 'Capa', 'Consulta'];
    const key: string[] = ['id', 'nombre', 'tipo', 'capa', 'consulta'];
    return new ListadoDto(header, key, data);
  }
  @Post('buscar')
  @ApiOperation({
    summary: 'Buscar en el conjunto por el parametro establecido',
  })
  @ApiResponse({
    status: 201,
    description: 'Busca en el conjunto en el parametros establecido',
    type: ListadoDto,
  })
  @ApiBody({
    description: 'Estructura para crear la busqueda.',
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  @Servicio('elementoDashboard', 'search')
  async search(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(page, limit, buscarDto);
    const header: string[] = ['id', 'Nombre', 'Tipo', 'Capa', 'Consulta'];
    const key: string[] = ['id', 'nombre', 'tipo', 'capa', 'consulta'];
    return new ListadoDto(header, key, data);
  }
}
