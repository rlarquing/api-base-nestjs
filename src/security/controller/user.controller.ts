import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from '../decorator';
import {Roles} from '../decorator';
import {RolGuard} from '../guard/rol.guard';
import {ReadUserDto, UpdateUserDto, UserDto} from '../dto';
import {UserEntity} from '../entity';
import {UserService} from '../service';
import {RolType} from "../enum/rol-type.enum";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";
import {ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ListadoDto, ResponseDto} from "../../shared/dto";

@ApiTags('Users')
@Controller('user')
@Roles(RolType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RolGuard)
@ApiBearerAuth()
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService
    ) {
    }

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
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<ListadoDto> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        const data = await this.userService.findAll({
            page,
            limit,
            route: url+':'+port+'/user',
        });
        const header: string[] = ['id', 'Nombre', 'Email','Roles'];
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
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
        return await this.userService.findById(id);

    }

    @Post()
    @ApiOperation({ summary: 'Crear un usuario' })
    @ApiBody({
        description: 'Estructura para crear el usuario.',
        type: UserDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Crea un usuario',
        type: ResponseDto,
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async create(@GetUser() user: UserEntity, @Body() userDto: UserDto): Promise<ResponseDto> {
        return await this.userService.create(user, userDto);
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
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async update(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<ResponseDto> {
        return await this.userService.update(user, id, updateUserDto);

    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Elimina un usuario',
        type: ResponseDto
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async delete(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<ResponseDto> {
        return await this.userService.delete(user, id);
    }

}
