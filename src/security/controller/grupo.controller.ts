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
import {
  CreateGrupoDto,
  ReadGrupoDto,
  UpdateMultipleGrupoDto,
  UpdateGrupoDto,
} from '../dto';
import {GrupoService} from '../service';
import { GetUser, Roles } from '../decorator';
import { RolType } from '../enum/rol-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolGuard } from '../guard/rol.guard';
import { GrupoEntity, UserEntity } from '../entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GenericController } from '../../shared/controller';
import {
  BadRequestDto,
  BuscarDto,
  FiltroGenericoDto,
  ListadoDto,
  ResponseDto,
} from '../../shared/dto';
import { ConfigService } from '@atlasjs/config';

@ApiTags('Grupos')
@Controller('grupo')
@UseGuards(AuthGuard('jwt'), RolGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
export class GrupoController extends GenericController<GrupoEntity> {
  constructor(
    protected grupoService: GrupoService,
    protected configService: ConfigService,
  ) {
    super(grupoService, configService, 'rol');
  }

  @Get()
  @Roles(RolType.ADMINISTRADOR) //El decorador Grupos no funciona arriba en la cabeza del controlador.
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
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    const data = await super.findAll(page, limit);
    const header: string[] = ['id', 'Nombre', 'Descripción'];
    return new ListadoDto(header, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un elemento del conjunto' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un elemento del conjunto',
    type: ReadGrupoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadGrupoDto> {
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
    type: [ReadGrupoDto],
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Elementos del conjunto no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findByIds(@Body() ids: number[]): Promise<ReadGrupoDto[]> {
    return await super.findByIds(ids);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el elemento del conjunto.',
    type: CreateGrupoDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un elemento del conjunto.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  async create(
    @GetUser() user: UserEntity,
    @Body() createGrupoDto: CreateGrupoDto,
  ): Promise<ResponseDto> {
    return await super.create(user, createGrupoDto);
  }

  @Post('/multiple')
  @ApiOperation({ summary: 'Crear un grupo de elementos del conjunto.' })
  @ApiBody({
    description: 'Estructura para crear el grupo de elementos del conjunto.',
    type: [CreateGrupoDto],
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un grupo de elementos del conjunto.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  async createMultiple(
    @GetUser() user: UserEntity,
    @Body() createGrupoDto: CreateGrupoDto[],
  ): Promise<ResponseDto[]> {
    return await super.createMultiple(user, createGrupoDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un elemento del conjunto.' })
  @ApiBody({
    description: 'Estructura para modificar el elemento del conjunto.',
    type: UpdateGrupoDto,
  })
  @ApiResponse({
    status: 201,
    description: 'El elemento se ha actualizado.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrupoDto: UpdateGrupoDto,
  ): Promise<ResponseDto> {
    return await super.update(user, id, updateGrupoDto);
  }

  @Patch('/elementos/multiples')
  @ApiOperation({ summary: 'Actualizar un grupo de elementos del conjunto.' })
  @ApiBody({
    description:
      'Estructura para modificar el grupo de elementos del conjunto.',
    type: [UpdateMultipleGrupoDto],
  })
  @ApiResponse({
    status: 201,
    description: 'El grupo de elementos se han actualizado.',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({
    status: 400,
    description: 'Solicitud con errores.',
    type: BadRequestDto,
  })
  async updateMultiple(
    @GetUser() user: UserEntity,
    @Body() updateMultipleGrupoDto: UpdateMultipleGrupoDto[],
  ): Promise<ResponseDto> {
    return await super.updateMultiple(user, updateMultipleGrupoDto);
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
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async filter(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<any> {
    const data = await super.filter(page, limit, filtroGenericoDto);
    const header: string[] = ['id', 'Nombre', 'Descripción'];
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
    type: BuscarDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async search(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body() buscarDto: BuscarDto,
  ): Promise<any> {
    const data = await super.search(page, limit, buscarDto);
    const header: string[] = ['id', 'Nombre', 'Descripción'];
    return new ListadoDto(header, data);
  }
}
