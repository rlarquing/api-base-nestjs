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
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from '../decorator';
import {Roles} from '../decorator';
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
import {ConfigService} from '@nestjs/config';
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
import {AppConfig} from '../../app.keys';
import {UserEntity} from '../../persistence/entity';

@ApiTags('Users')
@Controller('user')
@Roles(RolType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
@ApiBearerAuth()
export class UserController {
    constructor(
        protected userService: UserService,
        protected configService: ConfigService,
    ) {
    }

    @Get('/')
    @Roles(RolType.ADMINISTRADOR)
    @ApiOperation({summary: 'Obtener el listado de los usuarios'})
    @ApiResponse({
        status: 200,
        description: 'Listado de los usuarios',
        type: ListadoDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Usuarios no encontrados.',
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @ApiQuery({required: false, name: 'page', example: '1'})
    @ApiQuery({required: false, name: 'limit', example: '10'})
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ): Promise<ListadoDto> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.get(AppConfig.URL);
        const data = await this.userService.findAll({
            page,
            limit,
            route: url + '/user',
        });
        const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Funciones'];
        const key: string[] = ['id', 'username', 'email', 'roles', 'funcions'];
        return new ListadoDto(header, key, data);
    }

    @Get('/:id')
    @ApiOperation({summary: 'Obtener un usuario'})
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de un usuario',
        type: ReadUserDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Usuario no encontrado.',
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
        return await this.userService.findById(id);
    }

    @Post('/')
    @Roles(RolType.ADMINISTRADOR)
    @ApiOperation({summary: 'Crear un usuario'})
    @ApiBody({
        description: 'Estructura para crear el usuario.',
        type: CreateUserDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Crea un usuario',
        type: ResponseDto,
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    async create(
        @GetUser() user: UserEntity,
        @Body() createUserDto: CreateUserDto,
    ): Promise<ResponseDto> {
        return await this.userService.create(user, createUserDto);
    }

    @Patch('/:id')
    @Roles(RolType.ADMINISTRADOR)
    @ApiOperation({summary: 'Actualizar un usuario'})
    @ApiBody({
        description: 'Estructura para modificar el usuario.',
        type: UpdateUserDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Actualiza un usuario',
        type: ResponseDto,
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    async update(
        @GetUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<ResponseDto> {
        return await this.userService.update(user, id, updateUserDto);
    }

    @Delete('/:id')
    @Roles(RolType.ADMINISTRADOR)
    @ApiOperation({summary: 'Eliminar un usuario'})
    @ApiResponse({
        status: 200,
        description: 'Elimina un usuario',
        type: ResponseDto,
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    async delete(
        @GetUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ResponseDto> {
        return await this.userService.delete(user, id);
    }

    @Delete('/elementos/multiples')
    @Roles(RolType.ADMINISTRADOR)
    @ApiOperation({summary: 'Eliminar un grupo de usuarios.'})
    @ApiBody({
        description: 'Estructura para eliminar el grupo de usuarios.',
        type: [Number],
    })
    @ApiResponse({status: 201, description: 'El elemento se ha eliminado.'})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    async deleteMultiple(
        @GetUser() user: UserEntity,
        @Body() ids: number[],
    ): Promise<ResponseDto> {
        return await this.userService.deleteMultiple(user, ids);
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
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @ApiQuery({required: false, name: 'page', example: '1'})
    @ApiQuery({required: false, name: 'limit', example: '10'})
    async filter(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Body() filtroGenericoDto: FiltroGenericoDto,
    ): Promise<ListadoDto> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.get(AppConfig.URL);
        const data = await this.userService.filter(
            {
                page,
                limit,
                route: url + '/user',
            },
            filtroGenericoDto,
        );
        const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Funciones'];
        const key: string[] = ['id', 'username', 'email', 'roles', 'funcions'];
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
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    @ApiQuery({required: false, name: 'page', example: '1'})
    @ApiQuery({required: false, name: 'limit', example: '10'})
    async search(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Body() buscarDto: BuscarDto,
    ): Promise<ListadoDto> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.get(AppConfig.URL);
        const data = await this.userService.search(
            {
                page,
                limit,
                route: url + '/user',
            },
            buscarDto,
        );
        const header: string[] = ['id', 'Nombre', 'Email', 'Roles', 'Funciones'];
        const key: string[] = ['id', 'username', 'email', 'rol', 'funcion'];
        return new ListadoDto(header, key, data);
    }

    @Patch('/:id/change/password')
    @Roles(RolType.ADMINISTRADOR)
    @ApiOperation({summary: 'Cambiar password a un usuario'})
    @ApiBody({
        description: 'Estructura para cambiar el password del usuario.',
        type: ChangePasswordDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Cambia el password de un usuario',
        type: ResponseDto,
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    async changePassword(
        @GetUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<ResponseDto> {
        return await this.userService.changePassword(user, id, changePasswordDto);
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
        status: 404,
        description: 'Elemento del conjunto no encontrado.',
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 403, description: 'Sin autorizacion al recurso.'})
    @ApiResponse({status: 500, description: 'Error interno del servidor.'})
    async createSelect(): Promise<SelectDto[]> {
        return await this.userService.createSelect();
    }
}
