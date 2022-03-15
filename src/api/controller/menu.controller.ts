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
import { GenericController } from './generic.controller';
import { MenuEntity, UserEntity } from '../../persistence/entity';
import { MenuService } from '../../core/service';
import { RolType } from '../../shared/enum';
import { GetUser, Roles, Servicio } from '../decorator';
import {
  BadRequestDto,
  BuscarDto,
  CreateMenuDto,
  FiltroGenericoDto,
  ListadoDto,
  ReadMenuDto,
  ResponseDto,
  UpdateMenuDto,
  UpdateMultipleMenuDto,
} from '../../shared/dto';

@ApiTags('Menus')
@Controller('menu')
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
export class MenuController extends GenericController<MenuEntity> {
  constructor(
    protected menuService: MenuService,
    protected configService: ConfigService,
  ) {
    super(menuService, configService, 'menu');
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
  @Servicio('menu', 'findAll')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<any> {
    const data = await super.findAll(page, limit);
    const header: string[] = ['id', 'Label', 'Icon', 'To', 'Dimension', 'Menu'];
    return new ListadoDto(header, data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un elemento del conjunto' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un elemento del conjunto',
    type: ReadMenuDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('menu', 'findById')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadMenuDto> {
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
    type: [ReadMenuDto],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elementos del conjunto no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('menu', 'findByIds')
  async findByIds(@Body() ids: number[]): Promise<ReadMenuDto[]> {
    return await super.findByIds(ids);
  }

  @Post('/')
  @ApiOperation({ summary: 'Crear un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el elemento del conjunto.',
    type: CreateMenuDto,
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
  @Servicio('menu', 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<ResponseDto> {
    return await super.create(user, createMenuDto);
  }

  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateMenuDto],
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
  @Servicio('menu', 'createMultiple')
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createMenuDto: CreateMenuDto[],
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createMenuDto);
  }

  @Post('/importar/elementos')
  @ApiOperation({ summary: 'Importar un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateMenuDto],
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
  @Servicio('menu', 'import')
  async import(
    @GetUser() user: UserEntity,
    @Body() createMenuDto: CreateMenuDto[],
  ): Promise<ResponseDto[]> {
    return await super.import(user, createMenuDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para modificar el elemento del conjunto.',
    type: UpdateMenuDto,
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
  @Servicio('menu', 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateMenuDto);
  }

  @Patch('/elementos/multiples')
  @ApiOperation({ summary: 'Actualizar un grupo de elementos del conjunto.' })
  @ApiBody({
    description:
      'Estructura para modificar el grupo de elementos del conjunto.',
    type: [UpdateMultipleMenuDto],
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
  @Servicio('menu', 'updateMultiple')
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() updateMultipleMenueDto: UpdateMultipleMenuDto[],
  ): Promise<ResponseDto> {
    return await super.updateMultiple(user, updateMultipleMenueDto);
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
  @Servicio('menu', 'filter')
  async filter(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<any> {
    const data = await super.filter(page, limit, filtroGenericoDto);
    const header: string[] = ['id', 'Label', 'Icon', 'To', 'Dimension', 'Menu'];
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
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio('menu', 'search')
  async search(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(page, limit, buscarDto);
    const header: string[] = ['id', 'Label', 'Icon', 'To', 'Dimension', 'Menu'];
    return new ListadoDto(header, data);
  }
}
