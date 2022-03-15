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
import { GetUser, Roles, Servicio } from '../decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolGuard } from '../guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard } from '../guard';
import { ConfigService } from '@nestjs/config';
import { GenericController } from './generic.controller';
import { RolEntity, UserEntity } from '../../persistence/entity';
import { RolService } from '../../core/service';
import { RolType } from '../../shared/enum';
import {
  BadRequestDto,
  BuscarDto,
  CreateRolDto,
  FiltroGenericoDto,
  ListadoDto,
  ReadRolDto,
  ResponseDto,
  UpdateMultipleRolDto,
  UpdateRolDto,
} from '../../shared/dto';

@ApiTags('Roles')
@Controller('rol')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
export class RolController extends GenericController<RolEntity> {
  constructor(
    protected rolService: RolService,
    protected configService: ConfigService,
  ) {
    super(rolService, configService, 'rol');
  }

  @Get('/')
  @Roles(RolType.ADMINISTRADOR) //El decorador Roles no funciona arriba en la cabeza del controlador.
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
  @Servicio('rol', 'findAll')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    const data = await super.findAll(page, limit);
    const header: string[] = ['id', 'Nombre', 'Descripción'];
    return new ListadoDto(header, data);
  }
  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un elemento del conjunto' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un elemento del conjunto',
    type: ReadRolDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('rol', 'findById')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadRolDto> {
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
    type: [ReadRolDto],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elementos del conjunto no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('rol', 'findByIds')
  async findByIds(@Body() ids: number[]): Promise<ReadRolDto[]> {
    return await super.findByIds(ids);
  }
  @Post('/')
  @ApiOperation({ summary: 'Crear un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el elemento del conjunto.',
    type: CreateRolDto,
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
  @Servicio('rol', 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createRoleDto: CreateRolDto,
  ): Promise<ResponseDto> {
    return await super.create(user, createRoleDto);
  }
  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateRolDto],
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
  @Servicio('rol', 'createMultiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createRoleDto: CreateRolDto[],
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createRoleDto);
  }

  @Post('/importar/elementos')
  @ApiOperation({ summary: 'Importar un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateRolDto],
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
  @Servicio('rol', 'import')
  async import(
    @GetUser() user: UserEntity,
    @Body() createRoleDto: CreateRolDto[],
  ): Promise<ResponseDto[]> {
    return await super.import(user, createRoleDto);
  }
  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para modificar el elemento del conjunto.',
    type: UpdateRolDto,
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
  @Servicio('rol', 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRolDto,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateRoleDto);
  }
  @Patch('/elementos/multiples')
  @ApiOperation({ summary: 'Actualizar un grupo de elementos del conjunto.' })
  @ApiBody({
    description:
      'Estructura para modificar el grupo de elementos del conjunto.',
    type: [UpdateMultipleRolDto],
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
  @Servicio('rol', 'updateMultiple')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() updateMultipleRolDto: UpdateMultipleRolDto[],
  ): Promise<ResponseDto> {
    return await super.updateMultiple(user, updateMultipleRolDto);
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
  @ApiParam({ required: false, name: 'page', example: '1' })
  @ApiParam({ required: false, name: 'limit', example: '10' })
  @Servicio('rol', 'filter')
  async filter(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<any> {
    const data = await super.filter(page, limit, filtroGenericoDto);
    const header: string[] = ['id', 'Nombre', 'Descripción'];
    return new ListadoDto(header, data);
  }
  @Post('/buscar')
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
    type: BuscarDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiParam({ required: false, name: 'page', example: '1' })
  @ApiParam({ required: false, name: 'limit', example: '10' })
  @Servicio('rol', 'search')
  async search(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(page, limit, buscarDto);
    const header: string[] = ['id', 'Nombre', 'Descripción'];
    return new ListadoDto(header, data);
  }
}