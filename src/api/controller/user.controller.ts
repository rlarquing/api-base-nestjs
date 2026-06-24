import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import { GetUser, IpAddress, Roles, PaginationParams } from '../decorator';
import {
    ApiBearerAuth,
    ApiBody,
    ApiNotFoundResponse,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {PermissionGuard, RolGuard} from '../guard';
import {RolType} from '../../shared/enum';
import {UserService} from '../../core/service';
import {
    BuscarDto,
    ChangePasswordDto,
    CreateUserDto,
    FiltroGenericoDto,
    ListadoDto,
    ReadUserDto,
    ResponseDto, SelectDto,
    UpdateUserDto,
} from '../../shared/dto';
import {UserEntity} from '../../persistence/entity';
import { PaginationParamsDto, PaginationService } from '../../shared/pagination';

@ApiTags('Users')
@Controller('user')
@Roles(RolType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    protected userService: UserService,
    protected paginationService: PaginationService,
  ) {}

  @Get('/')
  @Roles(RolType.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener el listado de los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de los usuarios',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuarios no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  async findAll(
    @PaginationParams() params: PaginationParamsDto,
  ): Promise<ListadoDto> {
    const options = this.paginationService.buildOptions(
      params.page, params.limit, 'user',
    );
    const data = await this.userService.findAll(options);
    const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Funciones'];
    const key: string[] = ['id', 'userName', 'email', 'roles', 'funcions'];
    return new ListadoDto(header, key, data);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un usuario',
    type: ReadUserDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    return await this.userService.findById(id);
  }

  @Post('/')
  @Roles(RolType.ADMINISTRADOR)
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiBody({
    description: 'Estructura para crear el usuario.',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Crea un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(
    @GetUser() user: UserEntity,
    @Body() createUserDto: CreateUserDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await this.userService.create(user, createUserDto, ip);
  }

  @Patch('/:id')
  @Roles(RolType.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiBody({
    description: 'Estructura para modificar el usuario.',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Actualiza un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await this.userService.update(user, id, updateUserDto, ip);
  }

  @Delete('/:id')
  @Roles(RolType.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Elimina un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async delete(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await this.userService.delete(user, id, ip);
  }

  @Delete('/elementos/multiples')
  @Roles(RolType.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar un grupo de usuarios.' })
  @ApiBody({
    description: 'Estructura para eliminar el grupo de usuarios.',
    type: [Number],
  })
  @ApiResponse({ status: 201, description: 'El elemento se ha eliminado.' })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async deleteMultiple(
    @GetUser() user: UserEntity,
    @Body() ids: number[],
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await this.userService.deleteMultiple(user, ids, ip);
  }

  @Post('/filtrar')
  @Roles(RolType.ADMINISTRADOR)
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
  async filter(
    @PaginationParams() params: PaginationParamsDto,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<ListadoDto> {
    const options = this.paginationService.buildOptions(
      params.page, params.limit, 'user',
    );
    const data = await this.userService.filter(options, filtroGenericoDto);
    const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Funciones'];
    const key: string[] = ['id', 'userName', 'email', 'roles', 'funcions'];
    return new ListadoDto(header, key, data);
  }

  @Post('/buscar')
  @Roles(RolType.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Buscar en el conjunto por el parametro establecido',
  })
  @ApiResponse({
    status: 201,
    description: 'Busca en el conjunto en el parametros establecido',
    type: ListadoDto,
  })
  @ApiBody({
    description: 'Estructura para crear la búsqueda.',
    type: BuscarDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({ required: false, name: 'page', example: '1' })
  @ApiQuery({ required: false, name: 'limit', example: '10' })
  async search(
    @PaginationParams() params: PaginationParamsDto,
    @Body() buscarDto: BuscarDto,
  ): Promise<ListadoDto> {
    const options = this.paginationService.buildOptions(
      params.page, params.limit, 'user',
    );
    const data = await this.userService.search(options, buscarDto);
    const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Funciones'];
    const key: string[] = ['id', 'userName', 'email', 'rol', 'funcion'];
    return new ListadoDto(header, key, data);
  }

  @Patch('/:id/change/password')
  @Roles(RolType.ADMINISTRADOR)
  @ApiOperation({ summary: 'Cambiar password a un usuario' })
  @ApiBody({
    description: 'Estructura para cambiar el password del usuario.',
    type: ChangePasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cambia el password de un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async changePassword(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
    @IpAddress() ip: string,
  ): Promise<ResponseDto> {
    return await this.userService.changePassword(
      user,
      id,
      changePasswordDto,
      ip,
    );
  }

  @Get('/crear/select')
  @Roles(RolType.ADMINISTRADOR)
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
    description: 'Elemento del conjunto no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async createSelect(): Promise<SelectDto[]> {
    return await this.userService.createSelect();
  }
}
