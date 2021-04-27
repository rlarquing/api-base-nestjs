import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from './../decorator/get-user.decorator';
import {Roles} from './../decorator/role.decorator';
import {RoleGuard} from './../guards/role.guard';
import {ReadUserDto, UpdateUserDto, UserDto} from './../dto';
import {UserEntity} from './../entity/user.entity';
import {UserService} from './../service/user.service';
import {RoleType} from "../enum/roletype.enum";
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";
import {ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('users')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard(), RoleGuard)
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
        description: 'Not found. usuarios no encontrados.',
    })
    getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<ReadUserDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        return this.userService.getAll({
            page,
            limit,
            route: url+':'+port+'/users',
        });
    }

    @ApiOperation({ summary: 'Obtener un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de un usuario',
        type: ReadUserDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Not found. Usuario no encontrado.',
    })
    @Get(':id')
    async get(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
        return await this.userService.get(id);

    }

    @ApiOperation({ summary: 'Crear un usuario' })
    @ApiResponse({
        status: 201,
        description: 'Crea un usuario',
        type: ReadUserDto,
    })
    @Post()
    @Post()
    async create(@GetUser() user: UserEntity, @Body() userDto: UserDto): Promise<ReadUserDto> {
        return await this.userService.create(user, userDto);
    }

    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Actualiza un usuario',
        type: ReadUserDto,
    })
    @Patch(':id')
    async update(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<ReadUserDto> {
        return await this.userService.update(user, id, updateUserDto);

    }

    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiResponse({
        status: 200,
        description: 'Elimina de un usuario',
    })
    @Delete(':id')
    delete(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.delete(user, id);

    }

}
