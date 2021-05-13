import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CreateRoleDto, ReadRoleDto, UpdateRoleDto} from '../dto';
import {RoleService} from '../service';
import {Roles} from "../decorator";
import {RoleType} from "../enum/roletype.enum";
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../guards/role.guard";
import {GetUser} from "../decorator";
import {UserEntity} from "../entity";
import {Pagination} from "nestjs-typeorm-paginate";
import {ConfigService} from "@atlasjs/config";
import {AppConfig} from "../../app.keys";
import {ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Roles')
@Controller('roles')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard(), RoleGuard)
@ApiBearerAuth()
export class RoleController {
    constructor(
        private roleService: RoleService,
        private configService: ConfigService
    ) {
    }

    @Get()
    @ApiOperation({ summary: 'Obtener el listado de roles' })
    @ApiResponse({
        status: 200,
        description: 'Listado de roles',
        type: ReadRoleDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Roles no encontrados.',
    })
    async getAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Pagination<ReadRoleDto>> {
        limit = limit > 100 ? 100 : limit;
        const url = this.configService.config[AppConfig.URL];
        const port= this.configService.config[AppConfig.PORT];
        return await this.roleService.getAll({
            page,
            limit,
            route: url+':'+port+'/roles',
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un rol' })
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de un rol',
        type: ReadRoleDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Rol no encontrado.',
    })
    get(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return this.roleService.get(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear un rol' })
    @ApiResponse({
        status: 201,
        description: 'Crea un rol',
        type: ReadRoleDto,
    })
    async create(@GetUser() user: UserEntity, @Body() createRoleDto: CreateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.create(user, createRoleDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un rol' })
    @ApiResponse({
        status: 200,
        description: 'Actualiza un rol',
        type: ReadRoleDto,
    })
    async update(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() rol: UpdateRoleDto): Promise<ReadRoleDto> {
        return await this.roleService.update(user, id, rol);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un rol' })
    @ApiResponse({
        status: 200,
        description: 'Elimina de un rol',
    })
    async delete(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.roleService.delete(user, id);

    }
}