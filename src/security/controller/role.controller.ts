import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {CreateRoleDto, ReadRoleDto, UpdateMultipleRoleDto, UpdateRoleDto} from '../dto';
import {RoleService} from '../service';
import {GetUser, Roles} from "../decorator";
import {RoleType} from "../enum/roletype.enum";
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../guard/role.guard";
import {RoleEntity, UserEntity} from "../entity";
import {ConfigService} from "@atlasjs/config";
import {
    ApiBearerAuth, ApiBody,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {GenericController} from "../../shared/controller";
import {IController} from "../../shared/interface";
import {ListadoDto, ResponseDto} from "../../shared/dto";

@ApiTags('Roles')
@Controller('roles')
@Roles(RoleType.ADMINISTRADOR)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiBearerAuth()
export class RoleController extends GenericController<RoleEntity> implements IController<RoleEntity> {
    constructor(
        protected roleService: RoleService,
        protected configService: ConfigService
    ) {
        super(roleService, configService, 'roles');
    }

    @Get()
    @ApiOperation({summary: 'Obtener el listado de elementos del conjunto'})
    @ApiResponse({
        status: 200,
        description: 'Listado de elementos del conjunto',
        type: ListadoDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Elementos del conjunto no encontrados.',
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10): Promise<any> {
        const data = await super.findAll(page, limit);
        const header: string[] = ['id', 'Nombre', 'Descripción'];
        const listado: ListadoDto = new ListadoDto(header, data);
        return listado;
    }

    @Get(':id')
    @ApiOperation({summary: 'Obtener un elemento del conjunto'})
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de un elemento del conjunto',
        type: ReadRoleDto,
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Elemento del conjunto no encontrado.',
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findById(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return await super.findById(id);
    }

    @Get('/elementos/multiples')
    @ApiOperation({summary: 'Obtener multiples elementos del conjunto'})
    @ApiBody({
        description: 'Estructura para mostrar los multiples elementos del conjunto.',
        type: [Number],
    })
    @ApiResponse({
        status: 200,
        description: 'Muestra la información de multiples elementos del conjunto',
        type: [ReadRoleDto],
    })
    @ApiNotFoundResponse({
        status: 404,
        description: 'Elementos del conjunto no encontrados.',
    })
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async findByIds(@Body() ids: number[]): Promise<ReadRoleDto[]> {
        return await super.findByIds(ids);
    }

    @Post()
    @ApiOperation({summary: 'Crear un elemento del conjunto.'})
    @ApiBody({
        description: 'Estructura para crear el elemento del conjunto.',
        type: CreateRoleDto,
    })
    @ApiResponse({status: 201, description: 'Crea un elemento del conjunto.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async create(@GetUser() user: UserEntity, @Body() createRoleDto: CreateRoleDto): Promise<ResponseDto> {
        return await super.create(user, createRoleDto);
    }

    @Post('/multiple')
    @ApiOperation({summary: 'Crear un grupo de elementos del conjunto.'})
    @ApiBody({
        description: 'Estructura para crear el grupo de elementos del conjunto.',
        type: [CreateRoleDto],
    })
    @ApiResponse({status: 201, description: 'Crea un grupo de elementos del conjunto.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async createMultiple(@GetUser() user: UserEntity, @Body() createRoleDto: CreateRoleDto[]): Promise<ResponseDto> {
        return await super.createMultiple(user, createRoleDto);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Actualizar un elemento del conjunto.'})
    @ApiBody({
        description: 'Estructura para modificar el elemento del conjunto.',
        type: UpdateRoleDto,
    })
    @ApiResponse({status: 201, description: 'El elemento se ha actualizado.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async update(@GetUser() user: UserEntity, @Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<ResponseDto> {
        return await super.update(user, id, updateRoleDto);
    }

    @Patch('/elementos/multiples')
    @ApiOperation({summary: 'Actualizar un grupo de elementos del conjunto.'})
    @ApiBody({
        description: 'Estructura para modificar el grupo de elementos del conjunto.',
        type: [UpdateMultipleRoleDto],
    })
    @ApiResponse({status: 201, description: 'El grupo de elementos se han actualizado.', type: ResponseDto})
    @ApiResponse({status: 401, description: 'Sin autorizacion.'})
    @ApiResponse({status: 500, description: 'Error interno del servicor.'})
    async updateMultiple(@GetUser() user: UserEntity, @Body() updateMultipleRoleDto: UpdateMultipleRoleDto[]): Promise<ResponseDto> {
        return await super.updateMultiple(user, updateMultipleRoleDto);
    }
}