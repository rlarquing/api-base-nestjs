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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard, RolGuard } from '../guard';
import { GetUser, Roles, Servicio } from '../decorator';
import { GenericController } from './generic.controller';
import { FuncionEntity, UserEntity } from '../../persistence/entity';
import { FuncionService } from '../../core/service';
import { RolType } from '../../shared/enum';
import {
  BadRequestDto,
  BuscarDto,
  CreateFuncionDto,
  FiltroGenericoDto,
  ListadoDto,
  ReadFuncionDto,
  ResponseDto,
  UpdateFuncionDto,
  UpdateMultipleFuncionDto,
} from '../../shared/dto';

@ApiTags('Funcions')
@Controller('funcion')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
export class FuncionController extends GenericController<FuncionEntity> {
  constructor(
    protected funcionService: FuncionService,
    protected configService: ConfigService,
  ) {
    super(funcionService, configService, 'funcion');
  }

  @Get('/')
  @Roles(RolType.ADMINISTRADOR) //El decorador roles no trabaja arriba en la cabeza del controlador.
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
  @Servicio('funcion', 'findAll')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    const data = await super.findAll(page, limit);
    const header: string[] = [
      'id',
      'Nombre',
      'Descripcion',
      'EndPoints',
      'Menu',
    ];
    return new ListadoDto(header, data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un elemento del conjunto' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un elemento del conjunto',
    type: ReadFuncionDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('funcion', 'findById')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadFuncionDto> {
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
    type: [ReadFuncionDto],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elementos del conjunto no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('funcion', 'findByIds')
  async findByIds(@Body() ids: number[]): Promise<ReadFuncionDto[]> {
    return await super.findByIds(ids);
  }

  @Post('/')
  @ApiOperation({ summary: 'Crear un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el elemento del conjunto.',
    type: CreateFuncionDto,
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
  @Servicio('funcion', 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createFuncionDto: CreateFuncionDto,
  ): Promise<ResponseDto> {
    return await super.create(user, createFuncionDto);
  }

  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateFuncionDto],
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
  @Servicio('funcion', 'createMultiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createFuncionDto: CreateFuncionDto[],
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createFuncionDto);
  }

  @Post('/importar/elementos')
  @ApiOperation({ summary: 'Importar un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateFuncionDto],
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
  @Servicio('funcion', 'import')
  async import(
    @GetUser() user: UserEntity,
    @Body() createFuncionDto: CreateFuncionDto[],
  ): Promise<ResponseDto[]> {
    return await super.import(user, createFuncionDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para modificar el elemento del conjunto.',
    type: UpdateFuncionDto,
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
  @Servicio('funcion', 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuncionDto: UpdateFuncionDto,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateFuncionDto);
  }

  @Patch('/elementos/multiples')
  @ApiOperation({ summary: 'Actualizar un grupo de elementos del conjunto.' })
  @ApiBody({
    description:
      'Estructura para modificar el grupo de elementos del conjunto.',
    type: [UpdateMultipleFuncionDto],
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
  @Servicio('funcion', 'updateMultiple')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() updateMultipleFuncioneDto: UpdateMultipleFuncionDto[],
  ): Promise<ResponseDto> {
    return await super.updateMultiple(user, updateMultipleFuncioneDto);
  }

  @Post('/filtrar')
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
  @Servicio('funcion', 'filter')
  async filter(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<any> {
    const data = await super.filter(page, limit, filtroGenericoDto);
    const header: string[] = [
      'id',
      'Nombre',
      'Descripcion',
      'EndPoints',
      'Menu',
    ];
    return new ListadoDto(header, data);
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
  @Servicio('funcion', 'search')
  async search(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(page, limit, buscarDto);
    const header: string[] = [
      'id',
      'Nombre',
      'Descripcion',
      'EndPoints',
      'Menu',
    ];
    return new ListadoDto(header, data);
  }
}
