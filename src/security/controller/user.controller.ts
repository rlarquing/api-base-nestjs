import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Servicio } from '../decorator';
import { Roles } from '../decorator';
import {
  ReadUserDto,
  UpdateUserDto,
  CreateUserDto,
  ChangePasswordDto,
} from '../dto';
import { UserEntity } from '../entity';
import { UserService } from '../service';
import { RolType } from '../enum/rol-type.enum';
import { AppConfig } from '../../app.keys';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BuscarDto,
  FiltroGenericoDto,
  ListadoDto,
  ResponseDto,
} from '../../shared/dto';
import { PermissionGuard, RolGuard } from '../guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('Users')
@Controller('user')
@Roles(RolType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    protected userService: UserService,
    protected configService: ConfigService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Obtener el listado de los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Listado de los usuarios',
    type: ListadoDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Usuarios no encontrados.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiParam({ required: false, name: 'page', example: '1' })
  @ApiParam({ required: false, name: 'limit', example: '10' })
  @Servicio(UserController.name, 'findAll')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<ListadoDto> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    const port = this.configService.get(AppConfig.PORT);
    const data = await this.userService.findAll({
      page,
      limit,
      route: url + ':' + port + '/user',
    });
    const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Permisos'];
    return new ListadoDto(header, data);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Muestra la información de un usuario',
    type: ReadUserDto,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(UserController.name, 'findById')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    return await this.userService.findById(id);
  }
  @Post()
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
  @Servicio(UserController.name, 'create')
  async create(
    @GetUser() user: UserEntity,
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto> {
    return await this.userService.create(user, createUserDto);
  }
  @Patch(':id')
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
  @Servicio(UserController.name, 'update')
  async update(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    return await this.userService.update(user, id, updateUserDto);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Elimina un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(UserController.name, 'delete')
  async delete(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto> {
    return await this.userService.delete(user, id);
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
  @Servicio(UserController.name, 'filter')
  async filter(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() filtroGenericoDto: FiltroGenericoDto,
  ): Promise<ListadoDto> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    const port = this.configService.get(AppConfig.PORT);
    const data = await this.userService.filter(
      {
        page,
        limit,
        route: url + ':' + port + '/user',
      },
      filtroGenericoDto,
    );
    const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Permisos'];
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
    description: 'Estructura para crear la búsqueda.',
    type: BuscarDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(UserController.name, 'search')
  async search(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Body() buscarDto: BuscarDto,
  ): Promise<ListadoDto> {
    limit = limit > 100 ? 100 : limit;
    const url = this.configService.get(AppConfig.URL);
    const port = this.configService.get(AppConfig.PORT);
    const data = await this.userService.search(
      {
        page,
        limit,
        route: url + ':' + port + '/user',
      },
      buscarDto,
    );
    const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Permisos'];
    return new ListadoDto(header, data);
  }

  @Patch(':id/change/password')
  @ApiOperation({ summary: 'Cambiar password a un usuario' })
  @ApiBody({
    description: 'Estructura para camviar el password del usuario.',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cambia el password de un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @Servicio(UserController.name, 'changePassword')
  async changePassword(
    @GetUser() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto> {
    return await this.userService.changePassword(user, id, changePasswordDto);
  }
}
