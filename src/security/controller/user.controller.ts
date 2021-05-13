import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from '../decorator';
import {Roles} from '../decorator';
import {RoleGuard} from '../guards/role.guard';
import {ReadUserDto, UpdateUserDto, UserDto} from '../dto';
import {UserEntity} from '../entity';
import {UserService} from '../service';
import {RoleType} from "../enum/roletype.enum";
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";
import {ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard(), RoleGuard)
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
        type: ReadUserDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Usuarios no encontrados.',
    })
    async getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<ReadUserDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        return await this.userService.getAll({
            page,
            limit,
            route: url+':'+port+'/users',
        });
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
    async get(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
        return await this.userService.get(id);

    }

    @Post()
    @ApiOperation({ summary: 'Crear un usuario' })
    @ApiResponse({
        status: 201,
        description: 'Crea un usuario',
        type: ReadUserDto,
    })
    async create(@GetUser() user: UserEntity, @Body() userDto: UserDto): Promise<ReadUserDto> {
        return await this.userService.create(user, userDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Actualiza un usuario',
        type: ReadUserDto,
    })
    async update(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
        return await this.userService.update(user, id, updateUserDto);

    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Elimina de un usuario',
    })
    delete(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.delete(user, id);

    }

}
